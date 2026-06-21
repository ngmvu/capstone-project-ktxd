import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976D2', // Xanh dương chủ đạo chuyên nghiệp
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0288d1',
      light: '#29b6f6',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7FA', // Nền xám xanh nhạt tinh tế
      paper: '#ffffff', // Card nền trắng sạch sẽ
    },
    text: {
      primary: '#1D2939', // Chữ tối màu dễ đọc
      secondary: '#475467',
      disabled: '#98A2B3',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    htmlFontSize: 16,
    fontSize: 16,
    allVariants: {
      color: '#1D2939',
      lineHeight: 1.5,
      letterSpacing: '0.005em',
      textTransform: 'none',
    },
    h1: {
      fontSize: '1.8rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h3: {
      fontSize: '1.3rem',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.15rem',
      fontWeight: 700,
      lineHeight: 1.35,
    },
    h5: {
      fontSize: '1.05rem',
      fontWeight: 700,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: '0.95rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.9rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '0.95rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.9rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    caption: {
      fontSize: '0.8rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '0.9rem',
    },
  },
  shape: {
    borderRadius: 12, // Bo góc cân đối hiện đại
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '6px 16px',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(25, 118, 210, 0.15)',
            transform: 'translateY(-1px)',
          },
          '&.MuiButton-containedPrimary': {
            background: '#1976D2',
            color: '#ffffff',
            '&:hover': {
              background: '#1565c0',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: 'none',
        },
      },
    },
  },
});
