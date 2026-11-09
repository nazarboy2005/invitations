/** All template adapters use fetch; install before delivering their public payload. */
const actions: Record<string, string> = {
  wishes: "guest_wish",
  rsvp: "guest_rsvp",
  receipts: "guest_receipt",
  "gift-intentions": "guest_gift_intention",
};
type Turnstile = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
let apiPromise: Promise<Turnstile> | undefined;
function loadApi() {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    const timeout = window.setTimeout(() => fail(), 20_000);
    const fail = () => {
      window.clearTimeout(timeout);
      script.remove();
      apiPromise = undefined;
      reject(new Error("Verification unavailable"));
    };
    script.onerror = fail;
    script.onload = () => {
      window.clearTimeout(timeout);
      const api = (window as Window & { turnstile?: Turnstile }).turnstile;
      if (api) resolve(api);
      else fail();
    };
    document.head.append(script);
  });
  return apiPromise;
}

// Serialize submissions, including templates that send an RSVP and wish together.
let queue = Promise.resolve();
async function verifiedRequest(
  action: string,
  request: Request,
  send: typeof fetch,
) {
  let unlock!: () => void;
  const previous = queue;
  queue = new Promise<void>((resolve) => {
    unlock = resolve;
  });
  await previous;
  let cleanup = () => {};
  let verified = false;
  try {
    request.signal.throwIfAborted();
    const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!sitekey) throw new Error("Verification unavailable");
    const api = await loadApi();
    request.signal.throwIfAborted();
    const dialog = document.createElement("dialog");
    dialog.style.cssText =
      "border:0;border-radius:16px;padding:24px;max-width:calc(100vw - 24px);background:#fff;color:#222;z-index:2147483647";
    const heading = document.createElement("p");
    const russian = document.documentElement.lang.startsWith("ru");
    heading.textContent = russian
      ? "Проверка безопасности"
      : "Xavfsizlik tekshiruvi";
    heading.id = "fotiha-turnstile-title";
    dialog.setAttribute("aria-labelledby", heading.id);
    const container = document.createElement("div");
    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.textContent = russian ? "Отмена" : "Bekor qilish";
    cancel.style.cssText =
      "display:block;margin:16px auto 0;padding:8px 16px;cursor:pointer";
    dialog.append(heading, container, cancel);
    const focused = document.activeElement;
    document.body.append(dialog);
    dialog.showModal();
    let widget: string | undefined;
    let timer = 0;
    let abort = () => {};
    cleanup = () => {
      window.clearTimeout(timer);
      request.signal.removeEventListener("abort", abort);
      if (widget !== undefined) {
        api.reset(widget);
        api.remove(widget);
      }
      dialog.close();
      dialog.remove();
      if (focused instanceof HTMLElement)
        focused.focus({ preventScroll: true });
    };
    const token = await new Promise<string>((resolve, reject) => {
      const fail = () => reject(new Error("Verification failed"));
      abort = fail;
      request.signal.addEventListener("abort", abort, { once: true });
      cancel.onclick = fail;
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        fail();
      });
      timer = window.setTimeout(fail, 120_000);
      widget = api.render(container, {
        sitekey,
        action,
        theme: "light",
        size: "flexible",
        callback: resolve,
        "error-callback": fail,
        "expired-callback": fail,
        "timeout-callback": fail,
      });
    });
    window.clearTimeout(timer);
    dialog.close();
    request.signal.throwIfAborted();
    request.headers.set("cf-turnstile-response", token);
    verified = true;
    return await send(request);
  } catch (error) {
    if (request.signal.aborted || verified) throw error;
    return Response.json(
      {
        error: {
          code: "TURNSTILE_FAILED",
          message: "Xavfsizlik tekshiruvidan qayta o‘ting.",
        },
      },
      { status: 403 },
    );
  } finally {
    try {
      cleanup();
    } finally {
      unlock();
    }
  }
}

export function installTurnstileFetch(
  target: Pick<Window, "fetch">,
  baseUrl: string,
) {
  const original = target.fetch;
  const send = original.bind(target);
  let active = true;
  const wrapped: typeof fetch = (input, init) => {
    if (!active) return send(input, init);
    const raw =
      typeof input === "string"
        ? input
        : "url" in input
          ? input.url
          : input.href;
    const url = new URL(raw, baseUrl);
    const method = (
      init?.method ??
      (typeof input === "object" && "method" in input ? input.method : "GET")
    ).toUpperCase();
    const match = url.pathname.match(
      /^\/api\/public\/invitations\/[^/]+\/(wishes|rsvp|receipts|gift-intentions)\/?$/,
    );
    if (url.origin !== window.location.origin || method !== "POST" || !match)
      return send(input, init);
    const request = new Request(
      typeof input === "object" && "url" in input ? input : url,
      init,
    );
    return verifiedRequest(actions[match[1]], request, send);
  };
  target.fetch = wrapped;
  return () => {
    // Other shared controls may have wrapped this function after installation.
    // Disable our captured closure too, so effect remounts never challenge twice.
    active = false;
    if (target.fetch === wrapped) target.fetch = original;
  };
}
