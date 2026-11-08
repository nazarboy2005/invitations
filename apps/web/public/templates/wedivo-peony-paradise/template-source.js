
      window.startPeonySource = function (payload) {
        "use strict";
        var doc = document;
        var win = window;
        var body = doc.body;
        var $ = function (id) {
          return doc.getElementById(id);
        };
        var $$ = function (sel, root) {
          return Array.prototype.slice.call(
            (root || doc).querySelectorAll(sel),
          );
        };
        var clamp = function (v, a, b) {
          return v < a ? a : v > b ? b : v;
        };
        var pad = function (n) {
          return String(n).padStart(2, "0");
        };
        var reduceMotion = !!(payload.reducedMotion || 
          win.matchMedia &&
          win.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
        var uidN = 0;
        var uid = function (prefix) {
          uidN += 1;
          return prefix + "-" + uidN;
        };
        var isFilled = function (v) {
          if (v === null || v === undefined) {
            return false;
          }
          v = String(v).trim();
          return v !== "" && !/^\{\{[^}]*\}\}$/.test(v);
        };
        var txt = function (el) {
          var t = el ? (el.textContent || "").trim() : "";
          return isFilled(t) ? t : "";
        };
        var rail = $("nv-rail");
        function hideSection(id) {
          var s = doc.querySelector('[data-section="' + id + '"]');
          if (s) {
            s.style.display = "none";
          }
          var it = rail
            ? rail.querySelector('[data-nav-target="' + id + '"]')
            : null;
          if (it) {
            it.style.display = "none";
          }
        }
        function isShown(el) {
          return !!el && win.getComputedStyle(el).display !== "none";
        }
        /* ---------- toast & copy ---------- */
        var toastT = 0;
        function toast(msg) {
          var t = $("pp-toast");
          if (!t) {
            return;
          }
          t.textContent = msg;
          t.classList.add("is-on");
          clearTimeout(toastT);
          toastT = setTimeout(function () {
            t.classList.remove("is-on");
          }, 2800);
        }
        function copyText(s, okMsg) {
          var legacy = function () {
            var ta = doc.createElement("textarea");
            ta.id = uid("pp-copy");
            ta.value = s;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.top = "0";
            ta.style.opacity = "0";
            body.appendChild(ta);
            ta.select();
            try {
              doc.execCommand("copy");
              toast(okMsg);
            } catch (e) {
              toast(
                payload.ui.error,
              );
            }
            body.removeChild(ta);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(s).then(function () {
              toast(okMsg);
            }, legacy);
          } else {
            legacy();
          }
        }
        /* ---------- data ---------- */
        var D = ($("pp-data") || { dataset: {} }).dataset;
        var LOCALE = payload.locale === "uz-Cyrl" ? "uz-Cyrl-UZ" : payload.locale;
        function parseDT(date, time) {
          if (!isFilled(date)) {
            return null;
          }
          var t = isFilled(time) ? String(time).trim() : "00:00";
          var d = new Date(String(date).trim() + "T" + t + ":00");
          return isNaN(d.getTime()) ? null : d;
        }
        function fmtDate(d, opts) {
          return d.toLocaleDateString(
            LOCALE,
            opts || {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            },
          );
        }
        function fmtTime(hhmm) {
          if (!isFilled(hhmm)) {
            return "";
          }
          var p = String(hhmm).trim().split(":");
          return (
            pad(parseInt(p[0], 10) || 0) + "." + pad(parseInt(p[1], 10) || 0)
          );
        }
        var weddingAt = payload.data.dateTime ? new Date(payload.data.dateTime) : null;
        var tzLabel = isFilled(D.tz) ? D.tz.trim() : "";
        var brideName = isFilled(D.bride) ? D.bride.trim() : "";
        var groomName = isFilled(D.groom) ? D.groom.trim() : "";
        var venueName = isFilled(D.venue) ? D.venue.trim() : "";
        var venueAddr = isFilled(D.address) ? D.address.trim() : "";
        var placeId = isFilled(D.place) ? D.place.trim() : "";
        /* ---------- guest ---------- */
        var guestName = txt($("cv-guest-name"));
        body.classList.toggle("has-guest", guestName !== "");
        /* ---------- sound (soft synth chimes) ---------- */
        var actx = null;
        var userPaused = false;
        function sfx(kind) {
          if (userPaused || reduceMotion || payload.silentPlayback || !payload.data.music.enabled) {
            return;
          }
          try {
            if (!actx) {
              var AC = win.AudioContext || win.webkitAudioContext;
              if (!AC) {
                return;
              }
              actx = new AC();
            }
            if (actx.state === "suspended") {
              actx.resume();
            }
            var now = actx.currentTime;
            var notes =
              kind === "chime"
                ? [784, 988, 1175, 1568]
                : kind === "gullar-bayrami"
                  ? [523, 659, 784, 1046, 1318]
                  : kind === "drop"
                    ? [880, 659]
                    : [1046];
            notes.forEach(function (f, i) {
              var o = actx.createOscillator();
              var g = actx.createGain();
              o.type = "sine";
              o.frequency.value = f;
              var t0 = now + i * (kind === "gullar-bayrami" ? 0.14 : 0.08);
              g.gain.setValueAtTime(0.0001, t0);
              g.gain.linearRampToValueAtTime(
                kind === "pop" ? 0.04 : 0.035,
                t0 + 0.02,
              );
              g.gain.exponentialRampToValueAtTime(
                0.0001,
                t0 + (kind === "pop" ? 0.5 : 1.4),
              );
              o.connect(g);
              g.connect(actx.destination);
              o.start(t0);
              o.stop(t0 + 1.5);
            });
          } catch (e) {
            actx = null;
          }
        }
        /* ---------- watercolor keying: white paper -> transparent PNG ---------- */
        var UP = "";
        var WC = {
          bud: { u: "/templates/wedivo-peony-paradise/assets/44c22ca7ff95f86c7be9472f.jpg", max: 560, pri: 0 },
          half: { u: "/templates/wedivo-peony-paradise/assets/7d6e507375028af82896b28c.jpg", max: 640, pri: 0 },
          bloom_blush: { u: "/templates/wedivo-peony-paradise/assets/6f1961012de9c6b92ac14a93.jpg", max: 820, pri: 0 },
          lilac: { u: "/templates/wedivo-peony-paradise/assets/f7ce63b320556dfd35ff3dfb.jpg", max: 620, pri: 1 },
          ivory: { u: "/templates/wedivo-peony-paradise/assets/132af204b50827cb8a5d1ed1.jpg", max: 620, pri: 1 },
          coral: { u: "/templates/wedivo-peony-paradise/assets/d87592ced664995a7efa3bc7.jpg", max: 620, pri: 1 },
          sprigs: {
            u: "/templates/wedivo-peony-paradise/assets/f128d8b34c511f592a7217f5.jpg",
            max: 900,
            pri: 1,
            holes: true,
            parts: {
              sprig_1: [33, 15, 434, 466],
              sprig_2: [654, 22, 333, 485],
              sprig_3: [426, 285, 175, 329],
              sprig_4: [33, 553, 316, 440],
              sprig_5: [367, 522, 337, 464],
              sprig_6: [752, 531, 249, 448],
            },
          },
          petals: {
            u: "/templates/wedivo-peony-paradise/assets/fb8a9b3e226e11a169dda2f6.jpg",
            max: 1024,
            pri: 2,
            parts: {
              petal_1: [48, 37, 185, 197],
              petal_2: [311, 37, 196, 189],
              petal_3: [531, 33, 216, 199],
              petal_4: [806, 48, 181, 194],
              petal_5: [22, 264, 210, 194],
              petal_6: [293, 276, 198, 161],
              petal_7: [554, 269, 172, 175],
              petal_8: [784, 282, 213, 201],
              petal_9: [42, 495, 182, 200],
              petal_10: [254, 483, 208, 193],
              petal_11: [540, 492, 183, 182],
              petal_12: [778, 537, 191, 182],
              petal_13: [37, 731, 175, 204],
              petal_14: [277, 736, 185, 205],
              petal_15: [519, 737, 212, 197],
              petal_16: [760, 770, 216, 184],
            },
          },
          corner: {
            u: "/templates/wedivo-peony-paradise/assets/c96a7019674d11b6abff4cf6.jpg",
            max: 820,
            pri: 2,
            holes: true,
          },
          wreath: {
            u: "/templates/wedivo-peony-paradise/assets/da0bcd5e930b17654b018e17.jpg",
            max: 820,
            pri: 3,
            holes: true,
            keepBox: true,
          },
          garland: {
            u: "/templates/wedivo-peony-paradise/assets/9eabe71be8d9e960af76010f.jpg",
            max: 1200,
            pri: 3,
            holes: true,
          },
          bouquet: {
            u: "/templates/wedivo-peony-paradise/assets/c85db14b5026fc53c23c9b35.jpg",
            max: 640,
            pri: 4,
            holes: true,
          },
        };
        var cutUrls = {};
        var petalSprites = [];
        function setWcSrc(img) {
          var key = img.getAttribute("data-wc");
          var url = cutUrls[key];
          if (!url) {
            return;
          }
          if (img.getAttribute("src") === url) {
            return;
          }
          img.addEventListener(
            "load",
            function () {
              img.classList.add("is-ready");
            },
            { once: true },
          );
          img.src = url;
        }
        function applyCut(key, url, raw) {
          cutUrls[key] = url;
          $$('img[data-wc="' + key + '"]').forEach(function (img) {
            if (raw) {
              img.classList.add("is-raw");
            }
            img.addEventListener(
              "load",
              function () {
                img.classList.add("is-ready");
              },
              { once: true },
            );
            img.src = url;
          });
          if (key.indexOf("petal_") === 0) {
            $$(".ws-petal").forEach(function (el) {
              if (!el.style.getPropertyValue("--petal-img")) {
                el.style.setProperty("--petal-img", "url(" + url + ")");
              }
            });
          }
        }
        function boxBlur(src, w, h, r) {
          var tmp = new Float32Array(w * h);
          var x,
            y,
            i,
            acc,
            inv = 1 / (r * 2 + 1);
          for (y = 0; y < h; y++) {
            var row = y * w;
            acc = 0;
            for (i = -r; i <= r; i++) {
              acc += src[row + clamp(i, 0, w - 1)];
            }
            for (x = 0; x < w; x++) {
              tmp[row + x] = acc * inv;
              acc +=
                src[row + clamp(x + r + 1, 0, w - 1)] -
                src[row + clamp(x - r, 0, w - 1)];
            }
          }
          for (x = 0; x < w; x++) {
            acc = 0;
            for (i = -r; i <= r; i++) {
              acc += tmp[clamp(i, 0, h - 1) * w + x];
            }
            for (y = 0; y < h; y++) {
              src[y * w + x] = acc * inv;
              acc +=
                tmp[clamp(y + r + 1, 0, h - 1) * w + x] -
                tmp[clamp(y - r, 0, h - 1) * w + x];
            }
          }
        }
        function erode(src, w, h, r) {
          var tmp = new Float32Array(w * h);
          var x, y, i, m, v;
          for (y = 0; y < h; y++) {
            for (x = 0; x < w; x++) {
              m = 1;
              for (i = -r; i <= r; i++) {
                v = src[y * w + clamp(x + i, 0, w - 1)];
                if (v < m) {
                  m = v;
                }
              }
              tmp[y * w + x] = m;
            }
          }
          for (x = 0; x < w; x++) {
            for (y = 0; y < h; y++) {
              m = 1;
              for (i = -r; i <= r; i++) {
                v = tmp[clamp(y + i, 0, h - 1) * w + x];
                if (v < m) {
                  m = v;
                }
              }
              src[y * w + x] = m;
            }
          }
        }
        function keyCanvas(img, o) {
          var w0 = img.naturalWidth;
          var h0 = img.naturalHeight;
          var s = Math.min(1, o.max / Math.max(w0, h0));
          var w = Math.max(1, Math.round(w0 * s));
          var h = Math.max(1, Math.round(h0 * s));
          var c = doc.createElement("canvas");
          c.width = w;
          c.height = h;
          var cx = c.getContext("2d", { willReadFrequently: true });
          cx.drawImage(img, 0, 0, w, h);
          var im = cx.getImageData(0, 0, w, h);
          var d = im.data;
          var n = w * h;
          var i, p, k, x;
          var rs = [],
            gs = [],
            bs = [];
          var step = Math.max(1, Math.floor(Math.min(w, h) / 80));
          var push = function (px, py) {
            var q = (py * w + px) * 4;
            rs.push(d[q]);
            gs.push(d[q + 1]);
            bs.push(d[q + 2]);
          };
          for (i = 0; i < w; i += step) {
            push(i, 0);
            push(i, h - 1);
          }
          for (i = 0; i < h; i += step) {
            push(0, i);
            push(w - 1, i);
          }
          var med = function (a) {
            a.sort(function (m1, m2) {
              return m1 - m2;
            });
            return a[a.length >> 1];
          };
          var P = [
            Math.max(230, med(rs)),
            Math.max(230, med(gs)),
            Math.max(230, med(bs)),
          ];
          var ca = new Float32Array(n);
          for (p = 0; p < n; p++) {
            k = p * 4;
            var a0 = (P[0] - d[k]) / P[0];
            var a1 = (P[1] - d[k + 1]) / P[1];
            var a2 = (P[2] - d[k + 2]) / P[2];
            var mm = a0 > a1 ? a0 : a1;
            if (a2 > mm) {
              mm = a2;
            }
            ca[p] = mm < 0 ? 0 : mm > 1 ? 1 : mm;
          }
          var NEAR = 0.07;
          var bg = new Uint8Array(n);
          var stack = new Int32Array(n);
          var sp = 0;
          var seed = function (q) {
            if (!bg[q] && ca[q] < NEAR) {
              bg[q] = 1;
              stack[sp++] = q;
            }
          };
          var flood = function () {
            while (sp > 0) {
              var q = stack[--sp];
              var qx = q % w;
              if (qx > 0) {
                seed(q - 1);
              }
              if (qx < w - 1) {
                seed(q + 1);
              }
              if (q >= w) {
                seed(q - w);
              }
              if (q < n - w) {
                seed(q + w);
              }
            }
          };
          for (i = 0; i < w; i++) {
            seed(i);
            seed((h - 1) * w + i);
          }
          for (i = 0; i < h; i++) {
            seed(i * w);
            seed(i * w + w - 1);
          }
          flood();
          if (o.holes) {
            var lab = new Uint8Array(n);
            var minHole = Math.max(10, Math.round(40 * s * s));
            var list = new Int32Array(n);
            for (p = 0; p < n; p++) {
              if (bg[p] || lab[p] || ca[p] >= 0.045) {
                continue;
              }
              var cnt = 0;
              sp = 0;
              stack[sp++] = p;
              lab[p] = 1;
              while (sp > 0) {
                var q2 = stack[--sp];
                list[cnt++] = q2;
                var q2x = q2 % w;
                var nb = [
                  q2x > 0 ? q2 - 1 : -1,
                  q2x < w - 1 ? q2 + 1 : -1,
                  q2 >= w ? q2 - w : -1,
                  q2 < n - w ? q2 + w : -1,
                ];
                for (var j = 0; j < 4; j++) {
                  var z = nb[j];
                  if (z >= 0 && !lab[z] && !bg[z] && ca[z] < 0.045) {
                    lab[z] = 1;
                    stack[sp++] = z;
                  }
                }
              }
              if (cnt >= minHole) {
                sp = 0;
                for (j = 0; j < cnt; j++) {
                  bg[list[j]] = 0;
                  seed(list[j]);
                }
                flood();
              }
            }
          }
          var mi = new Float32Array(n);
          for (p = 0; p < n; p++) {
            mi[p] = bg[p] ? 0 : 1;
          }
          erode(mi, w, h, Math.max(1, Math.round(3 * s)));
          var br = Math.max(1, Math.round(1.6 * s));
          boxBlur(mi, w, h, br);
          boxBlur(mi, w, h, br);
          var LO = 0.025;
          var inv = 1 / (1 - LO);
          var minX = w,
            minY = h,
            maxX = -1,
            maxY = -1;
          for (p = 0; p < n; p++) {
            k = p * 4;
            var mv = mi[p];
            var cav = ca[p];
            var aca = (cav - LO) * inv;
            if (aca < 0) {
              aca = 0;
            }
            var al = aca > mv ? aca : mv;
            if (mv < 0.999) {
              var den = cav < 0.0001 ? 0.0001 : cav;
              for (var ch = 0; ch < 3; ch++) {
                var unm = P[ch] - (P[ch] - d[k + ch]) / den;
                if (unm < 0) {
                  unm = 0;
                } else if (unm > 255) {
                  unm = 255;
                }
                d[k + ch] = d[k + ch] * mv + unm * (1 - mv);
              }
            }
            d[k + 3] = al * 255;
            if (al > 0.03) {
              x = p % w;
              var yy = (p / w) | 0;
              if (x < minX) {
                minX = x;
              }
              if (x > maxX) {
                maxX = x;
              }
              if (yy < minY) {
                minY = yy;
              }
              if (yy > maxY) {
                maxY = yy;
              }
            }
          }
          cx.putImageData(im, 0, 0);
          return {
            c: c,
            s: s,
            box:
              maxX < 0
                ? [0, 0, w, h]
                : [minX, minY, maxX - minX + 1, maxY - minY + 1],
          };
        }
        function cropCanvas(c, bx) {
          var m = 2;
          var x0 = clamp(Math.floor(bx[0]) - m, 0, c.width - 1);
          var y0 = clamp(Math.floor(bx[1]) - m, 0, c.height - 1);
          var x1 = clamp(Math.ceil(bx[0] + bx[2]) + m, 1, c.width);
          var y1 = clamp(Math.ceil(bx[1] + bx[3]) + m, 1, c.height);
          var out = doc.createElement("canvas");
          out.width = x1 - x0;
          out.height = y1 - y0;
          out
            .getContext("2d")
            .drawImage(
              c,
              x0,
              y0,
              out.width,
              out.height,
              0,
              0,
              out.width,
              out.height,
            );
          return out;
        }
        function canvasUrl(cv, cb) {
          if (cv.toBlob) {
            cv.toBlob(function (blob) {
              cb(blob ? URL.createObjectURL(blob) : cv.toDataURL("image/png"));
            }, "image/png");
          } else {
            cb(cv.toDataURL("image/png"));
          }
        }
        function processWc(key, done) {
          var o = WC[key];
          var img = new Image();
          img.crossOrigin = "anonymous";
          img.decoding = "async";
          img.onload = function () {
            setTimeout(function () {
              var res = null;
              try {
                res = keyCanvas(img, o);
              } catch (e) {
                res = null;
              }
              if (!res) {
                if (!o.parts) {
                  applyCut(key, o.u, true);
                }
                done();
                return;
              }
              if (o.parts) {
                var names = Object.keys(o.parts);
                var left = names.length;
                names.forEach(function (nm) {
                  var b = o.parts[nm];
                  var cv = cropCanvas(res.c, [
                    b[0] * res.s,
                    b[1] * res.s,
                    b[2] * res.s,
                    b[3] * res.s,
                  ]);
                  if (key === "petals") {
                    petalSprites.push(cv);
                  }
                  canvasUrl(cv, function (u) {
                    applyCut(nm, u, false);
                    left -= 1;
                    if (left === 0) {
                      done();
                    }
                  });
                });
              } else {
                var cv2 = o.keepBox ? res.c : cropCanvas(res.c, res.box);
                canvasUrl(cv2, function (u) {
                  applyCut(key, u, false);
                  done();
                });
              }
            }, 16);
          };
          img.onerror = function () {
            if (!o.parts) {
              applyCut(key, o.u, true);
            }
            done();
          };
          img.src = o.u;
        }
        (function runWc() {
          var queue = Object.keys(WC).sort(function (a, b) {
            return WC[a].pri - WC[b].pri;
          });
          var next = function () {
            if (!queue.length) {
              return;
            }
            var k = queue.shift();
            processWc(k, function () {
              setTimeout(next, 24);
            });
          };
          next();
        })();
        /* ---------- SVG peony that blooms in slow motion ---------- */
        var SVGNS = "http://www.w3.org/2000/svg";
        var PAL = {
          blush: {
            d: "#d35d83",
            r: ["#ef9cb2", "#f4b1c2", "#f8c6d2", "#fbd9e0"],
            p: "#fff2f4",
            c: ["#f2bf7c", "#fff4d8"],
            e: "#b4506f",
            sh: "150,45,80",
          },
          coral: {
            d: "#df674c",
            r: ["#f2967b", "#f5ab90", "#f8c1a9", "#fbd6c4"],
            p: "#fff3ea",
            c: ["#efb554", "#fff2c9"],
            e: "#c2563d",
            sh: "170,70,40",
          },
          ivory: {
            d: "#c9ae86",
            r: ["#e9dcc6", "#efe5d4", "#f5eee1", "#f9f4ea"],
            p: "#fffdf8",
            c: ["#e9c45a", "#fff4c4"],
            e: "#ad9470",
            sh: "130,105,70",
          },
          lilac: {
            d: "#a07acb",
            r: ["#c9ace5", "#d5bdec", "#e1cff2", "#ebdff7"],
            p: "#fbf8fe",
            c: ["#e8c08a", "#fdeedd"],
            e: "#8a64b5",
            sh: "110,70,150",
          },
        };
        var RINGS = [
          { n: 7, len: 86, wid: 72, c: 0.26, o: 0, tw: 26, g: "o", op: 0.94 },
          { n: 9, len: 70, wid: 54, c: 0.3, o: 0.13, tw: 32, g: "m", op: 0.92 },
          {
            n: 11,
            len: 53,
            wid: 40,
            c: 0.36,
            o: 0.26,
            tw: 38,
            g: "i",
            op: 0.92,
          },
          {
            n: 13,
            len: 35,
            wid: 26,
            c: 0.44,
            o: 0.38,
            tw: 44,
            g: "i",
            op: 0.96,
          },
        ];
        var RINGS_LITE = [
          { n: 6, len: 84, wid: 78, c: 0.28, o: 0, tw: 24, g: "o", op: 0.95 },
          {
            n: 7,
            len: 62,
            wid: 56,
            c: 0.32,
            o: 0.15,
            tw: 32,
            g: "m",
            op: 0.94,
          },
          { n: 8, len: 40, wid: 34, c: 0.4, o: 0.3, tw: 40, g: "i", op: 0.96 },
        ];
        var peonies = {};
        function rng(seed) {
          var s = seed % 2147483647;
          if (s <= 0) {
            s += 2147483646;
          }
          return function () {
            s = (s * 16807) % 2147483647;
            return (s - 1) / 2147483646;
          };
        }
        var f1 = function (v) {
          return v.toFixed(1);
        };
        function petalPath(len, wid, rnd) {
          var b = wid * 0.14;
          var hw = wid / 2;
          var s =
            "M" +
            f1(-b) +
            " 0C" +
            f1(-hw * 1.25) +
            " " +
            f1(-len * 0.2) +
            " " +
            f1(-hw * 1.2) +
            " " +
            f1(-len * 0.74) +
            " " +
            f1(-hw * 0.66) +
            " " +
            f1(-len * 0.93);
          var k = 4;
          var x0 = -hw * 0.66;
          var x1 = hw * 0.66;
          for (var j = 0; j < k; j++) {
            var xa = x0 + ((x1 - x0) * (j + 0.5)) / k;
            var xb = x0 + ((x1 - x0) * (j + 1)) / k;
            var peak = -len * (1.03 + (rnd() - 0.5) * 0.09);
            var valley =
              j === k - 1 ? -len * 0.93 : -len * (0.92 + (rnd() - 0.5) * 0.05);
            s +=
              "Q" + f1(xa) + " " + f1(peak) + " " + f1(xb) + " " + f1(valley);
          }
          s +=
            "C" +
            f1(hw * 1.2) +
            " " +
            f1(-len * 0.74) +
            " " +
            f1(hw * 1.25) +
            " " +
            f1(-len * 0.2) +
            " " +
            f1(b) +
            " 0Z";
          return s;
        }
        function svgEl(tag, attrs, parent, idBase) {
          var el = doc.createElementNS(SVGNS, tag);
          el.setAttribute("id", uid(idBase));
          Object.keys(attrs).forEach(function (a) {
            el.setAttribute(a, attrs[a]);
          });
          if (parent) {
            parent.appendChild(el);
          }
          return el;
        }
        function makePeony(host) {
          var id = host.id;
          var lite = host.classList.contains("lite");
          var pal = PAL[host.getAttribute("data-palette")] || PAL.blush;
          var rnd = rng(
            parseInt(host.getAttribute("data-seed") || "7", 10) * 977 + 13,
          );
          var svg = svgEl(
            "svg",
            {
              viewBox: "-104 -104 208 208",
              "aria-hidden": "true",
              focusable: "false",
            },
            host,
            id + "-svg",
          );
          var defs = svgEl("defs", {}, svg, id + "-defs");
          var rings = lite ? RINGS_LITE : RINGS;
          var stop = function (g, off, col, op) {
            var a = { offset: off, "stop-color": col };
            if (op !== undefined) {
              a["stop-opacity"] = op;
            }
            svgEl("stop", a, g, id + "-st");
          };
          rings.forEach(function (rg, ri) {
            var g = svgEl(
              "radialGradient",
              {
                cx: "0",
                cy: "0",
                r: (rg.len * 1.05).toFixed(1),
                gradientUnits: "userSpaceOnUse",
              },
              defs,
              id + "-rg",
            );
            g.setAttribute("id", id + "-g-r" + ri);
            stop(g, "0", pal.d);
            stop(g, "0.36", pal.r[Math.min(ri, 3)]);
            stop(g, "0.8", pal.r[Math.min(ri + 1, 3)]);
            stop(g, "1", pal.p);
          });
          var sg = svgEl("radialGradient", {}, defs, id + "-sg");
          sg.setAttribute("id", id + "-g-sh");
          stop(sg, "0", "rgb(" + pal.sh + ")", "0");
          stop(sg, "0.72", "rgb(" + pal.sh + ")", "0");
          stop(sg, "0.9", "rgb(" + pal.sh + ")", "0.24");
          stop(sg, "1", "rgb(" + pal.sh + ")", "0");
          var cg = svgEl("radialGradient", {}, defs, id + "-cg");
          cg.setAttribute("id", id + "-g-c");
          stop(cg, "0", pal.c[1]);
          stop(cg, "1", pal.c[0]);
          var lgr = svgEl(
            "linearGradient",
            { x1: "0", y1: "1", x2: "0", y2: "0" },
            defs,
            id + "-lg",
          );
          lgr.setAttribute("id", id + "-g-l");
          stop(lgr, "0", "#5f7d5a");
          stop(lgr, "1", "#b7c8ae");
          var root = svgEl("g", {}, svg, id + "-root");
          var petals = [];
          var leaves = [];
          var shadows = [];
          if (!lite) {
            [205, 325, 85].forEach(function (ang) {
              var lg = svgEl(
                "g",
                { transform: "rotate(" + (ang + rnd() * 20).toFixed(1) + ")" },
                root,
                id + "-lfg",
              );
              var lp = svgEl(
                "path",
                {
                  d: "M0 0C-22 -30 -18 -78 0 -100C18 -78 22 -30 0 0Z",
                  fill: "url(#" + id + "-g-l)",
                  "fill-opacity": "0.9",
                },
                lg,
                id + "-leaf",
              );
              var vn = svgEl(
                "path",
                {
                  d: "M0 -4V-92",
                  stroke: "#eef3ea",
                  "stroke-opacity": "0.6",
                  "stroke-width": "0.8",
                  fill: "none",
                },
                lg,
                id + "-vein",
              );
              leaves.push({ el: lp, vein: vn });
            });
          }
          rings.forEach(function (rg, ri) {
            if (ri > 0) {
              var sh = svgEl(
                "circle",
                {
                  cx: "0",
                  cy: "0",
                  r: (rg.len * 1.02).toFixed(1),
                  fill: "url(#" + id + "-g-sh)",
                },
                root,
                id + "-shd",
              );
              shadows.push({ el: sh, rg: rg });
            }
            var off = ri * (180 / rg.n) + rnd() * 20;
            for (var pi = 0; pi < rg.n; pi++) {
              var ang = off + (360 / rg.n) * pi + (rnd() - 0.5) * 10;
              var g = svgEl(
                "g",
                { transform: "rotate(" + ang.toFixed(1) + ")" },
                root,
                id + "-pg",
              );
              var len = rg.len * (0.9 + rnd() * 0.18);
              var wid = rg.wid * (0.88 + rnd() * 0.22);
              var path = svgEl(
                "path",
                {
                  d: petalPath(len, wid, rnd),
                  fill: "url(#" + id + "-g-r" + ri + ")",
                  "fill-opacity": String(rg.op),
                  stroke: pal.e,
                  "stroke-opacity": "0.34",
                  "stroke-width": "0.7",
                },
                g,
                id + "-pt",
              );
              petals.push({
                el: path,
                rg: rg,
                j: rnd() * 0.08,
                dir: rnd() > 0.5 ? 1 : -1,
              });
            }
          });
          var center = svgEl("g", {}, root, id + "-ctr");
          svgEl(
            "circle",
            {
              cx: "0",
              cy: "0",
              r: lite ? "10" : "9",
              fill: "url(#" + id + "-g-c)",
            },
            center,
            id + "-cdisk",
          );
          var dots = lite ? 6 : 14;
          for (var di = 0; di < dots; di++) {
            var a = (Math.PI * 2 * di) / dots + rnd() * 0.3;
            var rr = 4 + rnd() * 7;
            svgEl(
              "circle",
              {
                cx: (Math.cos(a) * rr).toFixed(1),
                cy: (Math.sin(a) * rr).toFixed(1),
                r: (0.9 + rnd() * 1.1).toFixed(1),
                fill: "#d39a33",
                "fill-opacity": "0.9",
              },
              center,
              id + "-dot",
            );
          }
          var span = 1 - 0.46;
          var ease = function (rg, b, jj) {
            var local = clamp((b - rg.o - (jj || 0)) / span, 0, 1);
            return 1 - Math.pow(1 - local, 3);
          };
          var api = {
            b: -1,
            raf: 0,
            set: function (b) {
              b = clamp(b, 0, 1);
              if (Math.abs(b - api.b) < 0.0005) {
                return;
              }
              api.b = b;
              petals.forEach(function (p) {
                var e = ease(p.rg, b, p.j);
                var c = p.rg.c;
                var sx = c + (1 - c) * e;
                var sy = c * 0.78 + (1 - c * 0.78) * e;
                var rot = (1 - e) * p.rg.tw * p.dir;
                p.el.setAttribute(
                  "transform",
                  "rotate(" +
                    rot.toFixed(2) +
                    ") scale(" +
                    sx.toFixed(3) +
                    "," +
                    sy.toFixed(3) +
                    ")",
                );
              });
              shadows.forEach(function (s) {
                var e = ease(s.rg, b, 0.04);
                s.el.setAttribute(
                  "transform",
                  "scale(" + (s.rg.c + (1 - s.rg.c) * e).toFixed(3) + ")",
                );
              });
              var le = clamp(b * 1.7, 0, 1);
              leaves.forEach(function (l) {
                var t = "scale(" + (0.25 + 0.75 * le).toFixed(3) + ")";
                l.el.setAttribute("transform", t);
                l.vein.setAttribute("transform", t);
              });
              root.setAttribute(
                "transform",
                "rotate(" +
                  ((1 - b) * -38).toFixed(2) +
                  ") scale(" +
                  (0.74 + 0.26 * b).toFixed(3) +
                  ")",
              );
              center.setAttribute(
                "opacity",
                clamp((b - 0.5) / 0.4, 0, 1).toFixed(3),
              );
            },
            to: function (target, dur, delay) {
              cancelAnimationFrame(api.raf);
              if (reduceMotion || !dur) {
                api.set(target);
                return;
              }
              var from = api.b < 0 ? 0 : api.b;
              var t0 = 0;
              var startAt = performance.now() + (delay || 0);
              var step = function (now) {
                if (now < startAt) {
                  api.raf = requestAnimationFrame(step);
                  return;
                }
                if (!t0) {
                  t0 = now;
                }
                var k = clamp((now - t0) / (dur * (slowmo ? 2.4 : 1)), 0, 1);
                var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
                api.set(from + (target - from) * e);
                if (k < 1) {
                  api.raf = requestAnimationFrame(step);
                }
              };
              api.raf = requestAnimationFrame(step);
            },
          };
          api.set(parseFloat(host.getAttribute("data-b0") || "0.06"));
          peonies[id] = api;
          return api;
        }
        var slowmo = false;
        $$(".pp-peony").forEach(makePeony);
        function openPeony(host) {
          var p = peonies[host.id];
          if (p && !host.classList.contains("is-bloomed")) {
            host.classList.add("is-bloomed");
            p.to(1, 5600, 250);
          }
        }
        /* ---------- split headings into slow-motion letters ---------- */
        $$(".split").forEach(function (el) {
          var t = (el.textContent || "").replace(/\s+/g, " ").trim();
          if (!t) {
            return;
          }
          el.setAttribute("aria-label", t);
          el.textContent = "";
          var idx = 0;
          t.split(" ").forEach(function (word, wi) {
            if (wi > 0) {
              el.appendChild(doc.createTextNode(" "));
            }
            var w = doc.createElement("span");
            w.className = "w";
            w.id = el.id + "-w" + wi;
            w.setAttribute("aria-hidden", "true");
            w.style.display = "inline-block";
            w.style.whiteSpace = "nowrap";
            Array.from(word).forEach(function (ch) {
              var s = doc.createElement("span");
              s.className = "ch";
              s.id = el.id + "-c" + idx;
              s.style.setProperty("--i", idx);
              s.textContent = ch;
              w.appendChild(s);
              idx += 1;
            });
            el.appendChild(w);
          });
        });
        /* ---------- hero names fit ---------- */
        function fitNames() {
          ["hr-name-1", "hr-name-2"].forEach(function (id) {
            var el = $(id);
            if (!el) {
              return;
            }
            el.style.fontSize = "";
            var fs = parseFloat(win.getComputedStyle(el).fontSize) || 80;
            var guard = 0;
            while (
              el.scrollWidth > el.clientWidth + 1 &&
              fs > 30 &&
              guard < 40
            ) {
              fs -= 3;
              el.style.fontSize = fs + "px";
              guard += 1;
            }
          });
        }
        /* ---------- reveal on scroll ---------- */
        var heroRegion = $("sec-hero");
        var coverEl = $("sec-cover");
        var heroRevealed = false;
        var pending = [];
        var revealHooks = {};
        function onReveal(el) {
          if (
            el.classList.contains("pp-peony") &&
            el.classList.contains("auto")
          ) {
            openPeony(el);
          }
          $$(".pp-peony.auto", el).forEach(openPeony);
          if (revealHooks[el.id]) {
            revealHooks[el.id]();
          }
        }
        var io =
          "IntersectionObserver" in win
            ? new IntersectionObserver(
                function (ents) {
                  ents.forEach(function (e) {
                    if (e.isIntersecting) {
                      e.target.classList.add("in-view");
                      io.unobserve(e.target);
                      onReveal(e.target);
                    }
                  });
                },
                { threshold: 0, rootMargin: "0px 0px -33% 0px" },
              )
            : null;
        function observe(el) {
          if (!el || el.classList.contains("in-view")) {
            return;
          }
          if (io) {
            io.observe(el);
            pending.push(el);
          } else {
            el.classList.add("in-view");
            onReveal(el);
          }
        }
        function revealHero() {
          if (heroRevealed || !heroRegion) {
            return;
          }
          heroRevealed = true;
          heroRegion.classList.add("in-view");
          fitNames();
        }
        function releaseBottom() {
          if (
            win.innerHeight + win.pageYOffset >=
            doc.documentElement.scrollHeight - 4
          ) {
            pending.forEach(function (el) {
              if (!el.classList.contains("in-view")) {
                el.classList.add("in-view");
                if (io) {
                  io.unobserve(el);
                }
                onReveal(el);
              }
            });
            pending = [];
          }
        }
        function initReveal() {
          var targets = $$(".rv, .split, .pp-peony.auto").filter(function (el) {
            return (
              !(heroRegion && heroRegion.contains(el)) &&
              !(coverEl && coverEl.contains(el)) &&
              !el.closest("#pp-nav")
            );
          });
          if (!io) {
            $$("body > header, body > section, body > footer").forEach(
              function (r) {
                if (r !== heroRegion && r !== coverEl) {
                  r.classList.add("in-view");
                }
              },
            );
          }
          targets.forEach(observe);
        }
        /* ---------- petals canvas (ambient) + burst canvas (foreground) ---------- */
        var bgC = $("bg-petals");
        var fxC = $("fx-burst");
        var bgX = bgC ? bgC.getContext("2d") : null;
        var fxX = fxC ? fxC.getContext("2d") : null;
        var DPR = Math.min(win.devicePixelRatio || 1, 2);
        var VW = 0,
          VH = 0;
        var ptr = { x: -9999, y: -9999 };
        var amb = [];
        var sparks = [];
        var bursts = [];
        var PCOL = [
          ["#f9d3dc", "#eea0b4"],
          ["#fde2d6", "#f2a98f"],
          ["#fff6ea", "#ecd9bd"],
          ["#efe3f8", "#c9addf"],
        ];
        function sizeCanvas() {
          VW = win.innerWidth;
          VH = win.innerHeight;
          [bgC, fxC].forEach(function (c) {
            if (!c) {
              return;
            }
            c.width = Math.round(VW * DPR);
            c.height = Math.round(VH * DPR);
          });
          if (bgX) {
            bgX.setTransform(DPR, 0, 0, DPR, 0, 0);
          }
          if (fxX) {
            fxX.setTransform(DPR, 0, 0, DPR, 0, 0);
          }
        }
        function spawnPetal(p, initial) {
          p.x = Math.random() * VW;
          p.y = initial ? Math.random() * VH : -40 - Math.random() * 60;
          p.s = 14 + Math.random() * 18;
          p.vy = 0.16 + Math.random() * 0.32;
          p.vx = (Math.random() - 0.5) * 0.22;
          p.rot = Math.random() * Math.PI * 2;
          p.vr = (Math.random() - 0.5) * 0.012;
          p.ph = Math.random() * Math.PI * 2;
          p.vph = 0.01 + Math.random() * 0.014;
          p.sw = Math.random() * Math.PI * 2;
          p.sp = Math.floor(Math.random() * 16);
          p.col = PCOL[Math.floor(Math.random() * PCOL.length)];
          p.a = 0.5 + Math.random() * 0.4;
          return p;
        }
        function drawPetal(ctx, p, alpha) {
          var flip = Math.cos(p.ph);
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(Math.max(0.18, Math.abs(flip)), 1);
          var spr = petalSprites.length
            ? petalSprites[p.sp % petalSprites.length]
            : null;
          if (spr) {
            var r = spr.height / spr.width;
            ctx.drawImage(spr, -p.s / 2, (-p.s * r) / 2, p.s, p.s * r);
          } else {
            var g = ctx.createLinearGradient(0, p.s * 0.5, 0, -p.s * 0.5);
            g.addColorStop(0, p.col[1]);
            g.addColorStop(1, p.col[0]);
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.moveTo(0, p.s * 0.5);
            ctx.bezierCurveTo(
              -p.s * 0.62,
              p.s * 0.2,
              -p.s * 0.5,
              -p.s * 0.5,
              0,
              -p.s * 0.5,
            );
            ctx.bezierCurveTo(
              p.s * 0.5,
              -p.s * 0.5,
              p.s * 0.62,
              p.s * 0.2,
              0,
              p.s * 0.5,
            );
            ctx.fill();
          }
          ctx.restore();
        }
        function initAmbient() {
          var count = VW < 700 ? 16 : 28;
          amb = [];
          for (var i = 0; i < count; i++) {
            amb.push(spawnPetal({}, true));
          }
          sparks = [];
          var sc = VW < 700 ? 14 : 24;
          for (var j = 0; j < sc; j++) {
            sparks.push({
              x: Math.random() * VW,
              y: Math.random() * VH,
              r: 0.8 + Math.random() * 1.6,
              vy: 0.08 + Math.random() * 0.18,
              ph: Math.random() * 6.28,
            });
          }
        }
        var bgRunning = false;
        var lastT = 0;
        function bgFrame(now) {
          if (!bgRunning) {
            return;
          }
          var dt = lastT ? Math.min(3, (now - lastT) / 16.67) : 1;
          lastT = now;
          var k = dt * (slowmo ? 0.3 : 1);
          bgX.clearRect(0, 0, VW, VH);
          for (var i = 0; i < sparks.length; i++) {
            var s = sparks[i];
            s.y -= s.vy * k;
            s.ph += 0.03 * k;
            if (s.y < -10) {
              s.y = VH + 10;
              s.x = Math.random() * VW;
            }
            bgX.globalAlpha = 0.25 + 0.35 * (0.5 + 0.5 * Math.sin(s.ph));
            bgX.fillStyle = "#e8c88f";
            bgX.beginPath();
            bgX.arc(s.x + Math.sin(s.ph * 0.6) * 6, s.y, s.r, 0, Math.PI * 2);
            bgX.fill();
          }
          for (var j = 0; j < amb.length; j++) {
            var p = amb[j];
            p.sw += 0.012 * k;
            p.ph += p.vph * k;
            p.rot += p.vr * k;
            p.y += p.vy * k;
            p.x += (p.vx + Math.sin(p.sw) * 0.35) * k;
            var dx = p.x - ptr.x;
            var dy = p.y - ptr.y;
            var dd = dx * dx + dy * dy;
            if (dd < 14400) {
              var f = (1 - Math.sqrt(dd) / 120) * 2.2 * k;
              var inv = 1 / (Math.sqrt(dd) || 1);
              p.x += dx * inv * f;
              p.y += dy * inv * f;
            }
            if (p.y > VH + 50 || p.x < -60 || p.x > VW + 60) {
              spawnPetal(p, false);
            }
            drawPetal(bgX, p, p.a);
          }
          bgX.globalAlpha = 1;
          requestAnimationFrame(bgFrame);
        }
        function startBg() {
          if (!bgX) {
            return;
          }
          if (reduceMotion) {
            bgX.clearRect(0, 0, VW, VH);
            amb.forEach(function (p) {
              drawPetal(bgX, p, p.a * 0.8);
            });
            return;
          }
          if (bgRunning) {
            return;
          }
          bgRunning = true;
          lastT = 0;
          requestAnimationFrame(bgFrame);
        }
        function stopBg() {
          bgRunning = false;
        }
        var fxRunning = false;
        var fxLast = 0;
        function fxFrame(now) {
          var dt = fxLast ? Math.min(3, (now - fxLast) / 16.67) : 1;
          fxLast = now;
          var k = dt * (slowmo ? 0.35 : 1);
          fxX.clearRect(0, 0, VW, VH);
          bursts = bursts.filter(function (p) {
            return p.life > 0;
          });
          bursts.forEach(function (p) {
            p.vx *= Math.pow(0.985, k);
            p.vy = p.vy * Math.pow(0.985, k) + 0.045 * k;
            p.x += p.vx * k;
            p.y += p.vy * k;
            p.rot += p.vr * k;
            p.ph += p.vph * k;
            p.life -= k;
            drawPetal(fxX, p, clamp(p.life / 60, 0, 1) * 0.95);
          });
          if (bursts.length) {
            requestAnimationFrame(fxFrame);
          } else {
            fxRunning = false;
            fxX.clearRect(0, 0, VW, VH);
          }
        }
        function burst(x, y, n, spread) {
          if (!fxX || reduceMotion) {
            return;
          }
          n = n || 26;
          spread = spread || 1;
          for (var i = 0; i < n; i++) {
            var a = Math.random() * Math.PI * 2;
            var v = (1.4 + Math.random() * 3.4) * spread;
            var p = spawnPetal({}, true);
            p.x = x;
            p.y = y;
            p.vx = Math.cos(a) * v;
            p.vy = Math.sin(a) * v - 1.4;
            p.vr = (Math.random() - 0.5) * 0.08;
            p.vph = 0.05 + Math.random() * 0.06;
            p.s = 16 + Math.random() * 22;
            p.life = 120 + Math.random() * 90;
            bursts.push(p);
          }
          if (!fxRunning) {
            fxRunning = true;
            fxLast = 0;
            requestAnimationFrame(fxFrame);
          }
        }
        function burstAt(el, n, spread) {
          if (!el) {
            return;
          }
          var r = el.getBoundingClientRect();
          burst(r.left + r.width / 2, r.top + r.height / 2, n, spread);
        }
        sizeCanvas();
        initAmbient();
        win.addEventListener(
          "pointermove",
          function (e) {
            ptr.x = e.clientX;
            ptr.y = e.clientY;
          },
          { passive: true },
        );
        win.addEventListener("pointerleave", function () {
          ptr.x = -9999;
          ptr.y = -9999;
        });
        /* ---------- background music ---------- */
        var audio = $("pp-audio");
        var musicBtn = $("nv-music");
        var hasMusic = !!(audio && payload.data.music.enabled && isFilled(audio.getAttribute("src")));
        var resumeAfterHide = false;
        var pausedForVideo = false;
        if (!hasMusic && musicBtn) {
          musicBtn.classList.add("is-empty");
        }
        function startAudio() {
          if (!hasMusic || userPaused) {
            return;
          }
          try {
            var pr = audio.play();
            if (pr && pr.catch) {
              pr.catch(function () {});
            }
          } catch (e) {
            /* autoplay blocked */
          }
        }
        if (audio) {
          audio.volume = 0.7;
          audio.addEventListener("play", function () {
            musicBtn.classList.add("is-playing");
          });
          audio.addEventListener("pause", function () {
            musicBtn.classList.remove("is-playing");
          });
        }
        if (musicBtn) {
          musicBtn.addEventListener("click", function () {
            if (!hasMusic) {
              return;
            }
            if (audio.paused) {
              userPaused = false;
              startAudio();
              toast(payload.ui.music);
            } else {
              userPaused = true;
              audio.pause();
              toast(payload.ui.music);
            }
          });
        }
        doc.addEventListener("visibilitychange", function () {
          if (doc.hidden) {
            stopBg();
            if (hasMusic && !audio.paused) {
              resumeAfterHide = true;
              audio.pause();
            }
          } else {
            startBg();
            if (resumeAfterHide && !pausedForVideo) {
              resumeAfterHide = false;
              startAudio();
            }
          }
        });
        /* ---------- slow motion mode ---------- */
        var slowBtn = $("nv-slowmo");
        var slowTimer = 0;
        function applyRate() {
          if (!doc.getAnimations) {
            return;
          }
          doc.getAnimations().forEach(function (a) {
            try {
              var tm =
                a.effect && a.effect.getTiming ? a.effect.getTiming() : null;
              if (tm && tm.iterations === Infinity) {
                a.playbackRate = slowmo ? 0.3 : 1;
              }
            } catch (e) {
              /* ignore */
            }
          });
        }
        if (slowBtn) {
          slowBtn.addEventListener("click", function () {
            slowmo = !slowmo;
            body.classList.toggle("is-slowmo", slowmo);
            slowBtn.setAttribute("aria-pressed", slowmo ? "true" : "false");
            applyRate();
            clearInterval(slowTimer);
            if (slowmo) {
              slowTimer = setInterval(applyRate, 1600);
              toast(payload.ui.slow);
            } else {
              toast(payload.ui.normal);
            }
            sfx("pop");
          });
        }
        /* ---------- dates everywhere ---------- */
        var TZMAP = {
          WIB: "Asia/Jakarta",
          WITA: "Asia/Makassar",
          WIT: "Asia/Jayapura",
        };
        var ctz = payload.data.timezone;
        var tzSuffix = tzLabel ? " " + tzLabel : "";
        (function fillDates() {
          if (weddingAt) {
            var full = fmtDate(weddingAt);
            $("cv-date").textContent = full.replace(",", " ·");
            $("hr-day").textContent = String(weddingAt.getDate());
            $("hr-date-long").textContent =
              weddingAt.toLocaleDateString(LOCALE, { weekday: "long" }) +
              ", " +
              weddingAt.toLocaleDateString(LOCALE, {
                month: "long",
                year: "numeric",
              });
            $("ev-date-1").textContent = full;
          }
          var t1 = fmtTime(D.time);
          var meta = [];
          if (t1) {
            meta.push(t1 + tzSuffix);
          }
          if (venueName) {
            meta.push(venueName);
          }
          $("hr-date-meta").textContent = meta.join(" · ");
          var e1end = fmtTime(D.e1end);
          $("ev-time-1").textContent = t1
            ? t1 + (e1end ? " – " + e1end : "") + tzSuffix
            : payload.ui.eventSub;
          var dl = parseDT(D.deadline, "00:00");
          if (dl) {
            $("rs-deadline-date").textContent = fmtDate(dl);
          } else {
            $("rs-deadline").style.display = "none";
          }
        })();
        /* ---------- monograms & photos ---------- */
        var ini = function (s) {
          return s ? Array.from(s.trim())[0].toUpperCase() : "";
        };
        (function photos() {
          var mono = $("hr-mono");
          if (mono) {
            mono.textContent =
              (ini(brideName) || "·") + "&" + (ini(groomName) || "·");
          }
          var arch = $("hr-arch");
          var hp = $("hr-photo");
          if (hp && !isFilled(hp.getAttribute("src"))) {
            arch.classList.add("no-photo");
          } else if (hp) {
            hp.addEventListener("error", function () {
              arch.classList.add("no-photo");
            });
          }
          [
            ["cp-img-b", "cp-initial-b", brideName],
            ["cp-img-g", "cp-initial-g", groomName],
          ].forEach(function (r) {
            var img = $(r[0]);
            var box = img ? img.parentNode : null;
            $(r[1]).textContent = ini(r[2]) || "·";
            if (!img) {
              return;
            }
            if (!isFilled(img.getAttribute("src"))) {
              box.classList.add("no-photo");
            } else {
              img.addEventListener("error", function () {
                box.classList.add("no-photo");
              });
            }
          });
        })();
        /* ---------- greeting ---------- */
        (function greeting() {
          ["gr-salam", "gr-text"].forEach(function (id) {
            if (!txt($(id))) {
              $(id).style.display = "none";
            }
          });
          if (!txt($("gr-quote-text"))) {
            $("gr-quote").style.display = "none";
            $("gr-rule").style.display = "none";
          }
          if (!txt($("gr-quote-src"))) {
            $("gr-quote-src").style.display = "none";
          }
          var btn = $("gr-bloom");
          var taps = 0;
          btn.addEventListener("click", function () {
            taps += 1;
            btn.classList.remove("is-ruffle");
            void btn.offsetWidth;
            btn.classList.add("is-ruffle");
            var p = peonies["gr-peony"];
            if (p && p.b < 0.98) {
              p.to(1, 2600, 0);
            }
            burstAt(btn, 18 + Math.min(taps, 4) * 4, 0.9);
            sfx(taps % 3 === 0 ? "chime" : "pop");
            $("gr-bloom-hint").textContent =
              taps > 2 ? payload.ui.bloom : payload.ui.bloom;
          });
        })();
        /* ---------- couple ---------- */
        (function couple() {
          var stage = $("cp-stage");
          var front = "b";
          var busy = false;
          ["b", "g"].forEach(function (w) {
            var ig = $("cp-ig-" + w);
            var handle = txt($("cp-ig-" + w + "-t"))
              .replace(/^@/, "")
              .trim();
            if (!handle || handle === "@") {
              ig.style.display = "none";
            } else {
              /* Typed platform adapter supplies the validated contact href. */
            }
            if (!txt($("cp-bio-" + w))) {
              $("cp-more-" + w).style.display = "none";
            }
            ["cp-order-", "cp-parents-", "cp-variety-"].forEach(function (pre) {
              if (!txt($(pre + w))) {
                $(pre + w).style.display = "none";
              }
            });
          });
          function show(who) {
            if (who === front || busy) {
              return;
            }
            busy = true;
            ["b", "g"].forEach(function (w) {
              var on = w === who;
              var tab = $("cp-tab-" + w);
              tab.classList.toggle("is-active", on);
              tab.setAttribute("aria-selected", on ? "true" : "false");
              $("cp-panel-" + w).classList.toggle("is-active", on);
            });
            sfx("pop");
            if (reduceMotion) {
              stage.setAttribute("data-front", who);
              front = who;
              busy = false;
              return;
            }
            stage.classList.add("is-shuffling");
            setTimeout(function () {
              stage.setAttribute("data-front", who);
              front = who;
              stage.classList.remove("is-shuffling");
              burstAt($("cp-card-" + who), 10, 0.6);
              setTimeout(function () {
                busy = false;
              }, 500);
            }, 440);
          }
          $("cp-tab-b").addEventListener("click", function () {
            show("b");
          });
          $("cp-tab-g").addEventListener("click", function () {
            show("g");
          });
          ["b", "g"].forEach(function (w) {
            $("cp-card-" + w).addEventListener("click", function () {
              show(front === w ? (w === "b" ? "g" : "b") : w);
            });
          });
          var sx = null;
          stage.addEventListener(
            "pointerdown",
            function (e) {
              sx = e.clientX;
            },
            { passive: true },
          );
          stage.addEventListener(
            "pointerup",
            function (e) {
              if (sx !== null && Math.abs(e.clientX - sx) > 44) {
                show(front === "b" ? "g" : "b");
              }
              sx = null;
            },
            { passive: true },
          );
        })();
        /* ---------- story (bloom phases) ---------- */
        var storyItems = [];
        (function story() {
          for (var i = 1; i <= payload.data.story.length; i++) {
            var li = $("st-item-" + i);
            var title = txt($("st-title-" + i));
            var body2 = txt($("st-text-" + i));
            if (!title && !body2) {
              li.style.display = "none";
              continue;
            }
            if (!txt($("st-date-" + i))) {
              $("st-date-" + i).style.display = "none";
            }
            var img = $("st-img-" + i);
            if (!isFilled(img.getAttribute("src"))) {
              $("st-photo-" + i).classList.add("no-photo");
              $("st-card-" + i).classList.add("no-photo-card");
            } else {
              (function (fig, card) {
                img.addEventListener("error", function () {
                  fig.classList.add("no-photo");
                  card.classList.add("no-photo-card");
                });
              })($("st-photo-" + i), $("st-card-" + i));
            }
            storyItems.push({ li: li, title: title || payload.ui.phase + i });
          }
          storyItems.forEach(function (it, k) {
            $("st-stage-" + it.li.id.split("-")[2]).textContent =
              payload.ui.phase + pad(k + 1);
          });
          if (!storyItems.length) {
            hideSection("story");
          }
        })();
        var stLast = -1;
        function storyScrub(vh) {
          var list = $("st-list");
          if (!storyItems.length || !list) {
            return;
          }
          var r = list.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) {
            return;
          }
          var p = clamp(
            (vh * 0.62 - r.top) / Math.max(1, r.height - vh * 0.3),
            0,
            1,
          );
          var pk = peonies["st-peony"];
          if (pk) {
            pk.set(0.03 + 0.97 * p);
          }
          $("st-meter-fill").style.width = (p * 100).toFixed(1) + "%";
          var cur = 0;
          storyItems.forEach(function (it, k) {
            if (it.li.getBoundingClientRect().top < vh * 0.55) {
              cur = k;
            }
          });
          if (cur !== stLast) {
            stLast = cur;
            $("st-meter-stage").textContent =
              payload.ui.phase + pad(cur + 1) + " / " + pad(storyItems.length);
            $("st-meter-name").textContent = storyItems[cur].title;
          }
        }
        /* ---------- ants (invented section) ---------- */
        (function ants() {
          var list = [];
          for (var i = 1; i <= 4; i++) {
            if (txt($("an-name-" + i))) {
              list.push(i);
            } else {
              $("an-orbit-" + i).style.display = "none";
              $("an-card-" + i).style.display = "none";
            }
          }
          if (!list.length) {
            hideSection("ants");
            return;
          }
          if (!txt($("an-intro"))) {
            $("an-intro").style.display = "none";
          }
          list.forEach(function (n, k) {
            $("an-orbit-" + n).style.setProperty(
              "--start",
              ((360 / list.length) * k).toFixed(1) + "deg",
            );
            if (!txt($("an-role-" + n))) {
              $("an-role-" + n).style.display = "none";
            }
          });
          $("an-status-t").textContent = String(list.length);
          var visited = {};
          var count = 0;
          var done = false;
          var peony = peonies["an-peony"];
          function showCard(id) {
            $$(".an-card").forEach(function (c) {
              c.classList.toggle("is-active", c.id === id);
            });
          }
          function visit(n) {
            list.forEach(function (m) {
              $("an-spin-" + m).classList.toggle("is-paused", m === n);
              $("an-ant-" + m).classList.toggle("is-current", m === n);
            });
            showCard("an-card-" + n);
            if (!visited[n]) {
              visited[n] = true;
              count += 1;
              $("an-ant-" + n).classList.add("is-visited");
              $("an-badge-" + n).textContent = "✓";
              $("an-status-n").textContent = String(count);
              $("an-progress-fill").style.width =
                ((count / list.length) * 100).toFixed(1) + "%";
              if (peony) {
                peony.to(0.06 + 0.5 * (count / list.length), 2200, 0);
              }
              burstAt($("an-ant-" + n), 8, 0.5);
              sfx("pop");
              if (count === list.length && !done) {
                done = true;
                setTimeout(function () {
                  $("sec-ants").classList.add("is-done");
                  showCard("an-card-done");
                  if (peony) {
                    peony.to(1, 5200, 0);
                  }
                  burstAt($("an-peony"), 34, 1.1);
                  sfx("gullar-bayrami");
                  list.forEach(function (m) {
                    $("an-spin-" + m).classList.remove("is-paused");
                    $("an-ant-" + m).classList.remove("is-current");
                  });
                }, 1600);
              }
            }
          }
          list.forEach(function (n) {
            $("an-ant-" + n).addEventListener("click", function () {
              visit(n);
            });
          });
          $("an-peony").addEventListener("click", function () {
            if (done) {
              burstAt($("an-peony"), 16, 0.8);
              sfx("pop");
            }
          });
          $("an-all").addEventListener("click", function () {
            var todo = list.filter(function (n) {
              return !visited[n];
            });
            todo.forEach(function (n, k) {
              setTimeout(function () {
                visit(n);
              }, k * 1100);
            });
          });
        })();
        /* ---------- hundred springs (invented section) ---------- */
        (function springs() {
          var range = $("sp-range");
          var yearEl = $("sp-year");
          var flowers = $$(".sp-flower");
          var promises = $$(".sp-promise").filter(function (a) {
            if (!txt(a.querySelector(".sp-promise-text"))) {
              a.style.display = "none";
              return false;
            }
            return true;
          });
          if (!promises.length) {
            hideSection("springs");
            return;
          }
          if (!txt($("sp-intro"))) {
            $("sp-intro").style.display = "none";
          }
          var toYear = function (v) {
            return 1 + Math.round(99 * Math.pow(v / 1000, 2));
          };
          var toVal = function (y) {
            return Math.round(1000 * Math.sqrt((y - 1) / 99));
          };
          $$(".sp-tick").forEach(function (t) {
            var y = parseInt(t.getAttribute("data-year"), 10);
            var fr = toVal(y) / 1000;
            t.style.left =
              "calc(" +
              (fr * 100).toFixed(2) +
              "% + " +
              (18 - 36 * fr).toFixed(1) +
              "px)";
            t.addEventListener("click", function () {
              stopPlay();
              animateTo(toVal(y), 1600);
            });
          });
          var lastYear = 0;
          var lastPromise = null;
          function update(v) {
            var y = toYear(v);
            range.style.setProperty("--p", (v / 10).toFixed(1) + "%");
            if (y !== lastYear) {
              lastYear = y;
              yearEl.textContent = String(y);
              yearEl.classList.remove("bump");
              void yearEl.offsetWidth;
              yearEl.classList.add("bump");
              flowers.forEach(function (f) {
                f.classList.toggle(
                  "is-on",
                  y >= parseInt(f.getAttribute("data-at"), 10),
                );
              });
              $$(".sp-tick").forEach(function (t) {
                t.classList.toggle(
                  "is-reached",
                  y >= parseInt(t.getAttribute("data-year"), 10),
                );
              });
              var pick = promises[0];
              promises.forEach(function (a) {
                if (y >= parseInt(a.getAttribute("data-year"), 10)) {
                  pick = a;
                }
              });
              if (pick !== lastPromise) {
                lastPromise = pick;
                promises.forEach(function (a) {
                  a.classList.toggle("is-active", a === pick);
                });
                if (lastYear > 1) {
                  sfx("pop");
                }
              }
            }
          }
          range.addEventListener("input", function () {
            stopPlay();
            update(parseInt(range.value, 10));
          });
          var raf = 0;
          var playing = false;
          function animateTo(target, dur, onEnd) {
            cancelAnimationFrame(raf);
            var from = parseInt(range.value, 10);
            if (reduceMotion) {
              range.value = String(target);
              update(target);
              if (onEnd) {
                onEnd();
              }
              return;
            }
            var t0 = 0;
            var step = function (now) {
              if (!t0) {
                t0 = now;
              }
              var k = clamp((now - t0) / (dur * (slowmo ? 2.5 : 1)), 0, 1);
              var e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
              var v = Math.round(from + (target - from) * e);
              range.value = String(v);
              update(v);
              if (k < 1) {
                raf = requestAnimationFrame(step);
              } else if (onEnd) {
                onEnd();
              }
            };
            raf = requestAnimationFrame(step);
          }
          function stopPlay() {
            if (playing) {
              playing = false;
              cancelAnimationFrame(raf);
              $("sp-play").classList.remove("is-playing");
              $("sp-play-t").textContent = payload.ui.seasonsPlay;
            }
          }
          $("sp-play").addEventListener("click", function () {
            if (playing) {
              stopPlay();
              return;
            }
            playing = true;
            $("sp-play").classList.add("is-playing");
            $("sp-play-t").textContent = payload.ui.seasonsPlaying;
            range.value = "0";
            update(0);
            animateTo(1000, 11000, function () {
              playing = false;
              $("sp-play").classList.remove("is-playing");
              $("sp-play-t").textContent = payload.ui.seasonsReplay;
              burstAt($("sp-stage"), 24, 0.9);
              sfx("gullar-bayrami");
            });
          });
          var touched = false;
          range.addEventListener("pointerdown", function () {
            touched = true;
          });
          revealHooks["sp-stage"] = function () {
            setTimeout(function () {
              if (!touched && !playing) {
                animateTo(toVal(10), 3200);
              }
            }, 900);
          };
          update(0);
        })();
        /* ---------- video ---------- */
        (function video() {
          var v = $("vd-video");
          if (!v || !isFilled(v.getAttribute("src"))) {
            hideSection("video");
            return;
          }
          if (!txt($("vd-caption"))) {
            $("vd-caption").style.display = "none";
          }
          var frame = $("vd-frame");
          $("vd-play").addEventListener("click", function () {
            v.controls = true;
            var pr = v.play();
            if (pr && pr.catch) {
              pr.catch(function () {});
            }
          });
          v.addEventListener("play", function () {
            frame.classList.add("is-playing");
            if (hasMusic && !audio.paused) {
              pausedForVideo = true;
              audio.pause();
            }
          });
          var back = function () {
            frame.classList.remove("is-playing");
            if (pausedForVideo) {
              pausedForVideo = false;
              startAudio();
            }
          };
          v.addEventListener("pause", back);
          v.addEventListener("ended", back);
          $("vd-speed").addEventListener("click", function () {
            var on = $("vd-speed").getAttribute("aria-pressed") !== "true";
            $("vd-speed").setAttribute("aria-pressed", on ? "true" : "false");
            v.playbackRate = on ? 0.5 : 1;
            $("vd-speed-t").textContent = on
              ? payload.ui.videoSlowOn
              : payload.ui.videoSlow;
          });
        })();
        /* ---------- countdown ---------- */
        (function countdown() {
          var ticks = $("cd-ticks");
          if (ticks) {
            for (var i = 0; i < 60; i++) {
              var long = i % 5 === 0;
              var a = (i * 6 * Math.PI) / 180;
              var r1 = long ? 94 : 98;
              var r2 = 104;
              svgEl(
                "line",
                {
                  x1: (Math.sin(a) * r1).toFixed(2),
                  y1: (-Math.cos(a) * r1).toFixed(2),
                  x2: (Math.sin(a) * r2).toFixed(2),
                  y2: (-Math.cos(a) * r2).toFixed(2),
                  stroke: long ? "#d8bb8c" : "#f6d3d6",
                  "stroke-opacity": long ? "0.9" : "0.45",
                  "stroke-width": long ? "1.6" : "0.8",
                },
                ticks,
                "cd-tk",
              );
            }
          }
          if (!txt($("cd-note"))) {
            $("cd-note").style.display = "none";
          }
          var els = {
            d: $("cd-days"),
            h: $("cd-hours"),
            m: $("cd-mins"),
            s: $("cd-secs"),
          };
          var prev = {};
          var hand = $("cd-hand");
          var arc = $("cd-sec-arc");
          var timer = 0;
          var handDeg = null;
          var arcOff = null;
          function set(k, v) {
            var s = k === "d" ? String(v).padStart(2, "0") : pad(v);
            if (prev[k] !== s) {
              prev[k] = s;
              els[k].textContent = s;
              if (!reduceMotion) {
                els[k].classList.remove("tick");
                void els[k].offsetWidth;
                els[k].classList.add("tick");
              }
            }
          }
          function jump(el, apply) {
            el.style.transition = "none";
            apply();
            void el.getBoundingClientRect();
            el.style.transition = "";
          }
          function rotateHand() {
            hand.style.transform = "rotate(" + handDeg + "deg)";
          }
          /* keep the angle small and only ever step clockwise — an absolute
             angle (epoch seconds × 6) overflows the compositor's float precision
             and freezes the hand */
          function setHand(deg) {
            if (handDeg === null) {
              handDeg = deg;
              jump(hand, rotateHand);
              return;
            }
            if (handDeg >= 360) {
              handDeg -= 360;
              jump(hand, rotateHand);
            }
            handDeg += (((deg - handDeg) % 360) + 360) % 360;
            rotateHand();
          }
          /* a new lap restarts the ring from empty instead of unwinding it */
          function setArc(off) {
            off = Math.round(off * 10) / 10;
            if (arcOff === null || off > arcOff) {
              jump(arc, function () {
                arc.style.strokeDashoffset =
                  arcOff === null ? String(off) : "578";
              });
            }
            arcOff = off;
            arc.style.strokeDashoffset = String(off);
          }
          function tick() {
            var now = Date.now();
            if (!weddingAt) {
              setHand((Math.floor(now / 1000) % 60) * 6);
              return;
            }
            var diff = weddingAt.getTime() - now;
            if (diff <= 0) {
              ["d", "h", "m", "s"].forEach(function (k) {
                set(k, 0);
              });
              $("cd-center-n").textContent = "0";
              setArc(0);
              setHand(0);
              $("sec-countdown").classList.add("is-today");
              if (-diff > 86400000) {
                $("cd-done").textContent =
                  payload.ui.passed;
                $("cd-center-l").textContent = payload.ui.passed;
              } else {
                $("cd-center-l").textContent = payload.ui.today;
              }
              clearInterval(timer);
              return;
            }
            var sec = Math.floor(diff / 1000);
            var dd = Math.floor(sec / 86400);
            var hh = Math.floor((sec % 86400) / 3600);
            var mm = Math.floor((sec % 3600) / 60);
            var ss = sec % 60;
            set("d", dd);
            set("h", hh);
            set("m", mm);
            set("s", ss);
            $("cd-center-n").textContent = String(dd);
            setArc((578 * ss) / 60);
            setHand(((60 - ss) % 60) * 6);
          }
          tick();
          timer = setInterval(tick, 1000);
        })();
        /* ---------- calendar: platform adapter ---------- */
var e2Name = ""; var e2At = null;
/* ---------- events & maps ---------- */
        function dirUrl(dest, pid) {
          return (
            "https://www.google.com/maps/dir/?api=1&destination=" +
            encodeURIComponent(dest || "") +
            "&travelmode=driving" +
            (pid ? "&destination_place_id=" + encodeURIComponent(pid) : "")
          );
        }
        var mainDir = dirUrl(venueAddr || venueName, placeId);
        (function events() {
          $("ev-map-1").href = mainDir;
          $("vn-go").href = mainDir;
          if (!txt($("ev-note-1"))) {
            $("ev-note-1").style.display = "none";
          }
          if (!txt($("ev-name-1"))) {
            $("ev-name-1").textContent = payload.ui.events;
          }
          if (!e2Name) {
            $("ev-card-2").style.display = "none";
            $("ev-grid").classList.add("single");
          } else {
            if (e2At) {
              $("ev-date-2").textContent = fmtDate(e2At);
              var t2 = fmtTime(isFilled(D.e2time) ? D.e2time : D.time);
              var e2end = fmtTime(D.e2end);
              $("ev-time-2").textContent =
                t2 + (e2end ? " – " + e2end : "") + tzSuffix;
            }
            var a2 = txt($("ev-addr-2"));
            var v2 = txt($("ev-venue-2"));
            if (!v2) {
              $("ev-venue-2").textContent = venueName;
            }
            if (!a2) {
              $("ev-addr-2").textContent = venueAddr;
            }
            $("ev-map-2").href =
              !a2 || a2 === venueAddr ? mainDir : dirUrl(a2, "");
            if (!txt($("ev-note-2"))) {
              $("ev-note-2").style.display = "none";
            }
          }
          var live = isFilled(D.live) ? D.live.trim() : "";
          if (!live) {
            $("ev-live").style.display = "none";
          } else {
            var m = live.match(
              /(?:youtu\.be\/|v=|embed\/|live\/|shorts\/)([\w-]{11})/,
            );
            if (m) {
              var fr = doc.createElement("iframe");
              fr.id = uid("ev-live-frame");
              fr.src = "https://www.youtube-nocookie.com/embed/" + m[1];
              fr.title = payload.ui.events;
              fr.setAttribute(
                "allow",
                "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
              );
              fr.setAttribute("allowfullscreen", "");
              fr.loading = "lazy";
              $("ev-live-embed").appendChild(fr);
              $("ev-live-embed").classList.add("has-embed");
            }
          }
        })();
        /* ---------- venue: platform adapter ---------- */
/* ---------- rundown (couple's own schedule) ---------- */
        var RD_ICONS = {
          heart:
            '<path d="M12 19s-7-4.4-7-9.2C5 7.4 6.8 6 8.7 6c1.4 0 2.6.8 3.3 2 .7-1.2 1.9-2 3.3-2C17.2 6 19 7.4 19 9.8 19 14.6 12 19 12 19z"/>',
          users:
            '<circle cx="9" cy="9" r="3"/><circle cx="16.5" cy="10" r="2.4"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M14.5 14.6c2.6-.4 4.6 1.2 5 4.4"/>',
          utensils:
            '<path d="M7 3v8M5 3v5a2 2 0 004 0V3M7 11v10M16 3c-2 1.5-2.5 4-2.5 7H16v11"/>',
          camera:
            '<rect x="3.5" y="7" width="17" height="12" rx="2.5"/><circle cx="12" cy="13" r="3.4"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/>',
          mic2: '<rect x="9" y="3.5" width="6" height="10" rx="3"/><path d="M6 11a6 6 0 0012 0M12 17v3.5M9 20.5h6"/>',
          cake: '<path d="M4 20.5h16M5 20.5v-6h14v6M7 14.5v-3h10v3M12 11.5V8"/><path d="M12 4.5c.9 1 .9 2 0 3-.9-1-.9-2 0-3z"/>',
          music:
            '<path d="M9 17.5V6l10-2v11.5"/><circle cx="6.5" cy="17.5" r="2.5"/><circle cx="16.5" cy="15.5" r="2.5"/>',
          gift: '<rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.5-3-5-4-5-1.5S10 9 12 9zM12 9c1.5-3 5-4 5-1.5S14 9 12 9z"/>',
          "party-popper":
            '<path d="M4 20l5-13 8 8z"/><path d="M14 4v2M19 9h2M17.5 5.5L16 7M13 9.5c1-2 3-2.5 4.5-2"/>',
          sparkles:
            '<path d="M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6z"/>',
          flower2:
            '<circle cx="12" cy="9" r="2.2"/><path d="M12 6.8c0-2.6 3.4-2.6 3.4 0M14.2 9c2.6 0 2.6 3.4 0 3.4M9.8 9c-2.6 0-2.6 3.4 0 3.4M12 11.2V21M12 17c-2.4 0-4-1.6-4-3.4 2.2 0 4 1.4 4 3.4z"/>',
          home: '<path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5.5h4V20"/>',
          car: '<path d="M4 15.5l1.6-5A2 2 0 017.5 9h9a2 2 0 011.9 1.5l1.6 5V19h-3v-2H7v2H4z"/><circle cx="7.5" cy="15" r="1"/><circle cx="16.5" cy="15" r="1"/>',
          shirt:
            '<path d="M8.5 4L4 6.5 5.5 10.5 8 9.5V20h8V9.5l2.5 1L20 6.5 15.5 4c-.6 1.6-1.9 2.5-3.5 2.5S9.1 5.6 8.5 4z"/>',
          clock: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
          star: '<path d="M12 4l2.4 5 5.4.6-4 3.8 1.1 5.4L12 16.1 7.1 18.8l1.1-5.4-4-3.8 5.4-.6z"/>',
        };
        var rdItems = [];
        (function rundown() {
          var raw = $("wedivo-rundown-data");
          try {
            rdItems = JSON.parse(
              ((raw && raw.textContent) || "").trim() || "[]",
            );
          } catch (e) {
            rdItems = [];
          }
          if (!Array.isArray(rdItems) || !rdItems.length) {
            rdItems = [];
            hideSection("rundown");
            return;
          }
          var listEl = $("rd-list");
          var dates = [];
          rdItems.forEach(function (it) {
            if (dates.indexOf(it.date) < 0) {
              dates.push(it.date);
            }
          });
          var multi = dates.length > 1;
          var lastDate = null;
          rdItems.forEach(function (it, k) {
            if (multi && it.date !== lastDate) {
              lastDate = it.date;
              var h = doc.createElement("h3");
              h.className = "rd-day rv rv-left";
              h.id = uid("rd-day");
              var dd = parseDT(it.date, "00:00");
              h.textContent = dd ? fmtDate(dd) : String(it.date || "");
              listEl.appendChild(h);
              observe(h);
            }
            var art = doc.createElement("article");
            art.className = "rd-item rv";
            art.dataset.itemId = it.id;
            art.id = uid("rd-item");
            art.style.setProperty("--rd", "0.05s");
            var node = doc.createElement("div");
            node.className = "rd-node";
            node.id = uid("rd-node");
            var pk = doc.createElement("span");
            pk.className = "pp-peony lite auto";
            pk.id = uid("rd-peony");
            pk.setAttribute(
              "data-palette",
              ["blush", "coral", "ivory", "lilac"][k % 4],
            );
            pk.setAttribute("data-seed", String(31 + k * 7));
            node.appendChild(pk);
            var ic = it.icon && RD_ICONS[String(it.icon).toLowerCase()];
            if (ic) {
              var gl = doc.createElement("span");
              gl.className = "rd-glyph";
              gl.id = uid("rd-glyph");
              gl.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
                ic +
                "</svg>";
              gl.querySelectorAll("*").forEach(function (c) {
                c.id = uid("rd-gl");
              });
              node.appendChild(gl);
            }
            var card = doc.createElement("div");
            card.className = "rd-card";
            card.id = uid("rd-card");
            var time = doc.createElement("p");
            time.className = "rd-time";
            time.id = uid("rd-time");
            if (it.isAllDay) {
              time.textContent = payload.ui.days;
            } else {
              var st = fmtTime(it.startTime);
              var en = fmtTime(it.endTime);
              time.textContent = st
                ? st + (en ? " – " + en : "") + tzSuffix
                : payload.ui.eventSub;
            }
            var ttl = doc.createElement("h4");
            ttl.className = "rd-title";
            ttl.id = uid("rd-title");
            ttl.textContent = it.title || payload.ui.program;
            card.appendChild(time);
            card.appendChild(ttl);
            if (it.location) {
              var lc = doc.createElement("p");
              lc.className = "rd-loc";
              lc.id = uid("rd-loc");
              lc.innerHTML =
                '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0113 0c0 5-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>';
              lc.querySelectorAll("*").forEach(function (c) {
                c.id = uid("rd-lc");
              });
              var ls = doc.createElement("span");
              ls.id = uid("rd-lct");
              ls.textContent = it.location;
              lc.appendChild(ls);
              card.appendChild(lc);
            }
            if (it.description) {
              var ds = doc.createElement("p");
              ds.className = "rd-desc";
              ds.id = uid("rd-desc");
              ds.textContent = it.description;
              card.appendChild(ds);
            }
            art.appendChild(node);
            art.appendChild(card);
            listEl.appendChild(art);
            makePeony(pk);
            observe(art);
          });
        })();
        function rundownStem(vh) {
          if (!rdItems.length) {
            return;
          }
          var bodyEl = $("rd-body");
          var r = bodyEl.getBoundingClientRect();
          if (r.bottom < -100 || r.top > vh + 100) {
            return;
          }
          var h = Math.max(1, r.height - 20);
          var svg = $("rd-stem");
          var path = $("rd-stem-path");
          if (svg.getAttribute("data-h") !== String(Math.round(h))) {
            svg.setAttribute("data-h", String(Math.round(h)));
            svg.setAttribute("viewBox", "0 0 4 " + Math.round(h));
            path.setAttribute("d", "M2 0V" + Math.round(h));
            path.style.strokeDasharray = String(Math.round(h));
          }
          var p = clamp((vh * 0.72 - r.top) / h, 0, 1);
          path.style.strokeDashoffset = (h * (1 - p)).toFixed(1);
        }
        /* ---------- dress code: dye the silk ---------- */
        (function dresscode() {
          if (!txt($("dc-text"))) {
            $("dc-text").style.display = "none";
          }
          var valid = [];
          $$(".dc-sw").forEach(function (b) {
            var c = (b.getAttribute("data-color") || "").trim();
            if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c)) {
              b.style.display = "none";
              return;
            }
            var nm = b.querySelector(".dc-sw-name");
            if (!txt(nm)) {
              nm.textContent = c.toUpperCase();
            }
            b.style.setProperty("--sw", c);
            valid.push(b);
          });
          if (!valid.length) {
            $("dc-swatches").style.display = "none";
            $("dc-pick").style.display = "none";
            if (!txt($("dc-text"))) {
              hideSection("dresscode");
            }
            return;
          }
          var dyes = $("dc-dyes");
          function dye(btn, quiet) {
            var col = btn.getAttribute("data-color").trim();
            valid.forEach(function (b) {
              b.classList.toggle("is-picked", b === btn);
            });
            var p = doc.createElementNS(SVGNS, "path");
            p.setAttribute("id", uid("dc-dye"));
            p.setAttribute("class", "dc-dye");
            p.setAttribute(
              "d",
              "M-10 -30H310V392C292 392 290 416 270 414S250 396 230 398 210 420 190 418 170 398 150 400 130 422 110 420 90 398 70 400 50 418 30 416 10 396 -10 398Z",
            );
            p.setAttribute("fill", col);
            p.setAttribute("fill-opacity", "0.88");
            dyes.appendChild(p);
            void p.getBoundingClientRect();
            requestAnimationFrame(function () {
              p.classList.add("is-down");
            });
            var olds = Array.prototype.slice.call(dyes.childNodes, 0, -1);
            setTimeout(function () {
              olds.forEach(function (o) {
                if (o.parentNode) {
                  o.parentNode.removeChild(o);
                }
              });
            }, 2600);
            $("dc-pick").textContent =
              payload.ui.selected +
              txt(btn.querySelector(".dc-sw-name")) +
              "";
            if (!quiet) {
              sfx("drop");
            }
          }
          valid.forEach(function (b) {
            b.addEventListener("click", function () {
              dye(b, false);
            });
          });
          revealHooks["dc-stage"] = function () {
            setTimeout(function () {
              if (!dyes.childNodes.length) {
                dye(valid[0], true);
                $("dc-pick").textContent =
                  payload.ui.dye;
              }
            }, 700);
          };
        })();
        /* ---------- gallery + photo viewer ---------- */
        var galleryUrls = payload.data.gallery.map(function (item) { return item.src; });
        (function gallery() {
          var grid = $("gl-grid");
          if (!galleryUrls.length) {
            hideSection("gallery");
            return;
          }
          if (!txt($("gl-note"))) {
            $("gl-note").style.display = "none";
          }
          var tiles = [];
          var ratios = [];
          galleryUrls.forEach(function (u, i) {
            var b = doc.createElement("button");
            b.type = "button";
            b.className = "gl-tile rv rv-zoom" + (i % 4 === 0 ? " arch" : "");
            b.id = "gl-tile-" + (i + 1);
            b.style.setProperty("--rd", ((i % 3) * 0.12).toFixed(2) + "s");
            b.setAttribute("aria-label", payload.data.gallery[i].alt || String(i + 1));
            b.dataset.itemId = payload.data.gallery[i].id;
            var im = doc.createElement("img");
            im.id = "gl-img-" + (i + 1);
            im.src = u;
            im.alt = payload.data.gallery[i].alt;
            im.loading = "lazy";
            im.decoding = "async";
            var num = doc.createElement("span");
            num.className = "gl-num";
            num.id = "gl-num-" + (i + 1);
            num.textContent = payload.data.gallery[i].caption || pad(i + 1);
            b.appendChild(im);
            b.appendChild(num);
            b.addEventListener("click", function () {
              openViewer(i);
            });
            ratios[i] = i % 3 === 1 ? 1 : 1.25;
            im.addEventListener("load", function () {
              if (im.naturalWidth) {
                ratios[i] = clamp(im.naturalHeight / im.naturalWidth, 0.6, 1.7);
                relayoutSoon();
              }
            });
            tiles.push(b);
          });
          var cols = 0;
          var t = 0;
          function relayoutSoon() {
            clearTimeout(t);
            t = setTimeout(function () {
              layout(true);
            }, 160);
          }
          function layout(force) {
            var n =
              galleryUrls.length === 1 ? 1 : win.innerWidth >= 768 ? 3 : 2;
            if (galleryUrls.length === 2) {
              n = 2;
            }
            if (n === cols && !force) {
              return;
            }
            cols = n;
            grid.classList.toggle("one", n === 1);
            var colEls = [];
            var hs = [];
            grid.innerHTML = "";
            grid.style.gridTemplateColumns =
              "repeat(" + n + ", minmax(0, 1fr))";
            for (var c = 0; c < n; c++) {
              var ce = doc.createElement("div");
              ce.className = "gl-col";
              ce.id = "gl-col-" + (c + 1);
              grid.appendChild(ce);
              colEls.push(ce);
              hs.push(0);
            }
            tiles.forEach(function (tile, i) {
              var best = 0;
              for (var k = 1; k < n; k++) {
                if (hs[k] < hs[best] - 0.05) {
                  best = k;
                }
              }
              colEls[best].appendChild(tile);
              hs[best] += ratios[i] + 0.08;
            });
          }
          layout(false);
          tiles.forEach(observe);
          win.addEventListener("resize", function () {
            layout(false);
          });
          var lb = $("lb");
          var lbImg = $("lb-img");
          var cur = 0;
          var lastFocus = null;
          var onKey = function (e) {
            if (!lb.classList.contains("is-open")) {
              return;
            }
            if (e.key === "Escape") {
              closeViewer();
            } else if (e.key === "ArrowLeft") {
              step(-1);
            } else if (e.key === "ArrowRight") {
              step(1);
            }
          };
          function show(i) {
            cur = (i + galleryUrls.length) % galleryUrls.length;
            lbImg.classList.add("is-swapping");
            setTimeout(
              function () {
                lbImg.src = galleryUrls[cur];
                lbImg.alt = payload.data.gallery[cur].alt;
                $("lb-cap").textContent = payload.data.gallery[cur].caption;
                $("lb-count").textContent =
                  cur + 1 + " / " + galleryUrls.length;
                lbImg.classList.remove("is-swapping");
              },
              lb.classList.contains("is-open") ? 220 : 0,
            );
          }
          function step(d) {
            show(cur + d);
            sfx("pop");
          }
          function openViewer(i) {
            lastFocus = doc.activeElement;
            lb.classList.toggle("single", galleryUrls.length <= 1);
            show(i);
            lb.style.display = "";
            lb.setAttribute("aria-hidden", "false");
            body.classList.add("is-locked");
            requestAnimationFrame(function () {
              lb.classList.add("is-open");
            });
            burst(win.innerWidth / 2, win.innerHeight / 2, 18, 1.2);
            setTimeout(function () {
              $("lb-close").focus({ preventScroll: true });
            }, 60);
          }
          function closeViewer() {
            lb.classList.remove("is-open");
            lb.setAttribute("aria-hidden", "true");
            body.classList.remove("is-locked");
            if (lastFocus && lastFocus.focus) {
              lastFocus.focus({ preventScroll: true });
            }
          }
          $("lb-close").addEventListener("click", closeViewer);
          $("lb-bg").addEventListener("click", closeViewer);
          $("lb-prev").addEventListener("click", function () {
            step(-1);
          });
          $("lb-next").addEventListener("click", function () {
            step(1);
          });
          doc.addEventListener("keydown", onKey);
          var tx = null;
          var ty = null;
          lb.addEventListener(
            "touchstart",
            function (e) {
              tx = e.touches[0].clientX;
              ty = e.touches[0].clientY;
            },
            { passive: true },
          );
          lb.addEventListener(
            "touchend",
            function (e) {
              if (tx === null) {
                return;
              }
              var dx = e.changedTouches[0].clientX - tx;
              var dy = e.changedTouches[0].clientY - ty;
              if (
                Math.abs(dx) > 50 &&
                Math.abs(dx) > Math.abs(dy) &&
                galleryUrls.length > 1
              ) {
                step(dx < 0 ? 1 : -1);
              }
              tx = null;
            },
            { passive: true },
          );
        })();
        /* ---------- gift: untie the silk bundle ---------- */
        (function gift() {
          if (!txt($("gf-intro"))) {
            $("gf-intro").style.display = "none";
          }
          if (!txt($("gf-address-text"))) {
            $("gf-address").style.display = "none";
          }
          var btn = $("gf-wrapbtn");
          var hint = $("gf-hint");
          btn.addEventListener("click", function () {
            if (btn.classList.contains("is-tied")) {
              btn.classList.remove("is-tied");
            }
            var open = !btn.classList.contains("is-open");
            btn.classList.toggle("is-open", open);
            btn.setAttribute("aria-pressed", open ? "true" : "false");
            if (open) {
              hint.textContent = payload.ui.giftHint;
              burstAt(btn, 22, 0.9);
              sfx("chime");
            } else {
              hint.textContent = payload.ui.giftHint;
              sfx("pop");
            }
          });
          $("gf-copy").addEventListener("click", function () {
            copyText(
              txt($("gf-address-text")),
              payload.ui.copied,
            );
          });
          var form = $("gf-form");
          if ("MutationObserver" in win) {
            new MutationObserver(function () {
              if (
                form.classList.contains("is-submitted") &&
                !btn.classList.contains("is-tied")
              ) {
                btn.classList.remove("is-open");
                btn.classList.add("is-tied");
                hint.textContent = payload.ui.thanks;
                burstAt(btn, 30, 1);
                sfx("gullar-bayrami");
              }
            }).observe(form, { attributes: true, attributeFilter: ["class"] });
          }
        })();
        /* ---------- RSVP: the attendance vase ---------- */
        (function rsvp() {
          if (!txt($("rs-intro"))) {
            $("rs-intro").style.display = "none";
          }
          var stems = $("rs-stems");
          var cap = $("rs-caption");
          var form = $("rs-form");
          var pax = $("rs-pax");
          var nameIn = $("rs-name");
          var status = "";
          var KINDS = [
            "bloom_blush",
            "coral",
            "ivory",
            "lilac",
            "half",
            "bloom_blush",
          ];
          var who = function () {
            var v = (
              nameIn && nameIn.value ? nameIn.value : guestName || ""
            ).trim();
            return v;
          };
          function makeStem(kind, a, idx) {
            var s = doc.createElement("div");
            s.className = "rs-stem";
            s.id = uid("rs-stem");
            s.style.setProperty("--a", a.toFixed(1) + "deg");
            s.style.setProperty(
              "--fs",
              (kind === "bud" ? 64 : 86 - Math.abs(a) * 0.6).toFixed(0) + "px",
            );
            var inner = doc.createElement("div");
            inner.className = "rs-stem-in";
            inner.id = uid("rs-stem-in");
            inner.style.setProperty("--dur", (5 + (idx % 3)).toFixed(1) + "s");
            inner.style.setProperty("--dl", (-idx * 0.7).toFixed(1) + "s");
            var fl = doc.createElement("span");
            fl.className = "rs-flower";
            fl.id = uid("rs-flower");
            var im = doc.createElement("img");
            im.className = "wc";
            im.id = uid("rs-wc");
            im.alt = "";
            im.setAttribute("data-wc", kind);
            fl.appendChild(im);
            inner.appendChild(fl);
            s.appendChild(inner);
            setWcSrc(im);
            return s;
          }
          function layout(n, kindFn) {
            var cur = $$(".rs-stem:not(.is-out)", stems);
            while (cur.length > n) {
              var gone = cur.pop();
              gone.classList.remove("is-in");
              gone.classList.add("is-out");
              (function (g) {
                setTimeout(function () {
                  if (g.parentNode) {
                    g.parentNode.removeChild(g);
                  }
                }, 1100);
              })(gone);
            }
            for (var i = 0; i < n; i++) {
              var a = (i - (n - 1) / 2) * (n > 4 ? 10 : 13);
              var kind = kindFn(i);
              var el = cur[i];
              if (
                !el ||
                el.querySelector("img").getAttribute("data-wc") !== kind
              ) {
                if (el) {
                  el.classList.remove("is-in");
                  el.classList.add("is-out");
                }
                el = makeStem(kind, a, i);
                stems.appendChild(el);
                (function (e2, d) {
                  setTimeout(
                    function () {
                      e2.classList.add("is-in");
                    },
                    40 + d * 260,
                  );
                })(el, i);
              } else {
                el.style.setProperty("--a", a.toFixed(1) + "deg");
              }
            }
          }
          function moreBadge(extra) {
            var b = $("rs-more");
            if (extra > 0) {
              if (!b) {
                b = doc.createElement("span");
                b.id = "rs-more";
                $("rs-scene").appendChild(b);
              }
              b.textContent = "+" + extra;
            } else if (b) {
              b.parentNode.removeChild(b);
            }
          }
          function fallPetals() {
            var box = $("rs-petals");
            for (var i = 0; i < 6; i++) {
              var im = doc.createElement("img");
              im.className = "wc rs-fall";
              im.id = uid("rs-fall");
              im.alt = "";
              im.setAttribute("data-wc", "petal_" + (1 + ((i * 3) % 16)));
              im.style.left = 14 + i * 13 + "%";
              im.style.setProperty(
                "--dx",
                ((i % 2 ? -1 : 1) * (10 + i * 6)).toFixed(0) + "px",
              );
              im.style.setProperty(
                "--dy",
                (300 + (i % 3) * 18).toFixed(0) + "px",
              );
              im.style.setProperty("--dr", (160 + i * 40).toFixed(0) + "deg");
              im.style.animationDelay = (i * 0.22).toFixed(2) + "s";
              box.appendChild(im);
              setWcSrc(im);
              (function (el) {
                setTimeout(function () {
                  if (el.parentNode) {
                    el.parentNode.removeChild(el);
                  }
                }, 6000);
              })(im);
            }
          }
          function render() {
            var nm = who();
            if (status === "attending") {
              var n = 1;
              layout(Math.min(n, 6), function (i) {
                return KINDS[i % KINDS.length];
              });
              moreBadge(n - 6);
              cap.textContent = payload.ui.yesVase;
            } else if (status === "maybe") {
              layout(1, function () {
                return "bud";
              });
              moreBadge(0);
              cap.textContent = payload.ui.maybeVase;
            } else if (status === "not_attending") {
              layout(0, function () {
                return "bud";
              });
              moreBadge(0);
              fallPetals();
              cap.textContent = payload.ui.noVase;
            }
          }
          function readStatus() {
            var sel = form.querySelector("[data-wedivo-status].is-selected");
            return sel ? sel.getAttribute("data-wedivo-status") : "";
          }
          $$("[data-wedivo-status]", form).forEach(function (b) {
            b.addEventListener("click", function () {
              var s = b.getAttribute("data-wedivo-status");
              setTimeout(function () {
                var rs = readStatus() || s;
                if (rs !== status) {
                  status = rs;
                  render();
                  sfx(rs === "not_attending" ? "drop" : "pop");
                }
              }, 30);
            });
          });
          pax.addEventListener("input", function () {
            if (status === "attending") {
              render();
            }
          });
          if ("MutationObserver" in win) {
            new MutationObserver(function () {
              var rs = readStatus();
              if (rs && rs !== status) {
                status = rs;
                render();
              }
              if (
                form.classList.contains("is-submitted") &&
                !form.getAttribute("data-celebrated")
              ) {
                form.setAttribute("data-celebrated", "1");
                burstAt($("rs-vase"), 34, 1.1);
                sfx("gullar-bayrami");
                cap.textContent = payload.ui.saved;
              }
            }).observe(form, {
              attributes: true,
              subtree: true,
              attributeFilter: ["class"],
            });
          }
        })();
        /* ---------- wishes ---------- */
        (function wishes() {
          if (!txt($("ws-intro"))) {
            $("ws-intro").style.display = "none";
          }
          var ta = $("ws-msg");
          $$(".ws-chip").forEach(function (c) {
            c.addEventListener("click", function () {
              ta.value = c.getAttribute("data-text");
              try {
                ta.dispatchEvent(new Event("input", { bubbles: true }));
              } catch (e) {
                /* old browser */
              }
              ta.focus({ preventScroll: true });
              sfx("pop");
            });
          });
          var list = $("ws-list");
          var n = 0;
          var initialDone = false;
          setTimeout(function () {
            initialDone = true;
          }, 4000);
          function decorate(card) {
            if (!card || card.nodeType !== 1 || card.getAttribute("data-pp")) {
              return;
            }
            card.setAttribute("data-pp", "1");
            n += 1;
            if (!card.id) {
              card.id = uid("ws-card");
            }
            $$("*", card).forEach(function (c) {
              if (!c.id) {
                c.id = uid("ws-el");
              }
            });
            var petal = card.querySelector(".ws-petal");
            if (petal) {
              var key = "petal_" + (1 + Math.floor(Math.random() * 16));
              if (cutUrls[key]) {
                petal.style.setProperty(
                  "--petal-img",
                  "url(" + cutUrls[key] + ")",
                );
              }
              petal.style.setProperty(
                "--pr",
                Math.round(Math.random() * 120 - 60) + "deg",
              );
            }
          }
          function sync() {
            $$(".ws-card", list).forEach(decorate);
            var cnt = $$(".ws-card", list).length;
            $("ws-count-n").textContent = String(cnt);
            $("ws-count").classList.toggle("is-empty", cnt === 0);
          }
          if ("MutationObserver" in win) {
            new MutationObserver(function (muts) {
              var added = false;
              muts.forEach(function (m) {
                if (m.addedNodes && m.addedNodes.length) {
                  added = true;
                }
              });
              if (added) {
                var before = n;
                sync();
                if (initialDone && n > before) {
                  burstAt(list, 14, 0.7);
                }
              }
            }).observe(list, { childList: true, subtree: true });
          }
          sync();
        })();
        /* ---------- closing ---------- */
        (function closing() {
          ["cl-msg", "cl-fam", "cl-salam"].forEach(function (id) {
            if (!txt($(id))) {
              $(id).style.display = "none";
            }
          });
          var tag = txt($("cl-tag-t"));
          if (!tag) {
            $("cl-tag").style.display = "none";
          } else {
            $("cl-tag").addEventListener("click", function () {
              copyText(tag, payload.ui.copied);
            });
          }
          $("cl-replay").addEventListener("click", function () {
            win.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
            setTimeout(
              function () {
                if (!heroRegion) {
                  return;
                }
                heroRegion.classList.remove("in-view");
                void heroRegion.offsetWidth;
                setTimeout(function () {
                  heroRegion.classList.add("in-view");
                  burst(win.innerWidth * 0.7, win.innerHeight * 0.3, 26, 1);
                  sfx("gullar-bayrami");
                }, 120);
              },
              reduceMotion ? 0 : 1100,
            );
          });
        })();
        /* ---------- section numbering ---------- */
        function renumber() {
          var k = 0;
          $$("body > [data-section]").forEach(function (s) {
            if (s === coverEl || s === heroRegion || !isShown(s)) {
              return;
            }
            var num = s.querySelector(".sec-num");
            if (!num) {
              return;
            }
            k += 1;
            num.textContent = payload.ui.petals + pad(k);
          });
        }
        /* ---------- navigation ---------- */
        var nav = $("pp-nav");
        var meterBtn = $("nv-meter");
        var activeId = "";
        var lockUntil = 0;
        var centerT = 0;
        function navItems() {
          return rail ? $$("[data-nav-target]", rail) : [];
        }
        function refreshNi() {
          var k = 0;
          navItems().forEach(function (b) {
            if (isShown(b)) {
              b.style.setProperty("--ni", String(k));
              k += 1;
            }
          });
        }
        function centerRail(item, smooth) {
          if (!item || !rail || body.classList.contains("nav-expanded")) {
            return;
          }
          var max = rail.scrollWidth - rail.clientWidth;
          if (max <= 1) {
            return;
          }
          var rr = rail.getBoundingClientRect();
          var ir = item.getBoundingClientRect();
          var target =
            rail.scrollLeft +
            (ir.left - rr.left - rail.clientLeft) -
            (rail.clientWidth - ir.width) / 2;
          target = clamp(target, 0, max);
          if (Math.abs(target - rail.scrollLeft) < 2) {
            return;
          }
          if (rail.scrollTo) {
            rail.scrollTo({
              left: target,
              behavior: smooth && !reduceMotion ? "smooth" : "auto",
            });
          } else {
            rail.scrollLeft = target;
          }
        }
        function setActive(id, immediate) {
          if (id === activeId) {
            return;
          }
          activeId = id;
          var item = null;
          navItems().forEach(function (b) {
            var on = b.getAttribute("data-nav-target") === id;
            b.classList.toggle("is-active", on);
            if (on) {
              b.setAttribute("aria-current", "true");
              item = b;
            } else {
              b.removeAttribute("aria-current");
            }
          });
          clearTimeout(centerT);
          if (immediate) {
            centerRail(item, true);
          } else {
            centerT = setTimeout(function () {
              centerRail(item, true);
            }, 180);
          }
        }
        function computeActive() {
          if (Date.now() < lockUntil) {
            return;
          }
          var line = win.innerHeight * 0.35;
          var cur = "";
          $$("body > [data-section]").forEach(function (s) {
            if (s === coverEl || !isShown(s)) {
              return;
            }
            if (s.getBoundingClientRect().top <= line) {
              cur = s.getAttribute("data-section");
            }
          });
          if (!cur) {
            cur = "hero";
          }
          if (rail && !rail.querySelector('[data-nav-target="' + cur + '"]')) {
            return;
          }
          setActive(cur, false);
        }
        function collapseNav() {
          body.classList.remove("nav-expanded");
          if (meterBtn) {
            meterBtn.setAttribute("aria-expanded", "false");
          }
        }
        if (nav) {
          nav.addEventListener("click", function (e) {
            var it = e.target.closest
              ? e.target.closest("[data-nav-target]")
              : null;
            if (!it || !nav.contains(it)) {
              return;
            }
            e.preventDefault();
            var id = it.getAttribute("data-nav-target");
            var t = doc.querySelector('[data-section="' + id + '"]');
            if (!t || !isShown(t)) {
              return;
            }
            var wasExpanded = body.classList.contains("nav-expanded");
            collapseNav();
            lockUntil = Date.now() + 1400;
            activeId = "";
            setActive(id, !wasExpanded);
            if (wasExpanded) {
              setTimeout(function () {
                centerRail(it, false);
              }, 60);
            }
            var top = t.getBoundingClientRect().top + win.pageYOffset;
            win.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            });
            setTimeout(function () {
              lockUntil = 0;
              computeActive();
            }, 1500);
          });
        }
        if (meterBtn) {
          meterBtn.addEventListener("click", function () {
            var on = !body.classList.contains("nav-expanded");
            body.classList.toggle("nav-expanded", on);
            meterBtn.setAttribute("aria-expanded", on ? "true" : "false");
            sfx("pop");
          });
        }
        $("nv-backdrop").addEventListener("click", collapseNav);
        doc.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && body.classList.contains("nav-expanded")) {
            collapseNav();
          }
        });
        var meterArc = $("nv-meter-arc");
        function navMeter(y) {
          var max = doc.documentElement.scrollHeight - win.innerHeight;
          var p = max > 0 ? clamp(y / max, 0, 1) : 0;
          if (meterArc) {
            meterArc.style.strokeDashoffset = (144.5 * (1 - p)).toFixed(1);
          }
          var mp = peonies["nv-meter-peony"];
          if (mp) {
            mp.set(0.22 + 0.78 * p);
          }
        }
        /* ---------- scroll loop ---------- */
        var g1 = $("bg-giant-1");
        var g2 = $("bg-giant-2");
        var hg = $("hr-giant");
        var ticking = false;
        function frame() {
          ticking = false;
          var y = win.pageYOffset;
          var vh = win.innerHeight;
          if (!reduceMotion) {
            if (g1) {
              g1.style.transform =
                "translate3d(0," + (-y * 0.05).toFixed(1) + "px,0)";
            }
            if (g2) {
              g2.style.transform =
                "translate3d(0," + (-y * 0.09).toFixed(1) + "px,0)";
            }
            if (hg && y < vh * 1.5) {
              hg.style.transform =
                "translate3d(0," +
                (y * 0.22).toFixed(1) +
                "px,0) rotate(" +
                (y * 0.025).toFixed(2) +
                "deg)";
            }
          }
          storyScrub(vh);
          rundownStem(vh);
          navMeter(y);
          computeActive();
          releaseBottom();
        }
        function onScroll() {
          if (!ticking) {
            ticking = true;
            requestAnimationFrame(frame);
          }
        }
        win.addEventListener("scroll", onScroll, { passive: true });
        var rzT = 0;
        win.addEventListener("resize", function () {
          clearTimeout(rzT);
          rzT = setTimeout(function () {
            sizeCanvas();
            initAmbient();
            if (reduceMotion) {
              startBg();
            }
            fitNames();
            var it = rail ? rail.querySelector(".is-active") : null;
            centerRail(it, false);
            onScroll();
          }, 160);
        });
        /* ---------- cover: lift the silk veil ---------- */
        var opened = false;
        function finishCover() {
          if (!coverEl) {
            return;
          }
          var onGone = function (e) {
            if (e && (e.target !== coverEl || e.propertyName !== "opacity")) {
              return;
            }
            if (coverEl.classList.contains("is-gone")) {
              coverEl.style.display = "none";
            }
            coverEl.removeEventListener("transitionend", onGone);
          };
          coverEl.addEventListener("transitionend", onGone);
          setTimeout(onGone, 2600);
        }
        function openCover() {
          if (opened) {
            return;
          }
          opened = true;
          startAudio();
          sfx("gullar-bayrami");
          var bloom = $("cv-bloom");
          var br = bloom.getBoundingClientRect();
          bloom.style.setProperty(
            "--by",
            (win.innerHeight / 2 - (br.top + br.height / 2)).toFixed(0) + "px",
          );
          coverEl.classList.add("is-opening");
          renumber();
          if (!reduceMotion) {
            setTimeout(function () {
              burst(win.innerWidth / 2, win.innerHeight / 2, 46, 1.6);
            }, 1100);
            setTimeout(function () {
              burst(win.innerWidth * 0.15, win.innerHeight * 0.2, 14, 1);
              burst(win.innerWidth * 0.85, win.innerHeight * 0.25, 14, 1);
            }, 1400);
          }
          var gone = reduceMotion ? 60 : 1800;
          setTimeout(function () {
            coverEl.classList.add("is-gone");
            body.classList.remove("is-locked");
            body.classList.add("is-open");
            refreshNi();
            finishCover();
            setTimeout(function () {
              computeActive();
              var it = rail ? rail.querySelector(".is-active") : null;
              centerRail(it, false);
            }, 300);
          }, gone);
          if (reduceMotion) {
            revealHero();
          } else {
            setTimeout(revealHero, gone - 260);
          }
        }
        /* ---------- boot ---------- */
        renumber();
        refreshNi();
        initReveal();
        startBg();
        if (coverEl && $("cv-open")) {
          body.classList.add("is-locked");
          win.scrollTo(0, 0);
          $("cv-open").addEventListener("click", openCover);
          $("cv-bloom").addEventListener("click", openCover);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              coverEl.classList.add("is-ready");
            });
          });
        } else {
          body.classList.add("is-open");
          revealHero();
        }
        doc.addEventListener(
          "pointerdown",
          function () {
            if (opened) {
              startAudio();
            }
          },
          { once: true },
        );
        if (doc.fonts && doc.fonts.ready) {
          doc.fonts.ready.then(function () {
            fitNames();
          });
        }
        frame();
        setTimeout(releaseBottom, 400);
      };
