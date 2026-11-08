export default function motion({ q, reduced, finish }) {
  const intro = q('.section-intro');
  return {
    open() {
      intro.classList.add('section-intro--opening');
      if (reduced) { intro.hidden = true; finish(); return; }
      setTimeout(() => {
        intro.classList.add('section-intro-fade-leave-active');
        requestAnimationFrame(() => intro.classList.add('section-intro-fade-leave-to'));
        setTimeout(() => { intro.hidden = true; finish(); }, 650);
      }, 920);
    },
    skip() { intro.hidden = true; },
  };
}
