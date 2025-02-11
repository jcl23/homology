import React, { useState } from "react";
import styles from "./DebugComplex.module.css";
import { CWComplex, AbstractCell } from "../../math/CWComplex";


type DebugComplexProps = {
  complex: CWComplex;
};

const boxSize = 12;

const DebugComplex: React.FC<DebugComplexProps> = ({ complex }) => {
  // get the maximum index for each dimension
  const getMaxIndex = (cells: AbstractCell[]): number =>
    cells.length > 0 ? Math.max(...cells.map((cell) => cell.index)) : -1;

  const getRepresentatives = (cells: AbstractCell[], index: number): AbstractCell[] =>
    cells.filter((cell) => cell.index === index);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {Object.keys(complex.cells).map((dim) => {
        const dimension = parseInt(dim, 10);
        const cellsInDim = complex.cells[dimension];
        const maxIndex = getMaxIndex(cellsInDim);

        return (
          <div key={dimension}>
            <div style={{ display: "flex", gap: "2px" }}>
              {/* Create a row of boxes for each index from 0 to maxIndex */}
              {Array.from({ length: maxIndex + 1 }).map((_, index) => {
                const representatives = getRepresentatives(cellsInDim, index);
                const hasCells = representatives.length > 0;

                return (
                  <div
                    key={index}
                    style={{
                      width: `${boxSize}px`,
                      height: `${boxSize}px`,
                      backgroundColor: hasCells ? "lightblue" : "lightgray",
                      border: "1px solid black",
                      position: "relative",
                      cursor: hasCells ? "pointer" : "default",
                      fontSize: "10px",
                    }}
                    title={hasCells ? `Index ${index}` : ""}
                  >
                    {index}
                    {/* Hover tooltip showing the cell representatives */}
                    {hasCells && (
                      <div
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          backgroundColor: "white",
                          border: "1px solid gray",
                          padding: "4px",
                          fontSize: "10px",
                          whiteSpace: "nowrap",
                          zIndex: 10,
                          visibility: "hidden",
                        }}
                        className={styles.tooltip}
                      >
                        {representatives.map((cell) => (
                          <div key={cell.id}>{cell.name || cell.id}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DebugComplex;
