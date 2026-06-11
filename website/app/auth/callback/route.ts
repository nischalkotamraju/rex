import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const source = url.searchParams.get('source')
  const next = url.searchParams.get('next') ?? '/install'

  if (!code) return NextResponse.redirect(new URL('/login', request.url))

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.session) {
    return NextResponse.redirect(new URL('/login?error=auth', request.url))
  }

  // Extension auth flow: pass tokens back via URL fragment so they never hit the server
  if (source === 'extension') {
    const { access_token, refresh_token } = data.session
    const extensionCallbackUrl = new URL('/auth/extension-callback', url.origin)
    const extId = url.searchParams.get('extId')
    if (extId) extensionCallbackUrl.searchParams.set('extId', extId)
    extensionCallbackUrl.hash = `access_token=${access_token}&refresh_token=${refresh_token}`
    return NextResponse.redirect(extensionCallbackUrl)
  }

  return NextResponse.redirect(new URL(next, request.url))
}
