import {NormalForm} from "@tdajs/normal-form";
import { useEffect } from "react";
import { CWComplex, printCWComplex, toLabeledMatrices } from "./CWComplex";
import { LabeledMatrix, isZeroMatrix, rankKernel, rankImage, computeTorsion } from "./matrix";
import { AbelianGroup, GroupWithBasis, printGroup } from "./group";



export const getChainGroups = (complex: CWComplex): number[] => {
    return [0, 1, 2, 3].map(dim => {
        const allIndices = complex.cells[dim].map(cell => cell.index);
        const uniqueIndices = [...new Set(allIndices)];
        return uniqueIndices.length;
    });
}



type HomologyLevel = {
    C: AbelianGroup,   // Chain group C_n with its basis
    B: GroupWithBasis,   // Boundary group B_n with its basis
    Z: GroupWithBasis,   // Cycle group Z_n with its basis
    H: AbelianGroup      // Homology group H_n (with torsion information)
}

export const computeHomology = (complex: CWComplex): HomologyLevel[] => {
    const chains = getChainGroups(complex);
    console.log("Get chains here:", chains);
    const matrices = toLabeledMatrices(complex);
    console.log(matrices);
    const matrixPairs: [LabeledMatrix, LabeledMatrix][] = [];
    matrixPairs.push([null, matrices[0]]);

    for (let i = 1; i < matrices.length; i++) {
        matrixPairs.push([matrices[i - 1], matrices[i]]);
    }

    const homology = matrixPairs.map(([a, b], i) => {
        let rank_z = chains[i];
        let rank_b = 0;
        let torsion: number[] = [];
        let basis_z: number[][] = []; // Basis for Z_n
        let basis_b: number[][] = []; // Basis for B_n
        let reducedA = a?.matrix ?? [];
        let reducedB = b?.matrix;

        // Compute Z_n basis (kernel of A)
        if (a && !isZeroMatrix(a.matrix)) {
            console.log("HOM")
            const normalFormA = new NormalForm(a.matrix);
            reducedA = normalFormA.D;
            rank_z = rankKernel(reducedA);
            basis_z = [];//  normalFormA.kernelBasis(); // Get kernel basis
        } else if (a && isZeroMatrix(a.matrix)) {
            // rank_z = a.matrix[0].length;
        }

        // Compute B_n basis (image of B)
        if (b && !isZeroMatrix(b.matrix)) {

            const normalFormB = new NormalForm(b.matrix);
            reducedB = normalFormB.D;
            rank_b = rankImage(reducedB);
            torsion = computeTorsion(reducedB);
            console.log(`TORSION(${i})`, torsion);
            basis_b = []; //normalFormB.imageBasis(); // Get image basis
        } else if (b && isZeroMatrix(b.matrix)) {
            rank_b = 0;
        }

        const order = rank_z - rank_b;
        if (order < 0) {
            console.log({order});
        }


        return {
            C: { order: chains[i], torsion: [] },
            B: { group: { order: rank_b, torsion: [] }, basis: basis_b },
            Z: { group: { order: rank_z, torsion: [] }, basis: basis_z },
            H: { order, torsion }
        };
    });

    return homology;
}
