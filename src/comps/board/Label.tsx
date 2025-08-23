import { Html } from "@react-three/drei";
import Latex from "react-latex-next";
import styles from './Label.module.css';
import { AbstractCell } from "../../math/classes/cells";

type LabelProps = {
    position: [number, number, number];
    text: string;
    type: string;
    selected: boolean;
    // cell?: AbstractCell; // Optional, used for cells like vertices or edges
    toggle: () => void; // Function to toggle selection
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
    return text
        .replace(/_\{([\d,]+)\}/g, (match, num) => {
            return num.split(',').map(n => numToSubscript(parseInt(n))).join(',');
        })
        .replace(/_(\d+)/g, (match, num) => {
        return numToSubscript(parseInt(num));
    });
}
const Label = ({ type, position, text, selected, toggle }: LabelProps) => {
    // const userData = cell ? { object: cell } : {};
    return (
        <Html renderOrder={0} style={{pointerEvents: (type == "vertex" ? "none" : "all") }} position={position} zIndexRange={[100, 200]} 
                className={`${styles.label} ${styles[`label-${type}`]} ${styles[`label-${type}-${selected ? 'on' : 'off'}`]}`}>
          
              {/* <Latex>$\sf {text}$</Latex>   */}
             <div style={{ width: "100%", height: "100%", pointerEvents: (type == "vertex" ? "none" : "all") }} onMouseDown={toggle}
                
             >
             {texToUnicode(text)}
                </div>

        </Html>
    );
}

export default Label;