import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { Features } from '@/components/landing/Features'
import { Pricing } from '@/components/landing/Pricing'
import { CustomCursor } from '@/components/landing/CustomCursor'
import { BackgroundBoxes } from '@/components/landing/BackgroundBoxes'

export default function Home() {
  return (
    <div className="no-cursor">
      <CustomCursor />
      <Navbar />
      <main>
        <div className="relative overflow-hidden">
          <BackgroundBoxes />
          <Hero />
          {/* Gradient fade into the next section */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to bottom, transparent, var(--bg))', pointerEvents: 'none', zIndex: 3 }} />
        </div>
        <Features />
        <Pricing />
      </main>
      <footer style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '28px 0', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#aaa' }}>© 2026 Rex. All rights reserved.</span>
          <span style={{ fontSize: 12, color: '#aaa' }}>getrex.ai</span>
        </div>
      </footer>
    </div>
  )
}
