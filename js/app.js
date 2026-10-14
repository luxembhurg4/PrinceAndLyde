/* =============================================================================
   PRINCE & LYDE · WEDDING INVITATION
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
  const month = when.toLocaleDateString(undefined, { month: "long" });
  const spokenDate = when.toLocaleDateString(undefined, {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  bindText("partner1", COUPLE.partner1);
  bindText("partner2", COUPLE.partner2);
  bindText("coupleNames", NAMES);
  bindText("weekday", when.toLocaleDateString(undefined, { weekday: "long" }));
  bindText("day", String(when.getDate()));
  bindText("month", month);
  bindText("year", String(when.getFullYear()));
  bindText("fullDate", `${when.getDate()} ${month} ${when.getFullYear()}`);
  bindText("ceremonyTime", when.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }));
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

  /* monogram: two overlapping script initials (wax seal + invitation hero) */
  bindText("monoA", (COUPLE.monogram[0] || "").trim());
  bindText("monoB", (COUPLE.monogram[1] || COUPLE.monogram[0] || "").trim());

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

  /* dress-code swatches: colour, name, who wears it */
  const swatchList = $("#swatches");
  CONFIG.dressCode.palette.forEach((c) => {
    const li = document.createElement("li");
    li.className = "swatch";
    li.innerHTML = `<span class="swatch__dot"></span><span class="swatch__name"></span><span class="swatch__wear"></span>`;
    $(".swatch__dot", li).style.background = c.hex;
    $(".swatch__name", li).textContent = c.name;
    $(".swatch__wear", li).textContent = c.wear || "";
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
  /* "Write to us instead" carries whatever the guest has typed so far */
  $("#mailtoLink").addEventListener("click", (e) => { e.currentTarget.href = buildMailto($("#rsvpForm")); });

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
    const greeting = $("#greeting");
    greeting.textContent = `Dear ${safe},`;
    greeting.hidden = false;
    const hello = $("#rsvpHello");
    hello.textContent = `Dear ${safe},`;
    hello.hidden = false;
    $("#fName").value = safe;
  }

  /* =========================================================================
     3 · ENVELOPE INTRO  (timings follow the Figma "Continuous motion" frame)
     tap → seal pressed → flap hinges open, lining + pocket rise → pocket hinges
     open downward, gate card grows to full screen → dissolves into the bow
     screen → bow words fade in one by one
     ====================================================================== */
  const intro = $("#intro");
  const bow = $("#reveal");
  const stage = $("#stage");
  const sealBtn = $("#sealBtn");
  const OPEN = 250, UNFOLD = OPEN + 3000, LEAVE = UNFOLD + 1800, DONE = LEAVE + 800;
  let opened = false;
  let timers = [];

  /* decode the hidden layers now so the first frame of the opening isn't blank */
  $$("#intro img, .stage__art").forEach((img) => img.decode && img.decode().catch(() => {}));

  function afterIntro() {
    intro.classList.add("is-gone");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-ready");
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

    if (reduced) {                       // no cinematic sequence needed
      skipIntro();
      return;
    }
    timers.push(setTimeout(() => intro.classList.add("is-open"), OPEN));
    timers.push(setTimeout(() => intro.classList.add("is-unfolding"), UNFOLD));
    timers.push(setTimeout(() => intro.classList.add("is-leaving"), LEAVE));
    timers.push(setTimeout(() => bow.classList.add("is-shown"), LEAVE + 300));
    timers.push(setTimeout(afterIntro, DONE));
  }

  function skipIntro() {
    timers.forEach(clearTimeout);
    timers = [];
    bow.classList.add("is-shown");
    afterIntro();
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

  /* =========================================================================
     4 · SCROLL REVEALS
     ====================================================================== */
  function initObservers() {
    /* fade elements in as they arrive */
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    $$(".reveal").forEach((el) => io.observe(el));

    /* pinned backdrop: the gate crossfades to the arch as the invitation scrolls in */
    new IntersectionObserver(([e]) => stage.classList.toggle("is-hero", e.isIntersecting),
      { threshold: 0.45 }).observe($("#invitation"));

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
  }

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
  const musicBtn = $("#musicBtn"), audio = $("#musicAudio");
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
    const TINTS = ["rgba(251,244,236,", "rgba(245,202,165,", "rgba(240,210,182,", "rgba(219,176,130,"];
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

  /* =========================================================================
     11 · PETAL TRAIL  — reacts to how much the guest touches:
     faster / longer strokes lay more buds and throw more petals further,
     a firmer press (touch force / pen pressure) adds more, taps burst.
     ====================================================================== */
  if (!reduced) {
    const MAX_LIVE = 100;
    let live = 0, last = null, carry = 0;
    const rand = (a, b) => a + Math.random() * (b - a);

    function spawn(x, y, o) {
      if (live >= MAX_LIVE) return;
      live++;
      const el = document.createElement("span");
      el.className = "trail";
      el.style.cssText =
        `left:${x.toFixed(1)}px;top:${y.toFixed(1)}px;--s:${o.size.toFixed(1)}px;--f:${o.frame};` +
        `--a:${o.angle | 0}deg;--dx:${o.dx.toFixed(1)}px;--dy:${o.dy.toFixed(1)}px;--fall:${o.fall.toFixed(1)}px;` +
        `--rz:${o.rz | 0}deg;--rx:${o.rx | 0}deg;--ry:${o.ry | 0}deg;--life:${o.life | 0}ms`;
      el.addEventListener("animationend", () => { el.remove(); live--; });
      document.body.append(el);
    }

    /* a bud resting on the stroke, aligned to its direction */
    const bud = (x, y, dir, k) => spawn(x + rand(-4, 4), y + rand(-4, 4), {
      frame: 8 + ((Math.random() * 4) | 0), size: rand(18, 26) * (0.85 + k * 0.15),
      angle: dir + 90 + rand(-25, 25), dx: rand(-6, 6), dy: rand(-2, 6), fall: rand(10, 24),
      rz: rand(-30, 30), rx: rand(-20, 20), ry: rand(-20, 20), life: rand(1500, 2100)
    });
    /* a loose petal flung off the stroke, tumbling as it falls */
    const petal = (x, y, dir, k) => {
      const throwAngle = (dir + (Math.random() < 0.5 ? 90 : -90) + rand(-50, 50)) * Math.PI / 180;
      const reach = rand(14, 46) * k;
      spawn(x, y, {
        frame: (Math.random() * 8) | 0, size: rand(12, 22) * (0.8 + k * 0.2),
        angle: rand(0, 360), dx: Math.cos(throwAngle) * reach, dy: Math.sin(throwAngle) * reach * 0.6,
        fall: rand(40, 110), rz: rand(-260, 260), rx: rand(-320, 320), ry: rand(-320, 320),
        life: rand(1800, 2800)
      });
    };

    /* amount of touch: speed of the stroke × pressure (where the device reports it) */
    function stroke(x, y, t, pressure) {
      if (!last) { last = { x, y, t }; return; }
      const dx = x - last.x, dy = y - last.y, d = Math.hypot(dx, dy);
      if (d < 2) return;
      const speed = d / Math.max(16, t - last.t);                    // px per ms
      const k = Math.min(2.6, Math.max(0.35, speed / 0.5)) * (0.6 + pressure);
      const dir = Math.atan2(dy, dx) * 180 / Math.PI;
      const step = 22 / Math.min(2, k);                              // denser buds when stronger
      carry += d;
      while (carry >= step) {                                        // lay buds along the path
        carry -= step;
        const f = 1 - carry / d;
        bud(last.x + dx * f, last.y + dy * f, dir, k);
      }
      const loose = Math.round(k * rand(0.6, 1.8));                  // throw petals off it
      for (let i = 0; i < loose; i++) petal(x, y, dir, k);
      last = { x, y, t };
    }
    function burst(x, y, pressure) {                                 // a tap / press
      const n = 5 + Math.round(pressure * 8);
      for (let i = 0; i < n; i++) petal(x, y, rand(0, 360), 0.8 + pressure);
      bud(x, y, rand(0, 360), 1);
      last = null; carry = 0;
    }
    const force = (p) => (p > 0 && p !== 0.5 ? p : 0.5);              // 0.5 = "unknown" on most devices

    window.addEventListener("touchstart", (e) => {
      const p = e.touches[0];
      burst(p.clientX, p.clientY, force(p.force || 0));
      last = { x: p.clientX, y: p.clientY, t: e.timeStamp };
    }, { passive: true });
    window.addEventListener("touchmove", (e) => {
      const p = e.touches[0];
      stroke(p.clientX, p.clientY, e.timeStamp, force(p.force || 0));
    }, { passive: true });
    window.addEventListener("touchend", () => { last = null; carry = 0; }, { passive: true });

    window.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "touch") burst(e.clientX, e.clientY, force(e.pressure));
    }, { passive: true });
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      stroke(e.clientX, e.clientY, e.timeStamp, e.buttons ? force(e.pressure) : 0.25);   // hover is lighter
    }, { passive: true });
  }

  /* pause the audio when the tab is hidden */
  document.addEventListener("visibilitychange", () => {
    if (!ctx || !playing) return;
    document.hidden ? ctx.suspend() : ctx.resume();
  });
})();
