import "./button.styles.css";

type ButtonPropType = {
  label: string;
  onClick: (...args: any[]) => void | Promise<void>;
  disabled?: boolean;
};

const Button: React.FC<ButtonPropType> = ({
  label,
  onClick,
  disabled = false,
}) => {
  const handleClick = (...args: any[]) => {
    if (!disabled) {
      onClick(...args);
    }
  };
  return (
    <button className="buttton" onClick={handleClick} disabled={disabled}>
      {label}
    </button>
  );
};

export default Button;
