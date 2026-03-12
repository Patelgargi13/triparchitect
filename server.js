const http  = require("http");
const https = require("https");
const fs    = require("fs");
const path  = require("path");

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    raw.split("\n").forEach(line => {
      line = line.trim();
      if (!line || line.startsWith("#")) return;
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
  } catch (e) { console.warn("⚠️  Could not load .env:", e.message); }
}

loadEnv();

const PORT           = process.env.PORT || 3000;
const COHERE_API_KEY = process.env.COHERE_API_KEY || "";
// Treat placeholder as missing
const KEY_IS_VALID   = COHERE_API_KEY.length > 10 && !COHERE_API_KEY.includes("your-");

const PUBLIC_ENV = {
  APP_NAME:      process.env.APP_NAME    || "TripArchitect",
  AUTHOR:        process.env.AUTHOR      || "Gargi Patel",
  VERSION:       process.env.APP_VERSION || "1.0.0",
  HAS_API_KEY:   KEY_IS_VALID,
  WEATHER_GEO:   "https://geocoding-api.open-meteo.com/v1/search",
  WEATHER_API:   "https://api.open-meteo.com/v1/forecast",
  COUNTRY_API:   "https://restcountries.com/v3.1/name",
  TRANSLATE_API: "https://api.mymemory.translated.net/get",
};

const MIME = {
  ".html":"text/html", ".css":"text/css", ".js":"application/javascript",
  ".json":"application/json", ".png":"image/png", ".jpg":"image/jpeg",
  ".svg":"image/svg+xml", ".ico":"image/x-icon", ".txt":"text/plain",
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", c => { body += c; });
    req.on("end",  () => resolve(body));
    req.on("error", reject);
  });
}

function cohereRequest(prompt, maxTokens) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: "command-r-plus-08-2024",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens || 2048,
      temperature: 0.7,
    });

    const options = {
      hostname: "api.cohere.com",
      path: "/v2/chat",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${COHERE_API_KEY}`,
        "Content-Length": Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", c => { data += c; });
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(parsed.message || `Cohere ${res.statusCode}: ${data.slice(0,200)}`));
          } else {
            resolve(parsed.message?.content?.[0]?.text || "");
          }
        } catch (e) { reject(new Error("Parse error: " + e.message)); }
      });
    });

    req.on("error", reject);
    req.setTimeout(90000, () => { req.destroy(); reject(new Error("Cohere timed out after 90s")); });
    req.write(payload);
    req.end();
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  // /config.js — safe public config only
  if (req.url === "/config.js") {
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(`const ENV = ${JSON.stringify(PUBLIC_ENV, null, 2)};\nObject.freeze(ENV);`);
    return;
  }

  // /api/test — quick health check for Cohere connection
  if (req.url === "/api/test" && req.method === "GET") {
    if (!KEY_IS_VALID) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: "COHERE_API_KEY not set or still placeholder in .env" }));
      return;
    }
    try {
      const text = await cohereRequest("Say only the word: WORKING", 10);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, response: text.trim() }));
    } catch (e) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: false, error: e.message }));
    }
    return;
  }

  // /api/ai — Cohere proxy
  if (req.url === "/api/ai" && req.method === "POST") {
    if (!KEY_IS_VALID) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "COHERE_API_KEY is missing or still set to placeholder in .env — get a real key at dashboard.cohere.com" }));
      return;
    }
    try {
      const body = await readBody(req);
      const { prompt, maxTokens } = JSON.parse(body);
      if (!prompt) throw new Error("No prompt");
      console.log(`  🤖 AI: ${prompt.slice(0,70)}...`);
      const text = await cohereRequest(prompt, maxTokens);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ text }));
    } catch (e) {
      console.error("  ❌ AI Error:", e.message);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // Static files
  let filePath = "." + req.url.split("?")[0];
  if (filePath === "./") filePath = "./index.html";
  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("404"); return; }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("═══════════════════════════════════════════════");
  console.log("  ✈️  TripArchitect is running!");
  console.log(`  🌍  http://localhost:${PORT}`);
  console.log(`  🔑  Cohere Key: ${KEY_IS_VALID ? "✅ Loaded" : "❌ MISSING — add real COHERE_API_KEY to .env"}`);
  console.log("  🛑  Ctrl+C to stop");
  console.log("═══════════════════════════════════════════════");
});