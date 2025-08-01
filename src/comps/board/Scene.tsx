import { useMemo, useRef, useState } from "react";
import { Plane, Sphere, Line, OrbitControls } from '@react-three/drei';
import { BoardProps } from "./Board";
import { DoubleSide, Vector3 } from "three";
import { ComplexFaces } from "./ComplexFaces";
import { ComplexEdges } from "./ComplexEdges";
import { ComplexVertices } from "./ComplexVertices";
import { MAX_DIMENSION } from "../../data/configuration";
import { ComplexBalls } from "./ComplexBalls";
export type DragSelectData = {
    isMouseDown: boolean;
    dimSelected: number;
    deselecting: boolean;
}
export type SceneProps = BoardProps & {
    // updateHoverKey: number;
    setDragSelectData: React.Dispatch<React.SetStateAction<DragSelectData>>;
    dragSelectData: DragSelectData;
}
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
export const Scene = ({ editComplex, viewOptions, complex, editOptions, selectedReps, setDragSelectData, dragSelectData, allowEditing }: SceneProps) => {
    console.notify("Scene");
    
    // const complex = history[history.length - 1].complex;
    const planeRef = useRef(null);
    const previewRef = useRef(null);
    const gridSize = 1; // Grid cell size
    const gridExtent = 10; // Grid size from center to edge

    const [previewPosition, setPreviewPosition] = useState<[number, number, number] | null>(null);
    
    const handlePointerMove = (e) => {
        if (!allowEditing) return;
        try {

            if (editOptions.mode === 'add' && e.intersections.length > 0 && e.intersections[0].object === planeRef.current) {
                const intersectPoint = e.intersections[0].point;
                
                // Snap to grid
                const snappedX = Math.round(intersectPoint.x / gridSize) * gridSize;
                const snappedZ = Math.round(intersectPoint.z / gridSize) * gridSize;
                
                if (!previewPosition || previewPosition[0] !== snappedX || previewPosition[2] !== snappedZ) {
                    setPreviewPosition([snappedX, intersectPoint.y, snappedZ]);
                }
            } else if (editOptions.mode == "select") {
                const isBoard = e.target.id === "board";
                // console.notify("onMouseOver", isBoard);
            }
        } catch (error) {
            console.error("Error handling pointer move", error);
        }
    };

    const handlePointerOut = () => {
        if (!allowEditing) return;

        setPreviewPosition(null);
    };


    const handlePointerDown = (e) => {
        if (!allowEditing) return;
        try {
            if (editOptions.mode  === 'add' && previewPosition) {
                // const newVertex: AbstractVertex = {
                //     id: "" + complex.cells[0].length,
                //     index: complex.cells[0].length,
                //     name: "v" + complex.cells[0].length,
                //     attachingMap: () => { throw new Error("Shouldn't compute boundary of vertex"); },
                //     point: previewPosition,
                //     dimension: 0,
                // };
                console.log("add vertex");
                editComplex.addVertex(previewPosition);
                setPreviewPosition(null); // Clear preview after adding
            }
        } catch (error) {
            console.error("Error handling pointer down", error);
        }
    };

    const vertexKeys = [...selectedReps].filter(s => s[0] == "0").map(s => parseInt(s.slice(2)));
    const selectedVertices = complex.cells[0].filter(v => vertexKeys.includes(v.id));
    const edgeKeys = [...selectedReps].filter(s => s[0] == "1").map(s => parseInt(s.slice(2)));
    const selectedEdges = complex.cells[1].filter(e => edgeKeys.includes(e.id));
    const faceKeys = [...selectedReps].filter(s => s[0] == "2").map(s => parseInt(s.slice(2)));
    const selectedFaces = complex.cells[2].filter(f => faceKeys.includes(f.id));
    const ballKeys = [...selectedReps].filter(s => s[0] == "3").map(s => parseInt(s.slice(2)));
    const selectedBalls = complex.cells[3].filter(b => ballKeys.includes(b.id));

    
    const empty = dragSelectData.dimSelected === -1;
    const [
        vertexToggleRep,
        edgeToggleRep, 
        faceToggleRep, 
    ] = [0, 1, 2].map(dim => {
        // return (cell: string) => {
        //     console.notify("Test", dim, dragSelectData.dimSelected, dim == dragSelectData.dimSelected);
        // }
        return function(key: string) {
            const cellType = ["Vertex", "Edge", "Face"][dim];
            // aconsole.notify(`Toggling ${cellType} ${key}`);
            editComplex.toggleRepSelection(key);
        } 
        if (empty) return editComplex.toggleRepSelection;
        if (dim == dragSelectData.dimSelected) {
            console.notify("dragSelectData", dragSelectData.dimSelected, dim);
            return editComplex.toggleRepSelection;
        }
        return () => {};
    });
    
    // memoize the rendered cells so that they dont refresh on previewPosition change
    const cells = useMemo(() => {
        
        
        
        return (
            <>
                <ComplexBalls
                    mode={editOptions.mode}
                    showName={viewOptions.nameState[3]} 
                    balls={complex.cells[3]} 
                    selectedReps={selectedBalls} toggleRepSelection={vertexToggleRep} 
                    dragSelectData={dragSelectData} setDragSelectData={setDragSelectData}
                />
                <ComplexFaces
                    mode={editOptions.mode}
                    showName={viewOptions.nameState[2]} 
                    faces={complex.cells[2]} 
                    selectedReps={selectedFaces} toggleRepSelection={vertexToggleRep} 
                    dragSelectData={dragSelectData} setDragSelectData={setDragSelectData}
                />
                <ComplexEdges 
                    mode={editOptions.mode}
                    showName={viewOptions.nameState[1]} 
                    edges={complex.cells[1]} 
                    selectedReps={selectedEdges} toggleRepSelection={edgeToggleRep} 
                    dragSelectData={dragSelectData} setDragSelectData={setDragSelectData}
                />
                <ComplexVertices 
                    mode={editOptions.mode}
                    showName={viewOptions.nameState[0]} 
                    vertices={complex.cells[0]} 
                    selectedReps={selectedVertices} toggleRepSelection={faceToggleRep} 
                    dragSelectData={dragSelectData} setDragSelectData={setDragSelectData}
                />
            </>
        )
    }, [complex.cells[0].length, complex.cells[1].length, complex.cells[2].length, selectedReps.size, dragSelectData.dimSelected, complex.cells]);


    // console.notify("center", complex.center);
    // plane should be transparent
    return (
        <>
            <OrbitControls 
                // enabled={editOptions.mode == "move"} 
                mouseButtons={
                    editOptions.mode == "move" ? {
                        MIDDLE: 1,
                        RIGHT: 0,
                        LEFT: 2
                    } : {} 
                }
                target={[0, 0, 4]}
            // target={complex.center}
            />  
            <group>
                <CustomGrid gridHeight={editOptions.gridHeight} gridSize={gridSize} gridExtent={gridExtent} />
                <Plane
                    ref={planeRef}
                    renderOrder={-5}
                    args={[gridExtent * 2, gridExtent * 2]} // Size matching the grid
                    position={new Vector3(0, editOptions.gridHeight, 0)}
                    rotation={[-Math.PI / 2, 0, 0]}
                    onPointerMove={handlePointerMove}
                    onPointerOut={handlePointerOut}
                    onPointerDown={handlePointerDown}
                    visible={false}
                >
                    <meshStandardMaterial color="#f5f5f5" transparent opacity={0.4} roughness={0.4} metalness={0.1} depthTest={true}  side={DoubleSide}/>
                </Plane>
                   
                <Plane
                    renderOrder={-5}
                    args={[gridExtent * 2, gridExtent * 2]} // Size matching the grid
                    position={new Vector3(0, editOptions.gridHeight - 0.2, 0)}
                    rotation={[-Math.PI / 2, 0, 0]}
                    // onPointerMove={handlePointerMove}
                    // onPointerOut={handlePointerOut}
                    // onPointerDown={handlePointerDown}
                    
                    receiveShadow

                >
                   
                    <meshStandardMaterial color="#f5f5f5" transparent opacity={0.4} roughness={0.4} metalness={0.1} depthTest={true}  side={DoubleSide}/>
                </Plane>
            </group>
        
            <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 5, 5]} intensity={0.5} />
                    <spotLight position={[0, 10, 0]} angle={3} penumbra={10} intensity={100}  castShadow />
                {previewPosition && (
                    <Sphere
                        ref={previewRef}
                        position={previewPosition}
                        args={[0.1, 32, 32]}
                        visible={editOptions.mode === 'add'}
                    >
                        <meshStandardMaterial color={unselectedFg} opacity={0.5} transparent />
                    </Sphere>
                )}
            {cells}

                    
            
   
        </>
    );
};

type CustomGridProps = {
    gridSize: number;
    gridExtent: number;
    gridHeight: number;
};
const CustomGrid = ({ gridSize, gridExtent, gridHeight }: CustomGridProps) => {
    const lines = [];
    for (let i = -gridExtent; i <= gridExtent; i += gridSize) {
        lines.push([
            [-gridExtent, gridHeight, i],
            [gridExtent, gridHeight, i],
        ]);
        lines.push([
            [i, gridHeight, -gridExtent],
            [i, gridHeight, gridExtent],
        ]);
    }

    return (
        <>
            {lines.map((line, index) => (
                <Line renderOrder={-1} key={index} points={line} color="#555" lineWidth={1} />
            ))}
        </>
    );
};