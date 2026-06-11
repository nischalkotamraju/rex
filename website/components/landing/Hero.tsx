'use client'
import { useState, useEffect, useCallback } from 'react'
import { ClockIcon, CalendarIcon, ReplyIcon, DocumentIcon, CheckIcon } from './Icons'

type Segment = string | { h: string; bg: string; color: string }
type Commitment = {
  Icon: React.ComponentType<{ size: number; color: string }>
  iconBg: string
  iconColor: string
  border: string
  bg: string
  dateBg: string
  dateColor: string
  text: string
  tag: string
}

const EMAILS = [
  {
    from: 'Sam Cole',
    initials: 'SC',
    color: '#7c3aed',
    subject: 'Re: Seed round terms',
    snippet: 'Quick question, are you free tomorrow to discuss the term sheet?',
    time: '10:23 AM',
    body: [
      'Hey! Quick question, are you ',
      { h: 'free tomorrow to discuss the term sheet', bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
      '? I have thoughts on the ',
      { h: 'pro-rata clause', bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
      ' and want to align before we send to legal.',
    ] as Segment[],
    commitments: [
      { Icon: CalendarIcon, iconBg: 'rgba(217,119,6,0.15)', iconColor: '#f59e0b', border: 'rgba(217,119,6,0.3)', bg: 'rgba(217,119,6,0.08)', dateBg: 'rgba(217,119,6,0.15)', dateColor: '#f59e0b', text: 'Discuss term sheet with Sam', tag: 'Tomorrow' },
      { Icon: ClockIcon,    iconBg: 'rgba(217,119,6,0.15)', iconColor: '#f59e0b', border: 'rgba(217,119,6,0.3)', bg: 'rgba(217,119,6,0.08)', dateBg: 'rgba(217,119,6,0.15)', dateColor: '#f59e0b', text: 'Review pro-rata clause before legal', tag: 'This week' },
    ] as Commitment[],
  },
  {
    from: 'Matt Turner',
    initials: 'MT',
    color: '#0891b2',
    subject: 'Q3 design deliverables',
    snippet: 'Can you send over the updated mockups by Friday? The client is waiting.',
    time: 'Yesterday',
    body: [
      'Hey, following up on the Q3 work. Can you ',
      { h: 'send over the updated mockups by Friday', bg: 'rgba(245,158,11,0.2)', color: '#f59e0b' },
      '? The client is waiting and we need to get sign-off before the sprint ends.',
    ] as Segment[],
    commitments: [
      { Icon: DocumentIcon, iconBg: 'rgba(217,119,6,0.15)', iconColor: '#f59e0b', border: 'rgba(217,119,6,0.3)', bg: 'rgba(217,119,6,0.08)', dateBg: 'rgba(217,119,6,0.15)', dateColor: '#f59e0b', text: 'Send updated mockups to Matt', tag: 'Due Friday' },
    ] as Commitment[],
  },
  {
    from: 'Pat Nash',
    initials: 'PN',
    color: '#059669',
    subject: 'Intro: Jordan from Benchmark',
    snippet: "I'd love to make an intro to Jordan. Let me know if you're open to it.",
    time: 'Mon',
    body: [
      "Hi! I'd love to make an intro to Jordan from Benchmark. Let me know if you're open to it and ",
      { h: "I'll send a blurb his way", bg: 'rgba(124,58,237,0.2)', color: '#a78bfa' },
      '.',
    ] as Segment[],
    commitments: [
      { Icon: ReplyIcon, iconBg: 'rgba(124,58,237,0.15)', iconColor: '#a78bfa', border: 'rgba(124,58,237,0.3)', bg: 'rgba(124,58,237,0.08)', dateBg: 'rgba(124,58,237,0.15)', dateColor: '#a78bfa', text: 'Send intro blurb to Pat for Jordan', tag: 'No reply yet' },
    ] as Commitment[],
  },
]

type Phase = 'inbox' | 'opening' | 'analyzing' | 'result'

export function Hero() {
  const [selected, setSelected] = useState(0)
  const [phase, setPhase] = useState<Phase>('inbox')
  const [shownCards, setShownCards] = useState(0)

  const advance = useCallback(() => {
    if (phase === 'inbox') {
      setPhase('opening')
      setTimeout(() => setPhase('analyzing'), 300)
      setTimeout(() => { setPhase('result'); setShownCards(0) }, 1600)
    } else if (phase === 'result') {
      const next = (selected + 1) % EMAILS.length
      setSelected(next)
      setShownCards(0)
      setPhase('opening')
      setTimeout(() => setPhase('analyzing'), 300)
      setTimeout(() => { setPhase('result'); setShownCards(0) }, 1600)
    }
  }, [phase, selected])

  useEffect(() => {
    if (phase !== 'result') return
    const timers = EMAILS[selected].commitments.map((_, i) =>
      setTimeout(() => setShownCards(i + 1), i * 220 + 80)
    )
    return () => timers.forEach(clearTimeout)
  }, [phase, selected])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Enter') advance() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [advance])

  const email = EMAILS[selected]
  const isOpen = phase === 'analyzing' || phase === 'result' || phase === 'opening'

  return (
    <section style={{ background: 'transparent', paddingTop: 120, paddingBottom: 32, pointerEvents: 'none' }}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h1 style={{ fontSize: 'clamp(36px,5.5vw,64px)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.03em', lineHeight: 1.05, marginBottom: 16, animation: 'fadeUp 0.5s ease both', animationDelay: '0.05s' }}>
          Your inbox knows<br />
          <span style={{ color: '#7c3aed' }}>what you promised.</span>
        </h1>

        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 440, margin: '0 auto 28px', lineHeight: 1.65, animation: 'fadeUp 0.5s ease both', animationDelay: '0.18s' }}>
          The Gmail extension that never lets you forget a promise.
        </p>

        {/* Demo window */}
        <div onClick={advance} style={{ position: 'relative', maxWidth: 760, margin: '0 auto', animation: 'fadeUp 0.55s ease both', animationDelay: '0.32s', pointerEvents: 'auto', cursor: 'pointer' }}>
          {/* Outer glow */}
          <div style={{ position: 'absolute', inset: -1, borderRadius: 16, background: 'linear-gradient(135deg, rgba(124,58,237,0.3) 0%, rgba(124,58,237,0.05) 50%, rgba(124,58,237,0.15) 100%)', filter: 'blur(1px)', zIndex: 0 }} />

          <div style={{ position: 'relative', borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden', background: 'var(--demo-bg)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', zIndex: 1 }}>
            {/* Browser bar */}
            <div style={{ background: 'var(--demo-bar)', borderBottom: '1px solid var(--demo-bar-border)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              </div>
              <div style={{ flex: 1, background: 'var(--demo-url-bg)', borderRadius: 6, border: '1px solid var(--demo-url-border)', padding: '4px 12px', fontSize: 12, color: 'var(--demo-muted)', textAlign: 'left', maxWidth: 260, margin: '0 auto' }}>
                mail.google.com
              </div>
            </div>

            {/* Gmail layout */}
            <div style={{ display: 'flex', minHeight: 320 }}>
              {/* Sidebar */}
              <div style={{ width: 160, borderRight: '1px solid var(--demo-row-border)', background: 'var(--demo-row-bg)', padding: '8px 6px', flexShrink: 0, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, background: 'var(--demo-sidebar-active)', marginBottom: 2 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 4h16v14H4z" stroke="var(--demo-sidebar-icon)" strokeWidth="1.5" strokeLinejoin="round"/><path d="M4 4l8 9 8-9" stroke="var(--demo-sidebar-icon)" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--demo-sidebar-icon)', flex: 1 }}>Inbox</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--demo-sidebar-icon)' }}>3</span>
                </div>
                {[
                  { label: 'Starred', path: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' },
                  { label: 'Sent',    path: 'M2.01 21L23 12 2.01 3 2 10l15 2-15 2z' },
                  { label: 'Drafts',  path: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' },
                ].map(({ label, path }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 20, marginBottom: 2 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--demo-sidebar-icon-alt)"><path d={path}/></svg>
                    <span style={{ fontSize: 13, color: 'var(--demo-sidebar-text)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Main area */}
              <div style={{ flex: 1, overflow: 'hidden' }}>
                {!isOpen ? (
                  <div>
                    {EMAILS.map((e, i) => (
                      <div
                        key={i}
                        onClick={i === selected ? advance : () => { setSelected(i); setPhase('inbox') }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                          borderBottom: '1px solid var(--demo-row-border)', cursor: 'pointer',
                          background: i === selected ? 'var(--demo-row-selected)' : 'var(--demo-row-bg)',
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                          {e.initials}
                        </div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: i === selected ? '#7c3aed' : 'var(--demo-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.from}</span>
                            <span style={{ fontSize: 11, color: 'var(--demo-muted)', flexShrink: 0 }}>{e.time}</span>
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--demo-text-2)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subject}</div>
                          <div style={{ fontSize: 11, color: 'var(--demo-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.snippet}</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <kbd style={{ padding: '2px 6px', background: 'var(--demo-kbd-bg)', border: '1px solid var(--demo-kbd-border)', borderRadius: 4, color: 'var(--demo-kbd-color)', fontFamily: 'monospace', fontSize: 11 }}>Enter</kbd>
                      <span style={{ fontSize: 12, color: 'var(--demo-muted)' }}>to let Rex analyze this email</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: 20, textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: email.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 600, flexShrink: 0 }}>
                        {email.initials}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--demo-text)' }}>{email.from}</div>
                        <div style={{ fontSize: 12, color: 'var(--demo-muted)' }}>{email.subject}</div>
                      </div>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--demo-text-2)', lineHeight: 1.7, marginBottom: 16 }}>
                      {email.body.map((seg, i) =>
                        typeof seg === 'string'
                          ? <span key={i}>{seg}</span>
                          : phase === 'result'
                            ? <mark key={i} style={{ background: seg.bg, color: seg.color, padding: '0 3px', borderRadius: 3, fontStyle: 'normal' }}>{seg.h}</mark>
                            : <span key={i}>{seg.h}</span>
                      )}
                    </p>

                    {phase === 'analyzing' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#7c3aed', padding: '4px 0' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, animation: 'spin 0.8s linear infinite' }}>
                          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.2"/>
                          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                        Rex is scanning for commitments
                      </div>
                    )}

                    {phase === 'result' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {email.commitments.map((c, i) => (
                          <div
                            key={i}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 10,
                              padding: '11px 14px', borderRadius: 6,
                              border: `1px solid ${c.border}`, background: c.bg,
                              boxShadow: '0 1px 4px rgba(60,64,67,0.08)',
                              transition: 'opacity 0.3s, transform 0.3s',
                              opacity: shownCards > i ? 1 : 0,
                              transform: shownCards > i ? 'translateY(0)' : 'translateY(6px)',
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: c.iconBg, flexShrink: 0 }}>
                              <c.Icon size={14} color={c.iconColor} />
                            </span>
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--demo-commit-text)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 10, fontSize: 11.5, fontWeight: 500, background: c.dateBg, color: c.dateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{c.tag}</span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--demo-commit-action)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                              <CheckIcon size={12} color="#137333" />Mark complete
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(124,58,237,0.15)', borderRadius: 6, padding: '4px 13px', fontSize: 13, fontWeight: 500, color: '#a78bfa', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
                              <ReplyIcon size={13} color="#a78bfa" />Draft follow-up
                            </span>
                          </div>
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                          <kbd style={{ padding: '2px 6px', background: 'var(--demo-kbd-bg)', border: '1px solid var(--demo-kbd-border)', borderRadius: 4, color: 'var(--demo-kbd-color)', fontFamily: 'monospace', fontSize: 11 }}>Enter</kbd>
                          <span style={{ fontSize: 12, color: 'var(--demo-muted)' }}>next email</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
