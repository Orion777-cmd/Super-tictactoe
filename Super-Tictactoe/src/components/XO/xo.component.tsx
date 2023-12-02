import Cell from "../cell/cell.component";
import "./xo.styles.css"
import {useState} from "react";
import { useTicTacToe } from "../../state/tictactoeContext";
import { calculateWinner } from "./tictactoe.logic";

const XO = () => {

    

    const renderSign = (index: number) => {
        if (board[index] === null) {
            const newBoard = [...board];
            newBoard[index] = sign;
            setBoard(newBoard);
            toggleSign()
        }
        return null;
    }
    const {sign, toggleSign} = useTicTacToe();
    const [clicked, setClicked] = useState(false);
    const [board, setBoard] = useState(Array(9).fill(null));

    const winner = calculateWinner(board);
    let status;
    if(winner){
        status = `Winner: ${winner}`
    }else if (!board.includes(null)){
        status = `draw`;
    }else{
        status = `Next Player: ${sign}`
    }

    return (
        <div className="grid-container">
           {board.map((cell, index) => (
                <Cell key={index} renderSign={() => renderSign(index)} sign={cell} />
            ))}
        </div>
    )
}

export default XO;