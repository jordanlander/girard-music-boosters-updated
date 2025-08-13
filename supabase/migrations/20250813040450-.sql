-- Recreate events table and policies with correct seeding
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  calendar text not null,
  location text,
  description text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

-- Policies
drop policy if exists "Public can view published events" on public.events;
create policy "Public can view published events" on public.events
for select to anon
using (published = true);

drop policy if exists "Authenticated can view all events" on public.events;
create policy "Authenticated can view all events" on public.events
for select to authenticated
using (true);

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events" on public.events
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create index if not exists idx_events_date on public.events(date);

-- Seed
insert into public.events (title, date, calendar, location, description, published)
select * from (
  values
    ('Booster Meeting', date '2025-08-20', 'General', 'GHS Auditorium', null, true),
    ('Band Rehearsal', date '2025-08-22', 'Band', 'Band Room', null, true),
    ('Drama Club Read-Through', date '2025-08-25', 'Drama', 'Black Box', null, true),
    ('Car Wash Fundraiser', date '2025-08-30', 'Fundraising', 'School Parking Lot', null, true)
) as v(title, date, calendar, location, description, published)
where not exists (select 1 from public.events);

-- Recreate photos table and policies (in case prior migration rolled back)
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  alt text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.photos enable row level security;

drop trigger if exists trg_photos_updated_at on public.photos;
create trigger trg_photos_updated_at
before update on public.photos
for each row execute function public.set_updated_at();

-- Policies for photos
drop policy if exists "Public can view published photos" on public.photos;
create policy "Public can view published photos" on public.photos
for select to anon
using (published = true);

drop policy if exists "Authenticated can view all photos" on public.photos;
create policy "Authenticated can view all photos" on public.photos
for select to authenticated
using (true);

drop policy if exists "Admins manage photos" on public.photos;
create policy "Admins manage photos" on public.photos
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Ensure storage bucket and policies again
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

drop policy if exists "Public read gallery" on storage.objects;
create policy "Public read gallery" on storage.objects
for select to anon
using (bucket_id = 'gallery');

drop policy if exists "Admins insert gallery" on storage.objects;
create policy "Admins insert gallery" on storage.objects
for insert to authenticated
with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admins update gallery" on storage.objects;
create policy "Admins update gallery" on storage.objects
for update to authenticated
using (bucket_id = 'gallery' and public.is_admin())
with check (bucket_id = 'gallery' and public.is_admin());

drop policy if exists "Admins delete gallery" on storage.objects;
create policy "Admins delete gallery" on storage.objects
for delete to authenticated
using (bucket_id = 'gallery' and public.is_admin());