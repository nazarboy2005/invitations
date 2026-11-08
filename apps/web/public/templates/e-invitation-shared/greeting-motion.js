export function greetingLetters(greeting) {
  if (!greeting) return;
  const text = greeting.textContent;
  greeting.setAttribute('aria-label', text);
  greeting.replaceChildren();
  let index = 0;
  for (const [wordIndex, word] of text.split(/\s+/).entries()) {
    if (wordIndex) greeting.append(document.createTextNode(' '));
    const group = document.createElement('span'); group.className = 'section-hero__word'; group.setAttribute('aria-hidden', 'true'); group.style.whiteSpace = 'nowrap'; group.style.display = 'inline-block';
    for (const attr of greeting.attributes) if (attr.name.startsWith('data-v-')) group.setAttribute(attr.name, '');
    for (const letter of word) {
      const span = document.createElement('span'); span.className = 'section-hero__letter';
      for (const attr of greeting.attributes) if (attr.name.startsWith('data-v-')) span.setAttribute(attr.name, '');
      span.style.setProperty('--i', String(index++)); span.textContent = letter; group.append(span);
    }
    greeting.append(group);
  }
}
