/*
  Horizontal swipe through the three topic columns: whichever column
  sits nearest the center of the panel gets a minimal "active" highlight.
  Starts centered on the middle column, and each arrow hides itself
  once there's nothing further to scroll to in that direction.
*/
(function () {
  var scroller = document.querySelector(".pub-scroll");
  var cols = document.querySelectorAll(".pub-col");
  if (!scroller || !cols.length) return;

  var left = document.querySelector(".scroll-arrow--left");
  var right = document.querySelector(".scroll-arrow--right");
  var ticking = false;

  function updateActive() {
    var viewportCenter = scroller.getBoundingClientRect().left + scroller.clientWidth / 2;
    var closest = null;
    var closestDist = Infinity;

    cols.forEach(function (col) {
      var rect = col.getBoundingClientRect();
      var colCenter = rect.left + rect.width / 2;
      var dist = Math.abs(colCenter - viewportCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = col;
      }
    });

    cols.forEach(function (col) {
      col.classList.toggle("is-active", col === closest);
    });
  }

  function updateArrows() {
    var maxScroll = scroller.scrollWidth - scroller.clientWidth;
    if (left) left.classList.toggle("is-hidden", scroller.scrollLeft <= 2);
    if (right) right.classList.toggle("is-hidden", scroller.scrollLeft >= maxScroll - 2);
  }

  function update() {
    updateActive();
    updateArrows();
    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }

  function centerColumn(col, smooth) {
    if (!col) return;
    var scrollerRect = scroller.getBoundingClientRect();
    var colRect = col.getBoundingClientRect();
    var delta = colRect.left + colRect.width / 2 - (scrollerRect.left + scrollerRect.width / 2);
    // "auto" (not the CSS-only "smooth") explicitly overrides this
    // element's `scroll-behavior: smooth` for an immediate jump
    scroller.scrollBy({ left: delta, behavior: smooth ? "smooth" : "auto" });
  }

  scroller.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);

  // start centered on the middle column - re-run once everything (web
  // fonts especially) has actually finished loading and reflowed, since
  // an early measurement can drift off-center once layout settles
  var middle = cols[Math.floor(cols.length / 2)];
  function recenter() {
    centerColumn(middle, false);
    requestAnimationFrame(update);
  }
  recenter();
  window.addEventListener("load", recenter);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(recenter);
  }

  var step = function () {
    return Math.min(420, scroller.clientWidth * 0.6);
  };

  if (left) {
    left.addEventListener("click", function () {
      scroller.scrollBy({ left: -step(), behavior: "smooth" });
    });
  }
  if (right) {
    right.addEventListener("click", function () {
      scroller.scrollBy({ left: step(), behavior: "smooth" });
    });
  }

  // Per-column vertical paging: each column's own v / ^ buttons page
  // its .pub-box up/down (there's no drag/wheel scrolling left to
  // conflict with the page's own vertical scroll). The buttons hide
  // themselves entirely if a column's content already fits, and
  // disable at either end once there's nothing further to page to.
  cols.forEach(function (col) {
    var box = col.querySelector(".pub-box");
    var nav = col.querySelector(".pub-col-nav");
    if (!box || !nav) return;
    var down = nav.querySelector(".pub-col-arrow--down");
    var up = nav.querySelector(".pub-col-arrow--up");

    function refresh() {
      var scrollable = box.scrollHeight > box.clientHeight + 1;
      nav.classList.toggle("is-hidden", !scrollable);
      if (!scrollable) return;
      var maxScroll = box.scrollHeight - box.clientHeight;
      if (up) up.disabled = box.scrollTop <= 1;
      if (down) down.disabled = box.scrollTop >= maxScroll - 1;
    }

    function boxStep() {
      return box.clientHeight * 0.85;
    }

    if (down) {
      down.addEventListener("click", function () {
        box.scrollBy({ top: boxStep(), behavior: "smooth" });
      });
    }
    if (up) {
      up.addEventListener("click", function () {
        box.scrollBy({ top: -boxStep(), behavior: "smooth" });
      });
    }

    box.addEventListener(
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
