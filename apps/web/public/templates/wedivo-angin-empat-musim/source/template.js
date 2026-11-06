
      (function () {
        "use strict";
        var doc = document;
        var root = doc.documentElement;
        var body = doc.body;
        var $ = function (sel, ctx) {
          return (ctx || doc).querySelector(sel);
        };
        var $$ = function (sel, ctx) {
          return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel));
        };
        var byId = function (id) {
          return doc.getElementById(id);
        };
        var clamp = function (v, a, b) {
          return v < a ? a : v > b ? b : v;
        };
        var lerp = function (a, b, t) {
          return a + (b - a) * t;
        };
        var rand = function (a, b) {
          return a + Math.random() * (b - a);
        };
        var pick = function (arr) {
          return arr[Math.floor(Math.random() * arr.length)];
        };
        var pad = function (n) {
          return String(n).padStart(2, "0");
        };
        var now = function () {
          return window.performance && performance.now
            ? performance.now()
            : Date.now();
        };
        var mqReduce = window.matchMedia
          ? window.matchMedia("(prefers-reduced-motion: reduce)")
          : null;
        var reduce = window.AnginPlatform.reducedMotion || !!(mqReduce && mqReduce.matches);
        var uidN = 0;
        var uid = function (prefix) {
          uidN += 1;
          return (prefix || "rt") + "-" + uidN;
        };
        var SVGNS = "http://www.w3.org/2000/svg";
        var store = {
          get: function (k) {
            try {
              return window.localStorage.getItem(k);
            } catch (e) {
              return null;
            }
          },
          set: function (k, v) {
            try {
              window.localStorage.setItem(k, v);
            } catch (e) {}
          },
        };
        var txt = function (id) {
          var el = typeof id === "string" ? byId(id) : id;
          return el ? (el.textContent || "").replace(/\s+/g, " ").trim() : "";
        };
        var linesOf = function (id) {
          var el = typeof id === "string" ? byId(id) : id;
          if (!el) {
            return [];
          }
          var html = el.innerHTML
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>\s*<p[^>]*>/gi, "\n");
          var tmp = doc.createElement("div");
          tmp.innerHTML = html;
          return (tmp.textContent || "")
            .split(/\n+/)
            .map(function (s) {
              return s.replace(/\s+/g, " ").trim();
            })
            .filter(Boolean);
        };
        var isUrl = function (u) {
          u = (u || "").trim();
          return !!u && !/^\{\{/.test(u) && u !== "#";
        };
        var imgOk = function (img) {
          return img && isUrl(img.getAttribute("src"));
        };
        var initialOf = function (name) {
          var s = (name || "").trim();
          return s ? s.charAt(0).toUpperCase() : "♡";
        };
        var isHidden = function (el) {
          if (!el) {
            return true;
          }
          if (el.style.display === "none" || el.hidden) {
            return true;
          }
          return window.getComputedStyle(el).display === "none";
        };
        var absTop = function (el) {
          return el.getBoundingClientRect().top + window.pageYOffset;
        };
        var vibrate = function (ms) {
          try {
            if (navigator.vibrate && !reduce) {
              navigator.vibrate(ms);
            }
          } catch (e) {}
        };
        var toastEl = null;
        var toastT = 0;
        function toast(msg) {
          if (!toastEl) {
            toastEl = doc.createElement("div");
            toastEl.id = "rt-toast";
            toastEl.className = "toast";
            toastEl.setAttribute("role", "status");
            body.appendChild(toastEl);
          }
          toastEl.textContent = msg;
          toastEl.classList.add("is-on");
          clearTimeout(toastT);
          toastT = setTimeout(function () {
            toastEl.classList.remove("is-on");
          }, 2200);
        }
        function copyText(text, okMsg) {
          var done = function () {
            toast(okMsg || window.AnginPlatform.copy.copied);
          };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done, function () {
              fallbackCopy(text);
              done();
            });
          } else {
            fallbackCopy(text);
            done();
          }
        }
        function fallbackCopy(text) {
          var ta = doc.createElement("textarea");
          ta.value = text;
          ta.setAttribute("readonly", "");
          ta.style.position = "fixed";
          ta.style.opacity = "0";
          body.appendChild(ta);
          ta.select();
          try {
            doc.execCommand("copy");
          } catch (e) {}
          body.removeChild(ta);
        }
        var guestName = window.AnginPlatform.guestName;
        body.classList.toggle("has-guest", guestName !== "");
        var TZ_OFF = { WIB: 7, WITA: 8, WIT: 9 };
        var tzLabel = window.AnginPlatform.timezoneLabel;
        if (!TZ_OFF.hasOwnProperty(tzLabel)) {
          tzLabel = tzLabel || "WIB";
        }
        var tzOff = window.AnginPlatform.timezoneOffset;
        function parseYMD(s) {
          var m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec((s || "").trim());
          return m ? { y: +m[1], m: +m[2], d: +m[3] } : null;
        }
        function parseHM(s) {
          var m = /^(\d{1,2})[:.](\d{2})/.exec((s || "").trim());
          return m ? { h: +m[1], mi: +m[2] } : null;
        }
        function absTime(dateStr, timeStr) {
          var d = parseYMD(dateStr);
          if (!d) {
            return NaN;
          }
          var t = parseHM(timeStr) || { h: 0, mi: 0 };
          return Date.UTC(d.y, d.m - 1, d.d, t.h, t.mi) - tzOff * 3600000;
        }
        var HARI = [
          "Minggu",
          "Senin",
          "Selasa",
          "Rabu",
          "Kamis",
          "Jumat",
          "Sabtu",
        ];
        var BULAN = [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ];
        function fmtDate(dateStr, opts) { return window.AnginPlatform.formatDate(dateStr, opts); }
        function fmtTime(timeStr) {
          var t = parseHM(timeStr);
          if (!t) {
            return "";
          }
          try {
            return new Date(Date.UTC(2000, 0, 1, t.h, t.mi)).toLocaleTimeString(
              window.AnginPlatform.intlLocale,
              { hour: "2-digit", minute: "2-digit", timeZone: "UTC" },
            );
          } catch (e) {
            return pad(t.h) + "." + pad(t.mi);
          }
        }
        var W_DATE =
          (byId("hero-date-t") &&
            byId("hero-date-t").getAttribute("datetime")) ||
          "";
        var W_TIME = (txt("hero-time-t").split(" ")[0] || "").trim();
        var W_TS = window.AnginPlatform.eventTimestamp;
        var K = {
          "": { a: "ア", i: "イ", u: "ウ", e: "エ", o: "オ" },
          k: { a: "カ", i: "キ", u: "ク", e: "ケ", o: "コ" },
          g: { a: "ガ", i: "ギ", u: "グ", e: "ゲ", o: "ゴ" },
          s: { a: "サ", i: "シ", u: "ス", e: "セ", o: "ソ" },
          z: { a: "ザ", i: "ジ", u: "ズ", e: "ゼ", o: "ゾ" },
          t: { a: "タ", i: "ティ", u: "トゥ", e: "テ", o: "ト" },
          d: { a: "ダ", i: "ディ", u: "ドゥ", e: "デ", o: "ド" },
          n: { a: "ナ", i: "ニ", u: "ヌ", e: "ネ", o: "ノ" },
          h: { a: "ハ", i: "ヒ", u: "フ", e: "ヘ", o: "ホ" },
          b: { a: "バ", i: "ビ", u: "ブ", e: "ベ", o: "ボ" },
          p: { a: "パ", i: "ピ", u: "プ", e: "ペ", o: "ポ" },
          m: { a: "マ", i: "ミ", u: "ム", e: "メ", o: "モ" },
          y: { a: "ヤ", i: "イ", u: "ユ", e: "イェ", o: "ヨ" },
          r: { a: "ラ", i: "リ", u: "ル", e: "レ", o: "ロ" },
          w: { a: "ワ", i: "ウィ", u: "ウ", e: "ウェ", o: "ウォ" },
          f: { a: "ファ", i: "フィ", u: "フ", e: "フェ", o: "フォ" },
          v: { a: "ヴァ", i: "ヴィ", u: "ヴ", e: "ヴェ", o: "ヴォ" },
          j: { a: "ジャ", i: "ジ", u: "ジュ", e: "ジェ", o: "ジョ" },
          c: { a: "チャ", i: "チ", u: "チュ", e: "チェ", o: "チョ" },
          sy: { a: "シャ", i: "シ", u: "シュ", e: "シェ", o: "ショ" },
          ny: { a: "ニャ", i: "ニ", u: "ニュ", e: "ニェ", o: "ニョ" },
        };
        K.l = K.r;
        K.q = K.k;
        K.kh = K.h;
        K.dh = K.d;
        K.th = K.t;
        K.sh = K.sy;
        K.ch = K.c;
        K.ph = K.f;
        K.gh = K.g;
        var CODA = {
          n: "ン",
          m: "ム",
          k: "ク",
          g: "グ",
          s: "ス",
          z: "ズ",
          t: "ト",
          d: "ド",
          h: "フ",
          b: "ブ",
          p: "プ",
          r: "ル",
          l: "ル",
          f: "フ",
          v: "ヴ",
          j: "ジ",
          c: "チ",
          y: "イ",
          w: "ウ",
          q: "ク",
          x: "クス",
        };
        var VOW = "aiueo";
        function kanaWord(raw) {
          var w = raw.toLowerCase();
          try {
            w = w.normalize("NFD").replace(/[̀-ͯ]/g, "");
          } catch (e) {}
          w = w
            .replace(/[^a-z]/g, "")
            .replace(/([^aiueo])y$/, "$1i")
            .replace(/x/g, "ks");
          var out = "";
          var i = 0;
          while (i < w.length) {
            var c = w.charAt(i);
            if (VOW.indexOf(c) >= 0) {
              out += i > 0 && w.charAt(i - 1) === c && out ? "ー" : K[""][c];
              i += 1;
              continue;
            }
            var two = w.substr(i, 2);
            if (two === "ng") {
              var nv = w.charAt(i + 2);
              if (nv && VOW.indexOf(nv) >= 0) {
                out += "ン" + K.g[nv];
                i += 3;
              } else {
                out += "ン";
                i += 2;
              }
              continue;
            }
            var key = c;
            var len = 1;
            if (
              ["sy", "ny", "kh", "dh", "th", "sh", "ch", "ph", "gh"].indexOf(
                two,
              ) >= 0
            ) {
              key = two;
              len = 2;
            }
            var nx = w.charAt(i + len);
            if (len === 1 && nx === c) {
              if (c === "n" || c === "m") {
                out += "ン";
              }
              i += 1;
              continue;
            }
            if (nx && VOW.indexOf(nx) >= 0 && K[key]) {
              out += K[key][nx];
              i += len + 1;
              continue;
            }
            var n2 = w.charAt(i + len + 1);
            if (
              nx === "y" &&
              key !== "y" &&
              n2 &&
              VOW.indexOf(n2) >= 0 &&
              K[key]
            ) {
              out += K[key].i + K.y[n2];
              i += len + 2;
              continue;
            }
            if (key === "h" && !nx) {
              i += len;
              continue;
            }
            if (key === "m" && (nx === "b" || nx === "p")) {
              out += "ン";
              i += len;
              continue;
            }
            out += CODA[key] || (K[key] ? K[key].u : "");
            i += len;
          }
          return out;
        }
        function kana(name) {
          var s = (name || "").trim();
          if (!s) {
            return "";
          }
          if (/[぀-ヿ一-鿿]/.test(s)) {
            return s;
          }
          return s
            .split(/[\s\-]+/)
            .map(kanaWord)
            .filter(Boolean)
            .slice(0, 3)
            .join("・");
        }
        var GAL = window.AnginPlatform.gallery;
        var BRIDE = txt("hn-bride-name");
        var GROOM = txt("hn-groom-name");
        var BRIDE_K = kana(BRIDE);
        var GROOM_K = kana(GROOM);
        var AC = null;
        var master = null;
        var noiseB = null;
        var sfxOn = !window.AnginPlatform.silentPlayback && store.get("awm-sfx") !== "0";
        function ac() {
          if (!AC) {
            try {
              var C = window.AudioContext || window.webkitAudioContext;
              if (!C) {
                return null;
              }
              AC = new C();
              master = AC.createGain();
              master.gain.value = 0.55;
              master.connect(AC.destination);
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
        function noise() {
          var a = ac();
          if (!a) {
            return null;
          }
          if (!noiseB) {
            noiseB = a.createBuffer(1, a.sampleRate * 2, a.sampleRate);
            var d = noiseB.getChannelData(0);
            for (var i = 0; i < d.length; i++) {
              d[i] = Math.random() * 2 - 1;
            }
          }
          var s = a.createBufferSource();
          s.buffer = noiseB;
          return s;
        }
        function tone(f, t0, dur, type, vol, f2) {
          var a = ac();
          if (!a) {
            return;
          }
          var o = a.createOscillator();
          var g = a.createGain();
          o.type = type || "sine";
          o.frequency.setValueAtTime(f, t0);
          if (f2) {
            o.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
          }
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.012);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          o.connect(g);
          g.connect(master);
          o.start(t0);
          o.stop(t0 + dur + 0.05);
        }
        function noiseHit(t0, dur, fType, freq, q, vol, f2) {
          var a = ac();
          var s = noise();
          if (!a || !s) {
            return;
          }
          var bf = a.createBiquadFilter();
          bf.type = fType || "bandpass";
          bf.frequency.setValueAtTime(freq || 1200, t0);
          if (f2) {
            bf.frequency.exponentialRampToValueAtTime(f2, t0 + dur);
          }
          bf.Q.value = q || 1;
          var g = a.createGain();
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime(
            vol || 0.3,
            t0 + Math.min(0.08, dur * 0.3),
          );
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          s.connect(bf);
          bf.connect(g);
          g.connect(master);
          s.start(t0, Math.random());
          s.stop(t0 + dur + 0.05);
        }
        var SFX = {
          whoosh: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            noiseHit(t, 1.1, "bandpass", 300, 0.8, 0.5, 2600);
            noiseHit(t + 0.1, 0.9, "highpass", 1800, 0.5, 0.12, 5000);
          },
          chime: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            var base = pick([1318.5, 1567.98, 1760, 2093]);
            tone(base, t, 1.6, "sine", 0.1);
            tone(base * 2.76, t, 0.9, "sine", 0.035);
            tone(base * 1.5, t + 0.12, 1.2, "sine", 0.05);
          },
          kira: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            [1567.98, 2093, 2637, 3135.96].forEach(function (f, i) {
              tone(f, t + i * 0.055, 0.45, "sine", 0.07);
              tone(f * 2, t + i * 0.055, 0.2, "triangle", 0.02);
            });
          },
          clank: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            noiseHit(t, 0.25, "bandpass", 2400, 6, 0.4);
            tone(420, t, 0.35, "square", 0.05, 300);
            tone(1260, t, 0.22, "triangle", 0.05);
            noiseHit(t + 0.08, 0.5, "bandpass", 700, 2, 0.12, 400);
          },
          pop: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            tone(520, t, 0.14, "sine", 0.2, 1100);
          },
          heart: function (rate) {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            tone(70, t, 0.16, "sine", 0.45, 45);
            tone(64, t + (rate || 0.22), 0.18, "sine", 0.35, 42);
          },
          select: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            tone(880, t, 0.1, "triangle", 0.1);
            tone(1318.5, t + 0.07, 0.16, "triangle", 0.1);
          },
          tick: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            tone(1900, AC.currentTime, 0.03, "square", 0.015);
          },
          boom: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            tone(90, t, 0.9, "sine", 0.6, 36);
            noiseHit(t, 1.2, "lowpass", 900, 0.7, 0.45, 120);
            for (var i = 0; i < 9; i++) {
              noiseHit(
                t + 0.35 + Math.random() * 0.8,
                0.07,
                "highpass",
                3000,
                1,
                0.08,
              );
            }
          },
          paper: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            noiseHit(t, 0.22, "highpass", 2600, 0.8, 0.22);
            noiseHit(t + 0.06, 0.3, "bandpass", 5200, 1.5, 0.1);
          },
          train: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            noiseHit(t, 2.6, "lowpass", 260, 0.8, 0.35, 700);
            for (var i = 0; i < 6; i++) {
              var tt = t + 0.25 + i * 0.36;
              noiseHit(tt, 0.09, "bandpass", 1400, 3, 0.18);
              noiseHit(tt + 0.13, 0.09, "bandpass", 1100, 3, 0.15);
            }
            tone(622, t + 0.1, 1.3, "triangle", 0.03, 560);
          },
          fanfare: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
              tone(f, t + i * 0.1, 0.5, "sawtooth", 0.05);
              tone(f, t + i * 0.1, 0.6, "triangle", 0.08);
            });
            [1046.5, 1318.5, 1567.98].forEach(function (f) {
              tone(f, t + 0.45, 1.3, "triangle", 0.07);
            });
          },
          stamp: function () {
            if (!sfxOn || !ac()) {
              return;
            }
            var t = AC.currentTime;
            tone(150, t, 0.2, "sine", 0.5, 70);
            noiseHit(t, 0.12, "lowpass", 1400, 0.8, 0.3);
          },
          blip: function (hi) {
            if (!sfxOn || !ac()) {
              return;
            }
            tone(hi ? 1320 : 990, AC.currentTime, 0.08, "sine", 0.08);
          },
        };
        var btnSfx = byId("btn-sfx");
        function syncSfxBtn() {
          if (btnSfx) {
            btnSfx.setAttribute("aria-pressed", sfxOn ? "true" : "false");
          }
        }
        syncSfxBtn();
        if (btnSfx) {
          btnSfx.addEventListener("click", function () {
            sfxOn = !sfxOn;
            store.set("awm-sfx", sfxOn ? "1" : "0");
            syncSfxBtn();
            if (sfxOn) {
              SFX.select();
            }
            toast(window.AnginPlatform.copy.sound + " " + (sfxOn ? window.AnginPlatform.copy.on : window.AnginPlatform.copy.off));
          });
        }
        var bgm = byId("bgm");
        var btnBgm = byId("btn-bgm");
        var bgmWanted = !window.AnginPlatform.preserveMusicPause;
        var bgmHas = !!(bgm && isUrl(bgm.getAttribute("src")));
        if (btnBgm) {
          btnBgm.hidden = !bgmHas;
        }
        function setBgmUi() {
          if (!btnBgm || !bgm) {
            return;
          }
          var on = !bgm.paused;
          btnBgm.classList.toggle("is-playing", on);
          btnBgm.setAttribute("aria-pressed", on ? "true" : "false");
        }
        function playBgm() {
          if (!bgmHas || !bgmWanted) {
            return;
          }
          try {
            var p = bgm.play();
            if (p && p.catch) {
              p.catch(function () {});
            }
          } catch (e) {}
        }
        function pauseBgm() {
          if (bgmHas) {
            bgm.pause();
          }
        }
        if (bgm) {
          bgm.volume = 0.55;
          bgm.addEventListener("play", setBgmUi);
          bgm.addEventListener("pause", setBgmUi);
        }
        if (btnBgm) {
          btnBgm.addEventListener("click", function () {
            if (!bgmHas) {
              return;
            }
            if (bgm.paused) {
              bgmWanted = true;
              playBgm();
            } else {
              bgmWanted = false;
              pauseBgm();
            }
          });
        }
        var firstTap = function () {
          ac();
          if (body.classList.contains("is-open")) {
            playBgm();
          }
          window.removeEventListener("pointerdown", firstTap, true);
        };
        window.addEventListener("pointerdown", firstTap, true);
        var SPR = {};
        function makeSprite(key, w, h, draw) {
          var c = doc.createElement("canvas");
          var s = 2;
          c.width = w * s;
          c.height = h * s;
          var x = c.getContext("2d");
          x.scale(s, s);
          draw(x, w, h);
          SPR[key] = SPR[key] || [];
          SPR[key].push({ c: c, w: w, h: h });
        }
        function petalPath(x, w, h) {
          x.beginPath();
          x.moveTo(w / 2, h);
          x.bezierCurveTo(
            w * 0.02,
            h * 0.72,
            w * 0.02,
            h * 0.22,
            w * 0.28,
            h * 0.08,
          );
          x.bezierCurveTo(
            w * 0.38,
            h * 0.02,
            w * 0.46,
            h * 0.1,
            w * 0.5,
            h * 0.2,
          );
          x.bezierCurveTo(
            w * 0.54,
            h * 0.1,
            w * 0.62,
            h * 0.02,
            w * 0.72,
            h * 0.08,
          );
          x.bezierCurveTo(w * 0.98, h * 0.22, w * 0.98, h * 0.72, w / 2, h);
          x.closePath();
        }
        function buildSprites() {
          [
            ["#fff0f5", "#ffb6cb", "#ff8fb0"],
            ["#ffffff", "#ffd3e0", "#ffabc4"],
            ["#ffe6ee", "#ff9dbb", "#f07199"],
          ].forEach(function (cols) {
            makeSprite("petal", 16, 18, function (x, w, h) {
              var g = x.createLinearGradient(0, 0, 0, h);
              g.addColorStop(0, cols[0]);
              g.addColorStop(0.55, cols[1]);
              g.addColorStop(1, cols[2]);
              petalPath(x, w, h);
              x.fillStyle = g;
              x.fill();
              x.strokeStyle = "rgba(230,90,130,.35)";
              x.lineWidth = 0.6;
              x.beginPath();
              x.moveTo(w / 2, h * 0.92);
              x.lineTo(w / 2, h * 0.3);
              x.stroke();
            });
          });
          ["#ffb347", "#ef6b3b", "#d9432f", "#f28c28"].forEach(function (col) {
            makeSprite("maple", 20, 20, function (x, w, h) {
              var pts = [
                [12, 1.8],
                [13.7, 6.3],
                [16.9, 4.9],
                [16.1, 8.8],
                [20.7, 8.1],
                [18.4, 11.6],
                [21.7, 13],
                [17.2, 14.9],
                [18.2, 17.8],
                [13.2, 16.5],
                [12.6, 22.1],
                [11.4, 22.1],
                [10.8, 16.5],
                [5.8, 17.8],
                [6.8, 14.9],
                [2.3, 13],
                [5.6, 11.6],
                [3.3, 8.1],
                [7.9, 8.8],
                [7.1, 4.9],
                [10.3, 6.3],
              ];
              x.save();
              x.scale(w / 24, h / 24);
              x.beginPath();
              pts.forEach(function (p, i) {
                if (i === 0) {
                  x.moveTo(p[0], p[1]);
                } else {
                  x.lineTo(p[0], p[1]);
                }
              });
              x.closePath();
              x.fillStyle = col;
              x.fill();
              x.strokeStyle = "rgba(120,30,10,.35)";
              x.lineWidth = 0.7;
              x.beginPath();
              x.moveTo(12, 21.5);
              x.lineTo(12, 8);
              x.stroke();
              x.restore();
            });
          });
          ["#ffd84a", "#f5c518"].forEach(function (col) {
            makeSprite("ginkgo", 18, 16, function (x, w, h) {
              x.beginPath();
              x.moveTo(w / 2, h);
              x.quadraticCurveTo(w * 0.1, h * 0.4, w * 0.02, h * 0.12);
              x.quadraticCurveTo(w * 0.5, -h * 0.12, w * 0.98, h * 0.12);
              x.quadraticCurveTo(w * 0.9, h * 0.4, w / 2, h);
              x.fillStyle = col;
              x.fill();
              x.strokeStyle = "rgba(150,110,0,.4)";
              x.lineWidth = 0.6;
              x.beginPath();
              x.moveTo(w / 2, h);
              x.lineTo(w / 2, h * 0.2);
              x.stroke();
            });
          });
          ["#9be39a", "#6fcf86"].forEach(function (col) {
            makeSprite("leaf", 16, 16, function (x, w, h) {
              x.beginPath();
              x.moveTo(2, h - 2);
              x.bezierCurveTo(2, h * 0.4, w * 0.4, 2, w - 1, 1);
              x.bezierCurveTo(w - 2, h * 0.6, w * 0.6, h - 2, 2, h - 2);
              x.fillStyle = col;
              x.fill();
              x.strokeStyle = "rgba(40,110,60,.5)";
              x.lineWidth = 0.7;
              x.beginPath();
              x.moveTo(2, h - 2);
              x.lineTo(w * 0.72, h * 0.28);
              x.stroke();
            });
          });
          makeSprite("snow", 14, 14, function (x, w, h) {
            var g = x.createRadialGradient(
              w / 2,
              h / 2,
              0,
              w / 2,
              h / 2,
              w / 2,
            );
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.45, "rgba(255,255,255,.85)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            x.fillStyle = g;
            x.fillRect(0, 0, w, h);
          });
          makeSprite("snow", 16, 16, function (x, w, h) {
            x.strokeStyle = "rgba(255,255,255,.95)";
            x.lineWidth = 1.3;
            x.lineCap = "round";
            x.translate(w / 2, h / 2);
            for (var i = 0; i < 6; i++) {
              x.rotate(Math.PI / 3);
              x.beginPath();
              x.moveTo(0, 0);
              x.lineTo(0, -w * 0.44);
              x.moveTo(0, -w * 0.26);
              x.lineTo(-w * 0.1, -w * 0.34);
              x.moveTo(0, -w * 0.26);
              x.lineTo(w * 0.1, -w * 0.34);
              x.stroke();
            }
          });
          makeSprite("glint", 16, 16, function (x, w, h) {
            var g = x.createRadialGradient(
              w / 2,
              h / 2,
              0,
              w / 2,
              h / 2,
              w / 2,
            );
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.3, "rgba(255,250,210,.7)");
            g.addColorStop(1, "rgba(255,250,210,0)");
            x.fillStyle = g;
            x.fillRect(0, 0, w, h);
            x.fillStyle = "#fff";
            x.beginPath();
            x.moveTo(w / 2, 0);
            x.quadraticCurveTo(w * 0.56, h * 0.44, w, h / 2);
            x.quadraticCurveTo(w * 0.56, h * 0.56, w / 2, h);
            x.quadraticCurveTo(w * 0.44, h * 0.56, 0, h / 2);
            x.quadraticCurveTo(w * 0.44, h * 0.44, w / 2, 0);
            x.fill();
          });
        }
        var SEASON_TYPES = {
          semi: [["petal", 1]],
          panas: [
            ["glint", 0.55],
            ["leaf", 0.45],
          ],
          gugur: [
            ["maple", 0.7],
            ["ginkgo", 0.3],
          ],
          dingin: [["snow", 1]],
        };
        var SEASON_WIND = {
          semi: 0.55,
          panas: 0.35,
          gugur: 0.75,
          dingin: 0.22,
        };
        function typeFor(season) {
          var list = SEASON_TYPES[season] || SEASON_TYPES.semi;
          var r = Math.random();
          var acc = 0;
          for (var i = 0; i < list.length; i++) {
            acc += list[i][1];
            if (r <= acc) {
              return list[i][0];
            }
          }
          return list[0][0];
        }
        function newParticle(p, season, W, H, where) {
          p = p || {};
          p.type = typeFor(season);
          var set = SPR[p.type];
          p.spr = set[Math.floor(Math.random() * set.length)];
          p.z = rand(0.55, 1.35);
          p.size =
            (p.type === "snow"
              ? rand(0.5, 1.1)
              : p.type === "glint"
                ? rand(0.6, 1.3)
                : rand(0.8, 1.35)) * p.z;
          if (where === "any") {
            p.x = rand(-20, W + 20);
            p.y = rand(-20, H + 20);
          } else if (where === "left") {
            p.x = rand(-60, -10);
            p.y = rand(-H * 0.1, H * 0.95);
          } else if (where === "bottom") {
            p.x = rand(-20, W + 20);
            p.y = H + rand(10, 60);
          } else {
            p.x = rand(-W * 0.3, W * 0.95);
            p.y = rand(-70, -12);
          }
          p.rot = rand(0, Math.PI * 2);
          p.vr = rand(-0.03, 0.03);
          p.flip = rand(0, Math.PI * 2);
          p.vf = rand(0.025, 0.07);
          p.vy =
            (p.type === "snow"
              ? rand(0.35, 0.8)
              : p.type === "glint"
                ? rand(-0.15, 0.2)
                : rand(0.45, 0.95)) * p.z;
          p.sway = rand(0.4, 1.4);
          p.ph = rand(0, 6.28);
          p.a = p.type === "glint" ? rand(0.35, 0.85) : rand(0.65, 0.95);
          p.tw = rand(0.02, 0.05);
          p.vx = 0;
          p.vyb = 0;
          return p;
        }
        var windCv = byId("bg-wind");
        var wctx = windCv && windCv.getContext ? windCv.getContext("2d") : null;
        var WV = {
          W: 0,
          H: 0,
          dpr: 1,
          parts: [],
          streaks: [],
          season: "semi",
          gust: 0,
          gustTo: 0,
          gustEnd: 0,
          nextGust: 0,
          running: false,
          last: 0,
        };
        var pointer = { x: -999, y: -999, vx: 0, vy: 0, t: 0 };
        var scrollDy = 0;
        var lastSY = window.pageYOffset;
        function windResize() {
          if (!wctx) {
            return;
          }
          WV.dpr = Math.min(window.devicePixelRatio || 1, 2);
          WV.W = window.innerWidth;
          WV.H = window.innerHeight;
          windCv.width = Math.round(WV.W * WV.dpr);
          windCv.height = Math.round(WV.H * WV.dpr);
          wctx.setTransform(WV.dpr, 0, 0, WV.dpr, 0, 0);
          var target = Math.round(clamp((WV.W * WV.H) / 15000, 26, 72));
          while (WV.parts.length < target) {
            WV.parts.push(newParticle(null, WV.season, WV.W, WV.H, "any"));
          }
          if (WV.parts.length > target) {
            WV.parts.length = target;
          }
          if (reduce) {
            drawWind(0);
          }
        }
        function drawParticle(ctx, p) {
          var s = p.spr;
          var sc = p.size;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          var fx =
            p.type === "snow" || p.type === "glint"
              ? 1
              : 0.28 + 0.72 * Math.abs(Math.cos(p.flip));
          ctx.scale(sc * fx, sc);
          var alpha = p.a;
          if (p.type === "glint") {
            alpha = p.a * (0.45 + 0.55 * Math.abs(Math.sin(p.ph * 2.2)));
          }
          ctx.globalAlpha = alpha;
          ctx.drawImage(s.c, -s.w / 2, -s.h / 2, s.w, s.h);
          ctx.restore();
        }
        function triggerGust(power) {
          WV.gustTo = power || rand(2.2, 3.6);
          WV.gustEnd = now() + rand(1500, 2400);
          var n = Math.round(rand(3, 5));
          for (var i = 0; i < n; i++) {
            WV.streaks.push({
              y: rand(WV.H * 0.08, WV.H * 0.85),
              amp: rand(8, 26),
              len: rand(WV.W * 0.25, WV.W * 0.55),
              t0: now() + i * rand(60, 180),
              dur: rand(900, 1500),
              lw: rand(1, 2.4),
              ph: rand(0, 6.28),
              fq: rand(0.006, 0.013),
            });
          }
          body.classList.add("is-gust");
          clearTimeout(triggerGust.t);
          triggerGust.t = setTimeout(function () {
            body.classList.remove("is-gust");
          }, 1700);
        }
        function drawStreaks(ctx, t) {
          for (var i = WV.streaks.length - 1; i >= 0; i--) {
            var s = WV.streaks[i];
            var u = (t - s.t0) / s.dur;
            if (u < 0) {
              continue;
            }
            if (u > 1) {
              WV.streaks.splice(i, 1);
              continue;
            }
            var e = 1 - Math.pow(1 - u, 2.2);
            var head = lerp(-WV.W * 0.1, WV.W * 1.35, e);
            var tail = head - s.len * (0.4 + 0.6 * Math.sin(u * Math.PI));
            var a = Math.sin(u * Math.PI) * 0.55;
            var g = ctx.createLinearGradient(tail, 0, head, 0);
            g.addColorStop(0, "rgba(255,255,255,0)");
            g.addColorStop(0.7, "rgba(255,255,255," + a.toFixed(3) + ")");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.strokeStyle = g;
            ctx.lineWidth = s.lw;
            ctx.lineCap = "round";
            ctx.beginPath();
            for (var x = tail; x <= head; x += 14) {
              var y = s.y + Math.sin(x * s.fq + s.ph) * s.amp;
              if (x === tail) {
                ctx.moveTo(x, y);
              } else {
                ctx.lineTo(x, y);
              }
            }
            ctx.stroke();
          }
        }
        function drawWind(t) {
          if (!wctx) {
            return;
          }
          wctx.clearRect(0, 0, WV.W, WV.H);
          for (var i = 0; i < WV.parts.length; i++) {
            drawParticle(wctx, WV.parts[i]);
          }
          drawStreaks(wctx, t);
        }
        function windTick(t) {
          if (!WV.running) {
            return;
          }
          var dt = Math.min(50, t - (WV.last || t)) / 16.67;
          WV.last = t;
          if (!WV.nextGust) {
            WV.nextGust = t + rand(5000, 9000);
          }
          if (t > WV.nextGust) {
            triggerGust();
            WV.nextGust = t + rand(10000, 17000);
          }
          if (WV.gustEnd && t > WV.gustEnd) {
            WV.gustTo = 0;
            WV.gustEnd = 0;
          }
          WV.gust += (WV.gustTo - WV.gust) * 0.035 * dt;
          var base = SEASON_WIND[WV.season] || 0.5;
          var wx = base + WV.gust;
          var sdy = scrollDy;
          scrollDy *= 0.6;
          var pAge = t - pointer.t;
          var pOn = pAge < 400;
          var W = WV.W;
          var H = WV.H;
          for (var i = 0; i < WV.parts.length; i++) {
            var p = WV.parts[i];
            p.ph += p.tw * dt;
            var sw = Math.sin(p.ph) * p.sway * 0.55;
            p.x += (wx * p.z * 1.15 + sw + p.vx) * dt;
            p.y +=
              (p.vy +
                Math.cos(p.ph * 0.8) * 0.18 -
                WV.gust * 0.16 * p.z +
                p.vyb) *
                dt -
              sdy * p.z * 0.32;
            p.vx *= 0.94;
            p.vyb *= 0.94;
            if (pOn) {
              var dx = p.x - pointer.x;
              var dy = p.y - pointer.y;
              var d2 = dx * dx + dy * dy;
              if (d2 < 16900) {
                var f = (1 - Math.sqrt(d2) / 130) * 0.09;
                p.vx += pointer.vx * f;
                p.vyb += pointer.vy * f;
                p.vr += f * 0.05 * (dx > 0 ? 1 : -1);
              }
            }
            p.vr = clamp(p.vr, -0.12, 0.12);
            p.rot += p.vr * dt * (1 + WV.gust * 0.4);
            p.flip += p.vf * dt * (1 + WV.gust * 0.6);
            if (p.x > W + 50 || p.x < -90 || p.y > H + 60 || p.y < -140) {
              var where =
                p.x > W + 50
                  ? "left"
                  : p.y < -140
                    ? "bottom"
                    : p.y > H + 60
                      ? "top"
                      : "left";
              newParticle(p, WV.season, W, H, where);
            }
          }
          drawWind(t);
          requestAnimationFrame(windTick);
        }
        function windStart() {
          if (!wctx || WV.running || reduce) {
            return;
          }
          WV.running = true;
          WV.last = 0;
          requestAnimationFrame(windTick);
        }
        function windStop() {
          WV.running = false;
        }
        function setWindSeason(s) {
          if (WV.season === s) {
            return;
          }
          WV.season = s;
          if (!reduce) {
            triggerGust(2.6);
          } else {
            WV.parts.forEach(function (p) {
              newParticle(p, s, WV.W, WV.H, "any");
            });
            drawWind(0);
          }
        }
        function setupWind() {
          if (!wctx) {
            return;
          }
          buildSprites();
          windResize();
          window.addEventListener("resize", windResize);
          window.addEventListener(
            "scroll",
            function () {
              var y = window.pageYOffset;
              scrollDy += clamp(y - lastSY, -80, 80);
              lastSY = y;
            },
            { passive: true },
          );
          window.addEventListener(
            "pointermove",
            function (e) {
              var t = now();
              if (pointer.t && t - pointer.t < 100) {
                pointer.vx = clamp(e.clientX - pointer.x, -40, 40);
                pointer.vy = clamp(e.clientY - pointer.y, -40, 40);
              } else {
                pointer.vx = 0;
                pointer.vy = 0;
              }
              pointer.x = e.clientX;
              pointer.y = e.clientY;
              pointer.t = t;
            },
            { passive: true },
          );
          doc.addEventListener("visibilitychange", function () {
            if (doc.hidden) {
              windStop();
            } else {
              windStart();
            }
          });
          if (reduce) {
            drawWind(0);
          } else {
            windStart();
          }
        }
        function burstOn(cv, x0, y0, n, opts) {
          if (!cv || !cv.getContext || reduce) {
            return;
          }
          opts = opts || {};
          var ctx = cv.getContext("2d");
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          var r = cv.getBoundingClientRect();
          cv.width = Math.round(r.width * dpr);
          cv.height = Math.round(r.height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          var parts = [];
          for (var i = 0; i < n; i++) {
            var p = newParticle(
              null,
              opts.season || "semi",
              r.width,
              r.height,
              "any",
            );
            var ang = rand(0, Math.PI * 2);
            var sp = rand(3, opts.power || 13);
            p.x = x0 + rand(-20, 20);
            p.y = y0 + rand(-14, 14);
            p.vx0 = Math.cos(ang) * sp + (opts.windX || 4);
            p.vy0 = Math.sin(ang) * sp - rand(0, 3);
            p.size *= rand(1.1, 1.9);
            parts.push(p);
          }
          var t0 = now();
          var dur = opts.dur || 1900;
          (function step(t) {
            var u = (t - t0) / dur;
            ctx.clearRect(0, 0, r.width, r.height);
            if (u >= 1) {
              return;
            }
            parts.forEach(function (p) {
              p.x += p.vx0;
              p.y += p.vy0;
              p.vx0 = p.vx0 * 0.965 + 0.28;
              p.vy0 = p.vy0 * 0.965 + 0.08;
              p.rot += 0.08;
              p.flip += 0.15;
              p.a = Math.min(1, 1.4 - u * 1.3);
              drawParticle(ctx, p);
            });
            requestAnimationFrame(step);
          })(t0);
        }
        var coverEl = byId("sec-cover");
        var heroEl = byId("sec-hero");
        var heroRevealed = false;
        var seenHooks = {};
        var visHooks = {};
        var revealIO = null;
        function onSeen(id, fn) {
          (seenHooks[id] = seenHooks[id] || []).push(fn);
        }
        function onVis(id, fn) {
          (visHooks[id] = visHooks[id] || []).push(fn);
        }
        function fireSeen(sec) {
          if (!sec || sec.__seen) {
            return;
          }
          sec.__seen = true;
          sec.classList.add("is-seen");
          var head = $(".ep-head", sec);
          if (head) {
            head.classList.add("is-cut");
          }
          (seenHooks[sec.id] || []).forEach(function (fn) {
            try {
              fn(sec);
            } catch (e) {}
          });
        }
        function regions() {
          return $$("body > header, body > section, body > footer");
        }
        function sections() {
          return $$("body > [data-section]").filter(function (s) {
            return s.id !== "sec-cover";
          });
        }
        function visibleSections() {
          return sections().filter(function (s) {
            return !isHidden(s);
          });
        }
        function revealHero() {
          if (heroRevealed || !heroEl) {
            return;
          }
          heroRevealed = true;
          heroEl.classList.add("in-view");
          fireSeen(heroEl);
          if (typeof startOP === "function") {
            startOP();
          }
        }
        function observeReveal(el) {
          if (!el) {
            return;
          }
          if (revealIO) {
            revealIO.observe(el);
          } else {
            el.classList.add("in");
          }
        }
        function releaseAll() {
          $$(".rv:not(.in)").forEach(function (el) {
            if (heroEl && heroEl.contains(el)) {
              return;
            }
            if (coverEl && coverEl.contains(el)) {
              return;
            }
            el.classList.add("in");
          });
          regions().forEach(function (r) {
            if (r !== coverEl && r !== heroEl && !isHidden(r)) {
              fireSeen(r);
            }
          });
        }
        function bottomCheck() {
          if (
            window.innerHeight + window.pageYOffset >=
            root.scrollHeight - 4
          ) {
            releaseAll();
          }
        }
        function setupReveal() {
          var els = $$(".rv").filter(function (el) {
            return !(heroEl && heroEl.contains(el));
          });
          if (!("IntersectionObserver" in window)) {
            regions().forEach(function (r) {
              if (r === coverEl || r === heroEl) {
                return;
              }
              r.classList.add("in-view");
              fireSeen(r);
            });
            return;
          }
          revealIO = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (en) {
                if (en.isIntersecting) {
                  en.target.classList.add("in");
                  revealIO.unobserve(en.target);
                  if (en.target.classList.contains("rv-hover")) {
                    (function (el) {
                      setTimeout(function () {
                        el.style.setProperty("--d", "0s");
                      }, 1600);
                    })(en.target);
                  }
                }
              });
            },
            { threshold: 0, rootMargin: "0px 0px -33% 0px" },
          );
          els.forEach(function (el) {
            revealIO.observe(el);
          });
          var seenIO = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (en) {
                if (en.isIntersecting) {
                  fireSeen(en.target);
                  seenIO.unobserve(en.target);
                }
              });
            },
            { threshold: 0, rootMargin: "0px 0px -30% 0px" },
          );
          regions().forEach(function (r) {
            if (r !== coverEl && r !== heroEl) {
              seenIO.observe(r);
            }
          });
          var visIO = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (en) {
                var on = en.isIntersecting;
                en.target.classList.toggle("is-off", !on);
                (visHooks[en.target.id] || []).forEach(function (fn) {
                  try {
                    fn(on);
                  } catch (e) {}
                });
              });
            },
            { threshold: 0, rootMargin: "120px 0px 120px 0px" },
          );
          regions().forEach(function (r) {
            if (r !== coverEl) {
              visIO.observe(r);
            }
          });
          window.addEventListener("scroll", bottomCheck, { passive: true });
          window.addEventListener("resize", bottomCheck);
          setTimeout(bottomCheck, 400);
        }
        function numberScenes() {
          var n = 0;
          visibleSections().forEach(function (sec) {
            if (sec.id === "sec-hero" || sec.id === "sec-penutup") {
              return;
            }
            n += 1;
            sec.setAttribute("data-no", pad(n));
            var b = $(".ep-no-badge", sec);
            if (b) {
              b.textContent = pad(n);
            }
          });
        }
        function sceneLabel(sec) {
          if (!sec) {
            return "";
          }
          if (sec.id === "sec-hero") {
            return "00";
          }
          if (sec.id === "sec-penutup") {
            return window.AnginPlatform.copy.final;
          }
          return sec.getAttribute("data-no") || "";
        }
        var SEASON_JA = window.AnginPlatform.seasons;
        var SEASON_ID = window.AnginPlatform.seasons;
        var SEASON_COL = {
          semi: "#e5467a",
          panas: "#2a8be6",
          gugur: "#d9542f",
          dingin: "#5d78c9",
        };
        var curSeason = "semi";
        function setSeason(s) {
          if (!s || s === curSeason) {
            return;
          }
          curSeason = s;
          $$(".sky-l").forEach(function (l) {
            l.classList.toggle("is-on", l.id === "sky-" + s);
          });
          var hs = byId("hud-season");
          if (hs) {
            hs.textContent = SEASON_JA[s] || "春";
            hs.title = SEASON_ID[s] || "";
            hs.style.color = SEASON_COL[s] || "";
            hs.classList.remove("is-flip");
            void hs.offsetWidth;
            hs.classList.add("is-flip");
          }
          setWindSeason(s);
        }
        var navEl = byId("nav-benang");
        var railEl = byId("nav-rail");
        var hudScene = byId("hud-scene");
        var hudTitle = byId("hud-title");
        var hudTime = byId("hud-time");
        var activeId = "";
        var navLockUntil = 0;
        var centerT = 0;
        function navItem(id) {
          return railEl ? $('[data-nav-target="' + id + '"]', railEl) : null;
        }
        function targetSec(id) {
          return doc.querySelector('[data-section="' + id + '"]');
        }
        function centerItem(id, smooth) {
          var it = navItem(id);
          if (!it || !railEl) {
            return;
          }
          if (railEl.scrollWidth <= railEl.clientWidth + 2) {
            return;
          }
          var rr = railEl.getBoundingClientRect();
          var ir = it.getBoundingClientRect();
          var target =
            railEl.scrollLeft +
            (ir.left - rr.left - railEl.clientLeft) -
            (railEl.clientWidth - ir.width) / 2;
          target = clamp(target, 0, railEl.scrollWidth - railEl.clientWidth);
          if (Math.abs(target - railEl.scrollLeft) < 2) {
            return;
          }
          try {
            railEl.scrollTo({
              left: target,
              behavior: smooth && !reduce ? "smooth" : "auto",
            });
          } catch (e) {
            railEl.scrollLeft = target;
          }
        }
        function setActive(id, fromTap) {
          if (id === activeId) {
            return;
          }
          activeId = id;
          if (railEl) {
            $$("[data-nav-target]", railEl).forEach(function (b) {
              var on = b.getAttribute("data-nav-target") === id;
              b.classList.toggle("is-active", on);
              if (on) {
                b.setAttribute("aria-current", "true");
              } else {
                b.removeAttribute("aria-current");
              }
            });
          }
          var sec = targetSec(id);
          if (sec) {
            if (hudScene) {
              hudScene.textContent = sceneLabel(sec);
            }
            if (hudTitle) {
              hudTitle.textContent = sec.getAttribute("data-title") || "";
              hudTitle.classList.remove("is-swap");
              void hudTitle.offsetWidth;
              hudTitle.classList.add("is-swap");
            }
            setSeason(sec.getAttribute("data-season") || "semi");
          }
          clearTimeout(centerT);
          if (fromTap) {
            centerItem(id, true);
          } else {
            centerT = setTimeout(function () {
              centerItem(id, true);
            }, 180);
          }
        }
        function computeActive() {
          var line = window.innerHeight * 0.35;
          var cur = null;
          visibleSections().forEach(function (s) {
            if (s.getBoundingClientRect().top <= line) {
              cur = s;
            }
          });
          if (!cur) {
            cur = visibleSections()[0];
          }
          return cur;
        }
        var flowTick = false;
        function onFlowScroll() {
          if (flowTick) {
            return;
          }
          flowTick = true;
          requestAnimationFrame(function () {
            flowTick = false;
            var max = Math.max(1, root.scrollHeight - window.innerHeight);
            var prog = clamp(window.pageYOffset / max, 0, 1);
            if (hudTime) {
              var secs = Math.round(prog * 24 * 60);
              hudTime.textContent =
                pad(Math.floor(secs / 60)) + ":" + pad(secs % 60) + " / 24:00";
            }
            if (Date.now() < navLockUntil) {
              return;
            }
            var cur = computeActive();
            if (cur) {
              setActive(cur.getAttribute("data-section"));
            }
          });
        }
        var ecEl = byId("eyecatch");
        var ecBusy = false;
        function playEyecatch(sec, mid) {
          if (!ecEl || reduce || ecBusy) {
            mid();
            return;
          }
          ecBusy = true;
          var sc = byId("ec-scene");
          var tt = byId("ec-title");
          var lab = sceneLabel(sec);
          if (sc) {
            sc.textContent = lab === "OP" || lab === "ED" ? lab : "#" + lab;
          }
          if (tt) {
            tt.textContent = sec.getAttribute("data-title") || "";
          }
          ecEl.classList.remove("is-in", "is-out");
          ecEl.classList.add("is-on");
          void ecEl.offsetWidth;
          ecEl.classList.add("is-in");
          SFX.whoosh();
          setTimeout(function () {
            mid();
            SFX.kira();
          }, 560);
          setTimeout(function () {
            ecEl.classList.add("is-out");
          }, 900);
          setTimeout(function () {
            ecEl.classList.remove("is-on", "is-in", "is-out");
            ecBusy = false;
          }, 1450);
        }
        function goTo(id, fromTap) {
          var sec = targetSec(id);
          if (!sec || isHidden(sec)) {
            return;
          }
          var list = visibleSections();
          var from = list.indexOf(targetSec(activeId));
          var to = list.indexOf(sec);
          navLockUntil = Date.now() + 1300;
          setActive(id, true);
          var y = Math.max(0, absTop(sec));
          if (!reduce && from >= 0 && Math.abs(to - from) >= 3) {
            playEyecatch(sec, function () {
              window.scrollTo({ top: absTop(sec), behavior: "auto" });
              releaseNear(sec);
            });
            navLockUntil = Date.now() + 1500;
          } else {
            window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
          }
          setTimeout(function () {
            navLockUntil = 0;
            onFlowScroll();
          }, 1600);
        }
        function releaseNear(sec) {
          setTimeout(function () {
            fireSeen(sec);
          }, 60);
        }
        function setupNav() {
          if (navEl) {
            navEl.addEventListener("click", function (e) {
              var it = e.target.closest("[data-nav-target]");
              if (!it) {
                return;
              }
              e.preventDefault();
              SFX.blip(true);
              goTo(it.getAttribute("data-nav-target"), true);
            });
          }
          window.addEventListener("scroll", onFlowScroll, { passive: true });
          window.addEventListener("resize", function () {
            clearTimeout(centerT);
            centerT = setTimeout(function () {
              centerItem(activeId, false);
            }, 200);
            onFlowScroll();
          });
          sections().forEach(function (s) {
            var it = navItem(s.getAttribute("data-section"));
            if (it && s.style.display === "none") {
              it.style.display = "none";
            }
          });
          if ("MutationObserver" in window) {
            var mo = new MutationObserver(function () {
              clearTimeout(mo.t);
              mo.t = setTimeout(function () {
                numberScenes();
                onFlowScroll();
              }, 120);
            });
            mo.observe(body, { childList: true });
          }
          onFlowScroll();
        }
        function hideSection(sec) {
          if (!sec) {
            return;
          }
          sec.style.display = "none";
          var it = navItem(sec.getAttribute("data-section"));
          if (it) {
            it.style.display = "none";
          }
        }
        var PETAL_SYMS = {
          petal: "#sym-petal",
          maple: "#sym-maple",
          snow: "#sym-snow",
          leaf: "#sym-leaf",
          kira: "#sym-kira",
          blossom: "#sym-blossom",
        };
        function fillPetals(box, count, kinds) {
          if (!box) {
            return;
          }
          kinds = kinds || ["petal"];
          var n = count || parseInt(box.getAttribute("data-count"), 10) || 12;
          for (var i = 0; i < n; i++) {
            var kind = kinds[i % kinds.length];
            var sp = doc.createElement("span");
            sp.className = "pf-petal pf-" + kind;
            sp.id = uid(box.id + "-p");
            var s =
              kind === "snow"
                ? rand(8, 16)
                : kind === "kira"
                  ? rand(8, 14)
                  : rand(12, 22);
            sp.style.cssText =
              "--x:" +
              rand(-10, 95).toFixed(1) +
              "%;--s:" +
              s.toFixed(0) +
              "px;--dur:" +
              rand(9, 17).toFixed(1) +
              "s;--delay:-" +
              rand(0, 17).toFixed(1) +
              "s;--drift:" +
              rand(40, 170).toFixed(0) +
              "px;--r0:" +
              rand(0, 360).toFixed(0) +
              "deg;--flip:" +
              rand(1.6, 3.4).toFixed(1) +
              "s;--o:" +
              rand(0.6, 0.95).toFixed(2);
            var sv = doc.createElementNS(SVGNS, "svg");
            sv.setAttribute("viewBox", "0 0 24 24");
            sv.setAttribute("id", sp.id + "-s");
            var u = doc.createElementNS(SVGNS, "use");
            u.setAttribute("href", PETAL_SYMS[kind] || "#sym-petal");
            u.setAttribute("id", sp.id + "-u");
            if (kind === "kira") {
              sv.style.color = "#fff";
            }
            sv.appendChild(u);
            sp.appendChild(sv);
            box.appendChild(sp);
          }
        }
        var coverOpened = false;
        function setupCover() {
          if (!coverEl) {
            body.classList.add("is-open");
            revealHero();
            return;
          }
          try {
            if ("scrollRestoration" in history) {
              history.scrollRestoration = "manual";
            }
          } catch (e) {}
          window.scrollTo(0, 0);
          body.classList.add("is-locked");
          var dust = byId("cover-dust");
          if (dust) {
            for (var i = 0; i < 18; i++) {
              var m = doc.createElement("span");
              m.className = "cv-mote";
              m.id = "cv-mote-" + i;
              m.style.cssText =
                "--x:" +
                rand(8, 92).toFixed(1) +
                "%;--y:" +
                rand(10, 80).toFixed(1) +
                "%;--s:" +
                rand(2, 4.5).toFixed(1) +
                "px;--d:" +
                rand(6, 12).toFixed(1) +
                "s;--dl:-" +
                rand(0, 10).toFixed(1) +
                "s;--mx:" +
                rand(-30, 40).toFixed(0) +
                "px;--my:" +
                rand(-60, -20).toFixed(0) +
                "px";
              dust.appendChild(m);
            }
          }
          var openBtn = byId("cover-open");
          var locker = byId("lk-ours");
          if (openBtn) {
            openBtn.addEventListener("click", openCover);
          }
          if (locker) {
            locker.addEventListener("click", openCover);
          }
          if (!openBtn && !locker) {
            openCover();
          }
        }
        function openCover() {
          if (coverOpened) {
            return;
          }
          coverOpened = true;
          ac();
          playBgm();
          numberScenes();
          var finish = function () {
            if (coverEl.classList.contains("is-leaving")) {
              coverEl.style.display = "none";
            }
          };
          var onGone = function (e) {
            if (e && (e.target !== coverEl || e.propertyName !== "opacity")) {
              return;
            }
            finish();
            coverEl.removeEventListener("transitionend", onGone);
          };
          if (reduce) {
            coverEl.classList.add("is-leaving");
            body.classList.remove("is-locked");
            body.classList.add("is-open");
            revealHero();
            coverEl.addEventListener("transitionend", onGone);
            setTimeout(onGone, 900);
            return;
          }
          SFX.clank();
          vibrate(18);
          var locker = byId("lk-ours");
          var letter = byId("cover-letter");
          if (locker && letter) {
            var r = locker.getBoundingClientRect();
            letter.style.setProperty(
              "--lx",
              (r.left + r.width / 2 - window.innerWidth / 2).toFixed(0) + "px",
            );
            letter.style.setProperty(
              "--ly",
              (r.top + r.height / 2 - window.innerHeight / 2).toFixed(0) + "px",
            );
          }
          coverEl.classList.add("is-opening");
          setTimeout(function () {
            coverEl.classList.add("is-letter");
            SFX.pop();
            SFX.paper();
          }, 480);
          setTimeout(function () {
            coverEl.classList.add("is-unseal");
            SFX.kira();
            vibrate(12);
          }, 1250);
          setTimeout(function () {
            coverEl.classList.add("is-gust");
            SFX.whoosh();
            burstOn(
              byId("cover-burst"),
              window.innerWidth / 2,
              window.innerHeight / 2,
              150,
              { power: 16, windX: 5, dur: 2100 },
            );
            body.classList.remove("is-locked");
          }, 1720);
          setTimeout(function () {
            coverEl.classList.add("is-leaving");
            body.classList.add("is-open");
            coverEl.addEventListener("transitionend", onGone);
            setTimeout(onGone, 2400);
          }, 1960);
          setTimeout(revealHero, 2200);
        }
        var opTimers = [];
        var opDone = false;
        function setupHero() {
          if (!heroEl) {
            return;
          }
          if (!imgOk(byId("hero-photo"))) {
            heroEl.classList.add("no-photo");
          }
          var hp = byId("hero-photo");
          if (hp) {
            hp.addEventListener("error", function () {
              heroEl.classList.add("no-photo");
            });
          }
          var kb = byId("hero-kana-b");
          var kg = byId("hero-kana-g");
          if (kb) {
            kb.textContent = BRIDE_K;
          }
          if (kg) {
            kg.textContent = GROOM_K;
          }
          var hb = byId("hn-bride-kana");
          var hg = byId("hn-groom-kana");
          if (hb) {
            hb.textContent = BRIDE_K;
          }
          if (hg) {
            hg.textContent = GROOM_K;
          }
          var shine = byId("hero-logo-shine");
          if (shine) {
            shine.textContent = txt("hero-logo-main");
          }
          var dt = byId("hero-date-t");
          if (dt) {
            dt.textContent = fmtDate(W_DATE);
          }
          var tm = byId("hero-time-t");
          if (tm) {
            var ft = fmtTime(W_TIME);
            tm.textContent = ft ? ft + " " + tzLabel : "";
            if (!ft) {
              var sep = byId("hero-date-sep");
              if (sep) {
                sep.hidden = true;
              }
            }
          }
          var ly = byId("op-lyric");
          var lyBase = byId("op-lyric-base");
          var lyText = txt(lyBase);
          if (!lyText) {
            var box = byId("hero-lyric");
            if (box) {
              box.hidden = true;
            }
          } else if (ly && lyBase) {
            ly.setAttribute("aria-label", lyText);
            lyBase.textContent = "";
            lyBase.setAttribute("aria-hidden", "true");
            var chars = Array.from ? Array.from(lyText) : lyText.split("");
            var step = Math.min(0.11, 3.4 / Math.max(1, chars.length));
            chars.forEach(function (ch, i) {
              var s = doc.createElement("span");
              s.className = "ly-ch";
              s.id = "ly-ch-" + i;
              s.textContent = ch;
              s.style.setProperty("--ld", (i * step).toFixed(3) + "s");
              lyBase.appendChild(s);
            });
          }
          $$(".op-cr").forEach(function (c) {
            var v = $(".op-cr-v", c);
            if (v && !txt(v).replace(/[「」]/g, "")) {
              c.remove();
            }
          });
          var tag = byId("hero-tagline");
          if (tag && !txt(tag)) {
            tag.hidden = true;
          }
          fillPetals(byId("hero-petals"), 16, ["petal", "petal", "blossom"]);
          var skip = byId("hero-skip");
          if (skip) {
            skip.addEventListener("click", function () {
              SFX.blip();
              finishOP();
            });
          }
          var next = byId("hero-next");
          if (next) {
            next.addEventListener("click", function () {
              SFX.blip(true);
              finishOP();
              var list = visibleSections();
              var i = list.indexOf(heroEl);
              if (list[i + 1]) {
                goTo(list[i + 1].getAttribute("data-section"), true);
              }
            });
          }
          var bg = byId("hero-bg");
          if (bg && !reduce) {
            var hTick = false;
            window.addEventListener(
              "scroll",
              function () {
                if (hTick) {
                  return;
                }
                hTick = true;
                requestAnimationFrame(function () {
                  hTick = false;
                  var y = window.pageYOffset;
                  if (y < window.innerHeight * 1.4) {
                    bg.style.transform =
                      "translate3d(0," + (y * 0.32).toFixed(1) + "px,0)";
                  }
                });
              },
              { passive: true },
            );
          }
        }
        function startOP() {
          if (!heroEl || opDone) {
            return;
          }
          var credits = byId("hero-credits");
          var list = credits ? $$(".op-cr", credits) : [];
          if (reduce || !list.length) {
            finishOP();
            return;
          }
          heroEl.classList.add("is-op");
          credits.classList.add("is-seq");
          setTimeout(function () {
            SFX.whoosh();
          }, 150);
          opTimers.push(
            setTimeout(function () {
              SFX.kira();
              vibrate(14);
            }, 900),
          );
          list.forEach(function (c, i) {
            var t0 = 1100 + i * 1350;
            opTimers.push(
              setTimeout(function () {
                c.classList.remove("is-gone");
                c.classList.add("is-show");
              }, t0),
            );
            opTimers.push(
              setTimeout(function () {
                c.classList.remove("is-show");
                c.classList.add("is-gone");
              }, t0 + 1150),
            );
          });
          opTimers.push(
            setTimeout(function () {
              var ly = byId("op-lyric");
              if (ly) {
                ly.classList.add("is-sing");
              }
            }, 2300),
          );
          opTimers.push(setTimeout(finishOP, 1100 + list.length * 1350 + 400));
        }
        function finishOP() {
          if (opDone) {
            return;
          }
          opDone = true;
          opTimers.forEach(clearTimeout);
          opTimers = [];
          if (!heroEl) {
            return;
          }
          heroEl.classList.add("in-view", "is-op-done");
          var credits = byId("hero-credits");
          if (credits) {
            credits.classList.remove("is-seq");
            $$(".op-cr", credits).forEach(function (c) {
              c.classList.remove("is-gone");
              c.classList.add("is-show");
            });
          }
          var ly = byId("op-lyric");
          if (ly) {
            ly.classList.add("is-sing");
          }
        }
        function setupProlog() {
          var sec = byId("sec-prolog");
          if (!sec) {
            return;
          }
          var ol = byId("prolog-lines");
          var thread = byId("prolog-thread-a");
          var lines = linesOf("prolog-src");
          var items = [];
          lines.forEach(function (l, i) {
            var li = doc.createElement("li");
            li.className = "pl-line";
            li.id = "pl-line-" + i;
            li.textContent = l;
            ol.appendChild(li);
            items.push(li);
          });
          if (!items.length && ol) {
            ol.hidden = true;
          }
          if (!txt("prolog-quote-t")) {
            byId("prolog-quote").hidden = true;
          }
          if (!txt("prolog-salam-t")) {
            byId("prolog-salam-t").hidden = true;
          }
          if (!txt("prolog-intro")) {
            byId("prolog-intro").hidden = true;
          }
          if (!txt("prolog-salam-t") && !txt("prolog-intro")) {
            byId("prolog-salam").hidden = true;
          }
          var timers = [];
          function play() {
            timers.forEach(clearTimeout);
            timers = [];
            sec.classList.remove("pl-tight", "pl-go");
            items.forEach(function (li) {
              li.classList.remove("is-on", "is-dim");
            });
            if (thread) {
              thread.style.setProperty("--draw", "100");
            }
            void sec.offsetWidth;
            sec.classList.add("pl-go");
            var n = items.length || 1;
            if (reduce) {
              items.forEach(function (li) {
                li.classList.add("is-on");
              });
              sec.classList.add("pl-tight");
              return;
            }
            var gap = 1750;
            items.forEach(function (li, i) {
              timers.push(
                setTimeout(
                  function () {
                    items.forEach(function (o, j) {
                      o.classList.toggle("is-dim", j < i);
                    });
                    li.classList.add("is-on");
                    if (thread) {
                      thread.style.setProperty(
                        "--draw",
                        String(Math.round(100 - ((i + 1) / n) * 100)),
                      );
                    }
                  },
                  700 + i * gap,
                ),
              );
            });
            timers.push(
              setTimeout(
                function () {
                  items.forEach(function (o) {
                    o.classList.remove("is-dim");
                  });
                  sec.classList.add("pl-tight");
                  SFX.chime();
                },
                700 + items.length * gap + 300,
              ),
            );
          }
          onSeen("sec-prolog", play);
          var replay = byId("prolog-replay");
          if (replay) {
            replay.addEventListener("click", function () {
              SFX.blip();
              play();
            });
          }
          var pluckIt = function () {
            if (!sec.classList.contains("pl-tight")) {
              sec.classList.add("pl-go", "pl-tight");
              items.forEach(function (li) {
                li.classList.add("is-on");
                li.classList.remove("is-dim");
              });
              timers.forEach(clearTimeout);
            }
            sec.classList.remove("is-pluck");
            void sec.offsetWidth;
            sec.classList.add("is-pluck");
            SFX.chime();
            vibrate(10);
          };
          var pb = byId("prolog-pluck");
          if (pb) {
            pb.addEventListener("click", pluckIt);
          }
          var svg = byId("prolog-svg");
          if (svg) {
            svg.addEventListener("click", pluckIt);
          }
          var tc = byId("prolog-tc-t");
          var tcS = 84;
          var tcI = 0;
          onVis("sec-prolog", function (on) {
            clearInterval(tcI);
            if (on && tc && !reduce) {
              tcI = setInterval(function () {
                tcS += 1;
                tc.textContent =
                  "00:" + pad(Math.floor(tcS / 60) % 60) + ":" + pad(tcS % 60);
              }, 1000);
            }
          });
        }
        var STAT_LABELS = [
          "Kesabaran",
          "Humor",
          "Memasak",
          "Romantis",
          "Tepat Waktu",
        ];
        function parseStats(s) {
          var parts = (s || "").split(/[,;\/|]+/);
          var out = [];
          for (var i = 0; i < 5; i++) {
            var v = parseFloat((parts[i] || "").replace(",", "."));
            out.push(isNaN(v) ? 5 : clamp(v, 0, 10));
          }
          return out;
        }
        function svgEl(tag, attrs, parent) {
          var el = doc.createElementNS(SVGNS, tag);
          Object.keys(attrs).forEach(function (k) {
            el.setAttribute(k, attrs[k]);
          });
          if (parent) {
            parent.appendChild(el);
          }
          return el;
        }
        function buildRadar(svg, vals) {
          var R = 66;
          var pid = svg.id;
          var pt = function (i, r) {
            var a = ((-90 + i * 72) * Math.PI) / 180;
            return [Math.cos(a) * r, Math.sin(a) * r];
          };
          var poly = function (r) {
            var s = [];
            for (var i = 0; i < 5; i++) {
              var p = pt(i, r);
              s.push(p[0].toFixed(1) + "," + p[1].toFixed(1));
            }
            return s.join(" ");
          };
          [1, 2, 3].forEach(function (k) {
            svgEl(
              "polygon",
              {
                class: "rd-grid",
                points: poly((R * k) / 3),
                id: pid + "-grid" + k,
              },
              svg,
            );
          });
          for (var i = 0; i < 5; i++) {
            var p = pt(i, R);
            svgEl(
              "line",
              {
                class: "rd-axis",
                x1: 0,
                y1: 0,
                x2: p[0].toFixed(1),
                y2: p[1].toFixed(1),
                id: pid + "-ax" + i,
              },
              svg,
            );
          }
          var pts = vals.map(function (v, i) {
            return pt(i, (R * v) / 10);
          });
          svgEl(
            "polygon",
            {
              class: "rd-area",
              id: pid + "-area",
              points: pts
                .map(function (p) {
                  return p[0].toFixed(1) + "," + p[1].toFixed(1);
                })
                .join(" "),
            },
            svg,
          );
          pts.forEach(function (p, i) {
            svgEl(
              "circle",
              {
                class: "rd-dot",
                cx: p[0].toFixed(1),
                cy: p[1].toFixed(1),
                r: 3.4,
                id: pid + "-dot" + i,
              },
              svg,
            );
          });
          STAT_LABELS.forEach(function (l, i) {
            var p = pt(i, R + 16);
            var anchor =
              Math.abs(p[0]) < 6 ? "middle" : p[0] > 0 ? "start" : "end";
            var t = svgEl(
              "text",
              {
                class: "rd-lbl",
                x: p[0].toFixed(1),
                y: (p[1] + (p[1] < -40 ? -2 : p[1] > 30 ? 10 : 4)).toFixed(1),
                "text-anchor": anchor,
                id: pid + "-l" + i,
              },
              svg,
            );
            t.textContent = l;
            var v = svgEl(
              "text",
              {
                class: "rd-val",
                x: p[0].toFixed(1),
                y: (p[1] + (p[1] < -40 ? -15 : p[1] > 30 ? 23 : 17)).toFixed(1),
                "text-anchor": anchor,
                id: pid + "-v" + i,
              },
              svg,
            );
            v.textContent = String(Math.round(vals[i] * 10) / 10);
          });
        }
        function setupChars() {
          var sec = byId("sec-mempelai");
          if (!sec) {
            return;
          }
          var stage = byId("chr-stage");
          var P = { b: byId("chr-panel-b"), g: byId("chr-panel-g") };
          var T = { b: byId("chr-tab-b"), g: byId("chr-tab-g") };
          var NAME = { b: BRIDE, g: GROOM };
          var cur = "b";
          ["b", "g"].forEach(function (k) {
            var panel = P[k];
            if (!panel) {
              return;
            }
            var img = byId("chr-img-" + k);
            if (!imgOk(img)) {
              panel.classList.add("no-photo");
            } else {
              img.addEventListener("error", function () {
                panel.classList.add("no-photo");
              });
            }
            var ini = byId("chr-ph-" + k + "-ini");
            if (ini) {
              ini.textContent = initialOf(NAME[k]);
            }
            var tImg = byId("chr-tab-" + k + "-img");
            var tIni = byId("chr-tab-" + k + "-ini");
            if (tIni) {
              tIni.textContent = initialOf(NAME[k]);
            }
            if (tImg && !imgOk(tImg)) {
              tImg.remove();
            }
            var kv = byId("chr-kana-" + k);
            if (kv) {
              kv.textContent = k === "b" ? BRIDE_K : GROOM_K;
            }
            var ig = byId("chr-ig-" + k);
            var handle = txt("chr-ig-" + k + "-t");
            if (ig) {
              if (!handle) {
                ig.hidden = true;
              } else {
                ig.href =
                  "https://instagram.com/" +
                  encodeURIComponent(
                    handle.replace(/^@/, "").replace(/[^\w.]/g, ""),
                  );
              }
            }
            $$(".chr-dli", panel).forEach(function (d) {
              if (!txt($("dd", d))) {
                d.hidden = true;
              }
            });
            if (!txt("chr-parents-" + k + "-n")) {
              byId("chr-parents-" + k).hidden = true;
            }
            if (!txt("chr-full-" + k)) {
              byId("chr-full-" + k).hidden = true;
            }
            var say = byId("chr-say-" + k);
            var tap = byId("chr-tap-" + k);
            if (!txt(say) && !txt(tap)) {
              byId("chr-bubble-" + k).hidden = true;
            } else if (!txt(say)) {
              say.hidden = true;
              tap.hidden = false;
            }
            var statSrc = txt("chr-stat-" + k);
            var radar = byId("chr-radar-" + k);
            if (!statSrc) {
              byId("chr-stats-" + k).hidden = true;
            } else if (radar) {
              buildRadar(radar, parseStats(statSrc));
            }
            var portrait = byId("chr-portrait-" + k);
            if (portrait) {
              portrait.addEventListener("click", function () {
                react(k);
              });
            }
          });
          function react(k) {
            var portrait = byId("chr-portrait-" + k);
            var art = byId("chr-art-" + k);
            var bubble = byId("chr-bubble-" + k);
            var say = byId("chr-say-" + k);
            var tap = byId("chr-tap-" + k);
            portrait.classList.remove("is-blush");
            void portrait.offsetWidth;
            portrait.classList.add("is-blush");
            art.classList.add("is-sfx");
            SFX.heart(0.18);
            vibrate(12);
            if (txt(say) && txt(tap)) {
              var showTap = tap.hidden;
              tap.hidden = !showTap;
              say.hidden = showTap;
              bubble.classList.remove("is-pop");
              void bubble.offsetWidth;
              bubble.classList.add("is-pop");
            }
            if (!reduce) {
              var pr = portrait.getBoundingClientRect();
              var ar = art.getBoundingClientRect();
              for (var i = 0; i < 7; i++) {
                var h = doc.createElementNS(SVGNS, "svg");
                h.setAttribute("viewBox", "0 0 24 24");
                h.setAttribute("class", "chr-heart");
                h.setAttribute("id", uid("chr-heart"));
                var u = doc.createElementNS(SVGNS, "use");
                u.setAttribute("href", "#sym-heart");
                u.setAttribute("id", h.id + "-u");
                h.appendChild(u);
                h.style.left =
                  (pr.left - ar.left + pr.width / 2 - 11).toFixed(0) + "px";
                h.style.top =
                  (pr.top - ar.top + pr.height * 0.45).toFixed(0) + "px";
                h.style.setProperty("--hx", rand(-120, 120).toFixed(0) + "px");
                h.style.setProperty("--hy", rand(-170, -60).toFixed(0) + "px");
                h.style.setProperty("--hr", rand(-40, 40).toFixed(0) + "deg");
                h.style.color = pick(["#e0263f", "#ff6f96", "#ff9dbb"]);
                art.appendChild(h);
                (function (el) {
                  setTimeout(function () {
                    el.remove();
                  }, 1200);
                })(h);
              }
            }
            clearTimeout(react["t" + k]);
            react["t" + k] = setTimeout(function () {
              portrait.classList.remove("is-blush");
              art.classList.remove("is-sfx");
            }, 2400);
          }
          function show(k) {
            if (k === cur || !P[k]) {
              return;
            }
            var old = cur;
            cur = k;
            Object.keys(T).forEach(function (x) {
              T[x].classList.toggle("is-active", x === k);
              T[x].setAttribute("aria-selected", x === k ? "true" : "false");
            });
            var cn = byId("chr-count-n");
            if (cn) {
              cn.textContent = k === "b" ? "1" : "2";
            }
            SFX.whoosh();
            if (!reduce) {
              stage.classList.remove("is-wipe");
              void stage.offsetWidth;
              stage.classList.add("is-wipe");
              clearTimeout(show.t);
              show.t = setTimeout(function () {
                stage.classList.remove("is-wipe");
              }, 760);
            }
            setTimeout(
              function () {
                P[old].classList.remove("is-active");
                P[old].setAttribute("aria-hidden", "true");
                P[k].classList.add("is-active");
                P[k].removeAttribute("aria-hidden");
                var r = byId("chr-radar-" + k);
                if (r) {
                  r.classList.remove("is-on");
                  void r.getBoundingClientRect();
                  setTimeout(function () {
                    r.classList.add("is-on");
                  }, 120);
                }
              },
              reduce ? 0 : 250,
            );
          }
          Object.keys(T).forEach(function (k) {
            if (T[k]) {
              T[k].addEventListener("click", function () {
                show(k);
              });
              T[k].addEventListener("keydown", function (e) {
                if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                  e.preventDefault();
                  var o = k === "b" ? "g" : "b";
                  show(o);
                  T[o].focus();
                }
              });
            }
          });
          var toggle = function () {
            show(cur === "b" ? "g" : "b");
          };
          var pv = byId("chr-prev");
          var nx = byId("chr-next");
          if (pv) {
            pv.addEventListener("click", toggle);
          }
          if (nx) {
            nx.addEventListener("click", toggle);
          }
          var sx = null;
          var sy = null;
          stage.addEventListener(
            "pointerdown",
            function (e) {
              sx = e.clientX;
              sy = e.clientY;
            },
            { passive: true },
          );
          stage.addEventListener(
            "pointerup",
            function (e) {
              if (sx === null) {
                return;
              }
              var dx = e.clientX - sx;
              var dy = e.clientY - sy;
              sx = null;
              if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) {
                show(
                  dx < 0 ? (cur === "b" ? "g" : "b") : cur === "b" ? "g" : "b",
                );
              }
            },
            { passive: true },
          );
          onSeen("sec-mempelai", function () {
            var r = byId("chr-radar-" + cur);
            if (r) {
              setTimeout(function () {
                r.classList.add("is-on");
              }, 500);
            }
          });
        }
        function setupRel() {
          var sec = byId("sec-hubungan");
          var board = byId("rel-board");
          if (!sec || !board) {
            return;
          }
          var gPaths = byId("rel-paths");
          var say = byId("rel-say");
          var sayWho = byId("rel-say-who");
          var sayT = byId("rel-say-t");
          var N = {};
          ["bride", "groom", "pb", "pg", "t1", "t2", "t3"].forEach(
            function (k) {
              N[k] = byId("rel-n-" + k);
            },
          );
          var NAMES = {
            bride: BRIDE,
            groom: GROOM,
            t1: txt("rel-name-t1"),
            t2: txt("rel-name-t2"),
            t3: txt("rel-name-t3"),
          };
          ["bride", "groom", "t1", "t2", "t3"].forEach(function (k) {
            var n = N[k];
            if (!n) {
              return;
            }
            var img = byId("rel-img-" + k);
            var ini = byId("rel-ini-" + k);
            if (ini) {
              ini.textContent = initialOf(NAMES[k]);
            }
            if (!imgOk(img)) {
              n.classList.add("no-photo");
            } else {
              img.addEventListener("error", function () {
                n.classList.add("no-photo");
              });
            }
          });
          ["t1", "t2", "t3"].forEach(function (k) {
            if (!NAMES[k]) {
              N[k].classList.add("is-off");
              byId("rel-lbl-" + k).classList.add("is-off");
            }
            var role = byId("rel-role-" + k);
            if (role && !txt(role)) {
              role.hidden = true;
            }
            var lbl = byId("rel-lbl-" + k);
            if (lbl && !txt(lbl)) {
              lbl.textContent = "♡";
            }
          });
          if (!txt("rel-role-pb")) {
            N.pb.classList.add("is-off");
            byId("rel-lbl-pb").classList.add("is-off");
          }
          if (!txt("rel-role-pg")) {
            N.pg.classList.add("is-off");
            byId("rel-lbl-pg").classList.add("is-off");
          }
          if (!txt("rel-heart-t")) {
            byId("rel-heart-t").hidden = true;
          }
          var EDGES = [
            { from: "pb", to: "bride", lbl: "pb" },
            { from: "pg", to: "groom", lbl: "pg" },
            { from: "t1", to: "bride", lbl: "t1", dash: true },
            { from: "t2", to: "groom", lbl: "t2", dash: true },
            { from: "t3", to: "heart", lbl: "t3", dash: true },
            { from: "bride", to: "groom", red: true },
          ];
          function geo(el) {
            var nl = el.offsetLeft - el.offsetWidth / 2;
            var nt = el.offsetTop - el.offsetHeight / 2;
            var av = $(".rel-av", el);
            var c = av
              ? {
                  x: nl + av.offsetLeft + av.offsetWidth / 2,
                  y: nt + av.offsetTop + av.offsetHeight / 2,
                  r: av.offsetWidth / 2 + 6,
                }
              : {
                  x: nl + el.offsetWidth / 2,
                  y: nt + el.offsetHeight / 2,
                  r: 20,
                };
            c.box = {
              l: nl - 4,
              t: nt - 4,
              r: nl + el.offsetWidth + 4,
              b: nt + el.offsetHeight + 4,
            };
            return c;
          }
          function exitBox(c, ux, uy) {
            var tx =
              ux > 0
                ? (c.box.r - c.x) / ux
                : ux < 0
                  ? (c.box.l - c.x) / ux
                  : Infinity;
            var ty =
              uy > 0
                ? (c.box.b - c.y) / uy
                : uy < 0
                  ? (c.box.t - c.y) / uy
                  : Infinity;
            var t = Math.max(c.r, Math.min(tx, ty));
            return { x: c.x + ux * t, y: c.y + uy * t };
          }
          function draw() {
            while (gPaths.firstChild) {
              gPaths.removeChild(gPaths.firstChild);
            }
            var GB = geo(N.bride);
            var GG = geo(N.groom);
            var heart = byId("rel-heart");
            var HP = { x: (GB.x + GG.x) / 2, y: (GB.y + GG.y) / 2, r: 24 };
            if (heart) {
              heart.style.left = HP.x.toFixed(0) + "px";
              heart.style.top = HP.y.toFixed(0) + "px";
            }
            EDGES.forEach(function (e, i) {
              var a = N[e.from];
              var b = e.to === "heart" ? heart : N[e.to];
              if (!a || !b || a.classList.contains("is-off")) {
                return;
              }
              var A = geo(a);
              var B =
                e.to === "heart" ? { x: HP.x, y: HP.y - 20, r: 26 } : geo(b);
              var dx = B.x - A.x;
              var dy = B.y - A.y;
              var d = Math.sqrt(dx * dx + dy * dy) || 1;
              var ux = dx / d;
              var uy = dy / d;
              var S = e.red
                ? { x: A.x + ux * A.r, y: A.y + uy * A.r }
                : exitBox(A, ux, uy);
              var E = e.red
                ? { x: B.x - ux * B.r, y: B.y - uy * B.r }
                : B.box
                  ? exitBox(B, -ux, -uy)
                  : { x: B.x - ux * B.r, y: B.y - uy * B.r };
              var sx = S.x;
              var sy = S.y;
              var ex = E.x - (e.red ? 0 : ux * 4);
              var ey = E.y - (e.red ? 0 : uy * 4);
              var dAttr;
              if (e.red) {
                var len = Math.sqrt(
                  (ex - sx) * (ex - sx) + (ey - sy) * (ey - sy),
                );
                var waves = Math.max(2, Math.round(len / 40));
                var segs = [];
                for (var s = 0; s <= waves * 8; s++) {
                  var u = s / (waves * 8);
                  var px = sx + (ex - sx) * u;
                  var py =
                    sy +
                    (ey - sy) * u +
                    Math.sin(u * Math.PI * 2 * waves) *
                      5 *
                      Math.sin(u * Math.PI);
                  segs.push(
                    (s ? "L" : "M") + px.toFixed(1) + " " + py.toFixed(1),
                  );
                }
                dAttr = segs.join("");
              } else {
                var mx = (sx + ex) / 2 - uy * 16;
                var my = (sy + ey) / 2 + ux * 16;
                dAttr =
                  "M" +
                  sx.toFixed(1) +
                  " " +
                  sy.toFixed(1) +
                  "Q" +
                  mx.toFixed(1) +
                  " " +
                  my.toFixed(1) +
                  " " +
                  ex.toFixed(1) +
                  " " +
                  ey.toFixed(1);
              }
              var p = svgEl(
                "path",
                {
                  d: dAttr,
                  id: "rel-path-" + i,
                  class:
                    "rel-path" +
                    (e.red ? " rel-red" : "") +
                    (e.dash ? " is-dash" : ""),
                  "data-a": e.from,
                  "data-b": e.to,
                },
                gPaths,
              );
              if (!e.red) {
                p.setAttribute("marker-end", "url(#rel-arrow)");
              }
              var L = 300;
              try {
                L = p.getTotalLength();
              } catch (err) {}
              p.style.setProperty("--len", L.toFixed(0));
              p.style.setProperty("--pd", (0.2 + i * 0.16).toFixed(2) + "s");
              if (e.lbl) {
                var lb = byId("rel-lbl-" + e.lbl);
                if (lb) {
                  var mid = { x: (sx + ex) / 2, y: (sy + ey) / 2 };
                  try {
                    var mp = p.getPointAtLength(L * 0.5);
                    mid = { x: mp.x, y: mp.y };
                  } catch (err2) {}
                  lb.style.setProperty("--lx", mid.x.toFixed(0) + "px");
                  lb.style.setProperty("--ly", mid.y.toFixed(0) + "px");
                  lb.style.setProperty(
                    "--ld",
                    (0.6 + i * 0.16).toFixed(2) + "s",
                  );
                }
              }
            });
          }
          var focused = "";
          function focus(k) {
            if (focused === k) {
              unfocus();
              return;
            }
            focused = k;
            board.classList.add("is-focus");
            Object.keys(N).forEach(function (x) {
              if (N[x]) {
                N[x].classList.toggle("is-lit", x === k);
              }
            });
            $$(".rel-path", gPaths).forEach(function (p) {
              var on =
                p.getAttribute("data-a") === k ||
                p.getAttribute("data-b") === k ||
                (k === "bride" || k === "groom"
                  ? p.classList.contains("rel-red")
                  : false);
              p.classList.toggle("is-lit", on);
              if (on) {
                var o =
                  p.getAttribute("data-a") === k
                    ? p.getAttribute("data-b")
                    : p.getAttribute("data-a");
                if (N[o]) {
                  N[o].classList.add("is-lit");
                }
              }
            });
            $$(".rel-lbl").forEach(function (l) {
              var f = l.getAttribute("data-for");
              l.classList.toggle(
                "is-lit",
                f === k ||
                  (k === "bride" && (f === "pb" || f === "t1")) ||
                  (k === "groom" && (f === "pg" || f === "t2")),
              );
            });
            var who = "";
            var line = "";
            if (k === "pb" || k === "pg") {
              who = txt("rel-name-" + k);
              line = "Merestui dengan sepenuh hati ✓ — " + txt("rel-role-" + k);
            } else {
              who = k === "bride" ? BRIDE : k === "groom" ? GROOM : NAMES[k];
              line = txt("rel-q-" + k) || txt("rel-role-" + k);
            }
            sayWho.textContent = who;
            sayT.textContent = line ? "“" + line + "”" : "";
            say.classList.remove("is-on");
            void say.offsetWidth;
            say.classList.add("is-on");
            SFX.select();
          }
          function unfocus() {
            focused = "";
            board.classList.remove("is-focus");
            $$(".is-lit", board).forEach(function (el) {
              el.classList.remove("is-lit");
            });
            say.classList.remove("is-on");
          }
          Object.keys(N).forEach(function (k) {
            if (N[k]) {
              N[k].addEventListener("click", function (e) {
                e.stopPropagation();
                focus(k);
              });
            }
          });
          board.addEventListener("click", function () {
            if (focused) {
              unfocus();
            }
          });
          var rT = 0;
          window.addEventListener("resize", function () {
            clearTimeout(rT);
            rT = setTimeout(draw, 160);
          });
          draw();
          if (doc.fonts && doc.fonts.ready) {
            doc.fonts.ready.then(draw);
          }
          onSeen("sec-hubungan", function () {
            draw();
            setTimeout(function () {
              board.classList.add("is-drawn");
            }, 350);
          });
        }
        function splitSubs(t) {
          t = (t || "").replace(/\s+/g, " ").trim();
          if (!t) {
            return [];
          }
          var out = [];
          var buf = "";
          for (var i = 0; i < t.length; i++) {
            var ch = t.charAt(i);
            buf += ch;
            if (
              /[.!?…]/.test(ch) &&
              (i + 1 >= t.length || /\s/.test(t.charAt(i + 1)))
            ) {
              while (i + 1 < t.length && /["”’)]/.test(t.charAt(i + 1))) {
                i += 1;
                buf += t.charAt(i);
              }
              out.push(buf.trim());
              buf = "";
            }
          }
          if (buf.trim()) {
            out.push(buf.trim());
          }
          var res = [];
          out.forEach(function (s) {
            if (s.length <= 120) {
              res.push(s);
              return;
            }
            var parts = s.split(/,\s+/);
            var acc = "";
            parts.forEach(function (p, j) {
              var piece = p + (j < parts.length - 1 ? "," : "");
              if (acc && (acc + " " + piece).length > 92) {
                res.push(acc);
                acc = piece;
              } else {
                acc = acc ? acc + " " + piece : piece;
              }
            });
            if (acc) {
              res.push(acc);
            }
          });
          return res;
        }
        function setupKisah() {
          var sec = byId("sec-kisah");
          if (!sec) {
            return;
          }
          var screen = byId("ep-screen");
          var player = byId("ep-player");
          var subsT = byId("ep-subs-t");
          var eps = [];
          window.AnginPlatform.storySlots.forEach(function (n) {
            var title = txt("ep-d-" + n + "-t");
            var text = txt("ep-d-" + n + "-x");
            var when = txt("ep-d-" + n + "-w");
            var scene = byId("ep-scene-" + n);
            var li = byId("ep-li-" + n);
            var d = byId("ep-d-" + n);
            if (!title && !text) {
              if (li) {
                li.classList.add("is-off");
              }
              if (d) {
                d.classList.add("is-off");
              }
              if (scene) {
                scene.style.display = "none";
              }
              return;
            }
            if (!imgOk(byId("ep-mem-" + n + "-img"))) {
              scene.classList.add("no-mem");
            }
            if (!when) {
              byId("ep-d-" + n + "-w").hidden = true;
            }
            if (!title) {
              byId("ep-d-" + n + "-t").textContent = window.AnginPlatform.copy.episode + " " + n;
            }
            eps.push({
              n: n,
              title: title || window.AnginPlatform.copy.story,
              text: text,
              when: when,
              scene: scene,
              li: li,
              season: scene.getAttribute("data-season"),
              subs: splitSubs(text),
              seen: 0,
              eye: false,
            });
          });
          if (!eps.length) {
            hideSection(sec);
            return;
          }
          var SJ = window.AnginPlatform.seasons;
          var FX = {
            semi: ["petal", "petal", "blossom"],
            panas: ["kira", "leaf", "kira"],
            gugur: ["maple", "maple", "leaf"],
            dingin: ["snow"],
          };
          var totalChars = 0;
          eps.forEach(function (e, i) {
            e.k = i + 1;
            var no = byId("ep-li-" + e.n + "-no");
            if (no && no.firstChild) {
              no.firstChild.nodeValue = "EP " + e.k + " · ";
            }
            byId("ep-li-" + e.n + "-t").textContent = e.title;
            byId("ep-li-" + e.n + "-w").textContent = e.when;
            fillPetals(
              byId("ep-fx-" + e.n),
              e.season === "dingin" ? 18 : 12,
              FX[e.season] || FX.semi,
            );
            totalChars += e.text.length;
          });
          byId("ep-c-tot").textContent = String(eps.length);
          var mins = Math.max(
            1,
            Math.round((eps.length * 5 + totalChars / 18) / 60),
          );
          byId("ep-start-s").textContent =
            eps.length + " episode · ± " + mins + " menit";
          eps[0].scene.classList.add("is-on");
          var finalTitle =
            txt("hero-ep-t").replace(/[「」]/g, "") || "Hari Pernikahan";
          var tr = byId("ep-trans");
          var petBox = byId("ep-trans-petals");
          if (petBox) {
            for (var i = 0; i < 22; i++) {
              var sp = doc.createElement("span");
              sp.className = "tp";
              sp.id = "tp-" + i;
              sp.style.cssText =
                "--ty:" +
                rand(-10, 100).toFixed(0) +
                "%;--td:" +
                rand(0, 0.25).toFixed(2) +
                "s;--tsc:" +
                rand(0.8, 2.4).toFixed(2) +
                ";--tdy:" +
                rand(-80, 60).toFixed(0) +
                "px";
              var sv = doc.createElementNS(SVGNS, "svg");
              sv.setAttribute("viewBox", "0 0 24 24");
              sv.setAttribute("id", sp.id + "-s");
              var u = doc.createElementNS(SVGNS, "use");
              u.setAttribute("href", i % 3 ? "#sym-petal" : "#sym-blossom");
              u.setAttribute("id", sp.id + "-u");
              sv.appendChild(u);
              sp.appendChild(sv);
              petBox.appendChild(sp);
            }
          }
          var cur = 0;
          var subI = -1;
          var started = false;
          var playing = false;
          var mode = "idle";
          var pendT = 0;
          var pendFn = null;
          var typer = 0;
          var typing = false;
          var transN = 0;
          var tcI = 0;
          var tcS = 0;
          function schedule(ms, fn) {
            clearTimeout(pendT);
            pendFn = fn;
            pendT = setTimeout(function () {
              pendFn = null;
              fn();
            }, ms);
          }
          function clearAll() {
            clearTimeout(pendT);
            pendFn = null;
            clearInterval(typer);
            typing = false;
          }
          function setPlaying(on) {
            playing = on;
            player.classList.toggle("is-playing", on);
            screen.classList.toggle("is-paused", !on);
            clearInterval(tcI);
            if (on) {
              tcI = setInterval(function () {
                tcS += 1;
                byId("ep-hud-tc").textContent =
                  pad(Math.floor(tcS / 60)) + ":" + pad(tcS % 60);
              }, 1000);
              if (!pendFn && mode === "talk" && !typing) {
                schedule(700, nextSub);
              } else if (!pendFn && mode === "next" && eps[cur + 1]) {
                schedule(2600, function () {
                  playEp(cur + 1, true);
                });
              }
            } else {
              var fn = pendFn;
              clearTimeout(pendT);
              pendFn = fn;
            }
          }
          function resumePending() {
            if (pendFn) {
              var fn = pendFn;
              schedule(500, fn);
            }
          }
          function transition(cb) {
            if (reduce || !tr) {
              cb();
              return;
            }
            var kinds = ["flash", "wipe", "iris", "petal"];
            var kind = kinds[transN % kinds.length];
            transN += 1;
            tr.className = "";
            tr.style.setProperty("--tw", screen.clientWidth + "px");
            void tr.offsetWidth;
            tr.classList.add("t-" + kind);
            SFX.whoosh();
            setTimeout(
              cb,
              kind === "flash" ? 230 : kind === "petal" ? 380 : 400,
            );
            setTimeout(function () {
              tr.classList.remove("t-" + kind);
            }, 1100);
          }
          function markList() {
            eps.forEach(function (e, i) {
              if (e.li) {
                e.li.classList.toggle("is-now", i === cur);
              }
            });
            byId("ep-c-cur").textContent = String(cur + 1);
          }
          function progress() {
            var ep = eps[cur];
            var p = ep.subs.length ? (subI + 1) / ep.subs.length : 1;
            p = clamp(p, 0, 1);
            byId("ep-prog-bar").style.width = (p * 100).toFixed(1) + "%";
            ep.seen = Math.max(ep.seen, p);
            if (ep.li) {
              ep.li
                .querySelector(".ep-li-bar")
                .style.setProperty("--seen", (ep.seen * 100).toFixed(0) + "%");
            }
          }
          function playEp(i, withTrans) {
            clearAll();
            var go = function () {
              cur = clamp(i, 0, eps.length - 1);
              var ep = eps[cur];
              subI = -1;
              mode = "card";
              eps.forEach(function (e) {
                e.scene.classList.toggle("is-on", e === ep);
                e.scene.classList.remove("is-mem");
              });
              byId("ep-hud-ep").textContent = window.AnginPlatform.copy.episode + " " + ep.k;
              byId("ep-hud-season").textContent = SJ[ep.season] || window.AnginPlatform.seasons.semi;
              byId("ep-card-ja").textContent = window.AnginPlatform.copy.episode + " " + ep.k;
              byId("ep-card-no").textContent = window.AnginPlatform.copy.episode + " " + ep.k;
              byId("ep-card-title").textContent = ep.title;
              byId("ep-card-time").textContent = ep.when;
              subsT.textContent = "";
              screen.classList.remove(
                "is-next",
                "is-talk",
                "is-waiting",
                "is-eye",
                "is-card",
              );
              void screen.offsetWidth;
              screen.classList.add("is-card");
              markList();
              progress();
              SFX.chime();
              schedule(reduce ? 900 : 2400, function () {
                screen.classList.remove("is-card");
                ep.scene.classList.add("is-mem");
                mode = "talk";
                schedule(reduce ? 200 : 900, nextSub);
              });
            };
            if (withTrans) {
              transition(go);
            } else {
              go();
            }
          }
          function nextSub() {
            var ep = eps[cur];
            if (mode !== "talk") {
              return;
            }
            if (subI === 1 && ep.subs.length >= 4 && !ep.eye && !reduce) {
              ep.eye = true;
              mode = "eye";
              screen.classList.remove("is-talk", "is-waiting");
              screen.classList.add("is-eye");
              SFX.kira();
              schedule(1500, function () {
                screen.classList.remove("is-eye");
                mode = "talk";
                schedule(350, nextSub);
              });
              return;
            }
            subI += 1;
            if (subI >= ep.subs.length) {
              endEp();
              return;
            }
            progress();
            typeSub(ep.subs[subI]);
          }
          function typeSub(s) {
            screen.classList.add("is-talk");
            screen.classList.remove("is-waiting");
            clearInterval(typer);
            if (reduce) {
              subsT.textContent = s;
              afterTyped(s);
              return;
            }
            var chars = Array.from ? Array.from(s) : s.split("");
            var k = 0;
            typing = true;
            subsT.textContent = "";
            typer = setInterval(function () {
              k += 2;
              subsT.textContent = chars.slice(0, k).join("");
              if (k % 8 === 0) {
                SFX.tick();
              }
              if (k >= chars.length) {
                clearInterval(typer);
                typing = false;
                afterTyped(s);
              }
            }, 34);
          }
          function afterTyped(s) {
            screen.classList.add("is-waiting");
            if (playing) {
              schedule(1500 + s.length * 36, nextSub);
            }
          }
          function endEp() {
            mode = "next";
            screen.classList.remove("is-talk", "is-waiting");
            var nx = eps[cur + 1];
            byId("ep-next-title").textContent = nx
              ? window.AnginPlatform.copy.episode + " " + nx.k + " — " + nx.title
              : window.AnginPlatform.copy.final + " — " + finalTitle;
            byId("ep-next-go-t").textContent = nx
              ? window.AnginPlatform.copy.next + " " + nx.k
              : window.AnginPlatform.copy.final;
            screen.classList.add("is-next");
            progress();
            SFX.kira();
            if (playing && nx) {
              schedule(4600, function () {
                playEp(cur + 1, true);
              });
            }
          }
          function advance() {
            if (!started) {
              start();
              return;
            }
            if (mode === "card") {
              clearAll();
              screen.classList.remove("is-card");
              eps[cur].scene.classList.add("is-mem");
              mode = "talk";
              nextSub();
            } else if (mode === "talk") {
              if (typing) {
                clearInterval(typer);
                typing = false;
                subsT.textContent = eps[cur].subs[subI] || "";
                afterTyped(subsT.textContent);
              } else {
                clearAll();
                nextSub();
              }
            } else if (mode === "eye") {
              clearAll();
              screen.classList.remove("is-eye");
              mode = "talk";
              nextSub();
            } else if (mode === "next") {
              goNext();
            }
          }
          function goNext() {
            if (eps[cur + 1]) {
              playEp(cur + 1, true);
            } else {
              clearAll();
              var list = visibleSections();
              var idx = list.indexOf(sec);
              var target = null;
              for (var j = idx + 1; j < list.length; j++) {
                if (list[j].id === "sec-hitung") {
                  target = list[j];
                  break;
                }
              }
              target = target || list[idx + 1];
              if (target) {
                goTo(target.getAttribute("data-section"), true);
              }
            }
          }
          function start() {
            if (started) {
              return;
            }
            started = true;
            screen.classList.add("is-started", "is-playing", "is-cine");
            setPlaying(true);
            playEp(0, false);
          }
          byId("ep-start").addEventListener("click", function (e) {
            e.stopPropagation();
            SFX.select();
            start();
          });
          screen.addEventListener("click", function (e) {
            if (e.target.closest("button")) {
              return;
            }
            advance();
          });
          screen.addEventListener("keydown", function (e) {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              advance();
            } else if (e.key === "ArrowRight") {
              advance();
            } else if (e.key === "ArrowLeft" && started) {
              playEp(Math.max(0, cur - 1), true);
            }
          });
          byId("ep-c-play").addEventListener("click", function () {
            SFX.blip();
            if (!started) {
              start();
              return;
            }
            setPlaying(!playing);
            if (playing) {
              resumePending();
            }
          });
          byId("ep-c-next").addEventListener("click", function () {
            SFX.blip(true);
            advance();
          });
          byId("ep-c-prev").addEventListener("click", function () {
            SFX.blip();
            if (!started) {
              start();
              return;
            }
            playEp(
              subI > 0 || mode === "next" ? cur : Math.max(0, cur - 1),
              true,
            );
          });
          byId("ep-next-go").addEventListener("click", function (e) {
            e.stopPropagation();
            SFX.select();
            goNext();
          });
          byId("ep-next-re").addEventListener("click", function (e) {
            e.stopPropagation();
            SFX.blip();
            playEp(cur, true);
          });
          eps.forEach(function (e, i) {
            var b = byId("ep-li-" + e.n + "-btn");
            if (b) {
              b.addEventListener("click", function () {
                SFX.select();
                if (!started) {
                  started = true;
                  screen.classList.add("is-started", "is-playing", "is-cine");
                  setPlaying(true);
                }
                playEp(i, true);
                if (window.innerWidth < 1024) {
                  var y = absTop(screen) - 80;
                  if (window.pageYOffset > y + 40) {
                    window.scrollTo({
                      top: y,
                      behavior: reduce ? "auto" : "smooth",
                    });
                  }
                }
              });
            }
          });
          markList();
          if ("IntersectionObserver" in window) {
            var autoPaused = false;
            var io = new IntersectionObserver(
              function (en) {
                var r = en[0].intersectionRatio;
                if (en[0].isIntersecting && r >= 0.55) {
                  if (!started && sec.__seen) {
                    start();
                  } else if (autoPaused) {
                    autoPaused = false;
                    setPlaying(true);
                    resumePending();
                  }
                } else if (r < 0.2 && playing) {
                  autoPaused = true;
                  setPlaying(false);
                }
              },
              { threshold: [0, 0.2, 0.55, 0.8] },
            );
            io.observe(screen);
          }
        }
        function setupPengakuan() {
          var sec = byId("sec-pengakuan");
          if (!sec) {
            return;
          }
          var Q = txt("pk-line-q");
          var A = txt("pk-line-a");
          if (!Q && !A) {
            hideSection(sec);
            return;
          }
          ["g", "b"].forEach(function (k) {
            var img = byId("pk-img-" + k);
            var ini = byId("pk-ini-" + k);
            if (ini) {
              ini.textContent = initialOf(k === "g" ? GROOM : BRIDE);
            }
            if (!imgOk(img)) {
              byId("pk-chr-" + k).classList.add("no-photo");
            }
          });
          if (!txt("pk-intro")) {
            byId("pk-intro").hidden = true;
          }
          if (!txt("pk-when-t")) {
            byId("pk-when").hidden = true;
          }
          if (!txt("pk-where-t")) {
            byId("pk-where").hidden = true;
          }
          var stage = byId("pk-stage");
          var hold = byId("pk-hold");
          var dlg = byId("pk-dialog");
          var dlgName = byId("pk-dialog-name");
          var dlgT = byId("pk-dialog-t");
          var chrG = byId("pk-chr-g");
          var chrB = byId("pk-chr-b");
          var tries = byId("pk-tries");
          var again = byId("pk-again");
          var state = "ready";
          var v = 0;
          var holding = false;
          var raf = 0;
          var last = 0;
          var nextBeat = 0;
          var fails = 0;
          var z0 = 0.62;
          var z1 = 0.92;
          var typeI = 0;
          var WEAK = [
            "A-anu… cuacanya bagus, ya?",
            "Aku… eh, kamu sudah makan belum?",
            "(Tidak jadi. Kembang apinya terlalu indah untuk diganggu…)",
            "Aku mau bilang… ah, lupa.",
          ];
          WEAK = WEAK.map(function (s) {
            return s;
          });
          function setDoki(x) {
            v = clamp(x, 0, 1);
            sec.style.setProperty("--doki", v.toFixed(3));
          }
          function setZone() {
            stage.style.setProperty("--z0", (z0 * 100).toFixed(0) + "%");
            stage.style.setProperty("--z1", (z1 * 100).toFixed(0) + "%");
          }
          setZone();
          function say(who, text, big) {
            dlg.classList.toggle("is-bride", who === "b");
            dlg.classList.toggle("is-narr", who === "n");
            dlg.classList.toggle("is-big", !!big);
            dlgName.textContent =
              who === "b" ? BRIDE : who === "g" ? GROOM : "Narator";
            clearInterval(typeI);
            if (reduce) {
              dlgT.textContent = text;
              return;
            }
            var chars = Array.from ? Array.from(text) : text.split("");
            var k = 0;
            dlgT.textContent = "";
            typeI = setInterval(
              function () {
                k += 1;
                dlgT.textContent = chars.slice(0, k).join("");
                if (k >= chars.length) {
                  clearInterval(typeI);
                }
              },
              big ? 55 : 32,
            );
          }
          function loop(t) {
            if (!holding) {
              return;
            }
            var dt = Math.min(60, t - (last || t));
            last = t;
            setDoki(v + ((0.16 + v * 0.45) * dt) / 1000);
            if (t >= nextBeat) {
              SFX.heart(lerp(0.26, 0.12, v));
              vibrate(8);
              nextBeat = t + lerp(760, 230, v);
            }
            if (v >= 1) {
              release(true);
              return;
            }
            raf = requestAnimationFrame(loop);
          }
          function press(e) {
            if (state !== "ready") {
              return;
            }
            if (e && e.cancelable) {
              e.preventDefault();
            }
            ac();
            holding = true;
            last = 0;
            nextBeat = 0;
            setDoki(0);
            sec.classList.add("is-holding");
            stage.classList.add("is-shake");
            chrG.classList.add("is-sweat", "is-blush");
            tries.textContent = "";
            say("g", "(Deg-degan… deg-degan… deg-degan…)");
            raf = requestAnimationFrame(loop);
          }
          function release(forced) {
            if (!holding) {
              return;
            }
            holding = false;
            cancelAnimationFrame(raf);
            sec.classList.remove("is-holding");
            stage.classList.remove("is-shake");
            chrG.classList.remove("is-sweat");
            if (forced === true) {
              fail("faint");
            } else if (v >= z0 && v <= z1) {
              win();
            } else {
              fail(v < z0 ? "weak" : "faint");
            }
          }
          function drain() {
            var start = v;
            var t0 = now();
            (function step(t) {
              var u = Math.min(1, (t - t0) / 600);
              setDoki(start * (1 - u));
              if (u < 1 && state !== "won") {
                requestAnimationFrame(step);
              }
            })(t0);
          }
          function fail(kind) {
            state = "cool";
            fails += 1;
            chrG.classList.remove("is-blush");
            if (kind === "weak") {
              say("g", WEAK[(fails - 1) % WEAK.length]);
              SFX.blip();
            } else {
              chrG.classList.add("is-faint");
              say(
                "n",
                "Terlalu gugup sampai pingsan! Tarik napas, lalu coba lagi.",
              );
              SFX.pop();
              setTimeout(function () {
                chrG.classList.remove("is-faint");
              }, 1500);
            }
            drain();
            if (fails >= 2 && z0 > 0.5) {
              z0 = 0.45;
              z1 = 0.97;
              setZone();
              tries.textContent =
                "Tenang — di dunia nyata, " +
                (GROOM || "dia") +
                " berhasil ♡ Zona nembak diperlebar.";
            } else {
              tries.textContent =
                "Percobaan ke-" +
                fails +
                " · lepaskan saat jarum di zona merah muda.";
            }
            setTimeout(function () {
              if (state === "cool") {
                state = "ready";
              }
            }, 700);
          }
          function win() {
            if (state === "won") {
              return;
            }
            state = "won";
            holding = false;
            cancelAnimationFrame(raf);
            sec.classList.remove("is-holding");
            stage.classList.remove("is-shake");
            sec.classList.add("is-won", "is-boom");
            chrG.classList.add("is-blush");
            tries.textContent = "";
            SFX.boom();
            vibrate(40);
            fwShow(true);
            say("g", Q || "…", true);
            setTimeout(function () {
              sec.classList.remove("is-boom");
            }, 1400);
            setTimeout(
              function () {
                chrB.classList.add("is-blush");
                say("b", A || "…Iya!", true);
                SFX.kira();
                fwShow(true);
              },
              reduce ? 400 : 2800,
            );
            setTimeout(
              function () {
                sec.classList.add("is-done");
                again.hidden = false;
              },
              reduce ? 600 : 4300,
            );
          }
          function reset() {
            state = "ready";
            fails = 0;
            z0 = 0.62;
            z1 = 0.92;
            setZone();
            setDoki(0);
            sec.classList.remove("is-won", "is-done", "is-boom");
            chrG.classList.remove("is-blush", "is-faint");
            chrB.classList.remove("is-blush");
            again.hidden = true;
            tries.textContent = "";
            say("g", "(Tarik napas… sekarang atau tidak sama sekali.)");
          }
          hold.addEventListener("pointerdown", function (e) {
            if (hold.setPointerCapture && e.pointerId !== undefined) {
              try {
                hold.setPointerCapture(e.pointerId);
              } catch (err) {}
            }
            press(e);
          });
          hold.addEventListener("pointerup", function () {
            release(false);
          });
          hold.addEventListener("pointercancel", function () {
            release(false);
          });
          hold.addEventListener("lostpointercapture", function () {
            release(false);
          });
          hold.addEventListener("contextmenu", function (e) {
            e.preventDefault();
          });
          hold.addEventListener("keydown", function (e) {
            if ((e.key === " " || e.key === "Enter") && !e.repeat) {
              press(e);
            }
          });
          hold.addEventListener("keyup", function (e) {
            if (e.key === " " || e.key === "Enter") {
              release(false);
            }
          });
          byId("pk-skip").addEventListener("click", function () {
            SFX.select();
            win();
          });
          again.addEventListener("click", function () {
            SFX.blip();
            reset();
          });
          if (reduce) {
            byId("pk-hold").hidden = true;
            byId("pk-hold-h").hidden = true;
            byId("pk-meter").hidden = true;
          }
          var cv = byId("pk-fw");
          var ctx = cv && cv.getContext ? cv.getContext("2d") : null;
          var FW = { on: false, rockets: [], sparks: [], next: 0, W: 0, H: 0 };
          var COLS = [
            "#ff9dbb",
            "#ffd36c",
            "#8fd1ff",
            "#ffffff",
            "#ff6f96",
            "#b58cff",
          ];
          function fwSize() {
            if (!ctx) {
              return;
            }
            var r = cv.getBoundingClientRect();
            var dpr = Math.min(window.devicePixelRatio || 1, 2);
            FW.W = r.width;
            FW.H = r.height;
            cv.width = Math.round(r.width * dpr);
            cv.height = Math.round(r.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
          function rocket(x, ty) {
            FW.rockets.push({
              x: x,
              y: FW.H + 10,
              ty: ty,
              vy: -rand(7, 9.5),
              col: pick(COLS),
            });
          }
          function explode(x, y, col, n) {
            for (var i = 0; i < n; i++) {
              var a = (i / n) * Math.PI * 2 + rand(-0.05, 0.05);
              var s = rand(1.6, 4.2);
              FW.sparks.push({
                x: x,
                y: y,
                px: x,
                py: y,
                vx: Math.cos(a) * s,
                vy: Math.sin(a) * s,
                life: 1,
                col: Math.random() < 0.25 ? "#ffffff" : col,
                d: rand(0.008, 0.015),
              });
            }
          }
          function fwShow(big) {
            if (!ctx || reduce) {
              return;
            }
            fwSize();
            var k = big ? 5 : 1;
            for (var i = 0; i < k; i++) {
              (function (j) {
                setTimeout(function () {
                  rocket(
                    rand(FW.W * 0.15, FW.W * 0.85),
                    rand(FW.H * 0.08, FW.H * 0.35),
                  );
                }, j * 220);
              })(i);
            }
            if (!FW.on) {
              FW.on = true;
              requestAnimationFrame(fwLoop);
            }
          }
          function fwLoop(t) {
            if (!FW.on) {
              ctx.clearRect(0, 0, FW.W, FW.H);
              return;
            }
            if (t > FW.next) {
              rocket(
                rand(FW.W * 0.1, FW.W * 0.9),
                rand(FW.H * 0.06, FW.H * 0.3),
              );
              FW.next = t + rand(1500, 2800);
            }
            ctx.clearRect(0, 0, FW.W, FW.H);
            ctx.globalCompositeOperation = "lighter";
            for (var i = FW.rockets.length - 1; i >= 0; i--) {
              var r = FW.rockets[i];
              r.y += r.vy;
              r.vy *= 0.985;
              ctx.fillStyle = "rgba(255,240,220,.9)";
              ctx.fillRect(r.x - 1, r.y, 2, 7);
              if (r.y <= r.ty || r.vy > -1.2) {
                explode(r.x, r.y, r.col, Math.round(rand(46, 70)));
                FW.rockets.splice(i, 1);
              }
            }
            for (var j = FW.sparks.length - 1; j >= 0; j--) {
              var s = FW.sparks[j];
              s.px = s.x;
              s.py = s.y;
              s.vx *= 0.975;
              s.vy = s.vy * 0.975 + 0.035;
              s.x += s.vx;
              s.y += s.vy;
              s.life -= s.d;
              if (s.life <= 0) {
                FW.sparks.splice(j, 1);
                continue;
              }
              ctx.strokeStyle = s.col;
              ctx.globalAlpha = Math.max(0, s.life);
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(s.px, s.py);
              ctx.lineTo(s.x, s.y);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            requestAnimationFrame(fwLoop);
          }
          onVis("sec-pengakuan", function (on) {
            if (!ctx || reduce) {
              return;
            }
            if (on) {
              fwSize();
              if (!FW.on) {
                FW.on = true;
                FW.next = 0;
                requestAnimationFrame(fwLoop);
              }
            } else {
              FW.on = false;
            }
          });
          window.addEventListener("resize", function () {
            if (FW.on) {
              fwSize();
            }
          });
        }
        function placeIdOf(a) {
          if (!a) {
            return "";
          }
          var m = /destination_place_id=([^&]*)/.exec(
            a.getAttribute("href") || "",
          );
          var v = m ? decodeURIComponent(m[1]).trim() : "";
          return /^\{\{/.test(v) ? "" : v;
        }
        function eventsData() {
          var list = [];
          var v1 = txt("st-1-venue-n");
          var a1 = txt("st-1-venue-a");
          var s1 = absTime(W_DATE, W_TIME);
          var e1 = absTime(W_DATE, txt("st-1-t1"));
          if (!(e1 > s1)) {
            e1 = s1 + 2 * 3600000;
          }
          list.push({
            key: 1,
            name: txt("st-1-name") || "Akad Nikah",
            date: W_DATE,
            t0: W_TIME,
            t1: txt("st-1-t1"),
            venue: v1,
            addr: a1,
            start: s1,
            end: e1,
            pid: placeIdOf(byId("st-1-map")),
          });
          var n2 = txt("st-2-name");
          if (n2) {
            var d2 =
              (byId("st-2-date-t") &&
                byId("st-2-date-t").getAttribute("datetime")) ||
              "";
            if (!parseYMD(d2)) {
              d2 = W_DATE;
            }
            var t20 = txt("st-2-t0") || W_TIME;
            var s2 = absTime(d2, t20);
            var e2 = absTime(d2, txt("st-2-t1"));
            if (!(e2 > s2)) {
              e2 = s2 + 3 * 3600000;
            }
            list.push({
              key: 2,
              name: n2,
              date: d2,
              t0: t20,
              t1: txt("st-2-t1"),
              venue: txt("st-2-venue-n") || v1,
              addr: txt("st-2-venue-a") || a1,
              start: s2,
              end: e2,
              pid: "",
            });
          }
          return list;
        }
        var EVENTS = [];
        function utcStamp(ts) {
          return new Date(ts)
            .toISOString()
            .replace(/[-:]/g, "")
            .replace(/\.\d{3}/, "");
        }
        function coupleTitle() {
          return (
            (BRIDE && GROOM
              ? BRIDE + " & " + GROOM
              : BRIDE || GROOM || window.AnginPlatform.copy.event) + ""
          );
        }
        function gcalUrl(ev) {
          if (!(ev.start > 0)) {
            return "";
          }
          var loc = [ev.venue, ev.addr].filter(Boolean).join(", ");
          return (
            "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" +
            encodeURIComponent(ev.name + " — " + coupleTitle()) +
            "&dates=" +
            utcStamp(ev.start) +
            "/" +
            utcStamp(ev.end) +
            "&details=" +
            encodeURIComponent(
              window.AnginPlatform.eventDescription,
            ) +
            "&location=" +
            encodeURIComponent(loc)
          );
        }
        function mapUrl(ev) {
          var q = [ev.venue, ev.addr].filter(Boolean).join(", ");
          if (ev.pid) {
            return (
              "https://www.google.com/maps/dir/?api=1&destination=" +
              encodeURIComponent(q || window.AnginPlatform.copy.venue) +
              "&travelmode=driving&destination_place_id=" +
              encodeURIComponent(ev.pid)
            );
          }
          return q
            ? "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(q)
            : "";
        }
        function icsEsc(s) {
          return (s || "")
            .replace(/\\/g, "\\\\")
            .replace(/;/g, "\\;")
            .replace(/,/g, "\\,")
            .replace(/\n/g, "\\n");
        }
        function downloadIcs() {
          var evs = EVENTS.filter(function (e) {
            return e.start > 0;
          });
          if (!evs.length) {
            return;
          }
          var L = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//Undangan Anime Romansa//ID",
            "CALSCALE:GREGORIAN",
            "METHOD:PUBLISH",
          ];
          evs.forEach(function (e) {
            L.push(
              "BEGIN:VEVENT",
              "UID:" + utcStamp(e.start) + "-" + e.key + "@undangan",
              "DTSTAMP:" + utcStamp(Date.now()),
              "DTSTART:" + utcStamp(e.start),
              "DTEND:" + utcStamp(e.end),
              "SUMMARY:" + icsEsc(e.name + " — " + coupleTitle()),
              "LOCATION:" +
                icsEsc([e.venue, e.addr].filter(Boolean).join(", ")),
              "DESCRIPTION:" + icsEsc(window.AnginPlatform.eventDescription),
              "BEGIN:VALARM",
              "TRIGGER:-P1D",
              "ACTION:DISPLAY",
              "DESCRIPTION:" + icsEsc(e.name),
              "END:VALARM",
              "END:VEVENT",
            );
          });
          L.push("END:VCALENDAR");
          try {
            var blob = new Blob([L.join("\r\n")], {
              type: "text/calendar;charset=utf-8",
            });
            var a = doc.createElement("a");
            a.id = uid("ics-dl");
            a.href = URL.createObjectURL(blob);
            a.download =
              "episode-final-" +
              (BRIDE + "-" + GROOM).toLowerCase().replace(/[^a-z0-9]+/g, "-") +
              ".ics";
            body.appendChild(a);
            a.click();
            setTimeout(function () {
              URL.revokeObjectURL(a.href);
              a.remove();
            }, 1500);
            toast(window.AnginPlatform.copy.download);
          } catch (e) {}
        }
        function setupHitung() {
          var sec = byId("sec-hitung");
          if (!sec) {
            return;
          }
          EVENTS = eventsData();
          var urls = [];
          var add = function (u) {
            if (isUrl(u) && urls.indexOf(u) < 0) {
              urls.push(u);
            }
          };
          [
            "hero-photo",
            "chr-img-b",
            "chr-img-g",
            "ep-mem-1-img",
            "ep-mem-2-img",
            "ep-mem-3-img",
            "ep-mem-4-img",
          ].forEach(function (id) {
            var im = byId(id);
            if (im) {
              add(im.getAttribute("src"));
            }
          });
          GAL.slice(0, 4).forEach(add);
          var src = byId("yk-src");
          if (src) {
            ["a", "b", "c", "d", "e"].forEach(function (k) {
              add(src.getAttribute("data-" + k));
            });
          }
          urls = urls.slice(0, 8);
          var cutsBox = byId("yk-cuts");
          var cuts = urls.map(function (u, i) {
            var c = doc.createElement("div");
            c.className = "yk-cut k-" + ((i % 3) + 1);
            c.id = "yk-cut-" + i;
            c.style.backgroundImage = 'url("' + u.replace(/"/g, "%22") + '")';
            cutsBox.appendChild(c);
            return c;
          });
          var cutI = -1;
          var cutT = 0;
          var screenEl = byId("yk-screen");
          function nextCut() {
            if (!cuts.length) {
              return;
            }
            if (cutI >= 0) {
              cuts[cutI].classList.remove("is-on");
            }
            cutI = (cutI + 1) % cuts.length;
            cuts[cutI].classList.add("is-on");
            screenEl.classList.remove("is-cut");
            void screenEl.offsetWidth;
            screenEl.classList.add("is-cut");
          }
          if (cuts.length) {
            nextCut();
          }
          onVis("sec-hitung", function (on) {
            clearInterval(cutT);
            if (on && !reduce && cuts.length > 1) {
              cutT = setInterval(nextCut, 1300);
            }
          });
          if (!txt("yk-narr")) {
            byId("yk-narr").hidden = true;
          }
          var vBtn = byId("yk-voice");
          var synth = window.speechSynthesis;
          if (!synth || !window.SpeechSynthesisUtterance || !txt("yk-narr")) {
            vBtn.hidden = true;
          } else {
            vBtn.addEventListener("click", function () {
              try {
                if (synth.speaking) {
                  synth.cancel();
                  return;
                }
                var u = new SpeechSynthesisUtterance(
                  txt("yk-narr") +
                    " Episode final. " +
                    txt("yk-final-t").replace(/[「」]/g, ""),
                );
                u.lang = window.AnginPlatform.intlLocale;
                u.rate = 1.02;
                u.pitch = 1.1;
                var vs = synth.getVoices ? synth.getVoices() : [];
                for (var i = 0; i < vs.length; i++) {
                  if (/^id/i.test(vs[i].lang)) {
                    u.voice = vs[i];
                    break;
                  }
                }
                if (bgm && !bgm.paused) {
                  bgm.volume = 0.15;
                  u.onend = function () {
                    bgm.volume = 0.55;
                  };
                }
                synth.speak(u);
              } catch (e) {}
            });
          }
          var cdCard = byId("cd-card");
          var ev0 = EVENTS[0];
          var gcal = byId("cd-gcal");
          if (gcal) {
            var gu = gcalUrl(ev0);
            if (gu) {
              gcal.href = gu;
            } else {
              gcal.hidden = true;
            }
          }
          byId("cd-ics").addEventListener("click", function () {
            SFX.select();
            downloadIcs();
          });
          var d = parseYMD(W_DATE);
          if (!d || !(W_TS > 0)) {
            if (cdCard) {
              cdCard.hidden = true;
            }
            return;
          }
          byId("cd-mon").textContent = BULAN[d.m - 1].toUpperCase() + " " + d.y;
          var wd = new Date(Date.UTC(d.y, d.m - 1, d.d, 12)).getUTCDay();
          byId("cd-wd").textContent = HARI[wd];
          if (wd === 0) {
            byId("cd-main").classList.add("is-sun");
          }
          byId("cd-when-d").textContent = fmtDate(W_DATE);
          var ft = fmtTime(W_TIME);
          byId("cd-when-t").textContent = ft ? ft + " " + tzLabel : "";
          if (!ft) {
            byId("cd-when-sep").hidden = true;
          }
          var elD = byId("cd-days");
          var elH = byId("cd-h");
          var elM = byId("cd-m");
          var elS = byId("cd-s");
          var lastEnd = EVENTS.reduce(function (m, e) {
            return Math.max(m, e.end || 0);
          }, W_TS);
          var shownDays = -1;
          var setTick = function (el, v) {
            if (el.textContent !== v) {
              el.textContent = v;
              el.classList.remove("is-tick");
              void el.offsetWidth;
              el.classList.add("is-tick");
            }
          };
          function tick() {
            var diff = W_TS - Date.now();
            if (diff <= 0) {
              sec.classList.add("is-past");
              var st = byId("cd-state");
              st.hidden = false;
              st.textContent =
                Date.now() < lastEnd + 6 * 3600000
                  ? window.AnginPlatform.copy.occasion
                  : window.AnginPlatform.copy.thanks;
              clearInterval(tick.i);
              return;
            }
            var s = Math.floor(diff / 1000);
            var days = Math.floor(s / 86400);
            if (days !== shownDays && !tearing) {
              elD.textContent = String(days);
              elD.classList.toggle("is-long", days > 999);
              shownDays = days;
            }
            byId("cd-unit").textContent =
              days === 0 ? window.AnginPlatform.copy.occasion : window.AnginPlatform.copy.days;
            setTick(elH, pad(Math.floor((s % 86400) / 3600)));
            setTick(elM, pad(Math.floor((s % 3600) / 60)));
            setTick(elS, pad(s % 60));
          }
          var tearing = false;
          tick();
          tick.i = setInterval(tick, 1000);
          function tearMontage() {
            if (reduce || sec.classList.contains("is-past")) {
              return;
            }
            var days = Math.max(0, Math.floor((W_TS - Date.now()) / 86400000));
            var n = Math.min(12, 6 + Math.round(Math.random() * 4));
            var fly = byId("cd-fly");
            fly.innerHTML = "";
            tearing = true;
            var pages = [];
            for (var i = n; i >= 1; i--) {
              var p = doc.createElement("div");
              p.className = "cd-flyp";
              p.id = "cd-flyp-" + i;
              var sp = doc.createElement("span");
              sp.id = p.id + "-n";
              sp.textContent = String(days + i);
              p.appendChild(sp);
              p.style.setProperty("--fx", rand(180, 380).toFixed(0) + "px");
              p.style.setProperty("--fy", rand(-280, -120).toFixed(0) + "px");
              p.style.setProperty("--fr", rand(25, 120).toFixed(0) + "deg");
              fly.appendChild(p);
              pages.push(p);
            }
            sec.classList.add("is-tearing");
            var k = pages.length - 1;
            var step = function () {
              if (k < 0) {
                tearing = false;
                sec.classList.remove("is-tearing");
                elD.textContent = String(days);
                var main = byId("cd-main");
                main.classList.remove("is-land");
                void main.offsetWidth;
                main.classList.add("is-land");
                SFX.kira();
                setTimeout(function () {
                  fly.innerHTML = "";
                }, 1400);
                return;
              }
              pages[k].classList.add("is-torn");
              if (k % 2 === 0) {
                SFX.paper();
              }
              k -= 1;
              setTimeout(step, 150);
            };
            setTimeout(step, 400);
            triggerGust(2.8);
          }
          onSeen("sec-hitung", function () {
            setTimeout(tearMontage, 350);
          });
          byId("cd-cal").addEventListener("click", function () {
            if (!tearing) {
              tearMontage();
            }
          });
        }
        function setupAcara() {
          var sec = byId("sec-acara");
          if (!sec) {
            return;
          }
          if (!EVENTS.length) {
            EVENTS = eventsData();
          }
          var e1 = EVENTS[0];
          var e2 = EVENTS[1];
          var list = byId("ac-list");
          [e1, e2].forEach(function (ev, i) {
            var k = i + 1;
            if (!ev) {
              return;
            }
            byId("st-" + k + "-kana").textContent = kana(ev.name);
            byId("st-" + k + "-roma").textContent = ev.name.toUpperCase();
            var dt = byId("st-" + k + "-date-t");
            dt.textContent = fmtDate(ev.date);
            dt.setAttribute("datetime", ev.date);
            var t0 = fmtTime(ev.t0);
            var t1 = fmtTime(ev.t1);
            byId("st-" + k + "-t0").textContent = t0;
            byId("st-" + k + "-t1").textContent = t1;
            byId("st-" + k + "-tz").textContent = t0 ? tzLabel : "";
            if (!t1) {
              byId("st-" + k + "-dash").hidden = true;
              byId("st-" + k + "-t1").hidden = true;
            }
            if (!t0 && !t1) {
              byId("st-" + k + "-time").hidden = true;
            }
            byId("st-" + k + "-venue-n").textContent = ev.venue;
            byId("st-" + k + "-venue-a").textContent = ev.addr;
            if (!ev.venue && !ev.addr) {
              byId("st-" + k + "-venue").hidden = true;
            }
            if (!txt("st-" + k + "-note")) {
              byId("st-" + k + "-note").hidden = true;
            }
            var mu = mapUrl(ev);
            var ma = byId("st-" + k + "-map");
            if (mu) {
              ma.href = mu;
            } else {
              ma.hidden = true;
            }
            var cu = gcalUrl(ev);
            var ca = byId("st-" + k + "-cal");
            if (cu) {
              ca.href = cu;
            } else {
              ca.hidden = true;
            }
            var gn = guestName || window.AnginPlatform.copy.guest;
            byId("st-" + k + "-ticket-b").textContent =
              "1 × " + (gn.length > 22 ? gn.slice(0, 21) + "…" : gn);
          });
          byId("st-1-prev-t").textContent = window.AnginPlatform.copy.yesterday;
          byId("st-1-next-t").textContent = e2 ? e2.name : window.AnginPlatform.copy.forever;
          if (e2) {
            byId("st-2-prev-t").textContent = e1.name;
          } else {
            byId("st-2").hidden = true;
            list.classList.add("is-single");
          }
          var led = EVENTS.map(function (ev) {
            var t = fmtTime(ev.t0);
            return ev.name + (t ? " " + t : "");
          });
          led.push(window.AnginPlatform.copy.forever);
          var ledT = byId("ac-led-t");
          ledT.textContent = led.join("   ▶   ") + "   ▶   ";
          ledT.style.setProperty(
            "--ledd",
            Math.max(12, ledT.textContent.length * 0.32).toFixed(0) + "s",
          );
          fillPetals(byId("ac-petals"), 12, ["petal", "maple", "petal"]);
          var trainBusy = false;
          function passTrain(withSound) {
            if (reduce || trainBusy) {
              return;
            }
            trainBusy = true;
            sec.classList.remove("is-train");
            void sec.offsetWidth;
            sec.classList.add("is-train");
            if (withSound) {
              SFX.train();
            }
            setTimeout(function () {
              triggerGust(3.2);
            }, 900);
            setTimeout(function () {
              sec.classList.remove("is-train");
              trainBusy = false;
            }, 2700);
          }
          onSeen("sec-acara", function () {
            setTimeout(function () {
              passTrain(false);
            }, 700);
          });
          var ledBox = byId("ac-led");
          ledBox.setAttribute("role", "button");
          ledBox.setAttribute("tabindex", "0");
          ledBox.setAttribute("aria-label", window.AnginPlatform.copy.event);
          ledBox.style.cursor = "pointer";
          ledBox.addEventListener("click", function () {
            passTrain(true);
          });
          ledBox.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              passTrain(true);
            }
          });
        }
        var SB_ICONS = [
          "heart",
          "users",
          "utensils",
          "camera",
          "mic2",
          "cake",
          "music",
          "gift",
          "party-popper",
          "sparkles",
          "flower2",
          "home",
          "car",
          "shirt",
          "clock",
          "star",
        ];
        function setupRundown() {
          var sec = byId("sec-rundown");
          if (!sec) {
            return;
          }
          var data = [];
          try {
            var raw = byId("wedivo-rundown-data");
            data = JSON.parse((raw && raw.textContent) || "[]");
          } catch (e) {
            data = [];
          }
          if (!Array.isArray(data)) {
            data = [];
          }
          data = data.filter(function (it) {
            return it && typeof it.title === "string" && it.title.trim();
          });
          if (!data.length) {
            hideSection(sec);
            return;
          }
          var box = byId("sb-body");
          var dates = [];
          data.forEach(function (it) {
            if (dates.indexOf(it.date) < 0) {
              dates.push(it.date);
            }
          });
          var multi = dates.length > 1;
          var lastDate = null;
          var dayN = 0;
          var nowTs = Date.now();
          data.forEach(function (it, i) {
            if (it.date !== lastDate) {
              lastDate = it.date;
              dayN += 1;
              var dh = doc.createElement("p");
              dh.className = "sb-day rv";
              dh.id = "sb-day-" + dayN;
              var k = doc.createElement("span");
              k.className = "sb-day-k";
              k.id = dh.id + "-k";
              k.textContent = multi ? window.AnginPlatform.copy.occasion + " " + dayN : window.AnginPlatform.copy.occasion;
              var t = doc.createElement("span");
              t.id = dh.id + "-t";
              t.textContent = fmtDate(it.date);
              dh.appendChild(k);
              dh.appendChild(t);
              box.appendChild(dh);
              observeReveal(dh);
            }
            var row = doc.createElement("div");
            row.className = "sb-row rv";
            row.id = "sb-row-" + (i + 1);
            row.setAttribute("role", "listitem");
            row.style.setProperty(
              "--d",
              Math.min(0.3, (i % 4) * 0.08).toFixed(2) + "s",
            );
            var cut = doc.createElement("span");
            cut.className = "sb-cut";
            cut.id = row.id + "-cut";
            cut.textContent = "C-" + pad(i + 1);
            var frame = doc.createElement("span");
            frame.className = "sb-frame";
            frame.id = row.id + "-frame";
            frame.setAttribute("aria-hidden", "true");
            var ic =
              SB_ICONS.indexOf(String(it.icon || "").toLowerCase()) >= 0
                ? "sb-" + String(it.icon).toLowerCase()
                : "sb-sakura";
            [0, 1].forEach(function (g) {
              var sv = doc.createElementNS(SVGNS, "svg");
              sv.setAttribute("viewBox", "0 0 48 36");
              sv.setAttribute("id", row.id + "-ic" + g);
              if (g === 1) {
                sv.setAttribute("class", "sb-ghost");
              }
              var u = doc.createElementNS(SVGNS, "use");
              u.setAttribute("href", "#" + ic);
              u.setAttribute("id", row.id + "-ic" + g + "-u");
              sv.appendChild(u);
              frame.appendChild(sv);
            });
            var main = doc.createElement("span");
            main.className = "sb-main";
            main.id = row.id + "-main";
            var tt = doc.createElement("span");
            tt.className = "sb-t";
            tt.id = row.id + "-t";
            tt.textContent = it.title.trim();
            main.appendChild(tt);
            if (it.location && String(it.location).trim()) {
              var lo = doc.createElement("span");
              lo.className = "sb-loc";
              lo.id = row.id + "-loc";
              lo.textContent = String(it.location).trim();
              main.appendChild(lo);
            }
            if (it.description && String(it.description).trim()) {
              var de = doc.createElement("span");
              de.className = "sb-desc";
              de.id = row.id + "-desc";
              de.textContent = String(it.description).trim();
              main.appendChild(de);
            }
            var tm = doc.createElement("span");
            tm.className = "sb-time";
            tm.id = row.id + "-time";
            var s0 = null;
            var s1 = null;
            if (it.isAllDay || !it.startTime) {
              tm.textContent = window.AnginPlatform.copy.allDay;
              s0 = absTime(it.date, "00:00");
              s1 = s0 + 86400000;
            } else {
              tm.textContent = fmtTime(it.startTime);
              if (it.endTime) {
                var sm = doc.createElement("small");
                sm.id = row.id + "-end";
                sm.textContent = "s.d. " + fmtTime(it.endTime);
                tm.appendChild(sm);
              }
              s0 = absTime(it.date, it.startTime);
              s1 = it.endTime ? absTime(it.date, it.endTime) : s0 + 3600000;
            }
            if (s0 > 0 && s1 > 0) {
              if (nowTs >= s0 && nowTs < s1) {
                row.classList.add("is-live");
              } else if (nowTs >= s1) {
                row.classList.add("is-done");
              }
            }
            row.appendChild(cut);
            row.appendChild(frame);
            row.appendChild(main);
            row.appendChild(tm);
            box.appendChild(row);
            observeReveal(row);
          });
        }
        function setupLokasi() {
          var sec = byId("sec-lokasi");
          if (!sec) {
            return;
          }
          if (!EVENTS.length) {
            EVENTS = eventsData();
          }
          var real = byId("sj-real");
          if (!imgOk(real)) {
            sec.classList.add("no-photo");
          } else {
            real.addEventListener("error", function () {
              sec.classList.add("no-photo");
            });
          }
          ["lc-addr", "lc-note"].forEach(function (id) {
            if (!txt(id)) {
              byId(id).hidden = true;
            }
          });
          var ifr = byId("lc-iframe");
          var ds = ifr ? ifr.getAttribute("data-src") || "" : "";
          var key = (/key=([^&]*)/.exec(ds) || [])[1] || "";
          var pid = (/place_id:([^&]*)/.exec(ds) || [])[1] || "";
          if (key && pid && !/\{\{/.test(key + pid)) {
            ifr.src = ds;
          } else {
            byId("lc-map").hidden = true;
          }
          var go = byId("lc-go");
          var mu = mapUrl(EVENTS[0]);
          if (mu) {
            go.href = mu;
          } else {
            go.hidden = true;
          }
          var copyB = byId("lc-copy");
          var fullAddr = [txt("lc-name"), txt("lc-addr")]
            .filter(Boolean)
            .join(", ");
          if (!fullAddr) {
            copyB.hidden = true;
          }
          copyB.addEventListener("click", function () {
            SFX.select();
            copyText(fullAddr, window.AnginPlatform.copy.copied);
          });
          var view = byId("sj-view");
          var handle = byId("sj-handle");
          var pos = 50;
          function setPos(p, hint) {
            pos = clamp(p, 0, 100);
            view.style.setProperty("--pos", pos.toFixed(1) + "%");
            handle.setAttribute("aria-valuenow", String(Math.round(pos)));
            if (!hint) {
              view.classList.remove("is-hint");
            }
          }
          var dragging = false;
          function fromEvent(e) {
            var r = view.getBoundingClientRect();
            setPos(((e.clientX - r.left) / r.width) * 100);
          }
          view.addEventListener("pointerdown", function (e) {
            dragging = true;
            try {
              view.setPointerCapture(e.pointerId);
            } catch (err) {}
            fromEvent(e);
          });
          view.addEventListener("pointermove", function (e) {
            if (dragging) {
              fromEvent(e);
            }
          });
          ["pointerup", "pointercancel", "lostpointercapture"].forEach(
            function (t) {
              view.addEventListener(t, function () {
                dragging = false;
              });
            },
          );
          handle.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
              e.preventDefault();
              setPos(pos - 5);
            } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
              e.preventDefault();
              setPos(pos + 5);
            } else if (e.key === "Home") {
              setPos(0);
            } else if (e.key === "End") {
              setPos(100);
            }
          });
          onSeen("sec-lokasi", function () {
            if (reduce || sec.classList.contains("no-photo")) {
              return;
            }
            view.classList.add("is-hint");
            setTimeout(function () {
              setPos(82, true);
            }, 500);
            setTimeout(function () {
              setPos(22, true);
            }, 1800);
            setTimeout(function () {
              setPos(50, true);
            }, 3100);
            setTimeout(function () {
              view.classList.remove("is-hint");
            }, 4400);
          });
          var st = byId("lc-stamp");
          var tp = byId("lc-stamp-tp");
          var name = (txt("lc-name") || "Lokasi Syuting").toUpperCase();
          if (name.length > 22) {
            name = name.slice(0, 21) + "…";
          }
          tp.textContent = name + " ✿ " + window.AnginPlatform.copy.final + " ✿";
          var d = parseYMD(W_DATE);
          byId("lc-stamp-date").textContent = d
            ? pad(d.d) + "." + pad(d.m) + "." + d.y
            : "♡";
          if (store.get("awm-stamp") === "1") {
            st.classList.add("is-stamped");
          }
          st.addEventListener("click", function () {
            st.classList.add("is-stamped");
            st.classList.remove("is-stamping");
            void st.offsetWidth;
            st.classList.add("is-stamping");
            store.set("awm-stamp", "1");
            SFX.stamp();
            vibrate(20);
            byId("lc-stamp-t").firstChild.nodeValue =
              "Cap kenangan sudah tercetak ";
          });
        }
        function hexNorm(h) {
          h = (h || "").trim();
          if (!/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.test(h)) {
            return "";
          }
          h = h.replace("#", "");
          if (h.length === 3) {
            h =
              h.charAt(0) +
              h.charAt(0) +
              h.charAt(1) +
              h.charAt(1) +
              h.charAt(2) +
              h.charAt(2);
          }
          return "#" + h.toLowerCase();
        }
        function mixHex(a, b, t) {
          var pa = [1, 3, 5].map(function (i) {
            return parseInt(a.substr(i, 2), 16);
          });
          var pb = [1, 3, 5].map(function (i) {
            return parseInt(b.substr(i, 2), 16);
          });
          return (
            "#" +
            pa
              .map(function (v, i) {
                return pad(Math.round(v + (pb[i] - v) * t).toString(16));
              })
              .join("")
          );
        }
        function setupBusana() {
          var sec = byId("sec-busana");
          if (!sec) {
            return;
          }
          var sw = [];
          $$(".bs-d").forEach(function (d, i) {
            var hex = hexNorm(d.getAttribute("data-c"));
            if (hex) {
              sw.push({
                hex: hex,
                name: txt(d) || "Warna " + (i + 1),
                n: i + 1,
              });
            }
          });
          var hasText = !!txt("bs-text");
          if (!sw.length && !hasText) {
            hideSection(sec);
            return;
          }
          if (!hasText) {
            byId("bs-text").hidden = true;
          }
          if (!sw.length) {
            byId("bs-grid").hidden = true;
            return;
          }
          var sheet = byId("bs-sheet");
          var wrap = byId("bs-swatches");
          var svg = byId("bs-svg");
          var figs = byId("bs-figs");
          var btns = [];
          sw.forEach(function (c, i) {
            var b = doc.createElement("button");
            b.type = "button";
            b.className = "bs-sw";
            b.id = "bs-sw-" + c.n;
            b.setAttribute("aria-pressed", "false");
            b.style.setProperty("--sw", c.hex);
            var sh = mixHex(c.hex, "#1f2247", 0.3);
            var hl = mixHex(c.hex, "#ffffff", 0.55);
            b.innerHTML =
              '<span class="bs-jar" id="bs-jar-' +
              c.n +
              '" aria-hidden="true"><span class="bs-paint" id="bs-paint-' +
              c.n +
              '"></span></span>' +
              '<span class="bs-code" id="bs-code-' +
              c.n +
              '">A-0' +
              c.n +
              "</span>" +
              '<span class="bs-name" id="bs-name-' +
              c.n +
              '"></span>' +
              '<span class="bs-chips" id="bs-chips-' +
              c.n +
              '" aria-hidden="true"><i id="bs-hl-' +
              c.n +
              '" style="background:' +
              hl +
              '"></i><i id="bs-base-' +
              c.n +
              '" style="background:' +
              c.hex +
              '"></i><i id="bs-sh-' +
              c.n +
              '" style="background:' +
              sh +
              '"></i><span class="bs-hex" id="bs-hex-' +
              c.n +
              '">' +
              c.hex.toUpperCase() +
              "</span></span>";
            b.querySelector(".bs-name").textContent = c.name;
            b.addEventListener("click", function () {
              apply(i, true);
            });
            wrap.appendChild(b);
            btns.push(b);
          });
          function apply(i, fx) {
            var main = sw[i].hex;
            var sec2 = sw[(i + 1) % sw.length].hex;
            var acc =
              sw.length > 2
                ? sw[(i + 2) % sw.length].hex
                : mixHex(main, "#ffffff", 0.55);
            if (sw.length === 1) {
              sec2 = mixHex(main, "#ffffff", 0.4);
            }
            sheet.style.setProperty("--c1", main);
            sheet.style.setProperty("--c1s", mixHex(main, "#1f2247", 0.3));
            sheet.style.setProperty("--c2", sec2);
            sheet.style.setProperty("--c2s", mixHex(sec2, "#1f2247", 0.3));
            sheet.style.setProperty("--c3", acc);
            btns.forEach(function (b, j) {
              b.classList.toggle("is-on", j === i);
              b.setAttribute("aria-pressed", j === i ? "true" : "false");
            });
            if (fx) {
              SFX.pop();
              svg.classList.remove("is-paint");
              void svg.getBoundingClientRect();
              svg.classList.add("is-paint");
              figs.classList.add("is-sfx");
              clearTimeout(apply.t);
              apply.t = setTimeout(function () {
                figs.classList.remove("is-sfx");
              }, 900);
            }
          }
          apply(0, false);
        }
        function ytEmbed(url) {
          var m =
            /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i.exec(
              url || "",
            );
          return m
            ? "https://www.youtube.com/embed/" +
                m[1] +
                "?rel=0&modestbranding=1"
            : "";
        }
        function setupVideo() {
          var sec = byId("sec-video");
          if (!sec) {
            return;
          }
          var v = byId("pv-video");
          var hasV = !!(v && isUrl(v.getAttribute("src")));
          var ifr = byId("pv-live-if");
          var live = ifr ? (ifr.getAttribute("data-src") || "").trim() : "";
          if (/\{\{/.test(live)) {
            live = "";
          }
          if (!hasV && !live) {
            hideSection(sec);
            return;
          }
          if (!txt("pv-cap")) {
            byId("pv-cap").hidden = true;
          }
          if (!hasV) {
            byId("pv-frame").hidden = true;
            sec.setAttribute("data-title", "Siaran Langsung");
            byId("pv-title").textContent = "Siaran Langsung";
            var nl = byId("nav-video-l");
            if (nl) {
              nl.textContent = "Siaran";
            }
          } else {
            var hp = byId("hero-photo");
            if (imgOk(hp)) {
              v.setAttribute("poster", hp.getAttribute("src"));
            }
            var bgmWas = false;
            byId("pv-play").addEventListener("click", function () {
              SFX.select();
              try {
                var p = v.play();
                if (p && p.catch) {
                  p.catch(function () {});
                }
              } catch (e) {}
            });
            v.addEventListener("play", function () {
              sec.classList.add("is-playing");
              bgmWas = bgmHas && !bgm.paused;
              pauseBgm();
            });
            var resume = function () {
              if (bgmWas) {
                playBgm();
                bgmWas = false;
              }
            };
            v.addEventListener("pause", resume);
            v.addEventListener("ended", function () {
              sec.classList.remove("is-playing");
              resume();
            });
            onVis("sec-video", function (on) {
              if (!on && !v.paused) {
                v.pause();
              }
            });
          }
          if (!live) {
            byId("pv-live").hidden = true;
          } else {
            var em = ytEmbed(live);
            if (em) {
              onSeen("sec-video", function () {
                ifr.src = em;
              });
            } else {
              byId("pv-live-frame").hidden = true;
            }
            byId("pv-live-a").href = live;
          }
        }
        function setupGaleri() {
          var sec = byId("sec-galeri");
          if (!sec) {
            return;
          }
          if (!GAL.length) {
            hideSection(sec);
            return;
          }
          var grid = byId("gl-grid");
          var gv = byId("gv");
          var gvImg = byId("gv-img");
          var gvCap = byId("gv-cap");
          var gvCount = byId("gv-count");
          var n = GAL.length;
          GAL.forEach(function (url, i) {
            var b = doc.createElement("button");
            b.type = "button";
            b.className = "gl-cel rv rv-pop rv-hover";
            b.id = "gl-cel-" + (i + 1);
            b.setAttribute(
              "aria-label",
              window.AnginPlatform.copy.photo + " " + (i + 1) + " / " + n,
            );
            b.style.setProperty("--r", rand(-3.2, 3.2).toFixed(1) + "deg");
            b.style.setProperty("--d", ((i % 4) * 0.09).toFixed(2) + "s");
            var pic = doc.createElement("span");
            pic.className = "gl-pic";
            pic.id = b.id + "-pic";
            var img = doc.createElement("img");
            img.id = b.id + "-img";
            img.src = url;
            img.alt = window.AnginPlatform.copy.photo + " " + (i + 1);
            img.loading = "lazy";
            img.decoding = "async";
            pic.appendChild(img);
            var no = doc.createElement("span");
            no.className = "gl-no";
            no.id = b.id + "-no";
            no.textContent = "C-" + pad(i + 1);
            var tc = doc.createElement("span");
            tc.className = "gl-tc";
            tc.id = b.id + "-tc";
            tc.textContent =
              window.AnginPlatform.copy.episode + " " +
              pad(Math.floor((i * 97 + 31) / 60) % 24) +
              ":" +
              pad((i * 97 + 31) % 60);
            b.appendChild(pic);
            b.appendChild(no);
            b.appendChild(tc);
            b.addEventListener("click", function () {
              openViewer(i);
            });
            grid.appendChild(b);
            observeReveal(b);
          });
          var filt = "asli";
          $$(".gl-f").forEach(function (f) {
            f.addEventListener("click", function () {
              var k = f.getAttribute("data-f");
              if (k === filt) {
                return;
              }
              filt = k;
              $$(".gl-f").forEach(function (o) {
                var on = o === f;
                o.classList.toggle("is-on", on);
                o.setAttribute("aria-checked", on ? "true" : "false");
              });
              grid.classList.remove("f-anime", "f-manga");
              gv.classList.remove("f-anime", "f-manga");
              if (k !== "asli") {
                grid.classList.add("f-" + k);
                gv.classList.add("f-" + k);
              }
              grid.classList.remove("is-flash");
              void grid.offsetWidth;
              grid.classList.add("is-flash");
              SFX.kira();
            });
          });
          var cur = 0;
          var lastFocus = null;
          gv.classList.toggle("is-single", n <= 1);
          function show(i, dir) {
            cur = (i + n) % n;
            var put = function () {
              gvImg.src = GAL[cur];
              gvImg.alt = window.AnginPlatform.galleryItems[cur].alt || window.AnginPlatform.copy.photo + " " + (cur + 1) + " / " + n;
              gvCap.textContent =
                window.AnginPlatform.galleryItems[cur].caption || window.AnginPlatform.copy.photo + " " + (cur + 1);
              gvCount.textContent = cur + 1 + " / " + n;
              gvImg.classList.remove("is-swap");
            };
            if (dir && !reduce) {
              gvImg.style.setProperty("--sx", dir > 0 ? "-24px" : "24px");
              gvImg.classList.add("is-swap");
              setTimeout(function () {
                gvImg.style.setProperty("--sx", dir > 0 ? "24px" : "-24px");
                put();
              }, 180);
            } else {
              put();
            }
          }
          function onKey(e) {
            if (e.key === "Escape") {
              closeViewer();
            } else if (e.key === "ArrowRight") {
              show(cur + 1, 1);
            } else if (e.key === "ArrowLeft") {
              show(cur - 1, -1);
            }
          }
          function openViewer(i) {
            lastFocus = doc.activeElement;
            show(i, 0);
            gv.classList.add("is-open");
            gv.setAttribute("aria-hidden", "false");
            body.classList.add("is-locked");
            doc.addEventListener("keydown", onKey);
            SFX.pop();
            setTimeout(function () {
              byId("gv-close").focus({ preventScroll: true });
            }, 60);
          }
          function closeViewer() {
            gv.classList.remove("is-open");
            gv.setAttribute("aria-hidden", "true");
            body.classList.remove("is-locked");
            doc.removeEventListener("keydown", onKey);
            if (lastFocus && lastFocus.focus) {
              try {
                lastFocus.focus({ preventScroll: true });
              } catch (e) {}
            }
          }
          byId("gv-close").addEventListener("click", closeViewer);
          byId("gv-bg").addEventListener("click", closeViewer);
          byId("gv-prev").addEventListener("click", function () {
            SFX.blip();
            show(cur - 1, -1);
          });
          byId("gv-next").addEventListener("click", function () {
            SFX.blip(true);
            show(cur + 1, 1);
          });
          var sx = null;
          var fig = byId("gv-fig");
          fig.addEventListener(
            "pointerdown",
            function (e) {
              sx = e.clientX;
            },
            { passive: true },
          );
          fig.addEventListener(
            "pointerup",
            function (e) {
              if (sx === null) {
                return;
              }
              var dx = e.clientX - sx;
              sx = null;
              if (Math.abs(dx) > 50 && n > 1) {
                show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
              }
            },
            { passive: true },
          );
        }
        function typeInto(el, text, speed, done) {
          if (!el) {
            return;
          }
          clearInterval(el.__ti);
          if (reduce) {
            el.textContent = text;
            if (done) {
              done();
            }
            return;
          }
          var chars = Array.from ? Array.from(text) : text.split("");
          var k = 0;
          el.textContent = "";
          el.__ti = setInterval(function () {
            k += 1;
            el.textContent = chars.slice(0, k).join("");
            if (k >= chars.length) {
              clearInterval(el.__ti);
              if (done) {
                done();
              }
            }
          }, speed || 34);
        }
        function watchClass(el, fn) {
          if (!el || !("MutationObserver" in window)) {
            return;
          }
          var mo = new MutationObserver(function () {
            fn(el.className);
          });
          mo.observe(el, { attributes: true, attributeFilter: ["class"] });
        }
        function setupRsvp() {
          var sec = byId("sec-rsvp");
          if (!sec) {
            return;
          }
          var box = byId("vn-box");
          var form = byId("rsvp-form");
          var say = byId("vn-say-t");
          var sprite = byId("vn-sprite-img");
          byId("vn-sprite-ini").textContent =
            initialOf(BRIDE) + "&" + initialOf(GROOM);
          if (!imgOk(sprite)) {
            box.classList.add("no-photo");
          } else {
            sprite.addEventListener("error", function () {
              box.classList.add("no-photo");
            });
          }
          if (!txt("vn-deadline")) {
            byId("vn-deadline").hidden = true;
          }
          var opening =
            txt("vn-say-src") || "Kamu akan datang ke hari spesial kami, kan?";
          say.textContent = opening;
          var hearts = $$(".vn-h");
          function setHearts(n) {
            hearts.forEach(function (h, i) {
              h.classList.toggle("is-on", i < n);
            });
          }
          setHearts(guestName ? 3 : 2);
          onSeen("sec-rsvp", function () {
            typeInto(say, opening, 38);
          });
          var LINES = {
            attending: [
              window.AnginPlatform.copy.yes,
              window.AnginPlatform.copy.thanks,
            ],
            not_attending: [
              window.AnginPlatform.copy.no,
              window.AnginPlatform.copy.thanks,
            ],
            maybe: [window.AnginPlatform.copy.maybe, window.AnginPlatform.copy.thanks],
          };
          var HEARTS = { attending: 5, not_attending: 3, maybe: 4 };
          $$("[data-wedivo-status]", form).forEach(function (b) {
            b.addEventListener("click", function () {
              var st = b.getAttribute("data-wedivo-status");
              box.classList.remove("r-yes", "r-no", "is-pop");
              void box.offsetWidth;
              box.classList.add(
                st === "attending"
                  ? "r-yes"
                  : st === "not_attending"
                    ? "r-no"
                    : "r-maybe",
              );
              typeInto(say, (LINES[st] || LINES.maybe).join(" "), 30);
              setHearts(HEARTS[st] || 3);
              if (st !== "not_attending") {
                box.classList.add("is-pop");
                SFX.kira();
              } else {
                SFX.blip();
              }
            });
          });
          var pax = byId("rsvp-pax");
          var stepPax = function (d) {
            var v = parseInt(pax.value, 10) || 1;
            v = clamp(v + d, 1, 20);
            pax.value = String(v);
            try {
              pax.dispatchEvent(new Event("input", { bubbles: true }));
              pax.dispatchEvent(new Event("change", { bubbles: true }));
            } catch (e) {}
            SFX.blip(d > 0);
          };
          byId("vn-pax-minus").addEventListener("click", function () {
            stepPax(-1);
          });
          byId("vn-pax-plus").addEventListener("click", function () {
            stepPax(1);
          });
          var STN = {
            attending: "Hadir ♡",
            not_attending: "Berhalangan hadir",
            maybe: "Masih ragu",
          };
          watchClass(form, function (cls) {
            if (/\bis-submitted\b/.test(cls) && !form.__done) {
              form.__done = true;
              var sel = $("[data-wedivo-status].is-selected", form);
              var st = sel ? sel.getAttribute("data-wedivo-status") : "";
              byId("vn-cg-name").textContent = (
                byId("rsvp-name").value ||
                guestName ||
                window.AnginPlatform.copy.guest
              ).trim();
              byId("vn-cg-st").textContent = STN[st] || "";
              setHearts(5);
              box.classList.remove("is-pop");
              void box.offsetWidth;
              box.classList.add("is-pop", "r-yes");
              typeInto(
                say,
                "Terima kasih! Jawabanmu sudah tercatat di naskah kami ♡",
                30,
              );
              SFX.fanfare();
              vibrate(30);
            }
            if (/\bis-error\b/.test(cls)) {
              SFX.blip();
              typeInto(say, "Eh? Sepertinya ada yang belum lengkap…", 30);
            }
          });
        }
        function setupUcapan() {
          var sec = byId("sec-ucapan");
          if (!sec) {
            return;
          }
          if (!txt("dm-lead")) {
            byId("dm-lead").hidden = true;
          }
          var screen = byId("dm-screen");
          var lanesEl = byId("dm-lanes");
          var list = byId("wish-list");
          var form = byId("wish-form");
          var countEl = byId("wish-count");
          var COLORS = [
            "#ffffff",
            "#ffffff",
            "#ffd6e2",
            "#bfe3ff",
            "#fff3a6",
            "#c8f5d2",
            "#e3d6ff",
          ];
          var CARD_COLORS = [
            "#e5467a",
            "#3e92e6",
            "#f5a623",
            "#3fae6a",
            "#8c5bff",
            "#e6663a",
          ];
          var CHEERS = [window.AnginPlatform.copy.thanks];
          var pool = [];
          var poolI = 0;
          var cardN = 0;
          var enabled = true;
          var visible = false;
          var loopT = 0;
          var lastSubmit = 0;
          function harvest() {
            var fresh = [];
            $$(".comment-card", list).forEach(function (card) {
              if (card.__dm) {
                return;
              }
              card.__dm = true;
              cardN += 1;
              if (!card.id) {
                card.id = "wish-card-" + cardN;
              }
              $$("[data-field]", card).forEach(function (f, j) {
                if (!f.id) {
                  f.id = card.id + "-f" + j;
                }
              });
              card.style.setProperty(
                "--wc",
                CARD_COLORS[cardN % CARD_COLORS.length],
              );
              var name = txt($(".comment-name", card));
              var msg = txt($(".comment-message", card));
              if (msg) {
                var entry = { name: name, msg: msg };
                pool.push(entry);
                fresh.push(entry);
              }
            });
            var n = $$(".comment-card", list).length;
            countEl.textContent = n ? "(" + n + ")" : "";
            if (
              fresh.length &&
              Date.now() - lastSubmit < 15000 &&
              visible &&
              enabled
            ) {
              spawn(fresh[0], true);
              lastSubmit = 0;
            }
          }
          if ("MutationObserver" in window) {
            new MutationObserver(harvest).observe(list, {
              childList: true,
              subtree: true,
            });
          }
          harvest();
          watchClass(form, function (cls) {
            if (/\bis-submitted\b/.test(cls)) {
              lastSubmit = Date.now();
              SFX.kira();
            }
          });
          var laneFree = [];
          function laneCount() {
            return Math.max(3, Math.floor(lanesEl.clientHeight / 30));
          }
          function spawn(entry, mine) {
            if (!enabled || reduce) {
              return;
            }
            var w = screen.clientWidth;
            var L = laneCount();
            var t = now();
            var best = 0;
            for (var i = 0; i < L; i++) {
              if ((laneFree[i] || 0) < (laneFree[best] || 0)) {
                best = i;
              }
            }
            var el = doc.createElement("p");
            el.className = "dm-c" + (mine ? " is-mine" : "");
            el.id = uid("dm-c");
            var msg =
              entry.msg.length > 70 ? entry.msg.slice(0, 68) + "…" : entry.msg;
            if (entry.name) {
              var b = doc.createElement("b");
              b.id = el.id + "-n";
              b.textContent = entry.name + ":";
              el.appendChild(b);
            }
            var s = doc.createElement("span");
            s.id = el.id + "-m";
            s.textContent = msg;
            el.appendChild(s);
            var fs = mine ? 17 : Math.round(rand(13, 17));
            el.style.setProperty("--fs", fs + "px");
            el.style.setProperty("--c", mine ? "#fff" : pick(COLORS));
            el.style.setProperty(
              "--y",
              (best * (lanesEl.clientHeight / L)).toFixed(0) + "px",
            );
            el.style.setProperty("--w", w + "px");
            lanesEl.appendChild(el);
            var tw = el.offsetWidth;
            var speed = rand(80, 125);
            var dur = (w + tw) / speed;
            el.style.setProperty("--dur", dur.toFixed(2) + "s");
            laneFree[best] = t + ((tw + 40) / speed) * 1000;
            el.addEventListener("animationend", function () {
              el.remove();
            });
          }
          function loop() {
            clearTimeout(loopT);
            if (!visible || !enabled || reduce) {
              return;
            }
            var entry;
            if (pool.length) {
              entry = pool[poolI % pool.length];
              poolI += 1;
              if (poolI % 4 === 0) {
                entry = { name: "", msg: pick(CHEERS) };
              }
            } else {
              entry = { name: "", msg: pick(CHEERS) };
            }
            spawn(entry, false);
            loopT = setTimeout(loop, rand(1100, 1900));
          }
          onVis("sec-ucapan", function (on) {
            visible = on;
            screen.classList.toggle("is-paused", !on);
            if (on) {
              loop();
            } else {
              clearTimeout(loopT);
            }
          });
          var tg = byId("dm-toggle");
          tg.addEventListener("click", function () {
            enabled = !enabled;
            tg.setAttribute("aria-pressed", enabled ? "true" : "false");
            byId("dm-toggle-t").textContent =
              window.AnginPlatform.copy.commentToggle + ": " + (enabled ? window.AnginPlatform.copy.on : window.AnginPlatform.copy.off);
            if (!enabled) {
              lanesEl.innerHTML = "";
            } else {
              loop();
            }
            SFX.blip(enabled);
          });
          byId("dm-clap").addEventListener("click", function () {
            if (!enabled) {
              return;
            }
            for (var i = 0; i < 6; i++) {
              (function (k) {
                setTimeout(function () {
                  spawn(
                    { name: "", msg: k % 2 ? "パチパチ👏" : "8888888" },
                    false,
                  );
                }, k * 140);
              })(i);
            }
            if (sfxOn && ac()) {
              for (var j = 0; j < 8; j++) {
                noiseHit(
                  AC.currentTime + j * 0.07 + Math.random() * 0.03,
                  0.06,
                  "bandpass",
                  1800 + Math.random() * 800,
                  1.2,
                  0.2,
                );
              }
            }
          });
          var hb = byId("dm-heart");
          var hn = byId("dm-heart-n");
          var hc = parseInt(store.get("awm-hearts") || "0", 10) || 0;
          hn.textContent = String(hc);
          hb.addEventListener("click", function () {
            hc += 1;
            hn.textContent = String(hc);
            store.set("awm-hearts", String(hc));
            hb.classList.remove("is-pop");
            void hb.offsetWidth;
            hb.classList.add("is-pop");
            SFX.pop();
            if (!reduce) {
              var f = doc.createElementNS(SVGNS, "svg");
              f.setAttribute("viewBox", "0 0 24 24");
              f.setAttribute("class", "dm-float");
              f.setAttribute("id", uid("dm-f"));
              var u = doc.createElementNS(SVGNS, "use");
              u.setAttribute("href", "#sym-heart");
              u.setAttribute("id", f.id + "-u");
              f.appendChild(u);
              f.style.setProperty("--hx", rand(-60, 10).toFixed(0) + "px");
              f.style.color = pick([
                "#e0263f",
                "#ff6f96",
                "#ff9dbb",
                "#ffd84a",
              ]);
              screen.appendChild(f);
              setTimeout(function () {
                f.remove();
              }, 1700);
            }
          });
          var vEl = byId("dm-viewers-n");
          var viewers = 1204;
          var CAPS = [window.AnginPlatform.copy.thanks];
          var capI = 0;
          var capEl = byId("dm-caption-t");
          setInterval(function () {
            if (!visible) {
              return;
            }
            viewers = clamp(viewers + Math.round(rand(-18, 26)), 980, 1890);
            try {
              vEl.textContent = viewers.toLocaleString(window.AnginPlatform.intlLocale);
            } catch (e) {
              vEl.textContent = String(viewers);
            }
            capI += 1;
            if (capI % 2 === 0) {
              capEl.textContent = CAPS[(capI / 2) % CAPS.length];
            }
          }, 3200);
        }
        function setupKado() {
          var sec = byId("sec-kado");
          if (!sec) {
            return;
          }
          if (!txt("gf-lead")) {
            byId("gf-lead").hidden = true;
          }
          var form = byId("gift-form");
          var amt = byId("gift-amount");
          var view = byId("gf-amount-view");
          amt.addEventListener("input", function () {
            var v = parseInt(String(amt.value).replace(/\D/g, ""), 10);
            if (!v) {
              view.textContent = "";
              return;
            }
            try {
              view.textContent = "Rp " + v.toLocaleString(window.AnginPlatform.intlLocale);
            } catch (e) {
              view.textContent = "Rp " + v;
            }
          });
          function tie() {
            sec.classList.remove("is-tying");
            void sec.offsetWidth;
            sec.classList.add("is-tying");
            SFX.paper();
            setTimeout(function () {
              SFX.kira();
            }, 900);
          }
          watchClass(form, function (cls) {
            if (/\bis-submitted\b/.test(cls) && !form.__done) {
              form.__done = true;
              tie();
              setTimeout(function () {
                sec.classList.add("is-given");
                SFX.stamp();
                vibrate(24);
              }, 1500);
            }
          });
          var env = byId("gf-env");
          env.style.cursor = "pointer";
          env.addEventListener("click", tie);
          onSeen("sec-kado", function () {
            setTimeout(tie, 400);
          });
        }
        function confettiOn(cv) {
          if (!cv || !cv.getContext || reduce) {
            return;
          }
          var ctx = cv.getContext("2d");
          var r = cv.getBoundingClientRect();
          var dpr = Math.min(window.devicePixelRatio || 1, 2);
          cv.width = Math.round(r.width * dpr);
          cv.height = Math.round(r.height * dpr);
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          var s2 = byId("s2");
          var sr = s2 ? s2.getBoundingClientRect() : r;
          var ox = sr.left - r.left + sr.width / 2;
          var oy = sr.top - r.top + 40;
          var COL = [
            "#ff9dbb",
            "#ffd84a",
            "#8fd1ff",
            "#b58cff",
            "#ffffff",
            "#7ddb9a",
            "#e0263f",
          ];
          var P = [];
          for (var i = 0; i < 170; i++) {
            var a = rand(-Math.PI, 0);
            var sp = rand(4, 13);
            P.push({
              x: ox + rand(-30, 30),
              y: oy,
              vx: Math.cos(a) * sp * 0.9,
              vy: Math.sin(a) * sp - rand(1, 4),
              w: rand(6, 11),
              h: rand(3, 7),
              rot: rand(0, 6.3),
              vr: rand(-0.3, 0.3),
              col: pick(COL),
              ph: rand(0, 6.3),
              petal: Math.random() < 0.3,
            });
          }
          var t0 = now();
          (function step(t) {
            var u = (t - t0) / 4200;
            ctx.clearRect(0, 0, r.width, r.height);
            if (u >= 1) {
              return;
            }
            P.forEach(function (p) {
              p.vy += 0.16;
              p.vx *= 0.985;
              p.vy *= 0.985;
              p.x += p.vx + Math.sin(p.ph + t * 0.004) * 0.6;
              p.y += p.vy;
              p.rot += p.vr;
              ctx.save();
              ctx.translate(p.x, p.y);
              ctx.rotate(p.rot);
              ctx.scale(1, Math.abs(Math.cos(p.ph + t * 0.01)));
              ctx.globalAlpha = Math.min(1, (1 - u) * 1.6);
              if (p.petal && SPR.petal) {
                var sp2 = SPR.petal[0];
                ctx.drawImage(sp2.c, -8, -9, 16, 18);
              } else {
                ctx.fillStyle = p.col;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
              }
              ctx.restore();
            });
            requestAnimationFrame(step);
          })(t0);
        }
        function setupPenutup() {
          var sec = byId("sec-penutup");
          if (!sec) {
            return;
          }
          var ph = byId("ed-photo");
          if (!imgOk(ph)) {
            sec.classList.add("no-photo");
          } else {
            ph.addEventListener("error", function () {
              sec.classList.add("no-photo");
            });
          }
          fillPetals(byId("ed-petals"), 18, [
            "petal",
            "petal",
            "blossom",
            "kira",
          ]);
          var tm = linesOf("cr-5-src");
          var tmDd = byId("cr-5-d");
          if (tm.length) {
            tmDd.innerHTML = "";
            tm.forEach(function (l, i) {
              var s = doc.createElement("span");
              s.className = "cr-l";
              s.id = "cr-5-l" + i;
              s.textContent = l;
              tmDd.appendChild(s);
            });
          }
          $$(".cr", byId("ed-cr")).forEach(function (row) {
            var dd = $("dd", row);
            var t = txt(dd)
              .replace(/[「」]/g, "")
              .trim();
            if (!t) {
              row.hidden = true;
            }
            $$(".cr-l", row).forEach(function (l) {
              if (!txt(l)) {
                l.hidden = true;
              }
            });
          });
          if (!txt("ed-song-t").replace(/[「」]/g, "")) {
            byId("ed-song").hidden = true;
          }
          ["omake-t", "s2-tag", "ed-msg-t", "ed-salam"].forEach(function (id) {
            if (!txt(id)) {
              (id === "omake-t" ? byId("omake") : byId(id)).hidden = true;
            }
          });
          if (!txt("ed-hash-t")) {
            byId("ed-hash").hidden = true;
          }
          var sd = byId("s2-date-t");
          if (parseYMD(W_DATE)) {
            sd.textContent = fmtDate(W_DATE);
          } else {
            byId("s2-date").hidden = true;
          }
          var view = byId("ed-roll-view");
          var roll = byId("ed-roll");
          var btn = byId("ed-roll-btn");
          var btnT = byId("ed-roll-btn-t");
          if (reduce) {
            view.classList.add("is-static");
            btn.hidden = true;
          } else {
            onVis("sec-penutup", function (on) {
              if (on) {
                var h = roll.scrollHeight + 300;
                roll.style.setProperty(
                  "--rollDur",
                  Math.max(14, h / 26).toFixed(1) + "s",
                );
                view.classList.add("is-rolling");
              }
            });
            var toggle = function () {
              var p = !view.classList.contains("is-paused");
              view.classList.toggle("is-paused", p);
              btn.classList.toggle("is-paused", p);
              btnT.textContent = p ? window.AnginPlatform.copy.resumeCredits : window.AnginPlatform.copy.stopCredits;
            };
            btn.addEventListener("click", toggle);
            view.addEventListener("click", toggle);
          }
          var cv = byId("ed-confetti");
          var s2 = byId("s2");
          var fired = false;
          if ("IntersectionObserver" in window && s2) {
            var io = new IntersectionObserver(
              function (en) {
                if (en[0].isIntersecting && !fired) {
                  fired = true;
                  setTimeout(function () {
                    confettiOn(cv);
                    SFX.fanfare();
                  }, 450);
                  io.disconnect();
                }
              },
              { threshold: 0.45 },
            );
            io.observe(s2);
          }
          byId("s2-btn").addEventListener("click", function () {
            confettiOn(cv);
            SFX.fanfare();
            vibrate(30);
          });
          byId("ed-hash").addEventListener("click", function () {
            copyText(
              txt("ed-hash-t"),
              "Tagar tersalin — sampai jumpa di linimasa ♡",
            );
          });
          byId("ed-replay").addEventListener("click", function () {
            SFX.select();
            opDone = false;
            if (heroEl) {
              heroEl.classList.remove("is-op", "is-op-done");
              var ly = byId("op-lyric");
              if (ly) {
                ly.classList.remove("is-sing");
              }
              $$(".op-cr").forEach(function (c) {
                c.classList.remove("is-show", "is-gone");
              });
            }
            goTo("hero", true);
            setTimeout(startOP, 1500);
          });
        }
        [
          setupHero,
          setupProlog,
          setupChars,
          setupRel,
          setupKisah,
          setupPengakuan,
          typeof setupHitung === "function" ? setupHitung : null,
          typeof setupAcara === "function" ? setupAcara : null,
          typeof setupRundown === "function" ? setupRundown : null,
          typeof setupLokasi === "function" ? setupLokasi : null,
          typeof setupBusana === "function" ? setupBusana : null,
          typeof setupVideo === "function" ? setupVideo : null,
          typeof setupGaleri === "function" ? setupGaleri : null,
          typeof setupRsvp === "function" ? setupRsvp : null,
          typeof setupUcapan === "function" ? setupUcapan : null,
          typeof setupKado === "function" ? setupKado : null,
          typeof setupPenutup === "function" ? setupPenutup : null,
        ].forEach(function (fn) {
          if (!fn) {
            return;
          }
          try {
            fn();
          } catch (e) {
            if (window.console && console.error) {
              console.error(e);
            }
          }
        });
        numberScenes();
        setupNav();
        setupReveal();
        setupWind();
        setupCover();
        window.AnginPlatform.afterSource();
      })();
    