(() => {
  const script = document.currentScript;
  const invitationId = script?.dataset.invitationId;
  const guestToken = script?.dataset.guestToken || "";
  if (!invitationId || window.__fotihaVisitorControls) return;
  window.__fotihaVisitorControls = true;

  const endpoint = `/api/public/invitations/${encodeURIComponent(invitationId)}/visitor-state${guestToken ? `?guestToken=${encodeURIComponent(guestToken)}` : ""}`;
  const wishWords = /wish|tilak|пожелан|пожел|tilaklar/i;
  const rsvpWords = /rsvp|attend|kel|bor|tashrif|javob|response|приду|прийти/i;
  let state = null;
  try { state = JSON.parse(script?.dataset.visitorState || "null"); } catch { state = null; }
  let loading = false;

  const controlText = (element) => [
    element.name,
    element.id,
    element.getAttribute("placeholder"),
    element.getAttribute("aria-label"),
    element.getAttribute("data-field"),
    element.closest("label")?.textContent,
  ].filter(Boolean).join(" ");

  function isWishControl(element, form) {
    const ownText = controlText(element);
    if (wishWords.test(ownText)) return true;
    return element.matches("textarea,[contenteditable='true']") && wishWords.test(form?.textContent || "");
  }

  function isRsvpForm(form) {
    return Boolean(form.querySelector("input[type=radio],select,[name*=rsvp i],[name*=attend i],[name*=status i]")) || rsvpWords.test(form.textContent || "");
  }

  function hideWishes() {
    if (!state || !state.wishesEnabled || state.wishCount < state.wishLimit) return;
    const inspected = new Set();
    for (const form of document.querySelectorAll("form")) {
      const isWishForm = form.matches("[data-wishes-form],[data-wish-form],.wish-form");
      const fields = [...form.querySelectorAll("input,textarea,[contenteditable='true']")]
        .filter((field) => isWishForm || isWishControl(field, form));
      if (!fields.length) continue;
      fields.forEach((field) => inspected.add(field));
      if (!isRsvpForm(form)) {
        form.hidden = true;
        form.style.setProperty("display", "none", "important");
        form.setAttribute("aria-hidden", "true");
      } else {
        for (const field of fields) {
          const container = field.closest("label") || field.parentElement || field;
          container.hidden = true;
          field.setAttribute("aria-hidden", "true");
          if ("disabled" in field) field.disabled = true;
        }
      }
      if (!form.nextElementSibling?.classList.contains("fotiha-wish-limit")) {
        const notice = document.createElement("p");
        notice.className = "fotiha-wish-limit";
        notice.textContent = "Siz ikki marta tilak yubordingiz. Boshqa mehmonlarning tilaklarini ko‘rishingiz mumkin.";
        notice.style.cssText = "margin:12px 0;padding:10px 12px;border-radius:10px;background:rgba(127,127,127,.12);font:inherit;line-height:1.5";
        form.insertAdjacentElement("afterend", notice);
      }
    }
    for (const field of document.querySelectorAll("input,textarea,[contenteditable='true']")) {
      if (inspected.has(field) || !isWishControl(field, null)) continue;
      const container = field.closest("label") || field.parentElement || field;
      container.hidden = true;
      field.setAttribute("aria-hidden", "true");
      if ("disabled" in field) field.disabled = true;
    }
  }

  function responseLabel(response) {
    return ({ yes: "Kelaman", no: "Kela olmayman", maybe: "Aniq emas" })[response.status] || response.status;
  }

  function restoreRsvp() {
    if (!state?.response) return;
    const form = [...document.querySelectorAll("form")].find(isRsvpForm);
    if (!form) return;
    const nativeForm = form.querySelector("[data-rsvp-form]");
    const nativeDone = form.querySelector("[data-rsvp-done]");
    if (nativeForm && nativeDone) {
      nativeForm.hidden = true;
      nativeDone.hidden = false;
      const summary = nativeDone.querySelector("[data-rsvp-summary]");
      if (summary) {
        const status = state.response.status;
        summary.textContent = status === "yes"
          ? `Kelaman · ${state.response.partySize || 1} kishi`
          : responseLabel(state.response);
      }
      for (const choice of form.querySelectorAll("[data-rsvp-choice]")) {
        choice.setAttribute("aria-pressed", String(choice.dataset.rsvpChoice === state.response.status));
      }
      return;
    }
    for (const field of form.querySelectorAll("input,select,textarea")) {
      const key = `${field.name} ${field.id}`.toLowerCase();
      if (/name|guest|mehmon|ism/.test(key) && field.type !== "radio" && field.type !== "checkbox") {
        field.value = state.response.name || "";
      }
      if (field.type === "radio" || field.tagName === "SELECT") {
        const options = field.type === "radio" ? [field] : [...field.options];
        for (const option of options) {
          const label = `${option.value} ${option.labels?.[0]?.textContent || ""}`.toLowerCase();
          const value = state.response.status;
          const match = value === "yes"
            ? /(^|\b)(yes|ha|kelaman|attend|coming)(\b|$)/.test(label) && !/no|not|cannot|can't|emas|olmayman/.test(label)
            : value === "no"
              ? /(^|\b)(no|yo‘q|yo'q|kelmayman|olmayman|cannot|can't|decline)(\b|$)/.test(label)
              : /maybe|aniq emas|not sure|later|пока не знаю/.test(label);
          if (match) option.checked = field.type === "radio" ? true : undefined;
          if (match && field.tagName === "SELECT") field.value = option.value;
        }
      }
    }
    if (form.previousElementSibling?.classList.contains("fotiha-visitor-response")) return;
    const note = document.createElement("div");
    note.className = "fotiha-visitor-response";
    note.style.cssText = "margin:12px 0;padding:12px;border-radius:12px;background:rgba(127,127,127,.12);font:inherit;line-height:1.5";
    const text = document.createElement("span");
    text.textContent = `Javobingiz saqlandi: ${responseLabel(state.response)}. `;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.textContent = "Javobni o‘zgartirish";
    edit.style.cssText = "font:inherit;text-decoration:underline;border:0;background:none;cursor:pointer";
    edit.addEventListener("click", () => {
      form.scrollIntoView({ behavior: "smooth", block: "center" });
      const selected = form.querySelector("input:checked,select,textarea,input:not([type=radio]):not([type=checkbox])");
      selected?.focus({ preventScroll: true });
    });
    note.append(text, edit);
    form.insertAdjacentElement("beforebegin", note);
  }

  async function refresh() {
    if (loading) return;
    loading = true;
    try {
      const response = await fetch(endpoint, { credentials: "same-origin", cache: "no-store" });
      if (response.ok) state = await response.json();
      hideWishes();
      restoreRsvp();
    } catch { /* Visitor controls must not interrupt the invitation. */ }
    finally { loading = false; }
  }

  const observer = new MutationObserver(() => {
    if (!state) return;
    hideWishes();
    restoreRsvp();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  void refresh();

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (...args) => {
    const response = await nativeFetch(...args);
    const request = args[0] instanceof Request ? args[0].url : String(args[0]);
    if (request.includes(`/api/public/invitations/${encodeURIComponent(invitationId)}/wishes`) && args[1]?.method?.toUpperCase() === "POST" && response.ok) {
      try {
        const result = await response.clone().json();
        state = { ...(state || {}), wishCount: Number(result.wishCount || Number(state?.wishCount || 0) + 1), wishLimit: 2, wishesEnabled: true };
      } catch {
        state = { ...(state || {}), wishCount: Math.min(2, Number(state?.wishCount || 0) + 1), wishLimit: 2, wishesEnabled: true };
      }
      hideWishes();
    }
    if (request.includes(`/api/public/invitations/${encodeURIComponent(invitationId)}/rsvp`) && args[1]?.method?.toUpperCase() === "POST" && response.ok) {
      void refresh();
    }
    return response;
  };
})();
