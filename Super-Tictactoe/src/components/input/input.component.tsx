import "./input.styles.css"

type InputPropType = {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputPropType> = ({label, type, name, value, onChange}) => {

    return (
        <div className="input-container">
            <label>{label}</label>
            <input type={type} name={name} value={value} onChange={onChange} />
        </div>
    )
}


export default Input;
