import React, { useEffect, useState } from 'react';

type AuthState = 'loading' | 'signed-out' | 'signed-in';
type Theme = 'light' | 'dark';

const THEME_KEY = 'rex-popup-theme';

const light = {
  bg: '#ffffff',
  fg: '#0f0a1e',
  muted: '#6b7280',
  muted2: '#9ca3af',
  border: 'rgba(0,0,0,0.08)',
  headerBg: 'rgba(124,58,237,0.05)',
  rowBg: 'rgba(0,0,0,0.03)',
  rowBorder: 'rgba(0,0,0,0.07)',
  pillConnected: 'rgba(22,163,74,0.1)',
  pillConnectedText: '#16a34a',
  pillError: 'rgba(220,38,38,0.1)',
  pillErrorText: '#dc2626',
  dotConnected: '#16a34a',
  dotError: '#dc2626',
  dotChecking: '#d1d5db',
  secondaryBtn: 'rgba(124,58,237,0.08)',
  secondaryBtnBorder: 'rgba(124,58,237,0.2)',
  secondaryBtnText: '#7c3aed',
  divider: 'rgba(0,0,0,0.07)',
  signOutColor: '#9ca3af',
  signOutHover: '#ef4444',
  toggleBg: 'rgba(0,0,0,0.05)',
  toggleBorder: 'rgba(0,0,0,0.1)',
};

const dark = {
  bg: '#0f0a1e',
  fg: '#f5f3ff',
  muted: '#a78bfa',
  muted2: '#6b7280',
  border: 'rgba(255,255,255,0.07)',
  headerBg: 'rgba(124,58,237,0.08)',
  rowBg: 'rgba(255,255,255,0.04)',
  rowBorder: 'rgba(255,255,255,0.07)',
  pillConnected: 'rgba(74,222,128,0.1)',
  pillConnectedText: '#4ade80',
  pillError: 'rgba(248,113,113,0.1)',
  pillErrorText: '#f87171',
  dotConnected: '#4ade80',
  dotError: '#f87171',
  dotChecking: '#4b5563',
  secondaryBtn: 'rgba(124,58,237,0.12)',
  secondaryBtnBorder: 'rgba(124,58,237,0.25)',
  secondaryBtnText: '#a78bfa',
  divider: 'rgba(255,255,255,0.06)',
  signOutColor: '#4b5563',
  signOutHover: '#f87171',
  toggleBg: 'rgba(255,255,255,0.06)',
  toggleBorder: 'rgba(255,255,255,0.1)',
};

export function Popup() {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [userEmail, setUserEmail] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('light');
  const [signOutHovered, setSignOutHovered] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY) as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem(THEME_KEY, next);
  };

  useEffect(() => {
    chrome.storage.local.get(['rexAccessToken', 'rexUserEmail'], (result) => {
      setAuth(result['rexAccessToken'] ? 'signed-in' : 'signed-out');
      if (result['rexUserEmail']) setUserEmail(result['rexUserEmail']);
    });
  }, []);

  useEffect(() => {
    fetch(`${__SERVER_URL__}/api/health`)
      .then(r => r.ok ? setStatus('connected') : setStatus('error'))
      .catch(() => setStatus('error'));
  }, []);

  const signIn = () => {
    const extId = chrome.runtime.id;
    chrome.tabs.create({ url: `${__WEBSITE_URL__}/login?source=extension&extId=${extId}` });
    window.close();
  };

  const signOut = () => {
    chrome.storage.local.remove(['rexAccessToken', 'rexRefreshToken', 'rexUserEmail'], () => {
      setAuth('signed-out');
      setUserEmail('');
    });
  };

  const t = theme === 'light' ? light : dark;
  const avatarLetter = userEmail ? userEmail[0].toUpperCase() : '?';

  const dotColor = status === 'connected' ? t.dotConnected : status === 'error' ? t.dotError : t.dotChecking;
  const pillBg = status === 'connected' ? t.pillConnected : status === 'error' ? t.pillError : 'transparent';
  const pillText = status === 'connected' ? t.pillConnectedText : status === 'error' ? t.pillErrorText : t.muted2;

  return (
    <div style={{
      width: 300,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif",
      background: t.bg,
      color: t.fg,
      WebkitFontSmoothing: 'antialiased' as const,
    }}>

      {/* Header */}
      <div style={{
        padding: '12px 14px',
        borderBottom: `1px solid ${t.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: t.headerBg,
      }}>
        <img src="/icons/icon48.png" alt="Rex" style={{ width: 24, height: 24, borderRadius: 6 }} />
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: '-0.3px', color: t.fg }}>Rex</span>

        {/* Status pill */}
        <span style={{
          display: 'flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 500, color: pillText,
          background: pillBg, padding: '3px 8px', borderRadius: 20,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, display: 'inline-block' }} />
          {status === 'connected' ? 'Online' : status === 'error' ? 'Offline' : '…'}
        </span>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title="Toggle theme"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 28, height: 28, borderRadius: 7,
            border: `1px solid ${t.toggleBorder}`,
            background: t.toggleBg,
            color: t.muted2, cursor: 'pointer', flexShrink: 0,
          }}
        >
          {theme === 'light' ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          )}
        </button>
      </div>

      <div style={{ padding: '16px 14px' }}>
        {auth === 'loading' && (
          <div style={{ textAlign: 'center', padding: '20px 0', color: t.muted2, fontSize: 13 }}>Loading…</div>
        )}

        {auth === 'signed-out' && (
          <div>
            <p style={{ fontSize: 13, color: t.muted, margin: '0 0 14px', lineHeight: 1.5 }}>
              Sign in to start tracking commitments in your inbox.
            </p>
            <button
              onClick={signIn}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9,
                background: '#fff', color: '#1f1f1f',
                border: '1px solid rgba(0,0,0,0.12)',
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                padding: '10px 14px', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {auth === 'signed-in' && (
          <>
            {/* User row */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
              padding: '9px 11px',
              background: t.rowBg, borderRadius: 8, border: `1px solid ${t.rowBorder}`,
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>
                {avatarLetter}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: 12, color: t.muted, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userEmail}
                </div>
                <div style={{ fontSize: 11, color: t.muted2, marginTop: 1 }}>Signed in</div>
              </div>
            </div>

            <button
              onClick={() => chrome.tabs.create({ url: `${__WEBSITE_URL__}/dashboard` })}
              style={{
                width: '100%', padding: '9px',
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', marginBottom: 7,
                boxShadow: '0 2px 10px rgba(124,58,237,0.35)',
                letterSpacing: '-0.1px',
              }}
            >
              View commitments
            </button>

            <button
              onClick={() => chrome.tabs.create({ url: `${__WEBSITE_URL__}/dashboard` })}
              style={{
                width: '100%', padding: '9px',
                background: t.secondaryBtn, color: t.secondaryBtnText,
                border: `1px solid ${t.secondaryBtnBorder}`,
                borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: 'pointer', marginBottom: 14, letterSpacing: '-0.1px',
              }}
            >
              Manage subscription
            </button>

            <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: 11 }}>
              <button
                onClick={signOut}
                onMouseEnter={() => setSignOutHovered(true)}
                onMouseLeave={() => setSignOutHovered(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', padding: 0,
                  fontSize: 12, fontWeight: 500,
                  color: signOutHovered ? t.signOutHover : t.signOutColor,
                  cursor: 'pointer',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
