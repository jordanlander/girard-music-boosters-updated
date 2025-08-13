-- Create admin_emails table to manage admin access
create table if not exists public.admin_emails (
  email text primary key,
  created_at timestamptz not null default now()
);

-- Enable RLS on the table
alter table public.admin_emails enable row level security;

-- Normalize emails to lowercase via trigger
create or replace function public.normalize_admin_email()
returns trigger
language plpgsql
as $$
begin
  if new.email is not null then
    new.email := lower(new.email);
  end if;
  return new;
end;
$$;

drop trigger if exists trg_admin_email_normalize on public.admin_emails;
create trigger trg_admin_email_normalize
before insert or update on public.admin_emails
for each row execute function public.normalize_admin_email();

-- Create a SECURITY DEFINER function to check if current user is admin (avoids RLS recursion)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.admin_emails where email = auth.email()
  );
$$;

-- Grant execute on helper function
grant execute on function public.is_admin() to anon, authenticated;

-- RLS Policies
-- Allow any authenticated user to read the admin list (lets the app check membership client-side)
drop policy if exists "Read admin_emails" on public.admin_emails;
create policy "Read admin_emails"
on public.admin_emails
for select
to authenticated
using (true);

-- Only admins can modify the list
drop policy if exists "Manage admin_emails" on public.admin_emails;
create policy "Manage admin_emails"
on public.admin_emails
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Seed initial admins (idempotent)
insert into public.admin_emails (email) values
  ('girardmusicboosters@gmail.com'),
  ('jordanlander@gmail.com')
on conflict do nothing;