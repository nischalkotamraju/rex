import { stripe } from '@/lib/stripe'
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'

// Must use raw body for Stripe signature verification
export const runtime = 'nodejs'

async function getSupabase() {
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await getSupabase()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode !== 'subscription') return NextResponse.json({ ok: true })
    const userId = session.metadata?.user_id
    if (!userId) return NextResponse.json({ ok: true })
    await supabase.from('subscriptions').update({
      stripe_customer_id: session.customer as string,
      stripe_sub_id: session.subscription as string,
      plan: 'pro',
      status: 'active',
      updated_at: new Date().toISOString(),
    }).eq('user_id', userId)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as Stripe.Subscription
    const { data: existing } = await supabase.from('subscriptions').select('user_id').eq('stripe_sub_id', sub.id).single()
    if (existing) {
      await supabase.from('subscriptions').update({
        status: sub.status as string,
        current_period_end: new Date(sub.billing_cycle_anchor * 1000).toISOString(),
        updated_at: new Date().toISOString(),
      }).eq('stripe_sub_id', sub.id)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as Stripe.Subscription
    await supabase.from('subscriptions').update({
      plan: 'free',
      status: 'canceled',
      stripe_sub_id: null,
      updated_at: new Date().toISOString(),
    }).eq('stripe_sub_id', sub.id)
  }

  return NextResponse.json({ ok: true })
}
