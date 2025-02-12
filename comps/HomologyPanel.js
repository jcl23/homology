import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPreset, printCWComplex } from "../math/CWComplex";
import { computeHomology } from "../math/homology";
import styles from './HomologyPanel.module.css';
import { groupsEqual } from "../math/group";
import Group from "./Group";
const MatrixPanel = ({ labeledMatrix, name }) => {
    const { ins, outs, matrix } = labeledMatrix;
    if (matrix.length === 0) {
        return _jsx("div", { children: "Empty Matrix" });
    }
    const width = matrix[0].length;
    const height = matrix.length;
    return (_jsxs("div", { children: [name, " (", width, "x", height, ")", _jsxs("table", { children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", {}), ins.map(inName => (_jsx("th", { children: inName })))] }) }), _jsx("tbody", { children: matrix.map((row, i) => (_jsxs("tr", { children: [_jsx("td", { children: outs[i] }), row.map(cell => (_jsx("td", { children: cell })))] }))) })] })] }));
};
const lower = (num) => "₀₁₂₃₄₅₆₇₈₉"[num];
const ShadowRect = (props) => {
    return (_jsx(_Fragment, { children: _jsx("rect", { filter: "url(#shadow)", ...props }) }));
};
export const DimensionLayer = ({ dimension, ...groups }) => {
    const groupNames = ["C", "B", "Z", "H"];
    const CEqualsZ = groupsEqual(groups.C, groups.Z.group);
    const ZEqualsB = groupsEqual(groups.Z.group, groups.B.group);
    const ABBREVIATE = false;
    const rightWidth = 40;
    const innermostWidth = 120;
    const pad_h = 4;
    const textHeight = 40;
    const zeroHeight = 5;
    const pad_w = 6;
    const leftPortionWidth = pad_w * 4 + innermostWidth;
    const totalWidth = leftPortionWidth + rightWidth;
    const totalHeight = textHeight * 4 + pad_h * 5 + zeroHeight;
    const box1Width = leftPortionWidth;
    const box2Width = leftPortionWidth - 2 * pad_w;
    const box3Width = leftPortionWidth - 4 * pad_w;
    const box1Height = textHeight * 4 + pad_h * 4 + zeroHeight;
    const box2Height = textHeight * 3 + pad_h * 2 + zeroHeight;
    const box3Height = textHeight;
    const strokeWidth = 1;
    const boxStroke = "none";
    const outerStroke = "none";
    const boxFill = "transparent";
    const boxOpacity = 1;
    const hStroke = "#eee";
    const bStroke = "white";
    const zeroFill = "black";
    return (_jsx("div", { className: styles.homologyLayer, style: { zIndex: dimension }, children: _jsxs("svg", { style: { opacity: 1 }, width: totalWidth, height: totalHeight, children: [_jsx("defs", { children: _jsx("filter", { id: "shadow", x: "-100%", y: "-50%", width: "300%", height: "150%", children: _jsx("feDropShadow", { dx: "0", dy: "0", stdDeviation: "1", floodColor: "#0008" }) }) }), _jsx("line", { x1: leftPortionWidth, y1: 0, x2: totalWidth, y2: box1Height - (pad_h * 2 + box3Height + zeroHeight), stroke: boxStroke, strokeWidth: strokeWidth }), _jsx("line", { x1: leftPortionWidth, y1: box1Height, x2: totalWidth, y2: box1Height - (pad_h * 2), stroke: boxStroke, strokeWidth: strokeWidth }), _jsx("polygon", { points: `   ${0},${0}
                        ${leftPortionWidth},${0} 
                        ${totalWidth},${box1Height - (pad_h * 2 + box3Height + zeroHeight)} 
                        ${totalWidth},${box1Height - (pad_h * 2)} 
                        ${leftPortionWidth},${box1Height}
                        ${0},${box1Height}
                    `, fill: boxFill, opacity: boxOpacity, strokeWidth: 2, stroke: boxStroke, filter: "url(#shadow)" }), _jsx(ShadowRect, { x: pad_w, y: pad_h + textHeight, width: box2Width, height: box2Height, fill: boxFill, stroke: boxStroke, strokeWidth: strokeWidth }), _jsx("foreignObject", { x: 0, y: 0, width: box1Width, height: textHeight, children: _jsx(Group, { group: groups.C, name: `C_${dimension}` }) }), _jsx("polygon", { points: `
                        ${pad_w * 2},${box1Height - 2 * textHeight - zeroHeight - 2 * pad_h}
                        ${pad_w * 2 + box3Width},${box1Height - 2 * textHeight - zeroHeight - 2 * pad_h} 
                        ${totalWidth},${box1Height - (pad_h * 2 + box3Height + zeroHeight)} 
                        ${totalWidth},${box1Height - (pad_h * 2 + box3Height)} 
                        ${pad_w * 2 + box3Width},${box1Height - (pad_h * 2)}
                        ${pad_w * 2},${box1Height - (pad_h * 2)}
                        `, fill: boxFill, opacity: boxOpacity, strokeWidth: 2, stroke: boxStroke, filter: "url(#shadow)" }), _jsx("line", { x1: leftPortionWidth - pad_w * 2, y1: box1Height - 2 * textHeight - zeroHeight - 2 * pad_h, x2: totalWidth, y2: box1Height - (pad_h * 2 + box3Height + zeroHeight), stroke: boxStroke, strokeWidth: strokeWidth }), _jsx("line", { x1: leftPortionWidth - pad_w * 2, y1: box1Height - 2 * pad_h, x2: totalWidth, y2: box1Height - (pad_h * 2) - textHeight, stroke: boxStroke, strokeWidth: strokeWidth }), _jsx(ShadowRect, { x: 2 * pad_w, y: 3 * pad_h + 2 * textHeight - zeroHeight, width: box3Width, height: box3Height, fill: boxFill, stroke: hStroke, strokeWidth: strokeWidth }), _jsx("foreignObject", { x: 0, y: textHeight + pad_h, width: box1Width, height: textHeight, children: _jsx(Group, { group: groups.Z.group, name: `Z_${dimension}` }) }), _jsx(ShadowRect, { x: 2 * pad_w, y: 2 * pad_h + 3 * textHeight, width: box3Width, height: zeroHeight, fill: zeroFill }), _jsx("foreignObject", { x: 0, y: 2 * (textHeight + pad_h), width: box1Width, height: textHeight, children: _jsx(Group, { group: groups.H, name: `H_${dimension}` }) }), _jsx("foreignObject", { x: 0, y: 3 * (textHeight + pad_h), width: box1Width, height: textHeight, children: _jsx(Group, { group: groups.B.group, name: `B_${dimension}` }) })] }) }));
    { /* <div>
        <div className={styles.C}>
        <div className={styles.Z}>
                            <div className={styles.B}></div>
                        </div>
                    </div>
                </div>
                    {`H${lower(dimension)} = ${printGroup(groups.H)}`} */
    }
    /* } else if (ABBREVIATE && CEqualsZ) {
         // C = Z
         return (
             <div className={styles.homologyLayer}>
                 <div>
 
                 <div className={styles.C}>
                     <div className={styles.Z}>
                         {`C${lower(dimension)} = Z${lower(dimension)} = ${printGroup(groups.C)}`}
                         <div className={styles.B}>
                             {`B${lower(dimension)} = ${printGroup(groups.B.group)}`}
                         </div>
                     </div>
                 </div>
                 </div>
                     {`H${lower(dimension)} = ${printGroup(groups.H)}`}
             </div>
         );
     } else if (ABBREVIATE && ZEqualsB) {
         // Z = B
         return (
             <div className={styles.homologyLayer}>
                 <div className={styles.C}>
                     
                     {`C${lower(dimension)} = ${printGroup(groups.C)}`}
                     <div className={styles.Z}>
                         <div className={styles.B}>
                             {`Z${lower(dimension)} = B${lower(dimension)} = ${printGroup(groups.Z.group)}`}
                         
                         </div>
                     </div>
                 </div>
                 {`H${lower(dimension)} = ${printGroup(groups.H)}`}
             </div>
         );
     } else {
         // all proper
         return (
             <div className={styles.homologyLayer}>
                 <div>
 
                 <div className={styles.C}>
      
                     <div>
                     {`C${lower(dimension)} = ${printGroup(groups.C)}`}
                     <div className={styles.Z}>
                         {`Z${lower(dimension)} = ${printGroup(groups.Z.group)}`}
                         <div className={styles.B}>
                             {`B${lower(dimension)} = ${printGroup(groups.B.group)} || ${groups.B.basis.map(b => b.join(", ")).join(" | ")}`}
                         </div>
                     </div>
                     </div>
                     
                 </div>
                         {`H${lower(dimension)} = ${printGroup(groups.H)}`}
                     </div>
               
                 <div className={styles.edge}></div>
                 <div className={styles.edgeFront}></div>
             </div>
         );
     }
 
 
 
     return (
         <div>
             {groupNames.map((groupName, i) => {
                 const group = groups[groupName] as AbelianGroup;
                 return (
                     <div>
                         {`${groupName}${lower(dimension)} = ${printGroup(group)}`}
                     </div>
                 )
             })}
         </div>
     )
     */
};
export const HomologyPanel = ({ complex }) => {
    useEffect(() => {
        printCWComplex(complex);
        console.log(createPreset(complex));
    }, [complex]);
    const homologyResult = computeHomology(complex);
    return (_jsx("div", { className: styles.homologyBackground, children: homologyResult.toReversed().map((s, i, a) => {
            const dimension = a.length - i - 1;
            return (_jsx(DimensionLayer, { ...s, dimension: dimension }));
        }) }));
};
