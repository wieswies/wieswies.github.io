/*
  Orchestrates the single scrolling page:
  - auto-creates a "coming soon" placeholder section for any top-left
    menu link that doesn't have a matching section yet, so expanding
    the site is just: add <a href="#your-slug">label</a> to .menu -
    the section (and its scroll/highlight behavior) appears for free
  - smooth-scrolls to a section when its menu link is clicked
  - highlights the menu entry for whichever section is currently in view,
    driven directly off scroll position (not IntersectionObserver, which
    proved unreliable during fast/instant scrolling and scrolling up)
  - fades the small corner brand mark in once the hero is scrolled past
  - interpolates the gradient's base angle across the whole scroll,
    from each section's own data-angle to the next
  Hidden sections are excluded automatically since they carry the
  `hidden` attribute.
*/
(function () {
  var container = document.querySelector(".scroll-container");
  var bg = document.querySelector(".gradient-bg");
  var menuLinks = document.querySelectorAll(".menu a");
  var cornerBrand = document.querySelector(".brand--corner");
  var hero = document.getElementById("opening");
  var contactSection = document.getElementById("contact");

  // bootstrap: any menu link pointing at a section that doesn't exist
  // yet gets one created automatically, inserted right before contact
  // (so contact + the footer inside it always stay last)
  menuLinks.forEach(function (link) {
    var href = link.getAttribute("href") || "";
    if (href.charAt(0) !== "#") return;
    var id = href.slice(1);
    if (!id || document.getElementById(id)) return;

    var section = document.createElement("section");
    section.className = "section";
    section.id = id;
    section.dataset.angle = "200";

    var wrap = document.createElement("div");
    wrap.className = "placeholder-wrap";
    var text = document.createElement("p");
    text.className = "placeholder-text";
    text.textContent = link.textContent.trim() + " — coming soon.";
    wrap.appendChild(text);
    section.appendChild(wrap);

    if (contactSection && contactSection.parentNode) {
      contactSection.parentNode.insertBefore(section, contactSection);
    } else if (container) {
      container.appendChild(section);
    }
  });

  var sections = Array.prototype.slice.call(document.querySelectorAll(".section:not([hidden])"));

  if (!container || !sections.length) return;

  menuLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href").slice(1);
      var target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  var angles = sections.map(function (s) {
    return parseFloat(s.dataset.angle || "200");
  });

  var ticking = false;

  function currentIndex() {
    var scrollTop = container.scrollTop;
    var mid = scrollTop + container.clientHeight / 2;
    var idx = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= mid) idx = i;
    }
    return idx;
  }

  function update() {
    var scrollTop = container.scrollTop;
    var idx = currentIndex();
    var current = sections[idx];

    // menu: highlight whichever section holds the viewport's vertical
    // center; none active while that's the hero (no menu entry for it)
    var activeId = current === hero ? null : current.id;
    menuLinks.forEach(function (link) {
      link.classList.toggle("active", activeId !== null && link.getAttribute("href") === "#" + activeId);
    });

    // corner brand: visible as soon as the hero has scrolled out of the
    // very top of the viewport
    if (cornerBrand) {
      cornerBrand.classList.toggle("is-visible", scrollTop > container.clientHeight * 0.5);
    }

    // gradient: interpolate this section's angle towards the next one
    // based on how far scrolled into it we are
    if (bg) {
      var next = sections[idx + 1];
      var angle = angles[idx];
      if (next) {
        var span = next.offsetTop - current.offsetTop;
        var progress = span > 0 ? (scrollTop - current.offsetTop) / span : 0;
        progress = Math.max(0, Math.min(1, progress));
        angle += (angles[idx + 1] - angles[idx]) * progress;
      }
      bg.style.setProperty("--angle-base", angle + "deg");
    }

    ticking = false;
  }

  container.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  window.addEventListener("resize", update);
  update();
})();
