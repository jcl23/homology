export const groupIsZero = (group) => group.order == 0 && group.torsion.length == 0;
export const groupsEqual = (a, b) => a.order == b.order && a.torsion.length == b.torsion.length && a.torsion.every((t, i) => t == b.torsion[i]);
const superscript = (num) => String(num).split('').map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹"[+c]).join('');
export const printGroup = (group) => {
    const terms = [];
    if (group.order == 1) {
        terms.push('Z');
    }
    else if (group.order > 1) {
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
};
const SERIF_MODE = false;
export const printGroupForLatex = (group, name) => {
    if (SERIF_MODE) {
        return printGroupSerifs(group, name);
    }
    else {
        return printGroupSansSerifs(group, name);
    }
};
export const printGroupSerifs = (group, name) => {
    const terms = [];
    if (group.order == 1) {
        terms.push('\\Bbb{Z}');
    }
    else if (group.order > 1) {
        terms.push(`\\Bbb{Z}^${group.order}`);
    }
    terms.push(...group.torsion.map(t => `\\Z/${t}\\Bbb{Z}`));
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
};
const printGroupSansSerifs = (group, name) => {
    const terms = [];
    if (group.order == 1) {
        terms.push('Z');
    }
    else if (group.order > 1) {
        terms.push(`Z^${group.order}`);
    }
    terms.push(...group.torsion.map(t => `Z/${t}Z`));
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
};
