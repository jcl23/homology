import { Canvas, useFrame } from '@react-three/fiber';
import React, { useState, useRef, Component, ErrorInfo } from 'react';
import { Leva, useControls } from 'leva';
import { ArrowHelper, Color, CylinderGeometry, DoubleSide, Euler, MathUtils, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { Plane, Sphere, Line, OrbitControls, Html, Edges, Cone, TransformControls } from '@react-three/drei';
// import { AbstractCell, CWComplex, AbstractEdge, AbstractFace, AbstractVertex, CWComplexEditStep,  } from '../math/CWComplex';

import { computeOrthocenter3D  } from '../../math/shrink';
import { EditOptions, ViewOptions } from '../../App';
import { CWComplexStateEditor } from '../../hooks/useCWComplexEditor';
// import { ErrorBoundary } from '@react-three/fiber/dist/declarations/src/core/utils';
import { AbstractCell, AbstractVertex, AbstractEdge, AbstractFace, Cell } from '../../math/classes/cells';
import { CWComplex } from '../../math/CWComplex';
import { ErrorBoundary } from '../ErrorBoundary';
import { DragSelectData, Scene } from './Scene';


import { Stats }from '@react-three/drei';
import { MAX_DIMENSION } from '../../data/configuration';
import Latex from 'react-latex-next';
import ClickSphere from './ClickSphere';


export type BoardProps = {
    viewOptions: ViewOptions;
    editOptions: EditOptions;
    complex: CWComplex;
    //setComplex: (c: CWComplex) => void;
    // selectedReps: Set<string>;
    allowEditing: boolean;

    // toggleRepSelection: (cell: AbstractCell) => void;
    editComplex: CWComplexStateEditor;

};

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

const BoardStateDebug = ({ dragSelectData }: { dragSelectData: DragSelectData }) => {
    // <Html>
    const color1 = dragSelectData.isMouseDown ? 'lime' : 'white';
    const color2 = ["green", "blue", "yellow"][dragSelectData.dimSelected] ?? "white";
    const color3 = dragSelectData.deselecting ? 'red' : 'white';
    return (
        <div style={{ display: "flex" }}>
            <div style={{backgroundColor: color1}}>isMouseDown: {dragSelectData.isMouseDown ? 'true' : 'false'}</div>
            <div style={{backgroundColor: color2}}>dimSelected: {dragSelectData.dimSelected}</div>
            <div style={{backgroundColor: color3}}>deselecting: {dragSelectData.deselecting ? 'true' : 'false'}</div>
        </div>
    );
    {/* </Html> */}
}


const Board = ({ viewOptions, editOptions, complex, editComplex, allowEditing  }: BoardProps) => {
    //const { history } = editComplex;
    const { nameState } = viewOptions;
    //const complex = history[history.length - 1].complex;

    const [dragSelectData, setDragSelectData] = useState<DragSelectData>({ isMouseDown: false, dimSelected: -1, deselecting: false  });
    
    // const [updateHoverKey, setUpdateHoverKey] = useState<number>(Math.random());
    
    return (
        <ErrorBoundary>
            <div>
                <div className="boardTitle">
                    {nameState ? <Latex>{ editComplex.meta.name  ?? "CW Complex with no name that's not good..."}</Latex> : ""}
                </div>
            </div>
        <Leva collapsed hidden />
        <BoardStateDebug dragSelectData={dragSelectData} />
            <Canvas
                className="canvas"
                style={{
                    border: '1px solid grey',
                    width: '100%',
                    height: '100%',
                    margin: "5px 0px",
                    zIndex: 0,
                    userSelect: 'none',
                    boxShadow: "2px 2px 2px 0px #0004 inset;"
    
                }}
                // onMouseMove={(e) => {
                //     console.notify("Mouse move", e.relatedTarget);
                //     setUpdateHoverKey(Math.random());
                // }}
                camera={{ position: [0, 10, 0], near: 0.001, rotation: new Euler(Math.PI / 4, Math.PI / 4, 2),fov: 40 }} // Adjust camera position
                onPointerUp={() => setDragSelectData(data => ({ ...data, isMouseDown: false}))}    
                onPointerDown={(e) => {
                    // console.log("Scene", e.intersections);
                    setDragSelectData(data => ({ ...data, isMouseDown: true}));
                }}  
            >
                {/* <Stats /> */}
                <ambientLight intensity={2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <directionalLight position={[0, 10, 0]} intensity={1} />
                <ClickSphere editor={editComplex} />
                <Scene
                    setDragSelectData={setDragSelectData}
                    dragSelectData={dragSelectData}
    
                    complex={complex}
                    editComplex={editComplex}
                    viewOptions={viewOptions}
                    editOptions={editOptions}
                    allowEditing={allowEditing}
                />
            </Canvas>
        </ErrorBoundary>
    );
};


export default Board;
