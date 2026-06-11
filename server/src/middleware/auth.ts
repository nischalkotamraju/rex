import { createClient } from '@supabase/supabase-js'
import type { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  userId?: string
}

// Use a user-scoped client to validate the token via Supabase's getUser
export async function verifyJwt(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.method === 'OPTIONS') return next()
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const token = auth.slice(7)
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    )
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
    req.userId = data.user.id
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
