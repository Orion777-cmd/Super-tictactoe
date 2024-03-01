import {useEffect} from "react";
import "./bigXo.styles.css"
import XO from "../XO/xo.component";
import { useTicTacToe } from "../../state/tictactoeContext";
import { calculateWinner } from "../../util/findWinner.util";


const BigXO = () => {
    const { winner, wholeGameWinner, bigBoard, updateWholeGameWinner} = useTicTacToe();
    
    useEffect ( () => {
        
        const newWinner = calculateWinner(winner);
        if (newWinner != null){
            updateWholeGameWinner(newWinner);
        }
        
    },[winner])
    return (
                
        <div className={`ultimate-container `}>
            {wholeGameWinner != null ? <div className={`winner-container winner-${wholeGameWinner}`}></div>
            :
            bigBoard.map((_, index) => (
                <XO key={index} idx={index} />
            ))}
        </div>
        
    );
};

export default BigXO;