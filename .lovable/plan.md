## Goal
Update the site to promote Girard High School's production of Disney's Frozen — The Broadway Musical, and add the show dates as real events.

## Show details (from poster)
- Title: Disney's Frozen — The Broadway Musical
- Presented by: Girard High School
- Dates/times: April 30, 2026 at 7 p.m.; May 1, 2026 at 7 p.m.; May 2, 2026 at 7 p.m.
- Venue: Girard High School Auditorium
- Tickets: Adults $7; Students & Senior Citizens $5

## Changes

1. Announcement banner (src/pages/Index.tsx)
   - Replace the current "Oliver!" season announcement with:
     "Girard High School presents Disney's Frozen — April 30, May 1 & 2, 2026 at 7 p.m. (GHS Auditorium). Adults $7, Students & Seniors $5."

2. Featured section (src/pages/Index.tsx)
   - Replace the Oliver! FeatureCard with a Frozen card:
     - Title: "Disney's Frozen — coming April 30, 2026"
     - Description: "Girard High School presents Disney's Frozen — The Broadway Musical. April 30, May 1 & 2, 2026 at 7 p.m. in the GHS Auditorium. Tickets: Adults $7; Students & Senior Citizens $5."
     - CTA: "See show dates" → #events
   - Image: keep the existing Oliver SVG placeholder for now (we don't have a Frozen graphic yet). Optionally swap later if the user uploads a Frozen image. I'll note this in the implementation message.

3. Events in Supabase (public.events) — insert three published events
   - Title: "Disney's Frozen — The Broadway Musical"
   - Calendar: "Drama"
   - Location: "Girard High School Auditorium"
   - Description: "Doors open before 7 p.m. Tickets at the door: Adults $7; Students & Senior Citizens $5."
   - Dates: 2026-04-30, 2026-05-01, 2026-05-02
   - published: true
   - These will automatically appear in Upcoming Events, the month calendar, and the announcements list (via the existing event-derived announcements code).

## Out of scope (ask if you want these now)
- Replacing the Featured image with a Frozen-themed graphic (need an asset; Disney artwork is copyrighted, so I'd suggest a custom graphic or your own photo of the poster).
- Changing the hero section copy.
- Adding a separate "Tickets" CTA/button.

## Files to edit
- src/pages/Index.tsx (announcement text + Featured card content/CTA)

## Database
- One Supabase migration inserting 3 rows into public.events.
