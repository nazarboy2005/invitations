/** Isolated JS API map used by every invitation family and Studio. */
export const runtime = "nodejs";
export function GET() {
  const key = process.env.YANDEX_MAPS_JAVASCRIPT_API_KEY || "";
  const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, "");
  const html = `<!doctype html><html lang="uz"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Yandex Maps</title>
<style>html,body,#map{height:100%;width:100%;margin:0}body{font:14px/1.5 system-ui,sans-serif;background:#f3efe8;color:#514a42}#status{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;text-align:center;pointer-events:none}#status[hidden]{display:none}#destination{position:absolute;inset:0 0 24px;z-index:500;cursor:pointer}#destination:focus-visible{outline:3px solid #803547;outline-offset:-4px}[class*="-gotoymaps"]{display:none!important}</style></head>
<body data-yandex-key="${safeKey}"><div id="map" aria-label="Yandex Maps"></div><a id="destination" aria-label="Joy xaritasi" target="_top" rel="noreferrer"></a><div id="status" role="status">Xarita yuklanmoqda…</div><script src="/maps/venue.js"></script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "Referrer-Policy": "strict-origin-when-cross-origin" } });
}
