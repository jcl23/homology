import { useControls } from "leva";
import { useState } from "react";
import { Vector3, ArrowHelper, Color, CylinderGeometry, Mesh, MeshStandardMaterial } from "three";
import { AbstractEdge, AbstractVertex, Vertex } from "../../math/classes/cells";
import { CellsProps } from "./cellProps";
import { Html, Line } from "@react-three/drei";
import Label from "./Label";
import { MAX_DIMENSION } from "../../data/configuration";
import { EdgeArrow } from "./Arrow";
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
const unselectedMid = computedStyles.getPropertyValue("--unselected-mid").trim();
const selectedMid = computedStyles.getPropertyValue("--selected-mid").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
type ComplexEdgesProps = CellsProps & {
    edges: AbstractEdge[];
};
export const ComplexEdges = ({ mode, edges, selectedReps, toggleRepSelection, showName, setDragSelectData, dragSelectData: { isMouseDown, dimSelected, deselecting } }: ComplexEdgesProps) => {
    const { edgeOpacity } = useControls({ edgeOpacity: { value: 0.5, min: 0, max: 1 } });
    // const [hovered, setHovered] = useState<AbstractEdge | null>(null);
    const [hovered, setHovered] = useState<AbstractEdge | null>(null);
    
    return (
        <group  renderOrder={5}>
            {edges.map((edge) => {
                const isSelected = Array.from(selectedReps).some(cell =>
                    cell === edge
                );
                const color = isSelected ? selectedBg : unselectedFg;
                const [start, end] = edge.attachingMap.map((vertex: Vertex) => new Vector3(...vertex.point));

                const c = 0.60; // Adjust this value between 0 and 1 to control arrow position
                const middle = (start.clone().multiplyScalar(1 - c).add(end.clone().multiplyScalar(c)));
                const direction = new Vector3().subVectors(end, start).normalize();
                const length = new Vector3().subVectors(end, start).length();

                // Create ArrowHelper
                const arrow = new ArrowHelper(direction.normalize(), middle, 0.1, new Color(color), 0.15, 0.09);
                
                // cylinder
                const cylinder = new CylinderGeometry(2, 2, 1,30,4).translate(0, 0.5, 0).rotateX(Math.PI* 0.5);
                
    
                const outerOpacity = edgeOpacity;
                const mesh = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: outerOpacity, transparent: true }));
                mesh.scale.set(0.025, 0.021, length);
                mesh.rotateZ(Math.PI / 2);
                mesh.position.copy(start);
                mesh.renderOrder = -20;
                mesh.lookAt(end);
                const copy = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: 0, transparent: true }));
                copy.scale.set(0.005, 0.005, length);
                copy.rotateZ(Math.PI / 2);
                copy.position.copy(start);
                copy.lookAt(end);
                // Customize the ArrowHelper
                arrow.setColor(new Color(color));           // Set the color of the arrow
                /// Set the line width (only works for WebGL2)
                // adjust arrowhead size
                arrow.scale.set(2, 0.6, 2);


                return (
                    <group key={edge.id + "AbstractEdge" + edge.name} renderOrder={0} 
                    >   
                        <EdgeArrow
                            start={start}
                            end={end}
                            scale={1}
                            selected={isSelected}
                            object={mesh}

                        />
                        <primitive 
                            depthTest={true}
                            // depthWrite={true}
                            renderOrder={-10}
                            alphaTest={1}
                            userData={{ object: edge }} 
                            object={mesh}
                            visible={false}
                        onPointerEnter={(e) => {            
                            e.stopPropagation(); 
                            return;           
                        }}
                        onPointerLeave={(e) => {    
                            e.stopPropagation(); 
                        }}
                    />
         
     

                        { showName && (
                            <Label 
                                position={middle.toArray()} 
                                text={edge.name} 
                                type={"edge"} 
                                selected={isSelected}
                                toggle={() => {
                                    toggleRepSelection(edge.key);
                                    throw new Error("Toggle rep selection not implemented for edges");
                                }
                                }
                            /> 
                        ) }
                    </group>
                );
            })}
        </group>
    );
};


