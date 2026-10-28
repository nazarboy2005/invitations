import test from "node:test";
import assert from "node:assert/strict";
import { openCheckout } from "../apps/web/src/modules/payments/open-checkout";

// Encoded provider parameters and noncanonical casing must survive unchanged.
const checkoutUrl =
  "https://my.click.uz:443/services/pay?token=a%2fb%2Bc&order=existing#checkout";

function browser(
  app?: {
    initData?: string;
    platform?: string;
    openLink?: (url: string) => void;
    isVersionAtLeast?: (version: string) => boolean;
  },
  hash = "",
) {
  const opened: unknown[][] = [];
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      Telegram: app ? { WebApp: app } : undefined,
      location: { hash },
      open: (...args: unknown[]) => opened.push(args),
    },
  });
  return {
    opened,
    restore() {
      if (previous) Object.defineProperty(globalThis, "window", previous);
      else Reflect.deleteProperty(globalThis, "window");
    },
  };
}

test("Telegram gets the original checkout URL synchronously without browser navigation", () => {
  let tapped = false;
  const received: string[] = [];
  const host = browser({
    initData: "signed-launch",
    openLink(url) {
      assert.equal(tapped, true, "SDK called before the tap stack returns");
      received.push(url);
    },
  });
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      tapped = true;
      openCheckout(checkoutUrl);
      tapped = false;
    }
    assert.deepEqual(received, [checkoutUrl, checkoutUrl]);
    assert.deepEqual(host.opened, []);
  } finally {
    host.restore();
  }
});

test("launch fragment/platform detect Telegram while signed SDK data is unavailable", () => {
  for (const mode of ["fragment", "platform"]) {
    const received: string[] = [];
    const host = browser(
      {
        platform: mode === "platform" ? "android" : "unknown",
        openLink: (url) => {
          received.push(url);
        },
      },
      mode === "fragment" ? "#tgWebAppData=signed-launch" : "",
    );
    try {
      openCheckout(checkoutUrl);
      assert.deepEqual(received, [checkoutUrl]);
      assert.deepEqual(host.opened, []);
    } finally {
      host.restore();
    }
  }
});

test("unavailable/old/throwing Telegram SDK fails into recovery without internal navigation", () => {
  for (const app of [
    undefined,
    { initData: "launch" },
    {
      initData: "launch",
      isVersionAtLeast: () => false,
      openLink() {
        assert.fail("old SDK must not launch");
      },
    },
    {
      initData: "launch",
      openLink() {
        throw new Error("native bridge unavailable");
      },
    },
  ]) {
    const host = browser(app, "#tgWebAppData=launch");
    try {
      assert.throws(() => openCheckout(checkoutUrl));
      assert.deepEqual(host.opened, []);
    } finally {
      host.restore();
    }
  }
});

test("normal browser (including an inert Telegram script) keeps status page in its tab", () => {
  for (const app of [
    undefined,
    {
      initData: "",
      platform: "unknown",
      openLink() {
        assert.fail("not a Mini App");
      },
    },
  ]) {
    const host = browser(app);
    try {
      openCheckout(checkoutUrl);
      assert.deepEqual(host.opened, [
        [checkoutUrl, "_blank", "noopener,noreferrer"],
      ]);
    } finally {
      host.restore();
    }
  }
});

test("no custom Click/intent scheme, HTTP or credentials can be opened", () => {
  const host = browser();
  try {
    for (const url of [
      "click://pay",
      "intent://pay",
      "javascript:alert(1)",
      "http://my.click.uz",
      "https://key@my.click.uz",
      "invalid",
    ])
      assert.throws(() => openCheckout(url));
    assert.deepEqual(host.opened, []);
  } finally {
    host.restore();
  }
});
