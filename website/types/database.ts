export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Views: Record<string, never>
    Functions: Record<string, never>
    Tables: {
      users: {
        Row: { id: string; email: string; full_name: string | null; avatar_url: string | null; created_at: string; updated_at: string }
        Insert: { id: string; email: string; full_name?: string | null; avatar_url?: string | null }
        Update: { full_name?: string | null; avatar_url?: string | null; updated_at?: string }
        Relationships: []
      }
      subscriptions: {
        Row: { id: string; user_id: string; stripe_customer_id: string | null; stripe_sub_id: string | null; plan: 'free' | 'pro'; status: 'active' | 'canceled' | 'past_due' | 'trialing'; current_period_end: string | null; created_at: string; updated_at: string }
        Insert: { user_id: string; plan?: 'free' | 'pro'; status?: string }
        Update: { stripe_customer_id?: string | null; stripe_sub_id?: string | null; plan?: 'free' | 'pro'; status?: string; current_period_end?: string | null; updated_at?: string }
        Relationships: []
      }
      usage: {
        Row: { id: string; user_id: string; month: string; analyze_count: number; draft_count: number; updated_at: string }
        Insert: { user_id: string; month: string; analyze_count?: number; draft_count?: number }
        Update: { analyze_count?: number; draft_count?: number; updated_at?: string }
        Relationships: []
      }
      commitments: {
        Row: { id: string; user_id: string; type: string; summary: string; detail: string | null; quoted_text: string | null; sender: string | null; sender_email: string | null; due_date: string | null; due_text: string | null; urgency: string | null; thread_id: string | null; message_id: string | null; completed: boolean; created_at: string }
        Insert: { id: string; user_id: string; type: string; summary: string; detail?: string | null; quoted_text?: string | null; sender?: string | null; sender_email?: string | null; due_date?: string | null; due_text?: string | null; urgency?: string | null; thread_id?: string | null; message_id?: string | null; completed?: boolean }
        Update: { completed?: boolean }
        Relationships: []
      }
      waitlist: {
        Row: { id: string; email: string; created_at: string }
        Insert: { email: string }
        Update: Record<string, never>
        Relationships: []
      }
    }
  }
}
