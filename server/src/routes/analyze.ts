import { Router } from 'express';
import type { Response } from 'express';
import { analyzeThread, analyzeInbox } from '../services/extractor.js';
import { supabaseAdmin, checkLimit, incrementUsage } from '../services/supabase.js';
import type { AuthRequest } from '../middleware/auth.js';
import type { EmailContent, InboxEmailSnippet } from '../types/index.js';

export const analyzeRouter = Router();

analyzeRouter.post('/thread', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { allowed } = await checkLimit(userId, 'analyze_count');
    if (!allowed) {
      return res.status(429).json({ error: 'Monthly analysis limit reached. Upgrade to Pro for unlimited.' });
    }

    const email = req.body as EmailContent;
    if (!email.body || !email.threadId) {
      return res.status(400).json({ error: 'Missing required fields: body, threadId' });
    }

    const result = await analyzeThread(email);

    // Persist commitments to Supabase
    if (result.hasCommitments && result.commitments.length > 0) {
      await supabaseAdmin.from('commitments').upsert(
        result.commitments.map((c) => ({
          id: c.id,
          user_id: userId,
          thread_id: email.threadId,
          subject: email.subject ?? '',
          commitment: c.summary,
          owner: c.sender,
          due_date: c.dueDate ?? null,
          status: c.completed ? 'done' : 'pending',
          created_at: new Date().toISOString(),
        })),
        { onConflict: 'id' }
      );
    }

    await incrementUsage(userId, 'analyze_count');
    return res.json(result);
  } catch (err) {
    console.error('[Rex] Thread analysis error:', err);
    return res.status(500).json({ error: 'Analysis failed' });
  }
});

analyzeRouter.post('/inbox', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { allowed } = await checkLimit(userId, 'analyze_count');
    if (!allowed) {
      return res.status(429).json({ error: 'Monthly analysis limit reached. Upgrade to Pro for unlimited.' });
    }

    const { emails } = req.body as { emails: InboxEmailSnippet[] };
    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({ error: 'Missing emails array' });
    }

    const result = await analyzeInbox(emails);

    await incrementUsage(userId, 'analyze_count');
    return res.json(result);
  } catch (err) {
    console.error('[Rex] Inbox analysis error:', err);
    return res.status(500).json({ error: 'Analysis failed' });
  }
});
