import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useControls } from "leva";
import { DoubleSide } from "three";
import { useMemo } from "react";
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
export function shrinkTriangle(a, b, c, border) {
    // Compute centroid to determine proper inward directions.
    const centroid = new Vector3().add(a).add(b).add(c).multiplyScalar(1 / 3);
    function inset(vertex, v1, v2) {
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
export const ComplexFaces = ({ faces, selectedReps, toggleRepSelection, setDragSelectData, dragSelectData: { isMouseDown, dimSelected } }) => {
    const { faceOpacity } = useControls({ faceOpacity: { value: 0.5, min: 0, max: 1 } });
    const g = useMemo(() => (_jsx("group", { renderOrder: 0, children: faces.map((face) => {
            // Determine if the face is selected
            const isSelected = Array.from(selectedReps).some((cell) => face === cell);
            const color = isSelected ? 'red' : 'blue';
            // Get the vertices from the attaching map
            let vertices;
            try {
                vertices = face.vertices; //face.attachingMap.map((edge) => edge.attachingMap).flat();
            }
            catch (e) {
                console.error("Error getting vertices from face", e);
                throw e;
            }
            // filter to unique
            vertices = vertices.filter((v, i) => vertices.indexOf(v) === i);
            // Convert vertices to a flat array
            const vertexPositions = vertices.map(v => v.point);
            //  console.log("orthocenter", computeOrthocenter3D(vertexPositions.map(pos => new Vector3(...pos))));
            const [p1, p2, p3] = vertexPositions;
            const [p1_, p2_, p3_] = shrinkTriangle(new Vector3(...p1), new Vector3(...p2), new Vector3(...p3), 0.042);
            return (_jsxs("mesh", { renderOrder: -1, 
                // This has to be a bad idea
                onPointerDown: (e) => {
                    // e.simplicesEncountered ??= [] as AbstractCell[];
                    // e.simplicesEncountered.push(face);
                    // console.log("click", e.simplicesEncountered);
                    console.notify("Click", face);
                    toggleRepSelection(face.key);
                }, children: [_jsx("bufferGeometry", { children: _jsx("bufferAttribute", { attach: "attributes-position", array: new Float32Array([...p1_, ...p2_, ...p3_].flat()), count: vertexPositions.flat().length / 3, itemSize: 3, needsUpdate: true }) }), _jsx("meshStandardMaterial", { depthTest: false, color: color, side: DoubleSide, opacity: faceOpacity, transparent: faceOpacity < 1, needsUpdate: true })] }, face.id + face.positionKey));
        }) })), [faces, selectedReps, toggleRepSelection, faceOpacity]);
    return g;
};
