import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

interface InputNumberProps {
  value: string | number;
  onChange: (value: number) => void;
  label: string;
}

export const InputNumber: React.FC<InputNumberProps> = ({
  value,
  onChange,
  label,
}) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log("event", event);
    const newValue = Number(event.target.value); // Convertimos el valor a número
    console.log("newValue", newValue);
    onChange(newValue); // Llamamos a la función onChange con el nuevo valor numérico
  };

  return (
    <TextField
      type="number"
      color="primary"
      label={label}
      value={value}
      onChange={handleInputChange}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};
