/*
  Up/down arrow buttons for the project card list, plus centering the
  hovered/focused card vertically within the scroll area (the
  widening-on-hover effect itself is pure CSS, see projects.html).
*/
(function () {
  var scroller = document.querySelector(".proj-scroll");
  if (!scroller) return;

  var up = document.querySelector(".scroll-arrow--up");
  var down = document.querySelector(".scroll-arrow--down");
  var step = function () {
    return Math.min(320, scroller.clientHeight * 0.6);
  };

  if (up) {
    up.addEventListener("click", function () {
      scroller.scrollBy({ top: -step(), behavior: "smooth" });
    });
  }
  if (down) {
    down.addEventListener("click", function () {
      scroller.scrollBy({ top: step(), behavior: "smooth" });
    });
  }

  function centerCard(card) {
    var scrollerRect = scroller.getBoundingClientRect();
    var cardRect = card.getBoundingClientRect();
    var delta = cardRect.top + cardRect.height / 2 - (scrollerRect.top + scrollerRect.height / 2);
    scroller.scrollBy({ top: delta, behavior: "smooth" });
  }

  document.querySelectorAll(".proj-card").forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      centerCard(card);
    });
    card.addEventListener("focusin", function () {
      centerCard(card);
    });
    card.addEventListener("transitionend", function (e) {
      if (e.propertyName === "width" && card.matches(":hover, :focus-within")) {
        centerCard(card);
      }
    });
  });
})();
