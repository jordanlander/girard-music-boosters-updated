## Goal
Use the user-uploaded Frozen poster as the Featured image on the homepage.

## Changes

1. **Copy the poster** from `user-uploads://nano-banana-2_fix_this_to_a_flat_image_poster-1.jpg` into the project at `src/assets/frozen-poster.jpg`.

2. **Update `src/pages/Index.tsx` Featured section**:
   - Import the new image: `import frozenPoster from "@/assets/frozen-poster.jpg";`
   - Replace the `oliver-musical.svg` placeholder in the Frozen `FeatureCard` with `frozenPoster`.
   - Update alt text to: "Girard High School presents Disney's Frozen — The Broadway Musical, April 30, May 1 & 2, 2026".
   - Keep the existing title, description, and CTA (already correct from the previous update).

## Out of scope
- Replacing the hero image or other graphics.
- Adding the poster to event detail pages (events table doesn't currently support per-event images).
- Removing the now-unused `public/lovable-uploads/oliver-musical.svg` file (leaving it in place is harmless).
