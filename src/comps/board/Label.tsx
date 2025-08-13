import { Html } from "@react-three/drei";
import Latex from "react-latex-next";
import styles from './Label.module.css';
import { AbstractCell } from "../../math/classes/cells";

type LabelProps = {
    position: [number, number, number];
    text: string;
    type: string;
    selected: boolean;
    cell?: AbstractCell; // Optional, used for cells like vertices or edges
}
const subscriptChars = "₀₁₂₃₄₅₆₇₈₉";
export const numToSubscript = (num: number) => {
    if (num < 0) return "₋"; // Subscript for negative sign
    if (num < 10) {
        return subscriptChars[num];
    }
    return numToSubscript(Math.floor(num / 10)) + subscriptChars[num % 10];
}

export const texToUnicode = (text: string) => {
    // replace _(number) with subscript
    return text.replace(/_(\d+)/g, (match, num) => {
        return numToSubscript(parseInt(num));
    });
}
const Label = ({ type, position, text, selected, cell }: LabelProps) => {
    const userData = cell ? { object: cell } : {};
    return (
        <Html position={position} zIndexRange={[100, 200]} pointerEvents="none" userData={userData}  style={{ pointerEvents: 'none' }}
                className={`${styles.label} ${styles[`label-${type}`]} ${styles[`label-${type}-${selected ? 'on' : 'off'}`]}`}>
          
              {/* <Latex>$\sf {text}$</Latex>   */}
              {texToUnicode(text)}

        </Html>
    );
}

export default Label;