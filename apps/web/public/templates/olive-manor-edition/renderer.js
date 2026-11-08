import { mount } from '../e-invitation-shared/runtime.js';
import motion from './motion.js';
mount('olive-manor-edition', motion).catch(error => { console.error(error); document.body.style.visibility = 'visible'; document.getElementById('invitation').textContent = 'Taklifnoma yuklanmadi. Sahifani yangilang.'; });
