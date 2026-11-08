import { calendarMotion } from '../e-invitation-shared/calendar-motion.js';
export default function motion(state) {
  const { q, root, reduced, finish } = state;
  const intro = q('.section-intro'), video = q('.section-intro__video'); let watchdog;
  const complete = held => {
    clearTimeout(watchdog); video?.pause();
    intro.classList.add(held ? 'section-intro--held' : 'section-intro--hidden');
    intro.inert = true; intro.setAttribute('aria-hidden', 'true'); finish();
  };
  video.addEventListener('ended', () => complete(true));
  video.addEventListener('error', () => { if (intro.classList.contains('section-intro--opening')) complete(false); });
  video.addEventListener('playing', () => { clearTimeout(watchdog); watchdog = setTimeout(() => complete(false), 11000); });
  return {
    open() {
      intro.classList.add('section-intro--opening'); q('.section-intro__seal-button').disabled = true;
      if (reduced) { complete(false); return; }
      video.currentTime = 0;
      setTimeout(() => { intro.classList.add('section-intro--playing'); watchdog = setTimeout(() => complete(false), 15000); video.play().catch(() => complete(false)); }, 720);
    },
    skip() { complete(false); },
    calendar: calendarMotion({ id: 'olive-manor-edition', root, reduced, isOpened: () => state.opened }),
  };
}
