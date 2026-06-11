'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center" style={{ paddingTop: 14, pointerEvents: 'none' }}>
      <nav
        style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', maxWidth: 720, padding: '0 8px 0 16px', height: 48,
          borderRadius: 14,
          ...(scrolled ? {
            background: 'var(--nav-scrolled)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.09), 0 0 0 1px var(--border)',
          } : {
            background: 'transparent',
          }),
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <img src="/icon.png" alt="Rex" style={{ width: 26, height: 26, borderRadius: 8 }} />
          <span style={{ color: 'var(--fg)', fontSize: 15, fontWeight: 700, letterSpacing: '-0.3px' }}>Rex</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {['features', 'pricing'].map(id => (
            <button
              key={id}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '6px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ThemeToggle />
          <Link href="/login" style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', fontSize: 13, fontWeight: 500, background: '#7c3aed', padding: '7px 18px', borderRadius: 9, textDecoration: 'none', boxShadow: '0 1px 6px rgba(124,58,237,0.35)' }} className="hover:opacity-90 transition-opacity">
            Sign in
          </Link>
        </div>
      </nav>
    </div>
  )
}
