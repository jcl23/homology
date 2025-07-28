

export function generateParabolaAnimationPath(parabolaParams, width, height, steps, duration) {
  const samplePoints = steps;

  function generatePath(a, h, k) {
    const points = [];
    for (let i = 0; i <= samplePoints; i++) {
      const x = (i / samplePoints) * width;
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

  // Generate all keyframe paths
  const keyframePaths = parabolaParams.map(params => {
    const [a, h, k] = params;
    return generatePath(a, h, k);
  });

  // Create values string for animation
  const valuesString = keyframePaths.join(';');

  // Generate keyTimes (evenly distributed)
  const keyTimes = parabolaParams.map((_, index) => 
    (index / (parabolaParams.length - 1)).toFixed(2)
  ).join(';');

 const path = (

   <path fill="none" stroke="black" stroke-width="2" d={keyframePaths[0]}>
    <animate 
      attributeName="d" 
      values={valuesString} 
      keyTimes={keyTimes}
      dur={duration + 's'}
      repeatCount="indefinite"
      calcMode="spline"
      keySplines={generateKeySplines(parabolaParams.length)} />
  </path>
    )
  return path;
}

function generateKeySplines(numKeyframes) {
  // Generate smooth easing between keyframes
  const splineCount = numKeyframes - 1;
  const spline = "0.4 0 0.6 1"; // ease-in-out
  return Array(splineCount).fill(spline).join(';');
}


const parab1 = generateParabolaAnimationPath(
  [
    [-0.01, 120, 90],   // Start parabola (nearly flat)
    [0.01, 80, 110],    // End parabola (curved)
    [-0.01, 120, 90]    // Back to start for smooth loop
  ],
  200, 200,     // width, height
  50,           // steps
  2,            // duration
  t => Math.sqrt(t)  // scale function
);

console.log(parab1);
