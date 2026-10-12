/* =============================================================================
   LYDE & PRINCE — WEDDING INVITATION WEBSITE
   CONFIG  ·  edit THIS file only — every name, date, venue, colour and photo
   used by the site comes from the object below. No other file needs editing.
   Save the file and refresh the page to see your changes.
   ============================================================================= */

const CONFIG = {
  /* ---------------------------------------------------------------------------
     1. THE COUPLE
     --------------------------------------------------------------------------- */
  couple: {
    partner1: "Lyde",
    partner2: "Prince",
    monogram: "LP",        // interlocking initials shown on the wax seal & arch
    monogramJoiner: "&",   // symbol between the initials, e.g. "&" or ""
    hashtag: "#LydeAndPrince",
    // Optional line of parents / sponsors, printed under the names.
    // Leave as an empty array to hide it.
    parents: [
      "Mr. & Mrs. Manuel Delacroix",
      "Mr. & Mrs. Rafael Santiano"
    ],
    parentsLabel: "together with their families"
  },

  /* ---------------------------------------------------------------------------
     2. DATE & TIME
     iso  → used for the printed date AND the countdown (YYYY-MM-DDTHH:MM:SS)
            A date without "Z" is read in the guest's own time zone.
     timeLabel → the poetic wording printed on the card
     --------------------------------------------------------------------------- */
  event: {
    iso: "2027-06-12T16:00:00",
    timeLabel: "at four o'clock in the afternoon",
    // Optional extra line under the time (religious note, dress code reminder…)
    note: ""
  },

  /* ---------------------------------------------------------------------------
     3. VENUES
     mapQuery  → what the embedded map looks up (name + address is usually enough)
     directionsUrl → leave "" to build a Google Maps link automatically
     --------------------------------------------------------------------------- */
  venues: {
    ceremony: {
      label: "Ceremony",
      name: "The Garden Conservatory",
      address: "12 Rosewood Lane, San Isidro",
      mapQuery: "The Garden Conservatory, 12 Rosewood Lane",
      directionsUrl: ""
    },
    reception: {
      label: "Reception",
      name: "Orchard House Pavilion",
      address: "88 Cypress Drive, San Isidro",
      mapQuery: "Orchard House Pavilion, 88 Cypress Drive",
      directionsUrl: ""
    },
    // Which venue the embedded map shows: "ceremony" | "reception"
    mapFor: "ceremony"
  },

  /* ---------------------------------------------------------------------------
     4. PROGRAM / SCHEDULE  — add, remove or reorder freely
     --------------------------------------------------------------------------- */
  program: [
    { time: "4:00",  title: "Ceremony",    note: "Garden arbour, please be seated by 3:45" },
    { time: "4:45",  title: "Photos",      note: "Golden-hour portraits in the rose garden" },
    { time: "5:30",  title: "Cocktail Hour", note: "Lemonade, sparkling wine & canapés" },
    { time: "7:00",  title: "Dinner & Toasts", note: "Under the string lights" },
    { time: "9:00",  title: "Dancing",     note: "First dance, then until midnight" }
  ],

  /* ---------------------------------------------------------------------------
     5. DRESS CODE & COLOUR PALETTE
     palette → the swatches shown on the dress-code page (name + hex)
     --------------------------------------------------------------------------- */
  dressCode: {
    title: "Garden Formal",
    attire: "Linen suits, midi or long dresses, block heels or flats",
    note: "Kindly choose from our palette below — soft blushes, dusty rose and sage. The lawn is grassy, so stilettos are best avoided.",
    palette: [
      { name: "Blush",     hex: "#F3C9CF" },
      { name: "Dusty Rose", hex: "#C9A3AC" },
      { name: "Sage",      hex: "#9FB39A" },
      { name: "Champagne", hex: "#E4C98A" },
      { name: "Lavender",  hex: "#CDBFE0" },
      { name: "Ivory",     hex: "#FCF4EF" }
    ]
  },

  /* ---------------------------------------------------------------------------
     6. PHOTO GALLERY
     Put your photos in  assets/gallery/  and list them here.
     Use 2:3 portrait crops (e.g. 900 × 1350 px) for the fastest load.
     --------------------------------------------------------------------------- */
  gallery: [
    { src: "assets/gallery/pic-1.svg", alt: "Placeholder — replace with a photo of the couple walking in the garden" },
    { src: "assets/gallery/pic-2.svg", alt: "Placeholder — replace with a close-up of the engagement rings" },
    { src: "assets/gallery/pic-3.svg", alt: "Placeholder — replace with a portrait of the couple" },
    { src: "assets/gallery/pic-4.svg", alt: "Placeholder — replace with a photo of the floral arch" },
    { src: "assets/gallery/pic-5.svg", alt: "Placeholder — replace with a candid laugh between the couple" },
    { src: "assets/gallery/pic-6.svg", alt: "Placeholder — replace with a photo of the table setting" }
  ],

  /* ---------------------------------------------------------------------------
     7. RSVP
     endpoint → paste a Formspree / Google Apps Script / Basin URL.
                Leave "" and the form will open the guest's mail app instead
                (responses go to `email` below).
     --------------------------------------------------------------------------- */
  rsvp: {
    deadline: "2027-05-12",
    email: "rsvp@lydeandprince.com",
    endpoint: "",                       // e.g. "https://formspree.io/f/xxxxxxx"
    maxGuests: 5,
    meals: [
      "Herb-roasted chicken",
      "Seared fish of the day",
      "Garden vegetarian",
      "No meal — just celebrating"
    ],
    showMeal: true
  },

  /* ---------------------------------------------------------------------------
     8. GIFTS / REGISTRY
     --------------------------------------------------------------------------- */
  gift: {
    title: "With love, no gifts needed",
    text: "Your presence is the loveliest present of all. Should you wish to honour us with a gift, a small contribution towards our first home would mean the world.",
    linkLabel: "View our registry",
    linkUrl: "https://example.com/registry"   // ← replace, or set to "" to hide the button
  },

  /* ---------------------------------------------------------------------------
     9. BACKGROUND MUSIC
     src → an .mp3/.ogg in  assets/music/  (e.g. "assets/music/suite.mp3").
           Leave "" and the site plays a soft generated harp-like pad instead.
           Music NEVER starts on its own — only after the guest taps the toggle.
     --------------------------------------------------------------------------- */
  music: {
    src: "",
    volume: 0.35,
    label: "Play music"
  },

  /* ---------------------------------------------------------------------------
     10. ARTWORK — layered raster art (transparent WebP + gold SVG).
     Drop your final exports over these exact filenames; no code change needed.
     See ASSETS.md for sizes and where each file is used.
     --------------------------------------------------------------------------- */
  art: {
    sky:        "assets/bg-sky.webp",
    hills:      "assets/bg-hills.webp",
    arch:       "assets/arch-floral.webp",
    treesLeft:  "assets/trees-cypress-left.webp",
    treesRight: "assets/trees-cypress-right.webp",
    cornerTL:   "assets/florals-corner-tl.webp",
    cornerTR:   "assets/florals-corner-tr.webp",
    cornerBL:   "assets/florals-corner-bl.webp",
    cornerBR:   "assets/florals-corner-br.webp",
    petals:     "assets/petals-sprite.webp",
    envelope:   "assets/envelope-texture.webp",
    seal:       "assets/wax-seal.webp",
    ribbon:     "assets/ribbon-bow.webp",
    paper:      "assets/paper-card.webp",
    monogram:   "assets/monogram-gold.svg"
  },

  /* ---------------------------------------------------------------------------
     11. SHARE PREVIEW (shown when the link is pasted in a chat app)
     --------------------------------------------------------------------------- */
  share: {
    title: "Lyde & Prince — We're getting married",
    description: "Together with their families, Lyde & Prince request the pleasure of your company. Tap the seal to open the invitation.",
    image: "assets/og-image.svg"   // ideally export this to a 1200×630 .jpg
  },

  /* ---------------------------------------------------------------------------
     12. COLOURS  — the whole palette; tweak to taste
     --------------------------------------------------------------------------- */
  colors: {
    blushLight: "#F8DDE0",
    blushMid:   "#F3C9CF",
    blushDeep:  "#EDB9C2",
    paper:      "#FCF2F1",
    mauve:      "#C9A3AC",
    mauveDeep:  "#A97F8B",
    lavender:   "#CDBFE0",
    sky:        "#DCD3EC",
    sage:       "#9FB39A",
    cypress:    "#6E8570",
    gold:       "#D8B26A",
    goldLight:  "#F0DCA8",
    plum:       "#4A3A45"
  }
};

/* ---------------------------------------------------------------------------
   Nothing to edit below this line.
   --------------------------------------------------------------------------- */
Object.entries(CONFIG.colors).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--c-${key}`, value);
});
