import {useEffect} from "react";
import "./bigXo.styles.css"
import XO from "../XO/xo.component";
import { useTicTacToe } from "../../state/tictactoeContext";
import { calculateWinner } from "../../util/findWinner.util";


const BigXO = () => {
    const { winner, wholeGameWinner, bigBoard, setWholeGameWinner, updateWholeGameWinner} = useTicTacToe();
    
    useEffect ( () => {
        
        const newWinner = calculateWinner(winner);
        if (newWinner != null){
            updateWholeGameWinner(newWinner);
        }
        
    },[winner])
    return (
        <>
        {wholeGameWinner && <p>{wholeGameWinner == "draw"? "it is a draw": `${wholeGameWinner} wins!`}</p>}
        <div className={`ultimate-container ${wholeGameWinner !== null ? `winner-${wholeGameWinner}`: ""}`}>
            {bigBoard.map((_, index) => (
                <XO key={index} idx={index} />
            ))}
        </div>
        </>
    );
};

export default BigXO;