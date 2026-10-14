# Prince & Lyde — Digital Envelope Wedding Invitation

A mobile-first, scroll-driven wedding invitation site, built from the Figma design and
recoloured to the motif (champagne · beige · muted gold · taupe · mocha). An embossed
envelope with a wax seal opens onto a rose-arch gate with the wedding rings, then flows
into the invitation → countdown & celebration → wedding details → programme → dress
code → gallery → RSVP → gifts → closing.

Raster artwork + CSS animation, about 1 MB in total — no video, no heavy frameworks,
no build step.

---

## 1 · Files

```
index.html          the whole page (structure + inline artwork)
css/style.css       all styling, animation and layout
js/config.js        ← EDIT THIS ONE FILE for names, dates, venues, colours, photos
js/app.js           intro animation, countdown, gallery, RSVP, music, petals
assets/gallery/     6 placeholder images (replace with your photos)
assets/og-image.svg link preview image (used when the invitation is shared)
reference video/    your own reference clip — not used by the site
```

Open `index.html` in any browser to preview. There is nothing to compile.

---

## 2 · Editing your details (`js/config.js`)

Open the file — it is grouped, commented and safe to edit. Every change shows up
immediately after a refresh.

| What you want to change | Where in `config.js` |
| --- | --- |
| Names, monogram initials, hashtag, parents | `couple` |
| Wedding date, time wording | `event` |
| Ceremony & reception name, address, map search | `venues` |
| Schedule items | `program` (add/remove lines freely) |
| Dress code text and colour swatches | `dressCode` |
| Photos in the gallery | `gallery` |
| RSVP deadline, email, form backend, meal choices | `rsvp` |
| Gift / registry note and link | `gift` |
| Background music file | `music` |
| Share title, description, preview image | `share` |
| Whole palette (champagne, beige, gold, taupe, mocha…) | `colors` |

**Date format** — write `event.iso` as `YYYY-MM-DDTHH:MM:SS` (no `Z` at the end).
It drives the printed date *and* the countdown.

**Monogram** — `monogram: "PL"`: the two letters are pressed into the wax seal and drawn
overlapping in script above the names on the invitation.

---

## 3 · Replacing the placeholder artwork

### Photos (gallery + any image)
1. Export your photos as **2:3 portrait**, about **900 × 1350 px**, saved as `.jpg`
   (compress them — 150–250 KB each is plenty).
2. Drop them into `assets/gallery/`.
3. List them in `config.js`:

```js
gallery: [
  { src: "assets/gallery/our-1.jpg", alt: "Us laughing at the beach" },
  { src: "assets/gallery/our-2.jpg", alt: "The proposal in the rain" },
]
```

`alt` is read by screen readers and shown under the photo in the lightbox — write a
short description of the picture.

### Background music
Drop an `.mp3` into `assets/music/` and point to it:

```js
music: { src: "assets/music/suite.mp3", volume: 0.35, label: "Play music" }
```

Leave `src: ""` and the site plays a soft, generated harp-like pad instead (no file
needed). Music **never** starts by itself — only after the guest taps the note button.

### The envelope, gate, arch and canopy artwork
The artwork is the Figma layers in `assets/` (`fig-*.webp` + small SVGs), recoloured
to the motif by `recolor_figma.py`. To restyle it, replace the files — never edit code. Full filename/size/usage
table: see **`ASSETS.md`** (also `config.js → art`).

---

## 4 · RSVP — where responses go

Three options, chosen in `config.js → rsvp`:

**A. Formspree (easiest, free tier available)**
Create a form at formspree.io, then:
```js
rsvp: { endpoint: "https://formspree.io/f/xxxxxxxx", email: "you@example.com" }
```
Responses arrive in your inbox and dashboard.

**B. Google Sheets (via Apps Script)**
Deploy a Google Apps Script web app that appends rows to a sheet, and paste its
`/exec` URL into `endpoint`. The site posts JSON: `name, attending, guests, meal,
message, couple, guestParam, submittedAt`.

**C. No backend (default)**
Leave `endpoint: ""`. The guest taps *Send my reply by email* and their mail app opens
with the reply pre-filled to `rsvp.email`.

---

## 5 · Personalised links

Add a guest name to the invitation link:

```
https://your-site.com/?guest=Santos+Family
https://your-site.com/?guest=Ma.%20Cruz
```

The envelope page stays the same, and the greeting becomes **“Dear Santos Family”**
(and the RSVP name field is pre-filled). Share one link per guest or per family.

---

## 6 · Publishing (free)

The site is static, so any of these work:

**GitHub Pages**
1. Create a repository, upload the files.
2. Settings → Pages → Deploy from branch → `main` / `root`.
3. Your site appears at `https://<username>.github.io/<repo>/`.

**Netlify or Cloudflare Pages**
Drag the folder onto app.netlify.com/drop or connect the repo — done.

**Google Drive / others**
Any host that serves `index.html` works. Test the RSVP on your real phone before
sending it out (iOS Safari and Android Chrome are both supported).

### Share preview
When the link is pasted into a chat app, the title, description and
`assets/og-image.svg` are shown. Many apps only accept a **JPG/PNG** for the preview —
open `og-image.svg` in a browser or design tool, export it as a **1200 × 630 JPG**
(e.g. `assets/og-image.jpg`), and update `share.image` plus the two `og:image` tags at
the top of `index.html`.

---

## 7 · What is built in

- **Envelope intro** — tap the wax seal: the flap folds back, the gate lining and pocket
  settle in, then the envelope slides away and the bow screen rises with the names.
- **Scroll experience** — full-screen invitation art, staggered fade-up reveals, drifting
  petals.
- **Countdown** to the ceremony, live to the second.
- **Add to calendar** (`.ics` download + Google Calendar) and a **Share** button.
- **Wedding details** under a silk canopy, embedded map (loads lazily) and
  *View on map* links for the ceremony and the celebration.
- **Gallery** — swipeable strip with dots, arrows and a full-screen lightbox
  (swipe, arrow keys, Esc).
- **RSVP** — validation, graceful confirmation, optional meal choice and guest count.
- **Sound button** — bottom corner, off until tapped, pauses when the tab is hidden.
- **Accessibility** — large tap targets, visible focus rings, alt text, `prefers-reduced-motion`
  support (animation and petals are switched off, the intro opens instantly), and a
  *Skip* button for the intro.
- **No JavaScript?** The page still shows the invitation text (the envelope is skipped).

---

## 8 · Fine-tuning

- **Colours** — `config.js → colors` (they are injected as CSS variables named `--c-*`).
- **Fonts** — the two Google Fonts are linked at the top of `index.html`:
  *Pinyon Script* (names, headings), *Cinzel* (capitals) and *Cormorant Garamond* (text).
  Swap the link and the `--script` / `--caps` / `--serif` variables in `css/style.css`.
- **Animation speed** — timings live in `css/style.css` transitions and in
  `OPEN` / `LEAVE` / `DONE` in `js/app.js` (milliseconds).
- **Desktop look** — the site stays a phone-width column (`--col`, max 480 px, in
  `style.css`) centred on the embossed paper; every Figma measurement scales with it.

---

## 9 · Troubleshooting

| Symptom | Fix |
| --- | --- |
| Names look wrong | Check `couple` in `config.js`, then hard-refresh (Ctrl+F5). |
| Countdown shows 00 | `event.iso` is in the past or malformed — use `2027-06-12T16:00:00`. |
| Map is blank | Some networks block Google Maps embeds; the *Get Directions* button always works. Replace the iframe `src` with an OpenStreetMap embed if you prefer. |
| RSVP says “something went wrong” | The `endpoint` URL is wrong or the host (e.g. Formspree) needs the site to be on **https://**, not `file://`. |
| Fonts do not load | The device is offline; the site falls back to Georgia/serif gracefully. |
| Music does nothing | Browsers block audio until a real tap — tap the note once more, or check `music.src`. |
