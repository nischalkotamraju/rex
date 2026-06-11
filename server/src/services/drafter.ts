import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const DRAFT_PROMPT = `You are Rex, an AI assistant that drafts email replies for Gmail users.

You are writing a REPLY on behalf of the person who RECEIVED the email. The user received this email and needs to respond to it. Do NOT write from the sender's perspective.

Rules:
- Write as the RECIPIENT replying to the sender
- Keep it brief: 2-4 sentences maximum
- Sound natural and human
- Directly address what the sender asked or needs
- Match the tone of the original (casual if casual, formal if formal)
- No subject line
- Start with "Hi [sender's name],"
- End with "Best," or "Thanks," followed by your name on the next line
- Do NOT use em dashes (use commas or periods instead)
- Do NOT use hyphens as dashes
- Do NOT add placeholder text like [Your Name]`;

export async function generateDraft(context: {
  emailContent: string;
  commitmentSummary: string;
  senderName: string;
  userName: string;
}): Promise<string> {
  const signOff = context.userName ? `\n${context.userName}` : '';
  const prompt = `${DRAFT_PROMPT}${context.userName ? `\n- Sign off as: ${context.userName}` : ''}

Email you received (from ${context.senderName}):
${context.emailContent}

Key points to address in your reply:
${context.commitmentSummary}

Write the reply now (end with "Thanks," or "Best," then "${context.userName || '[Your Name]'}" on next line):`;
  void signOff;

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 512,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text.trim();
}
