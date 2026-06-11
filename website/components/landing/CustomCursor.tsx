'use client'
import { useEffect, useRef, useState } from 'react'

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = '*, *:hover, *:active, *:focus { cursor: none !important; }'
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
      if (!visible) setVisible(true)
    }

    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [visible])

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed', top: -4, left: -4, zIndex: 99999,
        pointerEvents: 'none', willChange: 'transform',
        opacity: visible ? 1 : 0, transition: 'opacity 0.15s',
        display: 'flex', alignItems: 'center', gap: 7,
      }}
    >
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
      <div style={{ background: '#7c3aed', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 5, whiteSpace: 'nowrap', letterSpacing: '0.01em' }}>
        You
      </div>
    </div>
  )
}
