/*
  Conference presentations page: each conference's row of entries is
  paged with its own small < / > buttons instead of drag/wheel/touch
  swiping - that swipe used to get mistaken for the page's own
  vertical scroll and swallow it. A row's buttons hide themselves
  entirely once its entries already fit without scrolling, and
  disable individually once there's nothing further to page to in
  that direction.
*/
(function () {
  document.querySelectorAll("[data-conf-entries]").forEach(function (entries) {
    var frame = entries.closest(".conf-entries-frame");
    var nav = frame ? frame.querySelector(".conf-row-nav") : null;
    if (!nav) return;

    var prev = nav.querySelector(".conf-row-arrow--prev");
    var next = nav.querySelector(".conf-row-arrow--next");

    function step() {
      var first = entries.querySelector(".conf-entry:not(.conf-entry--spacer)");
      return first ? first.getBoundingClientRect().width + 16 : entries.clientWidth * 0.85;
    }

    function refresh() {
      var maxScroll = entries.scrollWidth - entries.clientWidth;
      var scrollable = maxScroll > 1;
      nav.classList.toggle("is-hidden", !scrollable);
      if (!scrollable) return;
      if (prev) prev.disabled = entries.scrollLeft <= 1;
      if (next) next.disabled = entries.scrollLeft >= maxScroll - 1;
    }

    if (next) {
      next.addEventListener("click", function () {
        entries.scrollBy({ left: step(), behavior: "smooth" });
      });
    }
    if (prev) {
      prev.addEventListener("click", function () {
        entries.scrollBy({ left: -step(), behavior: "smooth" });
      });
    }

    entries.addEventListener(
      "scroll",
      function () {
        requestAnimationFrame(refresh);
      },
      { passive: true }
    );
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    refresh();
  });
})();
