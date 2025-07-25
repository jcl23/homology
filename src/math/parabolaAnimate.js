// vertex-parabola-animation.js

import fs from 'fs';

function generateParabolaAnimationPath(a1, h1, k1, a2, h2, k2, width, height, steps, duration, scalef) {
  const samplePoints = steps;

  function generatePath(a, h, k) {
    const points = [];
    for (let i = 0; i <= samplePoints; i++) {
      const x = scalef(i / samplePoints) * width;
      const y = a * Math.pow(x - h, 2) + k;
      const svgY = height - y; 
      points.push({ x, y: svgY });
    }

    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 1; i < points.length; i++) {
      d += ` L ${points[i].x.toFixed(2)} ${points[i].y.toFixed(2)}`;
    }
    return d;
  }

  const d1 = generatePath(a1, h1, k1);
  const d2 = generatePath(a2, h2, k2);

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <path fill="none" stroke="black" stroke-width="2" d="${d1}">
    <animate attributeName="d" from="${d1}" to="${d2}" dur="${duration}s" repeatCount="indefinite" />
  </path>
</svg>
`.trim();

  return svg;
}


const parab1 = generateParabolaAnimationPath(
  -0.01, 120, 90,   
  0.01, 80, 110, 
  200, 200,     
  50,            
  2,               
  t => Math.sqrt(t)
);

console.log(parab1);
