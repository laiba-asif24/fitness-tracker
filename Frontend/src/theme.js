import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5A36', // pulse — coral-orange accent
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#1F7A5C', // volt — deep green
    },
    background: {
      default: '#F7F5F0', // paper
      paper: '#FFFFFF',
    },
    text: {
      primary: '#12181B', // ink
      secondary: '#5B6169', // slate
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h2: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h3: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    h4: { fontFamily: '"Archivo Black", "Arial Black", sans-serif' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 22px' },
        containedPrimary: {
          '&:hover': { backgroundColor: '#12181B' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #E3DFD6',
          boxShadow: 'none',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
});

export default theme;
