import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Inter, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
    body1: {
      fontWeight: 400,
    },
    body2: {
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: '#FF5733',
    },
  },
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&.Mui-active': {
            color: '#FF5733',
          },
          '&.Mui-completed': {
            color: '#FF5733',
          },
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: '#FF5733',
        },
      },
    },
  },
});

export default theme;