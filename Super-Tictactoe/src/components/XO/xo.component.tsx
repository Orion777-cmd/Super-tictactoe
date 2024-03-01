import Cell from "../cell/cell.component";
import "./xo.styles.css"

import { useTicTacToe } from "../../state/tictactoeContext";

import { calculateWinner } from "../../util/findWinner.util";


type XOpropType = {
    idx: number;
    
}
const XO: React.FC<XOpropType> = ({ idx }) => {
    const { activeBoard, updateActiveBoardState, sign, toggleSign, updateBigBoardState, bigBoard, updateWinnerBoardState, winner } = useTicTacToe();
 
    console.log("active board state: ", activeBoard[idx])
    const renderSign = (index: number) => {
        console.log("renderSign", idx, index);
        if (bigBoard[idx][index] === null) {
            updateBigBoardState(idx, index, sign);
            if (winner[idx] === null) {
                const newWinner = calculateWinner(bigBoard[idx]);
                console.log("newWinner: ", newWinner);
                updateWinnerBoardState(idx, newWinner);
            }   
            toggleSign();
        }
        return null;
    }
   
    return (
        <div className={`grid-container ${activeBoard[idx] == true}: "board-active": ""`}>
            {winner[idx]!= null ? <div className={`winner-${winner[idx]}`}></div>
            :
            bigBoard[idx].map((cell, index) => (
                <Cell key={index} renderSign={renderSign} sign={cell} innerIndex={index} outerIndex={idx} />
            ))}
        </div>
    )
}

export default XO;