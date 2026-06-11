'use client'
import { useEffect, useState } from 'react'

export default function ExtensionCallback() {
  const [status, setStatus] = useState<'sending' | 'done' | 'error'>('sending')

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')

    if (!accessToken || !refreshToken) { setStatus('error'); return }

    const urlParams = new URLSearchParams(window.location.search)
    const extensionId = urlParams.get('extId') ?? process.env.NEXT_PUBLIC_EXTENSION_ID

    // Decode email from JWT payload (no crypto needed — just base64)
    let email: string | undefined
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]))
      email = payload.email
    } catch { /* ignore */ }

    if (typeof chrome !== 'undefined' && chrome?.runtime?.sendMessage && extensionId) {
      chrome.runtime.sendMessage(
        extensionId,
        { type: 'REX_AUTH_TOKEN', accessToken, refreshToken, email },
        () => setStatus('done')
      )
    } else {
      setStatus('error')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="text-center">
        {status === 'sending' && (
          <>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">Connecting to Rex...</h1>
            <p className="text-sm text-gray-500">Linking your account to the extension.</p>
          </>
        )}
        {status === 'done' && (
          <>
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 10l4 4 8-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">You're signed in</h1>
            <p className="text-sm text-gray-500">You can close this tab and return to Gmail.</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-lg font-semibold text-gray-900 mb-1">Something went wrong</h1>
            <p className="text-sm text-gray-500">Please try signing in again.</p>
          </>
        )}
      </div>
    </div>
  )
}
