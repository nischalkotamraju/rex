const steps = [
  { n: '1', title: 'Install the extension', body: 'Add Rex to Chrome in one click. No setup, no configuration required.' },
  { n: '2', title: 'Open Gmail', body: 'Rex scans your inbox and analyzes each thread you open. Nothing to trigger.' },
  { n: '3', title: 'Act on what matters', body: 'Commitments surface inline. Draft a follow-up, mark it done, without leaving Gmail.' },
]

export function HowItWorks() {
  return (
    <section style={{ background: 'transparent', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '96px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 12 }}>Up in 30 seconds</h2>
          <p style={{ fontSize: 15, color: '#888' }}>Works inside the Gmail you already use.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {steps.map((s) => (
            <div key={s.n} style={{ padding: 28, borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                {s.n}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 14, color: '#888', lineHeight: 1.65 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
