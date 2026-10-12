/* =============================================================================
   LYDE & PRINCE · WEDDING INVITATION
   app.js — intro animation, scroll effects, countdown, gallery, RSVP, music.
   All editable content lives in js/config.js.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- tiny helpers ------------------------------------------------ */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const pad = (n) => String(n).padStart(2, "0");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const COUPLE = CONFIG.couple;
  const EVENT  = CONFIG.event;
  const NAMES  = `${COUPLE.partner1} & ${COUPLE.partner2}`;

  /* =========================================================================
     1 · FILL THE PAGE FROM CONFIG
     ====================================================================== */
  const bindText = (key, value) =>
    $$(`[data-f="${key}"]`).forEach((el) => (el.textContent = value));

  const when = new Date(EVENT.iso);
  const dateParts = {
    weekday:   when.toLocaleDateString(undefined, { weekday: "long" }),
    day:       String(when.getDate()),
    monthYear: `${when.toLocaleDateString(undefined, { month: "long" })} ${when.getFullYear()}`
  };
  const spokenDate = when.toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  bindText("partner1", COUPLE.partner1);
  bindText("partner2", COUPLE.partner2);
  bindText("coupleNames", NAMES);
  bindText("weekday", dateParts.weekday);
  bindText("day", dateParts.day);
  bindText("monthYear", dateParts.monthYear);
  bindText("timeLabel", EVENT.timeLabel);
  bindText("parentsLabel", COUPLE.parentsLabel);
  bindText("dateLine", `${spokenDate} · ${CONFIG.venues.ceremony.name}`);
  bindText("ceremonyLabel", CONFIG.venues.ceremony.label);
  bindText("ceremonyName", CONFIG.venues.ceremony.name);
  bindText("ceremonyAddr", CONFIG.venues.ceremony.address);
  bindText("receptionLabel", CONFIG.venues.reception.label);
  bindText("receptionName", CONFIG.venues.reception.name);
  bindText("receptionAddr", CONFIG.venues.reception.address);
  bindText("dressTitle", CONFIG.dressCode.title);
  bindText("dressAttire", CONFIG.dressCode.attire);
  bindText("dressNote", CONFIG.dressCode.note);
  bindText("giftTitle", CONFIG.gift.title);
  bindText("giftText", CONFIG.gift.text);
  bindText("hashtag", COUPLE.hashtag);
  document.title = CONFIG.share.title;
  const setMeta = (sel, content) => { const m = $(sel); if (m) m.setAttribute("content", content); };
  setMeta('meta[property="og:title"]', CONFIG.share.title);
  setMeta('meta[property="og:description"]', CONFIG.share.description);
  setMeta('meta[name="description"]', CONFIG.share.description);

  /* "Get directions" links (auto-built unless you supply your own URL) */
  const dirUrl = (v) =>
    v.directionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(v.mapQuery)}`;
  $("#dirCeremony").href = dirUrl(CONFIG.venues.ceremony);
  $("#dirReception").href = dirUrl(CONFIG.venues.reception);

  /* monogram (arch crest + wax seal) */
  const i1 = (COUPLE.monogram[0] || "").trim();
  const i2 = (COUPLE.monogram[1] || i1).trim();
  $("#monoA").textContent = i1;
  $("#monoB").textContent = i2;
  $("#monoJoin").textContent = COUPLE.monogramJoiner;
  const sealMono = $("#sealMono");
  sealMono.innerHTML = "";
  sealMono.append(document.createTextNode(i1));
  const amp = document.createElement("span");
  amp.className = "seal__amp";
  amp.textContent = COUPLE.monogramJoiner || " ";
  sealMono.append(amp, document.createTextNode(i2));

  /* parents / sponsors */
  if (COUPLE.parents && COUPLE.parents.length) {
    const box = $("#parentsList");
    COUPLE.parents.forEach((line) => {
      const s = document.createElement("span");
      s.textContent = line;
      box.append(s);
    });
  }

  /* programme timeline */
  const timeline = $("#timeline");
  CONFIG.program.forEach((step) => {
    const li = document.createElement("li");
    li.className = "tl reveal";
    li.innerHTML =
      `<span class="tl__time"></span>` +
      `<div><p class="tl__title"></p><p class="tl__note"></p></div>`;
    $(".tl__time", li).textContent = step.time;
    $(".tl__title", li).textContent = step.title;
    $(".tl__note", li).textContent = step.note || "";
    timeline.append(li);
  });

  /* dress-code swatches */
  const swatchList = $("#swatches");
  CONFIG.dressCode.palette.forEach((c) => {
    const li = document.createElement("li");
    li.className = "swatch";
    li.innerHTML = `<span class="swatch__dot"></span><span class="swatch__name"></span><span class="swatch__hex"></span>`;
    $(".swatch__dot", li).style.background = c.hex;
    $(".swatch__name", li).textContent = c.name;
    $(".swatch__hex", li).textContent = c.hex.toUpperCase();
    swatchList.append(li);
  });

  /* meal options */
  const mealField = $("#mealField");
  const mealSelect = $("#fMeal");
  CONFIG.rsvp.meals.forEach((m) => {
    const o = document.createElement("option");
    o.value = o.textContent = m;
    mealSelect.append(o);
  });
  if (!CONFIG.rsvp.showMeal) mealField.hidden = true;
  $("#fGuests").max = CONFIG.rsvp.maxGuests;

  /* RSVP deadline + mail fallback */
  $("#rsvpDeadline").textContent =
    "Kindly reply by " +
    new Date(CONFIG.rsvp.deadline).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

  const buildMailto = (form) => {
    const d = new FormData(form);
    const body = [
      `Name: ${d.get("name") || ""}`,
      `Attending: ${d.get("attending") || ""}`,
      `Guests: ${d.get("guests") || 1}`,
      CONFIG.rsvp.showMeal ? `Meal: ${d.get("meal") || ""}` : "",
      "",
      d.get("message") || ""
    ].filter(Boolean).join("\n");
    return `mailto:${CONFIG.rsvp.email}?subject=${encodeURIComponent("RSVP — " + NAMES)}&body=${encodeURIComponent(body)}`;
  };

  /* gift link */
  if (CONFIG.gift.linkUrl) {
    const gl = $("#giftLink");
    gl.href = CONFIG.gift.linkUrl;
    gl.textContent = CONFIG.gift.linkLabel;
    gl.hidden = false;
  }

  /* =========================================================================
     2 · PERSONALISED GREETING  (?guest=Santos+Family)
     ====================================================================== */
  const guest = new URLSearchParams(location.search).get("guest");
  if (guest) {
    const safe = guest.replace(/[<>]/g, "").slice(0, 60);
    $("#greeting").textContent = `Dear ${safe}`;
    $("#greetingKicker").textContent = "A wedding invitation, just for you";
    const hello = $("#rsvpHello");
    hello.textContent = `Dear ${safe},`;
    hello.hidden = false;
    $("#fName").value = safe;
  }

  /* =========================================================================
     3 · ENVELOPE INTRO
     ====================================================================== */
  const intro = $("#intro");
  const scene = $("#scene");
  const sealBtn = $("#sealBtn");
  let opened = false;
  let timers = [];

  function afterIntro() {
    intro.classList.add("is-gone");
    document.body.classList.remove("is-locked");
    window.removeEventListener("touchmove", blockScroll, { passive: false });
    window.removeEventListener("wheel", blockScroll, { passive: false });
    const page = $("#page");
    page.setAttribute("tabindex", "-1");
    page.focus({ preventScroll: true });
    initObservers();
    if (!reduced) startPetals();
  }

  function openEnvelope() {
    if (opened) return;
    opened = true;
    sealBtn.classList.add("is-pressed");
    $("#tapHint").style.opacity = "0";

    if (reduced) {                       // no cinematic sequence needed
      scene.classList.add("is-open", "is-revealed");
      timers.push(setTimeout(afterIntro, 350));
      return;
    }

    timers.push(setTimeout(() => intro.classList.add("is-opening"), 600));    // ribbon loosens, flap peels
    timers.push(setTimeout(() => {                                            // envelope dissolves, curtains part
      intro.classList.add("is-dissolving");
      scene.classList.add("is-open");
    }, 1400));
    timers.push(setTimeout(() => scene.classList.add("is-revealed"), 2600)); // monogram appears
    timers.push(setTimeout(afterIntro, 3800));                                // hand over to the page
  }

  function skipIntro() {
    timers.forEach(clearTimeout);
    timers = [];
    intro.classList.add("is-opening", "is-dissolving", "is-gone");
    scene.classList.add("is-open", "is-revealed");
    const cl = $("#curtainL");
    const cr = $("#curtainR");
    if (cl) cl.style.display = "none";
    if (cr) cr.style.display = "none";
    afterIntro();
    $$(".reveal").forEach((el) => el.classList.add("is-in"));
  }

  function blockScroll(e) {
    if (!document.body.classList.contains("is-locked")) return;
    e.preventDefault();
  }

  sealBtn.addEventListener("click", openEnvelope);
  $("#skipIntro").addEventListener("click", skipIntro);
  window.addEventListener("touchmove", blockScroll, { passive: false });
  window.addEventListener("wheel", blockScroll, { passive: false });
  if (new URLSearchParams(location.search).has("skip")) {
    skipIntro();
  }
  const scrollParam = new URLSearchParams(location.search).get("scroll");
  if (scrollParam) {
    document.body.classList.remove("is-locked");
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, parseInt(scrollParam, 10));
    document.documentElement.scrollTop = parseInt(scrollParam, 10);
    document.body.scrollTop = parseInt(scrollParam, 10);
  }

  /* =========================================================================
     4 · SCROLL REVEALS + PARALLAX
     ====================================================================== */
  let parallaxLayers = [];

  function initObservers() {
    /* fade elements in as they arrive */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));

    /* lazy-load the map when it nears the viewport */
    const map = $("#mapFrame");
    if (map) {
      const q = CONFIG.venues[CONFIG.venues.mapFor] || CONFIG.venues.ceremony;
      map.dataset.src = `https://www.google.com/maps?q=${encodeURIComponent(q.mapQuery)}&z=15&output=embed`;
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { map.src = map.dataset.src; obs.disconnect(); }
        });
      }, { rootMargin: "300px" }).observe(map);
    }

    parallaxLayers = $$(".lyr[data-speed]").map((el) => ({
      el,
      speed: parseFloat(el.dataset.speed) || 0,
      depth: parseFloat(el.dataset.depth) || 1
    }));
  }

  /* gentle depth: layers drift at different rates while the scene is pinned,
     plus a subtle pointer/tilt shift for atmosphere (skipped under reduced motion) */
  let ticking = false;
  let tiltX = 0, tiltY = 0;
  function onScroll() {
    if (ticking || reduced || !parallaxLayers.length) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, 900);   // cap so no layer ever exposes an edge
      parallaxLayers.forEach(({ el, speed, depth }) => {
        const sy = (y * speed) / 600;
        el.style.transform =
          `translate3d(${(tiltX * depth).toFixed(2)}px, ${(sy + tiltY * depth).toFixed(2)}px, 0)`;
      });
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  function setTilt(nx, ny) {   // nx, ny in [-1, 1]
    tiltX = nx * 10;
    tiltY = ny * 7;
    onScroll();
  }
  if (!reduced) {
    window.addEventListener("pointermove", (e) => {
      setTilt((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }, { passive: true });
    window.addEventListener("deviceorientation", (e) => {
      if (e.gamma == null || e.beta == null) return;
      setTilt(Math.max(-1, Math.min(1, e.gamma / 30)), Math.max(-1, Math.min(1, (e.beta - 45) / 30)));
    }, { passive: true });
  }

  /* retire the "scroll" cue as soon as the guest starts moving */
  const sceneCue = $("#sceneCue");
  window.addEventListener("scroll", () => {
    sceneCue.classList.toggle("is-hidden", window.scrollY > 60);
  }, { passive: true });

  /* =========================================================================
     5 · COUNTDOWN
     ====================================================================== */
  const cd = { d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs") };
  function tick() {
    const diff = when - new Date();
    if (diff <= 0) {
      $("#countdownGrid").innerHTML =
        '<p class="script" style="font-size:2.4rem">Today we say I do</p>';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / 864e5);
    const hrs  = Math.floor((diff / 36e5) % 24);
    const min  = Math.floor((diff / 6e4) % 60);
    const sec  = Math.floor((diff / 1e3) % 60);
    cd.d.textContent = pad(days);
    cd.h.textContent = pad(hrs);
    cd.m.textContent = pad(min);
    cd.s.textContent = pad(sec);
  }
  const timer = setInterval(tick, 1000);
  tick();

  /* =========================================================================
     6 · CALENDAR + SHARE
     ====================================================================== */
  const icsStamp = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  const start = new Date(when);
  const end = new Date(when.getTime() + 6 * 36e5);
  const details = `${NAMES} are getting married. ${EVENT.timeLabel}. Reception to follow at ${CONFIG.venues.reception.name}.`;

  $("#calGoogle").href =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(NAMES + " — Wedding")}` +
    `&dates=${icsStamp(start)}/${icsStamp(end)}` +
    `&details=${encodeURIComponent(details)}` +
    `&location=${encodeURIComponent(CONFIG.venues.ceremony.name + ", " + CONFIG.venues.ceremony.address)}`;

  $("#calIcs").addEventListener("click", () => {
    const esc = (t) => String(t).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Wedding//Invite//EN", "BEGIN:VEVENT",
      `UID:${Date.now()}@wedding`,
      `DTSTAMP:${icsStamp(new Date())}`,
      `DTSTART:${icsStamp(start)}`,
      `DTEND:${icsStamp(end)}`,
      `SUMMARY:${esc(NAMES + " — Wedding")}`,
      `DESCRIPTION:${esc(details)}`,
      `LOCATION:${esc(CONFIG.venues.ceremony.name + ", " + CONFIG.venues.ceremony.address)}`,
      "END:VEVENT", "END:VCALENDAR"
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "wedding-invitation.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });

  $("#shareBtn").addEventListener("click", async (e) => {
    const btn = e.currentTarget;
    const data = { title: CONFIG.share.title, text: CONFIG.share.description, url: location.href };
    try {
      if (navigator.share) { await navigator.share(data); return; }
      await navigator.clipboard.writeText(location.href);
      const old = btn.textContent;
      btn.textContent = "Link copied";
      setTimeout(() => (btn.textContent = old), 2200);
    } catch (_) { /* user dismissed the share sheet */ }
  });

  /* =========================================================================
     7 · GALLERY + LIGHTBOX
     ====================================================================== */
  const track = $("#galTrack");
  const dotsBox = $("#galDots");
  CONFIG.gallery.forEach((item, idx) => {
    const li = document.createElement("li");
    li.className = "gal__item";
    li.innerHTML = `<img alt="" loading="lazy" decoding="async" width="900" height="1350">`;
    const img = $("img", li);
    img.src = item.src;
    img.alt = item.alt || "";
    li.addEventListener("click", () => openLightbox(idx));
    track.append(li);

    const dot = document.createElement("button");
    dot.className = "gal__dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to photo ${idx + 1}`);
    dot.addEventListener("click", () => scrollToItem(idx));
    dotsBox.append(dot);
  });

  const items = $$(".gal__item", track);
  const dots = $$(".gal__dot", dotsBox);
  const scrollToItem = (i) =>
    items[i].scrollIntoView({ behavior: reduced ? "auto" : "smooth", inline: "center", block: "nearest" });
  const currentIndex = () => {
    const mid = track.scrollLeft + track.clientWidth / 2;
    let best = 0, dist = Infinity;
    items.forEach((el, i) => {
      const d = Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid);
      if (d < dist) { dist = d; best = i; }
    });
    return best;
  };
  const syncDots = () => { const i = currentIndex(); dots.forEach((d, k) => d.classList.toggle("is-on", k === i)); };
  track.addEventListener("scroll", () => requestAnimationFrame(syncDots), { passive: true });
  $("#galPrev").addEventListener("click", () => scrollToItem(Math.max(0, currentIndex() - 1)));
  $("#galNext").addEventListener("click", () => scrollToItem(Math.min(items.length - 1, currentIndex() + 1)));
  syncDots();

  /* lightbox */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap");
  let lbIndex = 0, lastFocus = null;

  function renderLightbox(i) {
    lbIndex = (i + CONFIG.gallery.length) % CONFIG.gallery.length;
    const item = CONFIG.gallery[lbIndex];
    lbImg.src = item.src;
    lbImg.alt = item.alt || "";
    lbCap.textContent = item.alt || "";
  }
  function openLightbox(i) {
    lastFocus = document.activeElement;
    renderLightbox(i);
    lb.hidden = false;
    $("#lbClose").focus();
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => renderLightbox(lbIndex - 1));
  $("#lbNext").addEventListener("click", () => renderLightbox(lbIndex + 1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  window.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") renderLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") renderLightbox(lbIndex + 1);
  });

  /* swipe in the lightbox */
  let touchX = null;
  lb.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 45) renderLightbox(lbIndex + (dx < 0 ? 1 : -1));
    touchX = null;
  }, { passive: true });

  /* =========================================================================
     8 · RSVP FORM
     ====================================================================== */
  const form = $("#rsvpForm"), success = $("#rsvpSuccess"), errorBox = $("#formError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.hidden = true;

    const fields = form.elements;               // NB: form.name would hit the form's own name
    if (!fields.name.value.trim()) {
      errorBox.textContent = "Please tell us your name.";
      errorBox.hidden = false;
      fields.name.focus();
      return;
    }
    if (!fields.attending.value) {
      errorBox.textContent = "Please let us know if you can join us.";
      errorBox.hidden = false;
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.couple = NAMES;
    payload.guestParam = guest || "";
    payload.submittedAt = new Date().toISOString();

    if (CONFIG.rsvp.endpoint) {
      try {
        const res = await fetch(CONFIG.rsvp.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("bad response");
        showSuccess(payload);
      } catch (_) {
        errorBox.textContent = "Something went wrong sending your reply — please try the email link below.";
        errorBox.hidden = false;
      }
    } else {
      /* no backend configured → hand the reply to the guest's mail app */
      const mail = document.createElement("a");
      mail.className = "btn btn--solid";
      mail.href = buildMailto(form);
      mail.textContent = "Send my reply by email";
      showSuccess(payload, "Your details are ready — tap below and press send in your mail app.", mail);
    }
  });

  function showSuccess(payload, note, extraNode) {
    const attending = /yes/i.test(payload.attending || "");
    $("#thanksText").textContent = note ||
      (attending
        ? "Wonderful — your response has been received. We cannot wait to celebrate with you."
        : "Thank you for letting us know — you will be dearly missed, and raising a glass to you in spirit.");
    const old = $("#rsvpSuccess .btn");
    if (old && old.id !== "rsvpAgain") old.remove();
    if (extraNode) $("#thanksText").after(extraNode);
    form.hidden = true;
    success.hidden = false;
    success.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
  }

  $("#rsvpAgain").addEventListener("click", () => {
    success.hidden = true;
    form.hidden = false;
    form.reset();
    $("#fName").focus();
  });

  /* =========================================================================
     9 · MUSIC  (never autoplays; falls back to a soft generated pad)
     ====================================================================== */
  const musicBtn = $("#musicBtn"), musicLabel = $("#musicLabel"), audio = $("#musicAudio");
  let playing = false, ctx = null, master = null, voices = [];

  function buildPad() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain();
    master.gain.value = 0;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    master.connect(filter).connect(ctx.destination);

    /* a slow, warm chord with a gentle breathing volume */
    [220, 277.18, 329.63, 415.3].forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i % 2 ? "triangle" : "sine";
      osc.frequency.value = f;
      g.gain.value = 0.16 - i * 0.02;
      osc.connect(g).connect(master);
      osc.start();

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.value = 0.05 + i * 0.017;
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain).connect(g.gain);
      lfo.start();
      voices.push(osc, lfo);
    });
  }

  musicBtn.addEventListener("click", async () => {
    playing = !playing;
    musicBtn.setAttribute("aria-pressed", String(playing));
    musicLabel.textContent = playing ? "Music on" : "Music off";
    musicBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");

    if (CONFIG.music.src) {                       // real track supplied
      if (!audio.src) audio.src = CONFIG.music.src;
      audio.volume = CONFIG.music.volume;
      playing ? audio.play().catch(() => {}) : audio.pause();
      return;
    }
    if (!ctx) buildPad();                          // generated ambience
    if (ctx.state === "suspended") await ctx.resume();
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.linearRampToValueAtTime(playing ? CONFIG.music.volume * 0.5 : 0, t + 1.6);
  });

  /* =========================================================================
     10 · DRIFTING PETALS
     ====================================================================== */
  function startPetals() {
    if (reduced) return;
    const canvas = $("#petals");
    const ctx2d = canvas.getContext("2d");
    /* sprite sheet: 4 soft petals in a row (assets/petals-sprite.webp).
       Falls back to drawn shapes if the file is ever missing. */
    const sprite = new Image();
    sprite.src = "assets/petals-sprite.webp";
    let spriteOk = false;
    sprite.onload = () => { spriteOk = true; };
    sprite.onerror = () => { spriteOk = false; };
    const TINTS = ["rgba(255,253,251,", "rgba(243,201,207,", "rgba(205,191,224,", "rgba(228,201,138,"];
    let w = 0, h = 0, dpr = 1, petals = [];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function make(initial) {
      const dust = Math.random() < 0.3;   // golden dust motes drift with the petals
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : -24,
        r: dust ? 1 + Math.random() * 2 : 5 + Math.random() * 11,
        vy: dust ? 0.12 + Math.random() * 0.25 : 0.25 + Math.random() * 0.6,
        sway: 0.4 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02,
        rot: Math.random() * Math.PI,
        frame: (Math.random() * 4) | 0,
        blur: dust ? 1 : 0,
        alpha: dust ? 0.35 + Math.random() * 0.3 : 0.55 + Math.random() * 0.35,
        tint: TINTS[(Math.random() * TINTS.length) | 0]
      };
    }

    function draw() {
      ctx2d.clearRect(0, 0, w, h);
      petals.forEach((p) => {
        p.phase += 0.012;
        p.y += p.vy;
        p.x += Math.sin(p.phase) * p.sway;
        p.rot += p.spin;
        if (p.y > h + 30) Object.assign(p, make(false));
        ctx2d.save();
        ctx2d.globalAlpha = p.alpha;
        if (p.blur) ctx2d.filter = `blur(${p.blur}px)`;
        ctx2d.translate(p.x, p.y);
        ctx2d.rotate(p.rot);
        if (spriteOk) {
          const s = 128, dSize = p.r * 2;
          ctx2d.drawImage(sprite, p.frame * s, 0, s, s, -dSize / 2, -dSize / 2, dSize, dSize);
        } else {
          ctx2d.fillStyle = p.tint + "0.85)";
          ctx2d.beginPath();
          ctx2d.moveTo(0, -p.r);
          ctx2d.bezierCurveTo(p.r, -p.r * 0.4, p.r * 0.7, p.r * 0.8, 0, p.r);
          ctx2d.bezierCurveTo(-p.r * 0.7, p.r * 0.8, -p.r, -p.r * 0.4, 0, -p.r);
          ctx2d.fill();
        }
        ctx2d.restore();
      });
      ctx2d.filter = "none";
      if (!document.hidden) requestAnimationFrame(draw);
      else setTimeout(() => requestAnimationFrame(draw), 400);
    }

    resize();
    window.addEventListener("resize", resize);
    const count = window.innerWidth < 640 ? 14 : 24;
    petals = Array.from({ length: count }, () => make(true));
    requestAnimationFrame(draw);
  }

  /* pause the audio when the tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !playing) return;
    document.hidden ? ctx.suspend() : ctx.resume();
  });
})();
