import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS, used only on the server
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7) // '2026-05'
}

export async function incrementUsage(userId: string, field: 'analyze_count' | 'draft_count') {
  const month = currentMonth()
  // Upsert the row, then increment
  await supabaseAdmin.from('usage').upsert(
    { user_id: userId, month, [field]: 1 },
    { onConflict: 'user_id,month', ignoreDuplicates: false }
  )
  // Increment via RPC if supported, otherwise do a read-modify-write
  const { data } = await supabaseAdmin.from('usage').select(field).eq('user_id', userId).eq('month', month).single()
  if (data) {
    const current = (data as Record<string, number>)[field] ?? 0
    await supabaseAdmin.from('usage').update({ [field]: current + 1, updated_at: new Date().toISOString() }).eq('user_id', userId).eq('month', month)
  }
}

export async function checkLimit(userId: string, field: 'analyze_count' | 'draft_count'): Promise<{ allowed: boolean; plan: string }> {
  const [{ data: sub }, { data: usage }] = await Promise.all([
    supabaseAdmin.from('subscriptions').select('plan').eq('user_id', userId).single(),
    supabaseAdmin.from('usage').select(field).eq('user_id', userId).eq('month', currentMonth()).single(),
  ])
  const plan = sub?.plan ?? 'free'
  const count = (usage as Record<string, number> | null)?.[field] ?? 0
  const limits: Record<string, Record<string, number>> = {
    free:  { analyze_count: 50, draft_count: 10 },
    pro:   { analyze_count: Infinity, draft_count: Infinity },
  }
  const limit = limits[plan]?.[field] ?? 50
  return { allowed: count < limit, plan }
}
