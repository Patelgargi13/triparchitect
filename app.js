// ════════════════════════════════════════════════
//   TripArchitect — app.js  (Cohere Only)
//   By Gargi Patel
// ════════════════════════════════════════════════

/* ══════════════════════════════════════
   DESTINATION IMAGE MAP
══════════════════════════════════════ */
const DEST_IMAGES = {
  paris:      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  bali:       "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
  tokyo:      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
  santorini:  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
  dubai:      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
  maldives:   "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80",
  rome:       "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80",
  bangkok:    "https://images.unsplash.com/photo-1563492065599-3520f775eeed?w=800&q=80",
  london:     "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80",
  barcelona:  "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&q=80",
  amsterdam:  "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=800&q=80",
  istanbul:   "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80",
  "new york": "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&q=80",
  nyc:        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800&q=80",
  sydney:     "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  singapore:  "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80",
  prague:     "https://images.unsplash.com/photo-1541849546-216549ae216d?w=800&q=80",
  kyoto:      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
  default:    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
};

function getDestImage(dest) {
  const d = dest.toLowerCase();
  for (const [key, url] of Object.entries(DEST_IMAGES)) {
    if (d.includes(key)) return url;
  }
  return DEST_IMAGES.default;
}

/* ══════════════════════════════════════
   PLANE TRANSITION
══════════════════════════════════════ */
const PlaneTransition = (function () {
  let isAnimating = false;

  function sweep(onMid, onDone) {
    if (isAnimating) { if (onMid) onMid(); return; }
    isAnimating = true;

    const overlay = document.getElementById("plane-overlay");
    const plane   = document.getElementById("pt-plane");
    const trail   = document.getElementById("pt-trail-line");

    overlay.classList.add("active");
    plane.classList.remove("fly");
    trail.classList.remove("draw");
    void plane.offsetWidth;

    plane.classList.add("fly");
    trail.classList.add("draw");

    setTimeout(() => { if (onMid) onMid(); }, 420);

    setTimeout(() => {
      overlay.classList.remove("active");
      plane.classList.remove("fly");
      trail.classList.remove("draw");
      isAnimating = false;
      if (onDone) onDone();
    }, 900);
  }

  return { sweep };
})();

/* ══════════════════════════════════════
   PAGE NAVIGATION
══════════════════════════════════════ */
function showPage(id) {
  PlaneTransition.sweep(() => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("pg-" + id).classList.add("active");
    document.querySelectorAll(".nl").forEach(n => n.classList.remove("active"));
    const nb = document.getElementById("nav-" + id);
    if (nb) nb.classList.add("active");
    window.scrollTo(0, 0);
    updateNavStyle();
  });
}

/* ══════════════════════════════════════
   QUICK PLAN — from destination cards
══════════════════════════════════════ */
function quickPlan(destination) {
  PlaneTransition.sweep(() => {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById("pg-start").classList.add("active");
    document.querySelectorAll(".nl").forEach(n => n.classList.remove("active"));
    const nb = document.getElementById("nav-start");
    if (nb) nb.classList.add("active");
    window.scrollTo(0, 0);
    updateNavStyle();
    setTimeout(() => {
      const inp = document.getElementById("f-dest");
      if (inp) {
        inp.value = destination;
        inp.focus();
        inp.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  });
}

/* ══════════════════════════════════════
   NAV SCROLL STYLE
══════════════════════════════════════ */
function updateNavStyle() {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  const activePage = document.querySelector(".page.active");
  if (!activePage) return;
  const hasHero = activePage.querySelector(".hero, .page-hero");
  if (hasHero) nav.classList.remove("scrolled");
  else nav.classList.add("scrolled");
}

/* ══════════════════════════════════════
   HERO SLIDESHOW
══════════════════════════════════════ */
let slideIndex = 0;
function goSlide(n) {
  const slides = document.querySelectorAll(".hero-slide");
  const dots   = document.querySelectorAll(".sdot");
  if (!slides.length) return;
  slides[slideIndex].classList.remove("active");
  dots[slideIndex]?.classList.remove("active");
  slideIndex = (n !== undefined) ? n : (slideIndex + 1) % slides.length;
  slides[slideIndex].classList.add("active");
  dots[slideIndex]?.classList.add("active");
}
setInterval(() => goSlide(), 5000);

/* ══════════════════════════════════════
   LOAD SPLASH
══════════════════════════════════════ */
(function initSplash() {
  const splash   = document.getElementById("load-splash");
  const splane   = document.getElementById("splash-plane");
  const trail    = document.getElementById("splash-trail");
  const logo     = document.getElementById("splash-logo");
  const welcome  = document.getElementById("splash-welcome");
  const creator  = document.getElementById("splash-creator");
  const tagline  = document.getElementById("splash-tagline");
  if (!splash) return;

  setTimeout(() => {
    if (welcome) welcome.classList.add("show");
    if (creator) creator.classList.add("show");

    setTimeout(() => {
      splane.classList.add("fly");

      setTimeout(() => {
        trail.classList.add("grow");
        logo.classList.add("show");
        if (tagline) tagline.classList.add("show");

        setTimeout(() => {
          splash.classList.add("out");
          setTimeout(() => {
            splash.remove();
            document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
            document.getElementById("pg-home").classList.add("active");
            const nb = document.getElementById("nav-home");
            if (nb) nb.classList.add("active");
            updateNavStyle();
          }, 700);
        }, 2000);
      }, 700);
    }, 800);
  }, 400);
})();

/* ══════════════════════════════════════
   SCROLL → NAV STYLE
══════════════════════════════════════ */
window.addEventListener("scroll", () => {
  const nav = document.getElementById("main-nav");
  if (!nav) return;
  if (window.scrollY > 60) nav.classList.add("scrolled");
  else updateNavStyle();
});

/* ══════════════════════════════════════
   TRIP STYLE SELECTOR
══════════════════════════════════════ */
function selStyle(el) {
  document.querySelectorAll(".style-card").forEach(c => c.classList.remove("sel"));
  el.classList.add("sel");
}
function getSelStyle() {
  const s = document.querySelector(".style-card.sel");
  return s ? s.dataset.style : "Adventure";
}

/* ══════════════════════════════════════
   RESULT TAB SWITCHER
══════════════════════════════════════ */
function switchTab(id, btn) {
  document.querySelectorAll(".rtab-content").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".rtab").forEach(t => t.classList.remove("active"));
  document.getElementById("tab-" + id).classList.add("active");
  btn.classList.add("active");
  if (id === "map") setTimeout(() => { if (window._tripMap) window._tripMap.invalidateSize(); }, 200);
}

/* ══════════════════════════════════════
   HELPERS
══════════════════════════════════════ */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function setStep(stepId, state) {
  const el = document.getElementById(stepId);
  if (!el) return;
  el.classList.remove("active", "done");
  if (state) el.classList.add(state);
}

function setLoaderMsg(msg) {
  const el = document.querySelector(".loader-text");
  if (el) el.innerHTML = msg + '<span class="loader-dots"><span>.</span><span>.</span><span>.</span></span>';
}

/* ══════════════════════════════════════
   ✅ READ COHERE API KEY
   Reads ENV.COHERE_API_KEY (set by server.js)
══════════════════════════════════════ */
function getApiKey() {
  if (typeof ENV !== "undefined" && ENV.COHERE_API_KEY) return ENV.COHERE_API_KEY;
  return "";
}

/* ══════════════════════════════════════
   ✅ COHERE API CALL
   Uses Cohere v2 /chat endpoint
   Docs: docs.cohere.com/reference/chat
══════════════════════════════════════ */
async function callCohere(prompt, key) {
  const apiKey = key || getApiKey();
  if (!apiKey) throw new Error("Cohere API key missing. Add COHERE_API_KEY to .env and restart server.js");

  const res = await fetch(ENV.COHERE_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "X-Client-Name": "TripArchitect",
    },
    body: JSON.stringify({
      model:       ENV.COHERE_MODEL,
      messages:    [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens:  2048,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.message ||
      err.error?.message ||
      `Cohere API error ${res.status}: ${res.statusText}`
    );
  }

  const data = await res.json();

  // Cohere v2 response shape: data.message.content[0].text
  const text =
    data.message?.content?.[0]?.text ||   // v2 format
    data.text ||                            // fallback
    data.generations?.[0]?.text ||         // legacy format
    "";

  if (!text) {
    console.error("Unexpected Cohere response shape:", JSON.stringify(data).slice(0, 300));
    throw new Error("Cohere returned an empty response. Check your API key and model name.");
  }

  return text;
}

/* ══════════════════════════════════════
   MAIN GENERATE FUNCTION
══════════════════════════════════════ */
async function generateTrip() {
  const key = getApiKey();
  if (!key) {
    alert(
      "❌ Cohere API key missing!\n\n" +
      "Steps to fix:\n" +
      "1. Open .env in your project folder\n" +
      "2. Make sure it has: COHERE_API_KEY=your_key\n" +
      "3. Get a FREE key at: dashboard.cohere.com\n" +
      "4. Restart server.js (Ctrl+C, then node server.js)\n" +
      "5. Refresh this page"
    );
    return;
  }

  const dest      = document.getElementById("f-dest").value.trim();
  const startDate = document.getElementById("f-start").value;
  const endDate   = document.getElementById("f-end").value;
  const travelers = document.getElementById("f-travelers").value;
  const budget    = document.getElementById("f-budget").value;
  const style     = getSelStyle();

  if (!dest)      { alert("Please enter a destination!"); return; }
  if (!startDate) { alert("Please select a start date!"); return; }
  if (!endDate)   { alert("Please select an end date!"); return; }
  if (new Date(endDate) < new Date(startDate)) { alert("End date must be after start date!"); return; }

  const days = Math.max(1, Math.round((new Date(endDate) - new Date(startDate)) / 86400000) + 1);

  const genBtn = document.getElementById("gen-btn");
  genBtn.disabled = true;
  document.getElementById("loader").classList.add("show");
  document.getElementById("result-box").classList.remove("show");
  document.getElementById("export-row").classList.add("hidden");

  ["lsb1","lsb2","lsb3","lsb4","lsb5","lsb6"].forEach(id => setStep(id, ""));

  try {
    // ── Step 1: Free APIs (weather, country, phrases) in parallel ──
    setLoaderMsg("📍 Fetching destination info");
    setStep("lsb1", "active");
    const [weatherData, countryData, phrases] = await Promise.all([
      fetchWeather(dest),
      fetchCountry(dest),
      fetchPhrases(dest),
    ]);
    setStep("lsb1", "done");

    // ── Step 2: Itinerary ──
    setLoaderMsg("✈️ Crafting your day-by-day itinerary");
    setStep("lsb2", "active");
    const itinerary = await genItinerary(dest, days, travelers, budget, style, startDate, endDate, key);
    setStep("lsb2", "done");
    await sleep(300); // small pause so user sees progress steps

    // ── Step 3: Packing ──
    setLoaderMsg("🧳 Building your packing list");
    setStep("lsb3", "active");
    const packingItems = await genPacking(dest, days, style, key);
    setStep("lsb3", "done");
    await sleep(300);

    // ── Step 4: Emergency ──
    setLoaderMsg("🚨 Gathering emergency contacts");
    setStep("lsb4", "active");
    const emergencyData = await genEmergency(dest, key);
    setStep("lsb4", "done");
    await sleep(300);

    // ── Step 5: Budget ──
    setLoaderMsg("💰 Estimating your budget");
    setStep("lsb5", "active");
    const budgetData = await genBudget(dest, days, budget, key);
    setStep("lsb5", "done");
    await sleep(300);

    // ── Step 6: Festivals ──
    setLoaderMsg("🎉 Finding festivals & events");
    setStep("lsb6", "active");
    const festivalsText = await genFestivals(dest, startDate, endDate, key);
    setStep("lsb6", "done");

    // ── Render ──
    renderItinerary(itinerary, dest, days);
    renderWeather(weatherData, dest);
    renderCountry(countryData, dest);
    renderMap(dest);
    renderPhrases(phrases, dest);
    renderPacking(packingItems);
    renderEmergency(emergencyData, dest);
    renderBudget(budgetData, days, budget);
    renderFestivals(festivalsText, dest);

    const hdr = document.getElementById("result-dest-header");
    if (hdr) hdr.innerHTML = `✈ Your ${days}-day trip to <em style="font-style:italic;color:var(--gold2)">${escHtml(dest)}</em> is ready!`;

    document.getElementById("result-box").classList.add("show");
    document.getElementById("export-row").classList.remove("hidden");
    document.getElementById("result-box").scrollIntoView({ behavior: "smooth" });

  } catch (err) {
    console.error("TripArchitect error:", err);
    alert(
      "❌ Error: " + err.message + "\n\n" +
      "Common fixes:\n" +
      "• Check COHERE_API_KEY is correct in .env\n" +
      "• Get a free key at dashboard.cohere.com\n" +
      "• Restart server.js after any .env change\n" +
      "• Check your internet connection"
    );
  }

  genBtn.disabled = false;
  document.getElementById("loader").classList.remove("show");
}

/* ══════════════════════════════════════
   AI GENERATORS — all use callCohere()
══════════════════════════════════════ */

async function genItinerary(dest, days, travelers, budget, style, startDate, endDate, key) {
  return await callCohere(
    `You are an expert travel planner. Create a vivid, detailed ${days}-day itinerary for ${dest}.

Trip details:
- Travelers: ${travelers}
- Budget: ${budget}
- Style: ${style}
- Dates: ${startDate} to ${endDate}

Format EXACTLY like this (no extra text before DAY 1):
DAY 1: [Exciting Day Theme Title]
MORNING: [Detailed morning — specific places, how to get there, timings]
AFTERNOON: [Detailed afternoon — specific landmarks, experiences, food spots]
EVENING: [Evening — restaurants, nightlife, sunset spots]
LOCAL TIP: [One unique insider tip]
---
DAY 2: [Theme]
...continue for all ${days} days

Be specific: real place names, transport options, approximate timings.`,
    key
  );
}

async function genPacking(dest, days, style, key) {
  const raw = await callCohere(
    `Generate a packing list for a ${days}-day ${style} trip to ${dest}.
Return ONLY a valid JSON array, no markdown, no backticks, no explanation:
[{"emoji":"👕","item":"T-shirts"},{"emoji":"👟","item":"Walking shoes"},...]
Include 20-22 items covering: clothing, footwear, toiletries, documents, tech, health, destination-specific items.`,
    key
  );
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return [
      {emoji:"👕",item:"T-shirts"},{emoji:"👖",item:"Trousers"},
      {emoji:"👟",item:"Walking Shoes"},{emoji:"🧥",item:"Light Jacket"},
      {emoji:"🩲",item:"Underwear"},{emoji:"🧦",item:"Socks"},
      {emoji:"🛂",item:"Passport"},{emoji:"💳",item:"Cards & Cash"},
      {emoji:"📱",item:"Phone + Charger"},{emoji:"🔋",item:"Power Bank"},
      {emoji:"💊",item:"First Aid Kit"},{emoji:"🧴",item:"Sunscreen SPF50"},
      {emoji:"🪥",item:"Toiletries Bag"},{emoji:"📷",item:"Camera"},
      {emoji:"🎧",item:"Headphones"},{emoji:"🗺️",item:"Offline Maps"},
      {emoji:"🧴",item:"Hand Sanitizer"},{emoji:"🧳",item:"Luggage Lock"},
      {emoji:"🌂",item:"Travel Umbrella"},{emoji:"📓",item:"Travel Journal"},
    ];
  }
}

async function genEmergency(dest, key) {
  const raw = await callCohere(
    `Provide real local emergency contact numbers for ${dest}.
Return ONLY a valid JSON array, no markdown, no backticks:
[{"type":"Police","number":"100","emoji":"👮"},{"type":"Ambulance","number":"108","emoji":"🚑"},{"type":"Fire","number":"101","emoji":"🚒"},{"type":"Tourist Helpline","number":"1800","emoji":"ℹ️"},{"type":"General Emergency","number":"112","emoji":"🆘"}]
Use correct, real numbers for the destination country.`,
    key
  );
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return [
      {type:"Police",number:"112",emoji:"👮"},
      {type:"Ambulance",number:"112",emoji:"🚑"},
      {type:"Fire Brigade",number:"112",emoji:"🚒"},
      {type:"Tourist Help",number:"1800",emoji:"ℹ️"},
      {type:"General SOS",number:"112",emoji:"🆘"},
    ];
  }
}

async function genBudget(dest, days, budgetLevel, key) {
  const raw = await callCohere(
    `Estimate realistic daily travel costs in USD for one person visiting ${dest} at ${budgetLevel} level.
Return ONLY valid JSON, no markdown, no backticks:
{"accommodation":50,"food":30,"transport":15,"activities":20,"misc":10,"currency":"USD","note":"A helpful money tip for this destination"}`,
    key
  );
  try {
    return JSON.parse(raw.replace(/```json|```/g, "").trim());
  } catch {
    return {accommodation:60,food:35,transport:15,activities:25,misc:10,currency:"USD",note:"Prices vary by season — book in advance for better rates."};
  }
}

async function genFestivals(dest, startDate, endDate, key) {
  return await callCohere(
    `List local festivals, cultural events, public holidays and seasonal experiences in ${dest} around ${startDate} to ${endDate}.
Use markdown with emojis. Include: event name, approximate dates, vivid description, what to expect, insider tip. Be enthusiastic and specific!`,
    key
  );
}

/* ══════════════════════════════════════
   FREE APIs (no key needed)
══════════════════════════════════════ */
async function fetchWeather(dest) {
  try {
    const geoRes  = await fetch(`${ENV.WEATHER_GEO}?name=${encodeURIComponent(dest)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();
    if (!geoData.results?.length) return null;
    const { latitude, longitude, name, country } = geoData.results[0];
    window._destLat = latitude;
    window._destLon = longitude;
    const wRes  = await fetch(`${ENV.WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code&timezone=auto&forecast_days=7`);
    const wData = await wRes.json();
    return { ...wData, cityName: name, countryName: country };
  } catch { return null; }
}

async function fetchCountry(dest) {
  for (const q of [dest.split(",")[0].trim(), dest]) {
    try {
      const res  = await fetch(`${ENV.COUNTRY_API}/${encodeURIComponent(q)}?fields=name,flags,capital,currencies,languages,population,region,subregion`);
      const data = await res.json();
      if (Array.isArray(data) && data.length) return data[0];
    } catch { /* try next */ }
  }
  return null;
}

async function fetchPhrases(dest) {
  const travelPhrases = [
    {eng:"Hello",display:"Hello"},{eng:"Thank you",display:"Thank you"},
    {eng:"Please",display:"Please"},{eng:"Help",display:"Help!"},
    {eng:"Where is",display:"Where is...?"},{eng:"How much",display:"How much?"},
    {eng:"Good morning",display:"Good morning"},{eng:"Goodbye",display:"Goodbye"},
    {eng:"Sorry",display:"Sorry / Excuse me"},{eng:"I do not understand",display:"I don't understand"},
    {eng:"Cheers",display:"Cheers!"},{eng:"Delicious",display:"Delicious!"},
  ];
  const langMap = {
    france:"fr",paris:"fr",spain:"es",madrid:"es",barcelona:"es",mexico:"es",
    japan:"ja",tokyo:"ja",osaka:"ja",kyoto:"ja",germany:"de",berlin:"de",
    italy:"it",rome:"it",milan:"it",venice:"it",china:"zh",beijing:"zh",
    brazil:"pt",portugal:"pt",russia:"ru",moscow:"ru",korea:"ko",seoul:"ko",
    dubai:"ar",egypt:"ar",cairo:"ar",bali:"id",indonesia:"id",
    thailand:"th",bangkok:"th",greece:"el",athens:"el",santorini:"el",
    netherlands:"nl",amsterdam:"nl",turkey:"tr",istanbul:"tr",
    india:"hi",delhi:"hi",mumbai:"hi",vietnam:"vi",hanoi:"vi",
    poland:"pl",prague:"cs",
  };
  const lower = dest.toLowerCase();
  let langCode = "en";
  for (const [k,v] of Object.entries(langMap)) {
    if (lower.includes(k)) { langCode = v; break; }
  }
  if (langCode === "en") return travelPhrases.map(p => ({orig:p.display, trans:p.eng}));
  const results = [];
  for (const p of travelPhrases) {
    try {
      const r = await fetch(`${ENV.TRANSLATE_API}?q=${encodeURIComponent(p.eng)}&langpair=en|${langCode}`);
      const d = await r.json();
      results.push({orig:p.display, trans:d.responseData?.translatedText || p.eng});
    } catch { results.push({orig:p.display, trans:p.eng}); }
  }
  return results;
}

/* ══════════════════════════════════════
   RENDER FUNCTIONS
══════════════════════════════════════ */
function renderItinerary(text, dest, days) {
  window._itineraryRaw = text;
  window._tripDest     = dest;

  const out        = document.getElementById("itinerary-out");
  const dayHeaders = text.match(/DAY \d+:[^\n]*/g) || [];
  const dayBodies  = text.split(/DAY \d+:[^\n]*\n/).filter(Boolean);
  const destImg    = getDestImage(dest);

  if (!dayHeaders.length) {
    out.innerHTML = `<div class="prose" style="white-space:pre-line">${text}</div>`;
    return;
  }

  const dayImages = [
    destImg,
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80",
    "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  ];

  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:10px;">
      <div>
        <div style="font-size:12px;color:var(--gray);text-transform:uppercase;letter-spacing:.1em;font-weight:600;margin-bottom:4px;">Your Itinerary</div>
        <h2 style="font-family:'Fraunces',serif;font-size:26px;font-weight:900;color:var(--navy)">${escHtml(dest)} — ${days} Day${days>1?"s":""}</h2>
      </div>
      <div style="background:rgba(26,111,168,.08);color:var(--sky);padding:6px 14px;border-radius:20px;font-size:13px;font-weight:600;">${days} Day${days>1?"s":""} · AI-Planned</div>
    </div>`;

  dayHeaders.forEach((header, i) => {
    const title     = header.replace(/DAY \d+:\s*/, "").trim();
    const body      = dayBodies[i] || "";
    const morning   = (body.match(/MORNING:([\s\S]*?)(?=AFTERNOON:|$)/)?.[1] || "").trim();
    const afternoon = (body.match(/AFTERNOON:([\s\S]*?)(?=EVENING:|$)/)?.[1] || "").trim();
    const evening   = (body.match(/EVENING:([\s\S]*?)(?=LOCAL TIP:|---|$)/)?.[1] || "").trim();
    const tip       = (body.match(/LOCAL TIP:([\s\S]*?)(?=---|$)/)?.[1] || "").trim();
    const imgUrl    = dayImages[i % dayImages.length];

    html += `
      <div class="day-card">
        <div class="day-header">
          <div class="day-num-block">
            <span class="day-label">Day</span>
            <span class="day-number">${i+1}</span>
          </div>
          <div class="day-title-wrap">
            <div class="day-title">${escHtml(title)}</div>
          </div>
        </div>
        <img class="day-dest-img" src="${imgUrl}" alt="${escHtml(dest)} day ${i+1}" loading="lazy" onerror="this.style.display='none'"/>
        <div class="day-body">
          ${morning   ? `<div class="time-slot"><div class="time-label">☀️ Morning</div><div class="time-content">${escHtml(morning)}</div></div>` : ""}
          ${afternoon ? `<div class="time-slot"><div class="time-label">🌤️ Afternoon</div><div class="time-content">${escHtml(afternoon)}</div></div>` : ""}
          ${evening   ? `<div class="time-slot"><div class="time-label">🌙 Evening</div><div class="time-content">${escHtml(evening)}</div></div>` : ""}
          ${tip       ? `<div class="local-tip"><strong>💡 Local Tip: </strong>${escHtml(tip)}</div>` : ""}
        </div>
      </div>`;
  });

  out.innerHTML = html;
}

function renderWeather(data, dest) {
  const out = document.getElementById("weather-out");
  if (!data?.current) {
    out.innerHTML = `<p style="text-align:center;padding:40px;color:var(--gray);">⚠️ Weather data unavailable for "${dest}".</p>`;
    return;
  }
  const c = data.current;
  const wIcons = {0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",51:"🌦️",61:"🌧️",71:"❄️",80:"🌧️",95:"⛈️"};
  const icon   = wIcons[c.weather_code] || "🌡️";
  const daily  = data.daily || {};
  const forecasts = (daily.time||[]).slice(0,7).map((d,i) => ({
    day:  new Date(d).toLocaleDateString("en",{weekday:"short",month:"short",day:"numeric"}),
    icon: wIcons[daily.weather_code?.[i]] || "🌡️",
    max:  daily.temperature_2m_max?.[i]?.toFixed(1)??"—",
    min:  daily.temperature_2m_min?.[i]?.toFixed(1)??"—",
    rain: daily.precipitation_sum?.[i]?.toFixed(1)??"0",
  }));
  out.innerHTML = `
    <div class="weather-widget">
      <div class="w-loc">📍 ${data.cityName}, ${data.countryName}</div>
      <div style="display:flex;align-items:flex-end;gap:16px;margin-top:8px;">
        <div style="font-size:64px;line-height:1;">${icon}</div>
        <div><div class="w-temp">${c.temperature_2m?.toFixed(1)}°C</div><div class="w-desc">Current Conditions</div></div>
      </div>
      <div class="w-grid">
        <div class="w-item"><div class="w-item-label">Humidity</div><div class="w-item-val">${c.relative_humidity_2m}%</div></div>
        <div class="w-item"><div class="w-item-label">Wind</div><div class="w-item-val">${c.wind_speed_10m} km/h</div></div>
        <div class="w-item"><div class="w-item-label">UV Index</div><div class="w-item-val">${c.uv_index??"—"}</div></div>
        <div class="w-item"><div class="w-item-label">Condition</div><div class="w-item-val">${icon}</div></div>
      </div>
    </div>
    <h3 style="font-family:'Fraunces',serif;font-size:20px;margin-bottom:14px;color:var(--navy);">📅 7-Day Forecast</h3>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px;">
      ${forecasts.map(f=>`
        <div style="background:var(--white);border:1px solid var(--border);border-radius:12px;padding:14px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.05);">
          <div style="font-size:11px;color:var(--gray);margin-bottom:6px;">${f.day}</div>
          <div style="font-size:24px;">${f.icon}</div>
          <div style="font-weight:700;font-size:16px;color:var(--sky);margin-top:4px;">${f.max}°</div>
          <div style="font-size:12px;color:var(--gray);">${f.min}° low</div>
          <div style="font-size:11px;color:#5b9bd5;margin-top:3px;">💧 ${f.rain}mm</div>
        </div>`).join("")}
    </div>`;
}

function renderCountry(data, dest) {
  const out = document.getElementById("country-out");
  if (!data) { out.innerHTML = `<p style="text-align:center;padding:40px;color:var(--gray);">⚠️ Country info not found for "${dest}".</p>`; return; }
  const currencies = Object.values(data.currencies||{}).map(c=>`${c.name} (${c.symbol||""})`).join(", ")||"N/A";
  const languages  = Object.values(data.languages||{}).join(", ")||"N/A";
  const population = data.population ? (data.population/1_000_000).toFixed(1)+"M" : "N/A";
  const capital    = (data.capital||["N/A"])[0];
  out.innerHTML = `
    <div class="country-card">
      <div class="country-flag">${data.flags?.emoji||"🏳️"}</div>
      <div class="country-info">
        <h3>${data.name?.common||dest}</h3>
        <div style="font-size:13px;color:var(--gray);">${data.region||""} ${data.subregion?"· "+data.subregion:""}</div>
        <div class="country-meta">
          <span class="meta-tag">🏛️ ${capital}</span>
          <span class="meta-tag">👥 ${population}</span>
          <span class="meta-tag">💵 ${currencies}</span>
          <span class="meta-tag">🗣️ ${languages}</span>
        </div>
      </div>
    </div>`;
}

function renderMap(dest) {
  const lat = window._destLat || 20, lon = window._destLon || 0;
  if (window._tripMap) { window._tripMap.remove(); window._tripMap = null; }
  window._tripMap = L.map("map-container").setView([lat,lon],12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"© OpenStreetMap contributors", maxZoom:19,
  }).addTo(window._tripMap);
  L.marker([lat,lon],{icon:L.divIcon({
    html:`<div style="font-size:30px;filter:drop-shadow(0 3px 8px rgba(0,0,0,.4))">📍</div>`,
    iconSize:[32,32],iconAnchor:[16,28],className:"",
  })}).addTo(window._tripMap)
    .bindPopup(`<strong style="font-size:13px;">📍 ${dest}</strong>`)
    .openPopup();
}

function renderPhrases(phrases, dest) {
  document.getElementById("phrases-out").innerHTML = `
    <h3 style="font-family:'Fraunces',serif;font-size:22px;color:var(--navy);margin-bottom:6px;">🗣️ Phrases for ${escHtml(dest)}</h3>
    <p style="font-size:13px;color:var(--gray);margin-bottom:18px;">Click any card to copy to clipboard</p>
    <div class="phrase-grid">
      ${phrases.map(p=>`
        <div class="phrase-card" onclick="copyPhrase('${escHtml(p.trans).replace(/'/g,"\\'")}',this)">
          <div class="phrase-orig">${escHtml(p.orig)}</div>
          <div class="phrase-trans">${escHtml(p.trans)}</div>
          <div class="phrase-copy">📋 Click to copy</div>
        </div>`).join("")}
    </div>`;
}
function copyPhrase(text, el) {
  navigator.clipboard?.writeText(text).catch(()=>{});
  el.style.borderColor="var(--sky)";
  el.querySelector(".phrase-copy").textContent="✅ Copied!";
  setTimeout(()=>{ el.style.borderColor=""; el.querySelector(".phrase-copy").textContent="📋 Click to copy"; },1500);
}

function renderPacking(items) {
  document.getElementById("packing-out").innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;flex-wrap:wrap;gap:10px;">
      <h3 style="font-family:'Fraunces',serif;font-size:22px;color:var(--navy);">🧳 Packing List</h3>
      <span id="pack-count" style="font-size:13px;color:var(--gray);">0 / ${items.length} packed</span>
    </div>
    <div class="pack-grid">
      ${items.map((item,i)=>`
        <div class="pack-item" id="pack-${i}" onclick="togglePack(${i},${items.length})">
          <div class="pack-cb"></div>
          <span class="pack-emoji">${item.emoji}</span>
          <span class="pack-label">${escHtml(item.item)}</span>
        </div>`).join("")}
    </div>`;
}
function togglePack(i, total) {
  const el = document.getElementById("pack-"+i);
  el.classList.toggle("checked");
  el.querySelector(".pack-cb").innerHTML = el.classList.contains("checked")
    ? '<span style="color:#fff;font-size:11px;">✓</span>' : "";
  document.getElementById("pack-count").textContent =
    `${document.querySelectorAll(".pack-item.checked").length} / ${total} packed`;
}

function renderEmergency(data, dest) {
  document.getElementById("emergency-out").innerHTML = `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:12px;padding:14px 18px;margin-bottom:18px;display:flex;gap:12px;align-items:flex-start;">
      <span style="font-size:22px;">⚠️</span>
      <div><div style="font-weight:700;color:#c0392b;font-size:14px;">Emergency Contacts — ${escHtml(dest)}</div>
      <div style="font-size:13px;color:var(--gray);margin-top:4px;">Save these before you travel.</div></div>
    </div>
    <div class="emergency-grid">
      ${data.map(e=>`
        <div class="emg-card">
          <span class="emg-emoji">${e.emoji}</span>
          <div class="emg-type">${escHtml(e.type)}</div>
          <div class="emg-num">${escHtml(e.number)}</div>
        </div>`).join("")}
    </div>`;
}

function renderBudget(data, days, budgetLevel) {
  const total  = (data.accommodation+data.food+data.transport+data.activities+data.misc)*days;
  const maxVal = Math.max(data.accommodation,data.food,data.transport,data.activities,data.misc);
  const items  = [
    {label:"🏨 Accommodation",val:data.accommodation},
    {label:"🍽️ Food & Drinks", val:data.food},
    {label:"🚌 Transport",     val:data.transport},
    {label:"🎭 Activities",    val:data.activities},
    {label:"🛍️ Misc",          val:data.misc},
  ];
  document.getElementById("budget-out").innerHTML = `
    <div style="background:linear-gradient(135deg,var(--navy),var(--sky));border-radius:16px;padding:28px;color:#fff;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px;">
      <div>
        <div style="font-size:13px;opacity:.7;margin-bottom:4px;">Total for ${days} day${days>1?"s":""}</div>
        <div style="font-family:'Fraunces',serif;font-size:52px;font-weight:900;">$${total.toFixed(0)}</div>
        <div style="font-size:13px;opacity:.7;">${escHtml(budgetLevel)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:13px;opacity:.7;">Per Day</div>
        <div style="font-family:'Fraunces',serif;font-size:38px;font-weight:900;">$${(total/days).toFixed(0)}</div>
        <div style="font-size:12px;opacity:.6;">${data.currency||"USD"} approx.</div>
      </div>
    </div>
    <div class="budget-bars">
      ${items.map(item=>`
        <div class="budget-row">
          <div class="budget-label">${item.label}</div>
          <div class="budget-bar-bg"><div class="budget-bar-fill" style="width:${maxVal?(item.val/maxVal*100).toFixed(0):0}%"></div></div>
          <div class="budget-amount">$${item.val}/day</div>
        </div>`).join("")}
    </div>
    ${data.note?`<div style="margin-top:18px;padding:12px 16px;background:rgba(201,150,58,.08);border-radius:10px;font-size:13px;color:var(--gray);">💡 ${escHtml(data.note)}</div>`:""}`;
}

function renderFestivals(text) {
  const html = text
    .replace(/##\s+(.+)/g,"<h2>$1</h2>").replace(/###\s+(.+)/g,"<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>")
    .replace(/^[-•]\s+(.+)/gm,"<li>$1</li>").replace(/(<li>[\s\S]*?<\/li>)/g,"<ul>$1</ul>")
    .replace(/\n\n+/g,"</p><p>");
  document.getElementById("festivals-out").innerHTML = `<p>${html}</p>`;
}

/* ══════════════════════════════════════
   EXPORT & CONTACT
══════════════════════════════════════ */
function downloadItinerary() {
  const dest = window._tripDest||"Trip", text = window._itineraryRaw||"No itinerary yet.";
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([`TripArchitect — ${dest}\n\n${text}`],{type:"text/plain"}));
  a.download = `TripArchitect_${dest.replace(/\s+/g,"_")}.txt`;
  a.click(); URL.revokeObjectURL(a.href);
}

function sendMsg() {
  const name=document.getElementById("cf-name").value.trim();
  const email=document.getElementById("cf-email").value.trim();
  const subject=document.getElementById("cf-subject").value.trim();
  const msg=document.getElementById("cf-msg").value.trim();
  if (!name||!email||!msg){alert("Please fill all required fields!");return;}
  if (!email.includes("@")){alert("Please enter a valid email!");return;}
  window.open(`mailto:gargiptl14@gmail.com?subject=${encodeURIComponent(subject||"TripArchitect — "+name)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${msg}`)}`, "_blank");
  document.getElementById("cform-wrap").style.display="none";
  document.getElementById("msg-sent").classList.add("show");
}

/* ══════════════════════════════════════
   UTILITY
══════════════════════════════════════ */
function escHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
window.addEventListener("DOMContentLoaded", () => {
  const today    = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now()+7*86400000).toISOString().split("T")[0];
  const s = document.getElementById("f-start");
  const e = document.getElementById("f-end");
  if (s) s.value = today;
  if (e) e.value = nextWeek;
});