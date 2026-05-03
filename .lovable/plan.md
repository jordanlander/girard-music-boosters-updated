## Goal
Add the rescheduled, combined Choir & Band Concert to the website's events list.

## Background (from Mr. Armitage's letter)
- Originally scheduled May 27 — cancelled due to admin scheduling.
- New date: **Tuesday, May 19, 2026**
- Combined choir + band performance (one event).
- Time and additional details TBA.

## Changes

1. **Database**: Insert one new row into the `events` table via migration:
   - title: `Combined Choir & Band Concert`
   - date: `2026-05-19`
   - calendar: `Band` (closest match — covers both ensembles; "General" is the alternative)
   - location: `Girard High School` (no specific room provided)
   - description: `A combined performance featuring the GHS Choir and Band. Originally scheduled for May 27, this concert has been rescheduled and combined into one special event. Time and additional details will be shared soon.`
   - published: `true`

   No existing May 27 event exists in the DB, so nothing to delete/update.

2. **No code changes** required — the homepage already renders upcoming events from the `events` table.

## Out of scope
- Adding a dedicated announcement banner (can do if desired).
- Removing the legacy May 27 reference (none exists in code or DB).
