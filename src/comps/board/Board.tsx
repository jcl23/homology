import { Canvas, useFrame, useThree } from '@react-three/fiber';
import React, { useState, useRef, Component, ErrorInfo, useEffect } from 'react';
import { Leva, useControls } from 'leva';
import { ArrowHelper, Color, CylinderGeometry, DoubleSide, Euler, MathUtils, Mesh, MeshStandardMaterial, Quaternion, Vector3 } from 'three';
import { Plane, Sphere, Line, OrbitControls, Html, Edges, Cone, TransformControls } from '@react-three/drei';
// import { AbstractCell, CWComplex, AbstractEdge, AbstractFace, AbstractVertex, CWComplexEditStep,  } from '../math/CWComplex';

import { computeOrthocenter3D  } from '../../math/shrink';
import { EditOptions, ViewOptions } from '../../App';
import { CWComplexStateEditor, LastSelect } from '../../hooks/useCWComplexEditor';
// import { ErrorBoundary } from '@react-three/fiber/dist/declarations/src/core/utils';
import { AbstractCell, AbstractVertex, AbstractEdge, AbstractFace, Cell } from '../../math/classes/cells';
import { CWComplex } from '../../math/CWComplex';
import { ErrorBoundary } from '../ErrorBoundary';
import { DragSelectData, Scene } from './Scene';
import styles from './Board.module.css';

import { Stats }from '@react-three/drei';
import { MAX_DIMENSION } from '../../data/configuration';
import Latex from 'react-latex-next';
import ClickSphere from './ClickSphere';
import { CAMERA_POSITION } from '../../cfg/board';
import { CameraUpdater } from '../CameraUpdater';


export type BoardProps = {
    viewOptions: ViewOptions;
    editOptions: EditOptions;
    complex: CWComplex;
    //setComplex: (c: CWComplex) => void;
    // selectedReps: Set<string>;
    allowEditing: boolean;
    stepIndex: number;
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

type BoardStateDebugProps = {
    dragSelectData: DragSelectData;
    recentlySelected: LastSelect;
}

const BoardStateDebug = ({ dragSelectData, recentlySelected }: BoardStateDebugProps) => {
    // <Html>
    const color1 = dragSelectData.isMouseDown ? 'lime' : 'white';
    const color2 = ["green", "blue", "yellow"][dragSelectData.dimSelected] ?? "white";
    const color3 = dragSelectData.deselecting ? 'red' : 'white';
    const color4 = recentlySelected ? 'orange' : 'white';

    return (
        <div style={{ display: "flex" }}>
            <div style={{backgroundColor: color1}}>isMouseDown: {dragSelectData.isMouseDown ? 'true' : 'false'}</div>
            <div style={{backgroundColor: color2}}>dimSelected: {dragSelectData.dimSelected}</div>
            <div style={{backgroundColor: color3}}>deselecting: {dragSelectData.deselecting ? 'true' : 'false'}</div>
            <div style={{backgroundColor: color4}}>recentlySelected: {recentlySelected?.cellList ? recentlySelected.cellList : "null"}</div>
        </div>
    );
    {/* </Html> */}
}


const Board = ({ viewOptions, editOptions, complex, editComplex, allowEditing, stepIndex  }: BoardProps) => {
    //const { history } = editComplex;
    const { nameState } = viewOptions;
    //const complex = history[history.length - 1].complex;
    // const { invalidate } = useThree();
    const [dragSelectData, setDragSelectData] = useState<DragSelectData>({ isMouseDown: false, dimSelected: -1, deselecting: false  });
    const canvasRef = useRef<HTMLCanvasElement>(null);
    // const [updateHoverKey, setUpdateHoverKey] = useState<number>(Math.random());
    console.log("Board render", complex.numReps, complex.numCells);

   
    return (
        <ErrorBoundary>
            <div>
                <div className={styles.boardTitle}>
                    {nameState ? <Latex>{ editComplex.meta.name  ?? "CW Complex with no name that's not good..."}</Latex> : ""}
                </div>
            </div>
            <Leva collapsed  />
            {/* <BoardStateDebug dragSelectData={dragSelectData} recentlySelected={editComplex.recentlySelected} /> */}
            <div style={{
                width: "100%", height: "100%", 
                position: "relative", overflow: "hidden",
                alignItems: "center", justifyContent: "center",
            }}>

            <Canvas
                ref={canvasRef}
                dpr={[1, 5]}
                className="canvas"
                style={{
                    
                    border: '1px solid grey',
                    // aspectRatio: '2.06!important',
                    height: '100%',
                    // width: '1350px',
                    minWidth: '700px',
                    margin: "5px 0px",
                    zIndex: 0,
                    userSelect: 'none',
                    boxShadow: "2px 2px 2px 0px #0004 inset;"
                    
                }}
                orthographic
                
                camera={{ zoom: 50, isOrthographicCamera: true, position: CAMERA_POSITION, near: 0.01, rotation: new Euler(0, 0, 0)}} // Adjust camera position
                onPointerUp={() => setDragSelectData(data => ({ ...data, isMouseDown: false}))}    
                onPointerDown={(e) => {
                    // console.log("Scene", e.intersections);
                    setDragSelectData(data => ({ ...data, isMouseDown: true}));
                }}
                frameloop='demand'  
                >
                    <CameraUpdater />
                {/* <Stats /> */}
                <ambientLight intensity={2} />
                <pointLight position={[10, 10, 10]} intensity={1.5} />
                <directionalLight position={[10, 5, 0]} color="white" intensity={1} />
                <directionalLight position={[-10, 5, 0]} color="white" intensity={1} />
                <directionalLight position={[0, -5, 0]} color="white" intensity={1} />
                <ClickSphere editor={editComplex} editMode={editOptions.mode} />
                <Scene
                    setDragSelectData={setDragSelectData}
                    dragSelectData={dragSelectData}
                    aspectRatio={canvasRef.current ? canvasRef.current.clientWidth / canvasRef.current.clientHeight : 1}
                    complex={complex}
                    editComplex={editComplex}
                    viewOptions={viewOptions}
                    editOptions={editOptions}
                    allowEditing={allowEditing}
                    stepIndex={stepIndex}
                    />
            </Canvas>
            </div>
        </ErrorBoundary>
    );
};


export default Board;
