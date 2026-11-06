
      (function () {
        "use strict";
        var doc = document;
        var body = doc.body;
        var mq = window.matchMedia
          ? window.matchMedia("(prefers-reduced-motion: reduce)")
          : null;
        var reduceMotion = !!(mq && mq.matches) || !!window.roseReducedMotion;
        var isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        function $(id) {
          return doc.getElementById(id);
        }
        function $$(sel, ctx) {
          return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
        }
        function clamp(v, a, b) {
          return Math.min(b, Math.max(a, v));
        }
        function lerp(a, b, t) {
          return a + (b - a) * t;
        }
        function smooth01(t) {
          t = clamp(t, 0, 1);
          return t * t * (3 - 2 * t);
        }
        function pad(n) {
          return String(n).padStart(2, "0");
        }
        function txt(el) {
          return el ? String(el.textContent || "").trim() : "";
        }
        function filled(v) {
          var s = String(v == null ? "" : v).trim();
          return (
            s !== "" &&
            !/^\{\{[^}]*\}\}$/.test(s) &&
            s !== "null" &&
            s !== "undefined"
          );
        }
        function after(ms, fn) {
          return window.setTimeout(fn, reduceMotion ? 0 : ms);
        }
        function make(tag, cls, id, parent) {
          var el = doc.createElement(tag);
          if (cls) {
            el.className = cls;
          }
          if (id) {
            el.id = id;
          }
          if (parent) {
            parent.appendChild(el);
          }
          return el;
        }
        function svgEl(tag, attrs, id, parent) {
          var el = doc.createElementNS("http://www.w3.org/2000/svg", tag);
          Object.keys(attrs || {}).forEach(function (k) {
            el.setAttribute(k, attrs[k]);
          });
          if (id) {
            el.id = id;
          }
          if (parent) {
            parent.appendChild(el);
          }
          return el;
        }
        function validColor(c) {
          return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(c || "").trim());
        }
        function hexToRgb(h) {
          h = String(h).trim().replace("#", "");
          if (h.length === 3) {
            h = h
              .split("")
              .map(function (c) {
                return c + c;
              })
              .join("");
          }
          var n = parseInt(h, 16);
          return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
        }
        function rgbToHex(r) {
          return (
            "#" +
            r
              .map(function (v) {
                return pad(Math.round(clamp(v, 0, 255)).toString(16));
              })
              .join("")
          );
        }
        function mixHex(a, b, t) {
          var x = hexToRgb(a),
            y = hexToRgb(b);
          return rgbToHex([
            lerp(x[0], y[0], t),
            lerp(x[1], y[1], t),
            lerp(x[2], y[2], t),
          ]);
        }
        function luminance(h) {
          var c = hexToRgb(h);
          return (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;
        }
        var toastEl = $("toast");
        var toastTimer = 0;
        function toast(msg) {
          if (!toastEl) {
            return;
          }
          toastEl.textContent = msg;
          toastEl.classList.add("is-on");
          window.clearTimeout(toastTimer);
          toastTimer = window.setTimeout(function () {
            toastEl.classList.remove("is-on");
          }, 2200);
        }
        function copyText(text, okMsg) {
          var done = function () {
            toast(okMsg || window.roseTranslate("Udah disalin!"));
            sfx("pluck");
          };
          var fallback = function () {
            var ta = make("textarea", "", "copy-scratch-" + Date.now());
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            ta.style.top = "0";
            body.appendChild(ta);
            ta.select();
            try {
              doc.execCommand("copy");
              done();
            } catch (e) {
              toast(window.roseTranslate("Gagal nyalin, salin manual ya."));
            }
            body.removeChild(ta);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, fallback);
          } else {
            fallback();
          }
        }
        function parseLocal(dateStr, timeStr) {
          var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dateStr || "").trim());
          if (!m) {
            return null;
          }
          var t = /^(\d{1,2})[:.](\d{2})/.exec(String(timeStr || "").trim());
          return new Date(
            +m[1],
            +m[2] - 1,
            +m[3],
            t ? +t[1] : 0,
            t ? +t[2] : 0,
            0,
          );
        }
        var weddingDate = new Date(window.roseData.dateTime || 0);
        function fmtLong(d) {
          return d.toLocaleDateString(window.roseLocale, {
            weekday: "long", timeZone: tzName,
            day: "numeric",
            month: "long", timeZone: tzName,
            year: "numeric",
          });
        }
        function fmtTime(d) {
          return d
            .toLocaleTimeString(window.roseLocale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: tzName })
            .replace(":", ".");
        }
        function fmtHM(s) {
          var m = /^(\d{1,2})[:.](\d{2})/.exec(String(s || "").trim());
          return m ? pad(+m[1]) + "." + m[2] : "";
        }
        function fmtMinutes(min) {
          min = ((Math.round(min) % 1440) + 1440) % 1440;
          return pad(Math.floor(min / 60)) + "." + pad(min % 60);
        }
        var tzLabel = window.roseData.timezone;
        var tzName = tzLabel;
        var tzOffset = 0;
        $$(".js-date-long").forEach(function (el) {
          el.textContent = fmtLong(weddingDate);
        });
        $$(".js-weekday").forEach(function (el) {
          el.textContent = weddingDate.toLocaleDateString(window.roseLocale, {
            weekday: "long", timeZone: tzName,
          });
        });
        $$(".js-daynum").forEach(function (el) {
          el.textContent = String(window.roseData.date.day);
        });
        $$(".js-monthyear").forEach(function (el) {
          el.textContent = weddingDate.toLocaleDateString(window.roseLocale, {
            month: "long", timeZone: tzName,
            year: "numeric",
          });
        });
        $$(".js-time").forEach(function (el) {
          el.textContent = fmtTime(weddingDate);
        });
        var brideName = txt($("hero-name-b")) || "Mempelai";
        var groomName = txt($("hero-name-g")) || "Mempelai";
        function initial(s) {
          var c = String(s || "")
            .trim()
            .charAt(0);
          return c ? c.toUpperCase() : "♥";
        }
        var guestEl = $("guest-greeting-name");
        var guestName = guestEl ? guestEl.textContent.trim() : "";
        body.classList.toggle("has-guest", guestName !== "");
        var AC = null;
        var sfxMuted = !!window.rosePreview;
        function audioCtx() {
          if (!AC) {
            var C = window.AudioContext || window.webkitAudioContext;
            if (!C) {
              return null;
            }
            try {
              AC = new C();
            } catch (e) {
              AC = null;
              return null;
            }
          }
          if (AC.state === "suspended") {
            AC.resume();
          }
          return AC;
        }
        function tone(freq, start, dur, vol, type) {
          var ctx = AC;
          if (!ctx) {
            return;
          }
          var t0 = ctx.currentTime + (start || 0);
          var o = ctx.createOscillator();
          var g = ctx.createGain();
          o.type = type || "sine";
          o.frequency.setValueAtTime(freq, t0);
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(vol || 0.08, t0 + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(t0);
          o.stop(t0 + dur + 0.05);
        }
        function noise(start, dur, vol, freq, q, sweepTo) {
          var ctx = AC;
          if (!ctx) {
            return;
          }
          var t0 = ctx.currentTime + (start || 0);
          var len = Math.floor(ctx.sampleRate * dur);
          var buf = ctx.createBuffer(1, len, ctx.sampleRate);
          var data = buf.getChannelData(0);
          for (var i = 0; i < len; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          var src = ctx.createBufferSource();
          src.buffer = buf;
          var f = ctx.createBiquadFilter();
          f.type = "bandpass";
          f.frequency.setValueAtTime(freq || 900, t0);
          if (sweepTo) {
            f.frequency.exponentialRampToValueAtTime(sweepTo, t0 + dur);
          }
          f.Q.value = q || 0.8;
          var g = ctx.createGain();
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(vol || 0.1, t0 + dur * 0.3);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          src.connect(f);
          f.connect(g);
          g.connect(ctx.destination);
          src.start(t0);
          src.stop(t0 + dur + 0.05);
        }
        var NOTES = [
          523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5,
        ];
        function sfx(name, arg) {
          if (sfxMuted || !AC) {
            return;
          }
          if (name === "bloom") {
            tone(659.25, 0, 1.4, 0.05);
            tone(987.77, 0.08, 1.2, 0.035);
            tone(1318.5, 0.16, 1.1, 0.025);
          } else if (name === "chord") {
            [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
              tone(f, i * 0.09, 1.8, 0.045);
            });
          } else if (name === "note") {
            var f = NOTES[(arg || 0) % NOTES.length];
            tone(f, 0, 1.1, 0.06, "triangle");
            tone(f * 2, 0.01, 0.6, 0.02);
          } else if (name === "whoosh") {
            noise(0, 1.3, 0.16, 400, 0.7, 3200);
          } else if (name === "pluck") {
            tone(1567.98, 0, 0.35, 0.05);
            tone(2349.3, 0.02, 0.25, 0.02);
          } else if (name === "drop") {
            tone(1400, 0, 0.18, 0.05);
            tone(880, 0.06, 0.4, 0.04);
          } else if (name === "match") {
            noise(0, 0.25, 0.12, 2500, 1.2, 900);
            noise(0.18, 0.6, 0.06, 500, 0.6, 300);
          } else if (name === "zip") {
            noise(0, 0.5, 0.08, 1200, 2, 4000);
          } else if (name === "thunk") {
            tone(110, 0, 0.35, 0.12, "triangle");
            noise(0, 0.12, 0.06, 300, 1);
          } else if (name === "tick") {
            tone(2200, 0, 0.05, 0.015, "square");
          }
        }
        function buzz(ms) {
          if (navigator.vibrate && !reduceMotion) {
            try {
              navigator.vibrate(ms);
            } catch (e) {
              /* ignore */
            }
          }
        }
        var UP = "assets/";
        var CUT_SRC = {
          rose_stem: {
            u: UP + "1791945418_9471749d.jpg",
            lo: 0.05,
            hi: 0.2,
            max: 620,
          },
          rose_white: {
            u: UP + "1791945423_ea0966a6.jpg",
            lo: 0.05,
            hi: 0.2,
            max: 620,
          },
          rose_red: {
            u: UP + "1791945416_fde651d5.jpg",
            lo: 0.06,
            hi: 0.22,
            max: 560,
          },
          rose_coral: {
            u: UP + "1791945421_7ce0da31.jpg",
            lo: 0.06,
            hi: 0.22,
            max: 720,
          },
          rose_blush: {
            u: UP + "1791945420_5d2b8e94.jpg",
            lo: 0.06,
            hi: 0.2,
            max: 560,
          },
          rose_buds: {
            u: UP + "1791945425_f52cde19.jpg",
            lo: 0.08,
            hi: 0.2,
            max: 700,
            split: "bud_",
          },
          rose_dark: {
            u: UP + "1791945429_60d66e9e.jpg",
            lo: 0.03,
            hi: 0.12,
            max: 620,
          },
          candle_pillar: {
            u: UP + "1791945426_d7dd3ebc.jpg",
            lo: 0.06,
            hi: 0.2,
            max: 420,
          },
          candle_red: {
            u: UP + "1791945427_002a35e4.jpg",
            lo: 0.06,
            hi: 0.2,
            max: 480,
          },
        };
        var cutUrls = {};
        function keyCanvas(img, o) {
          var w0 = img.naturalWidth,
            h0 = img.naturalHeight;
          var s = Math.min(1, o.max / Math.max(w0, h0));
          var w = Math.max(1, Math.round(w0 * s)),
            h = Math.max(1, Math.round(h0 * s));
          var c = doc.createElement("canvas");
          c.width = w;
          c.height = h;
          var cx = c.getContext("2d");
          cx.drawImage(img, 0, 0, w, h);
          var im = cx.getImageData(0, 0, w, h);
          var d = im.data,
            n = w * h,
            i,
            p;
          var rs = [],
            gs = [],
            bs = [];
          var step = Math.max(1, Math.floor(Math.min(w, h) / 60));
          var pushPx = function (x, y) {
            var k = (y * w + x) * 4;
            rs.push(d[k]);
            gs.push(d[k + 1]);
            bs.push(d[k + 2]);
          };
          for (i = 0; i < w; i += step) {
            pushPx(i, 0);
            pushPx(i, h - 1);
          }
          for (i = 0; i < h; i += step) {
            pushPx(0, i);
            pushPx(w - 1, i);
          }
          var med = function (a) {
            a.sort(function (x, y) {
              return x - y;
            });
            return a[a.length >> 1];
          };
          var br = med(rs),
            bgc = med(gs),
            bb = med(bs);
          var dist = new Float32Array(n);
          for (p = 0; p < n; p++) {
            var k = p * 4;
            dist[p] =
              Math.max(
                Math.abs(d[k] - br),
                Math.abs(d[k + 1] - bgc),
                Math.abs(d[k + 2] - bb),
              ) / 255;
          }
          var reg = new Uint8Array(n),
            stack = new Int32Array(n),
            sp = 0;
          var seed = function (q) {
            if (!reg[q] && dist[q] < o.hi) {
              reg[q] = 1;
              stack[sp++] = q;
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
          while (sp > 0) {
            p = stack[--sp];
            var x = p % w,
              y = (p / w) | 0;
            if (x > 0) {
              seed(p - 1);
            }
            if (x < w - 1) {
              seed(p + 1);
            }
            if (y > 0) {
              seed(p - w);
            }
            if (y < h - 1) {
              seed(p + w);
            }
          }
          var minX = w,
            minY = h,
            maxX = -1,
            maxY = -1;
          var alphaArr = new Uint8Array(n);
          for (p = 0; p < n; p++) {
            var a = 1;
            if (reg[p]) {
              var t = clamp((dist[p] - o.lo) / (o.hi - o.lo), 0, 1);
              a = t * t * (3 - 2 * t);
            }
            var q4 = p * 4;
            if (a < 1) {
              var al = Math.max(a, 0.004);
              d[q4] = clamp(br + (d[q4] - br) / al, 0, 255);
              d[q4 + 1] = clamp(bgc + (d[q4 + 1] - bgc) / al, 0, 255);
              d[q4 + 2] = clamp(bb + (d[q4 + 2] - bb) / al, 0, 255);
            }
            d[q4 + 3] = Math.round(a * 255);
            alphaArr[p] = d[q4 + 3];
            if (d[q4 + 3] > 10) {
              var px = p % w,
                py = (p / w) | 0;
              if (px < minX) {
                minX = px;
              }
              if (px > maxX) {
                maxX = px;
              }
              if (py < minY) {
                minY = py;
              }
              if (py > maxY) {
                maxY = py;
              }
            }
          }
          cx.putImageData(im, 0, 0);
          var crop = function (x0, y0, x1, y1) {
            var m = 2;
            x0 = Math.max(0, x0 - m);
            y0 = Math.max(0, y0 - m);
            x1 = Math.min(w - 1, x1 + m);
            y1 = Math.min(h - 1, y1 + m);
            var cw = x1 - x0 + 1,
              ch = y1 - y0 + 1;
            var out = doc.createElement("canvas");
            out.width = cw;
            out.height = ch;
            out.getContext("2d").drawImage(c, x0, y0, cw, ch, 0, 0, cw, ch);
            return out;
          };
          if (!o.split) {
            if (maxX < 0) {
              return [c];
            }
            return [crop(minX, minY, maxX, maxY)];
          }
          var lab = new Int32Array(n),
            boxes = [],
            label = 0;
          for (p = 0; p < n; p++) {
            if (alphaArr[p] < 70 || lab[p]) {
              continue;
            }
            label++;
            var bx0 = w,
              by0 = h,
              bx1 = 0,
              by1 = 0,
              cnt = 0;
            sp = 0;
            stack[sp++] = p;
            lab[p] = label;
            while (sp > 0) {
              var r = stack[--sp];
              var rx = r % w,
                ry = (r / w) | 0;
              cnt++;
              if (rx < bx0) {
                bx0 = rx;
              }
              if (rx > bx1) {
                bx1 = rx;
              }
              if (ry < by0) {
                by0 = ry;
              }
              if (ry > by1) {
                by1 = ry;
              }
              var nb = [
                rx > 0 ? r - 1 : -1,
                rx < w - 1 ? r + 1 : -1,
                ry > 0 ? r - w : -1,
                ry < h - 1 ? r + w : -1,
              ];
              for (var j = 0; j < 4; j++) {
                var z = nb[j];
                if (z >= 0 && !lab[z] && alphaArr[z] >= 70) {
                  lab[z] = label;
                  stack[sp++] = z;
                }
              }
            }
            if (cnt > n * 0.0025) {
              boxes.push([bx0, by0, bx1, by1]);
            }
          }
          boxes.sort(function (A, B) {
            return A[1] - B[1] || A[0] - B[0];
          });
          return boxes.map(function (b) {
            return crop(b[0], b[1], b[2], b[3]);
          });
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
        function applyCut(key, url, raw) {
          cutUrls[key] = url;
          $$('img[data-cut="' + key + '"]').forEach(function (img) {
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
          if (key === "rose_red" && !raw) {
            body.style.setProperty("--rose-thumb", "url(" + url + ")");
            var disc = $("music-disc-rose");
            if (disc) {
              disc.style.backgroundImage = "url(" + url + ")";
            }
          }
        }
        function budKeysUsed() {
          var keys = {};
          $$('img[data-cut^="bud_"]').forEach(function (img) {
            keys[img.getAttribute("data-cut")] = 1;
          });
          return Object.keys(keys);
        }
        var cutQueue = Object.keys(CUT_SRC);
        function processCut(key, done) {
          var o = CUT_SRC[key];
          var img = new Image();
          img.crossOrigin = "anonymous";
          img.decoding = "async";
          img.onload = function () {
            window.setTimeout(function () {
              var parts;
              try {
                parts = keyCanvas(img, o);
              } catch (e) {
                parts = null;
              }
              if (!parts || !parts.length) {
                if (o.split) {
                  budKeysUsed().forEach(function (k) {
                    applyCut(k, o.u, true);
                  });
                } else {
                  applyCut(key, o.u, true);
                }
                done();
                return;
              }
              if (o.split) {
                var used = budKeysUsed();
                var urls = [];
                var left = parts.length;
                parts.forEach(function (cv, idx) {
                  canvasUrl(cv, function (u) {
                    urls[idx] = u;
                    left--;
                    if (left === 0) {
                      used.forEach(function (k) {
                        var num = parseInt(k.replace(o.split, ""), 10) || 1;
                        applyCut(k, urls[(num - 1) % urls.length], false);
                      });
                      done();
                    }
                  });
                });
              } else {
                canvasUrl(parts[0], function (u) {
                  applyCut(key, u, false);
                  done();
                });
              }
            }, 16);
          };
          img.onerror = function () {
            done();
          };
          img.src = o.u;
        }
        function runCuts() {
          var i = 0;
          var next = function () {
            if (i >= cutQueue.length) {
              return;
            }
            var k = cutQueue[i++];
            processCut(k, function () {
              window.setTimeout(next, 0);
            });
          };
          next();
          next();
        }
        var DAY_START = 5 * 60 + 30;
        var DAY_END = 21 * 60 + 30;
        var cover = $("sec-cover");
        var hero = $("sec-hero");
        var regions = $$("body > header, body > section, body > footer");
        var SECTION_NAMES = window.roseSectionNames;
        function periodName(min) {
          if (min < 300) {
            return window.roseTranslate("Subuh");
          }
          if (min < 390) {
            return window.roseTranslate("Fajar");
          }
          if (min < 600) {
            return window.roseTranslate("Pagi");
          }
          if (min < 690) {
            return window.roseTranslate("Menjelang Siang");
          }
          if (min < 870) {
            return window.roseTranslate("Siang");
          }
          if (min < 990) {
            return window.roseTranslate("Sore");
          }
          if (min < 1065) {
            return window.roseTranslate("Jam Emas");
          }
          if (min < 1125) {
            return window.roseTranslate("Senja");
          }
          if (min < 1200) {
            return window.roseTranslate("Lilin Pertama");
          }
          return window.roseTranslate("Malam");
        }
        function isShown(el) {
          return (
            el &&
            el.style.display !== "none" &&
            !el.classList.contains("is-hidden-sec") &&
            el.offsetParent !== null
          );
        }
        var timeline = [];
        function navItemFor(id) {
          return doc.querySelector('[data-nav-target="' + id + '"]');
        }
        function hideSection(el) {
          if (!el) {
            return;
          }
          el.style.display = "none";
          var item = navItemFor(el.getAttribute("data-section"));
          if (item) {
            item.style.display = "none";
          }
        }
        function assignTimes() {
          var vis = regions.filter(function (r) {
            return r !== cover && isShown(r);
          });
          timeline = vis.map(function (sec, i) {
            var t =
              vis.length > 1
                ? DAY_START + ((DAY_END - DAY_START) * i) / (vis.length - 1)
                : DAY_START;
            t = Math.round(t / 5) * 5;
            var cls =
              t >= 18 * 60 + 15
                ? "tod-night"
                : t >= 15 * 60
                  ? "tod-golden"
                  : "tod-day";
            sec.classList.remove("tod-day", "tod-golden", "tod-night");
            sec.classList.add(cls);
            var id = sec.getAttribute("data-section");
            var tag = sec.querySelector(".tod-tag");
            if (tag) {
              var tt = tag.querySelector(".tod-time"),
                tn = tag.querySelector(".tod-name");
              if (tt) {
                tt.textContent = fmtMinutes(t);
              }
              if (tn) {
                tn.textContent = periodName(t);
              }
              var ico = tag.querySelector(".tod-ico");
              if (ico) {
                ico.classList.toggle("is-moon", t >= 18 * 60 + 15);
              }
            }
            var item = navItemFor(id);
            if (item) {
              var nt = item.querySelector(".ni-time");
              if (nt) {
                nt.textContent = fmtMinutes(t) + " · " + periodName(t);
              }
            }
            return { el: sec, id: id, t: t, name: SECTION_NAMES[id] || "" };
          });
        }
        var KEYS = [
          {
            t: 330,
            s1: "#c9b4d6",
            s2: "#f4c7b6",
            s3: "#fde6d2",
            sun: 0.95,
            moon: 0,
            rays: 0.75,
            mist: 0.85,
            dawn: 1,
            gold: 0,
            night: 0,
            wash: [251, 240, 232, 0.28],
            vig: 0.16,
          },
          {
            t: 480,
            s1: "#b9d3e4",
            s2: "#fbe7da",
            s3: "#fff4e8",
            sun: 0.85,
            moon: 0,
            rays: 0.9,
            mist: 0.45,
            dawn: 1,
            gold: 0,
            night: 0,
            wash: [253, 246, 238, 0.32],
            vig: 0.12,
          },
          {
            t: 720,
            s1: "#c8dfea",
            s2: "#fff2e4",
            s3: "#fff8ef",
            sun: 0.7,
            moon: 0,
            rays: 0.55,
            mist: 0.2,
            dawn: 0.55,
            gold: 0.3,
            night: 0,
            wash: [255, 249, 242, 0.36],
            vig: 0.1,
          },
          {
            t: 930,
            s1: "#f2c48f",
            s2: "#f7b28a",
            s3: "#fbd7b2",
            sun: 0.95,
            moon: 0,
            rays: 0.85,
            mist: 0.15,
            dawn: 0,
            gold: 1,
            night: 0,
            wash: [253, 236, 214, 0.24],
            vig: 0.18,
          },
          {
            t: 1065,
            s1: "#6a3a6a",
            s2: "#cf6f79",
            s3: "#f2a17d",
            sun: 0.8,
            moon: 0.25,
            rays: 0.5,
            mist: 0.25,
            dawn: 0,
            gold: 0.75,
            night: 0.35,
            wash: [60, 20, 40, 0.2],
            vig: 0.32,
          },
          {
            t: 1140,
            s1: "#2a1430",
            s2: "#4a1e3c",
            s3: "#6b2a3f",
            sun: 0.1,
            moon: 0.85,
            rays: 0.05,
            mist: 0.2,
            dawn: 0,
            gold: 0,
            night: 1,
            wash: [24, 8, 18, 0.32],
            vig: 0.45,
          },
          {
            t: 1290,
            s1: "#0f070e",
            s2: "#1d0b19",
            s3: "#2b0f1f",
            sun: 0,
            moon: 1,
            rays: 0,
            mist: 0.15,
            dawn: 0,
            gold: 0,
            night: 1,
            wash: [16, 6, 12, 0.4],
            vig: 0.55,
          },
        ];
        var envEl = $("env");
        var envNight = 0;
        var envRays = 0.7;
        var envMin = DAY_START;
        function envAt(min) {
          var a = KEYS[0],
            b = KEYS[KEYS.length - 1];
          for (var i = 0; i < KEYS.length - 1; i++) {
            if (min >= KEYS[i].t && min <= KEYS[i + 1].t) {
              a = KEYS[i];
              b = KEYS[i + 1];
              break;
            }
          }
          if (min < KEYS[0].t) {
            a = b = KEYS[0];
          }
          if (min > KEYS[KEYS.length - 1].t) {
            a = b = KEYS[KEYS.length - 1];
          }
          var t = a === b ? 0 : smooth01((min - a.t) / (b.t - a.t));
          return {
            s1: mixHex(a.s1, b.s1, t),
            s2: mixHex(a.s2, b.s2, t),
            s3: mixHex(a.s3, b.s3, t),
            sun: lerp(a.sun, b.sun, t),
            moon: lerp(a.moon, b.moon, t),
            rays: lerp(a.rays, b.rays, t),
            mist: lerp(a.mist, b.mist, t),
            dawn: lerp(a.dawn, b.dawn, t),
            gold: lerp(a.gold, b.gold, t),
            night: lerp(a.night, b.night, t),
            vig: lerp(a.vig, b.vig, t),
            wash: [0, 1, 2, 3].map(function (k) {
              return lerp(a.wash[k], b.wash[k], t);
            }),
          };
        }
        function applyEnv(min) {
          envMin = min;
          var e = envAt(min);
          envNight = e.night;
          envRays = e.rays;
          if (!envEl) {
            return;
          }
          var st = envEl.style;
          st.setProperty("--sky-1", e.s1);
          st.setProperty("--sky-2", e.s2);
          st.setProperty("--sky-3", e.s3);
          st.setProperty("--sun-a", e.sun.toFixed(3));
          st.setProperty("--moon-a", e.moon.toFixed(3));
          st.setProperty("--rays", e.rays.toFixed(3));
          st.setProperty("--mist", e.mist.toFixed(3));
          st.setProperty("--s-dawn", e.dawn.toFixed(3));
          st.setProperty("--s-gold", e.gold.toFixed(3));
          st.setProperty("--s-night", e.night.toFixed(3));
          st.setProperty("--vig", e.vig.toFixed(3));
          st.setProperty(
            "--wash-c",
            "rgba(" +
              Math.round(e.wash[0]) +
              "," +
              Math.round(e.wash[1]) +
              "," +
              Math.round(e.wash[2]) +
              "," +
              e.wash[3].toFixed(3) +
              ")",
          );
          var sunT = clamp((min - 330) / (1125 - 330), 0, 1);
          var sx = 12 + 76 * sunT,
            sy = 80 - Math.sin(Math.PI * sunT) * 60;
          if (min > 1125) {
            var mt = smooth01((min - 1125) / 120);
            sx = lerp(sx, 80, mt);
            sy = lerp(sy, 15, mt);
          }
          st.setProperty("--sun-x", sx.toFixed(2) + "%");
          st.setProperty("--sun-y", sy.toFixed(2) + "%");
          body.style.backgroundColor = e.s3;
        }
        var navClockTime = $("nav-clock-time");
        var navClockPeriod = $("nav-clock-period");
        var navClockSec = $("nav-clock-sec");
        var navClock = $("nav-clock");
        var navSky = $("nav-sky");
        var lastClockText = "";
        function currentMinute() {
          if (!timeline.length) {
            return DAY_START;
          }
          var line = window.innerHeight * 0.45;
          var idx = -1,
            frac = 0;
          for (var i = 0; i < timeline.length; i++) {
            var r = timeline[i].el.getBoundingClientRect();
            if (r.top <= line) {
              idx = i;
              var nextTop =
                i + 1 < timeline.length
                  ? timeline[i + 1].el.getBoundingClientRect().top
                  : r.bottom;
              var span = Math.max(1, nextTop - r.top);
              frac = clamp((line - r.top) / span, 0, 1);
            }
          }
          if (idx < 0) {
            return timeline[0].t;
          }
          var t0 = timeline[idx].t;
          var t1 = idx + 1 < timeline.length ? timeline[idx + 1].t : t0 + 30;
          return { min: lerp(t0, t1, frac), idx: idx };
        }
        function updateClock(state) {
          var min = typeof state === "number" ? state : state.min;
          var idx = typeof state === "number" ? 0 : state.idx;
          applyEnv(min);
          var label = fmtMinutes(Math.round(min / 5) * 5);
          var period = periodName(min);
          var nm = timeline[idx] ? timeline[idx].name : "";
          var key = label + period + nm;
          if (key !== lastClockText) {
            lastClockText = key;
            if (navClockTime) {
              navClockTime.textContent = label;
            }
            if (navClockPeriod) {
              navClockPeriod.textContent = period;
            }
            if (navClockSec) {
              navClockSec.textContent = nm;
            }
            if (navClock) {
              navClock.classList.toggle("is-night", min >= 1110);
            }
          }
          if (navSky) {
            navSky.style.setProperty(
              "--p",
              (
                clamp((min - DAY_START) / (DAY_END - DAY_START), 0, 1) * 100
              ).toFixed(1) + "%",
            );
          }
        }
        var cv = $("env-canvas");
        var ctx = cv && cv.getContext ? cv.getContext("2d") : null;
        var DPR = Math.min(window.devicePixelRatio || 1, 2);
        var W = 0,
          H = 0;
        var petals = [],
          motes = [],
          sprites = [],
          glowSprite = null,
          moteSprite = null;
        var pointer = { x: -9999, y: -9999, t: 0 };
        var canvasRunning = false;
        function petalPath(c, w, h) {
          c.beginPath();
          c.moveTo(w * 0.5, h);
          c.bezierCurveTo(
            w * 0.22,
            h * 0.9,
            w * 0.03,
            h * 0.66,
            w * 0.04,
            h * 0.4,
          );
          c.bezierCurveTo(
            w * 0.05,
            h * 0.18,
            w * 0.22,
            h * 0.03,
            w * 0.41,
            h * 0.035,
          );
          c.bezierCurveTo(
            w * 0.46,
            h * 0.04,
            w * 0.49,
            h * 0.08,
            w * 0.5,
            h * 0.11,
          );
          c.bezierCurveTo(
            w * 0.51,
            h * 0.08,
            w * 0.54,
            h * 0.04,
            w * 0.59,
            h * 0.035,
          );
          c.bezierCurveTo(
            w * 0.78,
            h * 0.03,
            w * 0.95,
            h * 0.18,
            w * 0.96,
            h * 0.4,
          );
          c.bezierCurveTo(w * 0.97, h * 0.66, w * 0.78, h * 0.9, w * 0.5, h);
          c.closePath();
        }
        function makeSprite(c0, c1, c2) {
          var s = doc.createElement("canvas");
          s.width = 60;
          s.height = 72;
          var c = s.getContext("2d");
          petalPath(c, 60, 72);
          var g = c.createRadialGradient(30, 6, 2, 30, 40, 52);
          g.addColorStop(0, c2);
          g.addColorStop(0.45, c1);
          g.addColorStop(1, c0);
          c.fillStyle = g;
          c.fill();
          c.globalCompositeOperation = "source-atop";
          var g2 = c.createLinearGradient(0, 0, 60, 0);
          g2.addColorStop(0, "rgba(20,0,8,.35)");
          g2.addColorStop(0.3, "rgba(20,0,8,0)");
          g2.addColorStop(0.7, "rgba(255,255,255,0)");
          g2.addColorStop(1, "rgba(20,0,8,.3)");
          c.fillStyle = g2;
          c.fillRect(0, 0, 60, 72);
          c.strokeStyle = "rgba(255,255,255,.18)";
          c.lineWidth = 1;
          c.beginPath();
          c.moveTo(30, 70);
          c.quadraticCurveTo(28, 40, 30, 14);
          c.stroke();
          return s;
        }
        function makeGlow(r, g, b) {
          var s = doc.createElement("canvas");
          s.width = 48;
          s.height = 48;
          var c = s.getContext("2d");
          var gr = c.createRadialGradient(24, 24, 0, 24, 24, 24);
          gr.addColorStop(0, "rgba(" + r + "," + g + "," + b + ",1)");
          gr.addColorStop(0.25, "rgba(" + r + "," + g + "," + b + ",.55)");
          gr.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
          c.fillStyle = gr;
          c.fillRect(0, 0, 48, 48);
          return s;
        }
        function resizeCanvas() {
          if (!cv) {
            return;
          }
          W = window.innerWidth;
          H = window.innerHeight;
          cv.width = Math.round(W * DPR);
          cv.height = Math.round(H * DPR);
          if (ctx) {
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          }
        }
        function newPetal(top) {
          var z = 0.45 + Math.random() * 0.8;
          return {
            x: Math.random() * W,
            y: top ? -40 - Math.random() * H * 0.4 : Math.random() * H,
            z: z,
            vy: 0.35 + z * 0.55,
            vx: -0.15 + Math.random() * 0.3,
            rot: Math.random() * 6.28,
            vr: (Math.random() - 0.5) * 0.03,
            flip: Math.random() * 6.28,
            vf: 0.02 + Math.random() * 0.035,
            sway: Math.random() * 6.28,
            s: sprites[(Math.random() * sprites.length) | 0],
          };
        }
        function initCanvas() {
          if (!ctx) {
            return;
          }
          sprites = [
            makeSprite("#3a020b", "#8e0f24", "#e05a70"),
            makeSprite("#2c0208", "#6d0a1b", "#c03348"),
            makeSprite("#4e0814", "#b3192f", "#f6a0aa"),
            makeSprite("#b46a62", "#efb2a9", "#fff1ec"),
            makeSprite("#b39c80", "#f1e3cd", "#fffdf8"),
            makeSprite("#a3402f", "#ec8a74", "#ffdccd"),
          ];
          glowSprite = makeGlow(255, 236, 150);
          moteSprite = makeGlow(255, 244, 214);
          resizeCanvas();
          var count = W < 700 ? 18 : 30;
          for (var i = 0; i < count; i++) {
            petals.push(newPetal(false));
          }
          var mc = W < 700 ? 26 : 40;
          for (var j = 0; j < mc; j++) {
            motes.push({
              x: Math.random() * W,
              y: Math.random() * H,
              r: 0.6 + Math.random() * 1.6,
              ph: Math.random() * 6.28,
              sp: 0.004 + Math.random() * 0.012,
              vx: (Math.random() - 0.5) * 0.25,
              vy: -0.08 - Math.random() * 0.22,
            });
          }
        }
        var lastFrame = 0;
        function drawFrame(now) {
          if (!ctx) {
            return;
          }
          var dt = lastFrame ? Math.min(3, (now - lastFrame) / 16.67) : 1;
          lastFrame = now;
          ctx.clearRect(0, 0, W, H);
          var wind =
            Math.sin(now * 0.00023) * 0.45 + Math.sin(now * 0.00071) * 0.2;
          var dayA = 1 - envNight;
          ctx.globalCompositeOperation = "lighter";
          for (var m = 0; m < motes.length; m++) {
            var o = motes[m];
            o.ph += o.sp * dt;
            o.x += (o.vx + wind * 0.2) * dt;
            o.y += o.vy * dt;
            if (o.y < -10) {
              o.y = H + 10;
              o.x = Math.random() * W;
            }
            if (o.x < -10) {
              o.x = W + 10;
            }
            if (o.x > W + 10) {
              o.x = -10;
            }
            var tw = 0.5 + 0.5 * Math.sin(o.ph * 3);
            if (dayA > 0.05) {
              ctx.globalAlpha = dayA * (0.25 + envRays * 0.45) * tw;
              var ms = o.r * 6;
              ctx.drawImage(moteSprite, o.x - ms / 2, o.y - ms / 2, ms, ms);
            }
            if (envNight > 0.05) {
              var blink = Math.max(0, Math.sin(o.ph * 1.7 + m));
              ctx.globalAlpha = envNight * blink * 0.9;
              var gs = 10 + o.r * 9;
              ctx.drawImage(glowSprite, o.x - gs / 2, o.y - gs / 2, gs, gs);
            }
          }
          ctx.globalCompositeOperation = "source-over";
          for (var i = 0; i < petals.length; i++) {
            var p = petals[i];
            p.sway += 0.012 * dt;
            p.flip += p.vf * dt;
            p.rot += p.vr * dt;
            var vx = p.vx + wind * p.z + Math.sin(p.sway) * 0.35;
            var dx = p.x - pointer.x,
              dy = p.y - pointer.y;
            var dd = dx * dx + dy * dy;
            if (dd < 14400 && now - pointer.t < 1200) {
              var f = (1 - dd / 14400) * 2.2;
              var dl = Math.sqrt(dd) || 1;
              p.x += (dx / dl) * f * dt;
              p.y += (dy / dl) * f * dt;
              p.vr += (Math.random() - 0.5) * 0.01;
            }
            p.x += vx * dt;
            p.y += p.vy * dt;
            if (p.y > H + 50 || p.x < -80 || p.x > W + 80) {
              petals[i] = newPetal(true);
              continue;
            }
            var sc = 0.32 * p.z + 0.1;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.scale(Math.cos(p.flip) * sc, sc);
            ctx.globalAlpha = (0.55 + p.z * 0.35) * (1 - envNight * 0.25);
            ctx.drawImage(p.s, -30, -36);
            ctx.restore();
          }
          ctx.globalAlpha = 1;
        }
        function loop(now) {
          if (!canvasRunning) {
            return;
          }
          drawFrame(now);
          window.requestAnimationFrame(loop);
        }
        function startCanvas() {
          if (!ctx || canvasRunning) {
            return;
          }
          if (reduceMotion) {
            drawFrame(16);
            return;
          }
          canvasRunning = true;
          lastFrame = 0;
          window.requestAnimationFrame(loop);
        }
        function stopCanvas() {
          canvasRunning = false;
        }
        window.addEventListener(
          "pointermove",
          function (e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.t = performance.now();
          },
          { passive: true },
        );
        window.addEventListener(
          "pointerdown",
          function (e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.t = performance.now();
          },
          { passive: true },
        );
        window.addEventListener("resize", resizeCanvas);
        doc.addEventListener("visibilitychange", function () {
          if (doc.hidden) {
            stopCanvas();
          } else {
            startCanvas();
          }
        });
        var TONES = {
          crimson: ["#3e030d", "#8e0f24", "#e0566c"],
          deep: ["#2e020a", "#6d0a1b", "#c03348"],
          rose: ["#560918", "#b3192f", "#f08a98"],
          blush: ["#b8655d", "#efb3aa", "#fff1ec"],
          blushDeep: ["#9a4c4a", "#de958c", "#ffe0d8"],
          ivory: ["#b49e82", "#f1e4cf", "#fffdf8"],
          coral: ["#a5402f", "#ec8a74", "#ffdccd"],
        };
        var LIGHT_TEX =
          "radial-gradient(circle at 30% 30%, rgba(255,255,255,.18), rgba(255,255,255,0) 40%)";
        var PRESETS = {
          cover: [
            { n: 9, w: 46, h: 52, tw: 34, cs: 0.3, tone: "crimson" },
            { n: 8, w: 38, h: 42, tw: -28, cs: 0.32, tone: "deep" },
            { n: 6, w: 28, h: 30, tw: 24, cs: 0.4, tone: "rose" },
          ],
          date: [
            { n: 9, w: 44, h: 50, tw: 36, cs: 0.3, tone: "blush" },
            { n: 7, w: 36, h: 40, tw: -30, cs: 0.32, tone: "blushDeep" },
            { n: 5, w: 27, h: 29, tw: 24, cs: 0.4, tone: "crimson" },
          ],
          event: [
            { n: 8, w: 44, h: 50, tw: 34, cs: 0.3, tone: "A" },
            { n: 6, w: 34, h: 38, tw: -28, cs: 0.34, tone: "B" },
          ],
          mini: [
            { n: 6, w: 46, h: 48, tw: 40, cs: 0.32, tone: "A" },
            { n: 5, w: 34, h: 34, tw: -30, cs: 0.4, tone: "B" },
          ],
          lang: [
            { n: 8, w: 44, h: 50, tw: 36, cs: 0.3, tone: "A" },
            { n: 6, w: 34, h: 38, tw: -30, cs: 0.34, tone: "B" },
            { n: 5, w: 25, h: 26, tw: 22, cs: 0.42, tone: "C" },
          ],
          graft: [
            { n: 10, w: 44, h: 50, tw: 34, cs: 0.3, tone: "MIX" },
            { n: 7, w: 34, h: 38, tw: -30, cs: 0.34, tone: "MIX2" },
          ],
        };
        function toneFromColor(c) {
          var base = validColor(c) ? c : "#9e1229";
          var L = luminance(base);
          return {
            A: [
              mixHex(base, "#1a0006", L > 0.7 ? 0.32 : 0.55),
              base,
              mixHex(base, "#ffffff", 0.45),
            ],
            B: [
              mixHex(base, "#1a0006", L > 0.7 ? 0.4 : 0.62),
              mixHex(base, "#1a0006", 0.12),
              mixHex(base, "#ffffff", 0.3),
            ],
            C: [
              mixHex(base, "#1a0006", 0.65),
              mixHex(base, "#1a0006", 0.25),
              mixHex(base, "#ffffff", 0.2),
            ],
            light: L > 0.45,
          };
        }
        var blooms = {};
        function buildBloom(el, opts) {
          if (!el || el.getAttribute("data-built")) {
            return;
          }
          el.setAttribute("data-built", "1");
          opts = opts || {};
          var preset = PRESETS[el.getAttribute("data-preset")] || PRESETS.mini;
          var tone = el.getAttribute("data-tone") || "crimson";
          var core = el.querySelector(".bloom-core");
          var custom = opts.color ? toneFromColor(opts.color) : null;
          var glow = make("span", "bloom-glow", el.id + "-glow");
          el.insertBefore(glow, core);
          var budTone = null;
          preset.forEach(function (ring, ri) {
            var rEl = make(
              "span",
              "bloom-ring r" + (ri + 1),
              el.id + "-r" + ri,
            );
            var cols,
              light = false;
            if (custom) {
              cols = custom[ring.tone] || custom.A;
              light = custom.light;
            } else if (ring.tone === "A" || ring.tone === "B") {
              var map = {
                blush: ["blush", "blushDeep"],
                crimson: ["crimson", "deep"],
                ivory: ["ivory", "blush"],
                coral: ["coral", "rose"],
              };
              var pair = map[tone] || map.crimson;
              cols = TONES[ring.tone === "A" ? pair[0] : pair[1]];
              light = pair[0] === "blush" || pair[0] === "ivory";
            } else if (ring.tone === "MIX" || ring.tone === "MIX2") {
              cols = null;
            } else {
              cols = TONES[ring.tone] || TONES.crimson;
              light =
                ring.tone === "blush" ||
                ring.tone === "blushDeep" ||
                ring.tone === "ivory";
            }
            rEl.style.setProperty("--pw", ring.w + "%");
            rEl.style.setProperty("--ph", ring.h + "%");
            rEl.style.setProperty("--tw", ring.tw + "deg");
            rEl.style.setProperty("--cs", ring.cs);
            var setCols = function (target, c, isLight) {
              target.style.setProperty("--pc0", c[0]);
              target.style.setProperty("--pc", c[1]);
              target.style.setProperty("--pc2", c[2]);
              if (isLight) {
                target.style.setProperty("--ptex", LIGHT_TEX);
              }
            };
            if (cols) {
              setCols(rEl, cols, light);
              if (!budTone) {
                budTone = { c: cols, l: light };
              }
            }
            var offset = ri * 17 + (opts.offset || 0);
            for (var i = 0; i < ring.n; i++) {
              var p = make("span", "petal", el.id + "-r" + ri + "-p" + i, rEl);
              var a =
                offset + i * (360 / ring.n) + Math.sin(i * 12.9898 + ri) * 5;
              p.style.setProperty("--a", a.toFixed(1) + "deg");
              p.style.setProperty(
                "--pd",
                (ri * 0.14 + i * 0.035).toFixed(3) + "s",
              );
              p.style.setProperty(
                "--bd",
                ((preset.length - 1 - ri) * 0.07 + i * 0.025).toFixed(3) + "s",
              );
              p.style.setProperty("--tx", 20 + ((i * 37) % 60) + "%");
              p.style.setProperty("--ty", 15 + ((i * 53) % 70) + "%");
              if (!cols) {
                var mixA =
                  ring.tone === "MIX"
                    ? i % 2
                      ? TONES.blush
                      : TONES.crimson
                    : i % 2
                      ? TONES.crimson
                      : TONES.blushDeep;
                setCols(
                  p,
                  mixA,
                  mixA === TONES.blush || mixA === TONES.blushDeep,
                );
                if (!budTone) {
                  budTone = { c: TONES.crimson, l: false };
                }
              }
            }
            el.insertBefore(rEl, core);
          });
          var bud = make("span", "bloom-bud", el.id + "-bud");
          for (var bi = 0; bi < 5; bi++) {
            var bp = make("span", "bud-p", el.id + "-bud-p" + bi, bud);
            bp.style.setProperty("--a", bi * 72 + bi * 9 + "deg");
          }
          make("span", "bud-c", el.id + "-bud-c", bud);
          if (budTone) {
            bud.style.setProperty("--pc0", budTone.c[0]);
            bud.style.setProperty("--pc", budTone.c[1]);
            bud.style.setProperty("--pc2", budTone.c[2]);
          }
          el.insertBefore(bud, core);
          blooms[el.id] = el;
        }
        function openBloom(el, silent) {
          if (!el || el.classList.contains("is-open")) {
            return;
          }
          el.classList.remove("is-half");
          el.classList.add("is-open");
          if (!silent) {
            sfx("bloom");
          }
        }
        function closeBloom(el) {
          if (el) {
            el.classList.remove("is-open");
          }
        }
        $$(".bloom").forEach(function (b) {
          if (!b.closest(".rl-rose")) {
            buildBloom(b);
          }
        });
        var pending = [];
        var heroRevealed = false;
        var hooks = {};
        function onSeen(id, fn) {
          hooks[id] = fn;
        }
        function fireHook(el) {
          var fn = hooks[el.id];
          if (fn) {
            delete hooks[el.id];
            fn(el);
          }
        }
        function markIn(el) {
          var cls = regions.indexOf(el) >= 0 ? "is-seen" : "in-view";
          if (el.classList.contains(cls)) {
            return;
          }
          el.classList.add(cls);
          var i = pending.indexOf(el);
          if (i >= 0) {
            pending.splice(i, 1);
          }
          if (el.classList.contains("bloom") && el.getAttribute("data-auto")) {
            after(+el.getAttribute("data-auto") || 400, function () {
              openBloom(el);
            });
          }
          fireHook(el);
        }
        var io =
          "IntersectionObserver" in window
            ? new IntersectionObserver(
                function (entries) {
                  entries.forEach(function (en) {
                    if (en.isIntersecting) {
                      io.unobserve(en.target);
                      markIn(en.target);
                    }
                  });
                },
                { threshold: 0, rootMargin: "0px 0px -33% 0px" },
              )
            : null;
        function observe(el) {
          if (
            !el ||
            el.classList.contains("in-view") ||
            el.classList.contains("is-seen")
          ) {
            return;
          }
          if (el.closest("#sec-hero") || el.closest("#sec-cover")) {
            return;
          }
          pending.push(el);
          if (io) {
            io.observe(el);
          } else {
            markIn(el);
          }
        }
        function revealHero() {
          if (heroRevealed) {
            return;
          }
          heroRevealed = true;
          if (hero) {
            hero.classList.add("in-view");
          }
          after(1500, function () {
            openBloom($("hero-bloom"));
          });
        }
        function releaseBottom() {
          if (
            window.innerHeight + window.pageYOffset >=
            doc.documentElement.scrollHeight - 4
          ) {
            pending.slice().forEach(markIn);
          }
        }
        function setupReveal() {
          regions.forEach(function (r) {
            if (r === cover || r === hero) {
              return;
            }
            observe(r);
            $$(".rv, .bloom[data-auto], .gal-item", r).forEach(observe);
          });
          if (!io) {
            regions.forEach(function (r) {
              if (r !== hero && r !== cover) {
                r.classList.add("in-view");
              }
            });
          }
        }
        var coverBtn = $("cover-open");
        var coverBloom = $("cover-bloom");
        var coverBloomWrap = $("cover-bloom-wrap");
        var coverOpened = false;
        var coverMono = $("cover-core-mono");
        if (coverMono) {
          coverMono.textContent = initial(brideName) + "&" + initial(groomName);
        }
        function coverBurst() {
          var fall = $("cover-fall");
          if (!fall || reduceMotion) {
            return;
          }
          var cols = [
            "#8e0f24",
            "#b3192f",
            "#f2c4bd",
            "#6d0a1b",
            "#ec8a74",
            "#fbe6dd",
          ];
          for (var i = 0; i < 34; i++) {
            var s = make("span", "lbp", "cover-burst-" + i, fall);
            var ang = Math.random() * Math.PI * 2,
              dist =
                140 +
                Math.random() *
                  Math.max(window.innerWidth, window.innerHeight) *
                  0.7;
            s.style.setProperty(
              "--dx",
              (Math.cos(ang) * dist).toFixed(0) + "px",
            );
            s.style.setProperty(
              "--dy",
              (Math.sin(ang) * dist).toFixed(0) + "px",
            );
            s.style.setProperty(
              "--r",
              ((Math.random() - 0.5) * 900).toFixed(0) + "deg",
            );
            s.style.setProperty("--c", cols[i % cols.length]);
            s.style.animationDuration =
              (1.1 + Math.random() * 0.9).toFixed(2) + "s";
            s.style.animationDelay = (Math.random() * 0.25).toFixed(2) + "s";
          }
        }
        function openCover() {
          if (coverOpened || !cover) {
            return;
          }
          coverOpened = true;
          audioCtx();
          sfx("whoosh");
          after(260, function () {
            sfx("chord");
          });
          buzz(18);
          startMusic();
          cover.classList.add("is-opening");
          if (coverBloom) {
            openBloom(coverBloom, true);
          }
          after(420, function () {
            if (coverBloom) {
              coverBloom.classList.add("is-burst");
            }
            coverBurst();
          });
          cover.classList.add("is-gone");
          if (reduceMotion) {
            revealHero();
          } else {
            window.setTimeout(revealHero, 650);
          }
          after(1050, function () {
            body.classList.remove("is-locked");
            body.classList.add("is-open-inv");
            syncNav(true);
          });
          var onGone = function (e) {
            if (e && (e.target !== cover || e.propertyName !== "opacity")) {
              return;
            }
            if (cover.classList.contains("is-gone")) {
              cover.style.display = "none";
            }
            cover.removeEventListener("transitionend", onGone);
          };
          cover.addEventListener("transitionend", onGone);
          window.setTimeout(onGone, 2600);
        }
        if (cover && coverBtn) {
          body.classList.add("is-locked");
          coverBtn.addEventListener("click", openCover);
          if (coverBloomWrap) {
            coverBloomWrap.addEventListener("click", openCover);
          }
        } else {
          body.classList.add("is-open-inv");
          revealHero();
        }
        function hasSrc(img) {
          return !!(img && filled(img.getAttribute("src")));
        }
        function hideIfEmpty(ids) {
          ids.forEach(function (id) {
            var el = $(id);
            if (el && !txt(el)) {
              el.style.display = "none";
            }
          });
        }
        function scrollToEl(el) {
          if (!el) {
            return;
          }
          window.scrollTo({
            top: el.getBoundingClientRect().top + window.pageYOffset,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        }
        function nextVisibleAfter(el) {
          var idx = regions.indexOf(el);
          for (var i = idx + 1; i < regions.length; i++) {
            if (isShown(regions[i])) {
              return regions[i];
            }
          }
          return null;
        }
        $$(".sec-lead").forEach(function (p) {
          if (!txt(p)) {
            p.style.display = "none";
          }
        });
        hideIfEmpty([
          "cover-note",
          "hero-tagline",
          "ev-1-note",
          "ev-2-note",
          "loc-note-text",
          "close-msg",
          "close-salam",
          "close-fam",
        ]);
        if ($("loc-note-text") && $("loc-note-text").style.display === "none") {
          $("loc-note").style.display = "none";
        }
        if ($("close-fam") && $("close-fam").style.display === "none") {
          $("close-fam-lbl").style.display = "none";
        }
        var heroPhotoBox = $("hero-arch-photo");
        var heroPhoto = $("hero-photo");
        if (heroPhotoBox && !hasSrc(heroPhoto)) {
          heroPhotoBox.classList.add("no-photo");
        }
        if (heroPhoto) {
          heroPhoto.addEventListener("error", function () {
            heroPhotoBox.classList.add("no-photo");
          });
        }
        if ($("hero-mono-text")) {
          $("hero-mono-text").textContent =
            initial(brideName) + "&" + initial(groomName);
        }
        if (!txt($("hero-time-venue"))) {
          $("hero-time-dot").style.display = "none";
        }
        if ($("hero-cta")) {
          $("hero-cta").addEventListener("click", function () {
            scrollToEl(nextVisibleAfter(hero));
          });
        }
        if ($("hero-bloom-wrap")) {
          $("hero-bloom-wrap").addEventListener("click", function () {
            audioCtx();
            openBloom($("hero-bloom"));
          });
        }
        var dewCard = $("dew-card");
        var dewStage = $("dew-stage");
        var dewTotal = 0,
          dewShown = 0;
        [1, 2, 3].forEach(function (n) {
          var line = $("dew-line-" + n);
          var empty =
            n === 3 ? !txt($("dew-quote")) && !txt($("dew-cite")) : !txt(line);
          if (empty) {
            if (line) {
              line.style.display = "none";
            }
            if ($("dew-" + n)) {
              $("dew-" + n).style.display = "none";
            }
          } else {
            dewTotal++;
          }
        });
        if (!txt($("dew-cite"))) {
          $("dew-cite").style.display = "none";
        }
        function showDewLine(n) {
          var l = $("dew-line-" + n);
          if (
            !l ||
            l.classList.contains("is-shown") ||
            l.style.display === "none"
          ) {
            return;
          }
          l.classList.add("is-shown");
          dewShown++;
          if (dewShown >= dewTotal) {
            if (dewCard) {
              dewCard.classList.add("is-all");
            }
            if (dewStage) {
              dewStage.classList.add("is-done");
            }
          }
        }
        function dropDew(btn, quiet) {
          if (
            !btn ||
            btn.classList.contains("is-fallen") ||
            btn.style.display === "none"
          ) {
            return;
          }
          btn.classList.add("is-fallen");
          if (!quiet) {
            sfx("drop");
          }
          after(720, function () {
            showDewLine(+btn.getAttribute("data-line"));
            if (!quiet) {
              sfx("pluck");
            }
          });
        }
        $$(".dew-drop").forEach(function (b) {
          b.addEventListener("click", function () {
            audioCtx();
            dropDew(b, false);
          });
        });
        if ($("dew-skip")) {
          $("dew-skip").addEventListener("click", function () {
            $$(".dew-drop").forEach(function (b) {
              dropDew(b, true);
            });
          });
        }
        if (dewTotal === 0 && dewCard) {
          dewCard.style.display = "none";
        }
        onSeen("dew-stage", function () {
          [1, 2, 3].forEach(function (n, i) {
            window.setTimeout(
              function () {
                dropDew($("dew-" + n), true);
              },
              reduceMotion ? 0 : 1000 + i * 1300,
            );
          });
        });
        [
          ["b", brideName],
          ["g", groomName],
        ].forEach(function (pair) {
          var k = pair[0];
          var por = $("pc-portrait-" + k),
            img = $("pc-photo-" + k),
            ini = $("pc-initial-" + k);
          if (ini) {
            ini.textContent = initial(pair[1]);
          }
          if (por && !hasSrc(img)) {
            por.classList.add("no-photo");
          }
          if (img) {
            img.addEventListener("error", function () {
              por.classList.add("no-photo");
            });
          }
          var wreath = $("pc-wreath-" + k);
          if (por) {
            por.addEventListener("click", function () {
              audioCtx();
              wreath.classList.remove("is-greeting");
              void wreath.offsetWidth;
              wreath.classList.add("is-greeting");
              [0, 2, 4].forEach(function (n, i) {
                window.setTimeout(function () {
                  sfx("note", n + (k === "g" ? 1 : 0));
                }, i * 110);
              });
              window.setTimeout(function () {
                wreath.classList.remove("is-greeting");
              }, 1300);
            });
          }
          if (!txt($("pc-ig-" + k + "-handle"))) {
            $("pc-ig-" + k).style.display = "none";
          }
          if (!txt($("pc-order-" + k))) {
            $("pc-order-" + k).style.display = "none";
          }
          if (!txt($("pc-par-" + k))) {
            $("pc-parents-" + k).style.display = "none";
          }
          var more = $("pc-more-" + k),
            detail = $("pc-detail-" + k);
          var traitEmpty = !txt($("pc-trait-" + k + "-val"));
          if (traitEmpty) {
            $("pc-trait-" + k).style.display = "none";
          }
          if (!txt($("pc-bio-" + k))) {
            $("pc-bio-" + k).style.display = "none";
          }
          if (traitEmpty && !txt($("pc-bio-" + k))) {
            more.style.display = "none";
          }
          more.addEventListener("click", function () {
            var open = !detail.classList.contains("is-open");
            detail.classList.toggle("is-open", open);
            more.setAttribute("aria-expanded", open ? "true" : "false");
            more.textContent = open ? window.roseTranslate("Tutup lagi") : window.roseTranslate("Kenalan lebih dekat");
            if (open) {
              audioCtx();
              sfx("note", k === "b" ? 3 : 5);
            }
          });
        });
        var storySec = $("sec-story");
        var garden = $("story-garden");
        var vinePath = $("story-vine-path"),
          vineGlow = $("story-vine-glow"),
          vineLeaves = $("story-vine-leaves");
        var vineLen = 0,
          vineLeafEls = [];
        var chapters = window.roseData.story.map(function (_, i) { return i + 1; })
          .map(function (i) {
            return {
              i: i,
              el: $("ch-" + i),
              img: $("ch-" + i + "-img"),
              title: txt($("ch-" + i + "-title")),
              text: txt($("ch-" + i + "-text")),
            };
          })
          .filter(function (c) {
            if (!c.title && !c.text) {
              c.el.style.display = "none";
              return false;
            }
            if (!hasSrc(c.img)) {
              c.el.classList.add("no-photo");
            }
            c.img.addEventListener("error", function () {
              c.el.classList.add("no-photo");
              layoutVine();
            });
            c.img.addEventListener("load", function () {
              layoutVine();
            });
            if (!txt($("ch-" + c.i + "-date"))) {
              $("ch-" + c.i + "-date").style.display = "none";
            }
            if (!c.title) {
              $("ch-" + c.i + "-title").style.display = "none";
            }
            return true;
          });
        if (!chapters.length) {
          hideSection(storySec);
        } else {
          chapters.forEach(function (c, idx) {
            c.el.classList.toggle("ch-right", idx % 2 === 1);
            $("ch-" + c.i + "-num").textContent = pad(idx + 1);
            var b = $("ch-" + c.i + "-bloom");
            b.setAttribute("data-tone", idx % 2 ? "crimson" : "blush");
            b.setAttribute("data-auto", "250");
          });
        }
        function layoutVine() {
          if (!garden || !chapters.length || !vinePath) {
            return;
          }
          var g = garden.getBoundingClientRect();
          if (!g.height) {
            return;
          }
          var pts = chapters.map(function (c) {
            var r = $("ch-" + c.i + "-bloom").getBoundingClientRect();
            return {
              x: r.left - g.left + r.width / 2,
              y: r.top - g.top + r.height / 2,
            };
          });
          var d = "M" + pts[0].x.toFixed(1) + " 0";
          var prev = { x: pts[0].x, y: 0 };
          var all = pts.concat([{ x: pts[pts.length - 1].x, y: g.height }]);
          all.forEach(function (p, i) {
            var dy = p.y - prev.y;
            var sw = (i % 2 ? -1 : 1) * Math.min(46, g.width * 0.12);
            d +=
              " C" +
              (prev.x + sw).toFixed(1) +
              " " +
              (prev.y + dy * 0.35).toFixed(1) +
              " " +
              (p.x - sw).toFixed(1) +
              " " +
              (p.y - dy * 0.35).toFixed(1) +
              " " +
              p.x.toFixed(1) +
              " " +
              p.y.toFixed(1);
            prev = p;
          });
          vinePath.setAttribute("d", d);
          vineGlow.setAttribute("d", d);
          vineLen = vinePath.getTotalLength ? vinePath.getTotalLength() : 0;
          vinePath.style.strokeDasharray = vineLen + " " + vineLen;
          while (vineLeaves.firstChild) {
            vineLeaves.removeChild(vineLeaves.firstChild);
          }
          vineLeafEls = [];
          var count = Math.max(4, Math.round(vineLen / 110));
          for (var i = 1; i < count; i++) {
            var at = i / count;
            var pt = vinePath.getPointAtLength(vineLen * at);
            var pt2 = vinePath.getPointAtLength(
              Math.min(vineLen, vineLen * at + 2),
            );
            var ang =
              (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI +
              (i % 2 ? 60 : -60) +
              90;
            var g2 = svgEl(
              "g",
              {
                transform:
                  "translate(" +
                  pt.x.toFixed(1) +
                  " " +
                  pt.y.toFixed(1) +
                  ") rotate(" +
                  ang.toFixed(1) +
                  ")",
              },
              "sv-leaf-g-" + i,
              vineLeaves,
            );
            var lf = svgEl(
              "path",
              {
                d: "M0 0 C -7 -6 -9 -18 0 -28 C 9 -18 7 -6 0 0 Z",
                class: "sv-leaf",
              },
              "sv-leaf-" + i,
              g2,
            );
            lf.setAttribute("data-at", at.toFixed(3));
            vineLeafEls.push(lf);
          }
          updateVine();
        }
        function updateVine() {
          if (!vineLen || !garden || storySec.style.display === "none") {
            return;
          }
          var r = garden.getBoundingClientRect();
          var prog = reduceMotion
            ? 1
            : clamp(
                (window.innerHeight * 0.62 - r.top) / Math.max(1, r.height),
                0,
                1,
              );
          vinePath.style.strokeDashoffset = (vineLen * (1 - prog)).toFixed(1);
          vineLeafEls.forEach(function (lf) {
            lf.classList.toggle("is-on", prog >= +lf.getAttribute("data-at"));
          });
        }
        var gStage = $("graft-stage"),
          gSide = $("graft-side"),
          gBtn = $("graft-btn"),
          gReset = $("graft-reset");
        var gCert = $("graft-cert"),
          gStatus = $("graft-status"),
          gBloom = $("graft-bloom");
        var gStarted = false,
          gTimers = [];
        var traitsSrc = $("cert-traits-src"),
          traitsList = $("cert-traits");
        if (traitsSrc && traitsList) {
          String(traitsSrc.textContent || "")
            .split(/\n+/)
            .map(function (s) {
              return s.trim();
            })
            .filter(Boolean)
            .forEach(function (t, i) {
              var li = make("li", "", "cert-trait-" + (i + 1), traitsList);
              li.textContent = t;
            });
          if (!traitsList.children.length) {
            $("cert-traits-lbl").style.display = "none";
          }
        }
        if (!txt($("cert-name"))) {
          $("cert-name").textContent =
            "Rosa ‘" + brideName + " & " + groomName + "’";
        }
        if ($("graft-core-text")) {
          $("graft-core-text").textContent =
            initial(groomName) + " × " + initial(brideName);
        }
        function gLater(ms, fn) {
          gTimers.push(window.setTimeout(fn, reduceMotion ? 0 : ms));
        }
        function runGraft() {
          if (gStarted || !gStage) {
            return;
          }
          gStarted = true;
          audioCtx();
          gBtn.disabled = true;
          $("graft-btn-text").textContent = window.roseTranslate("Lagi diokulasi…");
          gStatus.textContent = window.roseTranslate("Dua tangkai didekatkan pelan-pelan…");
          gStage.classList.add("is-joining");
          gLater(950, function () {
            gStage.classList.add("is-tied");
            sfx("zip");
            gStatus.textContent = window.roseTranslate("Diikat pakai pita okulasi…");
          });
          gLater(1900, function () {
            gStage.classList.add("is-grown");
            gStatus.textContent = window.roseTranslate("Tumbuh dari satu akar…");
          });
          gLater(2700, function () {
            openBloom(gBloom);
            gStatus.textContent = window.roseTranslate("Mekar! Varietas baru lahir hari ini.");
          });
          gLater(3500, function () {
            gCert.classList.add("is-stamped");
            sfx("thunk");
            gLater(200, function () {
              sfx("chord");
            });
            buzz(14);
            gSide.classList.add("is-done");
            $("graft-btn-text").textContent = window.roseTranslate("Udah jadi satu ✓");
          });
        }
        function resetGraft() {
          gTimers.forEach(function (t) {
            window.clearTimeout(t);
          });
          gTimers = [];
          gStage.classList.remove("is-joining", "is-tied", "is-grown");
          closeBloom(gBloom);
          gCert.classList.remove("is-stamped");
          gSide.classList.remove("is-done");
          gBtn.disabled = false;
          $("graft-btn-text").textContent = window.roseTranslate("Ikat Jadi Satu");
          gStatus.textContent = window.roseTranslate("Dua tangkai, masih sendiri-sendiri.");
          gStarted = false;
        }
        if (gBtn) {
          gBtn.addEventListener("click", runGraft);
        }
        if (gReset) {
          gReset.addEventListener("click", function () {
            resetGraft();
            window.setTimeout(runGraft, 500);
          });
        }
        onSeen("graft-stage", function () {
          window.setTimeout(
            function () {
              if (!gStarted) {
                runGraft();
              }
            },
            reduceMotion ? 0 : 6500,
          );
        });
        var ghVideo = $("gh-video"),
          gh = $("gh");
        if (!ghVideo || !filled(ghVideo.getAttribute("src"))) {
          hideSection($("sec-video"));
        } else {
          $("gh-play").addEventListener("click", function () {
            gh.classList.add("is-playing");
            var p = ghVideo.play();
            if (p && p.catch) {
              p.catch(function () {
                /* user can press the native control */
              });
            }
          });
          ghVideo.addEventListener("play", function () {
            gh.classList.add("is-playing");
            pauseMusicFor("video");
          });
          ghVideo.addEventListener("pause", function () {
            resumeMusicFrom("video");
          });
          ghVideo.addEventListener("ended", function () {
            resumeMusicFrom("video");
          });
        }
        var sdTicks = $("sd-ticks"),
          sdNum = $("sd-numerals");
        if (sdTicks && sdNum) {
          var ROMAN = [
            "XII",
            "I",
            "II",
            "III",
            "IV",
            "V",
            "VI",
            "VII",
            "VIII",
            "IX",
            "X",
            "XI",
          ];
          for (var ti = 0; ti < 60; ti++) {
            var ang = (ti * 6 * Math.PI) / 180,
              long = ti % 5 === 0;
            var r1 = long ? 122 : 126,
              r2 = 132;
            svgEl(
              "line",
              {
                x1: (150 + Math.sin(ang) * r1).toFixed(1),
                y1: (150 - Math.cos(ang) * r1).toFixed(1),
                x2: (150 + Math.sin(ang) * r2).toFixed(1),
                y2: (150 - Math.cos(ang) * r2).toFixed(1),
                stroke: "#b48a45",
                "stroke-width": long ? 1.6 : 0.7,
              },
              "sd-tick-" + ti,
              sdTicks,
            );
          }
          ROMAN.forEach(function (rn, i) {
            var a = (i * 30 * Math.PI) / 180;
            var tx = svgEl(
              "text",
              {
                x: (150 + Math.sin(a) * 112).toFixed(1),
                y: (155 - Math.cos(a) * 112).toFixed(1),
              },
              "sd-num-" + i,
              sdNum,
            );
            tx.textContent = rn;
          });
        }
        function updateSundial() {
          var now = new Date();
          var deg = ((now.getHours() % 12) + now.getMinutes() / 60) * 30;
          var sg = $("sd-shadow-g");
          if (sg) {
            sg.setAttribute(
              "transform",
              "translate(150 150) rotate(" + deg.toFixed(1) + ")",
            );
          }
          if ($("sundial-now")) {
            $("sundial-now").textContent = fmtTime(now);
          }
        }
        updateSundial();
        window.setInterval(updateSundial, 30000);
        var cdEls = {
          d: $("cd-days"),
          h: $("cd-hours"),
          m: $("cd-mins"),
          s: $("cd-secs"),
        };
        var cdTimer = 0;
        function setNum(el, v) {
          if (!el || el.textContent === v) {
            return;
          }
          el.textContent = v;
          el.classList.remove("is-tick");
          void el.offsetWidth;
          el.classList.add("is-tick");
        }
        function tickCountdown() {
          var now = Date.now(),
            diff = weddingDate.getTime() - now;
          if (diff <= 0) {
            window.clearInterval(cdTimer);
            setNum(cdEls.d, "00");
            setNum(cdEls.h, "00");
            setNum(cdEls.m, "00");
            setNum(cdEls.s, "00");
            $("cd-grid").classList.add("is-done");
            $("cd-done").textContent =
              now - weddingDate.getTime() < 86400000
                ? window.roseTranslate("Hari ini tamannya mekar! Sampai ketemu di sana, ya.")
                : window.roseTranslate("Makasih udah ikut merayakan — kenangannya kami simpan di taman ini selamanya.");
            return;
          }
          var s = Math.floor(diff / 1000);
          setNum(cdEls.d, pad(Math.floor(s / 86400)));
          setNum(cdEls.h, pad(Math.floor((s % 86400) / 3600)));
          setNum(cdEls.m, pad(Math.floor((s % 3600) / 60)));
          setNum(cdEls.s, pad(s % 60));
        }
        function calStamp(d) {
          return (
            d.getFullYear() +
            pad(d.getMonth() + 1) +
            pad(d.getDate()) +
            "T" +
            pad(d.getHours()) +
            pad(d.getMinutes()) +
            "00"
          );
        }
        function utcStamp(d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z"); }
        var ev1End = new Date(weddingDate.getTime() + 2 * 3600000);
        if (!ev1End || isNaN(ev1End.getTime()) || ev1End <= weddingDate) {
          ev1End = new Date(weddingDate.getTime() + 2 * 3600000);
        }
        var venueName = txt($("loc-name")),
          venueAddr = txt($("loc-addr"));
        var ev1Name = txt($("ev-1-name")) || window.roseData.eventType;
        var calTitle = ev1Name + " " + brideName + " & " + groomName;
        var gcal = $("cal-google");
        if (gcal) {
          gcal.href =
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
            encodeURIComponent(calTitle) +
            "&dates=" +
            utcStamp(weddingDate) +
            "/" +
            utcStamp(ev1End) +
            "&ctz=" +
            encodeURIComponent(tzName) +
            "&location=" +
            encodeURIComponent(
              [venueName, venueAddr].filter(Boolean).join(", "),
            ) +
            "&details=" +
            encodeURIComponent(
              window.roseData.message + " — " +
                brideName +
                " & " +
                groomName,
            );
        }
        var icsEvents = [];
        function icsEsc(s) {
          return String(s || "")
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");
        }
        icsEvents.push({
          name: calTitle,
          start: weddingDate,
          end: ev1End,
          loc: [venueName, venueAddr].filter(Boolean).join(", "),
        });
        if ($("cal-ics")) {
          $("cal-ics").addEventListener("click", function () {
            var lines = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "PRODID:-//Taman Mawar Abadi//ID",
              "CALSCALE:GREGORIAN",
            ];
            icsEvents.forEach(function (e, i) {
              lines.push(
                "BEGIN:VEVENT",
                "UID:taman-" + i + "-" + calStamp(e.start) + "@undangan",
                "DTSTAMP:" + utcStamp(new Date()),
                "DTSTART:" + utcStamp(e.start),
                "DTEND:" + utcStamp(e.end),
                "SUMMARY:" + icsEsc(e.name),
                "LOCATION:" + icsEsc(e.loc),
                "BEGIN:VALARM",
                "TRIGGER:-P1D",
                "ACTION:DISPLAY",
                "DESCRIPTION:" + icsEsc(window.roseTranslate("Besok: ") + e.name),
                "END:VALARM",
                "END:VEVENT",
              );
            });
            lines.push("END:VCALENDAR");
            var blob = new Blob([lines.join("\r\n")], {
              type: "text/calendar;charset=utf-8",
            });
            var a = make("a", "", "ics-dl-" + Date.now());
            a.href = URL.createObjectURL(blob);
            a.download =
              "taklifnoma-" +
              brideName.toLowerCase().replace(/[^a-z0-9]+/g, "") +
              "-" +
              groomName.toLowerCase().replace(/[^a-z0-9]+/g, "") +
              ".ics";
            body.appendChild(a);
            a.click();
            window.setTimeout(function () {
              URL.revokeObjectURL(a.href);
              a.remove();
            }, 800);
            toast(window.roseTranslate("Pengingatnya lagi diunduh ✿"));
          });
        }
        function placeLink(placeId, name, addr) {
          if (window.roseData.venue.mapUrl) return window.roseData.venue.mapUrl;
          if (filled(placeId)) {
            return (
              "https://www.google.com/maps/dir/?api=1&destination=Destination&travelmode=driving&destination_place_id=" +
              encodeURIComponent(placeId)
            );
          }
          return (
            "https://www.google.com/maps/search/?api=1&query=" +
            encodeURIComponent([name, addr].filter(Boolean).join(", "))
          );
        }
        var PLACE_ID = "";
        $("ev-1-date").textContent = fmtLong(weddingDate);
        $("ev-1-time").textContent = fmtTime(weddingDate);
        $("ev-1-range").textContent =
          fmtTime(weddingDate) + " – " + fmtTime(ev1End) + " " + tzLabel;
        $("ev-1-map").href = placeLink(PLACE_ID, venueName, venueAddr);
        $("ev-1-bloom").setAttribute("data-auto", "450");
        if (!txt($("ev-1-name"))) {
          $("ev-1-name").textContent = window.roseData.eventType;
        }
        var ev2 = $("ev-2");
        if (!txt($("ev-2-name"))) {
          ev2.style.display = "none";
        } else {
          var e2d = $("ev-2-date");
          var e2date = e2d.getAttribute("data-date"),
            e2start = e2d.getAttribute("data-start"),
            e2end = e2d.getAttribute("data-end");
          var e2 =
            parseLocal(filled(e2date) ? e2date : "", e2start) ||
            weddingDate;
          e2d.textContent = fmtLong(e2);
          $("ev-2-time").textContent = filled(fmtHM(e2start))
            ? fmtHM(e2start)
            : "—";
          $("ev-2-range").textContent = fmtHM(e2start)
            ? fmtHM(e2start) +
              (fmtHM(e2end) ? " – " + fmtHM(e2end) : " – selesai") +
              " " +
              tzLabel
            : "";
          var e2venue = txt($("ev-2-venue")) || venueName,
            e2addr = txt($("ev-2-addr")) || venueAddr;
          if (!txt($("ev-2-venue"))) {
            $("ev-2-venue").textContent = venueName;
          }
          if (!txt($("ev-2-addr"))) {
            $("ev-2-addr").textContent = venueAddr;
          }
          var sameVenue = e2addr === venueAddr;
          $("ev-2-map").href = sameVenue
            ? placeLink(PLACE_ID, venueName, venueAddr)
            : placeLink("", e2venue, e2addr);
          $("ev-2-bloom").setAttribute("data-auto", "650");
          var e2endD = parseLocal(
            filled(e2date) ? e2date : "",
            e2end,
          );
          if (!e2endD || e2endD <= e2) {
            e2endD = new Date(e2.getTime() + 2.5 * 3600000);
          }
          icsEvents.push({
            name: txt($("ev-2-name")) + " " + brideName + " & " + groomName,
            start: e2,
            end: e2endD,
            loc: [e2venue, e2addr].filter(Boolean).join(", "),
          });
        }
        [1, 2].forEach(function (n) {
          var bw = $("ev-" + n + "-bw");
          if (bw) {
            bw.addEventListener("click", function () {
              audioCtx();
              openBloom($("ev-" + n + "-bloom"));
            });
          }
        });
        var liveLink = $("ev-live-link");
        var liveHref = liveLink ? liveLink.getAttribute("href") : "";
        if (!filled(liveHref)) {
          $("ev-live").style.display = "none";
        } else {
          var yt =
            /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/.exec(
              liveHref,
            );
          if (yt) {
            var fr = make("iframe", "", "ev-live-iframe", $("ev-live-frame"));
            fr.src = "https://www.youtube.com/embed/" + yt[1];
            fr.title = "Siaran langsung";
            fr.setAttribute(
              "allow",
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            );
            fr.setAttribute("allowfullscreen", "");
            fr.loading = "lazy";
          }
        }
        var RD_ICONS = {
          heart:
            "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
          users:
            "M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20c0-3 3-5 6-5s6 2 6 5M12 20c0-3 2-5 5-5s5 2 5 5",
          utensils: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 3c-2 2-2 6 0 8v10",
          camera: "M4 8h3l2-3h6l2 3h3v11H4zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
          mic2: "M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4",
          cake: "M4 20h16v-8H4zM4 15c2 1 4 1 6 0s4-1 6 0 3 1 4 0M12 12V8M12 6a1 1 0 1 0 0-2",
          music:
            "M9 18V6l10-2v12M9 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM19 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z",
          gift: "M4 10h16v10H4zM2 7h20v3H2zM12 7v13M12 7c-2-4-6-3-5 0M12 7c2-4 6-3 5 0",
          "party-popper": "M4 20l5-12 7 7zM14 4l1 3M19 6l-2 2M20 11l-3 0",
          sparkles:
            "M12 3l1.6 5L19 10l-5.4 2L12 17l-1.6-5L5 10l5.4-2zM19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z",
          flower2:
            "M12 14a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 8c0-3 3-5 3-5M12 14v7M9 11c-3 0-5-2-5-2M15 11c3 0 5-2 5-2",
          home: "M3 11l9-7 9 7v9H3zM9 20v-6h6v6",
          car: "M3 16v-4l2-5h14l2 5v4zM7 16v2M17 16v2M3 12h18",
          shirt: "M8 3l4 3 4-3 5 4-3 3v11H6V10L3 7z",
          clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
          star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.5 2.9 1-6.1-4.4-4.3 6.1-.9z",
        };
        var rundownItems = [];
        try {
          rundownItems = JSON.parse(
            ($("wedivo-rundown-data") || {}).textContent || "[]",
          );
        } catch (e) {
          rundownItems = [];
        }
        if (!Array.isArray(rundownItems)) {
          rundownItems = [];
        }
        rundownItems = rundownItems.filter(function (it) {
          return it && (filled(it.title) || filled(it.startTime));
        });
        var rdEls = [];
        if (!rundownItems.length) {
          hideSection($("sec-rundown"));
        } else {
          var rdList = $("rd-list");
          var dates = [];
          rundownItems.forEach(function (it) {
            if (it.date && dates.indexOf(it.date) < 0) {
              dates.push(it.date);
            }
          });
          var multi = dates.length > 1,
            lastDate = null;
          var rdcDots = $("rdc-dots"),
            rdcTicks = $("rdc-ticks"),
            rdcPetals = $("rdc-petals");
          for (var hh = 0; hh < 12; hh++) {
            var ha = (hh * 30 * Math.PI) / 180;
            svgEl(
              "line",
              {
                x1: (120 + Math.sin(ha) * 100).toFixed(1),
                y1: (120 - Math.cos(ha) * 100).toFixed(1),
                x2: (120 + Math.sin(ha) * 108).toFixed(1),
                y2: (120 - Math.cos(ha) * 108).toFixed(1),
                class: "rdc-tick",
              },
              "rdc-tick-" + hh,
              rdcTicks,
            );
            var pg = svgEl(
              "g",
              {
                transform: "translate(120 120) rotate(" + (hh * 30 + 15) + ")",
              },
              "rdc-pg-" + hh,
              rdcPetals,
            );
            svgEl(
              "path",
              {
                d: "M0 -40 C -12 -52 -10 -74 0 -82 C 10 -74 12 -52 0 -40 Z",
                class: "rdc-petal",
              },
              "rdc-petal-" + hh,
              pg,
            );
          }
          rundownItems.forEach(function (it, i) {
            if (multi && it.date !== lastDate) {
              lastDate = it.date;
              var dd = parseLocal(it.date, "00:00");
              var h = make("p", "rd-day rv", "rd-day-" + i, rdList);
              h.textContent = dd ? fmtLong(dd) : it.date;
            }
            var card = make("div", "rd-item card rv", "rd-item-" + i, rdList);
            card.style.setProperty("--d", "0s");
            var bl = make("span", "bloom", "rd-bloom-" + i, card);
            bl.setAttribute("data-preset", "mini");
            bl.setAttribute("data-tone", i % 2 ? "crimson" : "blush");
            bl.setAttribute("data-auto", "350");
            var core = make("span", "bloom-core", "rd-core-" + i, bl);
            var icoSvg = svgEl(
              "svg",
              { viewBox: "0 0 24 24", class: "rd-ico", "aria-hidden": "true" },
              "rd-ico-" + i,
              core,
            );
            svgEl(
              "path",
              { d: RD_ICONS[it.icon] || RD_ICONS.flower2 },
              "rd-ico-p-" + i,
              icoSvg,
            );
            buildBloom(bl);
            var bd = make("div", "rd-body", "rd-body-" + i, card);
            var tm = make("p", "rd-time", "rd-time-" + i, bd);
            tm.textContent = it.isAllDay
              ? window.roseTranslate("Sepanjang hari")
              : fmtHM(it.startTime) +
                (fmtHM(it.endTime) ? " – " + fmtHM(it.endTime) : "");
            var tl = make("p", "rd-title", "rd-title-" + i, bd);
            tl.textContent = it.title || "";
            if (filled(it.location)) {
              var lc = make("p", "rd-loc", "rd-loc-" + i, bd);
              lc.textContent = "⌖ " + it.location;
            }
            if (filled(it.description)) {
              var ds = make("p", "rd-desc", "rd-desc-" + i, bd);
              ds.textContent = it.description;
            }
            var angDeg = 0,
              hasT = false;
            var mt = /^(\d{1,2}):(\d{2})/.exec(String(it.startTime || ""));
            if (mt && !it.isAllDay) {
              hasT = true;
              angDeg = ((+mt[1] % 12) + +mt[2] / 60) * 30;
              var ar = (angDeg * Math.PI) / 180;
              svgEl(
                "circle",
                {
                  cx: (120 + Math.sin(ar) * 96).toFixed(1),
                  cy: (120 - Math.cos(ar) * 96).toFixed(1),
                  r: 5,
                  class: "rdc-dot",
                },
                "rdc-dot-" + i,
                rdcDots,
              );
            }
            rdEls.push({
              el: card,
              dot: hasT ? $("rdc-dot-" + i) : null,
              ang: angDeg,
              label: tm.textContent,
              title: it.title || "",
            });
          });
        }
        var rdCurrent = -1;
        function updateRundownActive() {
          if (!rdEls.length) {
            return;
          }
          var line = window.innerHeight * 0.5,
            best = -1,
            bestD = 1e9;
          rdEls.forEach(function (r, i) {
            var b = r.el.getBoundingClientRect();
            var dd = Math.abs(b.top + b.height / 2 - line);
            if (dd < bestD && b.bottom > 0 && b.top < window.innerHeight) {
              bestD = dd;
              best = i;
            }
          });
          if (best === rdCurrent || best < 0) {
            return;
          }
          if (rdCurrent >= 0) {
            rdEls[rdCurrent].el.classList.remove("is-current");
            if (rdEls[rdCurrent].dot) {
              rdEls[rdCurrent].dot.classList.remove("is-active");
            }
          }
          rdCurrent = best;
          var cur = rdEls[best];
          cur.el.classList.add("is-current");
          if (cur.dot) {
            cur.dot.classList.add("is-active");
          }
          $("rdc-hand-g").setAttribute(
            "transform",
            "translate(120 120) rotate(" + cur.ang.toFixed(1) + ")",
          );
          $("rd-clock-time").textContent = cur.label.split(" – ")[0];
          $("rd-clock-title").textContent = cur.title;
        }
        var MAPS_KEY = "";
        var locIframe = $("loc-iframe");
        var locIframeSet = false;
        function setLocTab(real) {
          $("loc-tab-art").classList.toggle("is-active", !real);
          $("loc-tab-real").classList.toggle("is-active", real);
          $("loc-tab-art").setAttribute(
            "aria-selected",
            real ? "false" : "true",
          );
          $("loc-tab-real").setAttribute(
            "aria-selected",
            real ? "true" : "false",
          );
          $("loc-panel-art").classList.toggle("is-active", !real);
          $("loc-panel-real").classList.toggle("is-active", real);
          if (real && !locIframeSet && locIframe) {
            locIframeSet = true;
            locIframe.src =
              filled(MAPS_KEY) && filled(PLACE_ID)
                ? locIframe.getAttribute("data-src")
                : "https://www.google.com/maps?q=" +
                  encodeURIComponent(
                    window.roseData.mapQuery || [venueName, venueAddr].filter(Boolean).join(", "),
                  ) +
                  "&output=embed";
          }
        }
        if ($("loc-tab-art")) {
          $("loc-tab-art").addEventListener("click", function () {
            setLocTab(false);
          });
          $("loc-tab-real").addEventListener("click", function () {
            setLocTab(true);
          });
        }
        if ($("loc-dir")) {
          $("loc-dir").href = placeLink(PLACE_ID, venueName, venueAddr);
        }
        if ($("loc-copy")) {
          $("loc-copy").addEventListener("click", function () {
            copyText(
              [venueName, venueAddr].filter(Boolean).join(", "),
              window.roseTranslate("Alamatnya udah disalin ✿"),
            );
          });
        }
        var gmRoses = $("gm-roses");
        if (gmRoses) {
          var ROSE_SPOTS = [
            [240, 238],
            [258, 252],
            [246, 262],
            [262, 236],
            [100, 52],
            [118, 66],
            [106, 72],
            [292, 112],
            [306, 126],
            [210, 176],
            [236, 186],
            [262, 174],
            [290, 186],
            [30, 128],
            [62, 132],
            [94, 126],
            [48, 50],
            [48, 82],
            [218, 230],
            [218, 262],
          ];
          var RC = ["#8e0f24", "#b3192f", "#f0b9b0", "#e9867b", "#fbe6dd"];
          ROSE_SPOTS.forEach(function (s, i) {
            svgEl(
              "circle",
              {
                cx: s[0],
                cy: s[1],
                r: 3.2 + (i % 3) * 0.8,
                fill: RC[i % RC.length],
                class: "gm-rose",
              },
              "gm-rose-" + i,
              gmRoses,
            );
          });
        }
        var gmRoute = $("gm-route"),
          gmWalker = $("gm-walker");
        var walkOn = false,
          walkT0 = 0,
          walkLen =
            gmRoute && gmRoute.getTotalLength ? gmRoute.getTotalLength() : 0;
        function walkFrame(now) {
          if (!walkOn || !walkLen) {
            return;
          }
          if (!walkT0) {
            walkT0 = now;
          }
          var cyc = 7000,
            t = ((now - walkT0) % (cyc + 1600)) / cyc;
          var u = smooth01(Math.min(1, t));
          var pt = gmRoute.getPointAtLength(walkLen * u);
          gmWalker.setAttribute(
            "transform",
            "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")",
          );
          window.requestAnimationFrame(walkFrame);
        }
        if (gmWalker && walkLen) {
          var endPt = gmRoute.getPointAtLength(reduceMotion ? walkLen : 0);
          gmWalker.setAttribute(
            "transform",
            "translate(" + endPt.x.toFixed(1) + " " + endPt.y.toFixed(1) + ")",
          );
          if (!reduceMotion && "IntersectionObserver" in window) {
            new IntersectionObserver(
              function (en) {
                var vis = en[0].isIntersecting;
                if (vis && !walkOn) {
                  walkOn = true;
                  walkT0 = 0;
                  window.requestAnimationFrame(walkFrame);
                }
                if (!vis) {
                  walkOn = false;
                }
              },
              { threshold: 0.1 },
            ).observe($("garden-map"));
          }
        }
        var dcSws = $$(".dc-sw").filter(function (sw) {
          var c = String(sw.getAttribute("data-color") || "").trim();
          if (!validColor(c)) {
            sw.style.display = "none";
            return false;
          }
          sw.style.setProperty("--c", c);
          var rose = sw.querySelector(".dc-sw-rose");
          for (var i = 0; i < 7; i++) {
            var pe = make("i", "", sw.id + "-pt-" + i, rose);
            pe.style.setProperty("--a", i * (360 / 7) + "deg");
            pe.style.setProperty("--s", i % 2 ? ".86" : "1");
          }
          var core = make("i", "", sw.id + "-pt-core", rose);
          core.style.setProperty("--a", "0deg");
          core.style.setProperty("--s", ".5");
          var nm = sw.querySelector(".dc-sw-name");
          if (!txt(nm)) {
            nm.textContent = c.toUpperCase();
          }
          return true;
        });
        if (!dcSws.length) {
          $("dc-grid").style.display = "none";
          if (!txt($("dresscode-lead"))) {
            hideSection($("sec-dresscode"));
          }
        }
        var dcCurrent = null;
        function pickDress(sw, quiet) {
          if (!sw || sw === dcCurrent) {
            return;
          }
          var c = sw.getAttribute("data-color").trim();
          dcSws.forEach(function (s) {
            s.classList.toggle("is-active", s === sw);
          });
          ["dress", "suit"].forEach(function (k) {
            var base = $("dc-" + k + "-base"),
              wash = $("dc-" + k + "-wash");
            base.setAttribute("fill", wash.getAttribute("fill"));
            wash.classList.remove("is-grow");
            wash.classList.add("is-reset");
            wash.setAttribute("fill", c);
            void wash.getBoundingClientRect();
            wash.classList.remove("is-reset");
            wash.classList.add("is-grow");
          });
          dcCurrent = sw;
          $("dc-picked-lbl").textContent = window.roseTranslate("Pilihanmu:");
          $("dc-picked-name").textContent = txt(
            sw.querySelector(".dc-sw-name"),
          );
          if (!quiet) {
            sfx("note", dcSws.indexOf(sw) + 2);
          }
        }
        dcSws.forEach(function (sw) {
          sw.addEventListener("click", function () {
            audioCtx();
            pickDress(sw, false);
          });
        });
        onSeen("dc-stage", function () {
          after(500, function () {
            if (!dcCurrent && dcSws[0]) {
              pickDress(dcSws[0], true);
            }
          });
        });
        var RL_DEF = ["#9e1229", "#f1b9b0", "#f4ead8", "#ef9f7c"];
        var rlRoses = [],
          rlOpened = 0;
        [1, 2, 3, 4].forEach(function (n) {
          var rose = $("rl-rose-" + n),
            entry = $("rl-entry-" + n);
          var name = txt($("rl-name-" + n + "-t")),
            meaning = txt($("rl-meaning-" + n));
          if (!name && !meaning) {
            rose.style.display = "none";
            entry.style.display = "none";
            return;
          }
          if (!txt($("rl-story-" + n))) {
            $("rl-story-" + n).style.display = "none";
          }
          var c = String(rose.getAttribute("data-color") || "").trim();
          if (!validColor(c)) {
            c = RL_DEF[n - 1];
          }
          $("rl-chip-" + n).style.setProperty("--c", c);
          buildBloom($("rl-bloom-" + n), { color: c, offset: n * 9 });
          rose.setAttribute("aria-label", window.roseTranslate("Mawar ") + (name || meaning));
          rlRoses.push({
            n: n,
            rose: rose,
            entry: entry,
            bloom: $("rl-bloom-" + n),
            opened: false,
          });
        });
        var RL_POS = {
          1: [[50, 24]],
          2: [
            [32, 24],
            [68, 24],
          ],
          3: [
            [30, 28],
            [70, 28],
            [50, 12],
          ],
          4: [
            [33, 26],
            [67, 24],
            [50, 12],
            [50, 42],
          ],
        };
        if (!rlRoses.length) {
          hideSection($("sec-roselang"));
        } else {
          (RL_POS[rlRoses.length] || RL_POS[4]).forEach(function (p, i) {
            rlRoses[i].rose.style.left = p[0] + "%";
            rlRoses[i].rose.style.top = p[1] + "%";
          });
          $("rl-count-t").textContent = String(rlRoses.length);
          rlRoses.forEach(function (r, idx) {
            r.rose.addEventListener("click", function () {
              audioCtx();
              r.rose.classList.add("is-open");
              openBloom(r.bloom, true);
              sfx("note", idx * 2);
              rlRoses.forEach(function (o) {
                o.rose.classList.toggle("is-current", o === r);
                o.entry.classList.toggle("is-current", o === r);
              });
              $("rl-entries").classList.add("has-entry");
              if (!r.opened) {
                r.opened = true;
                rlOpened++;
                $("rl-count-n").textContent = String(rlOpened);
                $("rl-progress-bar").style.width =
                  (rlOpened / rlRoses.length) * 100 + "%";
                if (rlOpened === rlRoses.length) {
                  window.setTimeout(function () {
                    $("rl-bouquet").classList.add("is-complete");
                    $("rl-dict").classList.add("is-complete");
                    sfx("chord");
                    buzz(12);
                  }, 700);
                }
              }
            });
          });
        }
        var galleryUrls = window.roseData.gallery.map(function (photo) { return photo.src; }).filter(Boolean);
        var galGrid = $("gal-grid");
        if (!galleryUrls.length) {
          hideSection($("sec-gallery"));
        } else {
          galleryUrls.forEach(function (url, i) {
            var b = make("button", "gal-item", "gal-item-" + (i + 1), galGrid);
            b.type = "button";
            b.setAttribute("aria-label", window.roseTranslate("Buka foto ") + (i + 1));
            b.style.setProperty("--d", ((i % 4) * 0.09).toFixed(2) + "s");
            var im = make("img", "", "gal-img-" + (i + 1), b);
            im.src = url;
            im.alt = window.roseData.gallery[i].alt || "";
            b.dataset.itemId = window.roseData.gallery[i].id;
            im.loading = "lazy";
            var nn = make("span", "gal-n", "gal-n-" + (i + 1), b);
            nn.textContent = window.roseTranslate("Kelopak ") + pad(i + 1);
            b.addEventListener("click", function () {
              audioCtx();
              showViewer(i);
            });
          });
        }
        var lb = $("lb"),
          lbImg = $("lb-img"),
          lbCount = $("lb-count"),
          lbPetals = $("lb-petals");
        var lbIndex = 0,
          lbOpen = false;
        function lbBurst() {
          if (reduceMotion || !lbPetals) {
            return;
          }
          while (lbPetals.firstChild) {
            lbPetals.removeChild(lbPetals.firstChild);
          }
          var cols = ["#8e0f24", "#f2c4bd", "#b3192f", "#fbe6dd", "#ec8a74"];
          for (var i = 0; i < 18; i++) {
            var s = make("span", "lbp", "lb-petal-" + i, lbPetals);
            var a = (i / 18) * Math.PI * 2,
              d = 160 + Math.random() * 220;
            s.style.setProperty("--dx", (Math.cos(a) * d).toFixed(0) + "px");
            s.style.setProperty("--dy", (Math.sin(a) * d).toFixed(0) + "px");
            s.style.setProperty(
              "--r",
              ((Math.random() - 0.5) * 720).toFixed(0) + "deg",
            );
            s.style.setProperty("--c", cols[i % cols.length]);
          }
        }
        function setViewer(i, swap) {
          lbIndex = (i + galleryUrls.length) % galleryUrls.length;
          var apply = function () {
            lbImg.src = galleryUrls[lbIndex];
            lbImg.alt = window.roseData.gallery[lbIndex].alt || "";
            lbCount.textContent =
              window.roseTranslate("Kelopak ") + (lbIndex + 1) + window.roseTranslate(" dari ") + galleryUrls.length;
          };
          if (swap && !reduceMotion) {
            lbImg.classList.add("is-swap");
            window.setTimeout(function () {
              apply();
              var done = function () {
                lbImg.classList.remove("is-swap");
              };
              if (lbImg.complete) {
                window.setTimeout(done, 30);
              } else {
                lbImg.addEventListener("load", done, { once: true });
                lbImg.addEventListener("error", done, { once: true });
              }
            }, 200);
          } else {
            apply();
          }
        }
        function showViewer(i) {
          if (!galleryUrls.length) {
            return;
          }
          setViewer(i, false);
          lb.classList.toggle("is-single", galleryUrls.length <= 1);
          lb.classList.add("is-open");
          lb.setAttribute("aria-hidden", "false");
          body.classList.add("is-locked");
          lbOpen = true;
          lbBurst();
          sfx("bloom");
          $("lb-close").focus({ preventScroll: true });
        }
        function closeViewer() {
          if (!lbOpen) {
            return;
          }
          lbOpen = false;
          lb.classList.remove("is-open");
          lb.setAttribute("aria-hidden", "true");
          if (!navExpanded) {
            body.classList.remove("is-locked");
          }
        }
        $("lb-prev").addEventListener("click", function () {
          setViewer(lbIndex - 1, true);
        });
        $("lb-next").addEventListener("click", function () {
          setViewer(lbIndex + 1, true);
        });
        $("lb-close").addEventListener("click", closeViewer);
        $("lb-backdrop").addEventListener("click", closeViewer);
        var swipeX = null;
        $("lb-figure").addEventListener(
          "touchstart",
          function (e) {
            swipeX = e.touches[0].clientX;
          },
          { passive: true },
        );
        $("lb-figure").addEventListener("touchend", function (e) {
          if (swipeX === null) {
            return;
          }
          var dx = e.changedTouches[0].clientX - swipeX;
          swipeX = null;
          if (Math.abs(dx) > 40 && galleryUrls.length > 1) {
            setViewer(lbIndex + (dx < 0 ? 1 : -1), true);
          }
        });
        var grs = [1, 2, 3, 4, 5, 6, 7].map(function (n) {
          return $("gr-" + n);
        });
        var grCount = 0;
        var giftBouquet = $("gift-bouquet");
        function setRoses(n, stagger) {
          n = clamp(n, 0, grs.length);
          grs.forEach(function (g, i) {
            if (i < n && !g.classList.contains("is-in")) {
              window.setTimeout(
                function () {
                  g.classList.add("is-in");
                },
                stagger ? (i - grCount) * 140 : 0,
              );
            }
          });
          grCount = n;
          $("gift-count-n").textContent = String(n);
          if (n >= grs.length) {
            giftBouquet.classList.add("is-full");
          }
        }
        onSeen("gift-stage", function () {
          after(300, function () {
            if (grCount < 3) {
              setRoses(3, true);
            }
          });
        });
        giftBouquet.addEventListener("click", function () {
          audioCtx();
          giftBouquet.classList.remove("is-wiggle");
          void giftBouquet.offsetWidth;
          giftBouquet.classList.add("is-wiggle");
          if (grCount < grs.length) {
            setRoses(grCount + 1, false);
            sfx("note", grCount);
            if (grCount === grs.length) {
              window.setTimeout(function () {
                sfx("chord");
              }, 200);
            }
          } else {
            sfx("pluck");
          }
        });
        var giftForm = $("gift-form");
        if (giftForm && "MutationObserver" in window) {
          new MutationObserver(function () {
            if (
              giftForm.classList.contains("is-submitted") &&
              grCount < grs.length
            ) {
              setRoses(grs.length, true);
              window.setTimeout(function () {
                sfx("chord");
                buzz(16);
              }, 500);
            }
          }).observe(giftForm, {
            attributes: true,
            attributeFilter: ["class"],
          });
        }
        if (!txt($("gift-addr-text"))) {
          $("gift-address").style.display = "none";
        }
        $("gift-copy").addEventListener("click", function () {
          copyText(
            txt($("gift-addr-text")),
            window.roseTranslate("Alamat kirim kado udah disalin ✿"),
          );
        });
        var candleRow = $("candle-row"),
          candleCap = $("candle-caption");
        var paxInput = $("rsvp-pax"),
          statusBox = $("rsvp-status");
        var CANDLE_H = [96, 118, 84, 108, 92];
        var lastCandleKey = "",
          candleEls = [];
        function currentStatus() {
          var sel = statusBox ? statusBox.querySelector(".is-selected") : null;
          return sel ? sel.getAttribute("data-wedivo-status") : "";
        }
        function buildCandles(n, plus) {
          while (candleRow.firstChild) {
            candleRow.removeChild(candleRow.firstChild);
          }
          candleEls = [];
          for (var i = 0; i < n; i++) {
            var c = make("span", "candle", "candle-" + i, candleRow);
            c.style.setProperty("--h", CANDLE_H[i % CANDLE_H.length] + "px");
            make("span", "candle-halo", "candle-" + i + "-halo", c);
            make("span", "candle-body", "candle-" + i + "-body", c);
            make("span", "candle-wick", "candle-" + i + "-wick", c);
            make("span", "candle-flame", "candle-" + i + "-flame", c);
            make("span", "candle-smoke", "candle-" + i + "-smoke", c);
            candleEls.push(c);
            (function (el, k) {
              window.setTimeout(
                function () {
                  el.classList.add("is-in");
                },
                40 + k * 90,
              );
            })(c, i);
          }
          if (plus > 0) {
            var pl = make("span", "candle-plus", "candle-plus", candleRow);
            pl.textContent = "+" + plus;
          }
        }
        function renderCandles() {
          if (!candleRow) {
            return;
          }
          var st = currentStatus();
          var pax = 1;
          var n = st === "attending" ? Math.min(pax, 5) : st ? 1 : 3;
          var plus = st === "attending" && pax > 5 ? pax - 5 : 0;
          var key = st + "|" + n + "|" + plus;
          if (key === lastCandleKey) {
            return;
          }
          var prevStatus = lastCandleKey.split("|")[0];
          lastCandleKey = key;
          buildCandles(n, plus);
          window.setTimeout(function () {
            candleEls.forEach(function (c, i) {
              if (st === "attending") {
                window.setTimeout(
                  function () {
                    c.classList.add("is-lit");
                    if (i === 0 && prevStatus !== "attending") {
                      sfx("match");
                    }
                  },
                  260 + i * 180,
                );
              } else if (st === "maybe") {
                c.classList.add("is-weak");
              } else if (st === "not_attending") {
                c.classList.add("is-smoke");
              }
            });
          }, 120);
          var who = (($("rsvp-name") || {}).value || "").trim();
          if (st === "attending") {
            candleCap.textContent =
              (who ? who + ": " : "") +
              (pax > 1 ? pax + " lilin" : window.roseTranslate("Satu lilin")) +
              window.roseTranslate(" kami nyalakan buat kamu") +
              (pax > 1 ? " dan rombongan." : ".");
          } else if (st === "maybe") {
            candleCap.textContent =
              window.roseTranslate("Lilinnya kami nyalakan kecil dulu, ya — sambil nunggu kabar baik dari kamu.");
          } else if (st === "not_attending") {
            candleCap.textContent =
              window.roseTranslate("Nggak apa-apa banget. Asapnya kami titipin doa, semoga kita ketemu di lain waktu.");
          } else {
            candleCap.textContent =
              window.roseTranslate("Pilih jawabanmu — nanti lilinnya ikut ngerespons.");
          }
        }
        if (statusBox && "MutationObserver" in window) {
          new MutationObserver(renderCandles).observe(statusBox, {
            attributes: true,
            subtree: true,
            attributeFilter: ["class"],
          });
        }
        if (statusBox) {
          statusBox.addEventListener("click", function () {
            audioCtx();
            window.setTimeout(renderCandles, 30);
          });
        }
        if (paxInput) {
          paxInput.addEventListener("input", renderCandles);
        }
        renderCandles();
        var dlEl = $("rsvp-dl-val");
        var dlDate = dlEl
          ? parseLocal(dlEl.getAttribute("data-date"), "00:00")
          : null;
        if (dlDate) {
          dlEl.textContent = fmtLong(dlDate);
        } else if ($("rsvp-deadline")) {
          $("rsvp-deadline").style.display = "none";
        }
        var wishMsg = $("wish-msg"),
          wishList = $("wish-list"),
          wishCount = $("wish-count-n");
        $$(".wish-chip").forEach(function (chip) {
          chip.addEventListener("click", function () {
            if (!wishMsg) {
              return;
            }
            wishMsg.value = chip.getAttribute("data-text");
            wishMsg.dispatchEvent(new Event("input", { bubbles: true }));
            $$(".wish-chip").forEach(function (c) {
              c.classList.toggle("is-used", c === chip);
            });
            audioCtx();
            sfx("pluck");
            wishMsg.focus({ preventScroll: true });
          });
        });
        function updateWishCount() {
          if (!wishList || !wishCount) {
            return;
          }
          var n = $$(".wish-card", wishList).length;
          wishCount.textContent = String(n);
          $("wish-count").lastChild.textContent = n
            ? window.roseTranslate(" doa udah tumbuh di dinding ini")
            : window.roseTranslate(" doa — jadi yang pertama gantung doa di sini, yuk");
        }
        if (wishList && "MutationObserver" in window) {
          new MutationObserver(updateWishCount).observe(wishList, {
            childList: true,
            subtree: true,
          });
        }
        updateWishCount();
        var hashBtn = $("close-hashtag");
        if (hashBtn) {
          if (!txt($("close-hashtag-t"))) {
            hashBtn.style.display = "none";
          }
          hashBtn.addEventListener("click", function () {
            copyText(
              txt($("close-hashtag-t")),
              "Tagarnya udah disalin — jangan lupa dipakai, ya!",
            );
          });
        }
        if ($("close-top")) {
          $("close-top").addEventListener("click", function () {
            audioCtx();
            sfx("chord");
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
          });
        }
        var nav = $("garden-nav"),
          rail = $("nav-rail"),
          navExpandBtn = $("nav-expand"),
          navBackdrop = $("nav-backdrop");
        var navExpanded = false,
          activeId = "",
          navLockUntil = 0,
          centerTimer = 0;
        function sectionById(id) {
          return doc.querySelector('[data-section="' + id + '"]');
        }
        function centerActive(now) {
          if (!rail || navExpanded) {
            return;
          }
          var item = rail.querySelector(".nav-item.is-active");
          if (!item || rail.scrollWidth <= rail.clientWidth + 1) {
            return;
          }
          var rr = rail.getBoundingClientRect(),
            ir = item.getBoundingClientRect();
          var target =
            rail.scrollLeft +
            (ir.left - rr.left - rail.clientLeft) -
            (rail.clientWidth - ir.width) / 2;
          target = clamp(target, 0, rail.scrollWidth - rail.clientWidth);
          if (Math.abs(target - rail.scrollLeft) <= 2) {
            return;
          }
          rail.scrollTo({
            left: target,
            behavior: reduceMotion || now === "jump" ? "auto" : "smooth",
          });
        }
        function setActive(id, immediate) {
          if (!id || id === activeId) {
            return;
          }
          activeId = id;
          $$(".nav-item", rail).forEach(function (it) {
            it.classList.toggle(
              "is-active",
              it.getAttribute("data-nav-target") === id,
            );
          });
          window.clearTimeout(centerTimer);
          if (immediate) {
            centerActive();
          } else {
            centerTimer = window.setTimeout(centerActive, 180);
          }
        }
        function computeActive() {
          var line = window.innerHeight * 0.35,
            id = "";
          for (var i = 0; i < timeline.length; i++) {
            if (timeline[i].el.getBoundingClientRect().top <= line) {
              id = timeline[i].id;
            }
          }
          if (!id && timeline.length) {
            id = timeline[0].id;
          }
          return id;
        }
        function syncNav(force) {
          if (!force && performance.now() < navLockUntil) {
            return;
          }
          setActive(computeActive(), !!force);
        }
        function setExpanded(on) {
          navExpanded = on;
          nav.classList.toggle("is-expanded", on);
          navExpandBtn.setAttribute("aria-expanded", on ? "true" : "false");
          $("nav-expand-t").textContent = on ? window.roseTranslate("Tutup") : window.roseTranslate("Peta");
          navBackdrop.classList.toggle("is-on", on);
          if (on) {
            body.classList.add("is-locked");
            sfx("pluck");
          } else if (!lbOpen) {
            body.classList.remove("is-locked");
            window.setTimeout(function () {
              centerActive("jump");
            }, 60);
          }
        }
        if (nav) {
          nav.addEventListener("click", function (e) {
            var item = e.target.closest("[data-nav-target]");
            if (!item || !nav.contains(item)) {
              return;
            }
            e.preventDefault();
            var id = item.getAttribute("data-nav-target");
            var target = sectionById(id);
            if (
              !target ||
              target.style.display === "none" ||
              window.getComputedStyle(target).display === "none"
            ) {
              return;
            }
            audioCtx();
            navLockUntil = performance.now() + 1200;
            window.clearTimeout(centerTimer);
            activeId = "";
            setActive(id, true);
            if (navExpanded) {
              setExpanded(false);
            }
            window.scrollTo({
              top: target.getBoundingClientRect().top + window.pageYOffset,
              behavior: reduceMotion ? "auto" : "smooth",
            });
            window.setTimeout(function () {
              syncNav();
            }, 1260);
          });
          navExpandBtn.addEventListener("click", function () {
            setExpanded(!navExpanded);
          });
          navBackdrop.addEventListener("click", function () {
            setExpanded(false);
          });
        }
        doc.addEventListener("keydown", function (e) {
          if (lbOpen) {
            if (e.key === "ArrowLeft") {
              setViewer(lbIndex - 1, true);
            } else if (e.key === "ArrowRight") {
              setViewer(lbIndex + 1, true);
            } else if (e.key === "Escape") {
              closeViewer();
            }
            return;
          }
          if (e.key === "Escape" && navExpanded) {
            setExpanded(false);
          }
        });
        var music = $("bg-music"),
          musicBtn = $("music-toggle");
        var musicWanted = window.roseMusicWanted !== false,
          musicPlaying = false,
          musicHeldBy = {},
          musicWasOnHidden = false;
        if (!music || !filled(music.getAttribute("src"))) {
          if (musicBtn) {
            musicBtn.classList.add("is-absent");
          }
          music = null;
        }
        function setPlaying(on) {
          musicPlaying = on;
          if (musicBtn) {
            musicBtn.classList.toggle("is-playing", on);
            musicBtn.setAttribute("aria-pressed", on ? "true" : "false");
          }
        }
        function startMusic() {
          if (!music || !musicWanted || Object.keys(musicHeldBy).length) {
            return;
          }
          music.volume = 0.7;
          var p = music.play();
          if (p && p.then) {
            p.then(
              function () {
                setPlaying(true);
              },
              function () {
                setPlaying(false);
              },
            );
          } else {
            setPlaying(true);
          }
        }
        function pauseMusicFor(who) {
          musicHeldBy[who] = 1;
          if (music && musicPlaying) {
            music.pause();
            setPlaying(false);
          }
        }
        function resumeMusicFrom(who) {
          delete musicHeldBy[who];
          if (coverOpened) {
            startMusic();
          }
        }
        if (musicBtn) {
          musicBtn.addEventListener("click", function () {
            if (!music) {
              return;
            }
            if (musicPlaying) {
              musicWanted = false; window.roseSetMusicWanted(false);
              music.pause();
              setPlaying(false);
              sfxMuted = true;
            } else {
              musicWanted = true; window.roseSetMusicWanted(true);
              sfxMuted = false;
              startMusic();
            }
          });
        }
        doc.addEventListener("visibilitychange", function () {
          if (!music) {
            return;
          }
          if (doc.hidden) {
            musicWasOnHidden = musicPlaying;
            if (musicPlaying) {
              music.pause();
              setPlaying(false);
            }
          } else if (musicWasOnHidden) {
            musicWasOnHidden = false;
            startMusic();
          }
        });
        var ticking = false;
        function frame() {
          updateClock(currentMinute());
          syncNav(false);
          updateVine();
          updateRundownActive();
          releaseBottom();
        }
        function onScroll() {
          if (ticking) {
            return;
          }
          ticking = true;
          window.requestAnimationFrame(function () {
            ticking = false;
            frame();
          });
        }
        var resizeTimer = 0;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", function () {
          window.clearTimeout(resizeTimer);
          resizeTimer = window.setTimeout(function () {
            layoutVine();
            frame();
            centerActive("jump");
          }, 160);
        });
        assignTimes();
        setupReveal();
        initCanvas();
        startCanvas();
        runCuts();
        layoutVine();
        frame();
        tickCountdown();
        cdTimer = window.setInterval(tickCountdown, 1000);
        window.addEventListener("load", function () {
          layoutVine();
          frame();
        });
        if ("ResizeObserver" in window && garden) {
          new ResizeObserver(function () {
            layoutVine();
          }).observe(garden);
        }
      })();
    