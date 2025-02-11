type IdentifyIconProps = {
    enabled: boolean;
}
export const IdentifyIcon = ({enabled}: IdentifyIconProps) => (
    <div style={{
        height: "34px",
        width: "34px",
        transform: "translate(0px,0)"
    }}>
        <svg height="34" width="34" style={{margin: "none"}} viewBox="0 0 34 34">
            <g transform={`rotate(45, 20, 20) translate(-8, -2) scale(1.15)`}>
                {/* 
                  Main shape path:
                  - Move to (12, 18)
                  - Draw line to (12, 30)
                  - Draw line to (26, 30)
                  - Draw line to (26, 18)
                  - Draw line to (19, 14)
                  - Close path
                */}
                <path
                  d="M14 18
                     L13 30
                     L25 30
                     L24 18
                     L22 16
                     L20 6
                     L18 6
                     L16 16
                     Z"
                  stroke="#000"
                  strokeWidth="0"
                />
                <path
                  d="M15 20
                     L15 26
                     L23 26
                     L23 20
                     L22 20
                     L16 20
                     Z"
                  stroke="#000"
                  strokeWidth="1"
                  fill="white"
                />
                <circle cx="28" cy="13" r="3"  stroke="#000" strokeWidth="0" />
                <polygon points="23,8 25,13 28,10" fill="black" stroke="#000" strokeWidth="1" />
                {/* 
                  Alternative curved shape (currently disabled):
                  <path
                    d="M20 14 C22 12, 24 12, 26 14 C26 16, 24 18, 20 18 C20 18, 20 14, 20 14 Z"
                    fill={enabled ? "#007aff" : "#ccc"}
                    stroke="#000"
                    strokeWidth="1"
                  />
                */}
            </g>
        </svg>
    </div>
);