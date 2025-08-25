import { useControls } from "leva";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { Vector3, ArrowHelper, Color, CylinderGeometry, Mesh, MeshStandardMaterial } from "three";
import { AbstractEdge, AbstractVertex, Vertex } from "../../math/classes/cells";
import { CellsProps } from "./cellProps";
import { Html, Line } from "@react-three/drei";
import Label from "./Label";
import { MAX_DIMENSION } from "../../data/configuration";
import { EdgeArrow } from "./Arrow";
import { useThree } from "@react-three/fiber";
const computedStyles = getComputedStyle(document.documentElement);
const unselectedFg = computedStyles.getPropertyValue("--unselected-fg").trim();
const selectedBg = computedStyles.getPropertyValue("--selected-bg").trim();
const unselectedMid = computedStyles.getPropertyValue("--unselected-mid").trim();
const selectedMid = computedStyles.getPropertyValue("--selected-mid").trim();
const selectedFg = computedStyles.getPropertyValue("--selected-fg").trim();
type ComplexEdgesProps = CellsProps & {
    edges: AbstractEdge[];
    aspectRatio: number;
};
export const ComplexEdges = ({ mode, edges, selectedReps, toggleRepSelection, showName, setDragSelectData, dragSelectData: { isMouseDown, dimSelected, deselecting }}: ComplexEdgesProps) => {
    const { edgeOpacity, showArrows } = useControls({ 
        edgeOpacity: { value: 0.5, min: 0, max: 1 } ,
        showArrows: { value: true }
    });
    // const [hovered, setHovered] = useState<AbstractEdge | null>(null);
    const [hovered, setHovered] = useState<AbstractEdge | null>(null);
    const { size } = useThree();
    const aspectRatio = Math.max(size.width, 700) / size.height;
    const meshRef = useRef<Mesh>(null);
    
    const meshes: Mesh[] = [];
    const { scene } = useThree();
    useLayoutEffect(() => {
    // This runs after the render is committed to the screen
        return () => {
        // This is the cleanup function that runs on unmount
            meshes.forEach(mesh => {
                mesh.geometry.dispose();
                scene.remove(mesh);
            });
        };
    }, [meshes.length, scene ]);
    return (
        <group  renderOrder={5}>
            {edges.map((edge) => {
                const isSelected = Array.from(selectedReps).some(cell =>
                    cell === edge
                );
                const color = isSelected ? selectedBg : unselectedFg;
                const [start, end] = edge.vertices.map((vertex: Vertex) => new Vector3(...vertex.point));

                const proportion = 0.55; // Adjust this value between 0 and 1 to control arrow position
                const offset = -0.005; 
                const length = start.distanceTo(end);
                const c = proportion + offset;
                const middle = (start.clone().multiplyScalar(1 - c).add(end.clone().multiplyScalar(c)));
                // const direction = new Vector3().subVectors(end, start).normalize();
                
                // cylinder
                const cylinder = new CylinderGeometry(2, 2, 1,30,4).translate(0, 0.5, 0).rotateX(Math.PI* 0.5);
                // const mesh = new Mesh(cylinder, new MeshStandardMaterial({ color, opacity: edgeOpacity, transparent: true }));
                const mesh = new Mesh(cylinder);
                mesh.scale.set(0.025, 0.021, length);
                mesh.rotateZ(Math.PI / 2);
                mesh.position.copy(start);
                mesh.renderOrder = -20;
                mesh.lookAt(end);
                meshes.push(mesh);
                


                return (
                    <group key={edge.id + "AbstractEdge" + edge.name} renderOrder={0} 
                    >   
                        <EdgeArrow
                            opacity={edgeOpacity}
                            start={start}
                            end={end}
                            scale={1}
                            selected={isSelected}
                            object={mesh}
                            aspectRatio={aspectRatio}
                            showArrows={showArrows}
                        />
                        <primitive 
                            depthTest={true}
                            depthWrite={true}
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
                                        // throw new Error("Toggle rep selection not implemented for edges");
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


