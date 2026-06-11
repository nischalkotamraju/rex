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

export interface AnalyzeResponse {
  hasCommitments: boolean;
  commitments: Commitment[];
  suggestedDraft?: string;
  draftReason?: string;
}

export interface DraftResponse {
  draft: string;
}

export interface RexSettings {
  serverUrl: string;
  enabled: boolean;
  showBanner: boolean;
  showThreadCards: boolean;
  showDraftSuggestions: boolean;
}

export type MessageType =
  | 'ANALYZE_THREAD'
  | 'ANALYZE_INBOX'
  | 'GENERATE_DRAFT'
  | 'GET_SETTINGS'
  | 'SAVE_SETTINGS'
  | 'MARK_COMPLETE'
  | 'GET_ALL_COMMITMENTS';

export interface ChromeMessage {
  type: MessageType;
  payload?: unknown;
}
