export const nearestTriangularLatticePoint = function(
    x: number,
    y: number,
    sideLength: number,
    radius: number
): { qx: number; qy: number } | null {
    const s = sideLength, r2 = radius * radius, sqrt3 = Math.sqrt(3);

    // Transform to lattice coords
    const u = (x - y / sqrt3) / s;
    const v = (2 * y / sqrt3) / s;

    // Base guess
    const m0 = Math.round(u), n0 = Math.round(v);

    // Neighbors (center + 6 Voronoi neighbors)
    const offsets: [number, number][] = [
        [0, 0], [1, 0], [-1, 0],
        [0, 1], [0, -1], [1, -1], [-1, 1]
    ];

    let best: { qx: number; qy: number } | null = null;
    let bestD2 = Infinity;

    for (const [dm, dn] of offsets) {
        const m = m0 + dm, n = n0 + dn;
        const qx = s * (m + 0.5 * n);
        const qy = s * (sqrt3 / 2) * n;
        const d2 = (qx - x) ** 2 + (qy - y) ** 2;
        if (d2 < bestD2) {
            bestD2 = d2;
            best = { qx, qy };
        }
    }
    if (!best) return null;
    if (sideLength < bestD2) return null;

    // return bestD2 <= sideLength ? best : null;
    /* lines
    y > radius * sideLength - sqrt(3) / 2 * x
    y > radius * sideLength + sqrt(3) / 2 * x
    x < radius * sideLength
    x > -radius * sideLength
    y > -radius * sideLength + sqrt(3) / 2 * x
    y < -radius * sideLength - sqrt(3) / 2 * x
    */
    const c = sqrt3 / 2;
    if (
 
        best.qy > radius * c * sideLength ||
        best.qy < -radius * c * sideLength 
       || best.qx > radius * sideLength - best.qy / sqrt3
        || best.qx < -radius * sideLength + best.qy / sqrt3
        || best.qx > radius * sideLength + best.qy / sqrt3
        || best.qx < -radius * sideLength - best.qy / sqrt3
        // || 

        // best.qx > radius * sideLength + (sqrt3 / 2) * best.qy ||
        // best.qx < -radius * sideLength - (sqrt3 / 2) * best.qy ||
        // best.qx >  radius * sideLength - (sqrt3 / 2) * best.qy ||
        // best.qx < -radius * sideLength + (sqrt3 / 2) * best.qy
    ) {
        return null;
    }
    return best;

}

import { Line } from "@react-three/drei";
import { Vector3 } from "three";

type TriangleGridProps = {
    radius: number;
    sideLength: number;
};


const TriangleGrid = ({ radius, sideLength }: TriangleGridProps) => {
    const lines = [];
    const sqrt3 = Math.sqrt(3);
    // hex
    // create the boudnary of our hexagon. If our radius is 5, then we have 5 * 6 points on the edge.
    // let's make the edge:
    const outerPoints: [number, number, number][] = [];
    const ps = radius * 6;
    // hex with sidelength radius * sidelength
    const hexCorners = Array(6).fill(0).map((_, i) => {
        const angle = (i * Math.PI) / 3;
        return [
            radius * sideLength * Math.cos(angle),
            radius * sideLength * Math.sin(angle)
        ];
    });

    for (let j = 0; j < 6; j++) {
        let from = hexCorners[j];
        let to = hexCorners[(j + 1) % 6];
        for (let i = 0; i < radius; i++) {
            const x = from[0] + (to[0] - from[0]) * (i / radius);
            const y = from[1] + (to[1] - from[1]) * (i / radius);
            outerPoints.push([x, 0, y]);
        }
    }

    for (let i = 0; i < 6; i++) {
        const startStart = radius  * i;
        const startEnd = (radius  * (i + 1)) % ps;
        for (let i = 0; i <radius + 1; i++) {
            lines.push([
                outerPoints[(startStart - i) % ps],
                outerPoints[(startEnd + i) % ps]
            ])
        }
    }
    return (
        <>
            <Line key="1" points={[[5, 0, -radius * Math.sqrt(3) / 2 * sideLength],[-5, 0, -radius * Math.sqrt(3) / 2 * sideLength]]} color="red" lineWidth={5} />
            {lines.map((line, index) => (
                <Line key={index} points={line} color="lightgray" lineWidth={1} />
            ))}
        </>
    );
}



// TODO extend this to make it possible to be hexagonal!
// const TriangleGrid = ({ gridSize, gridExtent }: TriangleGridProps) => {
//     const lines = [];
//     for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
//       lines.push([
//         [-gridExtent, 0, i],
//         [gridExtent, 0, i],
//       ]);
//       lines.push([
//         [i, 0, -gridExtent],
//         [i, 0, gridExtent],
//       ]);
//     }
  
//     return (
//       <>
//         {lines.map((line, index) => (
//           <Line key={index} points={line} color="lightgray" lineWidth={1}  />
//         ))}
//       </>
//     );
//   };

  export default TriangleGrid;