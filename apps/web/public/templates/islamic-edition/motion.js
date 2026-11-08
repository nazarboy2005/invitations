import { calendarMotion } from '../e-invitation-shared/calendar-motion.js';
import { stars } from './stars.js';
import { greetingLetters } from '../e-invitation-shared/greeting-motion.js';
export default function motion(state) {
  const { q, root, reduced, finish } = state;
  const intro = q('.section-intro'), video = q('.section-intro__video'); let watchdog;
  stars(root, reduced);
  function complete(held) {
    clearTimeout(watchdog); video?.pause();
    if (held) intro.classList.add('section-intro--complete'); else intro.hidden = true;
    intro.inert = true; intro.setAttribute('aria-hidden', 'true'); finish();
  }
  video.addEventListener('ended', () => complete(true));
  video.addEventListener('error', () => { if (intro.classList.contains('section-intro--playing')) complete(false); });
  return {
    open() {
      intro.classList.add('section-intro--playing');
      if (reduced) { complete(false); return; }
      video.currentTime = 0; watchdog = setTimeout(() => complete(false), 15000);
      video.play().catch(() => complete(false));
    },
    skip() { complete(false); },
    calendar: calendarMotion({ id: 'islamic-edition', root, reduced, isOpened: () => state.opened }),
    text() {
      greetingLetters(q('[data-e-field="greeting"]'));
    },
  };
}
