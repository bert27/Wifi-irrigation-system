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
    const newValue = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <TextField
      type="number"
      variant="outlined"
      label={label}
      value={value}
      onChange={handleInputChange}
      size="small"
      sx={{
        width: '100%',
        '& .MuiInputBase-root': {
          color: 'var(--text-main)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '8px',
          fontFamily: 'var(--font-tech)',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--primary)',
        },
        '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'var(--primary)',
          boxShadow: '0 0 10px var(--primary-glow)',
        },
        '& .MuiInputLabel-root': {
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-tech)',
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: 'var(--primary)',
        },
      }}
      InputLabelProps={{
        shrink: true,
      }}
    />
  );
};
