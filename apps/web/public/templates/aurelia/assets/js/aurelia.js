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

        // RSVP and wishes are bound by aurelia-adapter.js to the platform APIs.
