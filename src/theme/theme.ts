import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo hiện đại và rực rỡ
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#06b6d4', // Cyan cho các chi tiết phụ và chỉ số trạng thái
      light: '#22d3ee',
      dark: '#0891b2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0b0f19', // Nền tối sâu sang trọng thay vì đen tuyền nhàm chán
      paper: 'rgba(17, 24, 39, 0.7)', // Nền dạng mờ đục để dùng cho Glassmorphism
    },
    text: {
      primary: '#f3f4f6',
      secondary: '#9ca3af',
      disabled: '#6b7280',
    },
    divider: 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    button: {
      textTransform: 'none', // Giữ nguyên chữ hoa chữ thường như thiết kế hiện đại
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 16, // Bo góc lớn mềm mại cao cấp
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '8px 18px',
          fontWeight: 600,
          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            transform: 'translateY(-1px)',
          },
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backdropFilter: 'blur(16px)', // Kích hoạt hiệu ứng làm mờ kính Glassmorphism
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(11, 15, 25, 0.75)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        },
      },
    },
  },
});
