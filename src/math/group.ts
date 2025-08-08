export type AbelianGroup = {
    order: number;
    torsion: number[];
}

export type GroupWithBasis = {
    group: AbelianGroup,
    basis: number[][] // Basis vectors, where each vector is an array representing a basis element
}

export const groupIsZero = (group: AbelianGroup): boolean => group.order == 0 && group.torsion.length == 0;
export const groupsEqual = (a: AbelianGroup, b: AbelianGroup): boolean => a.order == b.order && a.torsion.length == b.torsion.length && a.torsion.every((t, i) => t == b.torsion[i]);


const superscript = (num: number): string => String(num).split('').map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join('');
export const printGroup = (group: AbelianGroup): string => {
    const terms = [];
    if (group.order == 1) {
        terms.push('Z');
    } else if (group.order > 1) {
        terms.push(`Z${superscript(group.order)}`);
    }
    terms.push(...group.torsion.map(t => `Z/${t}Z`));
    if (terms.length == 0) {
        return "0";
    }
    const returnStr = terms.join("⊕");
    // if contains string undefined, throw
    if (returnStr.includes("undefined")) {
        throw new Error("Undefined in group");
    }
    return returnStr;
}

const SERIF_MODE = true;
export const printGroupForLatex = (group: AbelianGroup, name: string): string => {
    if (SERIF_MODE) {
        return printGroupSerifs(group, name);
    } else {
        return printGroupSansSerifs(group, name);
    }
}
export const printGroupSerifs = (group: AbelianGroup, name: string): string => {
    const terms = [];
    if (group.order == 1) {
        terms.push('\\mathbb{Z}');
    } else if (group.order > 1) {
        terms.push(`\\mathbb{Z}^\{${group.order}\}`)
    }
    terms.push(...group.torsion.map(t => `\\Z_${t}`));
    if (terms.length == 0) {
        return `${name} =  0`;
    }
    const returnStr = terms.join("\\oplus");
    // if contains string undefined, throw
    if (returnStr.includes("undefined")) {
        throw new Error("Undefined in group");
    }
    if (name) {
        return `${name} = ${returnStr}`;
    }
    return `${returnStr}`;
}

const printGroupSansSerifs = (group: AbelianGroup, name: string): string => {
    const terms = [];
    if (group.order == 1) {
        terms.push('Z');
    } else if (group.order > 1) {
        terms.push(`Z^${group.order}`)
    }
    terms.push(...group.torsion.map(t => `Z_${t}Z`));

    for (let i = 0; i < terms.length; i++) {
        terms[i] = `${terms[i]}`;
    }
    if (terms.length == 0) {
        return `${name} =  0`;
    }
    let returnStr = terms.join("⊕");
    // if contains string undefined, throw
    if (returnStr.includes("undefined")) {
        throw new Error("Undefined in group");
    }
    if (name) {
        returnStr = `${name} = ${returnStr}`;
    }
    return `\\mathsf{${returnStr}}`;
}