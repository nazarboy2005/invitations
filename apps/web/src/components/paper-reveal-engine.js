// Paper deformation, crease generation and WebGL2 shading adapted from
// CrumpledPaperReveal by Matthias Oelschlegel.
// https://framer.com/m/CrumpledPaperReveal-8D5gW8.js@0VQbXvSZ3yFdg4ftHQFG
// Framer controls, React wrapper and Framer Motion are intentionally excluded.
// Compressed folding keyframes are loaded separately only near the showcase.
function _define_property(obj, key, value) {
  Object.defineProperty(obj, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true,
  });
  return obj;
}
let dataPromise = null;
function loadCrumpleData() {
  if (!dataPromise) {
    dataPromise = fetch("/images/home/paper/crumple.bin")
      .then((r) => {
        if (!r.ok) throw new Error("Paper data unavailable");
        return r.arrayBuffer();
      })
      .then((buf) => decodeCrumple(new Uint8Array(buf)));
    dataPromise.catch(() => {
      dataPromise = null;
    });
  }
  return dataPromise;
}
let shared = null;
let creating = null; // start-up in separate short tasks: decode the fold data, then compile the shaders (in the background
// where the browser supports it), then build the buffers
const nextTask = () => new Promise((r) => setTimeout(r, 0));
function createRenderer() {
  if (!creating) {
    creating = (async () => {
      const data = await loadCrumpleData();
      await nextTask();
      const canvas = document.createElement("canvas");
      const scene = await prepareScene(canvas, data);
      const r = { scene, canvas, users: 0, lost: false, listeners: new Set() };
      canvas.addEventListener("webglcontextlost", (e) => {
        e.preventDefault();
        r.lost = true;
        r.listeners.forEach((f) => f());
      });
      shared = r;
      return r;
    })();
    const clear = () => {
      creating = null;
    };
    creating.then(clear, clear);
  }
  return creating;
}
async function acquireRenderer() {
  const r = shared && !shared.lost ? shared : await createRenderer();
  r.users++;
  return r;
}
function releaseRenderer(r) {
  r.users--;
  if (r.users > 0) return; // Framer remounts components often (breakpoints, preview): keep the context a moment
  window.setTimeout(() => {
    if (r.users <= 0 && shared === r) {
      r.scene.dispose();
      shared = null;
    }
  }, 4e3);
}
async function inflateRaw(bytes) {
  const DS = globalThis.DecompressionStream;
  if (!DS) throw new Error("DecompressionStream unavailable");
  const stream = new Blob([bytes]).stream().pipeThrough(new DS("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
async function decodeCrumple(bytes) {
  const buf = await inflateRaw(bytes);
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const magic = String.fromCharCode(buf[0], buf[1], buf[2], buf[3]);
  if (magic !== "CRP1") throw new Error("Unknown crumple data");
  let o = 4;
  const N = dv.getUint16(o, true);
  const F = dv.getUint16(o + 2, true);
  const K = dv.getUint16(o + 4, true);
  const qbits = dv.getUint16(o + 6, true);
  const midStep = dv.getUint16(o + 8, true);
  o += 16; // counts (10) + relief scale (4) + flags (2)
  const restQ = new Uint16Array(N * 2);
  for (let i = 0; i < N * 2; i++, o += 2) restQ[i] = dv.getUint16(o, true);
  const faceLen = dv.getUint32(o, true);
  o += 4;
  let p = o;
  const readVar = () => {
    let v = 0;
    let s = 1;
    let b = 0;
    do {
      b = buf[p++];
      v += (b & 127) * s;
      s *= 128;
    } while (b & 128);
    return v;
  };
  const faces = new Uint16Array(F * 3);
  let a = 0;
  for (let f = 0; f < F; f++) {
    a += readVar();
    faces[f * 3] = a;
    faces[f * 3 + 1] = a + readVar();
    faces[f * 3 + 2] = a + readVar();
  }
  o += faceLen;
  const relief = new Float32Array(N);
  for (let i = 0; i < N; i++, o += 2) relief[i] = dv.getInt16(o, true) / 32767; // unique edges (sorted) -> sharp bitmask length and "previous neighbour" lists
  const keysE = [];
  for (let f = 0; f < F; f++) {
    for (let c = 0; c < 3; c++) {
      const u = faces[f * 3 + c];
      const v = faces[f * 3 + ((c + 1) % 3)];
      keysE.push(u < v ? u * 65536 + v : v * 65536 + u);
    }
  }
  keysE.sort((x, y) => x - y);
  const edges = [];
  for (let i = 0; i < keysE.length; i++)
    if (i === 0 || keysE[i] !== keysE[i - 1]) edges.push(keysE[i]);
  o += Math.ceil(edges.length / 8);
  const prevStart = new Int32Array(N + 1);
  for (const e of edges) prevStart[(e % 65536) + 1]++;
  for (let i = 0; i < N; i++) prevStart[i + 1] += prevStart[i];
  const prevList = new Int32Array(prevStart[N]);
  const fillP = prevStart.slice(0, N);
  for (const e of edges) prevList[fillP[e % 65536]++] = Math.floor(e / 65536); // keyframes: closed-loop DPCM with neighbour prediction
  p = o;
  const zig = () => {
    const v = readVar();
    return v % 2 === 0 ? v / 2 : -(v + 1) / 2;
  };
  const Q = Math.pow(2, qbits);
  const dec = new Int32Array(K * N * 3);
  for (let v = 0; v < N; v++) {
    dec[v * 3] = Math.floor((restQ[v * 2] * Q + 32767) / 65535) - Q / 2;
    dec[v * 3 + 1] = Math.floor((restQ[v * 2 + 1] * Q + 32767) / 65535) - Q / 2;
  }
  const rq = new Int32Array(N * 3);
  const rdec = new Int32Array(N * 3);
  for (let k = 1; k < K; k++) {
    const step = k <= 2 || k >= K - 3 ? 1 : midStep;
    for (let c = 0; c < 3; c++)
      for (let v = 0; v < N; v++) rq[v * 3 + c] = zig();
    for (let v = 0; v < N; v++) {
      const s0 = prevStart[v];
      const s1 = prevStart[v + 1];
      const n = s1 - s0;
      for (let c = 0; c < 3; c++) {
        let pred = 0;
        if (n > 0) {
          let s = 0;
          for (let j = s0; j < s1; j++) s += rdec[prevList[j] * 3 + c];
          pred = Math.floor((2 * s + n) / (2 * n));
        }
        rdec[v * 3 + c] = pred + rq[v * 3 + c] * step;
      }
    }
    const cur = k * N * 3;
    const prev = (k - 1) * N * 3;
    const prev2 = (k - 2) * N * 3;
    for (let i = 0; i < N * 3; i++) {
      const base = k < 2 ? dec[prev + i] : 2 * dec[prev + i] - dec[prev2 + i];
      dec[cur + i] = base + rdec[i];
    }
  }
  const keys = new Float32Array(K * N * 3);
  for (let i = 0; i < keys.length; i++) keys[i] = dec[i] / Q;
  const rest = new Float32Array(N * 2);
  for (let i = 0; i < N * 2; i++) rest[i] = restQ[i] / 65535; // per keyframe: compactness (0 flat .. 1 ball) and bounding box centre
  const ext = new Float32Array(K);
  const center = new Float32Array(K * 2);
  for (let k = 0; k < K; k++) {
    let x0 = 1e9;
    let x1 = -1e9;
    let y0 = 1e9;
    let y1 = -1e9;
    for (let v = 0; v < N; v++) {
      const x = keys[(k * N + v) * 3];
      const y = keys[(k * N + v) * 3 + 1];
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    ext[k] = Math.max(x1 - x0, y1 - y0);
    center[k * 2] = (x0 + x1) / 2;
    center[k * 2 + 1] = (y0 + y1) / 2;
  }
  let eMin = ext[0];
  for (let k = 0; k < K; k++) eMin = Math.min(eMin, ext[k]);
  const crumple = new Float32Array(K);
  for (let k = 0; k < K; k++)
    crumple[k] = Math.min(1, Math.max(0, (ext[0] - ext[k]) / (ext[0] - eMin)));
  return { N, F, K, rest, faces, relief, keys, crumple, center };
} // ---------------------------------------------------------------------------------------------
// Procedural crease map: slope field of a sheet that was crumpled and smoothed out again.
// Every crease is a straight fold; the paper keeps a small tilt on both sides (facets).
// RGBA8: r,g = slope x/y (0.5 = flat), a = fine ink crack along sharp folds.
function mulberry32(seed) {
  let a = seed | 0;
  return () => {
    a = (a + 1831565813) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
} // Bowyer-Watson Delaunay triangulation. Triangles are bucketed on a grid by their circumcircle,
// so each insertion only tests the triangles whose circle can contain the new point.
// A generator: it pauses every 64 insertions so the caller can spread it over frames.
function* delaunay(xs, ys) {
  const n = xs.length;
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  for (let i = 0; i < n; i++) {
    if (xs[i] < minX) minX = xs[i];
    if (ys[i] < minY) minY = ys[i];
    if (xs[i] > maxX) maxX = xs[i];
    if (ys[i] > maxY) maxY = ys[i];
  }
  const span = Math.max(maxX - minX, maxY - minY, 1e-6);
  const d = span * 20;
  const X = xs.concat([minX - d, minX + d * 2, minX - d]);
  const Y = ys.concat([minY - d, minY - d, minY + d * 2]);
  const TA = [],
    TB = [],
    TC = [];
  const TX = [],
    TY = [],
    TR = [];
  const alive = [];
  const G = Math.max(1, Math.round(Math.sqrt(n) / 1.6));
  const cw = (maxX - minX) / G || 1;
  const ch = (maxY - minY) / G || 1;
  const cells = [];
  for (let i = 0; i < G * G; i++) cells.push([]);
  const addTri = (a, b, c) => {
    const ax = X[a],
      ay = Y[a],
      bx = X[b],
      by = Y[b],
      cx = X[c],
      cy = Y[c];
    const dd = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by)) || 1e-12;
    const ux =
      ((ax * ax + ay * ay) * (by - cy) +
        (bx * bx + by * by) * (cy - ay) +
        (cx * cx + cy * cy) * (ay - by)) /
      dd;
    const uy =
      ((ax * ax + ay * ay) * (cx - bx) +
        (bx * bx + by * by) * (ax - cx) +
        (cx * cx + cy * cy) * (bx - ax)) /
      dd;
    const r2 = (ax - ux) * (ax - ux) + (ay - uy) * (ay - uy);
    const id = TA.length;
    TA.push(a);
    TB.push(b);
    TC.push(c);
    TX.push(ux);
    TY.push(uy);
    TR.push(r2);
    alive.push(1);
    const r = Math.sqrt(r2);
    const gx0 = Math.max(0, Math.floor((ux - r - minX) / cw));
    const gx1 = Math.min(G - 1, Math.floor((ux + r - minX) / cw));
    const gy0 = Math.max(0, Math.floor((uy - r - minY) / ch));
    const gy1 = Math.min(G - 1, Math.floor((uy + r - minY) / ch));
    for (let gy = gy0; gy <= gy1; gy++)
      for (let gx = gx0; gx <= gx1; gx++) cells[gy * G + gx].push(id);
  };
  addTri(n, n + 1, n + 2);
  const bad = [];
  const eu = [],
    ev = [];
  for (let i = 0; i < n; i++) {
    if (i % 64 === 63) yield;
    const px = X[i],
      py = Y[i];
    const gx = Math.min(G - 1, Math.max(0, Math.floor((px - minX) / cw)));
    const gy = Math.min(G - 1, Math.max(0, Math.floor((py - minY) / ch)));
    const cell = cells[gy * G + gx];
    bad.length = 0;
    let k = 0;
    for (let j = 0; j < cell.length; j++) {
      const id = cell[j];
      if (!alive[id]) continue;
      cell[k++] = id;
      const dx = px - TX[id],
        dy = py - TY[id];
      if (dx * dx + dy * dy <= TR[id]) bad.push(id);
    }
    cell.length = k;
    eu.length = 0;
    ev.length = 0;
    for (const id of bad) {
      alive[id] = 0;
      const a = TA[id],
        b = TB[id],
        c = TC[id];
      eu.push(a, b, c);
      ev.push(b, c, a);
    } // boundary of the cavity: edges that are not shared by two bad triangles
    const m = eu.length;
    for (let e = 0; e < m; e++) {
      const u = eu[e],
        v = ev[e];
      let shared = false;
      for (let f = 0; f < m; f++) {
        if (f !== e && eu[f] === v && ev[f] === u) {
          shared = true;
          break;
        }
      }
      if (!shared) addTri(u, v, i);
    }
  }
  const out = [];
  for (let id = 0; id < TA.length; id++) {
    if (!alive[id]) continue;
    const a = TA[id],
      b = TB[id],
      c = TC[id];
    if (a < n && b < n && c < n) out.push(a, b, c);
  }
  return out;
} // Crease map: the slope field of a sheet that was crumpled and smoothed out again.
// Four layers of random triangular facets (long folds .. fine crinkle). Every shared facet edge
// is a straight fold; fine crinkle gathers in a few areas like in real paper.
// RGBA8: r,g = slope x/y (0.5 = level, 0/1 = -0.5/+0.5), b = fold line (0.5 = none, above =
// ridge, below = valley), a = ink crack along the sharpest ridges.
// The map is built in small steps (a generator): every loop pauses after about STEP pixels of work,
// so a caller with a time budget per frame never blocks the main thread for long.
const STEP = 6e3;
function* creaseMapJob(w, h, seed) {
  const n = w * h;
  let work = 0;
  const GX = new Float32Array(n);
  const GY = new Float32Array(n);
  const FL = new Float32Array(n);
  const CR = new Float32Array(n);
  const rnd = mulberry32(seed);
  const S = Math.max(w, h);
  const px = S / 640; // line widths are tuned for a ~640px map
  // crinkle density: a few soft blobs over a calm base, normalised to a mean of 1
  const blobs = [];
  for (let i = 0; i < 6; i++)
    blobs.push([
      rnd() * w,
      rnd() * h,
      (0.12 + 0.2 * rnd()) * S,
      0.7 + 1.5 * rnd(),
    ]);
  const densRaw = (x, y) => {
    let d = 0.4;
    for (const b of blobs) {
      const dx = x - b[0];
      const dy = y - b[1];
      d += b[3] * Math.exp(-(dx * dx + dy * dy) / (b[2] * b[2]));
    }
    return d;
  };
  let mean = 0;
  for (let i = 0; i < 400; i++) mean += densRaw(rnd() * w, rnd() * h);
  mean /= 400;
  const dens = (x, y) =>
    densRaw(Math.min(w, Math.max(0, x)), Math.min(h, Math.max(0, y))) / mean;
  let dMax = 1;
  for (let i = 0; i < 400; i++)
    dMax = Math.max(dMax, dens(rnd() * w, rnd() * h));
  dMax *= 1.25;
  const layer = function* (count, amp, clustered, lineW, lineAmt, crackAmt) {
    const pad = S * 0.12;
    const X0 = -pad;
    const Y0 = -pad;
    const W2 = w + 2 * pad;
    const H2 = h + 2 * pad;
    const spacing = Math.sqrt((W2 * H2) / count);
    const dAt = (x, y) => (clustered ? dens(x, y) : 1); // blue-noise points (dart throwing), denser where the paper crinkled more
    const rf = 0.6 * spacing;
    const cell = rf / Math.sqrt(clustered ? dMax : 1);
    const gw = Math.ceil(W2 / cell) + 1;
    const gh = Math.ceil(H2 / cell) + 1;
    const grid = new Array(gw * gh);
    const xs = [];
    const ys = [];
    let tries = 0;
    while (xs.length < count && tries < count * 40) {
      tries++;
      if (tries % 512 === 0) yield;
      const x = X0 + rnd() * W2;
      const y = Y0 + rnd() * H2;
      const d = dAt(x, y);
      if (clustered && rnd() * dMax > d) continue;
      const r = rf / Math.sqrt(d);
      const gx = Math.floor((x - X0) / cell);
      const gy = Math.floor((y - Y0) / cell);
      const R = Math.ceil(r / cell);
      let ok = true;
      for (
        let yy = Math.max(0, gy - R);
        ok && yy <= Math.min(gh - 1, gy + R);
        yy++
      ) {
        for (
          let xx = Math.max(0, gx - R);
          xx <= Math.min(gw - 1, gx + R);
          xx++
        ) {
          const c = grid[yy * gw + xx];
          if (!c) continue;
          for (const j of c) {
            const dx = xs[j] - x;
            const dy = ys[j] - y;
            if (dx * dx + dy * dy < r * r) {
              ok = false;
              break;
            }
          }
          if (!ok) break;
        }
      }
      if (!ok) continue;
      const gi = gy * gw + gx;
      (grid[gi] || (grid[gi] = [])).push(xs.length);
      xs.push(x);
      ys.push(y);
    }
    yield;
    const P = xs.length;
    const zs = new Float32Array(P);
    for (let i = 0; i < P; i++)
      zs[i] = (rnd() * 2 - 1) * amp * (spacing / Math.sqrt(dAt(xs[i], ys[i])));
    const tri = yield* delaunay(xs, ys);
    yield;
    const T = tri.length / 3;
    const tgx = new Float32Array(T);
    const tgy = new Float32Array(T);
    for (let t = 0; t < T; t++) {
      const a = tri[t * 3],
        b = tri[t * 3 + 1],
        c = tri[t * 3 + 2];
      const x0 = xs[a],
        y0 = ys[a],
        x1 = xs[b],
        y1 = ys[b],
        x2 = xs[c],
        y2 = ys[c];
      const det = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
      if (Math.abs(det) < 1e-9) continue; // plane slope through the three corner heights
      const dz1 = zs[b] - zs[a],
        dz2 = zs[c] - zs[a];
      const gx = (dz1 * (y2 - y0) - dz2 * (y1 - y0)) / det;
      const gy = (dz2 * (x1 - x0) - dz1 * (x2 - x0)) / det;
      tgx[t] = gx;
      tgy[t] = gy; // scanline fill: pixel centres in [ymin, ymax) x [xl, xr); shared edges are evaluated
      // from the same endpoints in both triangles, so neighbours tile without gaps
      let ya = Math.min(y0, y1, y2);
      let yb = Math.max(y0, y1, y2);
      const ry0 = Math.max(0, Math.ceil(ya - 0.5));
      const ry1 = Math.min(h - 1, Math.ceil(yb - 0.5) - 1);
      for (let y = ry0; y <= ry1; y++) {
        const py = y + 0.5;
        let xl = Infinity;
        let xr = -Infinity;
        for (let e = 0; e < 3; e++) {
          let pxa = e === 0 ? x0 : e === 1 ? x1 : x2;
          let pya = e === 0 ? y0 : e === 1 ? y1 : y2;
          let pxb = e === 0 ? x1 : e === 1 ? x2 : x0;
          let pyb = e === 0 ? y1 : e === 1 ? y2 : y0;
          if (pya > pyb || (pya === pyb && pxa > pxb)) {
            const tx = pxa,
              ty = pya;
            pxa = pxb;
            pya = pyb;
            pxb = tx;
            pyb = ty;
          }
          if (py < pya || py >= pyb) continue;
          const xe = pxa + ((py - pya) * (pxb - pxa)) / (pyb - pya);
          if (xe < xl) xl = xe;
          if (xe > xr) xr = xe;
        }
        if (!(xr > xl)) continue;
        const rx0 = Math.max(0, Math.ceil(xl - 0.5));
        const rx1 = Math.min(w - 1, Math.ceil(xr - 0.5) - 1);
        work += rx1 - rx0 + 8;
        let i = y * w + rx0;
        for (let x = rx0; x <= rx1; x++, i++) {
          GX[i] += gx;
          GY[i] += gy;
        } // pause between rows (big facets span many)
        if (work > STEP) {
          work = 0;
          yield;
        }
      }
    }
    if (lineAmt <= 0) return;
    yield; // fold lines along the shared edges: ridges catch light, valleys hold a little shadow
    const edges = new Map();
    const lw = lineW * px;
    const cw = Math.max(0.55, lineW * 0.42 * px);
    const kRef = 1.5 * amp;
    for (let t = 0; t < T; t++) {
      for (let k = 0; k < 3; k++) {
        const a = tri[t * 3 + k];
        const b = tri[t * 3 + ((k + 1) % 3)];
        const key = a < b ? a * P + b : b * P + a;
        const other = edges.get(key);
        if (other === undefined) {
          edges.set(key, t * 3 + k);
          continue;
        }
        edges.delete(key);
        const t1 = Math.floor(other / 3);
        const k1 = other % 3;
        const c1 = tri[t1 * 3 + ((k1 + 2) % 3)];
        const ax = xs[a],
          ay = ys[a],
          bx = xs[b],
          by = ys[b];
        if (
          Math.max(ax, bx) < -lw ||
          Math.min(ax, bx) > w + lw ||
          Math.max(ay, by) < -lw ||
          Math.min(ay, by) > h + lw
        )
          continue;
        const ex = bx - ax;
        const ey = by - ay;
        const el = Math.hypot(ex, ey);
        if (el < 1e-6) continue;
        let mx = -ey / el;
        let my = ex / el;
        if ((xs[c1] - ax) * mx + (ys[c1] - ay) * my > 0) {
          mx = -mx;
          my = -my;
        }
        const kap = (tgx[t] - tgx[t1]) * mx + (tgy[t] - tgy[t1]) * my;
        const s = Math.min(1.5, Math.abs(kap) / kRef);
        if (s < 0.04) continue;
        const sign = kap < 0 ? 1 : -1; // + ridge, - valley
        const amt = sign * s * lineAmt; // ink cracks: only the sharpest ridges, broken up along their length
        const crack =
          sign > 0 && crackAmt > 0 && rnd() < 0.45
            ? crackAmt * Math.min(1, Math.max(0, (s - 0.5) * 2))
            : 0; // intensity varies along the fold and fades out where the fold ends
        const knots = Math.ceil(el / (22 * px)) + 2;
        const kv = [];
        for (let i = 0; i < knots; i++) kv.push(rnd());
        const il2 = 1 / (el * el); // walk the major axis and only visit the band around the line
        const xMajor = Math.abs(ex) >= Math.abs(ey);
        const reach = lw + 1.5;
        const half = reach / (xMajor ? Math.abs(ex) / el : Math.abs(ey) / el);
        const m0 = Math.max(
          0,
          Math.floor((xMajor ? Math.min(ax, bx) : Math.min(ay, by)) - reach),
        );
        const m1 = Math.min(
          (xMajor ? w : h) - 1,
          Math.ceil((xMajor ? Math.max(ax, bx) : Math.max(ay, by)) + reach),
        );
        for (let mj = m0; mj <= m1; mj++) {
          const pm = mj + 0.5;
          let tt = xMajor ? (pm - ax) / ex : (pm - ay) / ey;
          tt = tt < 0 ? 0 : tt > 1 ? 1 : tt;
          const mc = xMajor ? ay + ey * tt : ax + ex * tt;
          const n0 = Math.max(0, Math.floor(mc - half));
          const n1 = Math.min((xMajor ? h : w) - 1, Math.ceil(mc + half));
          work += n1 - n0 + 4;
          if (work > STEP) {
            work = 0;
            yield;
          }
          for (let mn = n0; mn <= n1; mn++) {
            const x = xMajor ? mj : mn;
            const y = xMajor ? mn : mj;
            const pxx = x + 0.5;
            const py = y + 0.5;
            let u = ((pxx - ax) * ex + (py - ay) * ey) * il2;
            u = u < 0 ? 0 : u > 1 ? 1 : u;
            const dx = pxx - (ax + ex * u);
            const dy = py - (ay + ey * u);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d >= lw + 0.5) continue;
            let p = 1 - d / (lw + 0.5);
            p *= p;
            const i = y * w + x;
            const f = u * (knots - 1);
            const f0 = Math.min(knots - 2, Math.floor(f));
            let ft = f - f0;
            ft = ft * ft * (3 - 2 * ft);
            const v = kv[f0] * (1 - ft) + kv[f0 + 1] * ft;
            const ends = Math.min(1, (Math.min(u, 1 - u) * el) / (7 * px));
            FL[i] += amt * p * (0.4 + 0.6 * v) * (0.35 + 0.65 * ends);
            if (crack > 0 && d < cw + 1.5) {
              const m = Math.min(1, Math.max(0, (v - 0.3) / 0.45)); // the crack wanders a little around the fold line
              const side = (dx * ey - dy * ex) / el;
              const wob =
                (kv[(f0 + 1) % knots] - 0.5) * 1.2 * px * Math.sin(ft * 3.1416);
              const dc = Math.abs(side - wob);
              if (dc >= cw + 0.5) continue;
              const c =
                crack * m * m * (3 - 2 * m) * ends * (1 - dc / (cw + 0.5));
              if (c > CR[i]) CR[i] = c;
            }
          }
        }
      }
    }
  }; // big facets can only tilt a little (the sheet lies flat), small crinkle tilts more
  yield;
  yield* layer(16, 0.05, false, 1.7, 0.85, 0.8);
  yield* layer(80, 0.075, false, 1.4, 0.7, 0.5);
  yield* layer(380, 0.09, true, 1.1, 0.32, 0.15);
  yield* layer(1400, 0.075, true, 0.9, 0.14, 0);
  yield;
  const out = new Uint8Array(n * 4);
  for (let i = 0; i < n; i++) {
    if (i % 8192 === 8191) yield;
    const gx = Math.max(-1, Math.min(1, GX[i] * 2));
    const gy = Math.max(-1, Math.min(1, -GY[i] * 2)); // texture rows run down, world y runs up
    const fl = Math.max(-1, Math.min(1, FL[i]));
    out[i * 4] = Math.round((gx * 0.5 + 0.5) * 255);
    out[i * 4 + 1] = Math.round((gy * 0.5 + 0.5) * 255);
    out[i * 4 + 2] = Math.round((fl * 0.5 + 0.5) * 255);
    out[i * 4 + 3] = Math.round(Math.min(1, CR[i]) * 255);
  }
  return out;
}
const VS_PAPER = `#version 300 es
in vec3 aPos; in vec3 aNormal; in vec2 aRest; in float aAO;
uniform vec2 uHalf; uniform vec2 uCenter; uniform float uD;
out vec3 vPos; out vec3 vNormal; out vec2 vRest; out float vAO;
void main(){
  vPos=aPos; vNormal=aNormal; vRest=aRest; vAO=aAO;
  // straight-down camera above each sheet: z = 0 maps exactly onto the css layout
  float k = uD/(uD - aPos.z);
  vec2 s = uCenter + (aPos.xy - uCenter)*k;
  gl_Position = vec4(s/uHalf, -aPos.z/uD, 1.0);
}`;
const FS_PAPER = `#version 300 es
precision highp float;
in vec3 vPos; in vec3 vNormal; in vec2 vRest; in float vAO;
uniform sampler2D uImage; uniform sampler2D uCrease;
uniform vec4 uCover; uniform vec4 uInset; uniform float uHasImage; uniform vec3 uPaper;
uniform vec3 uKey; uniform vec3 uFill; uniform vec3 uRake;
uniform float uRakeAmt; uniform float uGloss; uniform float uGrain; uniform float uCrumple;
uniform vec3 uEye; uniform vec2 uSheetPx; uniform vec4 uRadii; uniform float uShow;
uniform float uCreaseAmt; uniform float uCrack; uniform vec2 uFlip; uniform float uImgFade;
uniform vec3 uKeyD; uniform float uFoldAmt; uniform vec4 uLetter; uniform float uLetterTilt;
out vec4 outColor;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
vec3 toLinear(vec3 c){ return pow(max(c,0.0), vec3(2.2)); }
vec3 toSRGB(vec3 c){ return pow(max(c,0.0), vec3(1.0/2.2)); }
float lightAt(vec3 n){
  return max(dot(n,uKey),0.0)*0.78 + max(dot(n,uFill),0.0)*0.14 + 0.16 + 0.2*(n.z*0.5+0.5);
}

void main(){
  // rounded corners (per corner radius, sheet pixels)
  vec2 sp = (vRest-0.5)*uSheetPx;
  float r = sp.x < 0.0 ? (sp.y > 0.0 ? uRadii.x : uRadii.w) : (sp.y > 0.0 ? uRadii.y : uRadii.z);
  vec2 q = abs(sp) - (0.5*uSheetPx - vec2(r));
  float sd = length(max(q,0.0)) + min(max(q.x,q.y),0.0) - r;
  float aa = clamp(0.5 - sd, 0.0, 1.0);
  if (aa <= 0.0) discard;

  vec3 n = normalize(vNormal);
  bool front = gl_FrontFacing;
  if (!front) n = -n;
  vec3 nG = n;

  // crease map through a cotangent frame (works flat and crumpled)
  vec2 cuv = vec2(vRest.x, 1.0 - vRest.y);
  cuv = mix(cuv, 1.0 - cuv, uFlip);
  vec4 cm = texture(uCrease, cuv);
  vec2 slope = (cm.rg * 2.0 - 1.0) * 0.5 * mix(vec2(1.0), vec2(-1.0), uFlip) * uCreaseAmt;
  float fold = (cm.b * 2.0 - 1.0) * uFoldAmt * (front ? 1.0 : -1.0);
  float crack = cm.a * uCrack;

  // letter folds (made before the crumple): valley folds with a rounded bend, the outer panels
  // rise a little; a thin groove holds shadow and the lip above it catches the light
  float lf = 0.0;
  float lip = 0.0;
  if (uLetter.x > 0.5) {
    float yy = vRest.y * uSheetPx.y;
    float xx = (vRest.x - 0.5) * uSheetPx.x;
    float tw = max(fwidth(yy), 0.35);
    float s1 = yy - (uLetter.y * uSheetPx.y + xx * uLetterTilt);
    float s2 = yy - (uLetter.z * uSheetPx.y - xx * uLetterTilt * 0.7);
    float wob = vnoise(vec2(xx * 0.05, 3.7)) * 0.6 + 0.4;
    float l1 = 1.0 - smoothstep(0.15 * tw, 0.9 * tw + 0.35, abs(s1));
    float b1 = smoothstep(-2.5, 2.5, s1) * 2.0 - 1.0;
    lip = (1.0 - smoothstep(0.0, 1.6 * tw + 0.8, abs(s1 - 1.4 * tw - 0.6)));
    if (uLetter.x < 1.5) {
      slope.y += b1 * uLetter.w;
      lf = l1 * wob;
    } else {
      float l2 = 1.0 - smoothstep(0.15 * tw, 0.9 * tw + 0.35, abs(s2));
      float b2 = smoothstep(-2.5, 2.5, s2);
      slope.y += (b1 * 0.5 - 0.5) * uLetter.w + b2 * uLetter.w;
      lf = max(l1, l2) * wob;
      lip = max(lip, 1.0 - smoothstep(0.0, 1.6 * tw + 0.8, abs(s2 - 1.4 * tw - 0.6)));
    }
  }
  vec2 pert = -slope;
  vec3 dp1 = dFdx(vPos), dp2 = dFdy(vPos);
  vec2 du1 = dFdx(vRest), du2 = dFdy(vRest);
  vec3 dp2perp = cross(dp2, n), dp1perp = cross(n, dp1);
  vec3 T = dp2perp * du1.x + dp1perp * du2.x;
  vec3 B = dp2perp * du1.y + dp1perp * du2.y;
  float invmax = inversesqrt(max(max(dot(T,T), dot(B,B)), 1e-20));
  n = normalize(n + (T * pert.x + B * pert.y) * invmax * (front ? 1.0 : -1.0));

  // paper fibre grain
  vec2 gp = vRest*uSheetPx*0.9;
  float grain = (vnoise(gp*0.55)*0.6 + vnoise(gp*1.7+17.0)*0.4) - 0.5;

  // albedo: printed image on the front, paper (with a faint show-through) on the back
  vec2 img = vec2((vRest.x-uInset.x)/(uInset.z-uInset.x), ((1.0-vRest.y)-uInset.y)/(uInset.w-uInset.y));
  // anti-aliased edge of the printed area (sheet pixel space)
  vec2 pp = vec2(vRest.x, 1.0-vRest.y) * uSheetPx;
  vec2 r0 = uInset.xy * uSheetPx, r1 = uInset.zw * uSheetPx;
  vec2 dd = max(r0 - pp, pp - r1);
  float dimg = max(dd.x, dd.y);
  float inImg = clamp(0.5 - dimg / max(fwidth(dimg), 1e-4), 0.0, 1.0) * uHasImage * uImgFade;
  vec3 paper = toLinear(uPaper);
  vec3 albedo = paper;
  if (front) {
    vec3 ic = toLinear(texture(uImage, uCover.xy + clamp(img,0.0,1.0)*uCover.zw).rgb);
    albedo = mix(paper, ic, inImg);
    // ink cracks and worn fibres along the folds show the paper through the print
    float wht = crack + max(fold, 0.0) * 0.015 + lf * 0.16 * uFoldAmt;
    albedo = mix(albedo, paper * 1.02, clamp(wht, 0.0, 0.6) * inImg);
  } else {
    vec2 mimg = vec2(1.0-img.x, img.y);
    vec3 ic = toLinear(texture(uImage, uCover.xy + clamp(mimg,0.0,1.0)*uCover.zw).rgb);
    float lum = dot(ic, vec3(0.3,0.59,0.11));
    albedo = paper * mix(1.0, 0.82 + 0.18*lum/max(dot(paper,vec3(0.3,0.59,0.11)),0.01), uShow*inImg);
  }
  albedo *= 1.0 + grain*uGrain*mix(0.06, 0.09, 1.0-inImg);

  // lighting, normalised so a flat, level sheet shows the image 1:1
  vec3 nFlat = vec3(0.0,0.0,1.0);
  float L = lightAt(n)/lightAt(nFlat);
  // the creases read like under a desk lamp: a lower light brings out the facets
  L += (max(dot(n,uKeyD),0.0) - max(dot(nG,uKeyD),0.0)) * 0.6;
  // fold lines: valleys hold a little shadow, ridges catch the light
  L *= 1.0 - max(-fold, 0.0) * 0.22 - lf * 0.3 * min(uFoldAmt * 2.0, 1.0);
  L += max(fold, 0.0) * 0.07 + lip * 0.05 * min(uFoldAmt * 2.0, 1.0);
  float rake = (max(dot(n,uRake),0.0) - max(dot(nFlat,uRake),0.0)*(1.0-uCrumple)) * uRakeAmt * 1.6;
  vec3 V = normalize(uEye - vPos);
  vec3 H = normalize(uKey + V);
  float shin = mix(18.0, 110.0, uGloss);
  float ks = mix(0.012, 0.16, uGloss);
  float spec = pow(max(dot(n,H),0.0), shin) * ks;
  float specR = pow(max(dot(n,normalize(uRake + V)),0.0), shin*0.7) * mix(0.01, 0.14, uGloss) * uRakeAmt;
  // keep a little of the broad sheen on the smoothed print: it reads as real photo paper
  float flatSpec = pow(max(dot(nFlat,H),0.0), shin) * ks * (1.0-uCrumple);
  float lum = dot(albedo, vec3(0.3,0.59,0.11));
  float sheen = mix(0.22, 1.0, clamp(lum*2.2, 0.0, 1.0));
  vec3 col = albedo * (L*vAO + rake) + vec3((spec + specR - flatSpec*0.7) * sheen);
  outColor = vec4(toSRGB(col)*aa, aa);
}`;
const VS_MASK = `#version 300 es
in vec3 aPos;
uniform vec3 uDir; uniform vec2 uHalf;
void main(){ vec2 p = aPos.xy - uDir.xy/uDir.z*aPos.z; gl_Position = vec4(p/uHalf, 0.0, 1.0); }`;
const FS_MASK = `#version 300 es
precision mediump float;
uniform vec4 uCol; out vec4 o; void main(){ o = uCol; }`;
const VS_QUAD = `#version 300 es
in vec2 aQ; out vec2 vUV;
void main(){ vUV = aQ*0.5+0.5; gl_Position = vec4(aQ,0.0,1.0); }`;
const FS_BLUR = `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uTex; uniform vec2 uStepA; uniform vec2 uStepB; out vec4 o;
void main(){
  vec2 acc = vec2(0.0); float wsum = 0.0;
  for (int i=-12;i<=12;i++){ float x=float(i); float w=exp(-x*x/72.0);
    acc.x += texture(uTex, vUV+uStepA*x).r*w; acc.y += texture(uTex, vUV+uStepB*x).g*w; wsum += w; }
  o = vec4(acc/wsum, 0.0, 1.0);
}`;
const FS_SHADOW = `#version 300 es
precision highp float;
in vec2 vUV; uniform sampler2D uTex; uniform vec3 uShadow; uniform vec2 uAmt; out vec4 o;
void main(){ vec2 m = texture(uTex, vUV).rg; float a = clamp(m.r*uAmt.x + m.g*uAmt.y, 0.0, 1.0);
  o = vec4(uShadow*a, a); }`;
const GL_ATTRS = { antialias: true, premultipliedAlpha: true, alpha: true }; // Shaders are compiled and linked without asking for their status in between, so the driver can work
// on all programs at once (and in the background with KHR_parallel_shader_compile, see prepareScene).
function linkStart(gl, vs, fs) {
  const p = gl.createProgram();
  for (const [type, src] of [
    [gl.VERTEX_SHADER, vs],
    [gl.FRAGMENT_SHADER, fs],
  ]) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    gl.attachShader(p, s);
  }
  gl.linkProgram(p);
  return p;
}
function linkFinish(gl, p) {
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const logs = (gl.getAttachedShaders(p) || [])
      .map((s) => gl.getShaderInfoLog(s) || "")
      .join("\n");
    throw new Error((gl.getProgramInfoLog(p) || "link") + "\n" + logs);
  }
  const u = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i);
    if (info) u[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}
function startPrograms(gl) {
  return [
    linkStart(gl, VS_PAPER, FS_PAPER),
    linkStart(gl, VS_MASK, FS_MASK),
    linkStart(gl, VS_QUAD, FS_BLUR),
    linkStart(gl, VS_QUAD, FS_SHADOW),
  ];
} // Creates the scene without blocking the main thread on shader compilation: where the browser
// compiles in the background (KHR_parallel_shader_compile) this waits in short timer steps until
// all programs are linked; otherwise the status query in the constructor waits as before.
async function prepareScene(canvas, data) {
  const gl = canvas.getContext("webgl2", GL_ATTRS);
  if (!gl) throw new Error("WebGL2 unavailable");
  const programs = startPrograms(gl);
  const ext = gl.getExtension("KHR_parallel_shader_compile");
  if (ext) {
    const t0 = Date.now();
    const done = () =>
      programs.every(
        (p) => gl.getProgramParameter(p, ext.COMPLETION_STATUS_KHR) !== false,
      );
    while (!done() && Date.now() - t0 < 4e3)
      await new Promise((r) => setTimeout(r, 8));
  }
  return new CrumpleScene(canvas, data, { gl, programs });
}
function parseColor(c, fallback) {
  if (!c || typeof c !== "string") return fallback;
  const s = c.trim();
  if (s[0] === "#") {
    let h = s.slice(1);
    if (h.length === 3 || h.length === 4)
      h = h
        .split("")
        .map((x) => x + x)
        .join("");
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const a = h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return [r, g, b, a].some((x) => Number.isNaN(x)) ? fallback : [r, g, b, a];
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const v = m[1]
      .split(/[\s,/]+/)
      .filter(Boolean)
      .map((x) => parseFloat(x));
    if (v.length >= 3)
      return [v[0] / 255, v[1] / 255, v[2] / 255, v.length > 3 ? v[3] : 1];
  }
  return fallback;
}
class CrumpleScene {
  // true while a crease map is still being built (callers keep their render loop running)
  creasePending() {
    return this.creaseQueue.length > 0;
  } // Advances the crease map jobs for about budgetMs. With a frame id (the rAF timestamp) the budget is
  // shared by every sheet that pumps in that frame, so many sheets never add up to a long task.
  // A finished map is uploaded in a slice of its own.
  pumpCrease(budgetMs, frame) {
    const now = () =>
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const t0 = now();
    if (frame !== undefined) {
      if (frame !== this.pumpFrame) {
        this.pumpFrame = frame;
        this.pumpSpent = 0;
      }
      budgetMs -= this.pumpSpent;
      if (budgetMs <= 0) return;
    }
    const gl = this.gl;
    try {
      while (this.creaseQueue.length) {
        const q = this.creaseQueue[0];
        const m = this.creaseMaps.get(q.key); // nobody asked for this size for a second (resized away, or its sheet left the screen): drop it
        if (!m || t0 - m.used > 1e3) {
          this.creaseQueue.shift();
          if (m) {
            gl.deleteTexture(m.tex);
            this.creaseMaps.delete(q.key);
          }
          continue;
        }
        if (!q.data) {
          let r = q.job.next();
          while (!r.done && now() - t0 < budgetMs) r = q.job.next();
          if (!r.done) return;
          q.data = r.value;
          if (now() - t0 >= budgetMs * 0.5) return;
        }
        this.creaseQueue.shift();
        gl.bindTexture(gl.TEXTURE_2D, m.tex);
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          q.w,
          q.h,
          0,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          q.data,
        );
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(
          gl.TEXTURE_2D,
          gl.TEXTURE_MIN_FILTER,
          gl.LINEAR_MIPMAP_LINEAR,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        m.ready = true;
        q.data = null;
        if (now() - t0 >= budgetMs) return;
      }
    } finally {
      if (frame !== undefined) this.pumpSpent += now() - t0;
    }
  }
  creaseKey(W, H, dpr, seed) {
    const s = Math.min(1, 1024 / Math.max(W * dpr, H * dpr, 1));
    const w = Math.max(64, Math.round((W * dpr * s) / 32) * 32);
    const h = Math.max(64, Math.round((H * dpr * s) / 32) * 32);
    return { w, h, key: w + "x" + h + ":" + seed };
  } // true once the crease map for this sheet size is built and uploaded (registers its job if needed)
  creaseReady(W, H, dpr, seed) {
    this.creaseFor(W, H, dpr, seed);
    const m = this.creaseMaps.get(this.creaseKey(W, H, dpr, seed).key);
    return !!m && m.ready;
  } // Crease texture for a sheet size. Until its map is built, the most recently used finished map of the
  // same seed stands in (same pattern at another resolution for the same aspect), else level paper.
  creaseFor(W, H, dpr, seed) {
    const { w, h, key } = this.creaseKey(W, H, dpr, seed);
    const t =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    let m = this.creaseMaps.get(key);
    if (!m) {
      if (this.creaseMaps.size >= 4) {
        let oldest = "";
        let ot = Infinity;
        for (const [k, v] of this.creaseMaps)
          if (v.ready && v.used < ot) ((ot = v.used), (oldest = k));
        const old = oldest ? this.creaseMaps.get(oldest) : undefined;
        if (old) {
          this.gl.deleteTexture(old.tex);
          this.creaseMaps.delete(oldest);
        }
      }
      m = { tex: this.gl.createTexture(), ready: false, used: t, seed };
      this.creaseMaps.set(key, m);
      this.creaseQueue.push({
        key,
        w,
        h,
        job: creaseMapJob(w, h, seed),
        data: null,
      });
    }
    m.used = t;
    if (m.ready) return m.tex;
    let best = null;
    for (const v of this.creaseMaps.values())
      if (v.ready && v.seed === seed && (!best || v.used > best.used)) best = v;
    return best ? best.tex : this.neutralTex;
  }
  item(key) {
    let it = this.items.get(key);
    if (it) return it;
    const gl = this.gl;
    const F = this.d.F;
    const soupPos = new Float32Array(F * 9);
    const soupNrm = new Float32Array(F * 9);
    const soupAO = new Float32Array(F * 3);
    const P = this.paperProg.p;
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const mk = (arr, name, size) => {
      const b = gl.createBuffer();
      const loc = gl.getAttribLocation(P, name);
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, arr, gl.DYNAMIC_DRAW);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      }
      return b;
    };
    const bPos = mk(soupPos, "aPos", 3);
    const bNrm = mk(soupNrm, "aNormal", 3);
    const bAO = mk(soupAO, "aAO", 1);
    const lr = gl.getAttribLocation(P, "aRest");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bRest);
    if (lr >= 0) {
      gl.enableVertexAttribArray(lr);
      gl.vertexAttribPointer(lr, 2, gl.FLOAT, false, 0, 0);
    }
    const maskVao = gl.createVertexArray();
    gl.bindVertexArray(maskVao);
    gl.bindBuffer(gl.ARRAY_BUFFER, bPos);
    const lm = gl.getAttribLocation(this.maskProg.p, "aPos");
    gl.enableVertexAttribArray(lm);
    gl.vertexAttribPointer(lm, 3, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([240, 238, 232, 255]),
    );
    it = {
      vao,
      maskVao,
      bPos,
      bNrm,
      bAO,
      tex,
      imgW: 1,
      imgH: 1,
      hasImage: 0,
      img: null,
      fadeStart: 0,
      soupPos,
      soupNrm,
      soupAO,
      built: "",
      c: 0,
    };
    this.items.set(key, it);
    return it;
  }
  removeItem(key) {
    const it = this.items.get(key);
    if (!it) return;
    const gl = this.gl;
    gl.deleteVertexArray(it.vao);
    gl.deleteVertexArray(it.maskVao);
    gl.deleteBuffer(it.bPos);
    gl.deleteBuffer(it.bNrm);
    gl.deleteBuffer(it.bAO);
    gl.deleteTexture(it.tex);
    this.items.delete(key);
  }
  removeItemsExcept(keys) {
    const gl = this.gl;
    for (const [k, it] of this.items) {
      if (keys.includes(k)) continue;
      gl.deleteVertexArray(it.vao);
      gl.deleteVertexArray(it.maskVao);
      gl.deleteBuffer(it.bPos);
      gl.deleteBuffer(it.bNrm);
      gl.deleteBuffer(it.bAO);
      gl.deleteTexture(it.tex);
      this.items.delete(k);
    }
  } // img: a decoded image, or an ImageBitmap / canvas already scaled to the size the sheet needs
  // (callers keep it within maxTexture). fade: false swaps the print without fading it in again.
  setImage(key, img, fade = true) {
    const gl = this.gl;
    const it = this.item(key);
    if (it.img === img) return;
    it.img = img;
    gl.bindTexture(gl.TEXTURE_2D, it.tex);
    if (!img) {
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([240, 238, 232, 255]),
      );
      it.hasImage = 0;
      return;
    }
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      gl.LINEAR_MIPMAP_LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const an = gl.getExtension("EXT_texture_filter_anisotropic");
    if (an) gl.texParameterf(gl.TEXTURE_2D, an.TEXTURE_MAX_ANISOTROPY_EXT, 8);
    it.imgW = img.naturalWidth || img.width || 1;
    it.imgH = img.naturalHeight || img.height || 1;
    const had = it.hasImage;
    it.hasImage = 1;
    if (fade || !had)
      it.fadeStart = typeof performance !== "undefined" ? performance.now() : 0;
  } // true while a print (this sheet's, or any without a key) is still fading in (the caller keeps its loop running)
  fading(key) {
    const now = typeof performance !== "undefined" ? performance.now() : 0;
    if (key !== undefined) {
      const it = this.items.get(key);
      return !!it && !!it.hasImage && now - it.fadeStart < 450;
    }
    for (const it of this.items.values())
      if (it.hasImage && now - it.fadeStart < 450) return true;
    return false;
  }
  ensureShadowRT(w, h) {
    const gl = this.gl;
    const key = w + "x" + h;
    const t =
      typeof performance !== "undefined" ? performance.now() : Date.now();
    const hit = this.shadowRTs.get(key);
    if (hit) {
      hit.used = t;
      return hit;
    }
    if (this.shadowRTs.size >= 4) {
      let oldest = "";
      let ot = Infinity;
      for (const [k, v] of this.shadowRTs)
        if (v.used < ot) ((ot = v.used), (oldest = k));
      const old = this.shadowRTs.get(oldest);
      if (old) {
        for (const x of [old.a, old.b]) {
          gl.deleteTexture(x.t);
          gl.deleteFramebuffer(x.fb);
        }
        this.shadowRTs.delete(oldest);
      }
    }
    const mk = () => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA8,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        t,
        0,
      );
      return { t, fb };
    };
    const rt = { w, h, used: t, a: mk(), b: mk() };
    this.shadowRTs.set(key, rt);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return rt;
  } // world space: css px, origin at the component centre, y up
  build(it, st, o) {
    const { N, F, K, keys, faces, relief, crumple, center, rest } = this.d;
    const p = Math.min(1, Math.max(0, st.progress));
    const u = p * (K - 1);
    const k1 = Math.min(K - 2, Math.floor(u));
    const t = u - k1;
    const k0 = Math.max(0, k1 - 1);
    const k2 = k1 + 1;
    const k3 = Math.min(K - 1, k1 + 2);
    const t2 = t * t;
    const t3 = t2 * t;
    const w0 = -0.5 * t3 + t2 - 0.5 * t;
    const w1 = 1.5 * t3 - 2.5 * t2 + 1;
    const w2 = -1.5 * t3 + 2 * t2 + 0.5 * t;
    const w3 = 0.5 * t3 - 0.5 * t2;
    const c = crumple[k1] * (1 - t) + crumple[k2] * t;
    it.c = c;
    const W = st.w;
    const H = st.h;
    const S = Math.sqrt(W * H);
    const bs = 1 + (o.ballSize - 1) * c;
    const sx = (W + (S - W) * c) * bs;
    const sy = (H + (S - H) * c) * bs;
    const ccx = (center[k1 * 2] * (1 - t) + center[k2 * 2] * t) * c;
    const ccy = (center[k1 * 2 + 1] * (1 - t) + center[k2 * 2 + 1] * t) * c;
    const pos = this.pos;
    const b0 = k0 * N * 3;
    const b1 = k1 * N * 3;
    const b2 = k2 * N * 3;
    const b3 = k3 * N * 3; // rotations: tilt (shows another side of the ball) grows with the crumple, spin blends to the print angle
    const tl = st.tilt * c * c;
    const ax = Math.cos(st.tiltAxis);
    const ay = Math.sin(st.tiltAxis);
    const ct = Math.cos(tl);
    const stn = Math.sin(tl);
    const rot = st.flatRot + (st.spin - st.flatRot) * c;
    const cr = Math.cos(rot);
    const sr = Math.sin(rot);
    let zc = 0;
    for (let v = 0; v < N; v++)
      zc += keys[b1 + v * 3 + 2] * (1 - t) + keys[b2 + v * 3 + 2] * t;
    zc = (zc / N) * S * bs;
    let minZ = 1e9;
    for (let v = 0; v < N; v++) {
      const i = v * 3;
      const x =
        (w0 * keys[b0 + i] +
          w1 * keys[b1 + i] +
          w2 * keys[b2 + i] +
          w3 * keys[b3 + i] -
          ccx) *
        sx;
      const y =
        (w0 * keys[b0 + i + 1] +
          w1 * keys[b1 + i + 1] +
          w2 * keys[b2 + i + 1] +
          w3 * keys[b3 + i + 1] -
          ccy) *
        sy;
      const z =
        Math.max(
          0,
          w0 * keys[b0 + i + 2] +
            w1 * keys[b1 + i + 2] +
            w2 * keys[b2 + i + 2] +
            w3 * keys[b3 + i + 2],
        ) *
          S *
          bs -
        zc; // Rodrigues rotation around the horizontal axis (ax, ay, 0)
      const d = ax * x + ay * y;
      const rx = x * ct + ay * z * stn + ax * d * (1 - ct);
      const ry = y * ct - ax * z * stn + ay * d * (1 - ct);
      const rz = z * ct + (ax * y - ay * x) * stn;
      pos[i] = rx * cr - ry * sr;
      pos[i + 1] = rx * sr + ry * cr;
      pos[i + 2] = rz;
      if (rz < minZ) minZ = rz;
    } // the smoothed print keeps a memory of its creases and lifts slightly at the corners
    const flat = Math.pow(1 - c, 3);
    const reliefAmp = o.creases * 0.02 * S * flat;
    const curlAmp = o.creases * 0.03 * S * flat;
    const lift = o.lift * S + st.hoverLift * S * 0.035 * flat;
    const cxw = st.x + W / 2 - o.width / 2 + st.offX * st.w * c;
    const cyw = -(st.y + H / 2 - o.height / 2) - st.offY * st.h * c;
    const cu = st.curl;
    for (let v = 0; v < N; v++) {
      const i = v * 3;
      const ru = rest[v * 2];
      const rv = rest[v * 2 + 1]; // corner lift: 0 tl, 1 tr, 2 br, 3 bl (rest y points up)
      const d0 = Math.max(0, 1 - Math.hypot(ru, 1 - rv) / 0.42);
      const d1 = Math.max(0, 1 - Math.hypot(1 - ru, 1 - rv) / 0.42);
      const d2 = Math.max(0, 1 - Math.hypot(1 - ru, rv) / 0.42);
      const d3 = Math.max(0, 1 - Math.hypot(ru, rv) / 0.42);
      const curl =
        Math.max(0, cu[0]) * d0 * d0 * d0 +
        Math.max(0, cu[1]) * d1 * d1 * d1 +
        Math.max(0, cu[2]) * d2 * d2 * d2 +
        Math.max(0, cu[3]) * d3 * d3 * d3;
      pos[i] += cxw;
      pos[i + 1] += cyw;
      pos[i + 2] +=
        -minZ + (relief[v] + 0.4) * reliefAmp + curl * curlAmp + lift;
    }
    const fn = this.fn;
    const fu = this.fu;
    for (let f = 0; f < F; f++) {
      const a = faces[f * 3] * 3;
      const b = faces[f * 3 + 1] * 3;
      const cc = faces[f * 3 + 2] * 3;
      const e1x = pos[b] - pos[a];
      const e1y = pos[b + 1] - pos[a + 1];
      const e1z = pos[b + 2] - pos[a + 2];
      const e2x = pos[cc] - pos[a];
      const e2y = pos[cc + 1] - pos[a + 1];
      const e2z = pos[cc + 2] - pos[a + 2];
      const nx = e1y * e2z - e1z * e2y;
      const ny = e1z * e2x - e1x * e2z;
      const nz = e1x * e2y - e1y * e2x;
      fn[f * 3] = nx;
      fn[f * 3 + 1] = ny;
      fn[f * 3 + 2] = nz;
      const l = Math.hypot(nx, ny, nz) || 1;
      fu[f * 3] = nx / l;
      fu[f * 3 + 1] = ny / l;
      fu[f * 3 + 2] = nz / l;
    } // ambient occlusion: deep inside the ball gets darker
    let mx = 0;
    let my = 0;
    let mz = 0;
    for (let v = 0; v < N; v++) {
      mx += pos[v * 3];
      my += pos[v * 3 + 1];
      mz += pos[v * 3 + 2];
    }
    mx /= N;
    my /= N;
    mz /= N;
    const ao = this.ao;
    let rmax = 1e-6;
    for (let v = 0; v < N; v++) {
      const r = Math.hypot(
        pos[v * 3] - mx,
        pos[v * 3 + 1] - my,
        pos[v * 3 + 2] - mz,
      );
      ao[v] = r;
      if (r > rmax) rmax = r;
    }
    const aoAmt = o.ao * c * c;
    for (let v = 0; v < N; v++) {
      let tt = (ao[v] / rmax - 0.45) / 0.5;
      tt = tt < 0 ? 0 : tt > 1 ? 1 : tt;
      tt = tt * tt * (3 - 2 * tt);
      ao[v] = 1 - aoAmt * (1 - tt) * 0.75;
    }
    const cosT = Math.cos((o.creaseAngle * Math.PI) / 180);
    const fanStart = this.fanStart;
    const fan = this.fan;
    const sp = it.soupPos;
    const sn = it.soupNrm;
    const sa = it.soupAO;
    for (let f = 0; f < F; f++) {
      const ux = fu[f * 3];
      const uy = fu[f * 3 + 1];
      const uz = fu[f * 3 + 2];
      for (let k = 0; k < 3; k++) {
        const v = faces[f * 3 + k];
        let nx = 0;
        let ny = 0;
        let nz = 0;
        for (let j = fanStart[v]; j < fanStart[v + 1]; j++) {
          const g = fan[j];
          if (
            fu[g * 3] * ux + fu[g * 3 + 1] * uy + fu[g * 3 + 2] * uz >=
            cosT
          ) {
            nx += fn[g * 3];
            ny += fn[g * 3 + 1];
            nz += fn[g * 3 + 2];
          }
        }
        const l = Math.hypot(nx, ny, nz) || 1;
        const s = (f * 3 + k) * 3;
        sn[s] = nx / l;
        sn[s + 1] = ny / l;
        sn[s + 2] = nz / l;
        sp[s] = pos[v * 3];
        sp[s + 1] = pos[v * 3 + 1];
        sp[s + 2] = pos[v * 3 + 2];
        sa[f * 3 + k] = ao[v];
      }
    }
    const gl = this.gl;
    gl.bindBuffer(gl.ARRAY_BUFFER, it.bPos);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sp);
    gl.bindBuffer(gl.ARRAY_BUFFER, it.bNrm);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sn);
    gl.bindBuffer(gl.ARRAY_BUFFER, it.bAO);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, sa);
  } // Renders into the bottom-left pw x ph pixels of the canvas (the canvas only grows, so sheets of
  // different sizes can share it). Returns the drawn size for copying the result elsewhere.
  render(o, states) {
    const gl = this.gl;
    const M = o.margin;
    const cw = o.width + 2 * M;
    const ch = o.height + 2 * M;
    const pw = Math.max(1, Math.round(cw * o.dpr));
    const ph = Math.max(1, Math.round(ch * o.dpr));
    if (this.canvas.width < pw || this.canvas.height < ph) {
      this.canvas.width = Math.max(this.canvas.width, pw);
      this.canvas.height = Math.max(this.canvas.height, ph);
    }
    const halfW = cw / 2;
    const halfH = ch / 2;
    if (!states.length) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, pw, ph);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { pw, ph };
    }
    const cellW = states[0].w;
    const cellH = states[0].h; // the crease map is built by pumpCrease() from the caller's frame loop, never here
    const creaseTex = this.creaseFor(cellW, cellH, o.dpr, o.seed);
    const geoKey = [
      o.width,
      o.height,
      o.creases,
      o.creaseAngle,
      o.lift,
      o.ballSize,
      o.ao,
    ].join("|");
    for (const st of states) {
      const it = this.item(st.key);
      const key =
        geoKey +
        "|" +
        [
          st.x,
          st.y,
          st.w,
          st.h,
          st.progress.toFixed(5),
          st.tilt,
          st.tiltAxis,
          st.spin,
          st.flatRot,
          st.offX,
          st.offY,
          st.curl.join(","),
          st.hoverLift.toFixed(4),
        ].join("|");
      if (it.built !== key) {
        this.build(it, st, o);
        it.built = key;
      }
    }
    const S = Math.sqrt(cellW * cellH);
    const D = Math.max(cellW, cellH) * 2.6; // ---- shadow mask: ambient (straight down) in R, key light in G ----
    const sw = Math.max(64, Math.round(cw / 3));
    const sh = Math.max(64, Math.round(ch / 3));
    const rt = this.ensureShadowRT(sw, sh);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rt.a.fb);
    gl.viewport(0, 0, sw, sh);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.blendEquation(gl.MAX);
    gl.useProgram(this.maskProg.p);
    gl.uniform2f(this.maskProg.u.uHalf, halfW, halfH);
    const kd = o.keyDir;
    for (const st of states) {
      const it = this.item(st.key);
      gl.bindVertexArray(it.maskVao);
      gl.colorMask(true, false, false, false);
      gl.uniform3f(this.maskProg.u.uDir, 0, 0, 1);
      gl.uniform4f(this.maskProg.u.uCol, 1, 0, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, this.d.F * 3);
      gl.colorMask(false, true, false, false);
      gl.uniform3f(this.maskProg.u.uDir, kd[0], kd[1], kd[2]);
      gl.uniform4f(this.maskProg.u.uCol, 0, 1, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, this.d.F * 3);
    }
    gl.colorMask(true, true, true, true);
    gl.blendEquation(gl.FUNC_ADD);
    gl.disable(gl.BLEND);
    gl.useProgram(this.blurProg.p);
    gl.bindVertexArray(this.quadVao);
    const ra = (S * 0.026) / 3 / 6;
    const rk = (S * 0.012) / 3 / 6;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rt.b.fb);
    gl.bindTexture(gl.TEXTURE_2D, rt.a.t);
    gl.uniform1i(this.blurProg.u.uTex, 0);
    gl.uniform2f(this.blurProg.u.uStepA, ra / sw, 0);
    gl.uniform2f(this.blurProg.u.uStepB, rk / sw, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindFramebuffer(gl.FRAMEBUFFER, rt.a.fb);
    gl.bindTexture(gl.TEXTURE_2D, rt.b.t);
    gl.uniform2f(this.blurProg.u.uStepA, 0, ra / sh);
    gl.uniform2f(this.blurProg.u.uStepB, 0, rk / sh);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); // ---- main pass ----
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, pw, ph);
    gl.clearColor(0, 0, 0, 0);
    gl.clearDepth(1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.shadowProg.p);
    gl.bindTexture(gl.TEXTURE_2D, rt.a.t);
    gl.uniform1i(this.shadowProg.u.uTex, 0);
    const sc = parseColor(o.shadow, [0.1, 0.08, 0.05, 0.4]);
    gl.uniform3f(this.shadowProg.u.uShadow, sc[0], sc[1], sc[2]);
    const sA = sc[3] * o.shadowAmt;
    gl.uniform2f(this.shadowProg.u.uAmt, sA * 0.55, sA * 0.5);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.useProgram(this.paperProg.p);
    const U = this.paperProg.u;
    gl.uniform2f(U.uHalf, halfW, halfH);
    gl.uniform1f(U.uD, D);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, creaseTex);
    gl.uniform1i(U.uCrease, 1);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(U.uImage, 0);
    const pc = parseColor(o.paper, [0.96, 0.95, 0.92, 1]);
    gl.uniform3f(U.uPaper, pc[0], pc[1], pc[2]);
    gl.uniform3f(U.uKey, kd[0], kd[1], kd[2]);
    const kaz = Math.atan2(kd[1], kd[0]);
    const kel = (38 * Math.PI) / 180;
    gl.uniform3f(
      U.uKeyD,
      Math.cos(kaz) * Math.cos(kel),
      Math.sin(kaz) * Math.cos(kel),
      Math.sin(kel),
    );
    gl.uniform3f(U.uFill, o.fillDir[0], o.fillDir[1], o.fillDir[2]);
    gl.uniform1f(U.uGloss, o.gloss);
    gl.uniform1f(U.uGrain, o.grain);
    gl.uniform1f(U.uShow, o.show);
    for (const st of states) {
      const it = this.item(st.key);
      const W = st.w;
      const H = st.h;
      const cx = st.x + W / 2 - o.width / 2;
      const cy = -(st.y + H / 2 - o.height / 2);
      gl.uniform2f(U.uCenter, cx, cy);
      gl.uniform3f(U.uEye, cx, cy, D);
      gl.bindTexture(gl.TEXTURE_2D, it.tex);
      const ins = o.inset;
      const ix0 = Math.min(0.45, ins[3] / W);
      const iy0 = Math.min(0.45, ins[0] / H);
      const ix1 = Math.max(ix0 + 0.05, 1 - ins[1] / W);
      const iy1 = Math.max(iy0 + 0.05, 1 - ins[2] / H);
      gl.uniform4f(U.uInset, ix0, iy0, ix1, iy1);
      const rAsp = ((ix1 - ix0) * W) / ((iy1 - iy0) * H);
      const iAsp = it.imgW / it.imgH;
      let cu = 1;
      let cv = 1;
      if (iAsp > rAsp) cu = rAsp / iAsp;
      else cv = iAsp / rAsp;
      gl.uniform4f(
        U.uCover,
        (1 - cu) * st.focus[0],
        (1 - cv) * st.focus[1],
        cu,
        cv,
      );
      gl.uniform1f(U.uHasImage, it.hasImage);
      const re = o.rakeElev;
      gl.uniform3f(
        U.uRake,
        Math.cos(st.rakeAngle) * Math.cos(re),
        Math.sin(st.rakeAngle) * Math.cos(re),
        Math.sin(re),
      );
      gl.uniform1f(U.uRakeAmt, st.rake);
      gl.uniform1f(U.uCrumple, it.c);
      gl.uniform2f(U.uSheetPx, W, H);
      const maxR = Math.min(W, H) / 2;
      gl.uniform4f(
        U.uRadii,
        Math.min(o.radii[0], maxR),
        Math.min(o.radii[1], maxR),
        Math.min(o.radii[2], maxR),
        Math.min(o.radii[3], maxR),
      );
      const fl1 = 1 - it.c;
      gl.uniform1f(U.uCreaseAmt, o.creases * 1.05 * (0.35 + 0.65 * fl1));
      gl.uniform1f(
        U.uFoldAmt,
        Math.min(1, o.creases * 1.4) * (0.4 + 0.6 * fl1),
      );
      gl.uniform1f(U.uCrack, Math.min(1, o.creases * 1.2) * 0.32 * fl1);
      const fj = st.foldJitter || [0, 0, 0];
      const tent = 0.11 * Math.pow(fl1, 3);
      if (st.fold === 1)
        gl.uniform4f(U.uLetter, 1, 0.5 + fj[0] * 0.015, 0, tent);
      else if (st.fold === 2)
        gl.uniform4f(
          U.uLetter,
          2,
          1 / 3 + fj[0] * 0.015,
          2 / 3 + fj[1] * 0.015,
          tent,
        );
      else gl.uniform4f(U.uLetter, 0, 0, 0, 0);
      gl.uniform1f(U.uLetterTilt, fj[2] * 0.012);
      gl.uniform2f(U.uFlip, st.flip[0], st.flip[1]);
      const now = typeof performance !== "undefined" ? performance.now() : 0;
      const fz = it.hasImage ? Math.min(1, (now - it.fadeStart) / 450) : 0;
      gl.uniform1f(U.uImgFade, fz * fz * (3 - 2 * fz));
      gl.bindVertexArray(it.vao);
      gl.drawArrays(gl.TRIANGLES, 0, this.d.F * 3);
    }
    gl.bindVertexArray(null);
    return { pw, ph };
  }
  dispose() {
    const ext = this.gl.getExtension("WEBGL_lose_context");
    if (ext) ext.loseContext();
  } // pre: context + linked programs from prepareScene() (compiled without blocking); without it the
  // constructor compiles synchronously
  constructor(canvas, data, pre) {
    _define_property(this, "canvas", void 0);
    _define_property(this, "gl", void 0);
    _define_property(this, "d", void 0);
    _define_property(this, "paperProg", void 0);
    _define_property(this, "maskProg", void 0);
    _define_property(this, "blurProg", void 0);
    _define_property(this, "shadowProg", void 0);
    _define_property(this, "fanStart", void 0);
    _define_property(this, "fan", void 0);
    _define_property(this, "pos", void 0);
    _define_property(this, "fn", void 0);
    _define_property(this, "fu", void 0);
    _define_property(this, "ao", void 0);
    _define_property(this, "bRest", void 0);
    _define_property(this, "quadVao", void 0);
    _define_property(this, "neutralTex", void 0); // crease maps and shadow targets are cached per sheet size: many sheets can share one renderer
    _define_property(this, "creaseMaps", new Map());
    _define_property(this, "creaseQueue", []);
    _define_property(this, "pumpFrame", -1);
    _define_property(this, "pumpSpent", 0);
    _define_property(this, "maxTexture", 4096);
    _define_property(this, "items", new Map());
    _define_property(this, "shadowRTs", new Map());
    this.canvas = canvas;
    this.d = data;
    const gl = pre ? pre.gl : canvas.getContext("webgl2", GL_ATTRS);
    if (!gl) throw new Error("WebGL2 unavailable");
    this.gl = gl;
    const progs = pre ? pre.programs : startPrograms(gl);
    this.paperProg = linkFinish(gl, progs[0]);
    this.maskProg = linkFinish(gl, progs[1]);
    this.blurProg = linkFinish(gl, progs[2]);
    this.shadowProg = linkFinish(gl, progs[3]);
    this.maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 4096;
    const { N, F, faces, rest } = data;
    const fanStart = new Int32Array(N + 1);
    for (let i = 0; i < F * 3; i++) fanStart[faces[i] + 1]++;
    for (let i = 0; i < N; i++) fanStart[i + 1] += fanStart[i];
    const fan = new Int32Array(F * 3);
    const fill = fanStart.slice(0, N);
    for (let f = 0; f < F; f++)
      for (let c = 0; c < 3; c++) fan[fill[faces[f * 3 + c]]++] = f;
    this.fanStart = fanStart;
    this.fan = fan;
    this.pos = new Float32Array(N * 3);
    this.fn = new Float32Array(F * 3);
    this.fu = new Float32Array(F * 3);
    this.ao = new Float32Array(N);
    const soupRest = new Float32Array(F * 6);
    for (let i = 0; i < F * 3; i++) {
      soupRest[i * 2] = rest[faces[i] * 2];
      soupRest[i * 2 + 1] = rest[faces[i] * 2 + 1];
    }
    this.bRest = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bRest);
    gl.bufferData(gl.ARRAY_BUFFER, soupRest, gl.STATIC_DRAW);
    this.quadVao = gl.createVertexArray();
    gl.bindVertexArray(this.quadVao);
    const qb = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, qb);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    for (const pr of [this.blurProg, this.shadowProg]) {
      const l = gl.getAttribLocation(pr.p, "aQ");
      if (l >= 0) {
        gl.enableVertexAttribArray(l);
        gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
      }
    }
    gl.bindVertexArray(null); // neutral crease map until the procedural one is ready: level, no folds, no cracks
    this.neutralTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.neutralTex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([128, 128, 128, 0]),
    );
  }
} // ---------- embedded data ----------
// fold simulation (deflate + base64) and the baked crease overlay of the still sheet (JPEG)

export { acquireRenderer, releaseRenderer };
