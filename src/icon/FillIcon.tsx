type FillIconProps = {
    enabled: boolean;
}
export const FillIcon = ({enabled}: FillIconProps) => (
    <div style={{
        height: "36px",
        width: "42px",
    }}>
        <svg height="32" width="38" style={{margin: "none", transform: "translateY(3px)"}} viewBox="-2 0 36 34">
            <defs>
                <pattern id="dashedFill" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(-50)">
                    <path d="M 0 3 L 6 3" stroke="black" strokeWidth="3" />
                </pattern>
            </defs>
            <polygon points="2,4 6,29 30,30" style={{ fill: "url(#dashedFill)", stroke: "black", strokeWidth: 2.5 }} />
            <polygon points="5,10 8,27 24,28" style={{ fill: "transparent", stroke: "white", strokeWidth: 2 }} />
        <circle cx="2" cy="4" r="4" fill="black" />
        <circle cx="6" cy="28" r="4" fill="black" />
        <circle cx="30" cy="30" r="4" fill="black" />
        <line x1="21" y1="8" x2="33" y2="8" stroke="black" strokeWidth="3" />
        <line x1="27" y1="2" x2="27" y2="14" stroke="black" strokeWidth="3" />
        </svg>
    </div>
);