import React, { useRef, useState } from 'react';
import { DoubleSide } from 'three';
import { Cell } from '../../math/classes/cells';
import { CWComplexStateEditor } from '../../hooks/useCWComplexEditor';
type ClickSphereProps = {
    editor: CWComplexStateEditor;
    editMode: string
}

export default function ClickSphere({ 
    editor, editMode
}: ClickSphereProps) {
    return (  
    <mesh 
        userData={{object: "Outside"}}
        onPointerDown={(e) => {

            if (editMode !== "select") return; // Prevent editing if not allowed
            // Prevent event propagation to ensure the Scene doesn't receive this click
            e.stopPropagation();
            // Reset selection when clicking on empty space
            const myData = e.intersections.map(i => i.object.userData);
            const cells = e.intersections.map(i => i.object.userData.object).filter((obj: any) => obj instanceof Cell);
            const lowestDim = Math.min(...cells.map(c => c.dimension));
            const cellsOfLowestDim = cells.filter(c => c.dimension === lowestDim);
            // toggle first
            editor.toggleRepsSelection(cellsOfLowestDim);
            console.log("Path", myData);
            console.log("Scene intersections:", e.intersections, cells)
        }}>
            <sphereGeometry args={[100, 32, 32]} />
            <meshBasicMaterial transparent opacity={0} side={DoubleSide} />
        </mesh>
    );
}