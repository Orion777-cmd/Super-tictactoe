import "./button.styles.css";

type ButtonPropType = {
    label: string;
    onClick: () => void;
}

const Button: React.FC<ButtonPropType> = ({label, onClick}) => {
    return (
        <button className="buttton" onClick={onClick}>{label}</button>
    )
}

export default Button;