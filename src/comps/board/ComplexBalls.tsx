import { useControls } from "leva";
import { DoubleSide } from "three";
import { AbstractBall, AbstractFace, AbstractVertex } from "../../math/classes/cells";
import { CellsProps } from "./cellProps";
import { useMemo } from "react";

type ComplexBallsProps = CellsProps & {
    balls: AbstractBall[];
};

import { Vector3 } from "three";

/**
 * Returns a new triangle inset from the original by a fixed border width.
 * Uses the angle–bisector method: for each vertex, the inward bisector is scaled by d / sin(θ/2)
 *
 * @param a First vertex of the triangle.
 * @param b Second vertex.
 * @param c Third vertex.
 * @param border The fixed inset width.
 * @returns A triple of new vertices.
 */
export function shrinkTriangle(a: Vector3, b: Vector3, c: Vector3, border: number): [Vector3, Vector3, Vector3] {
    // Compute centroid to determine proper inward directions.
    const centroid = new Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);

    function inset(vertex: Vector3, v1: Vector3, v2: Vector3): Vector3 {
        const e1 = new Vector3().subVectors(v1, vertex).normalize();
        const e2 = new Vector3().subVectors(v2, vertex).normalize();
        // Compute the bisector between edges.
        let bisector = new Vector3().addVectors(e1, e2).normalize();
        // Ensure bisector points from the vertex toward the triangle's interior.
        if (new Vector3().subVectors(centroid, vertex).dot(bisector) < 0) {
            bisector.negate();
        }
        // Angle at the vertex.
        const angle = Math.acos(e1.dot(e2));
        // Compute the distance to move along the bisector,
        // so that the perpendicular offset equals the border width.
        const offsetDistance = border / Math.sin(angle / 2);
        return vertex.clone().add(bisector.multiplyScalar(offsetDistance));
    }

    return [inset(a, b, c), inset(b, c, a), inset(c, a, b)];
}

export const shrinkTetrahedron = (a: Vector3, b: Vector3, c: Vector3, d: Vector3, border: number): [Vector3, Vector3, Vector3, Vector3] => {
    // Compute centroid to determine proper inward directions.
    const centroid = new Vector3().add(a).add(b).add(c).add(d).multiplyScalar(1 / 4);

    function inset(vertex: Vector3, v1: Vector3, v2: Vector3, v3: Vector3): Vector3 {
        const e1 = new Vector3().subVectors(v1, vertex).normalize();
        const e2 = new Vector3().subVectors(v2, vertex).normalize();
        const e3 = new Vector3().subVectors(v3, vertex).normalize();
        // Compute the bisector between edges.
        let bisector = new Vector3().addVectors(e1, e2).add(e3).normalize();
        // Ensure bisector points from the vertex toward the tetrahedron's interior.
        if (new Vector3().subVectors(centroid, vertex).dot(bisector) < 0) {
            bisector.negate();
        }
        // Angle at the vertex.
        const angle = Math.acos(e1.dot(e2)) + Math.acos(e2.dot(e3)) + Math.acos(e3.dot(e1));
        // Compute the distance to move along the bisector,
        // so that the perpendicular offset equals the border width.
        const offsetDistance = border / Math.sin(angle / 2);
        return vertex.clone().add(bisector.multiplyScalar(offsetDistance));
    }

    return [inset(a, b, c, d), inset(b, c, d, a), inset(c, d, a, b), inset(d, a, b, c)];
}

export const ComplexBalls = ({ balls, selectedReps, toggleRepSelection, setDragSelectData, dragSelectData: { isMouseDown, dimSelected} }: ComplexBallsProps) => {
    const {ballOpacity} = useControls({ ballOpacity: { value: 0.5, min: 0, max: 1 } });
    const g = useMemo(() => (
        <group renderOrder={0}>
            {balls.map((ball) => {
                // Determine if the face is selected
                const isSelected = Array.from(selectedReps).some((cell) =>
                    ball === cell
                );
                const color = isSelected ? 'purple' : 'yellow';

                // Get the vertices from the attaching map
                let vertices: AbstractVertex[];
                try {
                    vertices = ball.vertices; //face.attachingMap.map((edge) => edge.attachingMap).flat();
                } catch (e) {
                    console.error("Error getting vertices from ball", e);
                    throw e;
                }
                // filter to unique
                vertices = vertices.filter((v, i) => vertices.indexOf(v) === i);
                // Convert vertices to a flat array
                const vertexPositions = vertices.map(v => v.point);
               //  console.log("orthocenter", computeOrthocenter3D(vertexPositions.map(pos => new Vector3(...pos))));
               const [p1_, p2_, p3_, p4_] = vertexPositions;
               const [p1, p2, p3, p4] = shrinkTetrahedron(new Vector3(...p1_), new Vector3(...p2_), new Vector3(...p3_), new Vector3(...p4_), 0.042);
            // const [p1_, p2_, p3_, p4_] = shrinkTriangle(new Vector3(...p1), new Vector3(...p2), new Vector3(...p3),0.042);
                
               return (
                    <mesh
                        renderOrder={-1000}
                        key={ball.id + ball.positionKey}
                        onPointerDown={(e) => { 
                           console.notify("Click", balls);
                            // toggleRepSelection(ball.key); 
                        }}
                    >
                        <bufferGeometry>
                            <bufferAttribute
                                attach="attributes-position"
                                array={new Float32Array([
                                    ...p1, ...p2, ...p3,
                                    ...p1, ...p3, ...p4,
                                    ...p1, ...p4, ...p2,
                                    ...p2, ...p4, ...p3
                                ])}
                                count={12}
                                itemSize={3}
                            />
                        </bufferGeometry>
                        <meshStandardMaterial 
                            color={color} 
                            side={DoubleSide} 
                            opacity={ballOpacity} 
                            // transparent={ballOpacity < 1}
                            wireframe={false}
                        />
                    </mesh>
                );
            })}
        </group>
    ), [balls, selectedReps, toggleRepSelection, ballOpacity]);
    return g;
}