import Link from 'next/link'
import { PLANS } from '@/lib/stripe'

export function Pricing() {
  return (
    <section id="pricing" style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7c3aed', marginBottom: 12 }}>Pricing</p>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: 'var(--fg)', letterSpacing: '-0.02em', marginBottom: 10 }}>Simple, transparent</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>Start free. Upgrade when you need more.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, maxWidth: 640, margin: '0 auto' }}>
          {/* Free */}
          <div style={{ padding: 28, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--card-alt)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>{PLANS.free.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--fg)' }}>$0</span>
              <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>/ month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLANS.free.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M2 7l3.5 3.5L12 3.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', fontSize: 13, fontWeight: 500, color: 'var(--fg)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 0', textDecoration: 'none' }}>
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div style={{ padding: 28, borderRadius: 12, border: '2px solid #7c3aed', background: 'var(--card-purple)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: 999, whiteSpace: 'nowrap' }}>
              Most popular
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg)', marginBottom: 6 }}>{PLANS.pro.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
              <span style={{ fontSize: 36, fontWeight: 700, color: 'var(--fg)' }}>${PLANS.pro.price}</span>
              <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>/ month</span>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PLANS.pro.features.map((f) => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--muted)' }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M2 7l3.5 3.5L12 3.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/login" style={{ display: 'block', textAlign: 'center', fontSize: 13, fontWeight: 500, color: '#fff', background: '#7c3aed', borderRadius: 8, padding: '9px 0', textDecoration: 'none' }}>
              Get Pro
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
