import "./button.styles.css";

type ButtonPropType = {
    label: string;
    onClick: () => void;
}

const Button: React.FC<ButtonPropType> = ({label, onClick}) => {
    return (
        <button className="button" onClick={onClick}>{label}</button>
    )
}

export default Button;