/* =============================================================================
   PRINCE & LYDE — WEDDING INVITATION WEBSITE
   CONFIG  ·  edit THIS file only — every name, date, venue, colour and photo
   used by the site comes from the object below. No other file needs editing.
   Save the file and refresh the page to see your changes.
   ============================================================================= */

const CONFIG = {
  /* ---------------------------------------------------------------------------
     1. THE COUPLE
     --------------------------------------------------------------------------- */
  couple: {
    partner1: "Prince",
    partner2: "Lyde",
    monogram: "PL",        // two initials, drawn overlapping on the wax seal & invitation
    hashtag: "#PrinceAndLyde",
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
      label: "Wedding Ceremony",
      name: "St. Paul the Apostle Parish Church",
      address: "Poblacion, Inabanga, Bohol",
      mapQuery: "St. Paul the Apostle Parish Church, Inabanga, Bohol",
      directionsUrl: "https://share.google/gmAPAKGHZuhY8Rkxg"
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
    { time: "4:00",  title: "Ceremony",    note: "St. Paul the Apostle Parish Church · please be seated by 3:45" },
    { time: "4:45",  title: "Photos",      note: "Golden-hour portraits in the rose garden" },
    { time: "5:30",  title: "Cocktail Hour", note: "Lemonade, sparkling wine & canapés" },
    { time: "7:00",  title: "Dinner & Toasts", note: "Under the string lights" },
    { time: "9:00",  title: "Dancing",     note: "First dance, then until midnight" }
  ],

  /* ---------------------------------------------------------------------------
     5. DRESS CODE & MOTIF  (from reference video/motif.jpg)
     palette → the swatches on the dress-code page: name, colour, who wears it
     --------------------------------------------------------------------------- */
  dressCode: {
    title: "Filipino Formal",
    attire: "Barong Tagalog for gentlemen · Filipiniana for ladies",
    note: "Kindly dress in our motif colours.",
    palette: [
      { name: "Champagne",     hex: "#F5CAA5", wear: "Bridesmaids & Maid of Honor" },
      { name: "Beige / Cream", hex: "#F0D2B6", wear: "Fathers, groomsmen, male guests, ninongs, ring bearers & long-sleeved inner shirts" },
      { name: "Muted Gold",    hex: "#DBB082", wear: "Mother of the Bride" },
      { name: "Taupe",         hex: "#B59580", wear: "Mother of the Groom & ninangs" },
      { name: "Mocha",         hex: "#7E5A42", wear: "Female guests (Filipiniana dresses required)" }
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
    email: "rsvp@princeandlyde.com",
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
     10. ARTWORK — the Figma layers, recoloured to the motif (recolor_figma.py).
     Drop your final exports over these exact filenames; no code change needed.
     See ASSETS.md for sizes and where each file is used.
     --------------------------------------------------------------------------- */
  art: {
    paper:       "assets/fig-paper.webp",         // embossed floral paper (envelope + page sides)
    flap:        "assets/fig-flap.webp",          // sealed envelope flap
    flapFolded:  "assets/fig-flap-folded.webp",   // flap folded back once opened
    pocket:      "assets/fig-pocket.webp",        // V-notch envelope pocket
    lining:      "assets/fig-lining.webp",        // gate illustration inside the envelope
    gate:        "assets/fig-gate.webp",          // bow-covered reveal backdrop
    rings:       "assets/rings.webp",             // wedding rings on the reveal screen
    couple:      "assets/couple-silhouette.webp", // barong + baro't saya silhouette (dress code)
    arch:        "assets/fig-arch.webp",          // invitation hero arch + staircase
    boat:        "assets/fig-boat.webp",          // "The Celebration" illustration
    canopy:      "assets/fig-canopy.webp",        // "Wedding Details" silk canopy
    petals:      "assets/petals-sprite.webp"      // drifting petals (4 frames in a row)
  },


  /* ---------------------------------------------------------------------------
     11. SHARE PREVIEW (shown when the link is pasted in a chat app)
     --------------------------------------------------------------------------- */
  share: {
    title: "Prince & Lyde — We're getting married",
    description: "Together with their families, Prince & Lyde request the pleasure of your company. Tap the seal to open the invitation.",
    image: "assets/og-image.svg"   // ideally export this to a 1200×630 .jpg
  },

  /* ---------------------------------------------------------------------------
     12. COLOURS  — the whole palette; tweak to taste
     --------------------------------------------------------------------------- */
  colors: {
    champagne: "#F5CAA5",
    beige:     "#F0D2B6",
    gold:      "#DBB082",   // muted gold
    taupe:     "#B59580",
    mocha:     "#7E5A42",   // headings, script lettering
    ink:       "#5E4434",   // body text
    page:      "#F3DEC8",   // section background
    cream:     "#FBF4EC",   // cards, lettering over artwork
    chip:      "#FAEEE2"    // buttons, sound control
  }

};

/* ---------------------------------------------------------------------------
   Nothing to edit below this line.
   --------------------------------------------------------------------------- */
Object.entries(CONFIG.colors).forEach(([key, value]) => {
  document.documentElement.style.setProperty(`--c-${key}`, value);
});
