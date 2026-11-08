import confetti from './confetti.js';
// CalendarCard/SectionDatetime's original sequence and particle settings.
export function calendarMotion({ id, root, reduced, isOpened }) {
  let observer, generation = 0;
  return (grid, selector, selectedClass) => {
    observer?.disconnect(); const current = ++generation;
    const active = grid.querySelector(`.${selectedClass}`); if (!active) return;
    const olive = id === 'olive-manor-edition', islamic = id === 'islamic-edition';
    const reveal = () => active.classList.add(olive ? 'calendar-card__day--revealed' : 'is-revealed');
    if (reduced || id === 'monochrome-editorial-edition') { reveal(); return; }
    let done = false;
    const start = () => {
      if (done || !isOpened()) return; done = true; observer?.disconnect();
      const cells = [...grid.querySelectorAll(selector)].filter(e => !e.matches('.is-inactive,.calendar-card__day--empty'));
      const target = cells.indexOf(active);
      for (let i = 0; i <= target; i++) setTimeout(() => {
        if (current !== generation) return;
        cells.forEach(cell => cell.classList.remove('is-current'));
        cells[i].classList.add(olive ? 'calendar-card__day--lit' : 'is-lit');
        if (!olive && !islamic && i !== target) cells[i].classList.add('is-current');
        if (i === target) { reveal(); burst(); }
      }, (olive ? 750 : islamic ? 900 : 520) + i * (olive || islamic ? 70 : 92));
    };
    function burst() {
      const canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:fixed;inset:0;width:min(100%,450px);height:100dvh;margin:auto;pointer-events:none;z-index:100'; root.append(canvas);
      const fire = confetti.create(canvas, { resize: true });
      const rect = active.getBoundingClientRect(), bounds = canvas.getBoundingClientRect();
      const origin = { x: (rect.left + rect.width / 2 - bounds.left) / bounds.width, y: (rect.top + rect.height / 2) / bounds.height };
      const primary = olive ? ['#737b4e', '#9aa07b', '#343a22'] : islamic ? ['#c9a752', '#e8d5a0', '#9a7830', '#fdf9f2'] : ['#C9A84C', '#E8D4A0', '#9A7830', '#F5F0E8'];
      const secondary = olive ? ['#c7ab6b', '#efeadf', '#fffdf8'] : islamic ? ['#1e5c3a', '#2d7a52'] : ['#1B3A6B', '#2A5298', '#C9A84C'];
      if (!olive && !islamic) {
        fire({ particleCount: 42, spread: 72, startVelocity: 26, origin, colors: [...primary, ...secondary], scalar: .72, ticks: 180 });
        setTimeout(() => fire({ particleCount: 24, spread: 96, startVelocity: 18, origin, colors: primary, scalar: .82, shapes: ['star'], ticks: 260 }), 180);
        setTimeout(() => { fire.reset(); canvas.remove(); }, 7000); return;
      }
      fire({ particleCount: islamic ? 110 : 105, spread: islamic ? 90 : 88, startVelocity: islamic ? 38 : 36, origin, colors: [...primary, ...secondary], scalar: islamic ? .95 : .9, ticks: 220 });
      setTimeout(() => fire({ particleCount: islamic ? 55 : 50, spread: islamic ? 130 : 120, startVelocity: islamic ? 26 : 24, origin, colors: olive ? [...secondary, ...primary] : primary, scalar: islamic ? 1.15 : 1.05, shapes: ['star'], ticks: islamic ? 260 : 250 }), islamic ? 180 : 170);
      setTimeout(() => { for (const direction of [-1, 1]) fire({ particleCount: islamic ? 35 : 28, angle: direction === -1 ? 60 : 120, spread: islamic ? 55 : 50, startVelocity: islamic ? 45 : 40, origin: { x: origin.x + direction * .13, y: origin.y }, colors: direction === -1 ? primary : secondary }); }, islamic ? 320 : 300);
      setTimeout(() => { fire.reset(); canvas.remove(); }, 7000);
    }
    observer = new IntersectionObserver(entries => { if (entries.some(e => e.isIntersecting)) start(); }, { threshold: .35 });
    observer.observe(grid);
    root.addEventListener('e:opened', () => { const r = grid.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0) start(); }, { once: true });
  };
}
