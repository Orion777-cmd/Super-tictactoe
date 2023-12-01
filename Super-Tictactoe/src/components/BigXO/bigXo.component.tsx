// import "../../tailwind.css";
import "./bigXo.styles.css"
import XO from "../XO/xo.component";
const BigXO = () => {
    return (
        <div className="ultimate-container">
            {
                [...Array(9)].map((_, i) => <XO key={i} />)
            }
        </div>
    )
}

export default BigXO;