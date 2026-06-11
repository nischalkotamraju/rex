import { Router } from 'express';
import type { Response } from 'express';
import { generateDraft } from '../services/drafter.js';
import { checkLimit, incrementUsage } from '../services/supabase.js';
import type { AuthRequest } from '../middleware/auth.js';

export const draftRouter = Router();

draftRouter.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { allowed } = await checkLimit(userId, 'draft_count');
    if (!allowed) {
      return res.status(429).json({ error: 'Monthly draft limit reached. Upgrade to Pro for unlimited.' });
    }

    const { emailContent, commitmentSummary, senderName, userName } = req.body as {
      emailContent: string;
      commitmentSummary: string;
      senderName?: string;
      userName?: string;
    };
    if (!emailContent || !commitmentSummary) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const draft = await generateDraft({
      emailContent,
      commitmentSummary,
      senderName: senderName ?? '',
      userName: userName ?? '',
    });

    await incrementUsage(userId, 'draft_count');
    return res.json({ draft });
  } catch (err) {
    console.error('[Rex] Draft generation error:', err);
    return res.status(500).json({ error: 'Draft generation failed' });
  }
});
