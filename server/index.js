import http from "http";
import { handleRequest, initDB } from "./router.js";

// Database initialization
initDB().catch(err => console.error("DB Init Error:", err));

// Main handler function jo Vercel as a Serverless Function use karega
export default async function handler(req, res) {
  // 1. CORS Headers: Inke baghair frontend 'Failed to fetch' error dega
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 2. Handle Preflight Request (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    // Aapka router logic yahan call hoga
    await handleRequest(req, res);
  } catch (err) {
    console.error("Unhandled Server Error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error", details: err.message }));
    }
  }
}

// 3. Local Development Support
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 4000;
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
  });
}