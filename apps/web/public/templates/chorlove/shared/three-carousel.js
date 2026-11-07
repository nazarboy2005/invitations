/* Embla core and Autoplay extracted unchanged from the captured template module.
 * React hook and provider module registration are intentionally excluded. */
(()=>{
    function n(e) {
      return (
        "[object Object]" === Object.prototype.toString.call(e) ||
        Array.isArray(e)
      );
    }
    function r(e, t) {
      let a = Object.keys(e),
        i = Object.keys(t);
      return (
        a.length === i.length &&
        JSON.stringify(Object.keys(e.breakpoints || {})) ===
          JSON.stringify(Object.keys(t.breakpoints || {})) &&
        a.every((a) => {
          let i = e[a],
            s = t[a];
          return "function" == typeof i
            ? `${i}` == `${s}`
            : n(i) && n(s)
              ? r(i, s)
              : i === s;
        })
      );
    }
    function a(e) {
      return e
        .concat()
        .sort((e, t) => (e.name > t.name ? 1 : -1))
        .map((e) => e.options);
    }
    function i(e) {
      return "number" == typeof e;
    }
    function s(e) {
      return "string" == typeof e;
    }
    function l(e) {
      return "boolean" == typeof e;
    }
    function o(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
    function c(e) {
      return Math.abs(e);
    }
    function u(e) {
      return Math.sign(e);
    }
    function d(e) {
      return x(e).map(Number);
    }
    function f(e) {
      return e[m(e)];
    }
    function m(e) {
      return Math.max(0, e.length - 1);
    }
    function p(e, t = 0) {
      return Array.from(Array(e), (e, n) => t + n);
    }
    function x(e) {
      return Object.keys(e);
    }
    function h(e, t) {
      return void 0 !== t.MouseEvent && e instanceof t.MouseEvent;
    }
    function g() {
      let e = [],
        t = {
          add: function (n, r, a, i = { passive: !0 }) {
            let s;
            return (
              "addEventListener" in n
                ? (n.addEventListener(r, a, i),
                  (s = () => n.removeEventListener(r, a, i)))
                : (n.addListener(a), (s = () => n.removeListener(a))),
              e.push(s),
              t
            );
          },
          clear: function () {
            e = e.filter((e) => e());
          },
        };
      return t;
    }
    function b(e = 0, t = 0) {
      let n = c(e - t);
      function r(n) {
        return n < e || n > t;
      }
      return {
        length: n,
        max: t,
        min: e,
        constrain: function (n) {
          return r(n) ? (n < e ? e : t) : n;
        },
        reachedAny: r,
        reachedMax: function (e) {
          return e > t;
        },
        reachedMin: function (t) {
          return t < e;
        },
        removeOffset: function (e) {
          return n ? e - n * Math.ceil((e - t) / n) : e;
        },
      };
    }
    function y(e) {
      let t = e;
      function n(e) {
        return i(e) ? e : e.get();
      }
      return {
        get: function () {
          return t;
        },
        set: function (e) {
          t = n(e);
        },
        add: function (e) {
          t += n(e);
        },
        subtract: function (e) {
          t -= n(e);
        },
      };
    }
    function v(e, t) {
      let n =
          "x" === e.scroll
            ? function (e) {
                return `translate3d(${e}px,0px,0px)`;
              }
            : function (e) {
                return `translate3d(0px,${e}px,0px)`;
              },
        r = t.style,
        a = null,
        i = !1;
      return {
        clear: function () {
          !i &&
            ((r.transform = ""),
            t.getAttribute("style") || t.removeAttribute("style"));
        },
        to: function (t) {
          if (i) return;
          let s = Math.round(100 * e.direction(t)) / 100;
          s !== a && ((r.transform = n(s)), (a = s));
        },
        toggleActive: function (e) {
          i = !e;
        },
      };
    }
    let w = {
      align: "center",
      axis: "x",
      container: null,
      slides: null,
      containScroll: "trimSnaps",
      direction: "ltr",
      slidesToScroll: 1,
      inViewThreshold: 0,
      breakpoints: {},
      dragFree: !1,
      dragThreshold: 10,
      loop: !1,
      skipSnaps: !1,
      duration: 25,
      startIndex: 0,
      active: !0,
      watchDrag: !0,
      watchResize: !0,
      watchSlides: !0,
      watchFocus: !0,
    };
    function j(e, t, n) {
      let r,
        a,
        N,
        k,
        S,
        E,
        C,
        T,
        I = e.ownerDocument,
        z = I.defaultView,
        O = (function (e) {
          function t(e, t) {
            return (function e(t, n) {
              return [t, n].reduce(
                (t, n) => (
                  x(n).forEach((r) => {
                    let a = t[r],
                      i = n[r],
                      s = o(a) && o(i);
                    t[r] = s ? e(a, i) : i;
                  }),
                  t
                ),
                {},
              );
            })(e, t || {});
          }
          return {
            mergeOptions: t,
            optionsAtMedia: function (n) {
              let r = n.breakpoints || {},
                a = x(r)
                  .filter((t) => e.matchMedia(t).matches)
                  .map((e) => r[e])
                  .reduce((e, n) => t(e, n), {});
              return t(n, a);
            },
            optionsMediaQueries: function (t) {
              return t
                .map((e) => x(e.breakpoints || {}))
                .reduce((e, t) => e.concat(t), [])
                .map(e.matchMedia);
            },
          };
        })(z),
        M =
          ((T = []),
          {
            init: function (e, t) {
              return (
                (T = t.filter(
                  ({ options: e }) => !1 !== O.optionsAtMedia(e).active,
                )).forEach((t) => t.init(e, O)),
                t.reduce((e, t) => Object.assign(e, { [t.name]: t }), {})
              );
            },
            destroy: function () {
              T = T.filter((e) => e.destroy());
            },
          }),
        A = g(),
        D =
          ((a = {}),
          (N = {
            init: function (e) {
              r = e;
            },
            emit: function (e) {
              return ((a[e] || []).forEach((t) => t(r, e)), N);
            },
            off: function (e, t) {
              return ((a[e] = (a[e] || []).filter((e) => e !== t)), N);
            },
            on: function (e, t) {
              return ((a[e] = (a[e] || []).concat([t])), N);
            },
            clear: function () {
              a = {};
            },
          })),
        { mergeOptions: $, optionsAtMedia: L, optionsMediaQueries: _ } = O,
        { on: P, off: R, emit: F } = D,
        U = !1,
        V = $(w, j.globalOptions),
        G = $(V),
        B = [];
      function H(t, n) {
        U ||
          ((G = L((V = $(V, t)))),
          (B = n || B),
          (function () {
            let { container: t, slides: n } = G;
            E = (s(t) ? e.querySelector(t) : t) || e.children[0];
            let r = s(n) ? E.querySelectorAll(n) : n;
            C = [].slice.call(r || E.children);
          })(),
          (k = (function t(n) {
            let r = (function (e, t, n, r, a, o, w) {
              var j, N;
              let k,
                S,
                E,
                C,
                T,
                I,
                z,
                O,
                M,
                A,
                D,
                $,
                L,
                _,
                {
                  align: P,
                  axis: R,
                  direction: F,
                  startIndex: U,
                  loop: V,
                  duration: G,
                  dragFree: B,
                  dragThreshold: H,
                  inViewThreshold: q,
                  slidesToScroll: W,
                  skipSnaps: Y,
                  containScroll: J,
                  watchResize: X,
                  watchSlides: K,
                  watchDrag: Q,
                  watchFocus: Z,
                } = o,
                ee = {
                  measure: function (e) {
                    let {
                      offsetTop: t,
                      offsetLeft: n,
                      offsetWidth: r,
                      offsetHeight: a,
                    } = e;
                    return {
                      top: t,
                      right: n + r,
                      bottom: t + a,
                      left: n,
                      width: r,
                      height: a,
                    };
                  },
                },
                et = ee.measure(t),
                en = n.map(ee.measure),
                er =
                  ((S = "rtl" === F),
                  (C = (E = "y" === R) || !S ? 1 : -1),
                  (T = E ? "top" : S ? "right" : "left"),
                  (I = E ? "bottom" : S ? "left" : "right"),
                  {
                    scroll: E ? "y" : "x",
                    cross: E ? "x" : "y",
                    startEdge: T,
                    endEdge: I,
                    measureSize: function (e) {
                      let { height: t, width: n } = e;
                      return E ? t : n;
                    },
                    direction: function (e) {
                      return e * C;
                    },
                  }),
                ea = er.measureSize(et),
                ei = {
                  measure: function (e) {
                    return (e / 100) * ea;
                  },
                },
                es =
                  ((j = P),
                  (N = ea),
                  (k = {
                    start: function () {
                      return 0;
                    },
                    center: function (e) {
                      return (N - e) / 2;
                    },
                    end: function (e) {
                      return N - e;
                    },
                  }),
                  {
                    measure: function (e, t) {
                      return s(j) ? k[j](e) : j(N, e, t);
                    },
                  }),
                el = !V && !!J,
                {
                  slideSizes: eo,
                  slideSizesWithGaps: ec,
                  startGap: eu,
                  endGap: ed,
                } = (function (e, t, n, r, a, i) {
                  let { measureSize: s, startEdge: l, endEdge: o } = e,
                    u = n[0] && a,
                    d = (function () {
                      if (!u) return 0;
                      let e = n[0];
                      return c(t[l] - e[l]);
                    })(),
                    p = u
                      ? parseFloat(
                          i
                            .getComputedStyle(f(r))
                            .getPropertyValue(`margin-${o}`),
                        )
                      : 0,
                    x = n.map(s),
                    h = n
                      .map((e, t, n) => {
                        let r = t === m(n);
                        return t
                          ? r
                            ? x[t] + p
                            : n[t + 1][l] - e[l]
                          : x[t] + d;
                      })
                      .map(c);
                  return {
                    slideSizes: x,
                    slideSizesWithGaps: h,
                    startGap: d,
                    endGap: p,
                  };
                })(er, et, en, n, V || !!J, a),
                ef = (function (e, t, n, r, a, s, l, o) {
                  let { startEdge: u, endEdge: p, direction: x } = e,
                    h = i(n);
                  return {
                    groupSlides: function (e) {
                      return h
                        ? d(e)
                            .filter((e) => e % n == 0)
                            .map((t) => e.slice(t, t + n))
                        : e.length
                          ? d(e)
                              .reduce((n, i, d) => {
                                let h = f(n) || 0,
                                  g = i === m(e),
                                  b = a[u] - s[h][u],
                                  y = a[u] - s[i][p],
                                  v = r || 0 !== h ? 0 : x(l),
                                  w = c(y - (!r && g ? x(o) : 0) - (b + v));
                                return (
                                  d && w > t + 2 && n.push(i),
                                  g && n.push(e.length),
                                  n
                                );
                              }, [])
                              .map((t, n, r) => {
                                let a = Math.max(r[n - 1] || 0);
                                return e.slice(a, t);
                              })
                          : [];
                    },
                  };
                })(er, ea, W, V, et, en, eu, ed),
                { snaps: em, snapsAligned: ep } = (function (e, t, n, r, a) {
                  let { startEdge: i, endEdge: s } = e,
                    { groupSlides: l } = a,
                    o = l(r)
                      .map((e) => f(e)[s] - e[0][i])
                      .map(c)
                      .map(t.measure),
                    u = r.map((e) => n[i] - e[i]).map((e) => -c(e)),
                    d = l(u)
                      .map((e) => e[0])
                      .map((e, t) => e + o[t]);
                  return { snaps: u, snapsAligned: d };
                })(er, es, et, en, ef),
                ex = -f(em) + f(ec),
                { snapsContained: eh, scrollContainLimit: eg } = (function (
                  e,
                  t,
                  n,
                  r,
                ) {
                  let a,
                    i,
                    s = b(-t + e, 0),
                    l = n
                      .map((e, t) => {
                        let { min: r, max: a } = s,
                          i = s.constrain(e),
                          l = t === m(n);
                        return t
                          ? l ||
                            (function (e, t) {
                              return 1 >= c(e - t);
                            })(r, i)
                            ? r
                            : (function (e, t) {
                                  return 1 >= c(e - t);
                                })(a, i)
                              ? a
                              : i
                          : a;
                      })
                      .map((e) => parseFloat(e.toFixed(3))),
                    o =
                      ((a = l[0]),
                      (i = f(l)),
                      b(l.lastIndexOf(a), l.indexOf(i) + 1));
                  return {
                    snapsContained: (function () {
                      if (t <= e + 2) return [s.max];
                      if ("keepSnaps" === r) return l;
                      let { min: n, max: a } = o;
                      return l.slice(n, a);
                    })(),
                    scrollContainLimit: o,
                  };
                })(ea, ex, ep, J),
                eb = el ? eh : ep,
                { limit: ey } =
                  ((z = eb[0]), { limit: b(V ? z - ex : f(eb), z) }),
                ev = (function e(t, n, r) {
                  let { constrain: a } = b(0, t),
                    i = t + 1,
                    s = l(n);
                  function l(e) {
                    return r ? c((i + e) % i) : a(e);
                  }
                  function o() {
                    return e(t, s, r);
                  }
                  let u = {
                    get: function () {
                      return s;
                    },
                    set: function (e) {
                      return ((s = l(e)), u);
                    },
                    add: function (e) {
                      return o().set(s + e);
                    },
                    clone: o,
                  };
                  return u;
                })(m(eb), U, V),
                ew = ev.clone(),
                ej = d(n),
                eN = (function (e, t, n, r) {
                  let a = g(),
                    i = 1e3 / 60,
                    s = null,
                    l = 0,
                    o = 0;
                  function c(e) {
                    if (!o) return;
                    s || ((s = e), n(), n());
                    let a = e - s;
                    for (s = e, l += a; l >= i;) (n(), (l -= i));
                    (r(l / i), o && (o = t.requestAnimationFrame(c)));
                  }
                  function u() {
                    (t.cancelAnimationFrame(o), (s = null), (l = 0), (o = 0));
                  }
                  return {
                    init: function () {
                      a.add(e, "visibilitychange", () => {
                        e.hidden && ((s = null), (l = 0));
                      });
                    },
                    destroy: function () {
                      (u(), a.clear());
                    },
                    start: function () {
                      o || (o = t.requestAnimationFrame(c));
                    },
                    stop: u,
                    update: n,
                    render: r,
                  };
                })(
                  r,
                  a,
                  () =>
                    (({
                      dragHandler: e,
                      scrollBody: t,
                      scrollBounds: n,
                      options: { loop: r },
                    }) => {
                      (r || n.constrain(e.pointerDown()), t.seek());
                    })(e_),
                  (e) =>
                    ((
                      {
                        scrollBody: e,
                        translate: t,
                        location: n,
                        offsetLocation: r,
                        previousLocation: a,
                        scrollLooper: i,
                        slideLooper: s,
                        dragHandler: l,
                        animation: o,
                        eventHandler: c,
                        scrollBounds: u,
                        options: { loop: d },
                      },
                      f,
                    ) => {
                      let m = e.settled(),
                        p = !u.shouldConstrain(),
                        x = d ? m : m && p,
                        h = x && !l.pointerDown();
                      h && o.stop();
                      let g = n.get() * f + a.get() * (1 - f);
                      (r.set(g),
                        d && (i.loop(e.direction()), s.loop()),
                        t.to(r.get()),
                        h && c.emit("settle"),
                        x || c.emit("scroll"));
                    })(e_, e),
                ),
                ek = eb[ev.get()],
                eS = y(ek),
                eE = y(ek),
                eC = y(ek),
                eT = y(ek),
                eI = (function (e, t, n, r, a) {
                  let i = 0,
                    s = 0,
                    l = a,
                    o = 0.68,
                    d = e.get(),
                    f = 0;
                  function m(e) {
                    return ((l = e), x);
                  }
                  function p(e) {
                    return ((o = e), x);
                  }
                  let x = {
                    direction: function () {
                      return s;
                    },
                    duration: function () {
                      return l;
                    },
                    velocity: function () {
                      return i;
                    },
                    seek: function () {
                      let t = r.get() - e.get(),
                        a = 0;
                      return (
                        l
                          ? (n.set(e),
                            (i += t / l),
                            (i *= o),
                            (d += i),
                            e.add(i),
                            (a = d - f))
                          : ((i = 0), n.set(r), e.set(r), (a = t)),
                        (s = u(a)),
                        (f = d),
                        x
                      );
                    },
                    settled: function () {
                      return 0.001 > c(r.get() - t.get());
                    },
                    useBaseFriction: function () {
                      return p(0.68);
                    },
                    useBaseDuration: function () {
                      return m(a);
                    },
                    useFriction: p,
                    useDuration: m,
                  };
                  return x;
                })(eS, eC, eE, eT, G),
                ez = (function (e, t, n, r, a) {
                  let { reachedAny: i, removeOffset: s, constrain: l } = r;
                  function o(e) {
                    return e.concat().sort((e, t) => c(e) - c(t))[0];
                  }
                  function d(t, r) {
                    let a = [t, t + n, t - n];
                    if (!e) return t;
                    if (!r) return o(a);
                    let i = a.filter((e) => u(e) === r);
                    return i.length ? o(i) : f(a) - n;
                  }
                  return {
                    byDistance: function (n, r) {
                      let o = a.get() + n,
                        { index: u, distance: f } = (function (n) {
                          let r = e ? s(n) : l(n),
                            { index: a } = t
                              .map((e, t) => ({ diff: d(e - r, 0), index: t }))
                              .sort((e, t) => c(e.diff) - c(t.diff))[0];
                          return { index: a, distance: r };
                        })(o),
                        m = !e && i(o);
                      if (!r || m) return { index: u, distance: n };
                      let p = n + d(t[u] - f, 0);
                      return { index: u, distance: p };
                    },
                    byIndex: function (e, n) {
                      let r = d(t[e] - a.get(), n);
                      return { index: e, distance: r };
                    },
                    shortcut: d,
                  };
                })(V, eb, ex, ey, eT),
                eO = (function (e, t, n, r, a, i, s) {
                  function l(a) {
                    let l = a.distance,
                      o = a.index !== t.get();
                    (i.add(l),
                      l &&
                        (r.duration()
                          ? e.start()
                          : (e.update(), e.render(1), e.update())),
                      o && (n.set(t.get()), t.set(a.index), s.emit("select")));
                  }
                  return {
                    distance: function (e, t) {
                      l(a.byDistance(e, t));
                    },
                    index: function (e, n) {
                      let r = t.clone().set(e);
                      l(a.byIndex(r.get(), n));
                    },
                  };
                })(eN, ev, ew, eI, ez, eT, w),
                eM = (function (e) {
                  let { max: t, length: n } = e;
                  return {
                    get: function (e) {
                      return n ? -((e - t) / n) : 0;
                    },
                  };
                })(ey),
                eA = g(),
                eD =
                  ((M = {}),
                  (A = null),
                  (D = null),
                  ($ = !1),
                  {
                    init: function () {
                      ((O = new IntersectionObserver(
                        (e) => {
                          $ ||
                            (e.forEach((e) => {
                              M[n.indexOf(e.target)] = e;
                            }),
                            (A = null),
                            (D = null),
                            w.emit("slidesInView"));
                        },
                        { root: t.parentElement, threshold: q },
                      )),
                        n.forEach((e) => O.observe(e)));
                    },
                    destroy: function () {
                      (O && O.disconnect(), ($ = !0));
                    },
                    get: function (e = !0) {
                      if (e && A) return A;
                      if (!e && D) return D;
                      let t = x(M).reduce((t, n) => {
                        let r = parseInt(n),
                          { isIntersecting: a } = M[r];
                        return (((e && a) || (!e && !a)) && t.push(r), t);
                      }, []);
                      return (e && (A = t), e || (D = t), t);
                    },
                  }),
                { slideRegistry: e$ } = (function (e, t, n, r, a, i) {
                  let s,
                    { groupSlides: l } = a,
                    { min: o, max: c } = r;
                  return {
                    slideRegistry:
                      ((s = l(i)),
                      1 === n.length
                        ? [i]
                        : e && "keepSnaps" !== t
                          ? s.slice(o, c).map((e, t, n) => {
                              let r = t === m(n);
                              return t
                                ? r
                                  ? p(m(i) - f(n)[0] + 1, f(n)[0])
                                  : e
                                : p(f(n[0]) + 1);
                            })
                          : s),
                  };
                })(el, J, eb, eg, ef, ej),
                eL = (function (e, t, n, r, a, s, o, c) {
                  let u = { passive: !0, capture: !0 },
                    d = 0;
                  function f(e) {
                    "Tab" === e.code && (d = new Date().getTime());
                  }
                  return {
                    init: function (m) {
                      c &&
                        (s.add(document, "keydown", f, !1),
                        t.forEach((t, f) => {
                          s.add(
                            t,
                            "focus",
                            (t) => {
                              (l(c) || c(m, t)) &&
                                (function (t) {
                                  if (new Date().getTime() - d > 10) return;
                                  (o.emit("slideFocusStart"),
                                    (e.scrollLeft = 0));
                                  let s = n.findIndex((e) => e.includes(t));
                                  i(s) &&
                                    (a.useDuration(0),
                                    r.index(s, 0),
                                    o.emit("slideFocus"));
                                })(f);
                            },
                            u,
                          );
                        }));
                    },
                  };
                })(e, n, e$, eO, eI, eA, w, Z),
                e_ = {
                  ownerDocument: r,
                  ownerWindow: a,
                  eventHandler: w,
                  containerRect: et,
                  slideRects: en,
                  animation: eN,
                  axis: er,
                  dragHandler: (function (
                    e,
                    t,
                    n,
                    r,
                    a,
                    i,
                    s,
                    o,
                    d,
                    f,
                    m,
                    p,
                    x,
                    y,
                    v,
                    w,
                    j,
                    N,
                  ) {
                    let { cross: k, direction: S } = e,
                      E = ["INPUT", "SELECT", "TEXTAREA"],
                      C = { passive: !1 },
                      T = g(),
                      I = g(),
                      z = b(50, 225).constrain(y.measure(20)),
                      O = { mouse: 300, touch: 400 },
                      M = { mouse: 500, touch: 600 },
                      A = v ? 43 : 25,
                      D = !1,
                      $ = 0,
                      L = 0,
                      _ = !1,
                      P = !1,
                      R = !1,
                      F = !1;
                    function U(e) {
                      if (!h(e, r) && e.touches.length >= 2) return V(e);
                      let t = i.readPoint(e),
                        n = i.readPoint(e, k),
                        s = c(t - $),
                        l = c(n - L);
                      if (!P && !F && (!e.cancelable || !(P = s > l)))
                        return V(e);
                      let u = i.pointerMove(e);
                      (s > w && (R = !0),
                        f.useFriction(0.3).useDuration(0.75),
                        o.start(),
                        a.add(S(u)),
                        e.preventDefault());
                    }
                    function V(e) {
                      var t;
                      let n,
                        r,
                        a = m.byDistance(0, !1).index !== p.get(),
                        s = i.pointerUp(e) * (v ? M : O)[F ? "mouse" : "touch"],
                        l =
                          ((t = S(s)),
                          (n = p.add(-1 * u(t))),
                          (r = m.byDistance(t, !v).distance),
                          v || c(t) < z
                            ? r
                            : j && a
                              ? 0.5 * r
                              : m.byIndex(n.get(), 0).distance),
                        o = (function (e, t) {
                          var n, r;
                          if (0 === e || 0 === t || c(e) <= c(t)) return 0;
                          let a = ((n = c(e)), (r = c(t)), c(n - r));
                          return c(a / e);
                        })(s, l);
                      ((P = !1),
                        (_ = !1),
                        I.clear(),
                        f.useDuration(A - 10 * o).useFriction(0.68 + o / 50),
                        d.distance(l, !v),
                        (F = !1),
                        x.emit("pointerUp"));
                    }
                    function G(e) {
                      R && (e.stopPropagation(), e.preventDefault(), (R = !1));
                    }
                    return {
                      init: function (e) {
                        N &&
                          T.add(t, "dragstart", (e) => e.preventDefault(), C)
                            .add(t, "touchmove", () => void 0, C)
                            .add(t, "touchend", () => void 0)
                            .add(t, "touchstart", o)
                            .add(t, "mousedown", o)
                            .add(t, "touchcancel", V)
                            .add(t, "contextmenu", V)
                            .add(t, "click", G, !0);
                        function o(o) {
                          (l(N) || N(e, o)) &&
                            (function (e) {
                              let l,
                                o = h(e, r);
                              if (
                                ((F = o),
                                (R = v && o && !e.buttons && D),
                                (D = c(a.get() - s.get()) >= 2),
                                !o || 0 === e.button) &&
                                ((l = e.target.nodeName || ""), !E.includes(l))
                              ) {
                                let r;
                                ((_ = !0),
                                  i.pointerDown(e),
                                  f.useFriction(0).useDuration(0),
                                  a.set(s),
                                  (r = F ? n : t),
                                  I.add(r, "touchmove", U, C)
                                    .add(r, "touchend", V)
                                    .add(r, "mousemove", U, C)
                                    .add(r, "mouseup", V),
                                  ($ = i.readPoint(e)),
                                  (L = i.readPoint(e, k)),
                                  x.emit("pointerDown"));
                              }
                            })(o);
                        }
                      },
                      destroy: function () {
                        (T.clear(), I.clear());
                      },
                      pointerDown: function () {
                        return _;
                      },
                    };
                  })(
                    er,
                    e,
                    r,
                    a,
                    eT,
                    (function (e, t) {
                      let n, r;
                      function a(e) {
                        return e.timeStamp;
                      }
                      function i(n, r) {
                        let a = r || e.scroll,
                          i = `client${"x" === a ? "X" : "Y"}`;
                        return (h(n, t) ? n : n.touches[0])[i];
                      }
                      return {
                        pointerDown: function (e) {
                          return ((n = e), (r = e), i(e));
                        },
                        pointerMove: function (e) {
                          let t = i(e) - i(r),
                            s = a(e) - a(n) > 170;
                          return ((r = e), s && (n = e), t);
                        },
                        pointerUp: function (e) {
                          if (!n || !r) return 0;
                          let t = i(r) - i(n),
                            s = a(e) - a(n),
                            l = a(e) - a(r) > 170,
                            o = t / s;
                          return s && !l && c(o) > 0.1 ? o : 0;
                        },
                        readPoint: i,
                      };
                    })(er, a),
                    eS,
                    eN,
                    eO,
                    eI,
                    ez,
                    ev,
                    w,
                    ei,
                    B,
                    H,
                    Y,
                    Q,
                  ),
                  eventStore: eA,
                  percentOfView: ei,
                  index: ev,
                  indexPrevious: ew,
                  limit: ey,
                  location: eS,
                  offsetLocation: eC,
                  previousLocation: eE,
                  options: o,
                  resizeHandler: (function (e, t, n, r, a, i, s) {
                    let o,
                      u,
                      d = [e].concat(r),
                      f = [],
                      m = !1;
                    function p(e) {
                      return a.measureSize(s.measure(e));
                    }
                    return {
                      init: function (a) {
                        i &&
                          ((u = p(e)),
                          (f = r.map(p)),
                          (o = new ResizeObserver((n) => {
                            (l(i) || i(a, n)) &&
                              (function (n) {
                                for (let i of n) {
                                  if (m) return;
                                  let n = i.target === e,
                                    s = r.indexOf(i.target),
                                    l = n ? u : f[s];
                                  if (c(p(n ? e : r[s]) - l) >= 0.5) {
                                    (a.reInit(), t.emit("resize"));
                                    break;
                                  }
                                }
                              })(n);
                          })),
                          n.requestAnimationFrame(() => {
                            d.forEach((e) => o.observe(e));
                          }));
                      },
                      destroy: function () {
                        ((m = !0), o && o.disconnect());
                      },
                    };
                  })(t, w, a, n, er, X, ee),
                  scrollBody: eI,
                  scrollBounds: (function (e, t, n, r, a) {
                    let i = a.measure(10),
                      s = a.measure(50),
                      l = b(0.1, 0.99),
                      o = !1;
                    function u() {
                      return (
                        !o && !!e.reachedAny(n.get()) && !!e.reachedAny(t.get())
                      );
                    }
                    return {
                      shouldConstrain: u,
                      constrain: function (a) {
                        if (!u()) return;
                        let o = e.reachedMin(t.get()) ? "min" : "max",
                          d = c(e[o] - t.get()),
                          f = n.get() - t.get(),
                          m = l.constrain(d / s);
                        (n.subtract(f * m),
                          !a &&
                            c(f) < i &&
                            (n.set(e.constrain(n.get())),
                            r.useDuration(25).useBaseFriction()));
                      },
                      toggleActive: function (e) {
                        o = !e;
                      },
                    };
                  })(ey, eC, eT, eI, ei),
                  scrollLooper: (function (e, t, n, r) {
                    let { reachedMin: a, reachedMax: i } = b(
                      t.min + 0.1,
                      t.max + 0.1,
                    );
                    return {
                      loop: function (t) {
                        if (!(1 === t ? i(n.get()) : -1 === t && a(n.get())))
                          return;
                        let s = -1 * t * e;
                        r.forEach((e) => e.add(s));
                      },
                    };
                  })(ex, ey, eC, [eS, eC, eE, eT]),
                  scrollProgress: eM,
                  scrollSnapList: eb.map(eM.get),
                  scrollSnaps: eb,
                  scrollTarget: ez,
                  scrollTo: eO,
                  slideLooper: (function (e, t, n, r, a, i, s, l, o) {
                    let c = d(a),
                      u = d(a).reverse(),
                      f = x(p(u, s[0]), n, !1).concat(
                        x(p(c, t - s[0] - 1), -n, !0),
                      );
                    function m(e, t) {
                      return e.reduce((e, t) => e - a[t], t);
                    }
                    function p(e, t) {
                      return e.reduce(
                        (e, n) => (m(e, t) > 0 ? e.concat([n]) : e),
                        [],
                      );
                    }
                    function x(a, s, c) {
                      let u = i.map((e, n) => ({
                        start: e - r[n] + 0.5 + s,
                        end: e + t - 0.5 + s,
                      }));
                      return a.map((t) => {
                        let r = c ? 0 : -n,
                          a = c ? n : 0,
                          i = u[t][c ? "end" : "start"];
                        return {
                          index: t,
                          loopPoint: i,
                          slideLocation: y(-1),
                          translate: v(e, o[t]),
                          target: () => (l.get() > i ? r : a),
                        };
                      });
                    }
                    return {
                      canLoop: function () {
                        return f.every(
                          ({ index: e }) =>
                            0.1 >=
                            m(
                              c.filter((t) => t !== e),
                              t,
                            ),
                        );
                      },
                      clear: function () {
                        f.forEach((e) => e.translate.clear());
                      },
                      loop: function () {
                        f.forEach((e) => {
                          let { target: t, translate: n, slideLocation: r } = e,
                            a = t();
                          a !== r.get() && (n.to(a), r.set(a));
                        });
                      },
                      loopPoints: f,
                    };
                  })(er, ea, ex, eo, ec, em, eb, eC, n),
                  slideFocus: eL,
                  slidesHandler:
                    ((_ = !1),
                    {
                      init: function (e) {
                        K &&
                          (L = new MutationObserver((t) => {
                            !_ &&
                              (l(K) || K(e, t)) &&
                              (function (t) {
                                for (let n of t)
                                  if ("childList" === n.type) {
                                    (e.reInit(), w.emit("slidesChanged"));
                                    break;
                                  }
                              })(t);
                          })).observe(t, { childList: !0 });
                      },
                      destroy: function () {
                        (L && L.disconnect(), (_ = !0));
                      },
                    }),
                  slidesInView: eD,
                  slideIndexes: ej,
                  slideRegistry: e$,
                  slidesToScroll: ef,
                  target: eT,
                  translate: v(er, t),
                };
              return e_;
            })(e, E, C, I, z, n, D);
            return n.loop && !r.slideLooper.canLoop()
              ? t(Object.assign({}, n, { loop: !1 }))
              : r;
          })(G)),
          _([V, ...B.map(({ options: e }) => e)]).forEach((e) =>
            A.add(e, "change", q),
          ),
          G.active &&
            (k.translate.to(k.location.get()),
            k.animation.init(),
            k.slidesInView.init(),
            k.slideFocus.init(X),
            k.eventHandler.init(X),
            k.resizeHandler.init(X),
            k.slidesHandler.init(X),
            k.options.loop && k.slideLooper.loop(),
            E.offsetParent && C.length && k.dragHandler.init(X),
            (S = M.init(X, B))));
      }
      function q(e, t) {
        let n = J();
        (W(), H($({ startIndex: n }, e), t), D.emit("reInit"));
      }
      function W() {
        (k.dragHandler.destroy(),
          k.eventStore.clear(),
          k.translate.clear(),
          k.slideLooper.clear(),
          k.resizeHandler.destroy(),
          k.slidesHandler.destroy(),
          k.slidesInView.destroy(),
          k.animation.destroy(),
          M.destroy(),
          A.clear());
      }
      function Y(e, t, n) {
        G.active &&
          !U &&
          (k.scrollBody
            .useBaseFriction()
            .useDuration(!0 === t ? 0 : G.duration),
          k.scrollTo.index(e, n || 0));
      }
      function J() {
        return k.index.get();
      }
      let X = {
        canScrollNext: function () {
          return k.index.add(1).get() !== J();
        },
        canScrollPrev: function () {
          return k.index.add(-1).get() !== J();
        },
        containerNode: function () {
          return E;
        },
        internalEngine: function () {
          return k;
        },
        destroy: function () {
          U || ((U = !0), A.clear(), W(), D.emit("destroy"), D.clear());
        },
        off: R,
        on: P,
        emit: F,
        plugins: function () {
          return S;
        },
        previousScrollSnap: function () {
          return k.indexPrevious.get();
        },
        reInit: q,
        rootNode: function () {
          return e;
        },
        scrollNext: function (e) {
          Y(k.index.add(1).get(), e, -1);
        },
        scrollPrev: function (e) {
          Y(k.index.add(-1).get(), e, 1);
        },
        scrollProgress: function () {
          return k.scrollProgress.get(k.offsetLocation.get());
        },
        scrollSnapList: function () {
          return k.scrollSnapList;
        },
        scrollTo: Y,
        selectedScrollSnap: J,
        slideNodes: function () {
          return C;
        },
        slidesInView: function () {
          return k.slidesInView.get();
        },
        slidesNotInView: function () {
          return k.slidesInView.get(!1);
        },
      };
      return (H(t, n), setTimeout(() => D.emit("init"), 0), X);
    }
    let k = {
      active: !0,
      breakpoints: {},
      delay: 4e3,
      jump: !1,
      playOnInit: !0,
      stopOnFocusIn: !0,
      stopOnInteraction: !0,
      stopOnMouseEnter: !1,
      stopOnLastSnap: !1,
      rootNode: null,
    };
    function S(e = {}) {
      let t,
        n,
        r,
        a,
        i = null,
        s = 0,
        l = !1,
        o = !1,
        c = !1,
        u = !1;
      function d() {
        if (!r) {
          if (p()) {
            c = !0;
            return;
          }
          (l || n.emit("autoplay:play"),
            (function () {
              let { ownerWindow: e } = n.internalEngine();
              (e.clearTimeout(s),
                (s = e.setTimeout(y, a[n.selectedScrollSnap()])),
                (i = new Date().getTime()),
                n.emit("autoplay:timerset"));
            })(),
            (l = !0));
        }
      }
      function f() {
        r ||
          (l && n.emit("autoplay:stop"),
          (function () {
            let { ownerWindow: e } = n.internalEngine();
            (e.clearTimeout(s),
              (s = 0),
              (i = null),
              n.emit("autoplay:timerstopped"));
          })(),
          (l = !1));
      }
      function m() {
        if (p()) return ((c = l), f());
        c && d();
      }
      function p() {
        let { ownerDocument: e } = n.internalEngine();
        return "hidden" === e.visibilityState;
      }
      function x() {
        o || f();
      }
      function h() {
        o || d();
      }
      function g() {
        ((o = !0), f());
      }
      function b() {
        ((o = !1), d());
      }
      function y() {
        let { index: e } = n.internalEngine(),
          r = e.clone().add(1).get(),
          a = n.scrollSnapList().length - 1,
          i = t.stopOnLastSnap && r === a;
        if (
          (n.canScrollNext() ? n.scrollNext(u) : n.scrollTo(0, u),
          n.emit("autoplay:select"),
          i)
        )
          return f();
        d();
      }
      return {
        name: "autoplay",
        options: e,
        init: function (i, s) {
          var l, o, c, p;
          let y, v;
          n = i;
          let { mergeOptions: w, optionsAtMedia: j } = s,
            N = w(k, S.globalOptions);
          if (((t = j(w(N, e))), n.scrollSnapList().length <= 1)) return;
          ((u = t.jump),
            (r = !1),
            (l = n),
            (o = t.delay),
            (y = l.scrollSnapList()),
            (a = "number" == typeof o ? y.map(() => o) : o(y, l)));
          let { eventStore: E, ownerDocument: C } = n.internalEngine(),
            T = !!n.internalEngine().options.watchDrag,
            I =
              ((c = n), (p = t.rootNode), (v = c.rootNode()), (p && p(v)) || v);
          (E.add(C, "visibilitychange", m),
            T && n.on("pointerDown", x),
            T && !t.stopOnInteraction && n.on("pointerUp", h),
            t.stopOnMouseEnter && E.add(I, "mouseenter", g),
            t.stopOnMouseEnter &&
              !t.stopOnInteraction &&
              E.add(I, "mouseleave", b),
            t.stopOnFocusIn && n.on("slideFocusStart", f),
            t.stopOnFocusIn &&
              !t.stopOnInteraction &&
              E.add(n.containerNode(), "focusout", d),
            t.playOnInit && d());
        },
        destroy: function () {
          (n
            .off("pointerDown", x)
            .off("pointerUp", h)
            .off("slideFocusStart", f),
            f(),
            (r = !0),
            (l = !1));
        },
        play: function (e) {
          (void 0 !== e && (u = e), d());
        },
        stop: function () {
          l && f();
        },
        reset: function () {
          l && d();
        },
        isPlaying: function () {
          return l;
        },
        timeUntilNext: function () {
          return i
            ? a[n.selectedScrollSnap()] - (new Date().getTime() - i)
            : null;
        },
      };
    }

window.ChorloveCarousel={create:j,autoplay:S};
})();
