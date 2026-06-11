import Anthropic from '@anthropic-ai/sdk';
import { v4 as uuidv4 } from 'uuid';
import type { Commitment, EmailContent, InboxEmailSnippet, AnalysisResult, CommitmentType, UrgencyLevel } from '../types/index.js';

const client = new Anthropic();

const THREAD_ANALYSIS_PROMPT = `You are Rex, an AI that analyzes emails to detect commitments, deadlines, and action items.

Analyze the following email and extract any commitments. A commitment is one of:
- **promise**: The user (or sender) has promised to do something ("I'll send this", "I will get back to you")
- **deadline**: Something is due by a specific time ("by Thursday", "before end of month")
- **follow-up**: This thread needs a follow-up response
- **meeting**: A meeting has been proposed or scheduled
- **action-item**: A clear task that needs to be done
- **unanswered**: An important question or request that hasn't been answered

IMPORTANT RULES:
- Only extract REAL commitments, not casual mentions
- Promotional emails, newsletters, spam, and purely informational emails should return hasCommitments: false
- Be conservative — it's better to miss a minor commitment than to flag junk as important
- If an email is just friendly ("How are you?") or informational, return hasCommitments: false
- Focus on actionable commitments with clear ownership and timing

Return a JSON object with this exact structure:
{
  "hasCommitments": boolean,
  "commitments": [
    {
      "type": "promise" | "deadline" | "follow-up" | "meeting" | "action-item" | "unanswered",
      "summary": "Short summary (max 8 words)",
      "detail": "Full detail of the commitment",
      "quotedText": "The exact verbatim phrase from the email body that this commitment refers to (must be a substring of the email body, max 60 chars)",
      "dueText": "Human-readable due time (e.g., 'Due tomorrow', 'No reply · 3 days', 'Due Friday')",
      "urgency": "high" | "medium" | "low",
      "dueDate": "ISO date string if determinable, otherwise null"
    }
  ],
  "needsDraftReply": boolean,
  "draftReason": "Why a draft reply would help (or null)"
}`;

const INBOX_ANALYSIS_PROMPT = `You are Rex, an AI that analyzes email inbox summaries to find important commitments and follow-ups.

You will receive a list of recent emails (sender, subject, snippet). Your job is to identify which emails contain important commitments, deadlines, or required actions.

IMPORTANT RULES:
- Skip promotional emails, newsletters, automated notifications, and spam
- Skip casual/social emails unless they contain a clear commitment
- Only flag emails that genuinely require action or have time-sensitive commitments
- Be selective — only surface the most important items

For each commitment found, return:
{
  "hasCommitments": boolean,
  "commitments": [
    {
      "type": "promise" | "deadline" | "follow-up" | "meeting" | "action-item" | "unanswered",
      "summary": "Short actionable summary (max 8 words)",
      "detail": "What exactly needs to happen",
      "sender": "Name of the sender",
      "senderEmail": "email@example.com",
      "dueText": "e.g., 'Due tomorrow', 'No reply · 6 days', 'Awaiting your reply'",
      "urgency": "high" | "medium" | "low",
      "threadId": "the threadId from the input",
      "dueDate": "ISO date if determinable, otherwise null"
    }
  ]
}`;

export async function analyzeThread(email: EmailContent): Promise<AnalysisResult> {
  const prompt = `${THREAD_ANALYSIS_PROMPT}

Email details:
Subject: ${email.subject}
From: ${email.sender} <${email.senderEmail}>
Date: ${email.date}
Is Reply Thread: ${email.isReply}

Body:
${email.body}

Today's date: ${new Date().toISOString().split('T')[0]}

Analyze this email and return the JSON response:`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  let parsed: {
    hasCommitments: boolean;
    commitments: Array<{
      type: CommitmentType;
      summary: string;
      detail: string;
      quotedText?: string;
      dueText: string;
      urgency: UrgencyLevel;
      dueDate?: string;
    }>;
    needsDraftReply?: boolean;
    draftReason?: string;
  };

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) as typeof parsed : { hasCommitments: false, commitments: [] };
  } catch {
    return { hasCommitments: false, commitments: [] };
  }

  if (!parsed.hasCommitments || !parsed.commitments?.length) {
    return { hasCommitments: false, commitments: [] };
  }

  const commitments: Commitment[] = parsed.commitments.map(c => ({
    id: uuidv4(),
    type: c.type,
    summary: c.summary,
    detail: c.detail,
    quotedText: c.quotedText,
    sender: email.sender,
    senderEmail: email.senderEmail,
    dueText: c.dueText,
    dueDate: c.dueDate,
    urgency: c.urgency,
    threadId: email.threadId,
    messageId: email.messageId,
    createdAt: new Date().toISOString(),
    completed: false,
  }));

  return {
    hasCommitments: true,
    commitments,
    draftReason: parsed.draftReason,
  };
}

export async function analyzeInbox(emails: InboxEmailSnippet[]): Promise<AnalysisResult> {
  const emailList = emails.map((e, i) =>
    `[${i + 1}] From: ${e.sender} <${e.senderEmail}>\nSubject: ${e.subject}\nDate: ${e.date}\nSnippet: ${e.snippet}\nThreadId: ${e.threadId}`
  ).join('\n\n---\n\n');

  const prompt = `${INBOX_ANALYSIS_PROMPT}

Today's date: ${new Date().toISOString().split('T')[0]}

Emails to analyze:
${emailList}

Return the JSON response:`;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2048,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  let parsed: {
    hasCommitments: boolean;
    commitments: Array<{
      type: CommitmentType;
      summary: string;
      detail: string;
      sender: string;
      senderEmail: string;
      dueText: string;
      urgency: UrgencyLevel;
      threadId: string;
      dueDate?: string;
    }>;
  };

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) as typeof parsed : { hasCommitments: false, commitments: [] };
  } catch {
    return { hasCommitments: false, commitments: [] };
  }

  if (!parsed.hasCommitments || !parsed.commitments?.length) {
    return { hasCommitments: false, commitments: [] };
  }

  const commitments: Commitment[] = parsed.commitments.map(c => ({
    id: uuidv4(),
    type: c.type,
    summary: c.summary,
    detail: c.detail,
    sender: c.sender,
    senderEmail: c.senderEmail,
    dueText: c.dueText,
    dueDate: c.dueDate,
    urgency: c.urgency,
    threadId: c.threadId,
    messageId: c.threadId,
    createdAt: new Date().toISOString(),
    completed: false,
  }));

  return { hasCommitments: true, commitments };
}
