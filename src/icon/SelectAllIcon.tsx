type SelectAllIconProps = {
    enabled: boolean;
}
export const SelectAllIcon = ({enabled}: SelectAllIconProps) => (
    <div style={{
        height: "28px",
        width: "28px",
        border: "2px dashed black",
        marginTop: "5px",
    }}>
        <div style={{
            marginLeft: "auto",
            height: "20px",
            width: "20px",
            transform: "translate(5px,-5px)",
            backgroundColor: "var(--unselected-bg)",
            border: "2px solid black",
            filter: "drop-shadow(-2px 2px 0px var(--unselected-bg))"
        }}>
            <div style={{
                width: "12px",
                height: "12px",
                backgroundColor: "black",
                margin: "2px",
            }}>
            </div>
        </div>
    </div>
);