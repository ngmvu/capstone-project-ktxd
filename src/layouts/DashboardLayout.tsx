import React, { useEffect } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  useTheme,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SchoolIcon from '@mui/icons-material/School';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import type { AutoRefreshInterval } from '../types/powerbi';

interface DashboardLayoutProps {
  children: React.ReactNode;
  lastRefreshed: Date | null;
  autoRefreshInterval: AutoRefreshInterval;
  isRefreshing: boolean;
  onRefresh: () => void;
  onFullscreen: () => void;
  onChangeInterval: (interval: AutoRefreshInterval) => void;
  activeView: 'cover' | 'powerbi' | 'autodesk';
  onViewChange: (view: 'cover' | 'powerbi' | 'autodesk') => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  lastRefreshed,
  autoRefreshInterval,
  isRefreshing,
  onRefresh,
  onFullscreen,
  onChangeInterval,
  activeView,
  onViewChange,
}) => {
  const theme = useTheme();

  // Định dạng giờ hiển thị
  const formatTime = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const views: ('cover' | 'powerbi' | 'autodesk')[] = ['cover', 'powerbi', 'autodesk'];
  const currentIndex = views.indexOf(activeView);

  const handlePrev = () => {
    if (currentIndex > 0) {
      onViewChange(views[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < views.length - 1) {
      onViewChange(views[currentIndex + 1]);
    }
  };

  // Keyboard navigation for slide presentation (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        handlePrev();
      } else if (event.key === 'ArrowRight') {
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeView]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header Navbar (Presentation Slide Style) */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
          backgroundColor: 'rgba(9, 13, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: 'none',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, py: 1 }}>
          {/* Left: University / Logo Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <SchoolIcon sx={{ color: '#6366f1', fontSize: 28 }} />
            <Box>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{
                  fontFamily: 'Outfit',
                  fontWeight: 800,
                  fontSize: { xs: '0.85rem', sm: '1.1rem' },
                  background: 'linear-gradient(90deg, #f8fafc, #cbd5e1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}
              >
                ĐỒ ÁN TỐT NGHIỆP KTS
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: 'Outfit',
                  fontWeight: 600,
                  fontSize: '0.65rem',
                  color: '#6366f1',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                Khoa Kinh tế Xây dựng - ĐHBK Đà Nẵng
              </Typography>
            </Box>
          </Box>

          {/* Center: slide pagination tabs */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              p: 0.5,
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <Button
              onClick={() => onViewChange('cover')}
              startIcon={<InfoIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                fontFamily: 'Outfit',
                fontSize: '0.8rem',
                fontWeight: activeView === 'cover' ? 700 : 500,
                textTransform: 'none',
                backgroundColor: activeView === 'cover' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeView === 'cover' ? '#818cf8' : '#94a3b8',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: activeView === 'cover' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                }
              }}
            >
              1. Giới thiệu
            </Button>
            <Button
              onClick={() => onViewChange('powerbi')}
              startIcon={<DashboardIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                fontFamily: 'Outfit',
                fontSize: '0.8rem',
                fontWeight: activeView === 'powerbi' ? 700 : 500,
                textTransform: 'none',
                backgroundColor: activeView === 'powerbi' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                color: activeView === 'powerbi' ? '#818cf8' : '#94a3b8',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: activeView === 'powerbi' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                }
              }}
            >
              2. Power BI
            </Button>
            <Button
              onClick={() => onViewChange('autodesk')}
              startIcon={<ViewInArIcon sx={{ fontSize: '16px !important' }} />}
              sx={{
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                fontFamily: 'Outfit',
                fontSize: '0.8rem',
                fontWeight: activeView === 'autodesk' ? 700 : 500,
                textTransform: 'none',
                backgroundColor: activeView === 'autodesk' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
                color: activeView === 'autodesk' ? '#06b6d4' : '#94a3b8',
                transition: 'all 0.25s ease',
                '&:hover': {
                  backgroundColor: activeView === 'autodesk' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                }
              }}
            >
              3. Autodesk 3D
            </Button>
          </Box>

          {/* Right: Controls & Student tag */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {activeView === 'powerbi' && (
              <>
                {/* Sync status */}
                <Chip
                  icon={<CloudDoneIcon style={{ color: '#10b981', fontSize: 14 }} />}
                  label={`Đồng bộ: ${formatTime(lastRefreshed)}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    color: '#10b981',
                    borderColor: 'rgba(16, 185, 129, 0.15)',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    display: { xs: 'none', lg: 'flex' },
                    fontFamily: 'Outfit',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                />

                {/* Auto refresh dropdown */}
                <FormControl size="small" sx={{ minWidth: 90, display: { xs: 'none', sm: 'inline-flex' } }}>
                  <InputLabel id="auto-refresh-label" sx={{ color: '#9ca3af', fontSize: '0.7rem', fontFamily: 'Outfit' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <TimerIcon fontSize="inherit" /> Tự động
                    </Box>
                  </InputLabel>
                  <Select
                    labelId="auto-refresh-label"
                    id="auto-refresh-select"
                    value={autoRefreshInterval}
                    label="Tự động"
                    onChange={(e) => onChangeInterval(e.target.value as AutoRefreshInterval)}
                    sx={{
                      color: '#f3f4f6',
                      backgroundColor: 'rgba(255, 255, 255, 0.03)',
                      fontSize: '0.7rem',
                      fontFamily: 'Outfit',
                      borderRadius: 2,
                      height: 32,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.08)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)',
                      },
                    }}
                  >
                    <MenuItem value="off" sx={{ fontFamily: 'Outfit', fontSize: '0.75rem' }}>Tắt</MenuItem>
                    <MenuItem value="1m" sx={{ fontFamily: 'Outfit', fontSize: '0.75rem' }}>1 phút</MenuItem>
                    <MenuItem value="5m" sx={{ fontFamily: 'Outfit', fontSize: '0.75rem' }}>5 phút</MenuItem>
                    <MenuItem value="15m" sx={{ fontFamily: 'Outfit', fontSize: '0.75rem' }}>15 phút</MenuItem>
                  </Select>
                </FormControl>

                {/* Sync button */}
                <Tooltip title="Làm mới dữ liệu Power BI">
                  <IconButton
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    sx={{
                      color: '#818cf8',
                      backgroundColor: 'rgba(99, 102, 241, 0.05)',
                      border: '1px solid rgba(99, 102, 241, 0.15)',
                      borderRadius: 2.5,
                      p: 0.75,
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.12)',
                      }
                    }}
                  >
                    <RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: 18 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}

            {/* Student card info */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontFamily: 'Outfit' }}>
                SVTH: Nguyễn Thị Thu Hương
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500, fontSize: '0.7rem', fontFamily: 'Outfit' }}>
                Lớp: 20KTXD
              </Typography>
            </Box>

            {/* Fullscreen button */}
            <Tooltip title="Chế độ Trình chiếu Slide (F11)">
              <IconButton
                onClick={onFullscreen}
                sx={{
                  color: '#06b6d4',
                  backgroundColor: 'rgba(6, 182, 212, 0.05)',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  borderRadius: 2.5,
                  p: 0.75,
                  '&:hover': {
                    backgroundColor: 'rgba(6, 182, 212, 0.12)',
                  }
                }}
              >
                <FullscreenIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 4 },
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#090d16',
          pb: '96px', // Leave spacing for floating slide dock
        }}
      >
        <Toolbar /> {/* Spacer below header */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', mt: 1 }}>
          {children}
        </Box>
      </Box>

      {/* Floating Presentation Control Dock */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          px: 3,
          py: 1,
          borderRadius: '999px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        }}
      >
        <Tooltip title="Slide trước (ArrowLeft)">
          <span>
            <IconButton
              onClick={handlePrev}
              disabled={currentIndex === 0}
              sx={{
                color: '#94a3b8',
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.15)' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </span>
        </Tooltip>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography
            variant="body2"
            sx={{
              fontFamily: 'Outfit',
              fontWeight: 700,
              color: '#f8fafc',
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
            }}
          >
            SLIDE {currentIndex + 1} / 3
          </Typography>
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'Outfit',
              color: '#6366f1',
              fontWeight: 600,
              fontSize: '0.75rem',
              borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
              pl: 1,
              display: { xs: 'none', sm: 'inline-block' },
            }}
          >
            {activeView === 'cover' ? 'GIỚI THIỆU CHUNG' : activeView === 'powerbi' ? 'BÁO CÁO POWER BI' : 'MÔ HÌNH BIM 3D'}
          </Typography>
        </Box>

        <Tooltip title="Slide tiếp theo (ArrowRight)">
          <span>
            <IconButton
              onClick={handleNext}
              disabled={currentIndex === views.length - 1}
              sx={{
                color: '#94a3b8',
                '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 255, 255, 0.08)' },
                '&.Mui-disabled': { color: 'rgba(255, 255, 255, 0.15)' }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};
export default DashboardLayout;
