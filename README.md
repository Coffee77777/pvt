# Before We Became Memories

An interactive, scroll-driven memory book. Cream paper theme, book-opening
intro, custom cursor, 24 animated chapters, chapter navigation, dark mode,
bookmarking, and a shareable link.

## How to open it

Just double-click `index.html` — it works locally, no build step, no server.
**Use a modern browser** (Chrome, Edge, or Safari, updated in the last
couple of years) and make sure you're connected to the internet the first
time you open it, since fonts and the animation libraries (GSAP, Lenis)
load from a CDN. If the CDN can't load, the site still works but falls
back to a plain, non-animated view instead of failing silently.

## Folder structure

```
index.html      → all 24 chapters + intro + ending
style.css       → theme, layout, all animation keyframes
script.js       → intro sequence, scroll system, per-chapter animations
assets/
  photos/       → drop your real photos in here
  audio/        → optional: piano.mp3 (ambient music), page-turn.mp3 (page-turn sfx)
```

## Adding your real photos

Every photo spot is currently a grey "Insert Photo Here" placeholder so
nothing personal ships by default. To swap one in:

1. Put the image in `assets/photos/`, e.g. `assets/photos/kitkats.jpg`.
2. In `index.html`, find the placeholder `div` you want to replace, e.g.:
   ```html
   <div class="polaroid-photo placeholder">Insert Photo Here</div>
   ```
   and change it to:
   ```html
   <div class="polaroid-photo">
     <img src="assets/photos/kitkats.jpg" alt="">
   </div>
   ```
3. Remove the `.placeholder` class so the striped placeholder background
   doesn't show through.

## Adding music / page-turn sound

Drop MP3 files at:
- `assets/audio/piano.mp3` — ambient background music (starts muted, toggled top-right)
- `assets/audio/page-turn.mp3` — short page-flip sound (off by default, toggled top-right)

If these files aren't present, both toggles still work — they just won't
produce sound, and the music button will tell you where to add the file.

## Customizing content

All 24 chapters live as `<section class="page moment-page ...">` blocks in
`index.html`, in order. Each one has a `data-chapter` attribute — that's
what shows up in the chapter navigation drawer and the tooltip on the side
dots. Edit any text directly; layouts and animations are wired to CSS
classes (`.split-page`, `.center-page`, `.map-page`, etc.) and to the
`triggerSpecial()` switch statement in `script.js`, so renaming a section's
`id` will disconnect its bespoke animation — keep the `id`s (`page-1`
through `page-24`) as-is unless you update `script.js` to match.

## What's implemented from the original brief

- Loader: paper fade-in, typewriter title, subtitle/emoji/Begin sequence, book-opening transition
- Lenis smooth scroll + GSAP ScrollTrigger page-by-page reveals
- Custom sunflower cursor that grows on hover over interactive elements
- Progress bar, chapter dots, chapter nav drawer, bookmark button, dark mode, share button, page-turn sound toggle, music toggle
- All 24 moments, each with a distinct layout and a bespoke animation (KitKat wrapper flap, DM messages typing in, notification drop, typewriter dialogue, bouncing speech bubble, spinning chair, security-camera frame, animated flight path with drawn line + flying plane, rising steam, spinning pizza, twinkling starfield, falling/rolling earring, blurred hug with heartbeat, unfolding note, ringing call UI, live-counting call timer, sliding salad-vs-junk duel, shirt swap, falling sunflower petals, swinging anklet, camera zoom, and the two numbers in "Reality" drifting apart)
- Ending sequence that quietries down and reveals "Maliye." after a pause

## Known limitations (being upfront)

- Photos are intentionally placeholders — see above to add real ones.
- Music/page-turn sound need you to supply your own royalty-clean MP3s (I can't generate or fetch audio files).
- This was built and code-reviewed carefully, but only spot-checked visually in a legacy rendering engine here — please do a quick click-through yourself in your actual browser before sharing it, in case something needs a small tweak.
