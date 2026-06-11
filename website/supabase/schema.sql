-- Rex — Supabase Schema
-- Run this in your Supabase SQL editor

-- Mirror of auth.users with profile data we need
create table public.users (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table public.users enable row level security;
create policy "Users can read own profile"  on public.users for select using (auth.uid() = id);
create policy "Users can update own profile" on public.users for update using (auth.uid() = id);

-- Subscriptions (Stripe-backed)
create table public.subscriptions (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.users(id) on delete cascade,
  stripe_customer_id  text unique,
  stripe_sub_id       text unique,
  plan                text not null default 'free' check (plan in ('free', 'pro')),
  status              text not null default 'active' check (status in ('active', 'canceled', 'past_due', 'trialing')),
  current_period_end  timestamptz,
  created_at          timestamptz default now(),
  updated_at          timestamptz default now()
);

alter table public.subscriptions enable row level security;
create policy "Users can read own subscription" on public.subscriptions for select using (auth.uid() = user_id);

-- Monthly usage tracking
create table public.usage (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.users(id) on delete cascade,
  month          text not null, -- format: '2026-05'
  analyze_count  int not null default 0,
  draft_count    int not null default 0,
  updated_at     timestamptz default now(),
  unique(user_id, month)
);

alter table public.usage enable row level security;
create policy "Users can read own usage" on public.usage for select using (auth.uid() = user_id);

-- Commitments (persisted from extension)
create table public.commitments (
  id           text primary key,
  user_id      uuid not null references public.users(id) on delete cascade,
  type         text not null,
  summary      text not null,
  detail       text,
  quoted_text  text,
  sender       text,
  sender_email text,
  due_date     text,
  due_text     text,
  urgency      text,
  thread_id    text,
  message_id   text,
  completed    boolean default false,
  created_at   timestamptz default now()
);

alter table public.commitments enable row level security;
create policy "Users can read own commitments"   on public.commitments for select using (auth.uid() = user_id);
create policy "Users can insert own commitments" on public.commitments for insert with check (auth.uid() = user_id);
create policy "Users can update own commitments" on public.commitments for update using (auth.uid() = user_id);
create policy "Users can delete own commitments" on public.commitments for delete using (auth.uid() = user_id);

create index on public.commitments(user_id, completed);
create index on public.commitments(thread_id);

-- Waitlist
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz default now()
);

-- Auto-create user profile + free subscription on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users(id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.subscriptions(user_id, plan, status)
  values (new.id, 'free', 'active');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
