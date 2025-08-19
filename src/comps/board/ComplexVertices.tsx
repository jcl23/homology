import { Html, Sphere } from "@react-three/drei";
import { CellsProps } from "./cellProps";
import { AbstractVertex, Vertex } from "../../math/classes/cells";
import { useControls } from "leva";
import { useState } from "react";
import Label from "./Label";
import { NormalBlending } from "three";



const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();



type LabelProps = {
    position: [number, number, number];
    text: string;
}



type VerticesProps = CellsProps & {
    vertices: AbstractVertex[];
};

export const ComplexVertices = ({ vertices, selectedReps, toggleRepSelection, showName, setDragSelectData, dragSelectData: { isMouseDown, dimSelected, deselecting } }: VerticesProps) => {
    const { vertexOpacity } = useControls({ vertexOpacity: { value: 0.5, min: 0, max: 1 } });
    const someSelected = selectedReps.length > 0;
    const [hovered, setHovered] = useState<AbstractVertex | null>(null);
    console.log("someSelected", someSelected);
    
    const debugStr = (vertices.length > 0) ? (vertices[0] as Vertex).point.map(n => n.toFixed(2)) : "No vertices";
    return (
        <group renderOrder={1000000000000}>
            {vertices.map((vertex) => {
                const isSelected = Array.from(selectedReps).some(cell =>
                    vertex === cell
                );
                const color = isSelected ? selectedBg : unselectedFg;
                return (
                    <group key={vertex.id + "AbstractVertex"} position={[...vertex.point]}>
                        <Sphere
                            args={[0.1, 32, 32]}
                            castShadow
                        >
                            {/* Medium Ball */}
                            <meshStandardMaterial color={color} opacity={0.5}  transparent={vertexOpacity < 1} />
                        </Sphere>
                        <Sphere
                            args={[0.04, 32, 32]}
                            castShadow
                        >
                            <meshStandardMaterial color={"black"} opacity={vertexOpacity} transparent={vertexOpacity < 1}/>
                        </Sphere>
                        <Sphere
                            args={[0.2, 32, 32]}
                            onPointerDown={function(e) { 

                                setDragSelectData(data => ({ 
                                    ...data, dimSelected: vertex.dimension 
                                }));
                                // toggleRepSelection(vertex.key);
                            }}
                            userData={{
                                object: vertex
                            }}
                            onPointerOver={(e) => {
                                console.notify("pointer enter", vertex.dimension);

                                const leftDown = e.buttons & 1;
                                const rightDown = e.buttons & 2;
                                
                                setHovered(vertex); 
                                if (leftDown) {
                                    if (dimSelected === -1) {
                                        setDragSelectData({ isMouseDown: true, dimSelected: vertex.dimension, deselecting: isSelected });
                                        toggleRepSelection(vertex.key);
                                    } else if (vertex.dimension === dimSelected && isSelected === deselecting) {
                                        toggleRepSelection(vertex.key);
                                    }
                                }
                            }}
                            onPointerOut={(e) => { e.stopPropagation(); setHovered(null); }}
                        >
                            <meshStandardMaterial color={color} opacity={(hovered == vertex) ? vertexOpacity : 0} transparent/>
                        </Sphere>
                         {/* <Line
                            points={[[0, 0, 0], [0, 0, 0.002]]}
                            color={color}
                            lineWidth={25}
                            opacity={vertexOpacity}
                            transparent
                            onClick={(e) => { 
                                e.simplicesEncountered ??= [] as AbstractCell[];
                                e.simplicesEncountered.push(vertex);
                                console.log("click", e.simplicesEncountered);
                                toggleRepSelection(vertex); 
                            }}
                        /> */}
                        { showName && <Label 
                            position={[0, 0, 0]} 
                            text={vertex.name} 
                            type="vertex" 
                            selected={isSelected}
                            cell={vertex}
                            />
                        }
                    </group>
                );
            })}
        </group>
    );
};