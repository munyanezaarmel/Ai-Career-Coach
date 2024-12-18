import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps, CircularProgress } from '@mui/material';

interface ButtonProps extends MuiButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

const AppButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled,
  sx,
  ...props
}) => {
  return (
    <MuiButton
      variant="contained"
      size="small"
      disabled={disabled || isLoading}
      sx={{
        backgroundColor: '#ed3c1a',
        color: 'white',
        borderRadius: '20px',
        '&:hover': {
          backgroundColor: '#d93515',
        },
        '&.Mui-disabled': {
          backgroundColor: '#f08070',
          color: 'white',
        },
        ...sx, // This allows for additional sx props to be passed and merged
      }}
      {...props}
    >
      {isLoading ? (
        <>
          <CircularProgress size={16} color="inherit" sx={{ marginRight: 1 }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </MuiButton>
  );
};  

export default AppButton;
