'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function WaitlistCTA() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setState('loading')
    const supabase = createClient()
    const { error } = await supabase.from('waitlist').insert({ email })
    if (error && error.code !== '23505') { setState('error'); return }
    setState('done')
  }

  return (
    <section id="waitlist" style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '96px 0', background: '#fff' }}>
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#0f0a1e', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Be first to know
        </h2>
        <p style={{ fontSize: 15, color: '#666', marginBottom: 36, lineHeight: 1.65 }}>
          Rex is in early access. Join the waitlist and we will reach out when your spot is ready.
        </p>

        {state === 'done' ? (
          <div style={{ background: '#f5f3ff', border: '1px solid #ede9fe', borderRadius: 10, padding: '14px 20px', color: '#6d28d9', fontSize: 14, fontWeight: 500 }}>
            You are on the list. We will be in touch.
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={{ flex: 1, background: '#fff', border: '1px solid rgba(0,0,0,0.15)', borderRadius: 8, padding: '10px 16px', color: '#0f0a1e', fontSize: 14, outline: 'none' }}
            />
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', opacity: state === 'loading' ? 0.6 : 1 }}
            >
              {state === 'loading' ? '...' : 'Join waitlist'}
            </button>
          </form>
        )}
        {state === 'error' && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 8 }}>Something went wrong. Try again.</p>}
      </div>
    </section>
  )
}
