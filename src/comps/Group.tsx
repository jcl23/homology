import React from 'react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css'; 
import { AbelianGroup, printGroup, printGroupForLatex } from '../math/group';

interface GroupProps {
    group: AbelianGroup;
    name: string;
}

export const stylizeGroupName = function(name: string): string {
    // This method was made by chat gpt. 
    const subscripts: Record<string, string> = {
        '0': '₀',
        '1': '₁',
        '2': '₂',
        '3': '₃',
        '4': '₄',
        '5': '₅',
        '6': '₆',
        '7': '₇',
        '8': '₈',
        '9': '₉'
    };

    const superscripts: Record<string, string> = {
        '0': '⁰',
        '1': '¹',
        '2': '²',
        '3': '³',
        '4': '⁴',
        '5': '⁵',
        '6': '⁶',
        '7': '⁷',
        '8': '⁸',
        '9': '⁹',
        '-': '⁻'
    };

    return name
        .replace(/_(\d+)/g, (_, digits) =>
            digits.split('').map(ch => subscripts[ch] ?? ch).join('')
        )
        .replace(/\^(\d+)/g, (_, digits) =>
            digits.split('').map(ch => superscripts[ch] ?? ch).join('')
        );
    
}


const Group: React.FC<GroupProps> = ({ group, name }) => {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontStyle: 'bold',
            fontWeight: 'bold',
            
        }}>
            {stylizeGroupName(`${name} = ${printGroup(group)}`)}
            {/* <Latex >{`$${printGroupForLatex(group, name)}$`}</Latex>     */}
        </div>
    );
};

export default Group;