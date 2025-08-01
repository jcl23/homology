import { Html } from "@react-three/drei";


type LabelProps = {
    position: [number, number, number];
    text: string;
}

const Label = ({ position, text }: LabelProps) => {
    return (
        <Html position={position} zIndexRange={[100, 200]} style={{ pointerEvents: 'none' }}>
            <div style={{ color: 'black', fontFamily: "Helvetica Neue", fontSize: '12px', background: '#FFF9', border: "1px solid black", padding: '2px', borderRadius: '3px', pointerEvents: 'none' }}>
                {text}
            </div>
        </Html>
    );
}

export default Label;