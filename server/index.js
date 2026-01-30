import http from "http";
import { handleRequest, initDB } from "./router.js";

const PORT = process.env.PORT || 4000;

// Initialize Database (Seed Admin/Categories if empty)
initDB();

const server = http.createServer(async (req, res) => {
  try {
    await handleRequest(req, res);
  } catch (err) {
    console.error("Unhandled Server Error:", err);
    if (!res.headersSent) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});

