type ClearSelectionIconProps = {
    enabled: boolean;
}

export const ClearSelectionIcon = ({ enabled }: ClearSelectionIconProps) => (
    <div style={{
        height: "28px",
        width: "28px",
        marginTop: "5px",
        border: "2px dashed black",
    }}>
        <div style={{
            marginLeft: "auto",
            height: "20px",
            width: "20px",
            transform: "translate(5px,-5px)",
            backgroundColor: "var(--unselected-bg)",
            border: "2px solid black",
            position: "relative"
        }}>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "14px",
                height: "2px",
                backgroundColor: "black",
                transform: "translate(-50%, -50%) rotate(45deg)"
            }}></div>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "14px",
                height: "2px",
                backgroundColor: "black",
                transform: "translate(-50%, -50%) rotate(-45deg)"
            }}></div>
        </div>
    </div>
);