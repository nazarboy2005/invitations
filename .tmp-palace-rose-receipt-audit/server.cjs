const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = process.cwd();
const archive = path.join(root, "Invitations - this folder will be removed from production", "Chorlove", "Web invitations");
const packageRoot = path.join(root, "apps", "web", "public", "templates", "palace-rose");
const shared = path.join(root, "apps", "web", "public", "templates", "shared");
const audit = path.join(root, ".tmp-palace-rose-receipt-audit");
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/ttf", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".json": "application/json" };
http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const rel = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  let file;
  if (rel === "qa.html") file = path.join(audit, "qa.html");
  else if (rel.startsWith("templates/shared/")) file = path.join(shared, rel.slice("templates/shared/".length));
  else if (rel === "templates/palace-rose/preview-frame.html") file = path.join(archive, rel);
  else if (rel === "templates/palace-rose/index.html" || rel.startsWith("templates/palace-rose/")) file = path.join(packageRoot, rel.slice("templates/palace-rose/".length));
  else file = path.join(archive, rel);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (error, data) => {
    if (error) { res.writeHead(404).end("Not found"); return; }
    res.writeHead(200, { "content-type": mime[path.extname(file)] || "application/octet-stream", "cache-control": "no-store" });
    res.end(data);
  });
}).listen(3005, "127.0.0.1", () => console.log("QA server at http://127.0.0.1:3005/qa.html"));
