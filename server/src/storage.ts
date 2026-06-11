import type { Commitment } from './types/index.js';

// In-memory storage for MVP — replace with Supabase for production
class CommitmentStore {
  private commitments = new Map<string, Commitment>();

  save(commitment: Commitment): void {
    this.commitments.set(commitment.id, commitment);
  }

  saveMany(commitments: Commitment[]): void {
    for (const c of commitments) this.save(c);
  }

  getAll(): Commitment[] {
    return Array.from(this.commitments.values())
      .filter(c => !c.completed)
      .sort((a, b) => {
        const urgencyOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        return (urgencyOrder[a.urgency] ?? 2) - (urgencyOrder[b.urgency] ?? 2);
      });
  }

  getById(id: string): Commitment | undefined {
    return this.commitments.get(id);
  }

  markComplete(id: string): boolean {
    const c = this.commitments.get(id);
    if (!c) return false;
    this.commitments.set(id, { ...c, completed: true });
    return true;
  }

  getByThread(threadId: string): Commitment[] {
    return Array.from(this.commitments.values()).filter(c => c.threadId === threadId);
  }
}

export const store = new CommitmentStore();
