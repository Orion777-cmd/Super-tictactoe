import Cell from "../cell/cell.component";
import "./xo.styles.css"
const XO = () => {
    return (
        <div className="grid-container">
            {
                [...Array(9)].map((_, i) => <Cell key={i} />)
            }
        </div>
    )
}

export default XO;