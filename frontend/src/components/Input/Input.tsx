import React from "react";
import { TextField, TextFieldProps, FormHelperText } from "@mui/material";

interface InputProps extends Omit<TextFieldProps, "variant"> {
  error?: boolean;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  sx,
  error,
  errorMessage,
  helperText,
  ...props
}) => {
  return (
    <>
      <TextField
        variant="outlined"
        fullWidth
        error={error}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "9999px", // Fully rounded corners
            backgroundColor: "white",
            "& fieldset": {
              borderColor: error ? "#d32f2f" : "#e0e0e0", // Red for error, light gray otherwise
            },
            "&:hover fieldset": {
              borderColor: error ? "#d32f2f" : "#bdbdbd", // Red for error, slightly darker on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: error ? "#d32f2f" : "#1976d2", // Red for error, MUI default primary color otherwise
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 16px", // Adjust padding as needed
          },
          ...sx, // Allow additional sx props to be passed
        }}
        {...props}
      />
      {error && errorMessage && (
        <FormHelperText error sx={{ marginLeft: "14px", marginRight: "14px" }}>
          {errorMessage}
        </FormHelperText>
      )}
      {helperText && !error && (
        <FormHelperText sx={{ marginLeft: "14px", marginRight: "14px" }}>
          {helperText}
        </FormHelperText>
      )}
    </>
  );
};

export default Input;
