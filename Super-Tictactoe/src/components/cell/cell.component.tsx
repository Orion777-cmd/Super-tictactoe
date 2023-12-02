import "./cell.styles.css"
import {useState} from "react";

type CellProps = {
    renderSign: () => void;
    sign: string | null;
  };

const Cell: React.FC<CellProps> = ({renderSign , sign}) => {
    
    return (
        <div className="cell-container" onClick={renderSign}>
      {sign && <div className={`render-${sign}`}></div>}
    </div>
    )
}

export default Cell;