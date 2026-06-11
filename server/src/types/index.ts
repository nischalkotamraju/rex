export type CommitmentType =
  | 'promise'
  | 'deadline'
  | 'follow-up'
  | 'meeting'
  | 'action-item'
  | 'unanswered';

export type UrgencyLevel = 'high' | 'medium' | 'low';

export interface Commitment {
  id: string;
  type: CommitmentType;
  summary: string;
  detail: string;
  quotedText?: string;
  sender: string;
  senderEmail: string;
  dueDate?: string;
  dueText: string;
  urgency: UrgencyLevel;
  threadId: string;
  messageId: string;
  createdAt: string;
  completed: boolean;
}

export interface EmailContent {
  threadId: string;
  messageId: string;
  subject: string;
  sender: string;
  senderEmail: string;
  body: string;
  date: string;
  isReply: boolean;
}

export interface InboxEmailSnippet {
  threadId: string;
  sender: string;
  senderEmail: string;
  subject: string;
  snippet: string;
  date: string;
}

export interface AnalysisResult {
  hasCommitments: boolean;
  commitments: Commitment[];
  suggestedDraft?: string;
  draftReason?: string;
}
