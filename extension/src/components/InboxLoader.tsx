import React, { useState, useEffect } from 'react';

const TEXT = 'Scanning your inbox for commitments...';

const ENVELOPES = [
  { left: '7%',  delay: '0s',    dur: '2.2s', rot: '-8deg'  },
  { left: '19%', delay: '0.7s',  dur: '1.8s', rot: '5deg'   },
  { left: '33%', delay: '0.3s',  dur: '2.6s', rot: '-4deg'  },
  { left: '47%', delay: '1.1s',  dur: '2.0s', rot: '9deg'   },
  { left: '61%', delay: '0.5s',  dur: '2.4s', rot: '-6deg'  },
  { left: '75%', delay: '1.4s',  dur: '1.9s', rot: '3deg'   },
  { left: '88%', delay: '0.9s',  dur: '2.3s', rot: '-10deg' },
];

interface Props { iconUrl: string; }

export function InboxLoader({ iconUrl }: Props) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (displayed.length < TEXT.length) {
      const t = setTimeout(() => setDisplayed(TEXT.slice(0, displayed.length + 1)), 52);
      return () => clearTimeout(t);
    } else {
      setDone(true);
    }
  }, [displayed, done]);

  return (
    <div className="rex-inbox-loader">
      {/* Falling envelopes */}
      <div className="rex-email-rain" aria-hidden="true">
        {ENVELOPES.map((e, i) => (
          <div
            key={i}
            className="rex-falling-email"
            style={{ left: e.left, animationDuration: e.dur, animationDelay: e.delay, '--rot': e.rot } as React.CSSProperties}
          >
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <rect width="18" height="14" rx="3" fill="#c4b5fd" />
              <path d="M0 2.5L9 8.5L18 2.5" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
        ))}
      </div>

      {/* Rex catching at the bottom */}
      <div className="rex-catcher">
        <img src={iconUrl} width={42} height={42} style={{ borderRadius: 10, display: 'block' }} />
      </div>

      {/* Typewriter text + blinking cursor */}
      <div className="rex-typewriter-row">
        <span className="rex-typewriter-text">{displayed}</span>
        {!done && <span className="rex-typewriter-cursor">|</span>}
      </div>
    </div>
  );
}
