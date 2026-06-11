import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
})

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    analyzeLimit: 50,
    draftLimit: 10,
    features: [
      '50 email analyses / month',
      '10 AI draft replies / month',
      'Commitment tracking',
      'Gmail integration',
    ],
  },
  pro: {
    name: 'Pro',
    price: 9,
    analyzeLimit: Infinity,
    draftLimit: Infinity,
    features: [
      'Unlimited email analyses',
      'Unlimited AI draft replies',
      'Priority AI processing',
      'Commitment history',
      'Early access to new features',
    ],
  },
}
