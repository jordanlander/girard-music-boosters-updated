-- Fix linter: set search_path on trigger function
create or replace function public.normalize_admin_email()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.email is not null then
    new.email := lower(new.email);
  end if;
  return new;
end;
$$;