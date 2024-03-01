import "./cell.styles.css"
import {useState} from "react";
import { useTicTacToe } from "../../state/tictactoeContext";
import { act } from "react-dom/test-utils";

type CellProps = {
    renderSign: (innerIndex: number) => void;
    sign: string | null;
    innerIndex: number;
    outerIndex: number;
  };

const Cell: React.FC<CellProps> = ({renderSign , sign, innerIndex, outerIndex}) => {
    const {activeBoard} = useTicTacToe();
    return (
        <div className="cell-container" onClick={() => renderSign(innerIndex)}>
      {sign && <div className={`render-${sign} ${!activeBoard[outerIndex]}: "cell-disable": "cell-active"` }></div>}
    </div>
    )
}

export default Cell;