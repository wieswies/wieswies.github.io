// Turns links "off" until their target really exists.
(function () {
  var style = document.createElement('style');
  style.textContent = 'a.is-disabled{opacity:.35;cursor:default;pointer-events:none}';
  document.head.appendChild(style);

  function disable(a) {
    a.removeAttribute('href');
    a.removeAttribute('download');
    a.classList.add('is-disabled');
    a.setAttribute('aria-disabled', 'true');
    a.setAttribute('title', 'Coming soon');
  }

  // PDFs: active only if the file exists on the server
  document.querySelectorAll('a[href^="downloads/"]').forEach(function (a) {
    fetch(a.getAttribute('href'), { method: 'HEAD' })
      .then(function (r) { if (!r.ok) disable(a); })
      .catch(function () { disable(a); });
  });

  // YouTube: active only once the URL is no longer a placeholder
  document.querySelectorAll('a[href*="youtube.com"]').forEach(function (a) {
    if (/XXXXXXXX|your-channel/.test(a.getAttribute('href'))) disable(a);
  });
})();
