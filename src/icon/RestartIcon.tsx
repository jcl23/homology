import { LockReset, Redo, Refresh, RestartAlt, RestartAltTwoTone, UndoOutlined } from "@mui/icons-material"

export const RestartIcon = function() {
    return (
        <div
        style={{
            
            marginTop: "6px",
            marginBottom: "1px",
            transform: "scale(1.25) scaleX(-1) ",
        }}>
            <Refresh width="20"/>
        </div>
    )
}