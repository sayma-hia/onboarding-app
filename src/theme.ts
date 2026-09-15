import { createTheme } from '@mui/material/styles';

// strictly black and white palette per design brief
export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#616161',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#000000',
      secondary: '#5f5f5f',
    },
    divider: '#000000',
    error: {
      main: '#000000',
    },
  },
  shape: {
    borderRadius: 2,
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    button: { fontWeight: 500 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #000000',
        },
        elevation1: { boxShadow: 'none' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: '#e0e0e0',
        },
        bar: {
          backgroundColor: '#000000',
        },
      },
    },
  },
});
