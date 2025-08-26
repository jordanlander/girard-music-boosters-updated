-- Create videos table and policies
create table if not exists public.videos (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  title text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.videos enable row level security;

drop trigger if exists trg_videos_updated_at on public.videos;
create trigger trg_videos_updated_at
before update on public.videos
for each row execute function public.set_updated_at();

-- Policies for videos
 drop policy if exists "Public can view published videos" on public.videos;
create policy "Public can view published videos" on public.videos
for select to anon
using (published = true);

 drop policy if exists "Authenticated can view all videos" on public.videos;
create policy "Authenticated can view all videos" on public.videos
for select to authenticated
using (true);

 drop policy if exists "Admins manage videos" on public.videos;
create policy "Admins manage videos" on public.videos
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Ensure storage bucket and policies for videos
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do nothing;

drop policy if exists "Public read videos" on storage.objects;
create policy "Public read videos" on storage.objects
for select to anon
using (bucket_id = 'videos');

drop policy if exists "Admins insert videos" on storage.objects;
create policy "Admins insert videos" on storage.objects
for insert to authenticated
with check (bucket_id = 'videos' and public.is_admin());

drop policy if exists "Admins update videos" on storage.objects;
create policy "Admins update videos" on storage.objects
for update to authenticated
using (bucket_id = 'videos' and public.is_admin())
with check (bucket_id = 'videos' and public.is_admin());

drop policy if exists "Admins delete videos" on storage.objects;
create policy "Admins delete videos" on storage.objects
for delete to authenticated
using (bucket_id = 'videos' and public.is_admin());
