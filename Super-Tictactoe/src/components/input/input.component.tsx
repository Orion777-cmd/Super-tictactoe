import "./input.styles.css";
import { useState } from "react";

type InputPropType = {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input: React.FC<InputPropType> = ({
  label,
  type,
  name,
  value,
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasValue, setHasValue] = useState<boolean>(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange(e);
  };

  const shouldShowLabel = isFocused || hasValue;

  return (
    <div className={`input-container ${isFocused ? "container-focused" : ""}`}>
      <label className={`${shouldShowLabel ? "label-focused" : ""}`}>
        {label}
      </label>
      <input
        className={`${isFocused ? "input-focused" : ""}`}
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder=""
      />
    </div>
  );
};

export default Input;
