
      (function () {
        "use strict";
        var doc = document;
        var body = doc.body;
        var reduceMotion = !!(window.TAMAN.reducedMotion || 
          window.matchMedia &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
        var SVGNS = "http://www.w3.org/2000/svg";
        function byId(id) {
          return doc.getElementById(id);
        }
        function all(sel, scope) {
          return Array.prototype.slice.call(
            (scope || doc).querySelectorAll(sel),
          );
        }
        function clean(v) {
          v = v == null ? "" : String(v).trim();
          return /^\{\{[^}]*\}\}$/.test(v) ? "" : v;
        }
        function txt(el) {
          return el ? clean(el.textContent) : "";
        }
        function isHidden(el) {
          return !el || window.getComputedStyle(el).display === "none";
        }
        function clamp(v, a, b) {
          return Math.min(b, Math.max(a, v));
        }
        function ease(a, b, x) {
          var t = clamp((x - a) / (b - a), 0, 1);
          return t * t * (3 - 2 * t);
        }
        function pad(n) {
          return (n < 10 ? "0" : "") + n;
        }
        function sectionEl(id) {
          return doc.querySelector('[data-section="' + id + '"]');
        }
        function navItemFor(id) {
          return doc.querySelector('[data-nav-target="' + id + '"]');
        }
        function hideSection(id) {
          var s = sectionEl(id);
          var n = navItemFor(id);
          if (s) {
            s.style.display = "none";
          }
          if (n) {
            n.style.display = "none";
          }
        }
        function svgUse(symbol, size) {
          var svg = doc.createElementNS(SVGNS, "svg");
          svg.setAttribute("viewBox", "0 0 " + size + " " + size);
          svg.setAttribute("aria-hidden", "true");
          var use = doc.createElementNS(SVGNS, "use");
          use.setAttribute("href", "#" + symbol);
          use.setAttribute("width", String(size));
          use.setAttribute("height", String(size));
          svg.appendChild(use);
          return svg;
        }
        /* ---------------------------------------------------------------- the garden grows its own ornaments (seeded, identical every visit) */
        var ORN = (function () {
          function rng(seed) {
            var s = seed >>> 0;
            return function () {
              s = (s + 0x6d2b79f5) >>> 0;
              var t = s;
              t = Math.imul(t ^ (t >>> 15), t | 1);
              t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
              return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            };
          }
          function f(n) {
            return String(Math.round(n * 10) / 10);
          }
          function f2(n) {
            return String(Math.round(n * 100) / 100);
          }
          function pick(list, r) {
            return list[Math.floor(r() * list.length)];
          }
          function bez(p0, p1, p2, p3, t) {
            var u = 1 - t;
            return {
              x:
                u * u * u * p0[0] +
                3 * u * u * t * p1[0] +
                3 * u * t * t * p2[0] +
                t * t * t * p3[0],
              y:
                u * u * u * p0[1] +
                3 * u * u * t * p1[1] +
                3 * u * t * t * p2[1] +
                t * t * t * p3[1],
              a:
                (Math.atan2(
                  3 * u * u * (p1[1] - p0[1]) +
                    6 * u * t * (p2[1] - p1[1]) +
                    3 * t * t * (p3[1] - p2[1]),
                  3 * u * u * (p1[0] - p0[0]) +
                    6 * u * t * (p2[0] - p1[0]) +
                    3 * t * t * (p3[0] - p2[0]),
                ) *
                  180) /
                Math.PI,
            };
          }
          function bezPath(segs) {
            var d = "M" + f(segs[0][0][0]) + " " + f(segs[0][0][1]);
            segs.forEach(function (s) {
              d +=
                " C" +
                f(s[1][0]) +
                " " +
                f(s[1][1]) +
                " " +
                f(s[2][0]) +
                " " +
                f(s[2][1]) +
                " " +
                f(s[3][0]) +
                " " +
                f(s[3][1]);
            });
            return d;
          }
          function useAt(sym, x, y, rot, sc, w, h, bx, by, cls, style) {
            return (
              '<g transform="translate(' +
              f(x) +
              " " +
              f(y) +
              ") rotate(" +
              f(rot) +
              ") scale(" +
              f2(sc) +
              ')"><use href="#' +
              sym +
              '" x="' +
              bx +
              '" y="' +
              by +
              '" width="' +
              w +
              '" height="' +
              h +
              '"' +
              (cls ? ' class="' + cls + '"' : "") +
              (style ? ' style="' + style + '"' : "") +
              "/></g>"
            );
          }
          var GREENS = ["#2f5a3a", "#3f6e45", "#4f7f4f", "#2a4d33", "#5b8a55"];
          function ivyAlong(segs, r, o) {
            var out = "";
            var k = 0;
            segs.forEach(function (seg, si) {
              for (var t = 0.04; t < 1; t += o.step * (0.75 + r() * 0.5)) {
                var p = bez(seg[0], seg[1], seg[2], seg[3], t);
                if (
                  o.avoid &&
                  p.x > o.avoid[0] &&
                  p.x < o.avoid[1] &&
                  p.y < o.avoid[2]
                ) {
                  continue;
                }
                var alt = k % 2 === 0 ? 1 : -1;
                var along =
                  o.taper === false
                    ? 1
                    : 1 - ((si + t) / (segs.length + 0.4)) * 0.35;
                var sc = (o.sMin + r() * (o.sMax - o.sMin)) * along;
                var dir = p.a + alt * (62 + (r() * 30 - 15));
                var animate = o.every && k % o.every === 0;
                out += useAt(
                  "sym-ivy",
                  p.x,
                  p.y,
                  dir + 90,
                  sc,
                  40,
                  40,
                  -20,
                  -38,
                  animate ? o.cls || "sway-leaf" : "",
                  (animate ? "animation-delay:-" + f2(r() * 5) + "s;" : "") +
                    "color:" +
                    pick(GREENS, r),
                );
                k++;
              }
            });
            return out;
          }
          function stem(segs, w) {
            return (
              '<path d="' +
              bezPath(segs) +
              '" fill="none" stroke="#3b3524" stroke-width="' +
              w +
              '" stroke-linecap="round" opacity=".85"/>'
            );
          }
          function leafy(sym, x, y, rot, sc, color, cls, r) {
            return useAt(
              sym,
              x,
              y,
              rot,
              sc,
              20,
              40,
              -10,
              -39,
              cls,
              (cls ? "animation-delay:-" + f2(r() * 4) + "s;" : "") +
                "color:" +
                color,
            );
          }
          function gateIvy() {
            var r = rng(11);
            var left = [
              [
                [53, 4],
                [40, 2],
                [20, 10],
                [9, 30],
              ],
              [
                [9, 30],
                [2, 44],
                [4, 62],
                [3, 80],
              ],
              [
                [3, 80],
                [2, 96],
                [6, 108],
                [3, 122],
              ],
            ];
            var right = [
              [
                [72, 5],
                [86, 2],
                [104, 12],
                [113, 32],
              ],
              [
                [113, 32],
                [120, 48],
                [117, 62],
                [119, 78],
              ],
              [
                [119, 78],
                [121, 90],
                [116, 98],
                [118, 106],
              ],
            ];
            var g = stem(left, 1.3) + stem(right, 1.3);
            g += ivyAlong(left, r, {
              step: 0.1,
              sMin: 0.22,
              sMax: 0.36,
              every: 3,
              avoid: [48, 76, 14],
            });
            g += ivyAlong(right, r, {
              step: 0.105,
              sMin: 0.22,
              sMax: 0.34,
              every: 3,
              avoid: [48, 78, 14],
            });
            [
              [40, 34, -1],
              [55, 58, -1],
              [68, 46, 1],
              [84, 28, 1],
            ].forEach(function (s) {
              var x0 = s[0];
              var len = s[1];
              var dir = s[2];
              var segs = [
                [
                  [x0, 6],
                  [x0 + dir * 2, 6 + len * 0.3],
                  [x0 - dir * 3, 6 + len * 0.7],
                  [x0 + dir, 6 + len],
                ],
              ];
              g +=
                '<g class="ivy-strand ' +
                (dir < 0 ? "strand-l" : "strand-r") +
                '">' +
                stem(segs, 0.8) +
                ivyAlong(segs, r, {
                  step: 0.16,
                  sMin: 0.13,
                  sMax: 0.19,
                  every: 1,
                  cls: "sway-leaf-fast",
                  taper: false,
                }) +
                "</g>";
            });
            [
              [30, 8, 0.2],
              [18, 17, 0.17],
              [92, 7, 0.19],
              [104, 18, 0.16],
              [46, 3, 0.18],
              [8, 50, 0.15],
              [114, 44, 0.15],
            ].forEach(function (p, i) {
              g += useAt(
                "sym-rose",
                p[0],
                p[1],
                0,
                p[2],
                40,
                40,
                -20,
                -20,
                "twinkle-soft",
                "animation-delay:-" + f2(i * 0.7) + "s",
              );
            });
            return g;
          }
          function racemeSymbol(len, seed) {
            var r = rng(seed);
            var n = Math.max(9, Math.round(len / 7));
            var g =
              '<path d="M0 0 Q2 ' +
              f(len * 0.5) +
              " 0 " +
              f(len) +
              '" stroke="#6b5a3a" stroke-width=".8" fill="none"/>';
            for (var i = 0; i < n; i++) {
              var t = i / (n - 1);
              var spread = (1 - t) * 8 + 1.5;
              for (var j = 0; j < (t < 0.5 ? 3 : 2); j++) {
                var rx = 2.2 + (1 - t) * 2.8 + r() * 0.9;
                var col =
                  t > 0.9
                    ? pick(["#8f9f7a", "#9aa77f"], r)
                    : t > 0.66
                      ? pick(["#8a73c0", "#7b66b2", "#9480c8"], r)
                      : t > 0.3
                        ? pick(["#b19ed9", "#a590d2", "#bcaae0"], r)
                        : pick(["#dcd1f0", "#cfc2ea", "#e6ddf5"], r);
                g +=
                  '<ellipse cx="' +
                  f((r() * 2 - 1) * spread) +
                  '" cy="' +
                  f(t * len) +
                  '" rx="' +
                  f(rx) +
                  '" ry="' +
                  f(rx * 0.7) +
                  '" fill="' +
                  col +
                  '" opacity="' +
                  f2(0.82 + r() * 0.18) +
                  '"/>';
              }
            }
            return g;
          }
          var RACEMES = [
            [1, 90],
            [2, 130],
            [3, 170],
          ];
          function wisteria(seed) {
            var r = rng(seed);
            var branch = [
              [
                [-10, 14],
                [60, 30],
                [140, 6],
                [230, 26],
              ],
              [
                [230, 26],
                [258, 32],
                [280, 22],
                [300, 30],
              ],
            ];
            var rac = "";
            for (var t = 0.06; t < 0.98; t += 0.1 + r() * 0.07) {
              var seg = t < 0.75 ? 0 : 1;
              var b = branch[seg];
              var p = bez(
                b[0],
                b[1],
                b[2],
                b[3],
                seg === 0 ? t / 0.75 : (t - 0.75) / 0.25,
              );
              var rc =
                RACEMES[
                  Math.min(
                    2,
                    Math.floor(r() * 3 * (1 - Math.abs(t - 0.35)) + 0.4),
                  )
                ];
              rac += useAt(
                "sym-raceme-" + rc[0],
                p.x,
                p.y + 2,
                0,
                0.8 + r() * 0.35,
                32,
                rc[1] + 8,
                -16,
                -2,
                "sway-raceme",
                "animation-delay:-" +
                  f2(r() * 6) +
                  "s;animation-duration:" +
                  f2(4.6 + r() * 3) +
                  "s",
              );
            }
            var g =
              rac +
              '<path d="' +
              bezPath(branch) +
              '" fill="none" stroke="#4a3c2a" stroke-width="4.2" stroke-linecap="round"/>' +
              '<path d="M40 22 C58 40 70 42 88 40 M150 14 C170 30 186 28 196 42" fill="none" stroke="#4a3c2a" stroke-width="2.2" stroke-linecap="round"/>';
            var k = 0;
            branch.forEach(function (bb) {
              for (var tt = 0.03; tt < 1; tt += 0.09 + r() * 0.05) {
                var q = bez(bb[0], bb[1], bb[2], bb[3], tt);
                var alt = r() > 0.5 ? 1 : -1;
                g += leafy(
                  "sym-leaf",
                  q.x,
                  q.y,
                  q.a + 90 + alt * (70 + r() * 30),
                  0.5 + r() * 0.45,
                  ["#4f7a48", "#6a9360", "#3c6340"][k % 3],
                  k % 2 === 0 ? "sway-leaf" : "",
                  r,
                );
                k++;
              }
            });
            [
              [20, 16, 0.55],
              [120, 14, 0.45],
              [210, 26, 0.5],
              [70, 30, 0.35],
            ].forEach(function (p) {
              g += useAt("sym-rose", p[0], p[1], 0, p[2], 40, 40, -20, -20);
            });
            return g;
          }
          function frond(len, curl) {
            var p0 = [0, 0];
            var p1 = [curl * 0.2, -len * 0.4];
            var p2 = [curl * 0.8, -len * 0.75];
            var p3 = [curl, -len];
            var d = "";
            for (var i = 1; i < 14; i++) {
              var p = bez(p0, p1, p2, p3, i / 14);
              var size = (1 - i / 14) * len * 0.3 + 3;
              [-1, 1].forEach(function (side) {
                var ang = ((p.a + side * 62) * Math.PI) / 180;
                var tx = p.x + Math.cos(ang) * size;
                var ty = p.y + Math.sin(ang) * size;
                var nx = Math.cos(ang + Math.PI / 2) * size * 0.16;
                var ny = Math.sin(ang + Math.PI / 2) * size * 0.16;
                d +=
                  "M" +
                  f(p.x) +
                  " " +
                  f(p.y) +
                  " Q" +
                  f((p.x + tx) / 2 + nx) +
                  " " +
                  f((p.y + ty) / 2 + ny) +
                  " " +
                  f(tx) +
                  " " +
                  f(ty) +
                  " Q" +
                  f((p.x + tx) / 2 - nx) +
                  " " +
                  f((p.y + ty) / 2 - ny) +
                  " " +
                  f(p.x) +
                  " " +
                  f(p.y) +
                  "Z";
              });
            }
            return { rachis: bezPath([[p0, p1, p2, p3]]), pinnae: d };
          }
          function fernSymbol() {
            return [
              [20, 220, 70, 8, "#2c4a31"],
              [6, 180, 95, 30, "#3d6341"],
              [40, 150, 40, -6, "#4d7a4c"],
              [0, 120, 120, 52, "#2f5436"],
            ]
              .map(function (fr) {
                var fd = frond(fr[1], fr[2]);
                return (
                  '<g transform="translate(' +
                  fr[0] +
                  " 262) rotate(" +
                  fr[3] +
                  ')"><path d="' +
                  fd.rachis +
                  '" fill="none" stroke="' +
                  fr[4] +
                  '" stroke-width="1.6"/><path d="' +
                  fd.pinnae +
                  '" fill="' +
                  fr[4] +
                  '"/></g>'
                );
              })
              .join("");
          }
          function foliageSymbol(seed) {
            var r = rng(seed);
            var g = "";
            for (var k = 0; k < 30; k++) {
              var a = r() * Math.PI * 2;
              var d = Math.sqrt(r()) * 36;
              g += leafy(
                "sym-leaf",
                Math.cos(a) * d,
                Math.sin(a) * d * 0.72,
                r() * 360,
                0.36 + r() * 0.3,
                pick(
                  ["#3f6b45", "#557f52", "#2f5537", "#6d9563", "#48744a"],
                  r,
                ),
                "",
                r,
              );
            }
            return g;
          }
          function tuftSymbol(seed) {
            var r = rng(seed);
            var g = "";
            for (var i = 0; i < 9; i++) {
              var x = 8 + i * 5.5 + r() * 3;
              var h = 16 + r() * 26;
              var bend = (r() * 2 - 1) * h * 0.35;
              var w = 1.8 + r() * 2.2;
              g +=
                '<path d="M' +
                f(x - w) +
                " 44 Q" +
                f(x - w * 0.3 + bend * 0.3) +
                " " +
                f(44 - h * 0.55) +
                " " +
                f(x + bend) +
                " " +
                f(44 - h) +
                " Q" +
                f(x + w * 0.3 + bend * 0.3) +
                " " +
                f(44 - h * 0.55) +
                " " +
                f(x + w) +
                ' 44Z" fill="' +
                pick(
                  ["#2f5134", "#3e6a42", "#4f7d4d", "#28462d", "#5c8a55"],
                  r,
                ) +
                '"/>';
            }
            return g;
          }
          function ivyCornerSymbol() {
            var r = rng(14);
            var a = [
              [
                [-4, 6],
                [30, 0],
                [70, 16],
                [116, 8],
              ],
            ];
            var b = [
              [
                [4, -4],
                [2, 36],
                [14, 78],
                [6, 118],
              ],
            ];
            return (
              stem(a, 1.3) +
              stem(b, 1.3) +
              ivyAlong(a, r, { step: 0.12, sMin: 0.34, sMax: 0.5 }) +
              ivyAlong(b, r, { step: 0.13, sMin: 0.32, sMax: 0.48 }) +
              useAt("sym-rose", 18, 14, 0, 0.5, 40, 40, -20, -20)
            );
          }
          function wreathSymbol() {
            var r = rng(61);
            var L = [
              [
                [98, 236],
                [40, 232],
                [6, 190],
                [8, 120],
              ],
              [
                [8, 120],
                [9, 80],
                [22, 46],
                [44, 28],
              ],
            ];
            var R = [
              [
                [102, 236],
                [160, 232],
                [194, 190],
                [192, 120],
              ],
              [
                [192, 120],
                [191, 84],
                [180, 58],
                [164, 44],
              ],
            ];
            var g =
              '<path d="' +
              bezPath(L) +
              " " +
              bezPath(R) +
              '" fill="none" stroke="#5a6b44" stroke-width="1.6"/>';
            [L, R].forEach(function (segs) {
              var k = 0;
              segs.forEach(function (s) {
                for (var t = 0.05; t < 1; t += 0.13 + r() * 0.04) {
                  var p = bez(s[0], s[1], s[2], s[3], t);
                  var alt = k++ % 2 ? 1 : -1;
                  g += leafy(
                    "sym-leaf",
                    p.x,
                    p.y,
                    p.a + 90 + alt * (48 + r() * 20),
                    0.62 + r() * 0.3,
                    pick(["#5f8a58", "#7ba06c", "#4a7349", "#8fb080"], r),
                    "",
                    r,
                  );
                }
              });
            });
            [
              [100, 230, 0.62, "sym-rose"],
              [80, 232, 0.42, "sym-blossom"],
              [122, 231, 0.44, "sym-blossom"],
              [16, 150, 0.38, "sym-blossom"],
              [186, 140, 0.4, "sym-rose"],
              [40, 34, 0.34, "sym-blossom"],
              [168, 50, 0.32, "sym-blossom"],
            ].forEach(function (p) {
              g += useAt(p[3], p[0], p[1], 0, p[2], 40, 40, -20, -20);
            });
            return g;
          }
          function pergolaSymbol() {
            var r = rng(71);
            var g =
              '<g fill="none" stroke="#2d2a26" stroke-linecap="round"><path d="M34 170 L34 92 C34 34 94 10 160 10 C226 10 286 34 286 92 L286 170" stroke-width="5"/>' +
              '<path d="M48 170 L48 94 C48 46 100 24 160 24 C220 24 272 46 272 94 L272 170" stroke-width="2.4"/><path d="';
            for (var i = 0; i <= 10; i++) {
              var a = Math.PI + (i / 10) * Math.PI;
              g +=
                "M" +
                f(160 + Math.cos(a) * 126) +
                " " +
                f(92 + Math.sin(a) * 82) +
                " L" +
                f(160 + Math.cos(a) * 112) +
                " " +
                f(94 + Math.sin(a) * 70) +
                " ";
            }
            g +=
              '" stroke-width="1.6"/><path d="M34 120 C18 120 14 104 24 100 C32 97 36 106 30 110 M286 120 C302 120 306 104 296 100 C288 97 284 106 290 110 M160 10 C150 -4 170 -4 160 10" stroke-width="2"/></g>';
            var vine = [
              [
                [36, 170],
                [26, 140],
                [44, 120],
                [36, 96],
              ],
              [
                [36, 96],
                [30, 60],
                [70, 30],
                [118, 18],
              ],
            ];
            g +=
              '<path d="' +
              bezPath(vine) +
              '" fill="none" stroke="#3e5a34" stroke-width="1.4"/>' +
              ivyAlong(vine, r, { step: 0.12, sMin: 0.22, sMax: 0.32 });
            [
              [40, 118, 0.42],
              [34, 84, 0.36],
              [60, 42, 0.4],
              [96, 22, 0.34],
              [284, 102, 0.34],
              [270, 56, 0.3],
            ].forEach(function (p) {
              g += useAt("sym-rose", p[0], p[1], 0, p[2], 40, 40, -20, -20);
            });
            return g;
          }
          function dividerSymbol() {
            var g =
              '<path d="M4 16 C40 6 70 26 104 15 M216 16 C180 6 150 26 116 15" fill="none" stroke="#6f7f5b" stroke-width="1.1"/>';
            [
              [
                [4, 16],
                [40, 6],
                [70, 26],
                [104, 15],
              ],
              [
                [216, 16],
                [180, 6],
                [150, 26],
                [116, 15],
              ],
            ].forEach(function (s) {
              var k = 0;
              for (var t = 0.12; t < 0.95; t += 0.16) {
                var p = bez(s[0], s[1], s[2], s[3], t);
                var alt = k++ % 2 ? 1 : -1;
                g += useAt(
                  "sym-leaf",
                  p.x,
                  p.y,
                  p.a + 90 + alt * 55,
                  0.28,
                  20,
                  40,
                  -10,
                  -39,
                  "",
                  "color:" + (alt > 0 ? "#6d9563" : "#8aa97c"),
                );
              }
            });
            return (
              g +
              useAt(
                "sym-blossom",
                110,
                15,
                0,
                0.34,
                40,
                40,
                -20,
                -20,
                "",
                "color:#e9b7be",
              )
            );
          }
          function petalRing(n, d, rot0, cls) {
            var g = "";
            for (var i = 0; i < n; i++) {
              g +=
                '<g transform="rotate(' +
                f(rot0 + (i * 360) / n) +
                ' 60 80)"><path class="petal ' +
                cls +
                '" style="--i:' +
                i +
                '" d="' +
                d +
                '"/></g>';
            }
            return g;
          }
          var BUD =
            '<g class="fl-bud"><path class="bud-body" d="M60 94 C49 88 49 68 60 56 C71 68 71 88 60 94Z"/><path class="bud-line" d="M60 92 C56 84 56 72 60 62"/>' +
            '<path class="bud-sepal" d="M60 96 C52 95 46 90 45 84 C51 85 56 88 60 96Z M60 96 C68 95 74 90 75 84 C69 85 64 88 60 96Z"/></g>';
          function bloom(kind) {
            var g = '<g class="fl-petals">';
            if (kind === 1) {
              g +=
                petalRing(
                  16,
                  "M60 80 C56 70 56 55 60 43 C64 55 64 70 60 80Z",
                  11,
                  "p-a",
                ) +
                petalRing(
                  16,
                  "M60 80 C57 71 57 58 60 49 C63 58 63 71 60 80Z",
                  0,
                  "p-b",
                ) +
                '<circle class="fl-disc" cx="60" cy="80" r="11.5" fill="#6b4a2a"/>';
              var r = rng(8);
              var dots = "";
              for (var i = 0; i < 16; i++) {
                var a = r() * Math.PI * 2;
                var dd = Math.sqrt(r()) * 9;
                dots +=
                  "M" +
                  f(60 + Math.cos(a) * dd) +
                  " " +
                  f(80 + Math.sin(a) * dd) +
                  "h.1";
              }
              g +=
                '<path class="fl-disc" d="' +
                dots +
                '" stroke="#3b2a18" stroke-width="1.8" stroke-linecap="round"/>';
            } else if (kind === 2) {
              g +=
                petalRing(
                  5,
                  "M60 80 C48 74 47 57 60 50 C73 57 72 74 60 80Z",
                  0,
                  "p-a",
                ) +
                petalRing(
                  5,
                  "M60 80 C54 76 54 66 60 62 C66 66 66 76 60 80Z",
                  36,
                  "p-b",
                ) +
                '<circle class="fl-disc" cx="60" cy="80" r="4.5" fill="#e9c35c"/>';
            } else {
              g +=
                petalRing(
                  7,
                  "M60 80 C45 76 43 56 60 47 C77 56 75 76 60 80Z",
                  0,
                  "p-a",
                ) +
                petalRing(
                  6,
                  "M60 80 C50 77 49 63 60 57 C71 63 70 77 60 80Z",
                  25,
                  "p-b",
                ) +
                '<path class="fl-spiral" d="M60 80 m-3 0 a3 3 0 1 1 6 0 a6 6 0 1 1 -12 0 a8.5 8.5 0 1 1 17 0" fill="none" stroke-width="1.6" stroke-linecap="round"/>';
            }
            return g + "</g>" + BUD;
          }
          function dial() {
            var g = "";
            var ring = function (a, rr) {
              return (
                f(150 + Math.cos(a) * rr) + " " + f(150 + Math.sin(a) * rr)
              );
            };
            for (var i = 0; i < 12; i++) {
              var a0 = ((i * 30 - 105) * Math.PI) / 180;
              var a1 = ((i * 30 - 75) * Math.PI) / 180;
              g +=
                '<path d="M' +
                ring(a0, 58) +
                " L" +
                ring(a0, 118) +
                " A118 118 0 0 1 " +
                ring(a1, 118) +
                " L" +
                ring(a1, 58) +
                " A58 58 0 0 0 " +
                ring(a0, 58) +
                'Z" fill="' +
                (i % 2 ? "#dfe6d2" : "#e9dcc0") +
                '" stroke="#b9a578" stroke-width=".8"/>';
            }
            g +=
              '<circle cx="150" cy="150" r="146" fill="none" stroke="#a8864a" stroke-width="1.4"/><circle cx="150" cy="150" r="121" fill="none" stroke="#a8864a" stroke-width=".8" stroke-dasharray="2 3"/>';
            var roman = [
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
            for (var h = 0; h < 12; h++) {
              var a = ((h * 30 - 90) * Math.PI) / 180;
              g += useAt(
                "sym-leaf",
                150 + Math.cos(a) * 112,
                150 + Math.sin(a) * 112,
                h * 30,
                0.42,
                20,
                40,
                -10,
                -39,
                "",
                "color:" + (h % 3 === 0 ? "#5f8a58" : "#86a77a"),
              );
              g +=
                '<text x="' +
                f(150 + Math.cos(a) * 134) +
                '" y="' +
                f(150 + Math.sin(a) * 134) +
                '" text-anchor="middle" dominant-baseline="central" class="dial-num">' +
                roman[h] +
                "</text>";
            }
            return (
              g +
              '<circle cx="150" cy="150" r="56" fill="#f7f0de" stroke="#b9a578" stroke-width="1"/>'
            );
          }
          function compass() {
            var g =
              '<circle cx="50" cy="50" r="44" fill="rgba(247,240,222,.92)" stroke="#8a6a36" stroke-width="1.2"/><circle cx="50" cy="50" r="38" fill="none" stroke="#8a6a36" stroke-width=".6" stroke-dasharray="1.5 2"/>';
            var pt = function (a, len, w, fill) {
              var rad = (a * Math.PI) / 180;
              return (
                '<path d="M' +
                f(50 + Math.sin(rad - Math.PI / 2) * w) +
                " " +
                f(50 - Math.cos(rad - Math.PI / 2) * w) +
                " L" +
                f(50 + Math.sin(rad) * len) +
                " " +
                f(50 - Math.cos(rad) * len) +
                " L" +
                f(50 + Math.sin(rad + Math.PI / 2) * w) +
                " " +
                f(50 - Math.cos(rad + Math.PI / 2) * w) +
                'Z" fill="' +
                fill +
                '"/>'
              );
            };
            [45, 135, 225, 315].forEach(function (a) {
              g += pt(a, 26, 5, "#c9ae78");
            });
            g +=
              pt(0, 36, 7, "#7a2f36") +
              pt(90, 36, 7, "#3b5a3f") +
              pt(180, 36, 7, "#3b5a3f") +
              pt(270, 36, 7, "#3b5a3f") +
              '<circle cx="50" cy="50" r="4" fill="#b38b45"/>';
            [
              ["U", 50, 9.5],
              ["S", 50, 97],
              ["T", 93, 53.5],
              ["B", 7, 53.5],
            ].forEach(function (l) {
              g +=
                '<text x="' +
                l[1] +
                '" y="' +
                l[2] +
                '" text-anchor="middle" class="compass-l">' +
                l[0] +
                "</text>";
            });
            return g;
          }
          function grass(seed, W, H, n) {
            var r = rng(seed);
            var g = "";
            for (var i = 0; i < n; i++) {
              var sc = (H / 44) * (0.7 + r() * 0.45);
              g +=
                '<g transform="translate(' +
                f((i / n) * W + ((r() * W) / n) * 0.6 - 10) +
                " " +
                f(H - 44 * sc) +
                ") scale(" +
                f2(sc) +
                ')"><use href="#sym-tuft-' +
                (r() > 0.5 ? "a" : "b") +
                '" width="60" height="44" class="sway-blade" style="animation-delay:-' +
                f2(r() * 4) +
                "s;animation-duration:" +
                f2(3.6 + r() * 2.4) +
                's"/></g>';
            }
            return g;
          }
          function roof() {
            var g =
              '<path d="M10 108 L200 14 L390 108" fill="rgba(220,235,225,.18)" stroke="#2e3a31" stroke-width="4" stroke-linejoin="round"/><path d="';
            for (var i = 1; i < 10; i++) {
              var t = i / 10;
              g +=
                "M" +
                f(10 + t * 380) +
                " 108 L" +
                f(10 + t * 380) +
                " " +
                f(
                  t <= 0.5 ? 108 - (t / 0.5) * 94 : 14 + ((t - 0.5) / 0.5) * 94,
                ) +
                " ";
            }
            g += "M60 84 L340 84 ";
            for (var s = 0; s < 8; s++) {
              g +=
                "M200 68 L" +
                f(200 + Math.cos((s * Math.PI) / 4) * 22) +
                " " +
                f(68 + Math.sin((s * Math.PI) / 4) * 22) +
                " ";
            }
            return (
              g +
              '" stroke="#2e3a31" stroke-width="1.5"/><circle cx="200" cy="68" r="22" fill="rgba(240,248,240,.25)" stroke="#2e3a31" stroke-width="2"/>' +
              '<path d="M200 14 L200 0 M194 6 C200 -4 206 6 200 10" stroke="#2e3a31" stroke-width="2" fill="none"/>'
            );
          }
          function moss() {
            var r = rng(31);
            var g = "";
            for (var i = 0; i < 46; i++) {
              var t = r();
              var y =
                30 -
                Math.sin(t * Math.PI) * 22 +
                r() * 22 * (0.4 + Math.sin(t * Math.PI) * 0.6);
              g +=
                '<circle cx="' +
                f(20 + t * 160) +
                '" cy="' +
                f(y) +
                '" r="' +
                f(3.5 + r() * 6.5) +
                '" fill="' +
                pick(
                  ["#5d7d3f", "#6f8f47", "#4c6b35", "#839f55", "#3f5a2e"],
                  r,
                ) +
                '"/>';
            }
            for (var k = 0; k < 5; k++) {
              g += useAt(
                "sym-sprout",
                50 + k * 26 + r() * 10,
                16 + r() * 8,
                0,
                0.5,
                24,
                24,
                -12,
                -22,
                "sway-leaf",
                "animation-delay:-" + f2(r() * 3) + "s",
              );
            }
            return g;
          }
          function basket() {
            var r = rng(5);
            var g =
              '<path d="M44 118 C44 20 216 20 216 118" fill="none" stroke="#8b6a3e" stroke-width="10" stroke-linecap="round"/><path d="M44 118 C44 20 216 20 216 118" fill="none" stroke="#b08a52" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round"/>';
            for (var i = 0; i < 12; i++) {
              g += leafy(
                "sym-leaf",
                60 + r() * 140,
                104 + r() * 16,
                -60 + r() * 120,
                0.7 + r() * 0.5,
                ["#4f7a48", "#6a9360", "#3c6340"][i % 3],
                i % 3 === 0 ? "sway-leaf" : "",
                r,
              );
            }
            [
              [70, 112, 0.9, "sym-rose"],
              [98, 98, 1.05, "sym-blossom"],
              [130, 92, 1.2, "sym-rose"],
              [162, 100, 1, "sym-blossom"],
              [190, 110, 0.95, "sym-rose"],
              [114, 114, 0.8, "sym-rose"],
              [150, 118, 0.85, "sym-blossom"],
            ].forEach(function (p, i) {
              g += useAt(
                p[3],
                p[0],
                p[1],
                0,
                p[2],
                40,
                40,
                -20,
                -20,
                i % 2 ? "twinkle-soft" : "",
                "animation-delay:-" +
                  i * 0.6 +
                  "s;color:" +
                  ["#f4ccd2", "#fbf3e6", "#e8a7b2"][i % 3],
              );
            });
            var body =
              "M30 118 L230 118 L212 206 C210 212 206 214 200 214 L60 214 C54 214 50 212 48 206 Z";
            g +=
              '<path d="' +
              body +
              '" fill="url(#pat-weave)"/><path d="' +
              body +
              '" fill="none" stroke="#6f4f28" stroke-width="2"/>' +
              '<path d="M24 112 H236 a6 6 0 0 1 0 12 H24 a6 6 0 0 1 0 -12Z" fill="#8b6a3e"/><path d="M26 118 H234" stroke="#c9a46a" stroke-width="2" stroke-dasharray="6 4"/>' +
              '<g class="sway-bow"><path d="M130 124 C112 108 96 114 100 126 C104 138 122 132 130 124Z M130 124 C148 108 164 114 160 126 C156 138 138 132 130 124Z" fill="#d88b98"/>' +
              '<path d="M128 126 C122 142 116 152 110 160 M132 126 C138 142 144 152 150 160" stroke="#c7707f" stroke-width="4" stroke-linecap="round" fill="none"/><circle cx="130" cy="125" r="5" fill="#c7707f"/></g>';
            return g;
          }
          function tree() {
            var r = rng(77);
            var g = '<g fill="none" stroke="#4b3a28" stroke-linecap="round">';
            [
              ["M180 300 C176 250 184 214 178 180", 22],
              ["M178 188 C150 160 120 150 84 120", 11],
              ["M180 184 C214 160 246 150 282 118", 11],
              ["M176 196 C168 150 170 110 164 66", 9],
              ["M182 190 C196 150 206 118 214 76", 8],
              ["M110 140 C92 124 70 118 46 116", 5],
              ["M250 138 C272 126 294 124 318 126", 5],
              ["M166 100 C150 84 136 78 118 72", 4],
              ["M208 104 C226 88 240 82 258 80", 4],
            ].forEach(function (b) {
              g += '<path d="' + b[0] + '" stroke-width="' + b[1] + '"/>';
            });
            g += "</g>";
            var clusters = [
              [70, 104, 0.95],
              [120, 64, 1],
              [180, 44, 1.12],
              [240, 62, 1],
              [292, 104, 0.95],
              [150, 110, 0.82],
              [214, 108, 0.82],
              [40, 120, 0.66],
              [322, 118, 0.66],
              [180, 92, 0.86],
            ];
            clusters.forEach(function (c, i) {
              g += useAt(
                "sym-foliage-" + (i % 2 ? "b" : "a"),
                c[0],
                c[1],
                0,
                c[2],
                100,
                90,
                -50,
                -45,
                "sway-cluster",
                "animation-delay:-" +
                  f2(r() * 5) +
                  "s;animation-duration:" +
                  f2(6 + r() * 3) +
                  "s",
              );
            });
            [
              [64, 124],
              [96, 132],
              [128, 120],
              [150, 134],
              [206, 132],
              [232, 118],
              [262, 134],
              [296, 124],
              [110, 90],
              [246, 88],
              [44, 128],
              [318, 130],
            ].forEach(function (h, i) {
              var len = 18 + r() * 26;
              g +=
                '<g transform="translate(' +
                h[0] +
                " " +
                h[1] +
                ')"><g class="sway-tag" style="animation-delay:-' +
                f2(r() * 4) +
                "s;animation-duration:" +
                f2(3 + r() * 2.5) +
                's"><path d="M0 0 L0 ' +
                f(len) +
                '" stroke="#8b7b62" stroke-width=".8"/><rect x="-6" y="' +
                f(len) +
                '" width="12" height="17" rx="1.5" fill="' +
                ["#f2d7d9", "#f6ecd0", "#dfe9d6", "#e3dbef", "#f3e1c7"][i % 5] +
                '" stroke="rgba(60,50,30,.25)" stroke-width=".6"/><circle cx="0" cy="' +
                f(len + 3) +
                '" r="1.2" fill="#8b7b62"/></g></g>';
            });
            for (var i = 0; i < 10; i++) {
              var c = clusters[i];
              g += useAt(
                "sym-blossom",
                c[0] + (r() * 2 - 1) * 34 * c[2],
                c[1] + (r() * 2 - 1) * 22 * c[2],
                0,
                0.22 + r() * 0.14,
                40,
                40,
                -20,
                -20,
                i % 2 ? "twinkle-soft" : "",
                "animation-delay:-" +
                  f2(r() * 4) +
                  "s;color:" +
                  (r() > 0.5 ? "#f2c9cf" : "#fbf1e4"),
              );
            }
            return (
              g +
              '<path d="M60 298 C120 290 240 290 300 298 L300 300 L60 300Z" fill="#3a4a2e" opacity=".55"/>'
            );
          }
          function ampVine() {
            var r = rng(21);
            var c = [
              [
                [10, 96],
                [0, 50],
                [40, 6],
                [74, 12],
              ],
              [
                [74, 12],
                [108, 18],
                [122, 60],
                [104, 96],
              ],
            ];
            return (
              '<path d="' +
              bezPath(c) +
              '" fill="none" stroke="#6a7f55" stroke-width="1.2"/>' +
              ivyAlong(c, r, { step: 0.12, sMin: 0.26, sMax: 0.36, every: 2 })
            );
          }
          function symbols() {
            var s = "";
            RACEMES.forEach(function (rc) {
              s +=
                '<symbol id="sym-raceme-' +
                rc[0] +
                '" viewBox="-16 -2 32 ' +
                (rc[1] + 8) +
                '">' +
                racemeSymbol(rc[1], 100 + rc[0]) +
                "</symbol>";
            });
            s +=
              '<symbol id="sym-foliage-a" viewBox="-50 -45 100 90">' +
              foliageSymbol(201) +
              "</symbol>";
            s +=
              '<symbol id="sym-foliage-b" viewBox="-50 -45 100 90">' +
              foliageSymbol(202) +
              "</symbol>";
            s +=
              '<symbol id="sym-tuft-a" viewBox="0 0 60 44">' +
              tuftSymbol(301) +
              "</symbol>";
            s +=
              '<symbol id="sym-tuft-b" viewBox="0 0 60 44">' +
              tuftSymbol(302) +
              "</symbol>";
            s +=
              '<symbol id="sym-fern" viewBox="0 0 220 262">' +
              fernSymbol() +
              "</symbol>";
            s +=
              '<symbol id="sym-ivy-corner" viewBox="0 0 120 120">' +
              ivyCornerSymbol() +
              "</symbol>";
            s +=
              '<symbol id="sym-wreath" viewBox="0 0 200 240">' +
              wreathSymbol() +
              "</symbol>";
            s +=
              '<symbol id="sym-pergola" viewBox="0 0 320 172">' +
              pergolaSymbol() +
              "</symbol>";
            s +=
              '<symbol id="sym-divider" viewBox="0 0 220 30">' +
              dividerSymbol() +
              "</symbol>";
            s +=
              '<pattern id="pat-weave" width="18" height="14.5" patternUnits="userSpaceOnUse"><rect width="18" height="14.5" fill="#a97d45"/><rect x="2" y="1.8" width="11" height="10" rx="4" fill="#c39a5e"/><path d="M0 .4 H18" stroke="#7d5a2e" stroke-width="1.2"/></pattern>';
            return s;
          }
          function fill(id, markup, prepend) {
            var el = byId(id);
            if (!el) {
              return;
            }
            if (prepend) {
              el.insertAdjacentHTML("afterbegin", markup);
            } else {
              el.insertAdjacentHTML("beforeend", markup);
            }
          }
          return {
            grow: function () {
              fill("svg-defs-grown", symbols());
              fill("gate-ivy", gateIvy());
              fill("hero-garland-l", wisteria(41));
              fill("hero-garland-r-flip", wisteria(57));
              fill("couple-amp-vine", ampVine());
              fill("flower-1-head", bloom(1));
              fill("flower-2-head", bloom(2));
              fill("flower-3-head", bloom(3));
              fill("clock-svg", dial(), true);
              fill("map-compass-rose", compass());
              fill("dress-grass", grass(88, 400, 40, 18));
              fill("glasshouse-roof", roof());
              fill("secret-stone-moss", moss());
              fill("secret-grass", grass(89, 400, 60, 20));
              fill("gift-basket", basket());
              fill("wish-tree", tree());
            },
          };
        })();
        ORN.grow();
        /* ---------------------------------------------------------------- guest + couple */
        var guestName = txt(byId("cover-guest-name"));
        body.classList.toggle("has-guest", guestName !== "");
        var brideName = txt(byId("hero-bride"));
        var groomName = txt(byId("hero-groom"));
        var monoEl = byId("keystone-mono");
        if (monoEl) {
          monoEl.textContent = (
            brideName.charAt(0) +
            (brideName && groomName ? "·" : "") +
            groomName.charAt(0)
          ).toUpperCase();
        }
        /* ---------------------------------------------------------------- dates */
        var dataSrc = byId("data-src");
        function dataOf(k) {
          return clean(dataSrc ? dataSrc.getAttribute("data-" + k) : "");
        }
        var ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
        var HHMM = /^([01]?\d|2[0-3])[:.]([0-5]\d)$/;
        function normTime(t) {
          var m = HHMM.exec(clean(t));
          return m ? pad(Number(m[1])) + ":" + m[2] : "";
        }
        function makeDate(d, t) {
          if (!ISO_DATE.test(d)) {
            return null;
          }
          var dt = new Date(d + "T" + (normTime(t) || "00:00") + ":00");
          return isNaN(dt.getTime()) ? null : dt;
        }
        function ymd(dt) {
          return (
            dt.getFullYear() +
            "-" +
            pad(dt.getMonth() + 1) +
            "-" +
            pad(dt.getDate())
          );
        }
        function fmtDate(dt) {
          return dt.toLocaleDateString(window.TAMAN.locale, {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          });
        }
        function fmtClock(t) {
          return t ? t.replace(":", ".") : "";
        }
        var tzLabel = dataOf("tz");
        function timeRange(start, end) { return [start, end].filter(Boolean).join(" – "); }
        var weddingISO = dataOf("date");
        var weddingTime = normTime(dataOf("time"));
        var mainStart = window.TAMAN.data.dateTime ? new Date(window.TAMAN.data.dateTime) : null;
        var heroDate = byId("hero-date-text");
        if (heroDate) {
          heroDate.textContent = mainStart ? fmtDate(mainStart) : weddingISO;
        }
        /* ---------------------------------------------------------------- countdown */
        var cdWrap = byId("hero-count");
        var cdEls = [
          byId("cd-days-n"),
          byId("cd-hours-n"),
          byId("cd-mins-n"),
          byId("cd-secs-n"),
        ];
        var cdTimer = 0;
        function tickCountdown() {
          if (!cdWrap) {
            return;
          }
          if (!mainStart) {
            cdWrap.style.display = "none";
            return;
          }
          var diff = mainStart.getTime() - Date.now();
          if (diff <= 0) {
            cdWrap.classList.add("is-done");
            var done = byId("hero-count-done");
            if (done && diff < -86400000) {
              done.textContent =
                window.TAMAN.words.countDone;
            }
            if (cdTimer) {
              clearInterval(cdTimer);
              cdTimer = 0;
            }
            return;
          }
          var s = Math.floor(diff / 1000);
          var vals = [
            Math.floor(s / 86400),
            Math.floor((s % 86400) / 3600),
            Math.floor((s % 3600) / 60),
            s % 60,
          ];
          cdEls.forEach(function (el, i) {
            if (el) {
              el.textContent = i === 0 ? String(vals[i]) : pad(vals[i]);
            }
          });
        }
        tickCountdown();
        if (mainStart && mainStart.getTime() > Date.now()) {
          cdTimer = setInterval(tickCountdown, 1000);
        }
        /* ---------------------------------------------------------------- events, calendar, maps */
        var TZMAP = {
          WIB: "Asia/Jakarta",
          WITA: "Asia/Makassar",
          WIT: "Asia/Jayapura",
        };
        function calStamp(dt) {
          return (
            dt.getFullYear() +
            pad(dt.getMonth() + 1) +
            pad(dt.getDate()) +
            "T" +
            pad(dt.getHours()) +
            pad(dt.getMinutes()) +
            "00"
          );
        }
        function calLink(title, start, endT, place) {
          if (!start) {
            return "";
          }
          var end = endT ? makeDate(ymd(start), endT) : null;
          if (!end || end <= start) {
            end = new Date(start.getTime() + 2 * 3600000);
          }
          var url =
            "https://calendar.google.com/calendar/render?action=TEMPLATE" +
            "&text=" +
            encodeURIComponent(title + " · " + brideName + " & " + groomName) +
            "&dates=" +
            calStamp(start) +
            "/" +
            calStamp(end) +
            "&details=" +
            encodeURIComponent(
              "Undangan pernikahan " + brideName + " & " + groomName,
            ) +
            "&location=" +
            encodeURIComponent(place);
          var zone = TZMAP[(tzLabel || "").toUpperCase()];
          if (zone) {
            url += "&ctz=" + encodeURIComponent(zone);
          }
          return url;
        }
        function mapsLink(name, addr, placeId) {
          var dest = [name, addr]
            .filter(function (v) {
              return !!v;
            })
            .join(", ");
          var url =
            "https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=" +
            encodeURIComponent(dest || "Lokasi acara");
          if (placeId) {
            url += "&destination_place_id=" + encodeURIComponent(placeId);
          }
          return url;
        }
        var placeId = dataOf("place");
        var venue1 = txt(byId("event-1-venue"));
        var addr1 = txt(byId("event-1-address"));
        var map1 = mapsLink(venue1, addr1, placeId);
        var e1Name = txt(byId("event-1-name")) || "Akad Nikah";
        var e1End = normTime(dataOf("end"));
        if (byId("event-1-date")) {
          byId("event-1-date").textContent = mainStart
            ? fmtDate(mainStart)
            : weddingISO;
        }
        if (byId("event-1-time")) {
          byId("event-1-time").textContent = timeRange(weddingTime, e1End);
        }
        if (byId("event-1-map")) {
          byId("event-1-map").href = map1;
        }
        if (byId("map-btn")) {
          byId("map-btn").href = map1;
        }
        var cal1 = calLink(
          e1Name,
          mainStart,
          e1End,
          [venue1, addr1].filter(Boolean).join(", "),
        );
        if (byId("event-1-cal")) {
          if (cal1) {
            byId("event-1-cal").href = cal1;
          } else {
            byId("event-1-cal").style.display = "none";
          }
        }
        var e2Name = txt(byId("event-2-name"));
        if (!e2Name) {
          if (byId("event-2")) {
            byId("event-2").style.display = "none";
          }
          if (byId("events-grid")) {
            byId("events-grid").classList.add("is-single");
          }
        } else {
          var e2ISO = dataOf("e2date");
          if (!ISO_DATE.test(e2ISO)) {
            e2ISO = weddingISO;
          }
          var e2Time = normTime(dataOf("e2time"));
          var e2End = normTime(dataOf("e2end"));
          var e2Start = makeDate(e2ISO, e2Time);
          var venue2 = txt(byId("event-2-venue")) || venue1;
          var addr2 =
            txt(byId("event-2-address")) || (venue2 === venue1 ? addr1 : "");
          if (byId("event-2-venue")) {
            byId("event-2-venue").textContent = venue2;
          }
          if (byId("event-2-address")) {
            byId("event-2-address").textContent = addr2;
          }
          if (byId("event-2-date")) {
            byId("event-2-date").textContent = e2Start
              ? fmtDate(e2Start)
              : e2ISO;
          }
          if (byId("event-2-time")) {
            if (e2Time) {
              byId("event-2-time").textContent = timeRange(e2Time, e2End);
            } else {
              byId("event-2-row-time").style.display = "none";
            }
          }
          var mapLink2 = byId("event-2-map");
          var custom2 = clean(mapLink2 ? mapLink2.getAttribute("href") : "");
          if (mapLink2) {
            mapLink2.href = /^https?:\/\//i.test(custom2)
              ? custom2
              : venue2 === venue1
                ? map1
                : mapsLink(venue2, addr2, "");
          }
          var cal2 = calLink(
            e2Name,
            e2Start,
            e2End,
            [venue2, addr2].filter(Boolean).join(", "),
          );
          if (byId("event-2-cal")) {
            if (cal2) {
              byId("event-2-cal").href = cal2;
            } else {
              byId("event-2-cal").style.display = "none";
            }
          }
        }
        var mapFrame = byId("map-frame");
        var mapEmbed = byId("map-embed");
        if (mapFrame && mapEmbed) {
          var mapSrc = mapEmbed.getAttribute("src") || "";
          if (
            !placeId ||
            /[?&]key=(&|$)/.test(mapSrc) ||
            mapSrc.indexOf("{{") !== -1
          ) {
            mapFrame.classList.add("no-embed");
            mapEmbed.removeAttribute("src");
          }
        }
        /* ---------------------------------------------------------------- photos with graceful fallbacks */
        function photoOk(img) {
          var s = clean(img ? img.getAttribute("src") : "");
          return !!s && s.indexOf("data:image/gif") !== 0;
        }
        function packetPhoto(imgId, initial) {
          var img = byId(imgId);
          if (!img) {
            return;
          }
          var win = img.parentNode;
          var fail = function () {
            win.classList.add("no-photo");
            win.setAttribute("data-initial", (initial || "").toUpperCase());
          };
          if (!photoOk(img)) {
            fail();
            return;
          }
          img.addEventListener("error", fail);
        }
        packetPhoto("bride-photo", brideName.charAt(0));
        packetPhoto("groom-photo", groomName.charAt(0));
        var secretPhoto = byId("secret-photo");
        if (secretPhoto) {
          var hidePolaroid = function () {
            byId("secret-polaroid").classList.add("no-photo");
          };
          if (!photoOk(secretPhoto)) {
            hidePolaroid();
          } else {
            secretPhoto.addEventListener("error", hidePolaroid);
          }
        }
        /* ---------------------------------------------------------------- seed packets */
        function buildCare(srcId, listId) {
          var src = byId(srcId);
          var list = byId(listId);
          if (!src || !list) {
            return;
          }
          var lines = (src.textContent || "")
            .split(/\r?\n/)
            .map(function (l) {
              return l.replace(/^[\s•·*\-–—]+/, "").trim();
            })
            .filter(function (l) {
              return l && l.indexOf("{{") !== 0;
            });
          if (!lines.length) {
            list.style.display = "none";
            src.style.display = "none";
            return;
          }
          lines.forEach(function (line, i) {
            var li = doc.createElement("li");
            li.id = listId + "-item-" + (i + 1);
            var ico = svgUse("sym-sprout", 24);
            ico.id = li.id + "-ico";
            var span = doc.createElement("span");
            span.id = li.id + "-text";
            span.textContent = line;
            li.appendChild(ico);
            li.appendChild(span);
            list.appendChild(li);
          });
          src.parentNode.classList.add("has-list");
        }
        buildCare("bride-care-src", "bride-care-list");
        buildCare("groom-care-src", "groom-care-list");
        all(".packet").forEach(function (packet) {
          var flip = function () {
            var on = !packet.classList.contains("is-flipped");
            packet.classList.toggle("is-flipped", on);
            packet.setAttribute("aria-pressed", on ? "true" : "false");
          };
          packet.addEventListener("click", flip);
          packet.addEventListener("keydown", function (e) {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              flip();
            }
          });
        });
        /* ---------------------------------------------------------------- quote / letters / small texts */
        if (!txt(byId("quote-text"))) {
          byId("quote-tablet").style.display = "none";
        }
        if (!txt(byId("quote-source"))) {
          byId("quote-source").style.display = "none";
        }
        if (!txt(byId("quote-opening"))) {
          byId("quote-opening").style.display = "none";
        }
        if (!txt(byId("quote-text")) && !txt(byId("quote-opening"))) {
          hideSection("quote");
        }
        if (!txt(byId("secret-letter-text"))) {
          hideSection("secret");
        }
        if (!txt(byId("secret-letter-sign"))) {
          byId("secret-letter-sign").style.display = "none";
        }
        if (!txt(byId("rsvp-note"))) {
          byId("rsvp-note").style.display = "none";
        }
        if (!txt(byId("closing-hashtag"))) {
          byId("closing-hashtag").style.display = "none";
        }
        if (!txt(byId("gifts-lead"))) {
          byId("gifts-lead").style.display = "none";
        }
        if (!txt(byId("closing-msg"))) {
          byId("closing-msg").style.display = "none";
        }
        /* ---------------------------------------------------------------- story: seasons along a vine */
        var STAGES = [
          { sym: "st-seed", name: window.TAMAN.words.seed },
          { sym: "st-sprout", name: window.TAMAN.words.sprout },
          { sym: "st-bud", name: window.TAMAN.words.bud },
          { sym: "st-bloom", name: window.TAMAN.words.bloom },
        ];
        var storyCards = all(".story-card")
          .filter(function (card) {
            if (!card) {
              return false;
            }
            var has =
              txt(card.querySelector(".story-title")) ||
              txt(card.querySelector(".story-text"));
            if (!has) {
              card.style.display = "none";
            }
            return !!has;
          });
        if (!storyCards.length) {
          hideSection("story");
        }
        storyCards.forEach(function (card, idx) {
          var n = storyCards.length;
          var stage = STAGES[n === 1 ? 3 : Math.round((idx * 3) / (n - 1))];
          var use = card.querySelector(".story-stage use");
          if (use) {
            use.setAttribute("href", "#" + stage.sym);
          }
          var nameEl = card.querySelector(".story-stagename");
          if (nameEl) {
            nameEl.textContent = stage.name;
          }
          var img = card.querySelector(".story-photo");
          if (!photoOk(img)) {
            card.classList.add("no-photo");
          } else {
            img.addEventListener("error", function () {
              card.classList.add("no-photo");
              scheduleVine();
            });
          }
          if (!txt(card.querySelector(".story-date"))) {
            card.querySelector(".story-date").style.display = "none";
            card.querySelector(".story-dot").style.display = "none";
          }
          card.classList.toggle("is-right", idx % 2 === 1);
        });
        var vine = { len: 0, leaves: [], nodes: [], ready: false };
        var vineTimer = 0;
        function scheduleVine() {
          clearTimeout(vineTimer);
          vineTimer = setTimeout(drawVine, 120);
        }
        function drawVine() {
          var track = byId("story-track");
          var svg = byId("story-vine");
          var path = byId("story-vine-path");
          var shadow = byId("story-vine-shadow");
          var leavesG = byId("story-vine-leaves");
          if (
            !track ||
            !path ||
            isHidden(sectionEl("story")) ||
            !storyCards.length
          ) {
            return;
          }
          var tr = track.getBoundingClientRect();
          if (!tr.width || !tr.height) {
            return;
          }
          svg.setAttribute(
            "viewBox",
            "0 0 " + tr.width.toFixed(1) + " " + tr.height.toFixed(1),
          );
          var pts = storyCards.map(function (card) {
            var nr = card.querySelector(".story-node").getBoundingClientRect();
            return {
              x: nr.left + nr.width / 2 - tr.left,
              y: nr.top + nr.height / 2 - tr.top,
            };
          });
          var sway = tr.width > 700 ? 46 : 20;
          var d =
            "M" +
            pts[0].x.toFixed(1) +
            " 0 L" +
            pts[0].x.toFixed(1) +
            " " +
            pts[0].y.toFixed(1);
          for (var i = 1; i < pts.length; i++) {
            var a = pts[i - 1];
            var b = pts[i];
            var dir = i % 2 ? 1 : -1;
            d +=
              " C" +
              (a.x + sway * dir).toFixed(1) +
              " " +
              (a.y + (b.y - a.y) * 0.34).toFixed(1) +
              " " +
              (b.x - sway * dir).toFixed(1) +
              " " +
              (a.y + (b.y - a.y) * 0.66).toFixed(1) +
              " " +
              b.x.toFixed(1) +
              " " +
              b.y.toFixed(1);
          }
          var last = pts[pts.length - 1];
          d +=
            " C" +
            (last.x + sway).toFixed(1) +
            " " +
            (last.y + 40).toFixed(1) +
            " " +
            (last.x - sway * 0.6).toFixed(1) +
            " " +
            (last.y + 70).toFixed(1) +
            " " +
            last.x.toFixed(1) +
            " " +
            Math.min(tr.height, last.y + 96).toFixed(1);
          path.setAttribute("d", d);
          shadow.setAttribute("d", d);
          var len = path.getTotalLength();
          vine.len = len;
          path.style.strokeDasharray = len.toFixed(1) + " " + len.toFixed(1);
          shadow.style.strokeDasharray = len.toFixed(1) + " " + len.toFixed(1);
          while (leavesG.firstChild) {
            leavesG.removeChild(leavesG.firstChild);
          }
          vine.leaves = [];
          var k = 0;
          for (var at = 36; at < len - 10; at += 44) {
            var p0 = path.getPointAtLength(at);
            var p1 = path.getPointAtLength(Math.min(len, at + 2));
            var ang = (Math.atan2(p1.y - p0.y, p1.x - p0.x) * 180) / Math.PI;
            var side = k % 2 ? 1 : -1;
            var g = doc.createElementNS(SVGNS, "g");
            g.id = "vine-leaf-" + (k + 1);
            g.setAttribute("class", "vine-leaf");
            g.setAttribute(
              "transform",
              "translate(" +
                p0.x.toFixed(1) +
                " " +
                p0.y.toFixed(1) +
                ") rotate(" +
                (ang + 90 + side * 62).toFixed(1) +
                ") scale(" +
                (0.5 + (k % 3) * 0.12).toFixed(2) +
                ")",
            );
            var use = doc.createElementNS(SVGNS, "use");
            use.setAttribute("href", "#sym-leaf");
            use.setAttribute("x", "-10");
            use.setAttribute("y", "-39");
            use.setAttribute("width", "20");
            use.setAttribute("height", "40");
            use.setAttribute(
              "style",
              "color:" +
                (k % 3 === 0 ? "#6d9563" : k % 3 === 1 ? "#4f7a48" : "#86a77a"),
            );
            g.appendChild(use);
            leavesG.appendChild(g);
            vine.leaves.push({ el: g, at: at });
            k++;
          }
          vine.nodes = storyCards.map(function (card, i) {
            var best = 0;
            var bestD = Infinity;
            for (var s = 0; s <= len; s += 6) {
              var pt = path.getPointAtLength(s);
              var dd = Math.abs(pt.y - pts[i].y) + Math.abs(pt.x - pts[i].x);
              if (dd < bestD) {
                bestD = dd;
                best = s;
              }
            }
            return { card: card, at: best };
          });
          vine.ready = true;
          updateVine();
        }
        function updateVine() {
          if (!vine.ready) {
            return;
          }
          var track = byId("story-track");
          var r = track.getBoundingClientRect();
          var vh = window.innerHeight;
          var frac = reduceMotion
            ? 1
            : clamp((vh * 0.72 - r.top) / Math.max(1, r.height), 0, 1);
          if (
            window.innerHeight + window.pageYOffset >=
            doc.documentElement.scrollHeight - 4
          ) {
            frac = 1;
          }
          var grown = vine.len * frac;
          var off = (vine.len - grown).toFixed(1);
          byId("story-vine-path").style.strokeDashoffset = off;
          byId("story-vine-shadow").style.strokeDashoffset = off;
          vine.leaves.forEach(function (lf) {
            lf.el.classList.toggle("is-grown", lf.at <= grown);
          });
          vine.nodes.forEach(function (nd) {
            nd.card.classList.toggle("is-reached", nd.at <= grown + 4);
          });
        }
        /* ---------------------------------------------------------------- language of flowers */
        var HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
        var FLOWER_FALLBACK = ["#e8b13f", "#f7f1e1", "#e39aa6"];
        function hexToRgb(h) {
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
          return [
            parseInt(h.substr(0, 2), 16),
            parseInt(h.substr(2, 2), 16),
            parseInt(h.substr(4, 2), 16),
          ];
        }
        function shade(h, amt) {
          var c = hexToRgb(h).map(function (v) {
            return Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
          });
          return "rgb(" + c.join(",") + ")";
        }
        var flowerBtns = [];
        [1, 2, 3].forEach(function (i) {
          var btn = byId("flower-" + i);
          var card = byId("flower-card-" + i);
          var plate = byId("planter-plate-" + i);
          if (!btn || !card) {
            return;
          }
          if (
            !txt(byId("flower-card-" + i + "-name")) &&
            !txt(byId("flower-card-" + i + "-meaning"))
          ) {
            btn.style.visibility = "hidden";
            btn.disabled = true;
            card.style.display = "none";
            if (plate) {
              plate.style.visibility = "hidden";
            }
            return;
          }
          var c = clean(btn.getAttribute("data-color"));
          if (!HEX.test(c)) {
            c = FLOWER_FALLBACK[i - 1];
          }
          btn.style.setProperty("--petal", c);
          btn.style.setProperty("--petal2", shade(c, -0.14));
          btn.addEventListener("click", function () {
            activateFlower(i, true);
          });
          flowerBtns.push({ i: i, btn: btn, card: card });
        });
        if (!flowerBtns.length) {
          hideSection("flowers");
        }
        var flowerTouched = false;
        function activateFlower(i, byUser) {
          if (byUser) {
            flowerTouched = true;
          }
          flowerBtns.forEach(function (f) {
            var on = f.i === i;
            if (on) {
              f.btn.classList.add("is-bloomed");
            }
            f.btn.setAttribute("aria-selected", on ? "true" : "false");
            f.card.classList.toggle("is-active", on);
          });
          byId("flower-cards").classList.add("has-active");
        }
        function autoBloom() {
          if (flowerTouched || !flowerBtns.length) {
            return;
          }
          activateFlower(flowerBtns[0].i, false);
        }
        /* ---------------------------------------------------------------- dress code */
        var swatchCount = 0;
        [1, 2, 3, 4, 5].forEach(function (i) {
          var sw = byId("swatch-" + i);
          if (!sw) {
            return;
          }
          var c = clean(sw.getAttribute("data-color"));
          if (!HEX.test(c)) {
            sw.classList.add("is-empty");
            return;
          }
          swatchCount++;
          byId("swatch-" + i + "-svg").style.color = c;
          sw.setAttribute("aria-label", "Warna busana " + c.toUpperCase());
          sw.addEventListener("click", function () {
            sw.classList.remove("is-picked");
            void sw.offsetWidth;
            sw.classList.add("is-picked");
          });
        });
        if (!swatchCount) {
          byId("dress-swatches").style.display = "none";
        }
        if (!swatchCount && !txt(byId("dress-text"))) {
          hideSection("dresscode");
        }
        /* ---------------------------------------------------------------- live stream */
        var liveLink = byId("live-link");
        var liveUrl = clean(liveLink ? liveLink.getAttribute("href") : "");
        if (!/^https?:\/\//i.test(liveUrl)) {
          hideSection("live");
        } else {
          var ytMatch = liveUrl.match(
            /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
          );
          if (ytMatch) {
            byId("live-embed").setAttribute(
              "src",
              "https://www.youtube.com/embed/" +
                ytMatch[1] +
                "?rel=0&modestbranding=1&playsinline=1",
            );
          } else {
            byId("live-frame").classList.add("no-embed");
          }
          if (!txt(byId("live-note-text"))) {
            byId("live-note").style.display = "none";
          }
        }
        /* ---------------------------------------------------------------- rundown: the flower clock */
        var ICONS = {
          heart: "h-heart",
          users: "h-users",
          utensils: "h-cup",
          camera: "h-camera",
          mic2: "h-mic",
          cake: "h-cake",
          music: "h-note",
          gift: "h-gift",
          "party-popper": "h-sparkle",
          sparkles: "h-sparkle",
          flower2: "i-flower",
          home: "h-home",
          car: "h-car",
          shirt: "h-shirt",
          clock: "i-clock",
          star: "h-star",
        };
        var MARKER_COLORS = [
          "#f2c1c9",
          "#fbf1e4",
          "#e7b75a",
          "#c9b8e6",
          "#b9d4a8",
        ];
        var rdItems = [];
        try {
          var rdRaw = byId("wedivo-rundown-data");
          rdItems = JSON.parse((rdRaw && rdRaw.textContent) || "[]");
        } catch (err) {
          rdItems = [];
        }
        if (!Array.isArray(rdItems)) {
          rdItems = [];
        }
        rdItems = rdItems.filter(function (it) {
          return it && typeof it === "object" && clean(it.title);
        });
        var rdRows = [];
        var handAngle = 0;
        var handTurns = 0;
        function angleFor(t) {
          var m = HHMM.exec(t || "");
          if (!m) {
            return null;
          }
          return (((Number(m[1]) % 12) + Number(m[2]) / 60) / 12) * 360;
        }
        function setRundownActive(idx) {
          var item = rdRows[idx];
          if (!item) {
            return;
          }
          rdRows.forEach(function (r, j) {
            r.row.classList.toggle("is-active", j === idx);
            if (r.marker) {
              r.marker.classList.toggle("is-active", j === idx);
            }
          });
          var cap1 = byId("clock-caption-time");
          var cap2 = byId("clock-caption-title");
          if (cap1) {
            cap1.textContent = item.timeLabel;
          }
          if (cap2) {
            cap2.textContent = item.data.title;
          }
          if (item.angle != null) {
            var target = item.angle + handTurns * 360;
            if (target < handAngle - 180) {
              handTurns++;
              target += 360;
            }
            if (target > handAngle + 180) {
              handTurns--;
              target -= 360;
            }
            handAngle = target;
            byId("clock-hand").style.transform =
              "rotate(" + target.toFixed(1) + "deg)";
          }
        }
        if (!rdItems.length) {
          hideSection("rundown");
        } else {
          var list = byId("rundown-list");
          var markersG = byId("clock-markers");
          var dates = [];
          rdItems.forEach(function (it) {
            if (dates.indexOf(it.date) === -1) {
              dates.push(it.date);
            }
          });
          var multiDay = dates.length > 1;
          var lastDate = null;
          var nowTs = Date.now();
          var nowIdx = -1;
          rdItems.forEach(function (it, i) {
            if (multiDay && it.date !== lastDate) {
              lastDate = it.date;
              var dh = doc.createElement("p");
              dh.id = "rd-day-" + (i + 1);
              dh.className = "rd-day reveal";
              var dd = makeDate(clean(it.date), "00:00");
              dh.textContent = dd ? fmtDate(dd) : clean(it.date);
              list.appendChild(dh);
            }
            var start = normTime(it.startTime);
            var end = normTime(it.endTime);
            var row = doc.createElement("button");
            row.type = "button";
            row.id = "rd-item-" + (i + 1);
            row.className = "rd-item reveal";
            var timeEl = doc.createElement("span");
            timeEl.id = row.id + "-time";
            timeEl.className = "rd-time";
            var small = doc.createElement("small");
            small.id = row.id + "-end";
            if (it.isAllDay || !start) {
              timeEl.textContent = window.TAMAN.words.allDay;
              small.textContent = "";
            } else {
              timeEl.textContent = fmtClock(start);
              small.textContent = end ? "s/d " + fmtClock(end) : tzLabel;
            }
            timeEl.appendChild(small);
            var bodyEl = doc.createElement("span");
            bodyEl.id = row.id + "-body";
            bodyEl.className = "rd-body";
            var title = doc.createElement("span");
            title.id = row.id + "-title";
            title.className = "rd-title";
            var ico = svgUse(ICONS[clean(it.icon)] || "h-leaf", 24);
            ico.id = row.id + "-ico";
            title.appendChild(ico);
            title.appendChild(doc.createTextNode(clean(it.title)));
            bodyEl.appendChild(title);
            if (clean(it.location)) {
              var loc = doc.createElement("span");
              loc.id = row.id + "-loc";
              loc.className = "rd-meta";
              loc.textContent = clean(it.location);
              bodyEl.appendChild(loc);
            }
            if (clean(it.description)) {
              var desc = doc.createElement("span");
              desc.id = row.id + "-desc";
              desc.className = "rd-desc";
              desc.textContent = clean(it.description);
              bodyEl.appendChild(desc);
            }
            row.appendChild(timeEl);
            row.appendChild(bodyEl);
            row.style.setProperty("--d", Math.min(i, 6) * 0.06 + "s");
            list.appendChild(row);
            var angle = it.isAllDay ? null : angleFor(start);
            var marker = null;
            if (angle != null && markersG) {
              var rad = (angle * Math.PI) / 180;
              var mx = 150 + Math.sin(rad) * 88;
              var my = 150 - Math.cos(rad) * 88;
              marker = doc.createElementNS(SVGNS, "g");
              marker.id = "clock-marker-" + (i + 1);
              marker.setAttribute("class", "clock-marker");
              marker.setAttribute(
                "transform",
                "translate(" + mx.toFixed(1) + " " + my.toFixed(1) + ")",
              );
              var dot = doc.createElementNS(SVGNS, "circle");
              dot.setAttribute("r", "10");
              dot.setAttribute("fill", "rgba(255,250,236,.92)");
              dot.setAttribute("stroke", "#b9a578");
              dot.setAttribute("stroke-width", "1");
              var bloomG = doc.createElementNS(SVGNS, "g");
              bloomG.setAttribute("class", "cm-bloom");
              var bu = doc.createElementNS(SVGNS, "use");
              bu.setAttribute("href", "#sym-blossom");
              bu.setAttribute("x", "-10");
              bu.setAttribute("y", "-10");
              bu.setAttribute("width", "20");
              bu.setAttribute("height", "20");
              bu.setAttribute(
                "style",
                "color:" + MARKER_COLORS[i % MARKER_COLORS.length],
              );
              bloomG.appendChild(bu);
              marker.appendChild(dot);
              marker.appendChild(bloomG);
              markersG.appendChild(marker);
            }
            var startDt = makeDate(clean(it.date), start);
            var endDt = makeDate(clean(it.date), end);
            if (
              startDt &&
              endDt &&
              nowTs >= startDt.getTime() &&
              nowTs < endDt.getTime()
            ) {
              nowIdx = i;
            }
            var timeLabel =
              it.isAllDay || !start
                ? window.TAMAN.words.allDay
                : timeRange(start, end).replace("Pukul ", "");
            var entry = {
              row: row,
              marker: marker,
              angle: angle,
              data: { title: clean(it.title) },
              timeLabel: timeLabel,
            };
            rdRows.push(entry);
            (function (idx) {
              row.addEventListener("click", function () {
                setRundownActive(idx);
              });
              if (marker) {
                marker.addEventListener("click", function () {
                  setRundownActive(idx);
                });
              }
            })(rdRows.length - 1);
          });
          if (nowIdx >= 0) {
            var nowRow = rdRows[nowIdx].row;
            nowRow.classList.add("is-now");
            var badge = doc.createElement("span");
            badge.id = "rd-now-badge";
            badge.className = "rd-now";
            badge.textContent = window.TAMAN.words.now;
            nowRow.querySelector(".rd-title").appendChild(badge);
          }
          setRundownActive(nowIdx >= 0 ? nowIdx : 0);
        }
        /* ---------------------------------------------------------------- gallery: the glasshouse */
        var galleryUrls = window.TAMAN.data.gallery.map(function (item) { return item.src; });
        var grid = byId("gallery-grid");
        var panes = [];
        if (!galleryUrls.length) {
          hideSection("gallery");
        } else if (grid) {
          galleryUrls.forEach(function (url, i) {
            var pane = doc.createElement("button");
            pane.type = "button";
            pane.id = "pane-" + (i + 1);
            pane.className = "pane";
            pane.setAttribute("aria-label", window.TAMAN.words.photo + " " + (i + 1));
            var img = doc.createElement("img");
            img.id = pane.id + "-img";
            img.className = "pane-img";
            img.src = url;
            img.alt = window.TAMAN.data.gallery[i].alt || "";
            img.loading = "lazy";
            img.decoding = "async";
            var fog = doc.createElement("span");
            fog.id = pane.id + "-fog";
            fog.className = "pane-fog";
            var glass = doc.createElement("span");
            glass.id = pane.id + "-glass";
            glass.className = "pane-glass";
            pane.appendChild(img);
            pane.appendChild(fog);
            pane.appendChild(glass);
            pane.addEventListener("click", function () {
              showViewer(i);
            });
            grid.appendChild(pane);
            panes.push(pane);
          });
        }
        /* ---------------------------------------------------------------- photo viewer */
        var viewer = byId("viewer");
        var viewerImg = byId("viewer-img");
        var viewerCount = byId("viewer-count");
        var viewerCap = byId("viewer-cap");
        var viewerIndex = 0;
        var lastFocus = null;
        function showViewer(index) {
          if (!galleryUrls.length || !viewer) {
            return;
          }
          viewerIndex = (index + galleryUrls.length) % galleryUrls.length;
          var url = galleryUrls[viewerIndex];
          viewerImg.classList.add("is-swapping");
          var pre = new Image();
          pre.onload = pre.onerror = function () {
            viewerImg.src = url; viewerImg.alt = window.TAMAN.data.gallery[viewerIndex].alt || "";
            viewerImg.classList.remove("is-swapping");
          };
          pre.src = url;
          viewerCount.textContent =
            viewerIndex + 1 + " / " + galleryUrls.length;
          viewerCap.textContent =
            (window.TAMAN.data.gallery[viewerIndex].caption || "");
          viewer.classList.toggle("is-single", galleryUrls.length <= 1);
          if (!viewer.classList.contains("is-open")) {
            lastFocus = doc.activeElement;
            viewer.classList.add("is-open");
            viewer.setAttribute("aria-hidden", "false");
            body.classList.add("is-locked");
            var closeBtn = byId("viewer-close");
            if (closeBtn) {
              closeBtn.focus({ preventScroll: true });
            }
          }
        }
        function closeViewer() {
          if (!viewer || !viewer.classList.contains("is-open")) {
            return;
          }
          viewer.classList.remove("is-open");
          viewer.setAttribute("aria-hidden", "true");
          if (body.classList.contains("is-open")) {
            body.classList.remove("is-locked");
          }
          if (lastFocus && lastFocus.focus) {
            lastFocus.focus({ preventScroll: true });
          }
        }
        if (viewer) {
          byId("viewer-prev").addEventListener("click", function () {
            showViewer(viewerIndex - 1);
          });
          byId("viewer-next").addEventListener("click", function () {
            showViewer(viewerIndex + 1);
          });
          byId("viewer-close").addEventListener("click", closeViewer);
          byId("viewer-backdrop").addEventListener("click", closeViewer);
          var touchX = null;
          viewer.addEventListener(
            "touchstart",
            function (e) {
              touchX = e.touches[0].clientX;
            },
            { passive: true },
          );
          viewer.addEventListener(
            "touchend",
            function (e) {
              if (touchX == null) {
                return;
              }
              var dx = e.changedTouches[0].clientX - touchX;
              touchX = null;
              if (Math.abs(dx) > 44) {
                showViewer(viewerIndex + (dx < 0 ? 1 : -1));
              }
            },
            { passive: true },
          );
          doc.addEventListener("keydown", function (e) {
            if (!viewer.classList.contains("is-open")) {
              return;
            }
            if (e.key === "Escape") {
              closeViewer();
            }
            if (e.key === "ArrowLeft") {
              showViewer(viewerIndex - 1);
            }
            if (e.key === "ArrowRight") {
              showViewer(viewerIndex + 1);
            }
          });
        }
        /* ---------------------------------------------------------------- the mossy stone */
        var stone = byId("secret-stone");
        var ground = byId("secret-ground");
        var lifted = false;
        function liftStone() {
          if (lifted || !stone) {
            return;
          }
          lifted = true;
          stone.classList.remove("is-dragging");
          stone.style.removeProperty("--sy");
          stone.style.removeProperty("--sr");
          var letter = byId("secret-letter");
          if (letter) {
            letter.style.maxHeight = letter.scrollHeight + 40 + "px";
            setTimeout(
              function () {
                letter.style.maxHeight = "none";
              },
              reduceMotion ? 50 : 2000,
            );
          }
          ground.classList.add("is-lifted");
          stone.setAttribute("aria-expanded", "true");
          byId("sec-secret").classList.add("is-found");
          showToast(window.TAMAN.words.secretFound);
          burst(18);
        }
        if (stone && ground) {
          var dragStart = null;
          var dragMoved = 0;
          stone.addEventListener("pointerdown", function (e) {
            if (lifted) {
              return;
            }
            dragStart = e.clientY;
            dragMoved = 0;
            try {
              stone.setPointerCapture(e.pointerId);
            } catch (err) {
              /* capture is optional */
            }
          });
          stone.addEventListener("pointermove", function (e) {
            if (dragStart == null || lifted) {
              return;
            }
            var dy = Math.min(0, e.clientY - dragStart);
            dragMoved = Math.max(dragMoved, Math.abs(e.clientY - dragStart));
            stone.classList.add("is-dragging");
            stone.style.setProperty("--sy", dy.toFixed(1) + "px");
            stone.style.setProperty("--sr", (dy * -0.05).toFixed(2) + "deg");
            if (dy < -64) {
              dragStart = null;
              liftStone();
            }
          });
          var endDrag = function () {
            if (dragStart == null) {
              return;
            }
            dragStart = null;
            stone.classList.remove("is-dragging");
            if (!lifted) {
              stone.style.removeProperty("--sy");
              stone.style.removeProperty("--sr");
            }
          };
          stone.addEventListener("pointerup", endDrag);
          stone.addEventListener("pointercancel", endDrag);
          stone.addEventListener("click", function () {
            if (dragMoved < 8) {
              liftStone();
            }
            dragMoved = 0;
          });
        }
        /* ---------------------------------------------------------------- forms: gentle follow-ups */
        var rsvpEdit = byId("rsvp-edit");
        if (rsvpEdit) {
          rsvpEdit.addEventListener("click", function () {
            byId("rsvp-form").classList.remove("is-submitted");
          });
        }
        if (window.MutationObserver) {
          [
            ["wish-form", 5200],
            ["gift-form", 7000],
          ].forEach(function (pair) {
            var form = byId(pair[0]);
            if (!form) {
              return;
            }
            var t = 0;
            new MutationObserver(function () {
              if (form.classList.contains("is-submitted")) {
                clearTimeout(t);
                t = setTimeout(function () {
                  form.classList.remove("is-submitted");
                }, pair[1]);
              }
            }).observe(form, { attributes: true, attributeFilter: ["class"] });
          });
        }
        /* ---------------------------------------------------------------- music */
        var playMusic = window.TAMAN.playMusic;
        /* ---------------------------------------------------------------- toast + discovery */
        var toast = byId("found-toast");
        var toastTimer = 0;
        function showToast(message) {
          if (!toast) {
            return;
          }
          byId("found-toast-text").textContent = message;
          toast.classList.add("is-show");
          clearTimeout(toastTimer);
          toastTimer = setTimeout(function () {
            toast.classList.remove("is-show");
          }, 3400);
        }
        var rail = byId("path-rail");
        var countEl = byId("path-count");
        var found = {};
        var allFoundShown = false;
        function visibleNavItems() {
          return rail
            ? all("[data-nav-target]", rail).filter(function (b) {
                return !isHidden(b);
              })
            : [];
        }
        function updateCount(pop) {
          var items = visibleNavItems();
          var n = items.filter(function (b) {
            return found[b.getAttribute("data-nav-target")];
          }).length;
          byId("path-found").textContent = String(n);
          byId("path-total").textContent = String(items.length);
          if (pop && countEl) {
            countEl.classList.remove("is-pop");
            void countEl.offsetWidth;
            countEl.classList.add("is-pop");
          }
          if (
            !allFoundShown &&
            items.length &&
            n === items.length &&
            body.classList.contains("is-open")
          ) {
            allFoundShown = true;
            setTimeout(function () {
              showToast(
                window.TAMAN.words.allFound,
              );
              burst(40);
            }, 600);
          }
        }
        function markFound(id) {
          if (!id || found[id]) {
            return;
          }
          found[id] = true;
          var item = navItemFor(id);
          if (item) {
            item.classList.add("is-found");
          }
          updateCount(true);
        }
        /* ---------------------------------------------------------------- chapter numbering (after any reorder) */
        var ROMAN = [
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
          "XII",
          "XIII",
          "XIV",
          "XV",
          "XVI",
          "XVII",
          "XVIII",
          "XIX",
          "XX",
        ];
        function numberChapters() {
          var n = 0;
          all("[data-section]").forEach(function (sec) {
            var num = sec.querySelector(".bab-num");
            if (!num || isHidden(sec)) {
              return;
            }
            num.textContent = ROMAN[n] || String(n + 1);
            n++;
          });
        }
        /* ---------------------------------------------------------------- enter animations */
        var heroRegion = byId("sec-hero");
        var heroRevealed = false;
        function revealHero() {
          if (heroRevealed || !heroRegion) {
            return;
          }
          heroRevealed = true;
          heroRegion.classList.add("in-view");
          markFound("hero");
        }
        var regions = all("body > header, body > section, body > footer");
        var revealEls = all(".reveal").filter(function (el) {
          return !heroRegion || !heroRegion.contains(el);
        });
        function onRegionSeen(region) {
          region.classList.add("is-seen");
          markFound(region.getAttribute("data-section"));
          if (region.id === "sec-flowers") {
            setTimeout(autoBloom, 1100);
          }
        }
        var io = null;
        var paneIO = null;
        if ("IntersectionObserver" in window) {
          io = new IntersectionObserver(
            function (entries, observer) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                  return;
                }
                observer.unobserve(entry.target);
                if (entry.target.hasAttribute("data-section")) {
                  onRegionSeen(entry.target);
                } else {
                  entry.target.classList.add("in-view");
                }
              });
            },
            { threshold: 0, rootMargin: "0px 0px -33% 0px" },
          );
          revealEls.forEach(function (el) {
            io.observe(el);
          });
          regions.forEach(function (r) {
            if (r.id === "sec-cover" || r === heroRegion) {
              return;
            }
            io.observe(r);
          });
          all(".rd-item, .rd-day").forEach(function (el) {
            if (revealEls.indexOf(el) === -1) {
              revealEls.push(el);
              io.observe(el);
            }
          });
          paneIO = new IntersectionObserver(
            function (entries, observer) {
              entries.forEach(function (entry) {
                if (!entry.isIntersecting) {
                  return;
                }
                observer.unobserve(entry.target);
                var idx = panes.indexOf(entry.target);
                setTimeout(
                  function () {
                    entry.target.classList.add("is-clear");
                  },
                  reduceMotion ? 0 : 160 + (idx % 4) * 170,
                );
              });
            },
            { threshold: 0, rootMargin: "0px 0px -22% 0px" },
          );
          panes.forEach(function (p) {
            paneIO.observe(p);
          });
        } else {
          regions.forEach(function (r) {
            if (r.id === "sec-cover" || r === heroRegion) {
              return;
            }
            r.classList.add("in-view");
            onRegionSeen(r);
          });
          revealEls.forEach(function (el) {
            el.classList.add("in-view");
          });
          panes.forEach(function (p) {
            p.classList.add("is-clear");
          });
        }
        function releaseBottom() {
          if (
            window.innerHeight + window.pageYOffset <
            doc.documentElement.scrollHeight - 4
          ) {
            return;
          }
          revealEls.forEach(function (el) {
            if (!el.classList.contains("in-view")) {
              el.classList.add("in-view");
              if (io) {
                io.unobserve(el);
              }
            }
          });
          regions.forEach(function (r) {
            if (
              r.id === "sec-cover" ||
              r === heroRegion ||
              r.classList.contains("is-seen") ||
              isHidden(r)
            ) {
              return;
            }
            if (io) {
              io.unobserve(r);
            }
            onRegionSeen(r);
          });
          panes.forEach(function (p) {
            p.classList.add("is-clear");
          });
        }
        /* ---------------------------------------------------------------- navigation: stepping stones */
        var activeId = null;
        var navLockUntil = 0;
        var centerTimer = 0;
        function centerRail(id, smooth) {
          if (!rail) {
            return;
          }
          var item = rail.querySelector('[data-nav-target="' + id + '"]');
          if (!item || rail.scrollWidth <= rail.clientWidth + 1) {
            return;
          }
          var rr = rail.getBoundingClientRect();
          var ir = item.getBoundingClientRect();
          var target =
            rail.scrollLeft +
            (ir.left - rr.left - rail.clientLeft) -
            (rail.clientWidth - ir.width) / 2;
          target = clamp(target, 0, rail.scrollWidth - rail.clientWidth);
          if (Math.abs(target - rail.scrollLeft) < 2) {
            return;
          }
          rail.scrollTo({
            left: target,
            behavior: smooth && !reduceMotion ? "smooth" : "auto",
          });
        }
        function setActive(id, immediate) {
          if (!id) {
            return;
          }
          if (id === activeId) {
            if (immediate) {
              clearTimeout(centerTimer);
              centerRail(id, true);
            }
            return;
          }
          activeId = id;
          all("[data-nav-target]", rail).forEach(function (b) {
            b.classList.toggle(
              "is-active",
              b.getAttribute("data-nav-target") === id,
            );
          });
          markFound(id);
          clearTimeout(centerTimer);
          if (immediate) {
            centerRail(id, true);
          } else {
            centerTimer = setTimeout(function () {
              centerRail(id, true);
            }, 180);
          }
        }
        function computeActive() {
          var items = visibleNavItems();
          if (!items.length) {
            return null;
          }
          var line = window.innerHeight * 0.35;
          var current = items[0].getAttribute("data-nav-target");
          items.forEach(function (item) {
            var sec = sectionEl(item.getAttribute("data-nav-target"));
            if (!sec || isHidden(sec)) {
              return;
            }
            if (sec.getBoundingClientRect().top <= line) {
              current = item.getAttribute("data-nav-target");
            }
          });
          if (
            window.innerHeight + window.pageYOffset >=
            doc.documentElement.scrollHeight - 4
          ) {
            current = items[items.length - 1].getAttribute("data-nav-target");
          }
          return current;
        }
        var nav = byId("garden-path");
        if (nav) {
          nav.addEventListener("click", function (e) {
            var item =
              e.target && e.target.closest
                ? e.target.closest("[data-nav-target]")
                : null;
            if (!item) {
              return;
            }
            e.preventDefault();
            var id = item.getAttribute("data-nav-target");
            var sec = sectionEl(id);
            if (!sec || isHidden(sec)) {
              return;
            }
            navLockUntil = Date.now() + 1200;
            setActive(id, true);
            var top = sec.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
              top: Math.max(0, top),
              behavior: reduceMotion ? "auto" : "smooth",
            });
          });
        }
        function scrollToSection(sec) {
          if (!sec) {
            return;
          }
          window.scrollTo({
            top: sec.getBoundingClientRect().top + window.pageYOffset,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        }
        var cue = byId("hero-cue");
        if (cue) {
          cue.addEventListener("click", function () {
            var next = heroRegion ? heroRegion.nextElementSibling : null;
            while (
              next &&
              (!next.hasAttribute("data-section") || isHidden(next))
            ) {
              next = next.nextElementSibling;
            }
            scrollToSection(next);
          });
        }
        var topBtn = byId("closing-top");
        if (topBtn) {
          topBtn.addEventListener("click", function () {
            window.scrollTo({
              top: 0,
              behavior: reduceMotion ? "auto" : "smooth",
            });
          });
        }
        /* ---------------------------------------------------------------- the air: morning → golden hour → dusk */
        var ambNoon = byId("amb-noon");
        var ambDusk = byId("amb-dusk");
        var ambRays = byId("amb-rays");
        var closingSec = byId("sec-closing");
        var closingGate = byId("closing-gate");
        var heroPhoto = byId("hero-photo");
        var duskAmt = 0;
        function updateAir() {
          var vh = window.innerHeight;
          var max = Math.max(1, doc.documentElement.scrollHeight - vh);
          var p = window.pageYOffset / max;
          if (ambNoon) {
            ambNoon.style.opacity = ease(0.1, 0.72, p).toFixed(3);
          }
          duskAmt = 0;
          if (closingSec && !isHidden(closingSec)) {
            var r = closingSec.getBoundingClientRect();
            duskAmt =
              ease(vh * 1.05, vh * 0.15, r.top) *
              ease(-vh * 0.1, vh * 0.35, r.bottom);
          }
          if (ambDusk) {
            ambDusk.style.opacity = duskAmt.toFixed(3);
          }
          if (ambRays) {
            ambRays.style.opacity = ((1 - duskAmt) * 0.55).toFixed(3);
          }
          if (
            heroPhoto &&
            !reduceMotion &&
            window.innerWidth < 1024 &&
            window.pageYOffset < vh * 1.3
          ) {
            heroPhoto.style.setProperty(
              "--par",
              (window.pageYOffset * 0.28).toFixed(1) + "px",
            );
          }
          if (closingGate) {
            var gr = closingGate.getBoundingClientRect();
            var shut = reduceMotion ? 1 : ease(vh * 0.98, vh * 0.5, gr.top);
            closingGate.style.setProperty(
              "--gate-open",
              (72 * (1 - shut)).toFixed(1) + "deg",
            );
          }
        }
        var ticking = false;
        function frame() {
          ticking = false;
          updateAir();
          updateVine();
          if (body.classList.contains("is-open") && Date.now() > navLockUntil) {
            var id = computeActive();
            if (id) {
              setActive(id, false);
            }
          }
          releaseBottom();
        }
        function onScroll() {
          if (ticking) {
            return;
          }
          ticking = true;
          window.requestAnimationFrame(frame);
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", function () {
          scheduleVine();
          onScroll();
          if (activeId) {
            clearTimeout(centerTimer);
            centerTimer = setTimeout(function () {
              centerRail(activeId, false);
            }, 200);
          }
        });
        /* ---------------------------------------------------------------- particles: pollen by day, fireflies at dusk */
        var burst = function () {};
        (function particles() {
          var canvas = byId("amb-canvas");
          var ctx =
            canvas && canvas.getContext ? canvas.getContext("2d") : null;
          if (!ctx) {
            return;
          }
          var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
          var W = 0;
          var H = 0;
          var parts = [];
          var running = false;
          var raf = 0;
          var pointer = { x: -999, y: -999 };
          function resize() {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = Math.round(W * dpr);
            canvas.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          }
          function spawn(p, initial, kind) {
            p.kind = kind != null ? kind : Math.random() < 0.7 ? 0 : 1;
            p.x = Math.random() * W;
            p.y = initial ? Math.random() * H : p.kind === 1 ? -16 : H + 16;
            p.r =
              p.kind === 1
                ? 3.6 + Math.random() * 3.4
                : 0.9 + Math.random() * 1.8;
            p.vx = (Math.random() - 0.5) * 0.3;
            p.vy =
              p.kind === 1
                ? 0.35 + Math.random() * 0.45
                : -(0.12 + Math.random() * 0.28);
            p.rot = Math.random() * 6.283;
            p.vr = (Math.random() - 0.5) * 0.04;
            p.ph = Math.random() * 6.283;
            p.tint = Math.random();
            return p;
          }
          function draw() {
            ctx.clearRect(0, 0, W, H);
            var dk = duskAmt;
            for (var i = 0; i < parts.length; i++) {
              var p = parts[i];
              p.ph += 0.018;
              p.x += p.vx + Math.sin(p.ph) * 0.28;
              p.y += p.vy;
              p.rot += p.vr;
              var dx = p.x - pointer.x;
              var dy = p.y - pointer.y;
              var dist = dx * dx + dy * dy;
              if (dist < 8100) {
                var push = (8100 - dist) / 8100;
                p.x += (dx / 90) * push * 2.2;
                p.y += (dy / 90) * push * 2.2;
              }
              if (p.y < -30 || p.y > H + 30 || p.x < -30 || p.x > W + 30) {
                if (p.burst) {
                  parts.splice(i, 1);
                  i--;
                  continue;
                }
                spawn(p, false);
              }
              if (p.kind === 0) {
                var tw = 0.45 + 0.4 * Math.sin(p.ph * 2.1 + p.tint * 6);
                var cr = Math.round(255 - dk * 40);
                var cg = Math.round(246 - dk * 10);
                var cb = Math.round(214 - dk * 110);
                ctx.globalAlpha = (0.1 + dk * 0.14) * tw;
                ctx.fillStyle = "rgb(" + cr + "," + cg + "," + cb + ")";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (3.2 + dk * 2), 0, 6.283);
                ctx.fill();
                ctx.globalAlpha = (0.5 + dk * 0.45) * tw;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 6.283);
                ctx.fill();
              } else {
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.scale(1, 0.45 + 0.4 * Math.abs(Math.sin(p.ph * 1.6)));
                ctx.globalAlpha = 0.72 * (1 - dk * 0.6);
                ctx.fillStyle =
                  p.tint < 0.55
                    ? "#f3c3cb"
                    : p.tint < 0.8
                      ? "#fbf1e2"
                      : "#d9c9ee";
                ctx.beginPath();
                ctx.ellipse(0, 0, p.r, p.r * 0.62, 0, 0, 6.283);
                ctx.fill();
                ctx.restore();
              }
            }
            ctx.globalAlpha = 1;
            if (running) {
              raf = window.requestAnimationFrame(draw);
            }
          }
          function start() {
            if (running || reduceMotion) {
              return;
            }
            running = true;
            raf = window.requestAnimationFrame(draw);
          }
          function stop() {
            running = false;
            window.cancelAnimationFrame(raf);
          }
          resize();
          var count = W < 640 ? 34 : 56;
          for (var i = 0; i < count; i++) {
            parts.push(spawn({}, true));
          }
          if (reduceMotion) {
            draw();
          } else {
            start();
          }
          doc.addEventListener("visibilitychange", function () {
            if (doc.hidden) {
              stop();
            } else {
              start();
            }
          });
          window.addEventListener("resize", function () {
            resize();
            if (reduceMotion) {
              draw();
            }
          });
          window.addEventListener(
            "pointermove",
            function (e) {
              if (e.pointerType !== "mouse") {
                return;
              }
              pointer.x = e.clientX;
              pointer.y = e.clientY;
            },
            { passive: true },
          );
          burst = function (n) {
            if (reduceMotion) {
              return;
            }
            for (var k = 0; k < n; k++) {
              var p = spawn({}, false, 1);
              p.x = W * (0.3 + Math.random() * 0.4);
              p.y = H * 0.85;
              p.vy = -(1.6 + Math.random() * 2.2);
              p.vx = (Math.random() - 0.5) * 2.6;
              p.burst = true;
              parts.push(p);
            }
            var decay = setInterval(function () {
              var any = false;
              parts.forEach(function (p) {
                if (p.burst) {
                  any = true;
                  p.vy = Math.min(0.8, p.vy + 0.07);
                  p.vx *= 0.98;
                }
              });
              if (!any) {
                clearInterval(decay);
              }
            }, 60);
          };
        })();
        /* ---------------------------------------------------------------- the gate */
        var cover = byId("sec-cover");
        var openBtn = byId("gate-open");
        var gateOpened = false;
        function finishCover(instant) {
          if (!cover) {
            revealHero();
            return;
          }
          cover.classList.add("is-gone");
          body.classList.remove("is-locked");
          body.classList.add("is-open");
          if (instant) {
            revealHero();
          }
          if (window.pageYOffset > 2) {
            window.scrollTo(0, 0);
          }
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
          setTimeout(onGone, instant ? 700 : 1700);
          numberChapters();
          updateCount(false);
          setTimeout(function () {
            setActive(computeActive() || "hero", true);
            frame();
          }, 80);
        }
        function openGate() {
          if (gateOpened) {
            return;
          }
          gateOpened = true;
          playMusic();
          if (reduceMotion) {
            finishCover(true);
            return;
          }
          var opening = byId("gate-opening");
          var scene = byId("cover-scene");
          if (opening && scene) {
            var or = opening.getBoundingClientRect();
            scene.style.transformOrigin =
              (or.left + or.width / 2).toFixed(1) +
              "px " +
              (or.top + or.height * 0.64).toFixed(1) +
              "px";
          }
          cover.classList.add("is-turning");
          setTimeout(function () {
            cover.classList.add("is-open");
          }, 950);
          setTimeout(function () {
            cover.classList.add("is-enter");
          }, 1800);
          setTimeout(revealHero, 2080);
          setTimeout(function () {
            finishCover(false);
          }, 2380);
        }
        if (openBtn && cover && !isHidden(cover)) {
          openBtn.addEventListener("click", openGate);
        } else {
          finishCover(true);
        }
        /* ---------------------------------------------------------------- settle once every script (incl. reorder) has run */
        function settle() {
          if (cover && isHidden(cover) && !body.classList.contains("is-open")) {
            finishCover(true);
          }
          numberChapters();
          updateCount(false);
          scheduleVine();
          frame();
        }
        if (doc.readyState === "loading") {
          doc.addEventListener("DOMContentLoaded", settle);
        } else {
          setTimeout(settle, 0);
        }
        window.addEventListener("load", function () {
          scheduleVine();
          frame();
        });
        if (doc.fonts && doc.fonts.ready) {
          doc.fonts.ready.then(scheduleVine);
        }
      })();
    