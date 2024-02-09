import Cell from "../cell/cell.component";
import "./xo.styles.css"
import {useState,useEffect} from "react";
import { useTicTacToe } from "../../state/tictactoeContext";
import { calculateWinner } from "./tictactoe.logic";

type XOpropType = {
    updateGameState: (status: string | null) => void;
    
}
const XO: React.FC<XOpropType> = ({ updateGameState }) => {
    const { sign, toggleSign, finished, setFinishedState } = useTicTacToe();
    const [board, setBoard] = useState(Array(9).fill(null));

    const renderSign = (index: number) => {
        if (board[index] === null && !finished) {
            const newBoard = [...board];
            newBoard[index] = sign;
            setBoard(newBoard);
            toggleSign();
        }
        return null;
    }

    const localWinner = calculateWinner(board);

    let status: null | string;

    if (localWinner) {
        status = `${localWinner}`;
        setFinishedState(true);
    } else if (!board.includes(null)) {
        status = 'draw';
        setFinishedState(true);
    } else {
        status = null;
    }
 
    if (finished){
        updateGameState(status);
    }

    return (
        <div className={`grid-container ${finished ? `winner-${status}` : ''}`}>
            {board.map((cell, index) => (
                <Cell key={index} renderSign={() => renderSign(index)} sign={cell} />
            ))}
        </div>
    )
}

export default XO;