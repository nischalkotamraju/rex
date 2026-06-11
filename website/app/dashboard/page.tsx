import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { PLANS } from '@/lib/stripe'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch subscription, usage, and recent commitments in parallel
  const [{ data: sub }, { data: usage }, { data: commitments }] = await Promise.all([
    supabase.from('subscriptions').select('*').eq('user_id', user.id).single(),
    supabase.from('usage').select('*').eq('user_id', user.id).eq('month', new Date().toISOString().slice(0, 7)).single(),
    supabase.from('commitments').select('*').eq('user_id', user.id).eq('completed', false).order('created_at', { ascending: false }).limit(20),
  ])

  const plan = sub?.plan ?? 'free'
  const limits = PLANS[plan as keyof typeof PLANS]
  const analyzeUsed = usage?.analyze_count ?? 0
  const draftUsed = usage?.draft_count ?? 0
  const analyzeLimit = limits.analyzeLimit === Infinity ? '∞' : limits.analyzeLimit
  const draftLimit = limits.draftLimit === Infinity ? '∞' : limits.draftLimit

  const typeColors: Record<string, string> = {
    deadline: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    promise: 'bg-green-50 text-green-800 border-green-200',
    'follow-up': 'bg-purple-50 text-purple-800 border-purple-200',
    'action-item': 'bg-purple-50 text-purple-800 border-purple-200',
    meeting: 'bg-blue-50 text-blue-800 border-blue-200',
    unanswered: 'bg-purple-50 text-purple-800 border-purple-200',
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#7c3aed] flex items-center justify-center">
            <span className="text-white text-xs font-bold">R</span>
          </div>
          <span className="text-sm font-semibold text-gray-900">Rex</span>
        </Link>
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <img src={user.user_metadata.avatar_url} alt="" className="w-7 h-7 rounded-full" />
          )}
          <span className="text-sm text-gray-600">{user.user_metadata?.full_name ?? user.email}</span>
          <form action="/auth/signout" method="post">
            <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Sign out</button>
          </form>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Usage bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Analyses this month</span>
              <span className="text-xs text-gray-400">{analyzeUsed} / {analyzeLimit}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] rounded-full transition-all"
                style={{ width: limits.analyzeLimit === Infinity ? '0%' : `${Math.min(100, (analyzeUsed / (limits.analyzeLimit as number)) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-gray-500">Drafts this month</span>
              <span className="text-xs text-gray-400">{draftUsed} / {draftLimit}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#7c3aed] rounded-full transition-all"
                style={{ width: limits.draftLimit === Infinity ? '0%' : `${Math.min(100, (draftUsed / (limits.draftLimit as number)) * 100)}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${plan === 'pro' ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-gray-100 text-gray-500'}`}>
              {plan === 'pro' ? 'Pro' : 'Free'}
            </span>
            {plan === 'free' && (
              <Link href="/pricing" className="text-xs text-[#7c3aed] hover:underline font-medium">Upgrade</Link>
            )}
          </div>
        </div>

        {/* Commitments */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900">Open commitments</h2>
            <span className="text-xs text-gray-400">{commitments?.length ?? 0} items</span>
          </div>
          {!commitments || commitments.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-gray-400">No open commitments. Open Gmail to let Rex analyze your inbox.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {commitments.map((c) => (
                <div key={c.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded border ${typeColors[c.type] ?? 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {c.type}
                  </span>
                  <p className="text-sm text-gray-800 flex-1 truncate">{c.summary}</p>
                  {c.due_text && <span className="text-xs text-gray-400 flex-shrink-0">{c.due_text}</span>}
                  {c.sender && <span className="text-xs text-gray-400 flex-shrink-0">from {c.sender}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
