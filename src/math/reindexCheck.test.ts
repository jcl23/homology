import { expect, test, describe } from 'vitest';
import { reindexCheck } from "./reindexCheck";
import { CWComplex } from "./CWComplex";
import { Vertex, Edge, Face } from "./classes/cells";

// Test 1: Valid complex with proper indexing
test("reindexCheck returns true for properly indexed complex", () => {
    // Create vertices with sequential IDs
    const v0 = new Vertex([0, 0, 0], 0, 0);
    const v1 = new Vertex([1, 0, 0], 1, 1);
    const v2 = new Vertex([0, 1, 0], 2, 2);
    
    // Create edge with proper ID
    const e0 = new Edge(v0, v1, 0, 0);
    
    // Create face with proper ID (faces take edges, not vertices)
    const f0 = new Face([e0], 0, 0);
    
    const complex = new CWComplex();
    complex.cells = [
        [v0, v1, v2],  // dimension 0: vertices
        [e0],          // dimension 1: edges
        [f0],          // dimension 2: faces
        []             // dimension 3: balls
    ];
    
    expect(reindexCheck(complex)).toBe(true);
});

// Test 2: Invalid complex with gaps in indexing
test("reindexCheck returns false for complex with missing index", () => {
    // Create vertices with non-sequential IDs (missing ID 1)
    const v0 = new Vertex([0, 0, 0], 0, 0);
    const v1 = new Vertex([1, 0, 0], 2, 2); // ID 2 instead of 1
    const v2 = new Vertex([0, 1, 0], 3, 3); // ID 3 instead of 2
    
    const complex = new CWComplex();
    complex.cells = [
        [v0, v1, v2],  // dimension 0: vertices with IDs [0, 2, 3] - missing 1
        [],            // dimension 1: edges
        [],            // dimension 2: faces
        []             // dimension 3: balls
    ];
    
    expect(reindexCheck(complex)).toBe(false);
});
