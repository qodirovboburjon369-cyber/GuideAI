// ===== API CONFIG =====
// Local da: http://127.0.0.1:5000
// Netlify da: /api (redirect → Render)
const API_BASE = (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) ? "http://127.0.0.1:5000" : "/api";