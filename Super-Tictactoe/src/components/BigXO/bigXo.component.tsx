
import "./bigXo.styles.css"
import XO from "../XO/xo.component";
import { useTicTacToe } from "../../state/tictactoeContext";


const BigXO = () => {
    const { wholeGameWinner, bigBoard, sign, updateBigBoardState} = useTicTacToe();
    
    return (
        <div className={`ultimate-container ${wholeGameWinner !== null ? `winner-${wholeGameWinner}`: ""}`}>
            {bigBoard.map((_, index) => (
                <XO key={index} idx={index} />
            ))}
        </div>
    );
};

export default BigXO;