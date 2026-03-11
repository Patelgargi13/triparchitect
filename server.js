const http = require("http");
const fs   = require("fs");
const path = require("path");

function loadEnv() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
    raw.split("\n").forEach(line => {
      line = line.trim();
      if (!line || line.startsWith("#")) return;
      const [key, ...rest] = line.split("=");
      if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
    });
  } catch (e) {
    console.warn("⚠️  Could not load .env:", e.message);
  }
}
loadEnv();

const PORT = process.env.PORT || 3000;

// ✅ ONLY Cohere — no Gemini at all
const ENV = {
  COHERE_API_KEY:  process.env.COHERE_API_KEY  || "",
  COHERE_ENDPOINT: "https://api.cohere.com/v2/chat",
  COHERE_MODEL:    "command-r-plus-08-2024",

  APP_NAME:  process.env.APP_NAME    || "TripArchitect",
  AUTHOR:    process.env.AUTHOR      || "Gargi Patel",
  VERSION:   process.env.APP_VERSION || "1.0.0",

  WEATHER_GEO:   "https://geocoding-api.open-meteo.com/v1/search",
  WEATHER_API:   "https://api.open-meteo.com/v1/forecast",
  COUNTRY_API:   "https://restcountries.com/v3.1/name",
  TRANSLATE_API: "https://api.mymemory.translated.net/get",
};

const MIME = {
  ".html":"text/html", ".css":"text/css",
  ".js":"application/javascript", ".json":"application/json",
  ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg",
  ".svg":"image/svg+xml", ".ico":"image/x-icon", ".txt":"text/plain",
};

const server = http.createServer((req, res) => {
  if (req.url === "/config.js" || req.url === "/__config") {
    res.writeHead(200, { "Content-Type": "application/javascript" });
    res.end(`const ENV = ${JSON.stringify(ENV, null, 2)};\nObject.freeze(ENV);`);
    return;
  }

  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./index.html";

  const ext  = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end("404 Not Found"); return; }
    res.writeHead(200, { "Content-Type": mime });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log("═══════════════════════════════════════════");
  console.log("  ✈️  TripArchitect is running!");
  console.log(`  🌍  Open: http://localhost:${PORT}`);
  console.log(`  🔑  Cohere Key: ${ENV.COHERE_API_KEY ? "✅ Loaded" : "❌ MISSING"}`);
  console.log("  🛑  Stop: Ctrl + C");
  console.log("═══════════════════════════════════════════");
});