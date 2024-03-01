import Cell from "../cell/cell.component";
import "./xo.styles.css"

import { useTicTacToe } from "../../state/tictactoeContext";

import { calculateWinner } from "../../util/findWinner.util";
import { useEffect } from "react";



type XOpropType = {
    idx: number;
    
}
const XO: React.FC<XOpropType> = ({ idx }) => {
    const { updateActiveIndexState, isGameStarted,updateIsGameStarted,wholeGameWinner,activeIndex, sign, toggleSign, updateBigBoardState, bigBoard, updateWinnerBoardState, winner } = useTicTacToe();
 
    
    const renderSign = (index: number) => {
        if (wholeGameWinner === null &&  !isGameStarted) {
            updateIsGameStarted();
        }
        if (bigBoard[idx][index] === null) {
            updateBigBoardState(idx, index, sign);
        
            if (winner[idx] === null) {
                const newWinner = calculateWinner(bigBoard[idx]);
                
                updateWinnerBoardState(idx, newWinner);
            }  
            
           
           
            toggleSign();
        }
       
        return null;
    }
    
   
    
    
   console.log("current Active index: ", activeIndex);
    return (
        <div className={`grid-container ${activeIndex == idx}: "board-active": "board-disable"`}>
            {winner[idx]!= null ? <div className={`winner-${winner[idx]}`}></div>
            :
            bigBoard[idx].map((cell, index) => (
                <Cell key={index} renderSign={renderSign} sign={cell} innerIndex={index} outerIndex={idx}  />
            ))}
        </div>
    )
}

export default XO;