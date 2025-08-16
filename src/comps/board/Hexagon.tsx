import { DoubleSide, Euler, Mesh, Shape as Shape } from "three";
// import { Shape } from "@react-three/drei";
const computedStyles = getComputedStyle(document.documentElement);
const boardColor = computedStyles.getPropertyValue("--board-color").trim();
const boardOpacity = +computedStyles.getPropertyValue("--board-opacity").trim();

type HexagnProps = {
    radius?: number;
    sideLength?: number;
    ref: React.RefObject<Mesh>;
    onPointerMove?: (event: any) => void;
    onPointerOut?: (event: any) => void;
    onPointerDown?: (event: any) => void;
    gridHeight?: number;
};
const Hexagon = function({ radius = 5, sideLength = 1, gridHeight, onPointerMove, onPointerOut, onPointerDown, ref }: HexagnProps) {  
    const r = radius * sideLength;
    const sqrt3 = Math.sqrt(3);
    const hexShape = new Shape();

    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    return (

        <mesh 
            renderOrder={-20}
            rotation={new Euler(Math.PI / 2, 0, 0)} 
            onPointerMove={onPointerMove}
            onPointerOut={onPointerOut}
            onPointerDown={onPointerDown}    
            ref={ref}
            position={[0, gridHeight, 0]}
        >
            <shapeGeometry args={[hexShape]} />
            <meshStandardMaterial color={boardColor} transparent  opacity={0} roughness={0.4} metalness={0.1} depthTest={true}side={DoubleSide}/>

            {/* <meshStandardMaterial color="lightblue" side={DoubleSide} /> */}
        </mesh>
    );

}

export default Hexagon;