import "./input.styles.css"
import {useState} from "react";

type InputPropType = {
    label: string;
    type: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputPropType> = ({label, type, name, value, onChange}) => {

    const [isFocused, setIsFocused] = useState<boolean>(false);
    const handleFocus = () => {
        setIsFocused(true);
    }

    const handleBlur = () => {
        setIsFocused(false);
    }
    return (
        <div className={`input-container ${isFocused? "container-focused": ""}`} >
            <label className={`${isFocused? "label-focused": ""}`}>{label}</label>
            <input className={`${isFocused? "input-focused": ""}`} type={type} name={name} value={value} onChange={onChange} onFocus={handleFocus} onBlur={handleBlur}/>
        </div>
    )
}


export default Input;
