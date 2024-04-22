import "./button.styles.css";

type ButtonPropType = {
    label: string;
    onClick: (...args: any[]) => void | Promise<void>;
}


const Button: React.FC<ButtonPropType> = ({label, onClick}) => {
    const handleClick = (...args: any[]) => {
        onClick(...args);
    }
    return (
        <button className="buttton" onClick={handleClick}>{label}</button>
    )
}

export default Button;