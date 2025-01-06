fetch('vis/crowd_crop.svg')
  .then(response => response.text())
  .then(svgContent => {
    const container = document.getElementById('svg-container');
    container.innerHTML = svgContent;

    const individualGroup = document.getElementById('individual');

    // Add hover effect as a fallback
    const paths = individualGroup.querySelectorAll('path');
    individualGroup.addEventListener('mouseover', () => {
      paths.forEach(path => path.style.fill = 'rgb(243, 186, 28)');
    });
    individualGroup.addEventListener('mouseout', () => {
      paths.forEach(path => path.style.fill = 'rgb(67, 141, 198)');
    });

    // Add click event
    individualGroup.addEventListener('click', () => {
      alert('You clicked the individual!');
    });
  });
