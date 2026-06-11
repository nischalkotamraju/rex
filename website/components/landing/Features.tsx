'use client'
import { useState, useEffect, useRef } from 'react'
import { CalendarIcon, ReplyIcon, DocumentIcon, ClockIcon } from './Icons'

const COMMITMENTS = [
  { Icon: CalendarIcon, iconBg: 'rgba(217,119,6,0.15)', iconColor: '#f59e0b', border: 'rgba(217,119,6,0.3)', bg: 'rgba(217,119,6,0.08)', dateBg: 'rgba(217,119,6,0.15)', dateColor: '#f59e0b', text: 'Discuss term sheet with Sam', tag: 'Tomorrow' },
  { Icon: ClockIcon,    iconBg: 'rgba(217,119,6,0.15)', iconColor: '#f59e0b', border: 'rgba(217,119,6,0.3)', bg: 'rgba(217,119,6,0.08)', dateBg: 'rgba(217,119,6,0.15)', dateColor: '#f59e0b', text: 'Review pro-rata clause before legal', tag: 'This week' },
]

const INBOX = [
  { initials: 'SC', color: '#7c3aed', from: 'Sam Cole', subject: 'Re: Seed round terms', count: 2 },
  { initials: 'MT', color: '#0891b2', from: 'Matt Turner', subject: 'Q3 design deliverables', count: 1 },
  { initials: 'PN', color: '#059669', from: 'Pat Nash', subject: 'Intro: Jordan from Benchmark', count: 1 },
]

const FULL_DRAFT = `Hi Sam,

Thanks for the heads up. I'm free tomorrow afternoon. Does 2 PM work for you?

Happy to go through the pro-rata clause together before it goes to legal.

Best,
Nischal`

// --- Feature 1: Commitment detection ---
function CommitmentDemo() {
  const [shown, setShown] = useState(0)
  const [scanning, setScanning] = useState(false)

  const scan = () => {
    if (scanning || shown > 0) { setShown(0); return }
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      COMMITMENTS.forEach((_, i) => {
        setTimeout(() => setShown(i + 1), i * 250 + 100)
      })
    }, 900)
  }

  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid var(--inner-border)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--inner-text)' }}>
          {shown === 0 && !scanning ? 'Open email from Sam Cole' : scanning ? 'Scanning for commitments...' : `Found ${shown} commitment${shown > 1 ? 's' : ''}`}
        </span>
        <button
          onClick={scan}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: shown > 0 ? 'var(--inner-bg)' : '#7c3aed', color: shown > 0 ? 'var(--inner-text)' : '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
        >
          {scanning
            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> Scanning</>
            : shown > 0 ? 'Reset' : 'Scan email'
          }
        </button>
      </div>

      {shown === 0 && !scanning && (
        <div style={{ fontSize: 13, color: 'var(--inner-muted)', lineHeight: 1.7, padding: '4px 0' }}>
          Hey! Quick question, are you <span style={{ background: 'var(--inner-bg)', borderRadius: 3, padding: '0 3px' }}>free tomorrow to discuss the term sheet</span>? I have thoughts on the <span style={{ background: 'var(--inner-bg)', borderRadius: 3, padding: '0 3px' }}>pro-rata clause</span> and want to align before we send to legal.
        </div>
      )}

      {scanning && (
        <div style={{ fontSize: 13, color: 'var(--inner-muted)', lineHeight: 1.7, padding: '4px 0' }}>
          Hey! Quick question, are you <mark style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: 3, padding: '0 3px' }}>free tomorrow to discuss the term sheet</mark>? I have thoughts on the <mark style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: 3, padding: '0 3px' }}>pro-rata clause</mark> and want to align before we send to legal.
        </div>
      )}

      {shown > 0 && (
        <>
          <div style={{ fontSize: 13, color: 'var(--inner-muted)', lineHeight: 1.7, padding: '4px 0', marginBottom: 12 }}>
            Hey! Quick question, are you <mark style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: 3, padding: '0 3px' }}>free tomorrow to discuss the term sheet</mark>? I have thoughts on the <mark style={{ background: 'rgba(245,158,11,0.2)', color: '#f59e0b', borderRadius: 3, padding: '0 3px' }}>pro-rata clause</mark> and want to align before we send to legal.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COMMITMENTS.slice(0, shown).map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 6, border: `1px solid ${c.border}`, background: c.bg, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', transition: 'opacity 0.3s, transform 0.3s', opacity: 1, transform: 'translateY(0)' }}>
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 26, height: 26, borderRadius: 6, background: c.iconBg, flexShrink: 0 }}>
                  <c.Icon size={14} color={c.iconColor} />
                </span>
                <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--inner-text)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.text}</span>
                <span style={{ padding: '2px 9px', borderRadius: 10, fontSize: 11, fontWeight: 500, background: c.dateBg, color: c.dateColor, whiteSpace: 'nowrap', flexShrink: 0 }}>{c.tag}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// --- Feature 2: AI draft replies ---
function DraftDemo() {
  const [state, setState] = useState<'idle' | 'typing' | 'done' | 'editing' | 'sent'>('idle')
  const [text, setText] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const generate = () => {
    if (state === 'typing') return
    if (state === 'done' || state === 'editing' || state === 'sent') { setState('idle'); setText(''); return }
    setState('typing')
    let i = 0
    intervalRef.current = setInterval(() => {
      i++
      setText(FULL_DRAFT.slice(0, i))
      if (i >= FULL_DRAFT.length) {
        clearInterval(intervalRef.current!)
        setState('done')
      }
    }, 18)
  }

  const send = () => {
    setState('sent')
    setTimeout(() => { setState('idle'); setText('') }, 2200)
  }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, padding: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.15)', border: '1px solid var(--border)', minHeight: 240, display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid var(--inner-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: 5, background: '#ede9fe' }}>
            <ReplyIcon size={11} color="#7c3aed" />
          </span>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--inner-text)' }}>Draft reply</span>
        </div>
        {state !== 'sent' && (
          <button onClick={generate} style={{ display: 'flex', alignItems: 'center', gap: 6, background: (state === 'done' || state === 'editing') ? 'var(--inner-bg)' : '#7c3aed', color: (state === 'done' || state === 'editing') ? 'var(--inner-text)' : '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 500, opacity: state === 'typing' ? 0.6 : 1 }}>
            {state === 'idle' && 'Generate draft'}
            {state === 'typing' && <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> Writing</>}
            {(state === 'done' || state === 'editing') && 'Reset'}
          </button>
        )}
      </div>

      {state === 'sent' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeUp 0.3s ease both' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4.5 4.5L16 6" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 600, color: '#16a34a', animation: 'fadeUp 0.3s ease 0.1s both' }}>Sent!</span>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 12, color: 'var(--inner-muted)', marginBottom: 4 }}><span style={{ color: 'var(--inner-text)', fontWeight: 500 }}>To:</span> Sam Cole</div>
          <div style={{ fontSize: 12, color: 'var(--inner-muted)', marginBottom: 14 }}><span style={{ color: 'var(--inner-text)', fontWeight: 500 }}>Re:</span> Seed round terms</div>

          <div style={{ flex: 1, borderTop: '1px solid var(--inner-border)', paddingTop: 12 }}>
            {state === 'idle' && <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>Click &ldquo;Generate draft&rdquo; to write a reply...</span>}
            {(state === 'typing' || state === 'done') && (
              <div style={{ fontSize: 13, color: 'var(--inner-text)', lineHeight: 1.75, whiteSpace: 'pre-line' }}>
                {text}{state === 'typing' && <span style={{ display: 'inline-block', width: 2, height: 13, background: '#7c3aed', marginLeft: 1, verticalAlign: 'text-bottom', animation: 'spin 1s step-end infinite' }} />}
              </div>
            )}
            {state === 'editing' && (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                style={{ width: '100%', fontSize: 13, color: 'var(--inner-text)', lineHeight: 1.75, border: '1px solid #c4b5fd', borderRadius: 6, padding: 8, resize: 'none', outline: 'none', minHeight: 110, fontFamily: 'inherit', background: 'var(--card-purple)' }}
                autoFocus
              />
            )}
          </div>

          {(state === 'done' || state === 'editing') && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--inner-border)', display: 'flex', gap: 8 }}>
              <button onClick={send} style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', fontSize: 12, fontWeight: 500 }}>Send</button>
              <button onClick={() => setState(state === 'editing' ? 'done' : 'editing')} style={{ background: 'var(--inner-bg)', color: 'var(--inner-text)', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12 }}>
                {state === 'editing' ? 'Done' : 'Edit'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// --- Feature 3: Inbox overview ---
function InboxDemo() {
  const [shown, setShown] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [visibleBadges, setVisibleBadges] = useState(0)

  const scan = () => {
    if (scanning) return
    if (shown) { setShown(false); setVisibleBadges(0); return }
    setScanning(true)
    setTimeout(() => {
      setScanning(false)
      setShown(true)
      INBOX.forEach((_, i) => {
        setTimeout(() => setVisibleBadges(i + 1), i * 200 + 100)
      })
    }, 800)
  }

  return (
    <div style={{ background: 'var(--card)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.15)', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid var(--inner-border)' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--inner-text)' }}>
          {!shown && !scanning ? 'Inbox' : scanning ? 'Scanning threads...' : `4 open commitments`}
        </span>
        <button
          onClick={scan}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: shown ? 'var(--inner-bg)' : '#7c3aed', color: shown ? 'var(--inner-text)' : '#fff', border: 'none', borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 500, cursor: scanning ? 'default' : 'pointer' }}
        >
          {scanning
            ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg> Scanning</>
            : shown ? 'Reset' : 'Scan inbox'
          }
        </button>
      </div>
      {INBOX.map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--inner-border)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: e.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {e.initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--inner-text)' }}>{e.from}</div>
            <div style={{ fontSize: 11, color: 'var(--muted-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.subject}</div>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 9px', borderRadius: 10, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', flexShrink: 0, transition: 'opacity 0.3s, transform 0.3s', opacity: visibleBadges > i ? 1 : 0, transform: visibleBadges > i ? 'scale(1)' : 'scale(0.8)' }}>
            {e.count} commitment{e.count > 1 ? 's' : ''}
          </span>
        </div>
      ))}
      <div style={{ padding: '11px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
        <DocumentIcon size={13} color="var(--muted-2)" />
        <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>4 total commitments across 3 threads</span>
      </div>
    </div>
  )
}

export function Features() {
  return (
    <div id="features" style={{ background: 'var(--bg)' }}>

      {/* Feature 1 */}
      <div style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>Commitment detection</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 16 }}>
              Every promise,<br />pulled to the surface.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 360 }}>
              Rex reads your open threads and finds deadlines, follow-ups, and commitments you made. No inbox zero required.
            </p>
          </div>
          <CommitmentDemo />
        </div>
      </div>

      {/* Feature 2 */}
      <div style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <DraftDemo />
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>AI draft replies</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 16 }}>
              Reply in one click,<br />not fifteen minutes.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 360 }}>
              Rex generates a contextual follow-up draft written from your perspective. Review it, tweak it if you want, then send.
            </p>
          </div>
        </div>
      </div>

      {/* Feature 3 */}
      <div style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 16 }}>Inbox overview</p>
            <h2 style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 16 }}>
              Your whole inbox,<br />accounted for.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7, maxWidth: 360 }}>
              Rex scans your most recent threads on load. Every open commitment across your inbox, surfaced without opening a single email.
            </p>
          </div>
          <InboxDemo />
        </div>
      </div>

    </div>
  )
}
