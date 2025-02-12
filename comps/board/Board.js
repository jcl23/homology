import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';
import { Leva } from 'leva';
import { Euler } from 'three';
import { ErrorBoundary } from '../ErrorBoundary';
import { Scene } from './Scene';
import { Stats } from '@react-three/drei';
/*
    state:
    isMouseDown: boolean
    dimSelected: number | null

    events on each cell:
    onMouseOver:
        if isMouseDown {
            if dimSelected is null {
                dimSelected = cell.dimension
            }
            if cell.dimension === dimSelected {
                select cell
            }
    onMouseDown:
        isMouseDown = true
        dimSelected = cell.dimension
        select cell
        
    */
const BoardStateDebug = ({ dragSelectData }) => {
    // <Html>
    const color1 = dragSelectData.isMouseDown ? 'lime' : 'white';
    const color2 = ["green", "blue", "yellow"][dragSelectData.dimSelected] ?? "white";
    const color3 = dragSelectData.deselecting ? 'red' : 'white';
    return (_jsxs("div", { style: { display: "flex" }, children: [_jsxs("div", { style: { backgroundColor: color1 }, children: ["isMouseDown: ", dragSelectData.isMouseDown ? 'true' : 'false'] }), _jsxs("div", { style: { backgroundColor: color2 }, children: ["dimSelected: ", dragSelectData.dimSelected] }), _jsxs("div", { style: { backgroundColor: color3 }, children: ["deselecting: ", dragSelectData.deselecting ? 'true' : 'false'] })] }));
    { /* </Html> */ }
};
const Board = ({ viewOptions, editOptions, complex, editComplex, selectedReps }) => {
    //const { history } = editComplex;
    const { nameState } = viewOptions;
    //const complex = history[history.length - 1].complex;
    const [dragSelectData, setDragSelectData] = useState({ isMouseDown: false, dimSelected: -1, deselecting: false });
    // const [updateHoverKey, setUpdateHoverKey] = useState<number>(Math.random());
    return (_jsxs(ErrorBoundary, { children: [_jsx(Leva, { collapsed: true }), _jsxs(Canvas, { style: {
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    userSelect: 'none',
                }, 
                // onMouseMove={(e) => {
                //     console.notify("Mouse move", e.relatedTarget);
                //     setUpdateHoverKey(Math.random());
                // }}
                camera: { position: [0, 10, 0], rotation: new Euler(Math.PI / 4, Math.PI / 4, 2), fov: 40 }, onPointerUp: () => setDragSelectData(data => ({ ...data, isMouseDown: false })), onPointerDown: () => setDragSelectData(data => ({ ...data, isMouseDown: true })), children: [_jsx(Stats, {}), _jsx("ambientLight", { intensity: 2 }), _jsx(Scene, { setDragSelectData: setDragSelectData, dragSelectData: dragSelectData, selectedReps: selectedReps, complex: complex, editComplex: editComplex, viewOptions: viewOptions, editOptions: editOptions })] })] }));
};
export default Board;
