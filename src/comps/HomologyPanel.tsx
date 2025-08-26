import { useEffect, useMemo, useState } from "react";

import { createPreset, CWComplex, printCWComplex, toLabeledMatrices, toNamedMatrices } from "../math/CWComplex"
import { computeHomology } from "../math/homology"
import styles   from './HomologyPanel.module.css'
import { computeTorsion, isZeroMatrix, LabeledMatrix, NamedMatrix,  } from "../math/matrix"
import Matrix from "ml-matrix";
import { AbelianGroup, printGroup, groupsEqual, GroupWithBasis } from "../math/group";
import Group from "./Group";
type HomologyPanelProps = {
    complex: CWComplex,
    stepIndex: number
}

type MatrixPanelProps = {
    namedMatrix: NamedMatrix
    name: string,
    hide: () => void
}
export const MatrixPanel = ({ namedMatrix, name, hide }: MatrixPanelProps) => {
    const { ins, outs, matrix } = namedMatrix;
    if (matrix.length === 0) {
        return <div>{"Empty Matrix"}</div>;
    }

 
    const width = matrix[0].length;
    const height = matrix.length;
    const divWidth = width * 40 + 100;
    const divHeight = height * 40 + 100;
    return (
        <div
            style={{
                width: divWidth + "px",
                height: divHeight + "px",
                position: "absolute",
                background: "white",
                opacity: 1,
                top: "50%",
                left: "50%",
                border: "2px solid black",
                zIndex: 10000000000000000000000,
                transform: "translate(-50%, -50%)",

            }}
        onClick={hide}>
            {name} ({width}x{height})
        <table>
            <thead>
                <tr>
                    <th></th>
                    {ins.map(inName => (
                        <th>{inName}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {matrix.map((row, i) => (
                    <tr>
                        <td>{outs[i]}</td>
                        {row.map(cell => (
                            <td>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    )
}

type DimensionLayerProps = {
    dimension: number,
    C: AbelianGroup,
    B: GroupWithBasis,
    Z: GroupWithBasis,
    H: AbelianGroup,
    matrixOut: NamedMatrix,
}

const lower = (num: number): string => "₀₁₂₃₄₅₆₇₈₉"[num];

const ShadowRect = (props: React.SVGProps<SVGRectElement>) => {
    return (
        <>
            
            <rect {...props} />
        </>
    );
}
export const DimensionLayer = ({dimension, matrixOut, ...groups}: DimensionLayerProps) => {
    const [showMatrix, setShowMatrix] =  useState(false);
    const groupNames = ["C", "B", "Z", "H"] as const;
    const CEqualsZ = groupsEqual(groups.C, groups.Z.group);
    const ZEqualsB = groupsEqual(groups.Z.group, groups.B.group);
    const ABBREVIATE = false;

    const rightWidth = 40;
    const innermostWidth = 110;
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
    return (
        <div className={styles.homologyLayer} style={{zIndex: dimension}} onClick={() => setShowMatrix(!showMatrix)}>
            { showMatrix && <MatrixPanel namedMatrix={matrixOut} name={`∂_${dimension}`} hide={() => setShowMatrix(false)}/> }
            <svg style={{opacity: 1}} width={totalWidth} height={totalHeight}>
                <defs>
                    <filter id="shadow" x="-100%" y="-50%" width="300%" height="150%" >
                        <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#0008" />
                    </filter>
                </defs>
                {/* Upper line */}
                <line x1={leftPortionWidth} y1={0} x2={totalWidth} y2={box1Height - (pad_h * 2 + box3Height + zeroHeight)} stroke={boxStroke} strokeWidth={strokeWidth}/>
                {/* Lower line */}
                <line x1={leftPortionWidth} y1={box1Height} x2={totalWidth} y2={box1Height - (pad_h * 2)} stroke={boxStroke} strokeWidth={strokeWidth}/>
                {/* Trap containing lines */}
                <polygon points={
                    `   ${0},${0}
                        ${leftPortionWidth},${0} 
                        ${totalWidth},${box1Height - (pad_h * 2 + box3Height + zeroHeight)} 
                        ${totalWidth},${box1Height - (pad_h * 2)} 
                        ${leftPortionWidth},${box1Height}
                        ${0},${box1Height}
                    `
                } 
                    fill={boxFill}
                    opacity={boxOpacity}
                    strokeWidth={2}
                    stroke={boxStroke}

                />
                {/* Inner top line */}
                {/* <rect  x={0} y={0} width={box1Width} height={box1Height} fill={boxFill} stroke={outerStroke} strokeWidth={strokeWidth}/> */}


                {/* Outer box containing C */}
                {/* <ShadowRect x={0} y={0} width={box1Width} height={box1Height} fill={boxFill} stroke={outerStroke} strokeWidth={strokeWidth}/> */}
                {/* <text x={pad_w / 2} y={textHeight} fill="black">{`C${lower(dimension)} = ${printGroup(groups.C)}`}</text> */}
 
                {/* Containing Z */}
                {/* <ShadowRect x={pad_w} y={pad_h + textHeight} width={box2Width} height={box2Height} fill={boxFill} stroke={boxStroke} strokeWidth={strokeWidth}/> */}
                {/* <text x={pad_w * 1.5} y={textHeight * 2+ pad_h / 2} fill="black">{`Z${lower(dimension)} = ${printGroup(groups.Z.group)}`}</text> */}
                <foreignObject className={`c-group-${dimension}`} x={0} y={0} width={box1Width} height={textHeight}>
                    <Group group={groups.C}  name={`C_${dimension}`}/>
                </foreignObject>
              
                 
                <polygon 
                    points={
                        `
                        ${pad_w * 2},${box1Height - 2 * textHeight - zeroHeight - 2 * pad_h}
                        ${pad_w * 2 + box3Width},${box1Height - 2 * textHeight - zeroHeight - 2 * pad_h} 
                        ${totalWidth},${box1Height - (pad_h * 2 + box3Height + zeroHeight)} 
                        ${totalWidth},${box1Height - (pad_h * 2  + box3Height)} 
                        ${pad_w * 2 + box3Width},${box1Height - (pad_h * 2)}
                        ${pad_w * 2},${box1Height - (pad_h * 2)}
                        `  
                    } 
                    fill={boxFill}
                    opacity={boxOpacity} 
                    strokeWidth={2}
                    stroke={boxStroke}
             
                />
            <line  x1={leftPortionWidth - pad_w * 2} y1={box1Height - 2 * textHeight - zeroHeight - 2 * pad_h} x2={totalWidth} y2={box1Height - (pad_h * 2 + box3Height + zeroHeight)} stroke={boxStroke} strokeWidth={strokeWidth}/>
            {/* Inner bottom line */}
            <line x1={leftPortionWidth - pad_w * 2} y1={box1Height - 2 * pad_h} x2={totalWidth} y2={box1Height - (pad_h * 2) - textHeight} stroke={boxStroke} strokeWidth={strokeWidth}/>
                  
                {/* Containing H */}
                {/* <text x={pad_w * 2.5} y={textHeight * 3 + pad_h} fill="black">{`B${lower(dimension)} = ${printGroup(groups.B.group)}`}</text> */}
                <foreignObject className={`z-group-${dimension}`} x={0} y={textHeight + pad_h} width={box1Width} height={textHeight}>
                    <Group group={groups.Z.group}  name={`Z_${dimension}`}/>
                </foreignObject>
               
                {/* Box joining H and B containing 0 */}
                
                {/* Containing B */}
                {/* <ShadowRect x={2 * pad_w} y={2 * pad_h + zeroHeight + 3 * textHeight} width={box3Width} height={box3Height} fill={boxFill} stroke={bStroke} strokeWidth={strokeWidth}/> */}
    
                {/* <text x={pad_w * 2.5} y={textHeight * 4 + pad_h * 2} fill="black">{`H${lower(dimension)} = ${printGroup(groups.H)}`}</text>
                 */}
                <foreignObject  className={`h-group-${dimension} ${styles.HGroup}`} x={0} y={2*(textHeight + pad_h)} width={box1Width} height={textHeight}>
                    <Group group={groups.H}  name={`H_${dimension}`}/>
                </foreignObject>
                <foreignObject  className={`b-group-${dimension}`} x={0} y={3*(textHeight + pad_h)} width={box1Width} height={textHeight}>
                    <Group group={groups.B.group}  name={`B_${dimension}`}/>
                </foreignObject>

            </svg>
        </div>
    )
    {/* <div>
        <div className={styles.C}>
        <div className={styles.Z}>
                            <div className={styles.B}></div>
                        </div>
                    </div>
                </div>
                    {`H${lower(dimension)} = ${printGroup(groups.H)}`} */}

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
}
export const HomologyPanel = ({ complex, stepIndex }: HomologyPanelProps) => {
   
    useEffect(() => {
        printCWComplex(complex);
        console.log(createPreset(complex));
    }, [complex]);

    
    const homologyResult = computeHomology(complex);
    const matrices = toNamedMatrices(complex);
    return (
        <div>

            <div className={styles.homologyBackground}>
                {homologyResult.toReversed().map((s, i, a) => {
                    const dimension = a.length - i - 1;
                    return (
                        <DimensionLayer {...s} dimension={dimension} matrixOut={matrices[dimension]} />
                    )
                }
            )}
            </div>
        </div>
    )
}