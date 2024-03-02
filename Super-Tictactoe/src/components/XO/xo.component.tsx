import Cell from "../cell/cell.component";
import "./xo.styles.css"

import { useTicTacToe } from "../../state/tictactoeContext";

import { calculateWinner } from "../../util/findWinner.util";




type XOpropType = {
    idx: number;
    
}
const XO: React.FC<XOpropType> = ({ idx }) => {
    const { isGameStarted,updateIsGameStarted,wholeGameWinner,activeIndex, sign, toggleSign, updateBigBoardState, bigBoard, updateWinnerBoardState, winner } = useTicTacToe();
 
    
    const renderSign = (index: number) => {
        if (wholeGameWinner === null &&  !isGameStarted) {
            updateIsGameStarted();
        }
        if (bigBoard[idx][index] === null) {
            updateBigBoardState(idx, index, sign);
        
            if (winner[idx] === null) {
                const newWinner = calculateWinner(bigBoard[idx]);
                if (newWinner !== null){
                    updateWinnerBoardState(idx, newWinner);
                }
                
            }  
            
           
           
            toggleSign();
        }
       
        return null;
    }
    
   
    return (
        <div className={`grid-container ${winner[idx] === null && (activeIndex === -1 || activeIndex == idx)? "board-active": "board-disable"}`}>
            {winner[idx]!= null ? <div className={`winner-${winner[idx]}`}></div>
            :
            bigBoard[idx].map((cell, index) => (
                <Cell key={index} renderSign={renderSign} sign={cell} innerIndex={index} outerIndex={idx}  />
            ))}
        </div>
    )
}

export default XO;