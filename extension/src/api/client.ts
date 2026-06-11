import type { AnalyzeResponse, DraftResponse, EmailContent, InboxEmailSnippet } from '../types';

async function getAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get('rexAccessToken', (result) => {
      resolve((result['rexAccessToken'] as string) ?? null);
    });
  });
}

export class RexApiClient {
  private serverUrl: string;

  constructor(serverUrl: string = __SERVER_URL__) {
    this.serverUrl = serverUrl;
  }

  private async authHeaders(): Promise<Record<string, string>> {
    const token = await getAccessToken();
    if (!token) throw new AuthRequiredError();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = await this.authHeaders();
    const res = await fetch(`${this.serverUrl}${path}`, { ...init, headers });
    if (res.status === 401) throw new AuthRequiredError();
    if (!res.ok) throw new Error(`Rex API error: ${res.status}`);
    return res.json() as Promise<T>;
  }

  async analyzeThread(email: EmailContent): Promise<AnalyzeResponse> {
    return this.request('/api/analyze/thread', {
      method: 'POST',
      body: JSON.stringify(email),
    });
  }

  async analyzeInbox(emails: InboxEmailSnippet[]): Promise<AnalyzeResponse> {
    return this.request('/api/analyze/inbox', {
      method: 'POST',
      body: JSON.stringify({ emails }),
    });
  }

  async generateDraft(context: {
    emailContent: string;
    commitmentSummary: string;
    senderName: string;
    userName?: string;
  }): Promise<DraftResponse> {
    return this.request('/api/draft', {
      method: 'POST',
      body: JSON.stringify(context),
    });
  }

  async getAllCommitments(): Promise<{ commitments: import('../types').Commitment[] }> {
    return this.request('/api/commitments');
  }

  async markComplete(commitmentId: string): Promise<void> {
    await this.request(`/api/commitments/${commitmentId}/complete`, { method: 'PATCH' });
  }
}

export class AuthRequiredError extends Error {
  constructor() {
    super('Authentication required');
    this.name = 'AuthRequiredError';
  }
}

export const rexApi = new RexApiClient();
