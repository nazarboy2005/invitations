import { calendarMotion } from '../e-invitation-shared/calendar-motion.js';
import { greetingLetters } from '../e-invitation-shared/greeting-motion.js';
export default function motion(state) {
  const { q, root, reduced, finish } = state;
  const intro = q('.section-xatna-intro');
  return {
    open() {
      intro.classList.add('section-xatna-intro--opening');
      q('.section-xatna-intro__button').disabled = true;
      setTimeout(() => { intro.hidden = true; finish(); }, reduced ? 0 : 1000);
    },
    skip() { intro.hidden = true; },
    calendar: calendarMotion({ id: 'xatna-edition', root, reduced, isOpened: () => state.opened }),
    text() {
      greetingLetters(q('[data-e-field="greeting"]'));
    },
  };
}
