import React from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import { useAuth } from '../hooks/useAuth';

// ─── Logo imports ────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – image assets
import dhbkLogo from '../assets/logo/dhbk.jpg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – image assets
import qldaLogo from '../assets/logo/qlda.jpg';

const LoginPage: React.FC = () => {
  const { login, isLoading, authError } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #EBF4FF 0%, #F5F7FA 50%, #E8F0FE 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Card */}
      <Box
        sx={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: '#FFFFFF',
          borderRadius: 4,
          boxShadow: '0 8px 40px rgba(0, 0, 0, 0.08)',
          p: { xs: 3.5, sm: 5 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
        }}
      >
        {/* Logos */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box
            component="img"
            src={dhbkLogo}
            alt="Đại học Bách Khoa Đà Nẵng"
            sx={{ height: 64, objectFit: 'contain' }}
          />
          <Box sx={{ width: 1, height: 60, backgroundColor: 'rgba(0,0,0,0.08)' }} />
          <Box
            component="img"
            src={qldaLogo}
            alt="Khoa Quản Lý Dự Án"
            sx={{ height: 64, objectFit: 'contain' }}
          />
        </Box>

        {/* Title */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontSize: '1rem',
              color: '#1D2939',
              lineHeight: 1.4,
              mb: 0.5,
            }}
          >
            ĐỒ ÁN TỐT NGHIỆP
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#1976D2',
              fontWeight: 600,
              fontSize: '0.78rem',
              display: 'block',
              mb: 1.5,
            }}
          >
            Khoa Quản Lý Dự Án — Trường ĐH Bách Khoa — ĐHĐN
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#475467',
              fontSize: '0.82rem',
              lineHeight: 1.6,
            }}
          >
            Ứng dụng báo cáo đồng bộ Power BI và mô hình 3D Autodesk trong
            quản lý dự án kinh tế xây dựng.
          </Typography>
        </Box>

        {/* Divider */}
        <Box sx={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.06)' }} />

        {/* Sign-in info */}
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography
            variant="body2"
            sx={{ color: '#475467', mb: 2, fontSize: '0.82rem' }}
          >
            Đăng nhập bằng tài khoản Microsoft của trường để tiếp tục.
          </Typography>

          {authError && (
            <Alert severity="error" sx={{ mb: 2, textAlign: 'left', fontSize: '0.8rem' }}>
              {authError}
            </Alert>
          )}

          <Button
            id="btn-microsoft-login"
            variant="contained"
            fullWidth
            onClick={login}
            disabled={isLoading}
            startIcon={
              isLoading
                ? <CircularProgress size={18} color="inherit" />
                : <MicrosoftIcon />
            }
            sx={{
              backgroundColor: '#0078D4',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              letterSpacing: 0,
              '&:hover': {
                backgroundColor: '#006CBF',
              },
            }}
          >
            {isLoading ? 'Đang chuyển hướng...' : 'Đăng nhập bằng Microsoft'}
          </Button>
        </Box>

        {/* Footer note */}
        <Typography
          variant="caption"
          sx={{ color: '#98A2B3', textAlign: 'center', fontSize: '0.7rem', lineHeight: 1.6 }}
        >
          Chỉ tài khoản Microsoft được cấp quyền mới có thể truy cập báo cáo Power BI.
          <br />
          Đăng nhập an toàn qua Microsoft Entra ID.
        </Typography>
      </Box>

      {/* Page footer */}
      <Typography
        variant="caption"
        sx={{ mt: 3, color: '#98A2B3', textAlign: 'center', fontSize: '0.7rem' }}
      >
        © 2026 ĐỒ ÁN TỐT NGHIỆP KTXD — Sinh viên: Nguyễn Thị Thu Hương
      </Typography>
    </Box>
  );
};

export default LoginPage;
