import Cell from "../cell/cell.component";
import "./xo.styles.css"
import {useState} from "react";
const XO = () => {
    const renderSign = (index: number) => {
        if (board[index] === null) {
            const newBoard = [...board];
            newBoard[index] = sign;
            setBoard(newBoard);
            setSign(sign === "X" ? "O" : "X");
        }
        return null;
    }
    const [sign, setSign] = useState("O");
    const [clicked, setClicked] = useState(false);
    const [board, setBoard] = useState(Array(9).fill(null));
    return (
        <div className="grid-container">
           {board.map((cell, index) => (
                <Cell key={index} renderSign={() => renderSign(index)} sign={cell} />
            ))}
        </div>
    )
}

export default XO;