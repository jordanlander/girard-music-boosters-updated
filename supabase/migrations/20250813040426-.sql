-- Fix seeding dates with proper casting
insert into public.events (title, date, calendar, location, description, published)
select * from (
  values
    ('Booster Meeting', date '2025-08-20', 'General', 'GHS Auditorium', null, true),
    ('Band Rehearsal', date '2025-08-22', 'Band', 'Band Room', null, true),
    ('Drama Club Read-Through', date '2025-08-25', 'Drama', 'Black Box', null, true),
    ('Car Wash Fundraiser', date '2025-08-30', 'Fundraising', 'School Parking Lot', null, true)
) as v(title, date, calendar, location, description, published)
where not exists (select 1 from public.events);