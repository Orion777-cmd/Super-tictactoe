
import "./bigXo.styles.css"
import XO from "../XO/xo.component";
import { useTicTacToe } from "../../state/tictactoeContext";
import {useState} from "react";
import { calculateWinner } from "../XO/tictactoe.logic";

const BigXO = () => {
    const { updateGridState, board, sign ,setBoard} = useTicTacToe();
    
    const [wholeGameWinner, setWholeGameWinner] = useState(false);
    const [draw , setDraw] = useState(false)
    

    const localWinner = calculateWinner(board);
    
    if (localWinner) {
        setWholeGameWinner(true);
    } else if (!board.includes(null)) {
        setDraw(true)
        setWholeGameWinner(true);
    }

    const updateGameState = (index: number, status: string | null) => {
        // Ensure that status is a valid string or null before updating the state
            // Update the state or perform any other necessary actions
            // For now, let's just log the status
        if (board[index] === null && !wholeGameWinner) {
            const newBoard = [...board];
            newBoard[index] = status;
            setBoard(newBoard);
        }
        
        console.log("current Sign: ", sign)
        console.log("current board: ", board);
        
        console.log("Game Status:", status);
        return null;
    };

    return (
        <div className={`ultimate-container ${wholeGameWinner ? (draw ? 'winner-draw' : `winner-${sign === "X" ? "O" : "X"}`) : ''}`}>
            {board.map((_, index) => (
                <XO key={index} updateGameState={(status) =>  updateGameState(index, status)} />
            ))}
        </div>
    );
};

export default BigXO;