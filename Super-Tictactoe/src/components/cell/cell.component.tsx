import "./cell.styles.css"
import {useState} from "react";

type CellProps = {
    renderSign: (innerIndex: number) => void;
    sign: string | null;
    innerIndex: number;
  };

const Cell: React.FC<CellProps> = ({renderSign , sign, innerIndex}) => {
    
    return (
        <div className="cell-container" onClick={() => renderSign(innerIndex)}>
      {sign && <div className={`render-${sign}`}></div>}
    </div>
    )
}

export default Cell;