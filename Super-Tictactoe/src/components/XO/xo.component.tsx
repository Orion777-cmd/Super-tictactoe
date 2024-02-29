import Cell from "../cell/cell.component";
import "./xo.styles.css"

import { useTicTacToe } from "../../state/tictactoeContext";


type XOpropType = {
    idx: number;
    
}
const XO: React.FC<XOpropType> = ({ idx }) => {
    const { sign, toggleSign, updateBigBoardState, bigBoard } = useTicTacToe();
 

    const renderSign = (index: number) => {
        if (bigBoard[idx][index] === null) {
            updateBigBoardState(idx, index, sign);
            toggleSign();
        }
        return null;
    }
 
   

    return (
        <div className={`grid-container ${bigBoard[idx] ? `winner-${bigBoard[idx]}` : ''}`}>
            {bigBoard[idx].map((cell, index) => (
                <Cell key={index} renderSign={() => renderSign(index)} sign={cell} />
            ))}
        </div>
    )
}

export default XO;