import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E84040',
      light: '#FF6B6B',
      dark: '#C0392B',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FFD93D',
      light: '#FFE87A',
      dark: '#F0C000',
      contrastText: '#111111',
    },
    background: {
      default: '#0D0D0D',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255,255,255,0.7)',
    },
    divider: 'rgba(255,255,255,0.1)',
  },
  typography: {
    fontFamily: '"Roboto", "Noto Sans KR", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em' },
    h2: { fontSize: '1.5rem', fontWeight: 700 },
    h3: { fontSize: '1.25rem', fontWeight: 700 },
    h4: { fontSize: '1.1rem', fontWeight: 600 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    caption: { fontSize: '0.75rem', fontWeight: 400 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #E84040 0%, #C0392B 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #FF5555 0%, #E84040 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 4 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
            '&.Mui-focused fieldset': { borderColor: '#E84040' },
          },
          '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.6)' },
          '& .MuiInputBase-input': { color: '#fff' },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: '#111111',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          height: 64,
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: 'rgba(255,255,255,0.4)',
          '&.Mui-selected': { color: '#E84040' },
          minWidth: 0,
          padding: '6px 8px',
        },
      },
    },
  },
});

export default theme;
