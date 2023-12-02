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
    const {sign, toggleSign, gridStates, updateGridState} = useTicTacToe();
    // const [clicked, setClicked] = useState(false);
    const [board, setBoard] = useState(Array(9).fill(null));

    const winner = calculateWinner(board);
    let status;
    let finished: boolean;
    if(winner){
        status = `${winner}`
        finished = true;
    }else if (!board.includes(null)){
        status = `draw`;
        finished = true;
    }else{
        status = false;
        finished = false;
    }
    console.log(winner,board,  finished)
    return (
        <div className={`grid-container ${finished? `${status}` : '' }`}>
           {board.map((cell, index) => (
                <Cell key={index} renderSign={() => renderSign(index)} sign={cell} />
            ))}
        </div>
    )
}

export default XO;