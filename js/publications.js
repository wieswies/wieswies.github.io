/*
  Scientific projects page: the three research-area titles are buttons.
  Nothing is open at first. Clicking a title promotes it (bigger,
  inverted) and opens the narrow box of that area's projects below;
  clicking the same title again closes the box. While the box is open,
  the < > buttons beside it (and the left/right arrow keys on a focused
  title) move to the previous / next research area.
  The box's own v / ^ buttons page it up and down - there's no
  drag/wheel scrolling to conflict with the page's own vertical scroll.
  The v / ^ buttons stay visible; one just goes inactive when there's
  nothing further to page to in that direction.
*/
(function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".col-title"));
  var viewer = document.querySelector(".pub-viewer");
  var box = document.querySelector(".pub-box");
  if (!tabs.length || !viewer || !box) return;

  var left = viewer.querySelector(".scroll-arrow--left");
  var right = viewer.querySelector(".scroll-arrow--right");
  var down = viewer.querySelector(".pub-col-arrow--down");
  var up = viewer.querySelector(".pub-col-arrow--up");
  var current = -1; // index of the open research area, -1 = box closed

  function refresh() {
    var maxScroll = box.scrollHeight - box.clientHeight;
    if (up) up.disabled = maxScroll <= 1 || box.scrollTop <= 1;
    if (down) down.disabled = maxScroll <= 1 || box.scrollTop >= maxScroll - 1;
  }

  function show(index) {
    current = index;
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.setAttribute("aria-expanded", on ? "true" : "false");
      var panel = document.getElementById(tab.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
    });
    viewer.classList.toggle("is-open", index >= 0);
    if (left) left.classList.toggle("is-hidden", index <= 0);
    if (right) right.classList.toggle("is-hidden", index < 0 || index >= tabs.length - 1);
    box.scrollTop = 0;
    refresh();
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () {
      show(current === i ? -1 : i);
    });
    tab.addEventListener("keydown", function (e) {
      var dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      var next = tabs[i + dir];
      if (!dir || !next) return;
      e.preventDefault();
      if (current >= 0) show(i + dir);
      next.focus();
    });
  });

  if (left) {
    left.addEventListener("click", function () {
      if (current > 0) show(current - 1);
    });
  }
  if (right) {
    right.addEventListener("click", function () {
      if (current >= 0 && current < tabs.length - 1) show(current + 1);
    });
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
  show(-1);
})();
