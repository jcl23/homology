import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useControls } from "leva";
import { useState } from "react";
import { Vector3, ArrowHelper, Color, CylinderGeometry, Mesh, MeshStandardMaterial } from "three";
import Label from "./Label";
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
export const ComplexEdges = ({ mode, edges, selectedReps, toggleRepSelection, showName, setDragSelectData, dragSelectData: { isMouseDown, dimSelected, deselecting } }) => {
    const { edgeOpacity } = useControls({ edgeOpacity: { value: 0.5, min: 0, max: 1 } });
    // const [hovered, setHovered] = useState<AbstractEdge | null>(null);
    const [hovered, setHovered] = useState(null);
    return (_jsx("group", { renderOrder: 5, children: edges.map((edge) => {
            const isSelected = Array.from(selectedReps).some(cell => cell === edge);
            const color = isSelected ? selectedBg : unselectedFg;
            const [start, end] = edge.attachingMap.map((vertex) => new Vector3(...vertex.point));
            const middle = new Vector3().addVectors(start, end).multiplyScalar(0.5);
            const direction = new Vector3().subVectors(end, start).normalize();
            const length = new Vector3().subVectors(end, start).length();
            // Create ArrowHelper
            const arrow = new ArrowHelper(direction.normalize(), start, length, new Color(color), 0.15, 0.09);
            // cylinder
            const cylinder = new CylinderGeometry(2, 2, 1, 4, 5).translate(0, 0.5, 0).rotateX(Math.PI * 0.5);
            const randomColor = "green";
            //const outerOpacity = hovered === edge ? edgeOpacity / 2 : 0;
            const outerOpacity = edgeOpacity;
            const mesh = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: outerOpacity, transparent: true }));
            mesh.scale.set(0.025, 0.021, length);
            mesh.rotateZ(Math.PI / 2);
            mesh.position.copy(start);
            mesh.lookAt(end);
            const copy = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: outerOpacity, transparent: false }));
            copy.scale.set(0.005, 0.005, length);
            copy.rotateZ(Math.PI / 2);
            copy.position.copy(start);
            copy.lookAt(end);
            // Customize the ArrowHelper
            arrow.setColor(new Color(color)); // Set the color of the arrow
            arrow.line.material.linewidth = 4; // Set the line width (only works for WebGL2)
            // adjust arrowhead size
            arrow.scale.set(2, 0.6, 2);
            return (_jsxs("group", { renderOrder: -20, children: [_jsx("primitive", { object: mesh, onPointerDown: function (e) {
                            if (mode !== 'select')
                                return;
                            setDragSelectData(data => ({
                                ...data, dimSelected: 1,
                            }));
                            toggleRepSelection(edge.key);
                            e.stopPropagation();
                        }, onPointerEnter: (e) => {
                            //console.notify("Setting new hovered: ", edge.id);
                            //setHovered(edge);
                            e.stopPropagation();
                            // console.notify("2")
                            // if we aren't in select mode, ignore
                            return;
                            if (mode !== 'select')
                                return;
                            if (hovered === edge)
                                return;
                            console.notify("123)");
                            hovered = edge;
                            e.stopPropagation();
                            if (isMouseDown) {
                                // setHovered(edge);
                                if (dimSelected === -1) {
                                    setDragSelectData({ isMouseDown: true, dimSelected: edge.dimension, deselecting: isSelected });
                                    toggleRepSelection(edge.key);
                                }
                                else if (edge.dimension === dimSelected && isSelected === deselecting) {
                                    toggleRepSelection(edge.key);
                                }
                            }
                        }, onPointerLeave: (e) => {
                            //setHovered(null);
                            e.stopPropagation();
                            // setHovered(null); 
                            if (mode !== 'select')
                                return;
                        } }), _jsx("primitive", { object: copy, visible: true }), _jsx("primitive", { object: arrow }), showName && _jsx(Label, { position: middle.toArray(), text: edge.name })] }, edge.id + "AbstractEdge" + edge.name));
        }) }));
};
