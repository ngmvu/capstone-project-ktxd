import React from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import logoDhbk from '../assets/logo/dhbk.jpg';
import logoQlda from '../assets/logo/qlda.jpg';

interface CoverSlideProps {
  onStart: () => void;
}

export const CoverSlide: React.FC<CoverSlideProps> = ({ onStart }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        py: 2,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Main Cover Card */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '960px',
          zIndex: 1,
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          backgroundColor: '#FFFFFF',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
          position: 'relative',
        }}
      >
        {/* University Header */}
        <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Side-by-side logos (Trường bên trái, Khoa bên phải) */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: { xs: 3, sm: 4 }, mb: 2.5 }}>
            <Box
              component="img"
              src={logoDhbk}
              alt="Logo Trường Đại học Bách khoa"
              sx={{
                height: { xs: 55, sm: 70 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
            <Box
              component="img"
              src={logoQlda}
              alt="Logo Khoa Quản lý dự án"
              sx={{
                height: { xs: 55, sm: 70 },
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Box>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#475467',
              mb: 0.5,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Đại học Đà Nẵng
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              fontSize: '16px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#1D2939',
              mb: 0.5,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Trường Đại học Bách khoa
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              fontSize: '14px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#1976D2',
              mb: 1.5,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Khoa Quản Lý Dự Án
          </Typography>
          <Box
            sx={{
              width: '60px',
              height: '3px',
              backgroundColor: '#1976D2',
              borderRadius: '99px',
            }}
          />
        </Box>

        {/* Thesis Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 2.5,
            py: 0.75,
            borderRadius: '999px',
            backgroundColor: 'rgba(25, 118, 210, 0.06)',
            border: '1px solid rgba(25, 118, 210, 0.15)',
            mb: 3,
          }}
        >
          <SchoolIcon sx={{ color: '#1976D2', fontSize: 18 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 700,
              color: '#1976D2',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontSize: '12px',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Đồ Án Tốt Nghiệp Kỹ Sư
          </Typography>
        </Box>

        {/* Main Title */}
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Arial, sans-serif',
            fontSize: '22px',
            fontWeight: 700,
            lineHeight: 1.6,
            color: '#1D2939',
            textAlign: 'center',
            maxWidth: '850px',
            mx: 'auto',
            mb: 3,
            textTransform: 'uppercase',
          }}
        >
          LẬP DỰ ÁN TRIỂN KHAI THI CÔNG CÔNG TRÌNH TRƯỜNG TIỂU HỌC, TRUNG HỌC CƠ SỞ VÀ TRUNG HỌC PHỔ THÔNG HY VỌNG
        </Typography>

        <Divider sx={{ my: 3, borderColor: 'rgba(0,0,0,0.06)' }} />

        {/* Metadata section (2 columns) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
            textAlign: 'left',
            maxWidth: '680px',
            mx: 'auto',
            mb: 4,
            p: 2.5,
            backgroundColor: '#F8F9FA',
            borderRadius: 2,
            border: '1px solid rgba(0, 0, 0, 0.06)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#475467', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                Sinh viên thực hiện
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1D2939' }}>
                Nguyễn Thị Thu Hương
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#475467', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                Mã sinh viên / Lớp
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#344054' }}>
                118210083 / Lớp 21KX
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#475467', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                Giảng viên hướng dẫn
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1D2939' }}>
                TS. Trương Ngọc Sơn
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 700, color: '#1D2939' }}>
                TS. Trương Quỳnh Châu
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#475467', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.02em' }}>
                Năm học / Địa điểm
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                <CalendarTodayIcon sx={{ fontSize: 13, color: '#475467' }} />
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#475467' }}>
                  2026 — TP. Đà Nẵng
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};
