
import { useControls } from "leva";
import { useState } from "react";
import { Vector3, ArrowHelper, Color, CylinderGeometry, Mesh, MeshStandardMaterial } from "three";
import { AbstractEdge, AbstractVertex, Vertex } from "../../math/classes/cells";
import { CellsProps } from "./cellProps";
import { Html, Line } from "@react-three/drei";
import Label from "./Label";
import { MAX_DIMENSION } from "../../data/configuration";
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const unselectedMid = computedStyles.getPropertyValue("--unselected-mid").trim();
const selectedMid = computedStyles.getPropertyValue("--selected-mid").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
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

                const middle = new Vector3().addVectors(start, end).multiplyScalar(0.5);
                const direction = new Vector3().subVectors(end, start).normalize();
                const length = new Vector3().subVectors(end, start).length();

                // Create ArrowHelper
                const arrow = new ArrowHelper(direction.normalize(), middle, 0.1, new Color(color), 0.15, 0.09);
                
                // cylinder
                const cylinder = new CylinderGeometry(2, 2, 1,4,5).translate(0, 0.5, 0).rotateX(Math.PI* 0.5);
                
                
                const randomColor = "green";
                //const outerOpacity = hovered === edge ? edgeOpacity / 2 : 0;
                const outerOpacity = edgeOpacity;
                const mesh = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: outerOpacity, transparent: true }));
                mesh.scale.set(0.025, 0.021, length);
                mesh.rotateZ(Math.PI / 2);
                mesh.position.copy(start);
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
                    <group key={edge.id + "AbstractEdge" + edge.name} renderOrder={-20} >
                        <primitive object={mesh}
                                         userData={{ object: edge }} 
                        onPointerDown={function(e) { 
                            if (mode !== 'select') return;
                
                            // setDragSelectData(data => ({ 
                            //     ...data, dimSelected: 1,
                            // }));
                            // toggleRepSelection(edge.key);
                            // e.stopPropagation();
                        }}
                        onPointerEnter={(e) => { 
                            //console.notify("Setting new hovered: ", edge.id);
                            //setHovered(edge);
                            e.stopPropagation(); 


                            // console.notify("2")
                            // if we aren't in select mode, ignore
                            return;
                            if (mode !== 'select') return;
                            if (hovered === edge) return;
                            console.notify("123)")
                    
                            e.stopPropagation();
                            if (isMouseDown) {
                                // setHovered(edge);
                                if (dimSelected === -1) {
                                    setDragSelectData({ isMouseDown: true, dimSelected: edge.dimension, deselecting: isSelected });
                                    toggleRepSelection(edge.key);
                                } else if (edge.dimension === dimSelected && isSelected === deselecting) {
                                    toggleRepSelection(edge.key);
                                }
                            }
                        }}
                        onPointerLeave={(e) => { 
                            //setHovered(null);
                            e.stopPropagation(); 
                            // setHovered(null); 
                            
                            if (mode !== 'select') return;
                        }}
                    />
         
                        <primitive object={copy} visible={true} />

                        <primitive object={arrow} />
                        { showName && <Label position={middle.toArray()} text={edge.name} /> }
                    </group>
                );
            })}
        </group>
    );
};


