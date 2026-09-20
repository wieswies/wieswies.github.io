/*
  Subtly rotates the conic-gradient background as the user scrolls.
  Each page sets a distinct base rotation via --angle-base (see its
  inline <style>), and whichever element carries [data-gradient-scroll]
  drives the extra sway; falls back to the window when none is marked.
*/
(function () {
  var bg = document.querySelector(".gradient-bg");
  if (!bg) return;

  var source = document.querySelector("[data-gradient-scroll]") || window;
  var axis = source === window ? "y" : source.dataset.gradientScroll || "y";
  var range = 30; // degrees of sway across the full scroll range
  var ticking = false;

  function fraction() {
    if (source === window) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      return max > 0 ? window.scrollY / max : 0;
    }
    if (axis === "x") {
      var maxX = source.scrollWidth - source.clientWidth;
      return maxX > 0 ? source.scrollLeft / maxX : 0;
    }
    var maxY = source.scrollHeight - source.clientHeight;
    return maxY > 0 ? source.scrollTop / maxY : 0;
  }

  function update() {
    var f = Math.max(0, Math.min(1, fraction()));
    bg.style.setProperty("--scroll-shift", f * range + "deg");
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  source.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
