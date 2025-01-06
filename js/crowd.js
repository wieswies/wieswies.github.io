fetch('vis/crowd_crop.svg')
  .then(response => response.text())
  .then(svgContent => {
    const container = document.getElementById('crowd-container');
    container.innerHTML = svgContent;

    const individualGroup = document.getElementById('individual');
    const paths = individualGroup.querySelectorAll('path');

    // Hover effects for color change
    individualGroup.addEventListener('mouseover', () => {
      paths.forEach(path => path.style.fill = 'rgb(243, 186, 28)');
    });

    individualGroup.addEventListener('mouseout', () => {
      paths.forEach(path => path.style.fill = 'rgb(67, 141, 198)');
    });

    // Click event to show the callout modal
    individualGroup.addEventListener('click', () => {
      // Fetch the callout SVG
      fetch('vis/callout.svg')
        .then(response => response.text())
        .then(calloutContent => {
          const calloutSvgContainer = document.getElementById('callout-svg');
          calloutSvgContainer.innerHTML = calloutContent;
        });

      // Show the modal
      const modal = document.getElementById('callout-modal');
      modal.style.display = 'flex';

      // Optionally change the text in the callout
      const calloutText = document.getElementById('callout-text');
      calloutText.innerHTML = 'stay tuned for more :)';
    });
  });

// Close the callout modal
document.getElementById('close-callout').addEventListener('click', () => {
  const modal = document.getElementById('callout-modal');
  modal.style.display = 'none';
});
