
      (function () {
        "use strict";
        var doc = document,
          body = doc.body,
          root = doc.documentElement;
        var NS = "http://www.w3.org/2000/svg";
        var reduceMotion = window.MELTING.reducedMotion || !!(
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
        var LOC = window.MELTING.locale;

        /* ---------- utilitas ---------- */
        function $(id) {
          return doc.getElementById(id);
        }
        function clamp(v, a, b) {
          return v < a ? a : v > b ? b : v;
        }
        function lerp(a, b, t) {
          return a + (b - a) * t;
        }
        function smooth(a, b, v) {
          var t = clamp((v - a) / (b - a), 0, 1);
          return t * t * (3 - 2 * t);
        }
        function easeIO(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
        function easeIn(t) {
          return t * t * t;
        }
        function easeOut(t) {
          return 1 - Math.pow(1 - t, 3);
        }
        function easeBack(t) {
          var c = 1.6;
          return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
        }
        function f1(v) {
          return Math.round(v * 10) / 10;
        }
        function pad2(n) {
          return (n < 10 ? "0" : "") + n;
        }
        function txt(id) {
          var el = $(id);
          return el ? (el.textContent || "").trim() : "";
        }
        function filled(s) {
          return !!s && String(s).indexOf("{{") < 0 && String(s).trim() !== "";
        }
        function isShown(el) {
          return !!el && el.getClientRects().length > 0;
        }
        function each(list, fn) {
          Array.prototype.forEach.call(list, fn);
        }
        var seed = 7;
        function rnd() {
          seed = (seed * 16807) % 2147483647;
          return (seed - 1) / 2147483646;
        }
        function el(tag, attrs, parent, id, isSvg) {
          var e = isSvg ? doc.createElementNS(NS, tag) : doc.createElement(tag);
          if (id) {
            e.id = id;
          }
          if (attrs) {
            for (var k in attrs) {
              if (Object.prototype.hasOwnProperty.call(attrs, k)) {
                e.setAttribute(k, attrs[k]);
              }
            }
          }
          if (parent) {
            parent.appendChild(e);
          }
          return e;
        }
        function sv(tag, attrs, parent, id) {
          return el(tag, attrs, parent, id, true);
        }
        function setTxt(id, v) {
          var e = $(id);
          if (e) {
            e.textContent = v;
          }
        }
        function hide(e) {
          if (e) {
            e.style.display = "none";
          }
        }
        function navItem(id) {
          return doc.querySelector('#dream-nav [data-nav-target="' + id + '"]');
        }
        function hideSection(id) {
          hide(doc.querySelector('[data-section="' + id + '"]'));
          hide(navItem(id));
        }

        /* ---------- kunci gulir ---------- */
        var lockCount = 1;
        function lock(on) {
          lockCount = Math.max(0, lockCount + (on ? 1 : -1));
          body.classList.toggle("is-locked", lockCount > 0);
        }

        /* ---------- toast ---------- */
        var toastEl = $("toast"),
          toastT = 0;
        function toast(msg) {
          if (!toastEl) {
            return;
          }
          toastEl.textContent = msg;
          toastEl.classList.add("is-shown");
          clearTimeout(toastT);
          toastT = setTimeout(function () {
            toastEl.classList.remove("is-shown");
          }, 2400);
        }
        function copyText(s, okMsg) {
          var done = function () {
            toast(okMsg);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(s).then(done, function () {
              legacyCopy(s);
              done();
            });
          } else {
            legacyCopy(s);
            done();
          }
        }
        function legacyCopy(s) {
          var ta = el(
            "textarea",
            {
              readonly: "",
              style: "position:fixed;left:-9999px;top:0;opacity:0",
            },
            body,
            "copy-buffer",
          );
          ta.value = s;
          ta.select();
          try {
            doc.execCommand("copy");
          } catch (e) {
            /* abaikan */
          }
          body.removeChild(ta);
        }

        /* ---------- suara (WebAudio, tanpa berkas) ---------- */
        var actx = null,
          nbuf = null,
          soundOn = window.MELTING.musicEnabled && !window.MELTING.silentPlayback;
        function ac() {
          if (!actx) {
            var C = window.AudioContext || window.webkitAudioContext;
            if (C) {
              try {
                actx = new C();
              } catch (e) {
                actx = null;
              }
            }
          }
          if (actx && actx.state === "suspended") {
            actx.resume();
          }
          return actx;
        }
        function noise(c) {
          if (nbuf) {
            return nbuf;
          }
          nbuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
          var d = nbuf.getChannelData(0);
          for (var i = 0; i < d.length; i++) {
            d[i] = Math.random() * 2 - 1;
          }
          return nbuf;
        }
        function env(c, g, t, peak, a, dcy) {
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(peak, t + a);
          g.gain.exponentialRampToValueAtTime(0.0001, t + a + dcy);
        }
        var sfx = {
          whoosh: function () {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime,
              n = c.createBufferSource(),
              f = c.createBiquadFilter(),
              g = c.createGain();
            n.buffer = noise(c);
            f.type = "lowpass";
            f.frequency.setValueAtTime(2600, t);
            f.frequency.exponentialRampToValueAtTime(160, t + 1.4);
            env(c, g, t, 0.16, 0.18, 1.3);
            n.connect(f);
            f.connect(g);
            g.connect(c.destination);
            n.start(t);
            n.stop(t + 1.6);
          },
          chime: function (fr) {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime;
            [1, 1.5, 2.01].forEach(function (m, i) {
              var o = c.createOscillator(),
                g = c.createGain();
              o.type = "sine";
              o.frequency.value = (fr || 880) * m;
              env(c, g, t, 0.06 / (i + 1), 0.01, 1.4);
              o.connect(g);
              g.connect(c.destination);
              o.start(t);
              o.stop(t + 1.6);
            });
          },
          tick: function () {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime,
              n = c.createBufferSource(),
              f = c.createBiquadFilter(),
              g = c.createGain();
            n.buffer = noise(c);
            f.type = "bandpass";
            f.frequency.value = 3200;
            f.Q.value = 6;
            env(c, g, t, 0.08, 0.003, 0.04);
            n.connect(f);
            f.connect(g);
            g.connect(c.destination);
            n.start(t);
            n.stop(t + 0.08);
          },
          thud: function () {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime,
              o = c.createOscillator(),
              g = c.createGain();
            o.type = "sine";
            o.frequency.setValueAtTime(140, t);
            o.frequency.exponentialRampToValueAtTime(48, t + 0.32);
            env(c, g, t, 0.22, 0.01, 0.34);
            o.connect(g);
            g.connect(c.destination);
            o.start(t);
            o.stop(t + 0.4);
          },
          pop: function () {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime,
              o = c.createOscillator(),
              g = c.createGain();
            o.type = "triangle";
            o.frequency.setValueAtTime(420, t);
            o.frequency.exponentialRampToValueAtTime(1300, t + 0.09);
            env(c, g, t, 0.07, 0.005, 0.12);
            o.connect(g);
            g.connect(c.destination);
            o.start(t);
            o.stop(t + 0.2);
          },
          creak: function () {
            var c = ac();
            if (!c || !soundOn) {
              return;
            }
            var t = c.currentTime,
              o = c.createOscillator(),
              f = c.createBiquadFilter(),
              g = c.createGain();
            o.type = "sawtooth";
            o.frequency.setValueAtTime(90, t);
            o.frequency.linearRampToValueAtTime(140, t + 0.5);
            o.frequency.linearRampToValueAtTime(70, t + 1.1);
            f.type = "bandpass";
            f.frequency.value = 700;
            f.Q.value = 9;
            env(c, g, t, 0.05, 0.1, 1.1);
            o.connect(f);
            f.connect(g);
            g.connect(c.destination);
            o.start(t);
            o.stop(t + 1.3);
          },
        };
        function buzz(ms) {
          if (navigator.vibrate) {
            try {
              navigator.vibrate(ms);
            } catch (e) {
              /* abaikan */
            }
          }
        }

        /* ---------- data tanggal ---------- */
        function parseDT(d, t) {
          if (!filled(d)) {
            return null;
          }
          var tt = filled(t) ? t : "00:00";
          var x = new Date(d + "T" + tt + ":00");
          return isNaN(x.getTime()) ? null : x;
        }
        var wedDate = window.MELTING.dateTime ? new Date(window.MELTING.dateTime) : null;
        var tz = txt("hero-tz");
        if (!filled(tz)) {
          tz = "";
        }
        function fmtDay(d) {
          return d.toLocaleDateString(LOC, { timeZone: window.MELTING.timezone, weekday: "long" });
        }
        function fmtDate(d) {
          return d.toLocaleDateString(LOC, { timeZone: window.MELTING.timezone,
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        function fmtTime(d) {
          return d
            .toLocaleTimeString(LOC, { timeZone: window.MELTING.timezone, hour: "2-digit", minute: "2-digit" })
            .replace(":", ".");
        }
        function hm(s) {
          return filled(s) && /^\d{1,2}:\d{2}$/.test(s)
            ? s.replace(":", ".")
            : "";
        }
        var groomN = txt("cover-groom"),
          brideN = txt("cover-bride");
        if (!filled(groomN)) {
          groomN = window.MELTING.t("groom");
        }
        if (!filled(brideN)) {
          brideN = window.MELTING.t("bride");
        }

        /* ---------- nama tamu ---------- */
        var gEl = $("guest-greeting-name"),
          gName = gEl ? gEl.textContent.trim() : "";
        if (!filled(gName)) {
          gName = "";
        }
        body.classList.toggle("has-guest", gName !== "");
        var cgn = $("closing-guest-name");
        if (cgn && !filled(cgn.textContent)) {
          body.classList.remove("has-guest");
        }

        /* ---------- isi tanggal di sampul, hero, acara ---------- */
        if (wedDate) {
          setTxt("cover-date", fmtDay(wedDate) + " · " + fmtDate(wedDate));
          setTxt("hero-day", fmtDay(wedDate));
          setTxt("hero-date", fmtDate(wedDate));
          setTxt("hero-time-v", fmtTime(wedDate));
        } else {
          setTxt("cover-date", window.MELTING.t("invitation"));
          hide($("hero-date-row"));
        }
        if (!tz) {
          hide($("hero-tz"));
          hide($("ev-1-tz"));
          hide($("ev-2-tz"));
        }

        /* ---------- tetesan pada kartu & plakat ---------- */
        each(doc.querySelectorAll("[data-drips]"), function (host) {
          var n = parseInt(host.getAttribute("data-drips"), 10) || 3;
          var box = el(
            "span",
            { class: "drips", "aria-hidden": "true" },
            host,
            host.id + "-drips",
          );
          for (var i = 0; i < n; i++) {
            var d = el("i", null, box, host.id + "-drip-" + i);
            var w = 7 + rnd() * 9;
            d.style.setProperty(
              "--x",
              f1(((i + 0.5) / n) * 100 + (rnd() - 0.5) * (50 / n)) + "%",
            );
            d.style.setProperty("--w", f1(w) + "px");
            d.style.setProperty("--h", f1(12 + rnd() * 30) + "px");
            d.style.setProperty("--dur", f1(3.6 + rnd() * 3.4) + "s");
            d.style.setProperty("--del", f1(-rnd() * 5) + "s");
            d.style.setProperty("--fall", f1(4 + rnd() * 3.5) + "s");
            d.style.setProperty("--del2", f1(-rnd() * 6) + "s");
          }
        });

        /* ================================================================
     MESIN LELEH — bentuk prosedural yang bisa meleleh & membeku lagi
     ================================================================ */
        function pathClosed(p) {
          var n = p.length,
            s = "M" + f1(p[0][0]) + " " + f1(p[0][1]);
          for (var i = 0; i < n; i++) {
            var a = p[(i - 1 + n) % n],
              b = p[i],
              c = p[(i + 1) % n],
              d = p[(i + 2) % n];
            s +=
              "C" +
              f1(b[0] + (c[0] - a[0]) / 6) +
              " " +
              f1(b[1] + (c[1] - a[1]) / 6) +
              " " +
              f1(c[0] - (d[0] - b[0]) / 6) +
              " " +
              f1(c[1] - (d[1] - b[1]) / 6) +
              " " +
              f1(c[0]) +
              " " +
              f1(c[1]);
          }
          return s + "Z";
        }
        function pathOpen(p) {
          var n = p.length,
            s = "M" + f1(p[0][0]) + " " + f1(p[0][1]);
          for (var i = 0; i < n - 1; i++) {
            var a = p[Math.max(0, i - 1)],
              b = p[i],
              c = p[i + 1],
              d = p[Math.min(n - 1, i + 2)];
            s +=
              "C" +
              f1(b[0] + (c[0] - a[0]) / 6) +
              " " +
              f1(b[1] + (c[1] - a[1]) / 6) +
              " " +
              f1(c[0] - (d[0] - b[0]) / 6) +
              " " +
              f1(c[1] - (d[1] - b[1]) / 6) +
              " " +
              f1(c[0]) +
              " " +
              f1(c[1]);
          }
          return s;
        }
        function ringPts(n, r, cy) {
          var a = [];
          for (var i = 0; i < n; i++) {
            var u = i / n,
              ang = 2 * Math.PI * u + 0.5 * Math.sin(2 * Math.PI * u);
            a.push([r * Math.sin(ang), cy - r * Math.cos(ang)]);
          }
          return a;
        }
        function rectPts(w, h, y0, nt, ns, nb) {
          var p = [],
            x0 = -w / 2,
            x1 = w / 2,
            y1 = y0 + h,
            i;
          for (i = 0; i < nt; i++) {
            p.push([lerp(x0, x1, i / nt), y0]);
          }
          for (i = 0; i < ns; i++) {
            p.push([x1, lerp(y0, y1, i / ns)]);
          }
          for (i = 0; i < nb; i++) {
            p.push([lerp(x1, x0, i / nb), y1]);
          }
          for (i = 0; i < ns; i++) {
            p.push([x0, lerp(y1, y0, i / ns)]);
          }
          return p;
        }
        /* tergantung dari atas: bagian bawah melorot dan menetes */
        function hangDeform(o) {
          var H = o.H,
            W = o.W,
            m = o.m,
            t = o.t,
            dr = o.drips,
            st = o.stretch || 0.55,
            sw = o.sway || 0;
          return function (x, y) {
            var v = clamp(y / H, 0, 1.2);
            var nx = x * (1 + m * (0.16 * v - 0.26 * (1 - v) * (1 - v)));
            nx += m * W * 0.2 * v * v * Math.sin(t * 0.7 + sw);
            var ny = y + m * H * st * Math.pow(v, 1.7);
            if (m > 0.001 && v > 0.55) {
              var dv = Math.min(1, (v - 0.55) / 0.45);
              dv = dv * dv * (3 - 2 * dv);
              for (var k = 0; k < dr.length; k++) {
                var d = dr[k],
                  gx = (x - d.x * W) / (d.w * W);
                if (gx > -3 && gx < 3) {
                  ny +=
                    m *
                    d.L *
                    H *
                    Math.exp(-gx * gx) *
                    dv *
                    (0.8 + 0.2 * Math.sin(t * d.s + d.p));
                }
              }
            }
            return [nx, ny];
          };
        }
        /* terlipat di tepi balok: separuh rebah di atas, separuh menjuntai di depan */
        function drapeDeform(o) {
          var H = o.H,
            W = o.W,
            m = o.m,
            t = o.t,
            dr = o.drips,
            fold = 0.56;
          return function (x, y) {
            var v = clamp(-y / H, 0, 1);
            var hang = v < fold ? (fold - v) / fold : 0;
            var yd = v > fold ? -(v - fold) * H * 0.3 : (fold - v) * H * 1.02;
            yd += hang * hang * H * 0.14;
            var xd =
              x * 1.12 * (1 - 0.12 * hang) +
              Math.sin(t * 0.6 + v * 3) * W * 0.04 * hang;
            if (hang > 0.45) {
              var dv = (hang - 0.45) / 0.55;
              dv = dv * dv * (3 - 2 * dv);
              for (var k = 0; k < dr.length; k++) {
                var d = dr[k],
                  gx = (x - d.x * W) / (d.w * W);
                if (gx > -3 && gx < 3) {
                  yd +=
                    d.L *
                    H *
                    Math.exp(-gx * gx) *
                    dv *
                    (0.8 + 0.2 * Math.sin(t * d.s + d.p));
                }
              }
            }
            return [x + (xd - x) * m, y + (yd - y) * m];
          };
        }
        function mapPts(p, D, ox, oy) {
          var o = new Array(p.length);
          for (var i = 0; i < p.length; i++) {
            var q = D(p[i][0], p[i][1]);
            o[i] = [q[0] + (ox || 0), q[1] + (oy || 0)];
          }
          return o;
        }

        /* jam meleleh */
        function MeltClock(g, o) {
          var r = o.r,
            id = g.id;
          this.g = g;
          this.r = r;
          this.mode = o.mode || "hang";
          this.drips = o.drips;
          this.sway = o.sway || 0;
          this.stretch = o.stretch;
          this.cy = this.mode === "hang" ? r : -r;
          this.outer = ringPts(o.n || 84, r, this.cy);
          this.inner = ringPts(o.n || 84, r * 0.84, this.cy);
          this.ticks = [];
          for (var k = 0; k < 12; k++) {
            var a = (k * Math.PI) / 6,
              r1 = r * (k % 3 === 0 ? 0.58 : 0.66),
              r2 = r * 0.76;
            this.ticks.push([
              [r1 * Math.sin(a), this.cy - r1 * Math.cos(a)],
              [r2 * Math.sin(a), this.cy - r2 * Math.cos(a)],
            ]);
          }
          var parts = sv("g", null, g, id + "-parts");
          this.parts = parts;
          if (this.mode === "hang") {
            sv(
              "rect",
              {
                x: f1(-r * 0.1),
                y: f1(-r * 0.16),
                width: f1(r * 0.2),
                height: f1(r * 0.2),
                rx: f1(r * 0.05),
                fill: "#c99a4b",
              },
              parts,
              id + "-crown",
            );
          }
          this.body = sv(
            "path",
            {
              fill: "url(#g-gold)",
              stroke: "#7e5620",
              "stroke-width": f1(r * 0.03),
            },
            parts,
            id + "-body",
          );
          this.face = sv("path", { fill: "url(#g-face)" }, parts, id + "-face");
          this.tk = sv(
            "path",
            {
              fill: "none",
              stroke: "#6b4c2a",
              "stroke-width": f1(r * 0.045),
              "stroke-linecap": "round",
            },
            parts,
            id + "-ticks",
          );
          this.hh = sv(
            "path",
            {
              fill: "none",
              stroke: "#2a1d14",
              "stroke-width": f1(r * 0.075),
              "stroke-linecap": "round",
            },
            parts,
            id + "-hh",
          );
          this.mh = sv(
            "path",
            {
              fill: "none",
              stroke: "#2a1d14",
              "stroke-width": f1(r * 0.05),
              "stroke-linecap": "round",
            },
            parts,
            id + "-mh",
          );
          if (o.sec) {
            this.sh = sv(
              "path",
              {
                fill: "none",
                stroke: "#a64d58",
                "stroke-width": f1(r * 0.022),
                "stroke-linecap": "round",
              },
              parts,
              id + "-sh",
            );
          }
          this.pin = sv(
            "circle",
            { r: f1(r * 0.07), fill: "#8f6a2c" },
            parts,
            id + "-pin",
          );
          this.drops = [];
          for (var j = 0; j < this.drips.length; j++) {
            this.drops.push(
              sv(
                "circle",
                {
                  r: f1(r * (0.05 + 0.02 * (j % 2))),
                  fill: "#e0b35f",
                  opacity: "0",
                },
                g,
                id + "-drop-" + j,
              ),
            );
          }
          if (o.ring) {
            var rg = sv("g", { opacity: "0" }, g, id + "-rings");
            this.rings = rg;
            this.r1 = sv(
              "circle",
              {
                cx: "0",
                cy: f1(this.cy),
                r: f1(r * 0.66),
                fill: "none",
                stroke: "url(#g-gold)",
                "stroke-width": f1(r * 0.17),
              },
              rg,
              id + "-ring1",
            );
            this.r2 = sv(
              "circle",
              {
                cx: f1(r * 1.6),
                cy: f1(this.cy + r * 0.08),
                r: f1(r * 0.58),
                fill: "none",
                stroke: "url(#g-gold-v)",
                "stroke-width": f1(r * 0.15),
              },
              rg,
              id + "-ring2",
            );
            this.gem = sv(
              "path",
              {
                d:
                  "M0 " +
                  f1(this.cy - r * 0.98) +
                  " l" +
                  f1(r * 0.17) +
                  " " +
                  f1(r * 0.17) +
                  " l" +
                  f1(-r * 0.17) +
                  " " +
                  f1(r * 0.22) +
                  " l" +
                  f1(-r * 0.17) +
                  " " +
                  f1(-r * 0.22) +
                  "z",
                fill: "#fff8ec",
                stroke: "#c9a65a",
                "stroke-width": f1(r * 0.03),
              },
              rg,
              id + "-gem",
            );
          }
          this.lastRing = -1;
        }
        MeltClock.prototype.draw = function (m, t, hA, mA, ring, sA) {
          var r = this.r,
            cy = this.cy;
          var D = (this.mode === "hang" ? hangDeform : drapeDeform)({
            H: 2 * r,
            W: r,
            m: m,
            t: t,
            drips: this.drips,
            sway: this.sway,
            stretch: this.stretch,
          });
          this.body.setAttribute("d", pathClosed(mapPts(this.outer, D)));
          this.face.setAttribute("d", pathClosed(mapPts(this.inner, D)));
          var s = "";
          for (var k = 0; k < 12; k++) {
            var a = D(this.ticks[k][0][0], this.ticks[k][0][1]),
              b = D(this.ticks[k][1][0], this.ticks[k][1][1]);
            s +=
              "M" + f1(a[0]) + " " + f1(a[1]) + "L" + f1(b[0]) + " " + f1(b[1]);
          }
          this.tk.setAttribute("d", s);
          var hand = function (ang, len) {
            var pts = [];
            for (var i = -1; i <= 4; i++) {
              var l = (len * i) / 4;
              pts.push(D(l * Math.sin(ang), cy - l * Math.cos(ang)));
            }
            return pathOpen(
              pts
                .slice(0, 1)
                .map(function (p) {
                  return p;
                })
                .concat(pts.slice(1)),
            );
          };
          this.hh.setAttribute("d", hand(hA, r * 0.42));
          this.mh.setAttribute("d", hand(mA, r * 0.64));
          if (this.sh) {
            this.sh.setAttribute("d", hand(sA || 0, r * 0.7));
          }
          var pc = D(0, cy);
          this.pin.setAttribute("cx", f1(pc[0]));
          this.pin.setAttribute("cy", f1(pc[1]));
          for (var j = 0; j < this.drips.length; j++) {
            var d = this.drips[j],
              x = d.x * r,
              yb = cy + Math.sqrt(Math.max(0, r * r - x * x));
            var tip = D(x, yb),
              ph = (t * (d.fs || 0.35) + d.p * 0.13) % 1;
            var vis = m > 0.3 ? (1 - ph) * smooth(0.3, 0.6, m) : 0;
            this.drops[j].setAttribute("cx", f1(tip[0]));
            this.drops[j].setAttribute(
              "cy",
              f1(tip[1] + r * 0.06 + ph * ph * r * 2.2),
            );
            this.drops[j].setAttribute("opacity", f1(vis * 10) / 10);
          }
          if (this.rings) {
            var rr = ring || 0;
            if (Math.abs(rr - this.lastRing) > 0.002) {
              this.lastRing = rr;
              this.parts.setAttribute(
                "opacity",
                f1((1 - smooth(0, 0.55, rr)) * 100) / 100,
              );
              this.rings.setAttribute(
                "opacity",
                f1(smooth(0.25, 0.8, rr) * 100) / 100,
              );
              this.r2.setAttribute(
                "cx",
                f1(lerp(r * 1.9, r * 0.6, easeOut(smooth(0.35, 1, rr)))),
              );
            }
          }
        };

        /* bingkai potret yang meleleh */
        function MeltFrame(pre, o) {
          this.frame = $(pre + "-frame");
          this.clip = $(pre + "-clip-path");
          this.hair = $(pre + "-hair");
          this.img = $(pre + "-img");
          this.disp = $(pre + "-disp");
          this.wob = $(pre + "-wobble");
          this.ax = o.ax;
          this.ay = o.ay;
          this.W = o.w / 2;
          this.H = o.h;
          this.inset = o.inset;
          this.stretch = o.stretch;
          this.imgY = o.imgY;
          this.imgK = o.imgK || 0.5;
          this.outer = rectPts(o.w, o.h, 0, 14, 22, 76);
          this.inner = rectPts(
            o.w - o.inset * 2,
            o.h - o.inset * 2,
            o.inset,
            14,
            22,
            76,
          );
          this.hairPts = rectPts(
            o.w - o.inset,
            o.h - o.inset,
            o.inset / 2,
            14,
            22,
            76,
          );
          this.drips = o.drips;
          this.sway = o.sway || 0;
          this.wobOn = true;
          this.lastDisp = -1;
        }
        MeltFrame.prototype.draw = function (m, t) {
          var D = hangDeform({
            H: this.H,
            W: this.W,
            m: m,
            t: t,
            drips: this.drips,
            sway: this.sway,
            stretch: this.stretch,
          });
          this.frame.setAttribute(
            "d",
            pathClosed(mapPts(this.outer, D, this.ax, this.ay)),
          );
          if (this.clip) {
            this.clip.setAttribute(
              "d",
              pathClosed(mapPts(this.inner, D, this.ax, this.ay)),
            );
          }
          if (this.hair) {
            this.hair.setAttribute(
              "d",
              pathClosed(mapPts(this.hairPts, D, this.ax, this.ay)),
            );
          }
          var mm = Math.max(0, m),
            k = 1 + this.imgK * mm,
            kx = 1 + 0.22 * mm,
            sx = mm * this.W * 0.11 * Math.sin(t * 0.7 + this.sway);
          if (this.img) {
            this.img.setAttribute(
              "transform",
              "translate(" +
                f1(this.ax + sx) +
                " " +
                this.imgY +
                ") scale(" +
                f1(kx * 100) / 100 +
                " " +
                f1(k * 100) / 100 +
                ") translate(" +
                -this.ax +
                " " +
                -this.imgY +
                ")",
            );
          }
          if (this.disp && this.wob) {
            var dsp = Math.max(0, m) * 14;
            if (dsp < 0.3 && this.wobOn) {
              this.wob.removeAttribute("filter");
              this.wobOn = false;
            } else if (dsp >= 0.3) {
              if (!this.wobOn) {
                this.wob.setAttribute(
                  "filter",
                  "url(#" + this.disp.parentNode.id + ")",
                );
                this.wobOn = true;
              }
              if (Math.abs(dsp - this.lastDisp) > 0.25) {
                this.disp.setAttribute("scale", f1(dsp));
                this.lastDisp = dsp;
              }
            }
          }
        };

        /* ---------- putaran animasi tunggal ---------- */
        var loops = [],
          running = true,
          T0 = performance.now(),
          frameN = 0,
          tNow = 0;
        var visIO =
          "IntersectionObserver" in window
            ? new IntersectionObserver(
                function (es) {
                  es.forEach(function (e) {
                    var ls = e.target.__mrLoops || [];
                    ls.forEach(function (o) {
                      o.on = e.isIntersecting;
                    });
                  });
                },
                { rootMargin: "160px 0px" },
              )
            : null;
        function addLoop(fn, watchEl, every) {
          var o = { fn: fn, on: true, n: every || 1 };
          loops.push(o);
          if (watchEl && visIO) {
            o.on = false;
            watchEl.__mrLoops = (watchEl.__mrLoops || []).concat([o]);
            visIO.observe(watchEl);
          }
          return o;
        }
        function frame(now) {
          if (!running) {
            return;
          }
          tNow = (now - T0) / 1000;
          frameN++;
          for (var i = 0; i < loops.length; i++) {
            var o = loops[i];
            if (o.on && frameN % o.n === 0) {
              o.fn(tNow, now);
            }
          }
          requestAnimationFrame(frame);
        }
        function startLoop() {
          if (reduceMotion) {
            for (var i = 0; i < loops.length; i++) {
              loops[i].fn(0, performance.now());
            }
            return;
          }
          requestAnimationFrame(frame);
        }
        function tween(dur, fn, done) {
          var st = performance.now();
          if (reduceMotion) {
            fn(1);
            if (done) {
              done();
            }
            return;
          }
          (function step(now) {
            var p = clamp((now - st) / dur, 0, 1);
            fn(p);
            if (p < 1) {
              requestAnimationFrame(step);
            } else if (done) {
              done();
            }
          })(st);
        }

        /* ================================================================
     DUNIA MIMPI — langit WebGL, panggung SVG, debu & kelopak
     ================================================================ */
        var HOR = 0.36;
        var R = reduceMotion ? 1 : 0,
          Rt = R;
        var ptr = [0, 0],
          ptrT = [0, 0];
        var SW = innerWidth,
          SH = innerHeight,
          focusX = 0.5,
          sScale = 1,
          desk = false,
          skyU = 560;
        var scape = $("dreamscape"),
          stage = $("dream-stage");
        function computeRt() {
          var max = root.scrollHeight - innerHeight;
          Rt = reduceMotion ? 1 : max > 0 ? clamp(pageYOffset / max, 0, 1) : 0;
        }
        window.addEventListener(
          "pointermove",
          function (e) {
            ptrT[0] = clamp(
              (e.clientX / Math.max(1, innerWidth)) * 2 - 1,
              -1,
              1,
            );
            ptrT[1] = clamp(
              (e.clientY / Math.max(1, innerHeight)) * 2 - 1,
              -1,
              1,
            );
          },
          { passive: true },
        );

        /* --- langit: shader yang meleleh --- */
        var sky = { gl: null, ok: false };
        (function initSky() {
          var cv = $("dream-sky"),
            gl = null;
          try {
            gl = cv.getContext("webgl2", {
              antialias: true,
              alpha: true,
              powerPreference: "low-power",
              premultipliedAlpha: false,
            });
          } catch (e) {
            gl = null;
          }
          if (!gl) {
            scape.classList.add("no-gl");
            return;
          }
          var vs =
            "#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
          var fs = [
            "#version 300 es",
            "precision highp float;",
            "uniform vec2 uRes;uniform float uTime;uniform float uReal;uniform float uHor;uniform float uFocus;uniform vec2 uPtr;",
            "out vec4 outC;",
            "float h21(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);}",
            "float h11(float p){p=fract(p*.1031);p*=p+33.33;p*=p+p;return fract(p);}",
            "float n2(vec2 p){vec2 i=floor(p);vec2 f=fract(p);vec2 u=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),u.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),u.x),u.y);}",
            "float fbm(vec2 p){float s=0.;float a=.5;for(int i=0;i<4;i++){s+=a*n2(p);p=p*2.03+vec2(3.1,1.7);a*=.5;}return s;}",
            "vec3 tri(float k,vec3 a,vec3 b,vec3 c){return k<.5?mix(a,b,smoothstep(0.,1.,k*2.)):mix(b,c,smoothstep(0.,1.,k*2.-1.));}",
            "float sdSeg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);return length(pa-ba*h);}",
            "float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}",
            "void main(){",
            " vec2 uv=gl_FragCoord.xy/uRes;float asp=uRes.x/uRes.y;float R=clamp(uReal,0.,1.);float D=1.-R;float t=uTime;",
            " float hz=exp(-abs(uv.y-uHor)*10.);",
            " vec2 w=vec2(fbm(vec2(uv.x*2.6+uPtr.x*.25,uv.y*5.-t*.12)),fbm(vec2(uv.x*2.6+7.3,uv.y*5.-t*.1+uPtr.y*.25)))-.5;",
            " vec2 q=uv+w*(.008+.03*hz)*(.3+.7*D);float X=(q.x-uFocus)*asp;",
            " vec3 topC=tri(R,vec3(.06,.22,.26),vec3(.16,.15,.31),vec3(.045,.035,.11));",
            " vec3 midC=tri(R,vec3(.34,.6,.58),vec3(.79,.47,.42),vec3(.3,.19,.38));",
            " vec3 horC=tri(R,vec3(.96,.85,.63),vec3(1.,.75,.5),vec3(.93,.58,.54));",
            " float sunX=mix(.2,.17,R);float sunY=mix(uHor+.105,uHor+.3,smoothstep(.15,.85,R));",
            " vec3 sunC=tri(R,vec3(1.,.94,.74),vec3(1.,.83,.58),vec3(1.,.95,.86));",
            " vec2 sp=vec2(X-sunX,q.y-sunY);",
            " float dM=smin(length(vec2(sp.x,sp.y*.62))-.058,sdSeg(sp,vec2(.012,0.),vec2(.012,-.1*D-.001))-.016*D,.03);",
            " dM=smin(dM,sdSeg(sp,vec2(-.022,-.01),vec2(-.022,-.06*D-.011))-.011*D,.02);",
            " float dS=mix(dM,length(sp)-.052,smoothstep(.25,.85,R));",
            " vec3 col;",
            " if(q.y>=uHor){",
            "  float k=(q.y-uHor)/(1.-uHor);",
            "  col=mix(horC,midC,smoothstep(0.,.5,k));col=mix(col,topC,smoothstep(.3,1.,k));",
            "  float c=fbm(vec2(X*1.1+t*.015,q.y*6.5)+w*3.);",
            "  float cm=smoothstep(.52,.8,c)*smoothstep(.03,.22,k)*(1.-smoothstep(.72,.98,k));",
            "  col=mix(col,tri(R,vec3(1.,.97,.9),vec3(1.,.84,.72),vec3(.6,.43,.6)),cm*.55);",
            "  float sh=h21(floor(gl_FragCoord.xy/1.5));",
            "  col+=vec3(1.,.95,.86)*step(.996,sh)*(.5+.5*sin(t*2.+sh*90.))*smoothstep(.4,1.,R)*smoothstep(.12,.45,k);",
            "  col+=sunC*exp(-max(dS,0.)*13.)*mix(.5,.38,R);",
            "  float cr=(fbm(sp*40.)-.5)*.16*smoothstep(.6,1.,R);",
            "  col=mix(col,sunC*(1.-cr),smoothstep(.003,-.003,dS));",
            "  float cols=15.*asp;float cx=q.x*cols;float id=floor(cx);float lx=(fract(cx)-.5)/cols*asp;",
            "  float has=step(.34,h11(id+7.));",
            "  float L=(.05+.27*pow(h11(id*1.7+3.),2.))*(.88+.12*sin(t*.45+id*1.3));",
            "  float rad=(.16+.22*h11(id+11.))/cols*asp*.5;float tipY=1.-L*D;",
            "  float dd=q.y>tipY?abs(lx)-rad:length(vec2(lx,q.y-tipY))-rad;float aa=1.5/uRes.y;",
            "  float dripA=has*smoothstep(aa,-aa,dd)*D;",
            "  vec3 dripC=topC*.8+vec3(.015,.04,.05)+.06*smoothstep(rad*.2,-rad*.6,lx);",
            "  col=mix(col,dripC,dripA*.9);",
            " } else {",
            "  float k=(uHor-q.y)/uHor;float z=1./max(k,.02);",
            "  vec3 farC=tri(R,vec3(.9,.72,.46),vec3(.9,.58,.42),vec3(.36,.25,.34));",
            "  vec3 nearC=tri(R,vec3(.55,.33,.16),vec3(.44,.24,.2),vec3(.09,.07,.13));",
            "  col=mix(farC,nearC,smoothstep(0.,1.,pow(k,.6)));",
            "  col*=1.+.045*sin(z*2.2+n2(vec2(X*z*.5,z*.25))*5.)*D*(1.-.6*k);",
            "  col*=.975+.05*h21(floor(gl_FragCoord.xy));",
            "  col=mix(col,horC,exp(-k*16.)*.75);",
            "  float lake=smoothstep(.5,.95,R);",
            "  if(lake>0.){",
            "   float rk=clamp((uHor-q.y)/(1.-uHor),0.,1.);",
            "   vec3 rc=mix(horC,midC,smoothstep(0.,.5,rk));rc=mix(rc,topC,smoothstep(.3,1.,rk));",
            "   float rp=n2(vec2(X*z*3.,z*1.2-t*.4));rc*=.7+.12*rp;",
            "   float mx=X-sunX;",
            "   rc+=sunC*exp(-mx*mx*500./(1.+k*3.))*(.55+.45*sin(z*5.-t*2.+rp*4.))*smoothstep(0.,.15,k)*.45;",
            "   col=mix(col,rc,lake*(1.-.25*k));",
            "  }",
            " }",
            " float mesa=smoothstep(.46,.56,fbm(vec2(X*1.3+4.,.5)))*(.03+.02*n2(vec2(X*7.,0.)))*smoothstep(.12,.42,abs(X));",
            " if(q.y>=uHor&&q.y<uHor+mesa){col=mix(col,mix(tri(R,vec3(.66,.52,.42),vec3(.62,.38,.36),vec3(.15,.1,.19)),horC,.35),.9);}",
            " outC=vec4(col,1.);",
            "}",
          ].join("\n");
          function sh(type, src) {
            var s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
              return null;
            }
            return s;
          }
          var v = sh(gl.VERTEX_SHADER, vs),
            f = sh(gl.FRAGMENT_SHADER, fs);
          if (!v || !f) {
            scape.classList.add("no-gl");
            return;
          }
          var pr = gl.createProgram();
          gl.attachShader(pr, v);
          gl.attachShader(pr, f);
          gl.bindAttribLocation(pr, 0, "p");
          gl.linkProgram(pr);
          if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) {
            scape.classList.add("no-gl");
            return;
          }
          gl.useProgram(pr);
          var buf = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, buf);
          gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([-1, -1, 3, -1, -1, 3]),
            gl.STATIC_DRAW,
          );
          gl.enableVertexAttribArray(0);
          gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
          sky.gl = gl;
          sky.cv = cv;
          sky.ok = true;
          sky.u = {};
          ["uRes", "uTime", "uReal", "uHor", "uFocus", "uPtr"].forEach(
            function (n) {
              sky.u[n] = gl.getUniformLocation(pr, n);
            },
          );
          cv.addEventListener("webglcontextlost", function (e) {
            e.preventDefault();
            sky.ok = false;
            scape.classList.add("no-gl");
          });
        })();
        function sizeSky() {
          if (!sky.ok) {
            return;
          }
          var sc =
            Math.min(window.devicePixelRatio || 1, 2) * (desk ? 0.42 : 0.5);
          sky.cv.width = Math.max(2, Math.round(SW * sc));
          sky.cv.height = Math.max(2, Math.round(SH * sc));
          sky.gl.viewport(0, 0, sky.cv.width, sky.cv.height);
        }
        function drawSky(t) {
          if (!sky.ok) {
            var cs = root.style;
            cs.setProperty("--sky-t", R > 0.5 ? "#1a1430" : "#123c45");
            cs.setProperty(
              "--sky-m",
              R > 0.5 ? "#5a3a66" : R > 0.25 ? "#c47a6a" : "#5e9f9a",
            );
            cs.setProperty("--sky-h", R > 0.5 ? "#e8968b" : "#efd59f");
            cs.setProperty("--gr-f", R > 0.5 ? "#5c4458" : "#ddb37a");
            cs.setProperty("--gr-n", R > 0.5 ? "#1a1424" : "#6a4126");
            return;
          }
          var gl = sky.gl,
            u = sky.u;
          gl.uniform2f(u.uRes, sky.cv.width, sky.cv.height);
          gl.uniform1f(u.uTime, t);
          gl.uniform1f(u.uReal, R);
          gl.uniform1f(u.uHor, HOR);
          gl.uniform1f(u.uFocus, focusX);
          gl.uniform2f(u.uPtr, ptr[0], ptr[1]);
          gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        /* --- panggung SVG --- */
        var stArch = $("st-arch"),
          stAisle = $("st-aisle"),
          stGlowG = $("st-glow-g"),
          stTree = $("st-tree"),
          stLedge = $("st-ledge");
        var stFish = $("st-fish"),
          stFly = $("st-flyers"),
          stFly1 = $("st-fly-1"),
          stFly2 = $("st-fly-2");
        /* posisi mimpi: fx = satuan dari titik fokus, fy = pecahan tinggi langit di atas cakrawala */
        var pieces = [
          {
            id: "st-p-stairs",
            c: [0, -14],
            d: [-150, 0.55, -24, 0.42],
            w: [0.1, 0.48],
            ph: 0,
          },
          {
            id: "st-p-colL",
            c: [-62, -116],
            d: [-158, 0.3, -28, 0.48],
            w: [0.18, 0.55],
            ph: 1.3,
          },
          {
            id: "st-p-colR",
            c: [62, -116],
            d: [158, 0.56, 30, 0.46],
            w: [0.24, 0.6],
            ph: 2.1,
          },
          {
            id: "st-p-arch",
            c: [0, -240],
            d: [146, 0.3, -16, 0.42],
            w: [0.32, 0.68],
            ph: 3.2,
          },
          {
            id: "st-p-key",
            c: [0, -280],
            d: [150, 0.8, 40, 0.75],
            w: [0.42, 0.76],
            ph: 4.4,
          },
          {
            id: "st-p-door",
            c: [0, -100],
            d: [160, -0.04, 0, 0.5],
            w: [0.5, 0.82],
            ph: 5.1,
            ground: true,
          },
          {
            id: "st-p-window",
            c: [0, 0],
            d: [-146, 0.8, 8, 0.55],
            real: [-260, -470, 22, 0.6],
            w: [0.3, 0.8],
            ph: 2.7,
            fade: true,
          },
        ];
        pieces.forEach(function (p) {
          p.el = $(p.id);
          p.rocks = p.el ? p.el.querySelectorAll(".st-rock") : [];
          p.last = "";
        });
        var doorLeaf = $("st-door-leaf"),
          doorShadow = $("st-door-shadow"),
          stLight = $("st-light"),
          stGlow = $("st-glow"),
          stLan = $("st-lanterns");
        var vineL = $("st-vine-l"),
          vineR = $("st-vine-r"),
          archShadow = $("st-arch-shadow"),
          stFar = $("st-far");
        var treeShadow = $("st-tree-shadow"),
          ledgeShadow = $("st-ledge-shadow");

        /* bunga di gapura */
        var flowers = [],
          flWrap = $("st-flowers");
        (function () {
          var spots = [],
            i,
            a;
          for (i = 0; i <= 12; i++) {
            a = Math.PI * (1 - i / 12);
            spots.push([
              96 * Math.cos(a),
              -204 - 96 * Math.sin(a),
              i % 3 === 1 ? "bloom" : "rose",
              0.9 + (i % 2) * 0.35,
            ]);
          }
          spots.push(
            [-92, -200, "rose", 1.4],
            [92, -200, "rose", 1.4],
            [-70, -126, "bloom", 0.9],
            [70, -96, "bloom", 0.9],
            [-66, -60, "rose", 1],
            [66, -150, "rose", 1],
          );
          spots.push(
            [-104, -6, "rose", 1.5],
            [104, -6, "rose", 1.5],
            [-118, 2, "bloom", 1.1],
            [118, 2, "bloom", 1.1],
          );
          spots.forEach(function (sp, k) {
            var g = sv(
              "g",
              {
                transform:
                  "translate(" + f1(sp[0]) + " " + f1(sp[1]) + ") scale(0)",
              },
              flWrap,
              "st-fl-" + k,
            );
            sv(
              "use",
              {
                href: "#sym-" + sp[2],
                x: "-12",
                y: "-12",
                width: "24",
                height: "24",
              },
              g,
              "st-fl-u-" + k,
            );
            flowers.push({
              g: g,
              x: sp[0],
              y: sp[1],
              s: sp[3],
              th: 0.7 + (k % 7) * 0.02 + k * 0.004,
              last: -1,
            });
          });
        })();
        /* kuncup di pohon */
        var blossoms = [],
          blWrap = $("st-blossoms");
        [
          [34, -256],
          [62, -262],
          [96, -258],
          [118, -292],
          [104, -282],
          [-40, -292],
          [-54, -300],
          [6, -250],
          [140, -250],
          [-30, -166],
          [-56, -176],
          [-8, -200],
          [76, -264],
          [128, -246],
          [20, -254],
        ].forEach(function (p, k) {
          var g = sv(
            "g",
            { transform: "translate(" + p[0] + " " + p[1] + ") scale(0)" },
            blWrap,
            "st-bl-" + k,
          );
          sv(
            "use",
            {
              href: "#sym-blossom",
              x: "-8",
              y: "-8",
              width: "16",
              height: "16",
            },
            g,
            "st-bl-u-" + k,
          );
          blossoms.push({
            g: g,
            x: p[0],
            y: p[1],
            th: 0.4 + (k % 5) * 0.05 + k * 0.006,
            s: 0.8 + (k % 3) * 0.25,
            last: -1,
          });
        });

        /* jam-jam di panggung */
        var dripSetA = [
          { x: -0.5, w: 0.16, L: 0.28, s: 0.9, p: 0, fs: 0.3 },
          { x: 0.05, w: 0.12, L: 0.42, s: 1.2, p: 2, fs: 0.38 },
          { x: 0.55, w: 0.14, L: 0.22, s: 0.8, p: 4, fs: 0.27 },
        ];
        var dripSetB = [
          { x: -0.45, w: 0.15, L: 0.3, s: 1, p: 1, fs: 0.33 },
          { x: 0.3, w: 0.13, L: 0.4, s: 0.7, p: 3, fs: 0.29 },
        ];
        var clockA = new MeltClock($("st-clockA"), {
          r: 36,
          drips: dripSetA,
          sway: 1.2,
        });
        var clockB = new MeltClock($("st-clockB"), {
          r: 34,
          mode: "drape",
          drips: dripSetB,
          ring: true,
        });
        var wh = wedDate ? window.MELTING.hours : 8,
          wm = wedDate ? window.MELTING.minutes : 0;
        var realH = (((wh % 12) + wm / 60) / 12) * Math.PI * 2,
          realM = (wm / 60) * Math.PI * 2;
        function angMix(a, b, t) {
          var d =
            ((((b - a) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) -
            Math.PI;
          return a + d * t;
        }

        function layoutStage() {
          SW = innerWidth;
          SH = innerHeight;
          desk = SW >= 1024;
          stage.setAttribute("viewBox", "0 0 " + SW + " " + SH);
          focusX = desk ? 0.27 : 0.5;
          var horY = SH * (1 - HOR);
          sScale = clamp(
            Math.min(SW * (desk ? 0.5 : 1), SH * 0.62) / 420,
            0.62,
            1.9,
          );
          skyU = Math.min(620, horY / sScale);
          var tA =
            "translate(" +
            f1(SW * focusX) +
            " " +
            f1(horY) +
            ") scale(" +
            f1(sScale * 100) / 100 +
            ")";
          stArch.setAttribute("transform", tA);
          stAisle.setAttribute("transform", tA);
          stGlowG.setAttribute("transform", tA);
          var ts = sScale * (desk ? 0.95 : 0.98);
          stTree.setAttribute(
            "transform",
            "translate(" +
              f1(desk ? SW * 0.012 : SW * 0.03) +
              " " +
              f1(SH + 6) +
              ") scale(" +
              f1(ts * 100) / 100 +
              ")",
          );
          var ls = sScale * (desk ? 0.95 : 0.9);
          stLedge.setAttribute(
            "transform",
            "translate(" +
              f1(desk ? SW * 0.4 : SW * 0.99) +
              " " +
              f1(SH - 110 * ls - 4) +
              ") scale(" +
              f1(ls * 100) / 100 +
              ")",
          );
          sizeSky();
          sizeDust();
        }

        function drawStage(t) {
          var horY = SH * (1 - HOR);
          /* potongan arsitektur yang melayang lalu menyusun diri */
          for (var i = 0; i < pieces.length; i++) {
            var p = pieces[i];
            if (!p.el) {
              continue;
            }
            var e = easeIO(clamp((R - p.w[0]) / (p.w[1] - p.w[0]), 0, 1));
            var real = p.real || [0, 0, 0, 1];
            var idle = (1 - e) * (p.ground ? 0 : 1);
            var ddx = p.d[0] - p.c[0],
              ddy = -p.d[1] * skyU - p.c[1];
            var dx = lerp(ddx, real[0], e),
              dy = lerp(ddy, real[1], e) + Math.sin(t * 0.6 + p.ph) * 7 * idle;
            var rot =
              lerp(p.d[2], real[2], e) + Math.sin(t * 0.45 + p.ph) * 2.5 * idle;
            var sc = lerp(p.d[3], real[3], e);
            var tr =
              "translate(" +
              f1(p.c[0] + dx) +
              " " +
              f1(p.c[1] + dy) +
              ") rotate(" +
              f1(rot) +
              ") scale(" +
              f1(sc * 100) / 100 +
              ") translate(" +
              -p.c[0] +
              " " +
              -p.c[1] +
              ")";
            if (tr !== p.last) {
              p.el.setAttribute("transform", tr);
              p.last = tr;
            }
            var ro = f1((1 - smooth(0, 0.6, e)) * 100) / 100;
            if (ro !== p.ro) {
              p.ro = ro;
              for (var k = 0; k < p.rocks.length; k++) {
                p.rocks[k].setAttribute("opacity", ro);
              }
            }
            if (p.fade) {
              p.el.setAttribute("opacity", f1((1 - e) * 100) / 100);
            }
            if (p.ground && doorShadow) {
              doorShadow.setAttribute(
                "opacity",
                f1(0.28 * (1 - e) * 100) / 100,
              );
            }
          }
          var open = smooth(0.88, 0.99, R);
          if (doorLeaf) {
            doorLeaf.setAttribute(
              "transform",
              "translate(-34 0) scale(" +
                f1((1 - open * 0.9) * 100) / 100 +
                " 1) translate(34 0)",
            );
          }
          stLight.setAttribute("opacity", f1(smooth(0.8, 0.96, R) * 100) / 100);
          stGlow.setAttribute("opacity", f1(smooth(0.6, 1, R) * 90) / 100);
          stLan.setAttribute("opacity", f1(smooth(0.74, 0.92, R) * 100) / 100);
          stAisle.setAttribute("opacity", f1(smooth(0.55, 0.9, R) * 100) / 100);
          archShadow.setAttribute(
            "opacity",
            f1(smooth(0.5, 0.85, R) * 35) / 100,
          );
          stFar.setAttribute(
            "opacity",
            f1((1 - smooth(0.15, 0.55, R)) * 90) / 100,
          );
          var vo = f1((1 - smooth(0.6, 0.86, R)) * 1000) / 1000;
          vineL.setAttribute("stroke-dashoffset", vo);
          vineR.setAttribute("stroke-dashoffset", vo);
          for (var j = 0; j < flowers.length; j++) {
            var fl = flowers[j],
              kf = Math.max(0, easeBack(clamp((R - fl.th) / 0.09, 0, 1)));
            if (Math.abs(kf - fl.last) > 0.004) {
              fl.last = kf;
              fl.g.setAttribute(
                "transform",
                "translate(" +
                  f1(fl.x) +
                  " " +
                  f1(fl.y) +
                  ") scale(" +
                  f1(kf * fl.s * 100) / 100 +
                  ")",
              );
            }
          }
          for (var b = 0; b < blossoms.length; b++) {
            var bl = blossoms[b],
              kb = Math.max(0, easeBack(clamp((R - bl.th) / 0.1, 0, 1)));
            if (Math.abs(kb - bl.last) > 0.004) {
              bl.last = kb;
              bl.g.setAttribute(
                "transform",
                "translate(" +
                  bl.x +
                  " " +
                  bl.y +
                  ") scale(" +
                  f1(kb * bl.s * 100) / 100 +
                  ")",
              );
            }
          }
          treeShadow.setAttribute("opacity", f1((1 - R) * 30) / 100);
          ledgeShadow.setAttribute("opacity", f1((1 - R) * 30) / 100);
          /* ikan yang berenang di langit (hanya di dunia mimpi) */
          var fo = 1 - smooth(0.25, 0.5, R);
          if (fo > 0.01) {
            stFish.style.display = "";
            var span = SW + 260,
              fx = SW + 90 - ((t * 26) % span),
              fy = horY - SH * 0.3 + Math.sin(t * 0.8) * 10;
            stFish.setAttribute(
              "transform",
              "translate(" +
                f1(fx) +
                " " +
                f1(fy) +
                ") scale(" +
                f1(sScale * 80) / 100 +
                ") rotate(" +
                f1(Math.sin(t * 0.8 + 1) * 6) +
                ")",
            );
            stFish.setAttribute("opacity", f1(fo * 100) / 100);
          } else {
            stFish.style.display = "none";
          }
          /* kupu-kupu di dunia nyata */
          var bo = smooth(0.68, 0.9, R);
          stFly.setAttribute("opacity", f1(bo * 100) / 100);
          if (bo > 0.01) {
            var cx = SW * focusX,
              cy = horY - 190 * sScale;
            stFly1.setAttribute(
              "transform",
              "translate(" +
                f1(cx + Math.cos(t * 0.55) * 150 * sScale) +
                " " +
                f1(cy + Math.sin(t * 1.1) * 46 * sScale) +
                ") scale(" +
                f1(sScale * 70) / 100 +
                ")",
            );
            stFly2.setAttribute(
              "transform",
              "translate(" +
                f1(cx + Math.cos(t * 0.47 + 2.4) * 120 * sScale) +
                " " +
                f1(cy - 50 * sScale + Math.sin(t * 0.9 + 1) * 38 * sScale) +
                ") scale(" +
                f1(sScale * 56) / 100 +
                ")",
            );
          }
          /* jam di dahan: membeku lebih dulu dan menunjuk jam pernikahan */
          var mA = 1 - smooth(0.32, 0.72, R);
          var hA = angMix(-t * 0.35 + 1.2, realH, 1 - mA),
            mnA = angMix(t * 1.3, realM, 1 - mA);
          clockA.draw(mA, t, hA, mnA);
          /* jam di balok: membeku, lalu berubah jadi sepasang cincin */
          var mB = 1 - smooth(0.46, 0.8, R),
            ringB = smooth(0.82, 0.97, R);
          clockB.draw(
            mB,
            t + 3,
            angMix(t * 0.5, realH, 1 - mB),
            angMix(-t * 1.8, realM, 1 - mB),
            ringB,
          );
        }

        /* --- debu, tetesan, kelopak & kunang-kunang --- */
        var dust = { cv: $("dream-dust"), P: [], W: 0, H: 0, dpr: 1 };
        dust.ctx = dust.cv ? dust.cv.getContext("2d") : null;
        function sizeDust() {
          if (!dust.ctx) {
            return;
          }
          dust.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          dust.W = SW;
          dust.H = SH;
          dust.cv.width = Math.round(SW * dust.dpr);
          dust.cv.height = Math.round(SH * dust.dpr);
          dust.ctx.setTransform(dust.dpr, 0, 0, dust.dpr, 0, 0);
          var want = SW < 600 ? 34 : 64;
          while (dust.P.length < want) {
            dust.P.push(spawn({}, true));
          }
          dust.P.length = want;
        }
        function spawn(p, init) {
          var real = Math.random() < R;
          p.type = real
            ? Math.random() < 0.62
              ? "petal"
              : "fly"
            : Math.random() < 0.55
              ? "drop"
              : "mote";
          p.x = Math.random() * dust.W;
          p.y = init
            ? Math.random() * dust.H
            : p.type === "fly"
              ? dust.H * (0.45 + Math.random() * 0.55)
              : -20;
          p.vy =
            p.type === "drop"
              ? 0.5 + Math.random() * 1.1
              : p.type === "petal"
                ? 0.35 + Math.random() * 0.55
                : p.type === "mote"
                  ? -0.05 + Math.random() * 0.1
                  : 0;
          p.vx = (Math.random() - 0.5) * 0.3;
          p.r =
            p.type === "drop"
              ? 1.6 + Math.random() * 2.2
              : p.type === "petal"
                ? 3 + Math.random() * 3.5
                : 0.8 + Math.random() * 1.6;
          p.a = Math.random() * Math.PI * 2;
          p.va = (Math.random() - 0.5) * 0.04;
          p.ph = Math.random() * 10;
          p.life = 1;
          p.col =
            p.type === "petal"
              ? Math.random() < 0.5
                ? "#e9a2a0"
                : "#f6cfc6"
              : null;
          return p;
        }
        function burst(n, x, y) {
          for (var i = 0; i < n; i++) {
            var p = spawn({}, true);
            p.type = "petal";
            p.x = x + (Math.random() - 0.5) * 40;
            p.y = y + (Math.random() - 0.5) * 20;
            p.vx = (Math.random() - 0.5) * 5;
            p.vy = -2 - Math.random() * 3.5;
            p.r = 3 + Math.random() * 3.5;
            p.col = Math.random() < 0.5 ? "#e9a2a0" : "#f6cfc6";
            p.tmp = true;
            dust.P.push(p);
          }
        }
        function drawDust(t) {
          var c = dust.ctx;
          if (!c) {
            return;
          }
          c.clearRect(0, 0, dust.W, dust.H);
          for (var i = dust.P.length - 1; i >= 0; i--) {
            var p = dust.P[i];
            if (p.type === "drop") {
              p.y += p.vy;
              p.x += Math.sin((p.y + p.ph * 50) * 0.01) * 0.2;
              c.globalAlpha = 0.32;
              c.fillStyle = "#dff3ef";
              c.beginPath();
              c.ellipse(p.x, p.y, p.r * 0.7, p.r * 1.6, 0, 0, Math.PI * 2);
              c.fill();
              c.globalAlpha = 0.14;
              c.fillRect(p.x - p.r * 0.25, p.y - p.r * 6, p.r * 0.5, p.r * 5);
            } else if (p.type === "mote") {
              p.x += p.vx + Math.sin(t * 0.3 + p.ph) * 0.15;
              p.y += p.vy + Math.cos(t * 0.25 + p.ph) * 0.1;
              c.globalAlpha = 0.35 + 0.25 * Math.sin(t + p.ph);
              c.fillStyle = "#fff0cc";
              c.beginPath();
              c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
              c.fill();
            } else if (p.type === "petal") {
              p.vy = p.tmp ? p.vy + 0.07 : p.vy;
              p.vx *= p.tmp ? 0.985 : 1;
              p.y += p.tmp ? p.vy : p.vy;
              p.x += p.vx + Math.sin(t * 0.9 + p.ph) * 0.5;
              p.a += p.va + 0.01;
              if (p.tmp && p.vy > 1.2) {
                p.vy = 1.2;
              }
              c.save();
              c.translate(p.x, p.y);
              c.rotate(p.a);
              c.scale(1, 0.55 + 0.45 * Math.sin(t * 2 + p.ph));
              c.globalAlpha = 0.85;
              c.fillStyle = p.col;
              c.beginPath();
              c.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, Math.PI * 2);
              c.fill();
              c.restore();
            } else {
              p.x += Math.sin(t * 0.5 + p.ph) * 0.6;
              p.y += Math.cos(t * 0.37 + p.ph * 1.3) * 0.4;
              var gl = 0.45 + 0.55 * Math.sin(t * 2.2 + p.ph);
              c.globalAlpha = Math.max(0, gl) * 0.9;
              c.fillStyle = "#ffe7a0";
              c.beginPath();
              c.arc(p.x, p.y, p.r + 0.6, 0, Math.PI * 2);
              c.fill();
              c.globalAlpha = Math.max(0, gl) * 0.22;
              c.beginPath();
              c.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
              c.fill();
            }
            if (
              p.y > dust.H + 30 ||
              p.y < -60 ||
              p.x < -60 ||
              p.x > dust.W + 60
            ) {
              if (p.tmp) {
                dust.P.splice(i, 1);
              } else {
                spawn(p, false);
                if (p.type === "fly" || p.type === "mote") {
                  p.y = Math.random() * dust.H;
                }
              }
            }
          }
          c.globalAlpha = 1;
        }

        layoutStage();
        window.addEventListener(
          "resize",
          function () {
            layoutStage();
            fitHeroNames();
          },
          { passive: true },
        );

        addLoop(function (t) {
          var d = Rt - R;
          R = Math.abs(d) > 0.0005 ? R + d * 0.06 : Rt;
          ptr[0] += (ptrT[0] - ptr[0]) * 0.04;
          ptr[1] += (ptrT[1] - ptr[1]) * 0.04;
          drawStage(t);
          updateMeter();
        });
        addLoop(
          function (t) {
            drawSky(t);
          },
          null,
          reduceMotion ? 1 : 2,
        );
        addLoop(function (t) {
          drawDust(t);
        });

        /* ================================================================
     SAMPUL — jam hipnotis yang meleleh, lalu seluruh sampul ikut luruh
     ================================================================ */
        var cover = $("sec-cover"),
          coverBtn = $("cover-open"),
          coverInner = $("cover-inner"),
          coverClockG = $("cover-clock");
        var coverClock = coverClockG
          ? new MeltClock(coverClockG, {
              r: 62,
              drips: [
                { x: -0.42, w: 0.16, L: 0.3, s: 1, p: 0, fs: 0.3 },
                { x: 0.12, w: 0.12, L: 0.5, s: 1.3, p: 2, fs: 0.36 },
                { x: 0.58, w: 0.13, L: 0.24, s: 0.8, p: 4, fs: 0.26 },
              ],
              sway: 0.4,
              stretch: 0.6,
            })
          : null;
        var coverOpenAt = -1,
          coverMeltAt = -1,
          coverGone = false,
          lastTick = 0;
        var lumps = [
          { x: 6, w: 9, a: 0.9 },
          { x: 24, w: 12, a: 0.55 },
          { x: 41, w: 8, a: 1.15 },
          { x: 58, w: 13, a: 0.7 },
          { x: 76, w: 9, a: 1.05 },
          { x: 93, w: 10, a: 0.8 },
        ];
        function coverClip(q) {
          var base = -10 + easeIO(q) * 142,
            pts = [];
          for (var i = 0; i <= 90; i++) {
            var x = (i / 90) * 100,
              e =
                base +
                (Math.sin(x * 0.09 + q * 3) * 4 +
                  Math.sin(x * 0.23 + 1.3) * 2) *
                  Math.min(1, q * 3);
            for (var k = 0; k < lumps.length; k++) {
              var lp = lumps[k],
                dx = (x - lp.x) / lp.w;
              if (dx > -1 && dx < 1) {
                var v = 1 - dx * dx;
                e -= lp.a * 17 * Math.min(1, q * 2.2) * v * Math.sqrt(v);
              }
            }
            pts.push(f1(x) + "% " + f1(e) + "%");
          }
          pts.push("100% 140%", "0% 140%");
          return "polygon(" + pts.join(",") + ")";
        }
        if (coverClock) {
          addLoop(function (t, now) {
            if (coverGone) {
              return;
            }
            var m = 0.24 + 0.06 * Math.sin(t * 1.3),
              fall = 0;
            if (coverOpenAt >= 0) {
              var p = clamp((now - coverOpenAt) / 1100, 0, 1);
              m = lerp(m, 1.45, easeIn(p));
              fall =
                Math.pow(Math.max(0, (now - coverOpenAt) / 1000 - 0.55), 2) *
                520;
              coverClockG.setAttribute(
                "transform",
                "translate(150 " + f1(66 + fall) + ")",
              );
              coverClockG.setAttribute(
                "opacity",
                f1(clamp(1 - fall / 260, 0, 1) * 100) / 100,
              );
            } else if (actx && now - lastTick > 1550) {
              lastTick = now;
              sfx.tick();
            }
            coverClock.draw(m, t, -t * 0.9 + 2, -t * 3.4, 0);
            if (coverMeltAt >= 0) {
              var q = clamp((now - coverMeltAt) / 1500, 0, 1);
              cover.style.clipPath = coverClip(q);
              cover.style.webkitClipPath = coverClip(q);
              coverInner.style.transform =
                "translateY(" +
                f1(easeIn(q) * 34) +
                "vh) scaleY(" +
                f1((1 + q * 0.35) * 100) / 100 +
                ")";
            }
          });
        }
        function showChrome() {
          $("dream-nav").classList.add("is-shown");
          var mb = $("music-btn");
          if (mb) {
            mb.classList.add("is-shown");
          }
          onScroll();
        }
        function coverDone(e) {
          if (e && (e.target !== cover || e.propertyName !== "opacity")) {
            return;
          }
          if (cover.classList.contains("is-gone") && !coverGone) {
            coverGone = true;
            cover.style.display = "none";
          }
          cover.removeEventListener("transitionend", coverDone);
        }
        function openCover() {
          if (coverOpenAt >= 0) {
            return;
          }
          coverOpenAt = performance.now();
          ac();
          sfx.whoosh();
          playMusic();
          buzz(18);
          if (reduceMotion) {
            cover.classList.add("is-gone");
            lock(false);
            revealHero();
            showChrome();
            cover.addEventListener("transitionend", coverDone);
            setTimeout(coverDone, 700);
            return;
          }
          cover.classList.add("is-melting");
          setTimeout(function () {
            cover.classList.add("is-clearing");
            lock(false);
            coverMeltAt = performance.now();
          }, 620);
          setTimeout(revealHero, 860);
          setTimeout(function () {
            cover.classList.add("is-gone");
            showChrome();
          }, 1500);
          cover.addEventListener("transitionend", coverDone);
          setTimeout(coverDone, 2700);
        }
        if (cover && coverBtn) {
          coverBtn.addEventListener("click", openCover);
        } else {
          lock(false);
          if (cover) {
            cover.style.display = "none";
            coverGone = true;
          }
        }

        /* ================================================================
     HERO — nama yang meleleh huruf demi huruf
     ================================================================ */
        var heroRegion = $("sec-hero"),
          heroRevealed = false;
        each([$("hero-window-img"), $("cover-painting")], function (im) {
          if (!im) {
            return;
          }
          var bad = function () {
            im.style.visibility = "hidden";
          };
          if (!filled(im.getAttribute("src"))) {
            bad();
          } else {
            im.addEventListener("error", bad);
            if (im.complete && im.naturalWidth === 0) {
              bad();
            }
          }
        });
        function splitLetters(node, start) {
          var s = (node.textContent || "").trim();
          node.textContent = "";
          node.setAttribute("aria-label", s);
          var chars = Array.from ? Array.from(s) : s.split("");
          chars.forEach(function (ch, k) {
            var sp = el(
              "span",
              { class: "ltr", "aria-hidden": "true" },
              node,
              node.id + "-l" + k,
            );
            sp.textContent = ch === " " ? " " : ch;
            sp.style.setProperty("--i", String(start + k));
            if (ch !== " " && rnd() < 0.42) {
              sp.classList.add("dr");
              sp.style.setProperty("--dx", f1(22 + rnd() * 48) + "%");
              sp.style.setProperty("--dh", f1(0.18 + rnd() * 0.3) + "em");
              sp.style.setProperty("--dd", f1(3.8 + rnd() * 3.6) + "s");
              sp.style.setProperty("--dl", f1(-rnd() * 5) + "s");
            }
          });
          return chars.length;
        }
        var hg = $("hero-name-groom"),
          hb = $("hero-name-bride"),
          hNames = $("hero-names");
        if (hg && hb) {
          var nG = splitLetters(hg, 0);
          splitLetters(hb, nG + 1);
        }
        function fitHeroNames() {
          if (!hNames) {
            return;
          }
          hNames.style.fontSize = "";
          var cs = parseFloat(getComputedStyle(hNames).fontSize),
            guard = 0;
          while (
            guard++ < 30 &&
            (hg.scrollWidth > hNames.clientWidth + 1 ||
              hb.scrollWidth > hNames.clientWidth + 1) &&
            cs > 30
          ) {
            cs *= 0.94;
            hNames.style.fontSize = f1(cs) + "px";
          }
        }
        fitHeroNames();
        if (doc.fonts && doc.fonts.ready) {
          doc.fonts.ready.then(fitHeroNames);
        }
        function revealHero() {
          if (heroRevealed || !heroRegion) {
            return;
          }
          heroRevealed = true;
          heroRegion.classList.add("in-view");
        }
        if (!coverBtn) {
          revealHero();
        }

        /* ================================================================
     ANIMASI MASUK — per elemen, dipicu di sepertiga bawah layar
     ================================================================ */
        var pendingEls = [],
          revealHooks = {};
        function onRevealed(elx) {
          var h = revealHooks[elx.id];
          if (h) {
            delete revealHooks[elx.id];
            h();
          }
        }
        var revIO =
          "IntersectionObserver" in window
            ? new IntersectionObserver(
                function (es) {
                  es.forEach(function (e) {
                    if (e.isIntersecting) {
                      e.target.classList.add("in-view");
                      revIO.unobserve(e.target);
                      onRevealed(e.target);
                    }
                  });
                },
                { threshold: 0, rootMargin: "0px 0px -33% 0px" },
              )
            : null;
        function watchReveal(x) {
          if (!x) {
            return;
          }
          if (revIO) {
            revIO.observe(x);
            pendingEls.push(x);
          } else {
            x.classList.add("in-view");
            onRevealed(x);
          }
        }
        function whenRevealed(x, fn) {
          if (!x) {
            return;
          }
          if (x.classList.contains("in-view")) {
            fn();
          } else {
            revealHooks[x.id] = fn;
          }
        }
        var regions = doc.querySelectorAll(
          "body > header, body > section, body > footer",
        );
        each(regions, function (r) {
          if (r.id === "sec-cover" || r.id === "sec-hero") {
            return;
          }
          if (!revIO) {
            r.classList.add("in-view");
          }
          each(r.querySelectorAll(".reveal"), watchReveal);
        });
        function releaseBottom() {
          if (innerHeight + pageYOffset >= root.scrollHeight - 4) {
            pendingEls.forEach(function (x) {
              if (!x.classList.contains("in-view")) {
                x.classList.add("in-view");
                if (revIO) {
                  revIO.unobserve(x);
                }
                onRevealed(x);
              }
            });
          }
        }

        /* ================================================================
     NAVIGASI — peta lapisan mimpi
     ================================================================ */
        var nav = $("dream-nav"),
          rail = $("nav-rail"),
          navToggle = $("nav-toggle");
        var activeId = null,
          centerT = 0,
          lockUntil = 0,
          meterLast = -1;
        var mMask = $("nav-meter-mask"),
          mDrop = $("nav-meter-drop"),
          mVal = $("nav-meter-val");
        function secOf(id) {
          return doc.querySelector('body > [data-section="' + id + '"]');
        }
        function navIds() {
          return Array.prototype.map.call(
            rail.querySelectorAll("[data-nav-target]"),
            function (b) {
              return b.getAttribute("data-nav-target");
            },
          );
        }
        function computeActive() {
          var line = innerHeight * 0.35,
            cur = null,
            first = null;
          each(doc.querySelectorAll("body > [data-section]"), function (s) {
            var id = s.getAttribute("data-section");
            if (id === "cover" || !isShown(s)) {
              return;
            }
            var it = navItem(id);
            if (!it || it.style.display === "none") {
              return;
            }
            if (!first) {
              first = id;
            }
            if (s.getBoundingClientRect().top <= line) {
              cur = id;
            }
          });
          return cur || first;
        }
        function centerRail(instant) {
          var b = rail.querySelector(".nav-item.is-active");
          if (!b) {
            return;
          }
          var rr = rail.getBoundingClientRect(),
            br = b.getBoundingClientRect(),
            target,
            cur;
          if (nav.classList.contains("is-open")) {
            if (rail.scrollHeight <= rail.clientHeight + 1) {
              return;
            }
            target = clamp(
              rail.scrollTop +
                (br.top - rr.top - rail.clientTop) -
                (rail.clientHeight - br.height) / 2,
              0,
              rail.scrollHeight - rail.clientHeight,
            );
            cur = rail.scrollTop;
            if (Math.abs(target - cur) < 2) {
              return;
            }
            rail.scrollTo({
              top: target,
              behavior: instant || reduceMotion ? "auto" : "smooth",
            });
          } else {
            if (rail.scrollWidth <= rail.clientWidth + 1) {
              return;
            }
            target = clamp(
              rail.scrollLeft +
                (br.left - rr.left - rail.clientLeft) -
                (rail.clientWidth - br.width) / 2,
              0,
              rail.scrollWidth - rail.clientWidth,
            );
            cur = rail.scrollLeft;
            if (Math.abs(target - cur) < 2) {
              return;
            }
            rail.scrollTo({
              left: target,
              behavior: instant || reduceMotion ? "auto" : "smooth",
            });
          }
        }
        function setActive(id, now) {
          if (!id || id === activeId) {
            return;
          }
          activeId = id;
          each(rail.querySelectorAll("[data-nav-target]"), function (b) {
            var on = b.getAttribute("data-nav-target") === id;
            b.classList.toggle("is-active", on);
            if (on) {
              b.setAttribute("aria-current", "true");
            } else {
              b.removeAttribute("aria-current");
            }
          });
          clearTimeout(centerT);
          if (now) {
            centerRail();
          } else {
            centerT = setTimeout(function () {
              centerRail();
            }, 180);
          }
        }
        function openSheet() {
          nav.classList.add("is-open");
          navToggle.setAttribute("aria-expanded", "true");
          navToggle.setAttribute("aria-label", window.MELTING.t("close"));
          var k = 0;
          each(rail.querySelectorAll(".nav-item"), function (b) {
            if (b.style.display !== "none") {
              b.style.setProperty("--k", String(k++));
            }
          });
          lock(true);
          setTimeout(function () {
            centerRail(true);
          }, 60);
        }
        function closeSheet() {
          if (!nav.classList.contains("is-open")) {
            return;
          }
          nav.classList.remove("is-open");
          navToggle.setAttribute("aria-expanded", "false");
          navToggle.setAttribute("aria-label", window.MELTING.t("map"));
          lock(false);
          setTimeout(function () {
            centerRail(true);
          }, 30);
        }
        navToggle.addEventListener("click", function () {
          if (nav.classList.contains("is-open")) {
            closeSheet();
          } else {
            openSheet();
          }
          sfx.pop();
        });
        rail.addEventListener("click", function (e) {
          var b = e.target.closest
            ? e.target.closest("[data-nav-target]")
            : null;
          if (!b) {
            return;
          }
          e.preventDefault();
          var id = b.getAttribute("data-nav-target"),
            s = secOf(id);
          if (!s || !isShown(s)) {
            return;
          }
          closeSheet();
          lockUntil = Date.now() + 1200;
          clearTimeout(centerT);
          activeId = null;
          setActive(id, true);
          window.scrollTo({
            top: s.getBoundingClientRect().top + pageYOffset - 4,
            behavior: reduceMotion ? "auto" : "smooth",
          });
          setTimeout(function () {
            lockUntil = 0;
            setActive(computeActive());
          }, 1250);
        });
        doc.addEventListener("keydown", function (e) {
          if (e.key === "Escape" && nav.classList.contains("is-open")) {
            closeSheet();
          }
        });
        function updateMeter() {
          var v = Math.round(R * 100);
          if (v === meterLast) {
            return;
          }
          meterLast = v;
          mMask.style.transform = "scaleX(" + f1((1 - R) * 1000) / 1000 + ")";
          mDrop.style.left = v + "%";
          mVal.textContent = v + "% " + window.MELTING.t("real");
        }
        function numberLayers() {
          var list = [];
          each(doc.querySelectorAll("body > [data-section]"), function (s) {
            var id = s.getAttribute("data-section");
            if (id === "cover" || id === "closing" || !isShown(s)) {
              return;
            }
            list.push(s);
          });
          var N = list.length;
          list.forEach(function (s, i) {
            var id = s.getAttribute("data-section"),
              n = N - i;
            var lab = s.querySelector(".sec-kicker .layer");
            if (lab) {
              lab.textContent = window.MELTING.t("layer") + " " + pad2(n);
            }
            var num = doc.querySelector(
              '#dream-nav [data-nav-target="' + id + '"] .nav-num',
            );
            if (num) {
              num.textContent = pad2(n);
            }
            var tl = s.querySelector(".sec-title");
            if (tl) {
              tl.style.setProperty(
                "--soft-end",
                String(Math.round(lerp(85, 0, N > 1 ? i / (N - 1) : 1))),
              );
            }
          });
          var cn = doc.querySelector(
            '#dream-nav [data-nav-target="closing"] .nav-num',
          );
          if (cn) {
            cn.textContent = "00";
          }
        }

        /* gulir: satu pendengar untuk semuanya */
        var ticking = false;
        function onScroll() {
          if (ticking) {
            return;
          }
          ticking = true;
          requestAnimationFrame(function () {
            ticking = false;
            computeRt();
            if (Date.now() > lockUntil) {
              setActive(computeActive());
            }
            releaseBottom();
            closingScroll();
          });
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener(
          "resize",
          function () {
            onScroll();
            clearTimeout(centerT);
            centerT = setTimeout(function () {
              centerRail(true);
            }, 200);
          },
          { passive: true },
        );

        /* ================================================================
     MEMPELAI — cubit, lalu lukisannya berhenti meleleh
     ================================================================ */
        var couple = { both: 0 };
        function setupPortrait(who, letter, seedP) {
          var pre = "pc-" + who,
            art = $(pre + "-art"),
            card = $(pre);
          if (!art) {
            return;
          }
          var img = $(pre + "-img"),
            src = img ? img.getAttribute("href") || "" : "",
            mono = $(pre + "-mono-t");
          if (mono) {
            mono.textContent = letter;
          }
          if (!filled(src) && img) {
            img.parentNode.removeChild(img);
          }
          var fr = new MeltFrame(pre, {
            ax: 130,
            ay: 42,
            w: 200,
            h: 260,
            inset: 12,
            stretch: 0.32,
            imgY: 54,
            imgK: 0.58,
            sway: seedP,
            drips: [
              { x: -0.66, w: 0.12, L: 0.18, s: 0.9, p: seedP },
              { x: -0.12, w: 0.1, L: 0.3, s: 1.2, p: 2 + seedP },
              { x: 0.38, w: 0.13, L: 0.2, s: 0.8, p: 4 },
              { x: 0.78, w: 0.09, L: 0.25, s: 1.3, p: 1 },
            ],
          });
          var st = { m: reduceMotion ? 0 : 1, anim: false, real: false };
          addLoop(function (t) {
            if (!st.anim) {
              fr.draw(st.m, t + seedP);
            }
          }, art);
          if (reduceMotion) {
            fr.draw(1, 0);
          }
          var btn = $(pre + "-pinch");
          btn.addEventListener("click", function () {
            if (st.real) {
              return;
            }
            st.real = true;
            ac();
            sfx.pop();
            buzz(30);
            card.classList.add("is-pinching");
            setTimeout(function () {
              card.classList.remove("is-pinching");
            }, 520);
            st.anim = true;
            var from = st.m;
            tween(
              reduceMotion ? 1 : 1500,
              function (p) {
                st.m = from * (1 - easeBack(p));
                fr.draw(st.m, tNow + seedP);
              },
              function () {
                st.anim = false;
                st.m = 0;
                fr.draw(0, tNow);
                card.classList.add("is-real");
                sfx.chime(988);
                couple.both++;
                if (couple.both >= 2) {
                  $("sec-couple").classList.add("is-both");
                  var r = art.getBoundingClientRect();
                  burst(18, r.left + r.width / 2, r.top + r.height / 2);
                }
              },
            );
            btn.setAttribute("aria-pressed", "true");
          });
          var ig = $(pre + "-ig"),
            igv = txt(pre + "-ig-v");
          if (!filled(igv)) {
            hide(ig);
          } else {
            ig.setAttribute(
              "href",
              "https://instagram.com/" +
                encodeURIComponent(igv.replace(/^@/, "").trim()),
            );
          }
          var dr = txt(pre + "-dream-v");
          if (!filled(dr)) {
            hide($(pre + "-dream-wrap"));
          }
        }
        setupPortrait("groom", groomN.charAt(0).toUpperCase(), 0.3);
        setupPortrait("bride", brideN.charAt(0).toUpperCase(), 1.7);

        /* ================================================================
     JURNAL MIMPI (kisah)
     ================================================================ */
        (function () {
          var kept = 0;
          for (var i = 1; i <= window.MELTING.storyCount; i++) {
            var li = $("story-" + i);
            if (!li) {
              continue;
            }
            var ti = txt("story-" + i + "-title"),
              tx = txt("story-" + i + "-text");
            if (!filled(ti) && !filled(tx)) {
              li.parentNode.removeChild(li);
              continue;
            }
            kept++;
            if (!filled(ti)) {
              hide($("story-" + i + "-title"));
            }
            if (!filled(tx)) {
              hide($("story-" + i + "-text"));
            }
            if (!filled(txt("story-" + i + "-date"))) {
              hide($("story-" + i + "-date"));
            }
            var img = $("story-" + i + "-img"),
              src = img ? img.getAttribute("src") : "";
            if (filled(src)) {
              hide($("story-" + i + "-fb"));
            } else if (img) {
              img.parentNode.removeChild(img);
            }
            setTxt("story-" + i + "-num", window.MELTING.t("story") + pad2(kept));
            setTxt("story-" + i + "-badge", window.MELTING.t("dream") + pad2(kept));
            if (kept % 2 === 0) {
              li.classList.add("is-flip");
            }
          }
          if (!kept) {
            hideSection("story");
            return;
          }
          var list = $("story-list");
          var setH = function () {
            list.style.setProperty(
              "--thread-h",
              Math.max(200, list.offsetHeight) + "px",
            );
          };
          setH();
          window.addEventListener("resize", setH, { passive: true });
        })();

        /* ================================================================
     KITAB TAFSIR MIMPI
     ================================================================ */
        (function () {
          var tfClockG = $("tf-1-clock");
          var tfClock = tfClockG
            ? new MeltClock(tfClockG, {
                r: 28,
                drips: [
                  { x: -0.35, w: 0.16, L: 0.34, s: 1, p: 1, fs: 0.33 },
                  { x: 0.4, w: 0.13, L: 0.24, s: 0.8, p: 3, fs: 0.28 },
                ],
                ring: true,
                sway: 2,
              })
            : null;
          var tf = { m: reduceMotion ? 1 : 1, ring: 0, anim: false };
          if (tfClock) {
            addLoop(function (t) {
              if (!tf.anim) {
                tfClock.draw(
                  tf.m,
                  t,
                  angMix(t * 0.6, realH, 1 - tf.m),
                  angMix(-t * 2, realM, 1 - tf.m),
                  tf.ring,
                );
              }
            }, $("tf-1-art"));
          }
          var kept = 0;
          for (var i = 1; i <= 4; i++) {
            (function (i) {
              var li = $("tafsir-" + i);
              if (!li) {
                return;
              }
              var dr = txt("tafsir-" + i + "-dream"),
                mn = txt("tafsir-" + i + "-meaning");
              if (!filled(dr) && !filled(mn)) {
                li.parentNode.removeChild(li);
                return;
              }
              kept++;
              var roman = ["I", "II", "III", "IV"][kept - 1];
              var no = $("tf-" + i + "-no");
              if (no) {
                no.textContent = no.textContent.replace(
                  /^Bab [IV]+/,
                  "Bab " + roman,
                );
              }
              var btn = $("tf-" + i + "-btn");
              btn.addEventListener("click", function () {
                var on = !li.classList.contains("is-read");
                li.classList.toggle("is-read", on);
                btn.setAttribute("aria-expanded", on ? "true" : "false");
                ac();
                if (on) {
                  sfx.chime(i === 1 ? 784 : 880 + i * 60);
                } else {
                  sfx.whoosh();
                }
                if (i === 1 && tfClock) {
                  tf.anim = true;
                  var m0 = tf.m,
                    r0 = tf.ring;
                  tween(
                    reduceMotion ? 1 : 2200,
                    function (p) {
                      if (on) {
                        tf.m = m0 * (1 - easeOut(clamp(p / 0.55, 0, 1)));
                        tf.ring = r0 + (1 - r0) * smooth(0.5, 1, p);
                      } else {
                        tf.ring = r0 * (1 - smooth(0, 0.45, p));
                        tf.m =
                          m0 +
                          (1 - m0) * easeIn(clamp((p - 0.35) / 0.65, 0, 1));
                      }
                      tfClock.draw(
                        tf.m,
                        tNow,
                        angMix(tNow * 0.6, realH, 1 - tf.m),
                        angMix(-tNow * 2, realM, 1 - tf.m),
                        tf.ring,
                      );
                    },
                    function () {
                      tf.anim = false;
                    },
                  );
                }
              });
            })(i);
          }
          if (!kept) {
            hideSection("tafsir");
          }
        })();

        /* ================================================================
     HITUNG MUNDUR + KALENDER
     ================================================================ */
        (function () {
          var sec = $("sec-countdown"),
            cg = $("cd-clock");
          var cdClock = cg
            ? new MeltClock(cg, {
                r: 88,
                drips: [
                  { x: -0.5, w: 0.13, L: 0.24, s: 0.9, p: 0, fs: 0.3 },
                  { x: 0.1, w: 0.1, L: 0.36, s: 1.2, p: 2, fs: 0.35 },
                  { x: 0.6, w: 0.12, L: 0.2, s: 0.8, p: 4, fs: 0.27 },
                ],
                sec: true,
                stretch: 0.42,
              })
            : null;
          var cd = { m: reduceMotion ? 0 : 0.95, fixed: false };
          if (cdClock) {
            addLoop(function (t) {
              var n = new Date(),
                h = n.getHours(),
                mi = n.getMinutes(),
                se = n.getSeconds() + n.getMilliseconds() / 1000;
              var hA = (((h % 12) + mi / 60) / 12) * Math.PI * 2,
                mA = ((mi + se / 60) / 60) * Math.PI * 2,
                sA = (se / 60) * Math.PI * 2;
              var k = 1 - cd.m;
              cdClock.draw(
                cd.m,
                t,
                angMix(t * 0.4, hA, k),
                angMix(-t * 1.6, mA, k),
                0,
                angMix(t * 3, sA, k),
              );
            }, $("cd-clock-wrap"));
            whenRevealed($("cd-card"), function () {
              if (cd.fixed) {
                return;
              }
              cd.fixed = true;
              var m0 = cd.m;
              tween(2600, function (p) {
                cd.m = m0 * (1 - easeIO(p));
              });
            });
          }
          var cells = {
              d: $("cd-days"),
              h: $("cd-hours"),
              m: $("cd-mins"),
              s: $("cd-secs"),
            },
            prev = {};
          function put(k, v) {
            var s = pad2(v);
            if (prev[k] !== s) {
              prev[k] = s;
              var c = cells[k];
              c.textContent = s;
              c.classList.remove("tick");
              void c.offsetWidth;
              c.classList.add("tick");
            }
          }
          var timer = 0;
          function tick() {
            if (!wedDate) {
              hide($("cd-grid"));
              return;
            }
            var diff = wedDate.getTime() - Date.now();
            if (diff <= 0) {
              clearInterval(timer);
              sec.classList.add("is-today");
              if (diff < -86400000) {
                setTxt(
                  "cd-done",
                  window.MELTING.t("thanks"),
                );
              }
              return;
            }
            var s = Math.floor(diff / 1000);
            put("d", Math.floor(s / 86400));
            put("h", Math.floor((s % 86400) / 3600));
            put("m", Math.floor((s % 3600) / 60));
            put("s", s % 60);
          }
          tick();
          timer = setInterval(tick, 1000);
          /* kalender */
          var end1 = null;
          var start = wedDate,
            end =
              end1 && wedDate && end1 > wedDate
                ? end1
                : wedDate
                  ? new Date(wedDate.getTime() + 2 * 3600000)
                  : null;
          function ics(d) {
            return d
              .toISOString()
              .replace(/[-:]/g, "")
              .replace(/\.\d{3}/, "");
          }
          var title = window.MELTING.eventLabel + " " + groomN + " & " + brideN,
            vName = txt("venue-name"),
            vAddr = txt("venue-addr");
          var loc = [vName, vAddr].filter(filled).join(", ");
          var gcal = $("cd-gcal"),
            icsBtn = $("cd-ics");
          if (!start) {
            hide($("cd-actions"));
            return;
          }
          gcal.setAttribute(
            "href",
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
              encodeURIComponent(title) +
              "&dates=" +
              ics(start) +
              "/" +
              ics(end) +
              "&location=" +
              encodeURIComponent(loc) +
              "&details=" +
              encodeURIComponent(window.MELTING.t("signature")),
          );
          icsBtn.addEventListener("click", function () {
            var esc = function (s) {
              return String(s)
                .replace(/[\\,;]/g, function (c) {
                  return "\\" + c;
                })
                .replace(/\n/g, "\\n");
            };
            var lines = [
              "BEGIN:VCALENDAR",
              "VERSION:2.0",
              "PRODID:-//Melting Reality//ID",
              "CALSCALE:GREGORIAN",
              "BEGIN:VEVENT",
              "UID:" +
                ics(start) +
                "-" +
                Math.random().toString(36).slice(2) +
                "@undangan",
              "DTSTAMP:" + ics(new Date()),
              "DTSTART:" + ics(start),
              "DTEND:" + ics(end),
              "SUMMARY:" + esc(title),
              "LOCATION:" + esc(loc),
              "DESCRIPTION:" + esc(window.MELTING.t("signature")),
              "BEGIN:VALARM",
              "TRIGGER:-P1D",
              "ACTION:DISPLAY",
              "DESCRIPTION:" + esc(title),
              "END:VALARM",
              "END:VEVENT",
              "END:VCALENDAR",
            ];
            var blob = new Blob([lines.join("\r\n")], {
              type: "text/calendar;charset=utf-8",
            });
            var a = el(
              "a",
              {
                href: URL.createObjectURL(blob),
                download: "taklifnoma.ics",
              },
              body,
              "ics-link",
            );
            a.click();
            setTimeout(function () {
              URL.revokeObjectURL(a.href);
              body.removeChild(a);
            }, 400);
            toast(window.MELTING.t("calendar"));
          });
        })();

        /* ================================================================
     ACARA
     ================================================================ */
        (function () {
          var placeId = "",
            hasPlace = filled(placeId);
          var vName = txt("ev-1-venue"),
            vAddr = txt("ev-1-addr");
          function searchLink(q) {
            return (
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent(q)
            );
          }
          if (!hasPlace) {
            var q1 = [vName, vAddr].filter(filled).join(", ");
            each([$("ev-1-map"), $("venue-dir")], function (a) {
              if (!a) {
                return;
              }
              if (q1) {
                a.setAttribute("href", searchLink(q1));
              } else {
                hide(a);
              }
            });
          }
          if (wedDate) {
            setTxt("ev-1-day", fmtDay(wedDate));
            setTxt("ev-1-date", fmtDate(wedDate));
            var e1 = "";
            setTxt("ev-1-time-v", fmtTime(wedDate) + (e1 ? " – " + e1 : ""));
          } else {
            hide($("ev-1-day"));
            hide($("ev-1-date"));
            hide($("ev-1-time"));
          }
          if (!filled(txt("ev-1-note"))) {
            hide($("ev-1-note"));
          }
          var ev2 = $("ev-2"),
            n2 = txt("ev-2-name");
          if (!filled(n2)) {
            hide(ev2);
            $("ev-grid").classList.add("is-single");
          } else {
            var d2 = parseDT(
              window.MELTING.dateTime.slice(0,10),
              "00:00",
            );
            if (d2) {
              setTxt("ev-2-day", fmtDay(d2));
              setTxt("ev-2-date", fmtDate(d2));
              var e2 = "";
              setTxt("ev-2-time-v", fmtTime(d2) + (e2 ? " – " + e2 : ""));
            } else {
              hide($("ev-2-day"));
              hide($("ev-2-date"));
              hide($("ev-2-time"));
            }
            var v2 = txt("ev-2-venue"),
              a2 = txt("ev-2-addr");
            if (!filled(v2)) {
              setTxt("ev-2-venue", vName);
              v2 = vName;
            }
            if (!filled(a2)) {
              setTxt("ev-2-addr", vAddr);
              a2 = vAddr;
            }
            if (!filled(txt("ev-2-note"))) {
              hide($("ev-2-note"));
            }
            var same = a2 === vAddr;
            var m2 = $("ev-2-map");
            if (same && hasPlace) {
              m2.setAttribute("href", $("ev-1-map").getAttribute("href"));
            } else {
              var q2 = [v2, a2].filter(filled).join(", ");
              if (q2) {
                m2.setAttribute("href", searchLink(q2));
              } else {
                hide(m2);
              }
            }
          }
          /* jam kecil di tiap kartu */
          [
            ["ev-1-clock", wedDate],
            [
              "ev-2-clock",
              n2 && filled(n2)
                ? parseDT(
                    window.MELTING.dateTime.slice(0,10),
                    "00:00",
                  )
                : null,
            ],
          ].forEach(function (pair, i) {
            var g = $(pair[0]);
            if (!g) {
              return;
            }
            var d = pair[1],
              h = d ? window.MELTING.hours : 9,
              mi = d ? window.MELTING.minutes : 0;
            var ha = (((h % 12) + mi / 60) / 12) * Math.PI * 2,
              ma = (mi / 60) * Math.PI * 2;
            var ck = new MeltClock(g, {
              r: 34,
              drips: [
                { x: -0.4, w: 0.15, L: 0.3, s: 1, p: i, fs: 0.3 },
                { x: 0.35, w: 0.12, L: 0.22, s: 0.8, p: 2 + i, fs: 0.26 },
              ],
              sway: i * 2,
            });
            var st = { m: reduceMotion ? 0 : 0.95 };
            addLoop(function (t) {
              var k = 1 - st.m;
              ck.draw(
                st.m,
                t + i * 3,
                angMix(t * 0.5 + i, ha, k),
                angMix(-t * 1.7, ma, k),
              );
            }, g.ownerSVGElement);
            whenRevealed($("ev-" + (i + 1)), function () {
              var m0 = st.m;
              tween(2200, function (p) {
                st.m = m0 * (1 - easeIO(p));
              });
            });
          });
          /* siaran langsung */
          var link = $("ev-live-link"),
            href = link ? link.getAttribute("href") || "" : "";
          if (!filled(href) || !/^https?:/i.test(href)) {
            hide($("ev-live"));
          } else {
            var mt = href.match(
              /(?:youtu\.be\/|[?&]v=|embed\/|live\/|shorts\/)([\w-]{11})/,
            );
            if (mt) {
              var lf = $("ev-live-frame");
              lf.setAttribute(
                "allow",
                "autoplay; encrypted-media; picture-in-picture",
              );
              lf.setAttribute("allowfullscreen", "");
              lf.setAttribute("src", "https://www.youtube.com/embed/" + mt[1]);
            } else {
              hide($("ev-live-embed"));
            }
          }
        })();

        /* ================================================================
     SUSUNAN ACARA — tangga melayang
     ================================================================ */
        var ICONS = {
          heart:
            "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
          users:
            "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 4.5a3.3 3.3 0 0 1 0 6.4M18 14c2.2.6 3.5 2.8 3.5 6",
          utensils:
            "M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.5 1.5-3.5 4-3.5 7.5H17",
          camera:
            "M4 8h3l1.5-2.5h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
          mic2: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7",
          cake: "M4 21h16M5 21v-7h14v7M5 16.5c2 1.5 4 1.5 7 0s5-1.5 7 0M12 14V9M12 6.5c-1 0-1.5-.8-1.5-1.6S12 3 12 3s1.5 1.1 1.5 1.9-.5 1.6-1.5 1.6z",
          music:
            "M9 18.5V5.5l10-2v12.5M9 18.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM19 16a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z",
          gift: "M4.5 9.5h15v11h-15zM3 6.5h18v3H3zM12 6.5v14M12 6.5c-1.5-3-5-3.5-5-1.5s3 1.5 5 1.5c2 0 5 .5 5-1.5s-3.5-1.5-5 1.5z",
          "party-popper":
            "M4 20l4.5-12 7.5 7.5zM13 4.5c1 1.5.5 3-1 3.5M17 8c1.5-1 3-.5 3.5 1M15.5 3.5l.5 1.5M20 12.5l-1.5.5",
          sparkles:
            "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z",
          flower2:
            "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM12 8.5V5a3 3 0 0 1 3 3M12 8.5V5a3 3 0 0 0-3 3M15.5 12H19a3 3 0 0 1-3 3M8.5 12H5a3 3 0 0 0 3 3M12 15.5V21",
          home: "M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5M10 20v-5h4v5",
          car: "M5 16.5h14M4 16.5V12l2-4.5h12l2 4.5v4.5M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM4 12h16",
          shirt:
            "M8.5 4L4 6.5 5.5 11 8 10v10h8V10l2.5 1L20 6.5 15.5 4c-.5 1.5-2 2.5-3.5 2.5S9 5.5 8.5 4z",
          clock: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM12 7.5V12l3 2",
          star: "M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8z",
        };
        (function () {
          var items = [];
          try {
            items = JSON.parse(
              ($("wedivo-rundown-data") || {}).textContent || "[]",
            );
          } catch (e) {
            items = [];
          }
          if (!Array.isArray(items)) {
            items = [];
          }
          items = items.filter(function (it) {
            return it && filled(it.title);
          });
          if (!items.length) {
            hideSection("rundown");
            return;
          }
          var wrap = $("rd-stairs"),
            dates = [],
            multi;
          items.forEach(function (it) {
            if (dates.indexOf(it.date) < 0) {
              dates.push(it.date);
            }
          });
          multi = dates.length > 1;
          var lastDate = null,
            n = 0;
          items.forEach(function (it, i) {
            if (multi && it.date !== lastDate) {
              var dd = parseDT(it.date, "00:00");
              var h = el("p", { class: "rd-day reveal" }, wrap, "rd-day-" + i);
              h.textContent = dd ? fmtDay(dd) + ", " + fmtDate(dd) : it.date;
              watchReveal(h);
              n = 0;
            }
            lastDate = it.date;
            var step = el(
              "article",
              { class: "rd-step reveal " + (n % 2 ? "right" : "left"), "data-program-id": it.id },
              wrap,
              "rd-step-" + i,
            );
            step.style.setProperty(
              "--f",
              String([0, 0.55, 1, 0.45, 0.1][n % 5]),
            );
            step.style.setProperty("--d", f1((n % 3) * 0.08) + "s");
            var inn = el(
              "div",
              { class: "rd-step-in" },
              step,
              "rd-step-in-" + i,
            );
            inn.style.setProperty("--bd", f1(5.5 + (i % 4) * 0.8) + "s");
            inn.style.setProperty("--bl", f1(-i * 1.1) + "s");
            var ico = el(
              "span",
              { class: "rd-ico", "aria-hidden": "true" },
              inn,
              "rd-ico-" + i,
            );
            var svg = sv("svg", { viewBox: "0 0 24 24" }, ico, "rd-ico-s-" + i);
            sv(
              "path",
              { d: ICONS[it.icon] || ICONS.clock },
              svg,
              "rd-ico-p-" + i,
            );
            var time = it.isAllDay
              ? window.MELTING.t("today")
              : [hm(it.startTime || ""), hm(it.endTime || "")]
                  .filter(Boolean)
                  .join(" – ");
            if (time) {
              el("p", { class: "rd-time" }, inn, "rd-time-" + i).textContent =
                time + (time !== window.MELTING.t("today") && tz ? " " + tz : "");
            }
            el("h3", { class: "rd-title" }, inn, "rd-title-" + i).textContent =
              it.title;
            if (filled(it.location)) {
              el("p", { class: "rd-loc" }, inn, "rd-loc-" + i).textContent =
                it.location;
            }
            if (filled(it.description)) {
              el("p", { class: "rd-desc" }, inn, "rd-desc-" + i).textContent =
                it.description;
            }
            watchReveal(step);
            n++;
          });
        })();

        /* ================================================================
     UJI REALITAS
     ================================================================ */
        (function () {
          var sec = $("sec-realitas");
          if (!sec) {
            return;
          }
          var done = {},
            count = 0;
          function pass(key) {
            if (done[key]) {
              return;
            }
            done[key] = true;
            count++;
            $("rc-" + key).classList.add("is-done");
            setTxt("rc-score", count + "/4");
            var dot = $("rc-dot-" + count);
            if (dot) {
              dot.classList.add("on");
            }
            ac();
            sfx.chime(660 + count * 110);
            if (count === 4) {
              sec.classList.add("is-proven");
              sfx.thud();
              buzz([20, 40, 20]);
              var m = $("rc-meter").getBoundingClientRect();
              burst(26, m.left + m.width / 2, m.top);
            }
          }
          /* uji jam */
          var disp = $("rc-clock-display"),
            glitch = 0,
            notes = [
              window.MELTING.t("floating"),
              window.MELTING.t("floating"),
              window.MELTING.t("floating"),
              window.MELTING.t("floating"),
            ];
          function rndTime() {
            return (
              pad2(13 + Math.floor(Math.random() * 27)) +
              "." +
              pad2(60 + Math.floor(Math.random() * 39))
            );
          }
          function glitchOn() {
            if (glitch || done.clock) {
              return;
            }
            glitch = setInterval(function () {
              if (!isShown(disp)) {
                return;
              }
              disp.innerHTML = "";
              disp.appendChild(doc.createTextNode(rndTime()));
              var sm = el("small", null, disp, "rc-clock-sub");
              sm.textContent = notes[Math.floor(Math.random() * notes.length)];
            }, 620);
          }
          glitchOn();
          $("rc-clock-btn").addEventListener("click", function () {
            clearInterval(glitch);
            glitch = 0;
            disp.classList.remove("is-glitch");
            disp.innerHTML = "";
            disp.appendChild(
              doc.createTextNode(
                wedDate
                  ? pad2(window.MELTING.day) +
                      "." +
                      pad2(window.MELTING.month) +
                      "." +
                      window.MELTING.year
                  : "—",
              ),
            );
            var sm = el("small", null, disp, "rc-clock-sub");
            sm.textContent = wedDate
              ? fmtTime(wedDate) + (tz ? " " + tz : "") + window.MELTING.t("same")
              : window.MELTING.t("same");
            pass("clock");
          });
          /* uji baca */
          var rt = $("rc-read-text"),
            finalT = txt("rc-read-final"),
            scr = 0;
          if (!filled(finalT)) {
            finalT = groomN + " & " + brideN + " · " + window.MELTING.eventLabel;
          }
          var abc = "abcdefghijklmnoprstuwyAEIKMNRS";
          function scramble(s, keep) {
            return s
              .split("")
              .map(function (c, i) {
                return i < keep || /[\s.,!?'"\-—]/.test(c)
                  ? c
                  : abc.charAt(Math.floor(Math.random() * abc.length));
              })
              .join("");
          }
          rt.textContent = scramble(finalT, 0);
          scr = setInterval(function () {
            if (!done.read && isShown(rt)) {
              rt.textContent = scramble(finalT, 0);
            }
          }, 700);
          $("rc-read-btn").addEventListener("click", function () {
            if (done.read) {
              return;
            }
            clearInterval(scr);
            var k = 0,
              L = finalT.length;
            var step = function () {
              k += Math.max(1, Math.ceil(L / 26));
              rt.textContent = scramble(finalT, k);
              if (k < L) {
                setTimeout(step, 45);
              } else {
                rt.textContent = finalT;
                rt.classList.remove("is-scrambled");
                rt.style.fontVariationSettings = '"SOFT" 0, "WONK" 0';
                pass("read");
              }
            };
            if (reduceMotion) {
              k = L;
            }
            step();
          });
          /* uji cubit */
          var pc = $("rc-pinch");
          $("rc-pinch-btn").addEventListener("click", function () {
            pc.classList.add("is-pinch");
            ac();
            sfx.pop();
            buzz(40);
            setTimeout(function () {
              pc.classList.remove("is-pinch");
              pass("pinch");
            }, 480);
          });
          /* uji lompat */
          var jc = $("rc-jump"),
            fig = $("rc-jump-fig"),
            dust2 = $("rc-jump-dust"),
            tries = 0;
          $("rc-jump-btn").addEventListener("click", function () {
            if (done.jump) {
              fig.classList.remove("is-jump");
              void fig.getBoundingClientRect();
              fig.classList.add("is-jump");
              return;
            }
            tries++;
            ac();
            if (tries === 1) {
              fig.classList.remove("is-float");
              void fig.getBoundingClientRect();
              fig.classList.add("is-float");
              sfx.whoosh();
              setTimeout(
                function () {
                  jc.classList.add("is-floaty");
                  setTxt("rc-jump-btn", window.MELTING.t("jump"));
                },
                reduceMotion ? 0 : 1400,
              );
            } else {
              jc.classList.remove("is-floaty");
              fig.classList.remove("is-float");
              void fig.getBoundingClientRect();
              fig.classList.add("is-jump");
              dust2.classList.remove("is-puff");
              void dust2.getBoundingClientRect();
              dust2.classList.add("is-puff");
              setTimeout(
                function () {
                  sfx.thud();
                  buzz(25);
                  pass("jump");
                  setTxt("rc-jump-btn", window.MELTING.t("jump"));
                },
                reduceMotion ? 0 : 780,
              );
            }
          });
        })();

        /* ================================================================
     LOKASI — pintu yang dibuka
     ================================================================ */
        (function () {
          var scene = $("door-scene"),
            leaf = $("door-leaf"),
            map = $("venue-map"),
            loaded = false;
          var src = map ? map.getAttribute("data-src") || "" : "";
          var key = (src.match(/key=([^&]*)/) || [])[1] || "",
            pid = (src.match(/place_id:(.*)$/) || [])[1] || "";
          var canMap = filled(key) && filled(pid);
          if (!canMap && map) {
            map.parentNode.removeChild(map);
            map = null;
          }
          leaf.addEventListener("click", function () {
            scene.classList.add("is-open");
            ac();
            sfx.creak();
            if (map && !loaded) {
              loaded = true;
              map.setAttribute("src", src.replace(/&amp;/g, "&"));
            }
            setTimeout(function () {
              var c = $("door-close");
              if (c) {
                c.focus({ preventScroll: true });
              }
            }, 1500);
          });
          $("door-close").addEventListener("click", function () {
            scene.classList.remove("is-open");
            sfx.creak();
            leaf.focus({ preventScroll: true });
          });
          if (!filled(txt("venue-note"))) {
            hide($("venue-note"));
          }
          $("venue-copy").addEventListener("click", function () {
            copyText(
              [txt("venue-name"), txt("venue-addr")].filter(filled).join(", "),
              window.MELTING.t("copied"),
            );
          });
        })();

        /* ================================================================
     BUSANA — palet cat
     ================================================================ */
        (function () {
          var models = $("dc-models"),
            picked = $("dc-picked"),
            brush = $("dcp-bristle"),
            ok = 0,
            firstC = null;
          function validColor(c) {
            if (!filled(c)) {
              return false;
            }
            if (window.CSS && CSS.supports) {
              return CSS.supports("color", c);
            }
            return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c);
          }
          for (var i = 1; i <= window.MELTING.colorCount; i++) {
            (function (i) {
              var b = $("dc-sw-" + i),
                chip = $("dc-chip-" + i);
              if (!b) {
                return;
              }
              var c = (
                  getComputedStyle(b).getPropertyValue("--c") || ""
                ).trim(),
                name = (b.getAttribute("data-name") || "").trim();
              if (!validColor(c)) {
                hide(b);
                hide(chip);
                return;
              }
              ok++;
              if (!firstC) {
                firstC = c;
              }
              if (!filled(name)) {
                name = c.toUpperCase();
                setTxt("dc-chip-" + i + "-n", name);
                b.setAttribute("aria-label", name);
              }
              b.addEventListener("click", function () {
                each(doc.querySelectorAll(".dc-sw"), function (x) {
                  x.classList.remove("is-picked");
                  x.setAttribute("aria-pressed", "false");
                });
                b.classList.add("is-picked");
                b.setAttribute("aria-pressed", "true");
                models.style.setProperty("--pick", c);
                if (brush) {
                  brush.style.fill = c;
                }
                picked.textContent = window.MELTING.t("select") + name;
                ac();
                sfx.pop();
              });
            })(i);
          }
          if (firstC) {
            models.style.setProperty("--pick", firstC);
            if (brush) {
              brush.style.fill = firstC;
            }
          }
          if (!ok) {
            hide($("dc-palette"));
            hide($("dc-legend"));
            hide(picked);
          }
          if (!filled(txt("dc-text")) && !ok) {
            hideSection("dresscode");
          }
        })();

        /* ================================================================
     GALERI — kenangan yang digantung & meleleh
     ================================================================ */
        var gUrls = window.MELTING.gallery.map(function(item){return item.src;});
        var viewer = $("viewer"),
          vImg = $("viewer-img"),
          vIdx = 0,
          vOpen = false,
          lastFocus = null;
        (function () {
          var grid = $("gal-grid");
          if (!gUrls.length) {
            hideSection("gallery");
            return;
          }
          if (!filled(txt("gal-note"))) {
            hide($("gal-note"));
          }
          gUrls.forEach(function (url, i) {
            var cell = el(
              "button",
              {
                class: "g-cell reveal melt",
                type: "button",
                "aria-label": window.MELTING.t("photo") + (i + 1) + window.MELTING.t("photo") + gUrls.length,
              },
              grid,
              "g-cell-" + i,
            );
            cell.style.setProperty("--oy", (i % 2 ? 26 : 0) + "px");
            cell.style.setProperty("--rot", f1((rnd() - 0.5) * 3.4) + "deg");
            cell.style.setProperty("--d", f1((i % 3) * 0.09) + "s");
            var s = sv(
              "svg",
              { viewBox: "0 0 300 470", "aria-hidden": "true" },
              cell,
              "g-svg-" + i,
            );
            var defs = sv("defs", null, s, "g-defs-" + i);
            var cp = sv("clipPath", null, defs, "g-clip-" + i);
            sv("path", { d: "M0 0" }, cp, "g-clip-" + i + "-path");
            var hang = sv("g", { class: "g-hang" }, s, "g-hang-" + i);
            hang.style.setProperty("--sw", f1(5 + rnd() * 3) + "s");
            hang.style.setProperty("--sl", f1(-rnd() * 6) + "s");
            sv(
              "path",
              {
                d: "M150 6 L46 44 M150 6 L254 44",
                stroke: "#e4bd6a",
                "stroke-width": "2",
                fill: "none",
              },
              hang,
              "g-str-" + i,
            );
            sv(
              "circle",
              {
                cx: "150",
                cy: "6",
                r: "6",
                fill: "#d4a24c",
                stroke: "#7e5620",
                "stroke-width": "1",
              },
              hang,
              "g-pin-" + i,
            );
            sv(
              "path",
              {
                class: "g-frame",
                d: "M0 0",
                fill: "#f6eedf",
                stroke: "#c99a4b",
                "stroke-width": "2",
              },
              hang,
              "g-" + i + "-frame",
            );
            var ph = sv(
              "g",
              { "clip-path": "url(#g-clip-" + i + ")" },
              hang,
              "g-ph-" + i,
            );
            sv(
              "rect",
              {
                x: "30",
                y: "40",
                width: "240",
                height: "430",
                fill: "#3c2c55",
              },
              ph,
              "g-bg-" + i,
            );
            sv(
              "image",
              {
                href: url,
                x: "42",
                y: "52",
                width: "216",
                height: "296",
                preserveAspectRatio: "xMidYMid slice",
              },
              ph,
              "g-" + i + "-img",
            );
            var fr = new MeltFrame("g-" + i, {
              ax: 150,
              ay: 42,
              w: 240,
              h: 318,
              inset: 10,
              stretch: 0.2,
              imgY: 52,
              imgK: 0.36,
              sway: i,
              drips: [
                {
                  x: -0.6 + rnd() * 0.2,
                  w: 0.12,
                  L: 0.12 + rnd() * 0.08,
                  s: 0.9,
                  p: i,
                },
                {
                  x: -0.05 + rnd() * 0.2,
                  w: 0.1,
                  L: 0.16 + rnd() * 0.08,
                  s: 1.1,
                  p: i + 2,
                },
                {
                  x: 0.55 + rnd() * 0.2,
                  w: 0.11,
                  L: 0.1 + rnd() * 0.08,
                  s: 0.8,
                  p: i + 4,
                },
              ],
            });
            fr.clip = $("g-clip-" + i + "-path");
            var st = { m: 0.8, target: 0.8, raf: 0 };
            fr.draw(st.m, i * 0.7);
            var go = function (to) {
              if (reduceMotion) { st.m = to; fr.draw(to, 0); return; }
              st.target = to;
              if (st.raf) {
                return;
              }
              var from = st.m,
                t0 = performance.now();
              var step = function (now) {
                var p = clamp((now - t0) / 650, 0, 1);
                st.m = lerp(from, st.target, easeOut(p));
                fr.draw(st.m, i * 0.7);
                if (p < 1) {
                  st.raf = requestAnimationFrame(step);
                } else {
                  st.raf = 0;
                  if (st.m !== st.target) {
                    go(st.target);
                  }
                }
              };
              st.raf = requestAnimationFrame(step);
            };
            cell.addEventListener("pointerenter", function () {
              go(0);
            });
            cell.addEventListener("pointerleave", function () {
              go(0.8);
            });
            cell.addEventListener("focus", function () {
              go(0);
            });
            cell.addEventListener("blur", function () {
              go(0.8);
            });
            cell.addEventListener("click", function () {
              openViewer(i);
            });
            watchReveal(cell);
          });
          viewer.classList.toggle("is-single", gUrls.length <= 1);
        })();
        function showV(i) {
          vIdx = (i + gUrls.length) % gUrls.length;
          vImg.src = gUrls[vIdx];
          vImg.alt = window.MELTING.gallery[vIdx].alt || window.MELTING.gallery[vIdx].caption || window.MELTING.t("photo");
          setTxt("viewer-count", pad2(vIdx + 1) + " / " + pad2(gUrls.length));
        }
        function openViewer(i) {
          if (!gUrls.length) {
            return;
          }
          showV(i);
          lastFocus = doc.activeElement;
          vOpen = true;
          viewer.classList.add("is-mounted");
          viewer.setAttribute("aria-hidden", "false");
          lock(true);
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              viewer.classList.add("is-open");
            });
          });
          setTimeout(function () {
            $("viewer-close").focus({ preventScroll: true });
          }, 60);
        }
        function closeViewer() {
          if (!vOpen) {
            return;
          }
          vOpen = false;
          viewer.classList.remove("is-open");
          viewer.setAttribute("aria-hidden", "true");
          lock(false);
          setTimeout(
            function () {
              if (!vOpen) {
                viewer.classList.remove("is-mounted");
              }
            },
            reduceMotion ? 50 : 700,
          );
          if (lastFocus && lastFocus.focus) {
            lastFocus.focus({ preventScroll: true });
          }
        }
        function swapV(dir) {
          if (gUrls.length <= 1) {
            return;
          }
          if (reduceMotion) {
            showV(vIdx + dir);
            return;
          }
          viewer.classList.add("is-swap");
          setTimeout(function () {
            showV(vIdx + dir);
            viewer.classList.remove("is-swap");
          }, 240);
        }
        $("viewer-close").addEventListener("click", closeViewer);
        $("viewer-backdrop").addEventListener("click", closeViewer);
        $("viewer-prev").addEventListener("click", function () {
          swapV(-1);
        });
        $("viewer-next").addEventListener("click", function () {
          swapV(1);
        });
        doc.addEventListener("keydown", function (e) {
          if (!vOpen) {
            return;
          }
          if (e.key === "ArrowLeft") {
            swapV(-1);
          } else if (e.key === "ArrowRight") {
            swapV(1);
          } else if (e.key === "Escape") {
            closeViewer();
          }
        });
        (function () {
          var sx = 0,
            sy = 0;
          viewer.addEventListener(
            "touchstart",
            function (e) {
              var t = e.changedTouches[0];
              sx = t.clientX;
              sy = t.clientY;
            },
            { passive: true },
          );
          viewer.addEventListener(
            "touchend",
            function (e) {
              var t = e.changedTouches[0],
                dx = t.clientX - sx,
                dy = t.clientY - sy;
              if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
                swapV(dx < 0 ? 1 : -1);
              }
            },
            { passive: true },
          );
        })();

        /* ================================================================
     HADIAH — kotak berkaki panjang yang akhirnya mendarat
     ================================================================ */
        (function () {
          var form = $("gift-form"),
            scene = $("gift-scene"),
            landed = false;
          if (form && window.MutationObserver) {
            new MutationObserver(function () {
              if (!landed && form.classList.contains("is-submitted")) {
                landed = true;
                scene.classList.add("is-sent");
                ac();
                sfx.whoosh();
                setTimeout(
                  function () {
                    sfx.thud();
                    buzz(30);
                    var r = scene.getBoundingClientRect();
                    burst(20, r.left + r.width / 2, r.top + r.height * 0.55);
                  },
                  reduceMotion ? 0 : 1150,
                );
              }
            }).observe(form, { attributes: true, attributeFilter: ["class"] });
          }
          var addr = txt("gift-address");
          if (!filled(addr)) {
            hide($("gift-addr-box"));
          }
          $("gift-copy").addEventListener("click", function () {
            copyText(addr, window.MELTING.t("copied"));
          });
          if (!filled(txt("gift-intro"))) {
            hide($("gift-intro"));
          }
        })();

        /* ================================================================
     KEHADIRAN — gasing penentu
     ================================================================ */
        (function () {
          var scene = $("gasing-scene"),
            cap = $("gasing-caption"),
            form = $("rsvp-form"),
            status = "";
          var lines = {
            attending: window.MELTING.t("yes"),
            not_attending:
              window.MELTING.t("no"),
            maybe:
              window.MELTING.t("maybe"),
          };
          each(
            doc.querySelectorAll("#rsvp-form [data-wedivo-status]"),
            function (b) {
              b.addEventListener("click", function () {
                status = b.getAttribute("data-wedivo-status");
                scene.classList.remove("is-fallen", "is-dreamy", "is-wobble");
                scene.classList.add(
                  status === "attending"
                    ? "is-fallen"
                    : status === "maybe"
                      ? "is-wobble"
                      : "is-dreamy",
                );
                cap.textContent = lines[status] || cap.textContent;
                ac();
                if (status === "attending") {
                  setTimeout(sfx.thud, reduceMotion ? 0 : 700);
                  buzz(25);
                } else {
                  sfx.pop();
                }
              });
            },
          );
          if (form && window.MutationObserver) {
            var thanked = false;
            new MutationObserver(function () {
              if (!thanked && form.classList.contains("is-submitted")) {
                thanked = true;
                cap.textContent =
                  status === "attending"
                    ? window.MELTING.t("sent")
                    : status === "maybe"
                      ? window.MELTING.t("sent")
                      : window.MELTING.t("sent");
                if (status === "attending") {
                  var r = scene.getBoundingClientRect();
                  burst(22, r.left + r.width / 2, r.top + r.height / 2);
                  sfx.chime(988);
                }
              }
            }).observe(form, { attributes: true, attributeFilter: ["class"] });
          }
          if (!filled(txt("rsvp-deadline"))) {
            hide($("rsvp-deadline"));
          }
          if (!filled(txt("rsvp-intro"))) {
            hide($("rsvp-intro"));
          }
        })();

        /* ================================================================
     UCAPAN — mimpi baik yang melayang
     ================================================================ */
        (function () {
          var list = $("wish-list"),
            cnt = $("wish-count-n"),
            cntT = $("wish-count-t"),
            boot = true,
            wn = 0;
          function dress() {
            var cards = list.children;
            for (var i = 0; i < cards.length; i++) {
              var c = cards[i];
              if (!c.getAttribute("data-mr")) {
                c.setAttribute("data-mr", "1");
                if (!c.id) {
                  c.id = "wish-card-" + ++wn;
                }
                each(c.querySelectorAll("*"), function (x, k) {
                  if (!x.id) {
                    x.id = c.id + "-" + k;
                  }
                });
                c.style.setProperty("--wx", f1(rnd() * 12) + "%");
                c.style.setProperty("--wd", f1(6 + rnd() * 3) + "s");
                c.style.setProperty("--wl", f1(-rnd() * 6) + "s");
                if (!boot) {
                  c.classList.add("is-new");
                  (function (cc) {
                    setTimeout(function () {
                      cc.classList.remove("is-new");
                    }, 1300);
                  })(c);
                }
              }
            }
            var n = cards.length;
            cnt.textContent = String(n);
            cntT.textContent = n
              ? window.MELTING.t("wishes")
              : window.MELTING.t("wishes");
          }
          dress();
          if (window.MutationObserver) {
            new MutationObserver(dress).observe(list, { childList: true });
          }
          setTimeout(function () {
            boot = false;
          }, 2500);
          var form = $("wish-form");
          if (form) {
            form.addEventListener("submit", function () {
              boot = false;
            });
          }
          if (!filled(txt("wish-intro"))) {
            hide($("wish-intro"));
          }
        })();

        /* ================================================================
     PENUTUP
     ================================================================ */
        (function () {
          var img = $("closing-ring-img"),
            src = img ? img.getAttribute("src") : "";
          var ring = $("closing-ring");
          setTxt(
            "closing-ring-mono",
            groomN.charAt(0).toUpperCase() +
              "&" +
              brideN.charAt(0).toUpperCase(),
          );
          if (!filled(src)) {
            ring.classList.add("no-photo");
          } else if (img) {
            img.addEventListener("error", function () {
              ring.classList.add("no-photo");
            });
          }
          var tag = txt("closing-hashtag");
          if (!filled(tag)) {
            hide($("closing-hashtag"));
          }
          $("closing-hashtag").addEventListener("click", function () {
            copyText(tag, window.MELTING.t("copied"));
            sfx.pop();
          });
          $("closing-again").addEventListener("click", function () {
            ac();
            sfx.whoosh();
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
          });
          ["closing-text", "closing-family", "closing-salam"].forEach(
            function (id) {
              if (!filled(txt(id))) {
                hide($(id));
              }
            },
          );
        })();
        var closingBurst = false;
        function closingScroll() {
          if (closingBurst || R < 0.985 || reduceMotion) {
            return;
          }
          closingBurst = true;
          burst(30, innerWidth * (desk ? 0.27 : 0.5), innerHeight * 0.4);
        }

        /* ================================================================
     MUSIK
     ================================================================ */
        var bgm = $("bgm"),
          mBtn = $("music-btn"),
          mSrc = window.MELTING.musicEnabled ? (bgm ? bgm.getAttribute("src") || "" : "") : "",
          hasMusic = filled(mSrc),
          wasPlaying = false;
        if (!hasMusic && mBtn) {
          mBtn.classList.add("is-hidden");
        }
        function setPlaying(on) {
          if (!mBtn) {
            return;
          }
          mBtn.classList.toggle("is-playing", on);
          mBtn.setAttribute("aria-pressed", on ? "true" : "false");
        }
        function playMusic() {
          if (!hasMusic || !bgm) {
            return;
          }
          try {
            if (window.MELTING.silentPlayback || window.MELTING.userPaused) return;
            var pr = bgm.play();
            if (pr && pr.then) {
              pr.then(
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
          } catch (e) {
            setPlaying(false);
          }
        }
        if (mBtn) {
          mBtn.addEventListener("click", function () {
            if (bgm && !bgm.paused) {
              bgm.pause();
              setPlaying(false);
              soundOn = false;
            } else {
              window.MELTING.userPaused = false;
              soundOn = window.MELTING.musicEnabled && !window.MELTING.silentPlayback;
              playMusic();
            }
          });
        }
        doc.addEventListener("visibilitychange", function () {
          if (doc.hidden) {
            running = false;
            wasPlaying = !!(bgm && !bgm.paused);
            if (wasPlaying) {
              bgm.pause();
            }
          } else {
            if (!running && !reduceMotion) {
              running = true;
              requestAnimationFrame(frame);
            }
            if (wasPlaying) {
              playMusic();
            }
          }
        });

        window.MELTING.afterInit();
        /* ---------- mulai ---------- */
        numberLayers();
        computeRt();
        startLoop();
        setTimeout(function () {
          numberLayers();
          onScroll();
        }, 400);
      })();
    