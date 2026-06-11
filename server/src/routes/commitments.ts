import { Router } from 'express';
import type { Response } from 'express';
import { supabaseAdmin } from '../services/supabase.js';
import type { AuthRequest } from '../middleware/auth.js';

export const commitmentsRouter = Router();

commitmentsRouter.post('/', async (req: AuthRequest, res: Response) => {
  const c = req.body as {
    id: string; type: string; summary: string; detail: string;
    sender: string; senderEmail: string; threadId: string;
    subject?: string; dueDate?: string; dueText?: string;
    urgency?: string;
  };
  if (!c.id || !c.summary || !c.threadId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const { error } = await supabaseAdmin.from('commitments').upsert({
    id: c.id,
    user_id: req.userId!,
    type: c.type || 'action-item',
    summary: c.summary,
    detail: c.detail ?? c.summary,
    sender: c.sender ?? '',
    sender_email: c.senderEmail ?? '',
    due_date: c.dueDate ?? null,
    due_text: c.dueText ?? null,
    urgency: c.urgency ?? 'medium',
    thread_id: c.threadId,
    message_id: c.threadId,
    completed: false,
    created_at: new Date().toISOString(),
  }, { onConflict: 'id' });
  if (error) return res.status(500).json({ error: 'Failed to save commitment' });
  return res.json({ ok: true });
});

commitmentsRouter.get('/', async (req: AuthRequest, res: Response) => {
  let query = supabaseAdmin
    .from('commitments')
    .select('*')
    .eq('user_id', req.userId!)
    .order('created_at', { ascending: false })
    .limit(100);

  if (req.query['thread_id']) {
    query = query.eq('thread_id', req.query['thread_id'] as string);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Failed to fetch commitments' });
  return res.json({ commitments: data });
});

commitmentsRouter.patch('/:id/complete', async (req: AuthRequest, res: Response) => {
  const { error } = await supabaseAdmin
    .from('commitments')
    .update({ completed: true })
    .eq('id', req.params['id'])
    .eq('user_id', req.userId!); // scoped to the authenticated user

  if (error) return res.status(500).json({ error: 'Failed to update commitment' });
  return res.json({ ok: true });
});
