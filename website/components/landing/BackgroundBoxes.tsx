'use client'
import { Boxes } from '@/components/ui/background-boxes'

export function BackgroundBoxes() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ zIndex: 0 }}>
      <Boxes />
      {/* Fade mask so text stays readable */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, transparent 20%, color-mix(in srgb, var(--bg) 70%, transparent) 60%, var(--bg) 85%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
