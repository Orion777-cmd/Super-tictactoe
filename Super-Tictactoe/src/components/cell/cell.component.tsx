import "./cell.styles.css"
import { useTicTacToe } from "../../state/tictactoeContext";
import { useEffect } from "react";


type CellProps = {
    renderSign: (innerIndex: number) => void;
    sign: string | null;
    innerIndex: number;
    outerIndex: number;
    
  };

const Cell: React.FC<CellProps> = ({renderSign , sign, innerIndex, outerIndex, }) => {
    const {activeIndex} = useTicTacToe();

    

    return (
        <div className="cell-container" onClick={() => renderSign(innerIndex)} >
      {sign && <div className={`render-${sign} ${activeIndex == outerIndex?  "cell-active": "cell-disable"}` }></div>}
    </div>
    )
}

export default Cell;