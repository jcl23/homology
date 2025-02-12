import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sphere } from "@react-three/drei";
import { useControls } from "leva";
import { useState } from "react";
import Label from "./Label";
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
export const ComplexVertices = ({ vertices, selectedReps, toggleRepSelection, showName, setDragSelectData, dragSelectData: { isMouseDown, dimSelected, deselecting } }) => {
    const { vertexOpacity } = useControls({ vertexOpacity: { value: 0.5, min: 0, max: 1 } });
    const someSelected = selectedReps.length > 0;
    const [hovered, setHovered] = useState(null);
    console.log("someSelected", someSelected);
    const debugStr = (vertices.length > 0) ? vertices[0].point.map(n => n.toFixed(2)) : "No vertices";
    return (_jsx("group", { renderOrder: -10, children: vertices.map((vertex) => {
            const isSelected = Array.from(selectedReps).some(cell => vertex === cell);
            const color = isSelected ? selectedBg : unselectedFg;
            return (_jsxs("group", { position: [...vertex.point], children: [_jsx(Sphere, { args: [0.1, 32, 32], castShadow: true, children: _jsx("meshStandardMaterial", { color: color, opacity: vertexOpacity, transparent: vertexOpacity < 1 }) }), _jsx(Sphere, { args: [0.04, 32, 32], castShadow: true, children: _jsx("meshStandardMaterial", { color: "black", opacity: vertexOpacity }) }), _jsx(Sphere, { args: [0.2, 32, 32], onPointerDown: function (e) {
                            setDragSelectData(data => ({
                                ...data, dimSelected: vertex.dimension
                            }));
                            toggleRepSelection(vertex.key);
                            e.stopPropagation();
                        }, onPointerOver: (e) => {
                            console.notify("pointer enter", vertex.dimension);
                            const leftDown = e.buttons & 1;
                            const rightDown = e.buttons & 2;
                            setHovered(vertex);
                            if (leftDown) {
                                if (dimSelected === -1) {
                                    setDragSelectData({ isMouseDown: true, dimSelected: vertex.dimension, deselecting: isSelected });
                                    toggleRepSelection(vertex.key);
                                }
                                else if (vertex.dimension === dimSelected && isSelected === deselecting) {
                                    toggleRepSelection(vertex.key);
                                }
                            }
                        }, onPointerOut: (e) => { e.stopPropagation(); setHovered(null); }, children: _jsx("meshStandardMaterial", { color: color, opacity: (hovered == vertex) ? vertexOpacity : 0, transparent: true }) }), showName && _jsx(Label, { position: [0, 0, 0], text: vertex.name })] }, vertex.id + "AbstractVertex"));
        }) }));
};
