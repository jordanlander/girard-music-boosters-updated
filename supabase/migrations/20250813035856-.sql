-- Create documents table for public DocsSection with admin management
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  url text not null,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.documents enable row level security;

-- Reusable updated_at trigger function
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_documents_updated_at on public.documents;
create trigger trg_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

-- Public can view published docs
create policy if not exists "Public can view published docs" on public.documents
for select to anon
using (published = true);

-- Authenticated users can view all (so admins see drafts)
create policy if not exists "Authenticated can view all docs" on public.documents
for select to authenticated
using (true);

-- Only admins can modify
create policy if not exists "Admins manage documents" on public.documents
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Seed a couple example docs if table empty
insert into public.documents (title, description, url, order_index, published)
select * from (
  values
    ('Uniform Guidelines (PDF)', 'Dress code and uniform care.', '#', 0, true),
    ('Permission Slip', 'Field trip permission form.', '#', 1, true),
    ('Fundraising Info', 'How to support our programs.', '#', 2, true),
    ('Volunteer Form', 'Sign up to help at events.', '#', 3, true)
) as v(title, description, url, order_index, published)
where not exists (select 1 from public.documents)
;