import "./cell.styles.css"
import {useState} from "react";



const Cell = () => {
    const renderSign = () => {
        setClicked(true);
        if (sign === "X") {

            setSign("O");
        }
        else {
            setSign("X");
        }
    }
    const [sign, setSign] = useState("X");
    const [clicked, setClicked] = useState(false);
    return (
        <div className={`cell-container ${clicked? "transparent-container": ''}`} onClick={renderSign}>
            {clicked && <div className={`render-${sign}`}></div>}
        </div>
    )
}

export default Cell;