
(function() {
    /* --- Splash --- */
    const splash = document.getElementById('splash');
    const app = document.getElementById('app');
    const musicBtn = document.getElementById('musicBtn');

    document.getElementById('openBtn').addEventListener('click', function() {
        splash.classList.add('hide');
        app.style.display = 'block';
        document.body.style.overflow = 'auto';
        musicBtn.classList.add('show');
        setTimeout(function() { splash.style.display = 'none'; initReveal(); }, 900);
    });

    /* Prevent scroll while splash */
    document.body.style.overflow = 'hidden';

    /* --- Scroll Reveal --- */
    function initReveal() {
        var els = document.querySelectorAll('.reveal');
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) {
                    e.target.classList.add('visible');
                    obs.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });
        els.forEach(function(el) { obs.observe(el); });
    }

    /* --- Particles --- */
    var pc = document.getElementById('particles-container');
    for (var i = 0; i < 22; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.style.left = (Math.random() * 100) + '%';
        var size = 2 + Math.random() * 3.5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.setProperty('--pop', (0.12 + Math.random() * 0.28).toFixed(2));
        p.style.setProperty('--drift', ((Math.random() - 0.5) * 50) + 'px');
        p.style.setProperty('--dur', (12 + Math.random() * 14) + 's');
        p.style.setProperty('--delay', (-(Math.random() * 26)).toFixed(1) + 's');
        pc.appendChild(p);
    }

    /* --- Parallax Floating Botanicals --- */
    var floaters = document.querySelectorAll('.float-botanical');
    window.addEventListener('scroll', function() {
        var scrollY = window.scrollY || window.pageYOffset;
        floaters.forEach(function(el) {
            var speed = parseFloat(el.dataset.speed) || 0;
            var rot = el.dataset.rotate || '0';
            var y = scrollY * speed;
            el.style.transform = 'translateY(' + y + 'px) rotate(' + rot + 'deg)';
        });
    }, { passive: true });
})();
