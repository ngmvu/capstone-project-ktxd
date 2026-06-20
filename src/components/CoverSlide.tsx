import React from 'react';
import { Box, Typography, Button, Paper, Divider } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

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
        minHeight: 'calc(100vh - 180px)',
        py: 4,
        px: 2,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glowing effects */}
      <Box
        sx={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Main Cover Card */}
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: '960px',
          zIndex: 1,
          p: { xs: 3, sm: 6 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(9, 13, 22, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px)',
          textAlign: 'center',
          boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
        }}
      >
        {/* University Header */}
        <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 800,
              letterSpacing: '0.15em',
              color: '#94a3b8',
              textTransform: 'uppercase',
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
            }}
          >
            Đại học Đà Nẵng
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 800,
              letterSpacing: '0.05em',
              color: '#f8fafc',
              textTransform: 'uppercase',
              fontSize: { xs: '0.95rem', sm: '1.25rem' },
              mt: 0.5,
              background: 'linear-gradient(90deg, #e2e8f0, #ffffff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Trường Đại học Bách khoa
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 700,
              letterSpacing: '0.08em',
              color: '#38bdf8',
              textTransform: 'uppercase',
              fontSize: { xs: '0.85rem', sm: '1.05rem' },
              mt: 0.5,
            }}
          >
            Khoa Kinh tế Xây dựng
          </Typography>
          <Box
            sx={{
              width: '80px',
              height: '3px',
              backgroundColor: '#6366f1',
              borderRadius: '99px',
              mt: 2.5,
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            }}
          />
        </Box>

        {/* Thesis Badge */}
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            px: 3,
            py: 1,
            borderRadius: '999px',
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            mb: 4,
          }}
        >
          <SchoolIcon sx={{ color: '#818cf8', fontSize: 20 }} />
          <Typography
            variant="subtitle2"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: '#818cf8',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '0.8rem',
            }}
          >
            Đồ Án Tốt Nghiệp Kỹ Sư
          </Typography>
        </Box>

        {/* Main Title */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: 'Outfit',
            fontWeight: 800,
            lineHeight: 1.25,
            mb: 3,
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '2.8rem' },
            background: 'linear-gradient(135deg, #ffffff 10%, #c7d2fe 50%, #818cf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            maxWidth: '820px',
            mx: 'auto',
          }}
        >
          ỨNG DỤNG BÁO CÁO ĐỒNG BỘ POWER BI VÀ MÔ HÌNH 3D AUTODESK TRONG QUẢN LÝ DỰ ÁN KINH TẾ XÂY DỰNG
        </Typography>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.06)' }} />

        {/* Metadata section (2 columns) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 3,
            textAlign: 'left',
            maxWidth: '680px',
            mx: 'auto',
            mb: 5,
            p: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 3,
            border: '1px solid rgba(255, 255, 255, 0.04)',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600, tracking: '0.05em' }}>
                Sinh viên thực hiện
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f1f5f9' }}>
                Nguyễn Thị Thu Hương
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600, tracking: '0.05em' }}>
                Mã sinh viên / Lớp
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#e2e8f0' }}>
                118210083 / Lớp 20KTXD
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600, tracking: '0.05em' }}>
                Giảng viên hướng dẫn
              </Typography>
              <Typography variant="body1" sx={{ fontFamily: 'Outfit', fontWeight: 700, color: '#f1f5f9' }}>
                PGS. TS. Nguyễn Thế Quân
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', fontWeight: 600, tracking: '0.05em' }}>
                Năm học / Địa điểm
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                <CalendarTodayIcon sx={{ fontSize: 14, color: '#64748b' }} />
                <Typography variant="body2" sx={{ fontFamily: 'Outfit', fontWeight: 600, color: '#94a3b8' }}>
                  2026 — TP. Đà Nẵng
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Start Button */}
        <Button
          variant="contained"
          size="large"
          onClick={onStart}
          endIcon={<PlayArrowIcon />}
          sx={{
            px: 5,
            py: 2,
            fontSize: '1.05rem',
            fontFamily: 'Outfit',
            borderRadius: '999px',
            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
            boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
            '&:hover': {
              background: 'linear-gradient(90deg, #818cf8, #22d3ee)',
              boxShadow: '0 12px 35px rgba(99, 102, 241, 0.5)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          Bắt đầu thuyết trình
        </Button>
      </Paper>
    </Box>
  );
};
