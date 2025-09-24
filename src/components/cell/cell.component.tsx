import "./cell.styles.css";
import { GridState } from "../../types/gridStateType";

interface CellProps {
  value: GridState | null;
  onClick: () => void;
  disabled: boolean;
}

const Cell: React.FC<CellProps> = ({ value, onClick, disabled }) => {
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };

  return (
    <div className="cell-container" onClick={handleClick}>
      {value && <div className={`render-${value}`}></div>}
    </div>
  );
};

export default Cell;
