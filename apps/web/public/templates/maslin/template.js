(function () {
  "use strict";

  function init() {
    var venueBrand = document.querySelector('[data-slot="venue.brand"]');
    var venue = window.Marhamat && window.Marhamat.data && window.Marhamat.data.venue;
    if (venueBrand && venue && !venue.brand) venueBrand.textContent = venue.name || "";

    var intro = document.getElementById("intro");
    var openButton = document.getElementById("open-invitation");
    var opening = false;
    var finishTimer = 0;

    function finishOpening() {
      window.clearTimeout(finishTimer);
      document.documentElement.classList.remove("is-locked");
      document.body.classList.remove("is-opening");
      document.body.classList.add("is-open");
      if (window.Marhamat && typeof window.Marhamat.open === "function") {
        window.Marhamat.open();
      }
      if (intro) {
        intro.hidden = true;
        intro.setAttribute("aria-hidden", "true");
      }
    }

    function openInvitation() {
      if (opening) return;
      opening = true;
      var reduced = window.Marhamat && window.Marhamat.reducedMotion;
      document.body.classList.add("is-opening");
      finishTimer = window.setTimeout(finishOpening, reduced ? 0 : 1360);
    }

    if (openButton) openButton.addEventListener("click", openInvitation);
    if (intro) {
      intro.addEventListener("click", function (event) {
        if (!event.target.closest("button")) openInvitation();
      });
    }

    if (window.Marhamat && typeof window.Marhamat.on === "function") {
      window.Marhamat.on("rsvp", function (answer) {
        if (!answer || answer.status !== "yes" || window.Marhamat.reducedMotion) return;
        var ornament = document.querySelector("[data-rsvp-done] .ornament");
        if (ornament && typeof ornament.animate === "function") {
          ornament.animate(
            [{ transform: "scale(.65) rotate(-25deg)", opacity: .4 }, { transform: "scale(1.2) rotate(10deg)", opacity: 1 }, { transform: "scale(1) rotate(0)" }],
            { duration: 720, easing: "cubic-bezier(.2,.8,.2,1)" }
          );
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
