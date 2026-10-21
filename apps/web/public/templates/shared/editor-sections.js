(() => {
  "use strict";
  if (window.__taklifnomaExtrasInstalled) return;
  window.__taklifnomaExtrasInstalled = true;
  const texts = {
    "uz-Latn": {
      story: "Bizning hikoyamiz",
      dress: "Kiyinish uslubi",
      people: "Bayram egalari",
      receipt: "To‘yona chekini yuborish",
      names: "To‘yonani kimlar nomidan yubordingiz?",
      file: "Chek rasmi yoki PDF · 5 MB gacha",
      send: "Chekni yuborish",
      busy: "Yuklanmoqda…",
      note: "Chek faqat taklifnoma egasiga ko‘rinadi. AI tekshiruvi yo‘q. Fayl yuborilishi pul tushganini tasdiqlamaydi.",
      done: "Chek saqlandi. Taklifnoma egasi ko‘rib chiqadi. Bu to‘lov tasdig‘i emas.",
      error: "Chek yuborilmadi. Qayta urinib ko‘ring.",
      preview: "Ko‘rish rejimida fayl yuborilmaydi.",
    },
    "uz-Cyrl": {
      story: "Бизнинг ҳикоямиз",
      dress: "Кийиниш услуби",
      people: "Байрам эгалари",
      receipt: "Тўёна чекини юбориш",
      names: "Тўёнани кимлар номидан юбордингиз?",
      file: "Чек расми ёки PDF · 5 MB гача",
      send: "Чекни юбориш",
      busy: "Юкланмоқда…",
      note: "Чек фақат таклифнома эгасига кўринади. AI текшируви йўқ. Файл юборилиши пул тушганини тасдиқламайди.",
      done: "Чек сақланди. Таклифнома эгаси кўриб чиқади. Бу тўлов тасдиғи эмас.",
      error: "Чек юборилмади. Қайта уриниб кўринг.",
      preview: "Кўриш режимида файл юборилмайди.",
    },
    en: {
      story: "Our story",
      dress: "Dress code",
      people: "Celebrants",
      receipt: "Send a gift receipt",
      names: "Who is this gift from?",
      file: "Receipt image or PDF · up to 5 MB",
      send: "Send receipt",
      busy: "Uploading…",
      note: "Only the invitation owner can view your receipt. No AI screening is used. Uploading a file does not confirm payment.",
      done: "Receipt saved for the invitation owner to review. This is not payment confirmation.",
      error: "Could not send the receipt. Please try again.",
      preview: "Uploads are disabled in preview.",
    },
    ru: {
      story: "Наша история",
      dress: "Дресс-код",
      people: "Виновники торжества",
      receipt: "Отправить чек подарка",
      names: "От чьего имени отправлен подарок?",
      file: "Изображение чека или PDF · до 5 МБ",
      send: "Отправить чек",
      busy: "Загрузка…",
      note: "Чек доступен только владельцу приглашения. Проверка ИИ не используется. Загрузка файла не подтверждает поступление денег.",
      done: "Чек сохранён для просмотра владельцем приглашения. Это не подтверждение оплаты.",
      error: "Не удалось отправить чек. Повторите попытку.",
      preview: "В режиме просмотра загрузка отключена.",
    },
  };
  const style = document.createElement("style");
  style.textContent = `.platform-extra{max-width:760px;margin:40px auto;padding:28px 22px;color:inherit;font-family:inherit;text-align:center;box-sizing:border-box}.platform-extra h2{font:inherit;font-size:clamp(24px,5vw,36px);margin:0 0 20px}.platform-extra h3{font:inherit;font-size:22px;margin:24px 0 12px}.platform-extra p{white-space:pre-wrap;line-height:1.7;overflow-wrap:anywhere}.platform-extra form{display:grid;gap:16px;text-align:left;max-width:480px;margin:auto}.platform-extra label{display:grid;gap:8px}.platform-extra input{font:inherit;color:inherit;background:transparent;border:1px solid currentColor;border-radius:8px;box-sizing:border-box;padding:12px;width:100%;min-width:0}.platform-extra button{font:inherit;padding:12px 18px;cursor:pointer;border:1px solid currentColor;border-radius:8px;color:inherit;background:transparent}.platform-extra button:disabled{opacity:.5;cursor:default}.platform-extra small{display:block;line-height:1.6}.platform-extra-colors{display:flex;flex-wrap:wrap;gap:16px;justify-content:center}.platform-extra-colors span{display:grid;gap:6px;justify-items:center}.platform-extra-colors i{width:36px;height:36px;border-radius:50%;border:1px solid #888}.platform-extra[hidden]{display:none!important}`;
  document.head.append(style);
  const sections = new Map();
  let current;
  function node(tag, text) {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    return element;
  }
  function section(key, title, visible) {
    let element = sections.get(key);
    if (!element) {
      element = node("section");
      element.className = "platform-extra";
      element.dataset.platformExtra = key;
      const footer = document.querySelector(
        "[data-section='rsvp'],[data-rsvp],footer,.footer,[data-section='finale']",
      );
      const gift =
        key === "receipt" && document.querySelector('[data-section="toyona"]');
      if (gift) gift.append(element);
      else if (footer) footer.before(element);
      else (document.querySelector("main") || document.body).append(element);
      sections.set(key, element);
    }
    element.hidden = !visible;
    if (key !== "receipt" || !element.querySelector("form")) {
      element.replaceChildren();
      element.append(node("h2", title));
    }
    return element;
  }
  function render(payload) {
    if (!payload?.data) return;
    current = payload;
    const { data, locale } = payload,
      copy = texts[locale] || texts["uz-Latn"];
    if (!document.querySelector('[data-section="story"]')) {
      const host = section("story", copy.story, data.story?.length > 0);
      for (const chapter of data.story || []) {
        host.append(node("h3", chapter.title), node("p", chapter.text));
      }
    }
    if (!document.querySelector('[data-section="dresscode"]')) {
      const dress = data.dressCode || {},
        host = section("dress", copy.dress, !!dress.enabled);
      host.append(node("h3", dress.style), node("p", dress.text));
      const colors = node("div");
      colors.className = "platform-extra-colors";
      for (const color of dress.colors || []) {
        const item = node("span"),
          swatch = node("i");
        if (/^#[0-9a-f]{3,8}$/i.test(color.hex))
          swatch.style.backgroundColor = color.hex;
        item.append(swatch, node("small", color.name));
        colors.append(item);
      }
      host.append(colors, node("p", dress.note));
    }
    const people = section(
      "people",
      copy.people,
      payload.extraPeople?.length > 0,
    );
    people.append(node("p", (payload.extraPeople || []).join(" · ")));
    const host = section(
      "receipt",
      copy.receipt,
      !!payload.receiptUploadEnabled,
    );
    if (host.querySelector("form")) return;
    const form = node("form"),
      namesLabel = node("label", copy.names),
      names = node("input"),
      fileLabel = node("label", copy.file),
      file = node("input"),
      button = node("button", copy.send),
      output = node("p");
    names.name = "giverNames";
    names.required = true;
    names.maxLength = 300;
    names.autocomplete = "name";
    namesLabel.append(names);
    file.type = "file";
    file.name = "file";
    file.accept = "image/jpeg,image/png,image/webp,application/pdf";
    file.required = true;
    fileLabel.append(file);
    button.type = "submit";
    button.disabled = !!payload.preview;
    output.setAttribute("role", "status");
    output.setAttribute("aria-live", "polite");
    form.append(
      namesLabel,
      fileLabel,
      node("small", payload.preview ? copy.preview : copy.note),
      button,
      output,
    );
    host.append(form);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (current.preview || button.disabled) return;
      if (!file.files[0] || file.files[0].size > 5 * 1024 * 1024) {
        output.textContent = copy.file;
        return;
      }
      const body = new FormData(form);
      if (current.guestToken) body.set("guestToken", current.guestToken);
      button.disabled = true;
      button.textContent = copy.busy;
      output.textContent = "";
      try {
        const response = await fetch(
          `/api/public/invitations/${encodeURIComponent(current.invitationId)}/receipts`,
          { method: "POST", body },
        );
        const result = await response.json();
        if (!response.ok)
          throw new Error(
            locale.startsWith("uz")
              ? result.error?.message || copy.error
              : copy.error,
          );
        output.textContent = copy.done;
        form.reset();
      } catch (error) {
        output.textContent = error.message || copy.error;
      } finally {
        button.disabled = false;
        button.textContent = copy.send;
      }
    });
  }
  window.addEventListener("message", (event) => {
    if (
      event.origin === location.origin &&
      event.source === parent &&
      event.data?.type === "taklifnoma:editor-sections"
    )
      render(event.data.payload);
  });
  render(window.__taklifnomaExtras);
})();
