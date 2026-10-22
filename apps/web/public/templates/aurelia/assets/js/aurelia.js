        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('preloader').classList.add('hide');
            }, 1000);
        });

        /* ---------- countdown ---------- */
        let targetDate = new Date(window.__AURELIA_DATA?.dateTime || 0);
        window.addEventListener('aurelia:data', event => { targetDate = new Date(event.detail?.dateTime || 0); updateCountdown(); });
        function pad(n) { return String(n).padStart(2, '0'); }
        function updateCountdown() {
            const now = new Date();
            let diff = targetDate - now;
            if (diff < 0) diff = 0;
            document.getElementById('cd-days').textContent = pad(Math.floor(diff / 86400000));
            document.getElementById('cd-hours').textContent = pad(Math.floor((diff / 3600000) % 24));
            document.getElementById('cd-mins').textContent = pad(Math.floor((diff / 60000) % 60));
            document.getElementById('cd-secs').textContent = pad(Math.floor((diff / 1000) % 60));
        }
        updateCountdown();
        setInterval(updateCountdown, 1000);

        /* ---------- RSVP ---------- */
        const rsvpName = document.getElementById('rsvpName');
        const rsvpYes = document.getElementById('rsvpYes');
        const rsvpNo = document.getElementById('rsvpNo');
        const rsvpError = document.getElementById('rsvpError');
        const rsvpForm = document.getElementById('rsvpForm');
        const rsvpSent = document.getElementById('rsvpSent');
        const rsvpGuestName = document.getElementById('rsvpGuestName');
        const rsvpMsgYes = document.getElementById('rsvpMsgYes');
        const rsvpMsgNo = document.getElementById('rsvpMsgNo');

        [rsvpName, rsvpYes, rsvpNo].forEach(el => {
            el.addEventListener('input', () => rsvpError.style.display = 'none');
            el.addEventListener('change', () => rsvpError.style.display = 'none');
        });

        document.getElementById('rsvpSubmit').addEventListener('click', () => {
            const name = rsvpName.value.trim();
            const answer = rsvpYes.checked ? 'yes' : (rsvpNo.checked ? 'no' : '');
            if (!name || !answer) {
                rsvpError.style.display = 'block';
                return;
            }
            rsvpGuestName.textContent = name;
            rsvpMsgYes.style.display = answer === 'yes' ? 'block' : 'none';
            rsvpMsgNo.style.display = answer === 'no' ? 'block' : 'none';
            rsvpForm.style.display = 'none';
            rsvpSent.style.display = 'block';
        });

        document.getElementById('rsvpReset').addEventListener('click', () => {
            rsvpName.value = '';
            rsvpYes.checked = false;
            rsvpNo.checked = false;
            document.getElementById('rsvpWish').value = '';
            rsvpError.style.display = 'none';
            rsvpSent.style.display = 'none';
            rsvpForm.style.display = 'flex';
        });
