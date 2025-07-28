type PointerIconProps = {
    color: string;
}

const PointerIcon = ({ color } : PointerIconProps) => (
    <svg width="25px" height="34px" viewBox="-2 -2 11 14" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0 0 L 0 10 L 2.852 6.596 L 5.338 10.324 L 6.258 9.633 L 3.988 6.213 L 7.499 5 L 0 0" fill={color} />
    </svg>
);


const MoveIcon = ({ color } : PointerIconProps) => (
    // a cross of arrows
    <svg  width="35px" height="35px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        {/* Up arrow */}
        <line x1="10" y1="13" x2="10" y2="5" stroke={color} strokeWidth="2" />
        <polygon points="10,3 7,6 13,6" fill={color} />

        {/* Down arrow */}
        <line x1="10" y1="7" x2="10" y2="15" stroke={color} strokeWidth="2" />
        <polygon points="10,17 7,14 13,14" fill={color} />

        {/* Left arrow */}
        <line x1="13" y1="10" x2="5" y2="10" stroke={color} strokeWidth="2" />
        <polygon points="3,10 6,7 6,13" fill={color} />

        {/* Right arrow */}
        <line x1="7" y1="10" x2="15" y2="10" stroke={color} strokeWidth="2" />
        <polygon points="17,10 14,7 14,13" fill={color} />
    </svg>
);

export {
    PointerIcon, MoveIcon
}