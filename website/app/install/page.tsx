import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function InstallPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const steps = [
    {
      n: '1',
      title: 'Add Rex to Chrome',
      body: 'Click the button below to open the Chrome Web Store and install the Rex extension.',
      action: { label: 'Add to Chrome', href: 'https://chrome.google.com/webstore', external: true },
    },
    {
      n: '2',
      title: 'Pin the extension',
      body: 'Click the puzzle icon in Chrome\'s toolbar, find Rex, and click the pin icon so it stays visible.',
    },
    {
      n: '3',
      title: 'Open Gmail',
      body: 'Go to mail.google.com. Rex will automatically start scanning your inbox for commitments.',
      action: { label: 'Open Gmail', href: 'https://mail.google.com', external: true },
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.1) 0%, rgba(124,58,237,0.03) 40%, transparent 65%), #fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48 }}>
        <img src="/icon.png" alt="Rex" style={{ width: 36, height: 36, borderRadius: 10 }} />
        <span style={{ fontSize: 18, fontWeight: 700, color: '#0f0a1e', letterSpacing: '-0.3px' }}>Rex</span>
      </div>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: 480, background: '#fff', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', padding: '36px 32px', boxShadow: '0 4px 32px rgba(0,0,0,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0f0a1e', letterSpacing: '-0.02em', marginBottom: 8 }}>
            You're in. Now install the extension.
          </h1>
          <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6 }}>
            Rex lives inside Gmail. Install the Chrome extension to get started.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ display: 'flex', gap: 16, padding: '16px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)', background: '#fafafa' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: '#7c3aed', color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.n}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#0f0a1e', marginBottom: 3 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.55 }}>{s.body}</div>
                {s.action && (
                  <a
                    href={s.action.href}
                    target={s.action.external ? '_blank' : undefined}
                    rel={s.action.external ? 'noopener noreferrer' : undefined}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 12, fontWeight: 500, color: '#7c3aed', textDecoration: 'none' }}
                  >
                    {s.action.label}
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 10L10 2M10 2H4M10 2v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <a
          href="https://chrome.google.com/webstore"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'block', textAlign: 'center', background: '#7c3aed', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 0', borderRadius: 10, textDecoration: 'none', boxShadow: '0 2px 10px rgba(124,58,237,0.3)', marginBottom: 12 }}
        >
          Add Rex to Chrome
        </a>

        <Link
          href="/dashboard"
          style={{ display: 'block', textAlign: 'center', fontSize: 13, color: '#aaa', textDecoration: 'none' }}
        >
          I already installed it, go to dashboard
        </Link>
      </div>

      {/* User info */}
      <p style={{ marginTop: 20, fontSize: 12, color: '#bbb' }}>
        Signed in as {user.email}
      </p>
    </div>
  )
}
