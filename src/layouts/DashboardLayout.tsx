import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SchoolIcon from '@mui/icons-material/School';
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
  activeSection: string;
  onSectionClick: (sectionId: string) => void;
  autodeskConnected: boolean;
  onConnectAutodesk: () => void;
  onDisconnectAutodesk: () => void;
}

const SIDEBAR_WIDTH = 250;

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  lastRefreshed,
  autoRefreshInterval,
  isRefreshing,
  onRefresh,
  onFullscreen,
  onChangeInterval,
  activeSection,
  onSectionClick,
  autodeskConnected,
  onConnectAutodesk,
  onDisconnectAutodesk,
}) => {
  // Định dạng giờ hiển thị
  const formatTime = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'intro':
        return 'GIỚI THIỆU CHUNG';
      case 'powerbi':
        return 'BÁO CÁO TÀI CHÍNH';
      case 'autodesk':
        return 'MÔ HÌNH 3D';
      default:
        return 'TỔNG QUAN';
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F7FA' }}>
      {/* ── Left Sidebar (250px) ── */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1200,
        }}
      >
        {/* Sidebar Logo Header */}
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <SchoolIcon sx={{ color: '#1976D2', fontSize: 24 }} />
          <Box>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                fontSize: '0.9rem',
                color: '#1D2939',
                lineHeight: 1.2,
              }}
            >
              ĐỒ ÁN TỐT NGHIỆP
            </Typography>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                color: '#1976D2',
                display: 'block',
              }}
            >
              Khoa Quản Lý Dự Án - BKĐN
            </Typography>
          </Box>
        </Box>

        {/* Sidebar Navigation Links */}
        <Box sx={{ flexGrow: 1, py: 2, px: 1.5 }}>
          <List disablePadding>
            {/* Link 1: Introduction */}
            <ListItemButton
              onClick={() => onSectionClick('intro')}
              selected={activeSection === 'intro'}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1,
                px: 2,
                color: activeSection === 'intro' ? '#1976D2' : '#475467',
                backgroundColor: activeSection === 'intro' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&.Mui-selected': {
                  color: '#1976D2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <InfoIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: activeSection === 'intro' ? 700 : 500 }}>
                    1. Giới thiệu chung
                  </Typography>
                }
              />
            </ListItemButton>

            {/* Link 2: Power BI Report */}
            <ListItemButton
              onClick={() => onSectionClick('powerbi')}
              selected={activeSection === 'powerbi'}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1,
                px: 2,
                color: activeSection === 'powerbi' ? '#1976D2' : '#475467',
                backgroundColor: activeSection === 'powerbi' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&.Mui-selected': {
                  color: '#1976D2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <DashboardIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: activeSection === 'powerbi' ? 700 : 500 }}>
                    2. Báo cáo tài chính
                  </Typography>
                }
              />
            </ListItemButton>

            {/* Link 3: Autodesk 3D Model */}
            <ListItemButton
              onClick={() => onSectionClick('autodesk')}
              selected={activeSection === 'autodesk'}
              sx={{
                borderRadius: 2,
                mb: 1,
                py: 1,
                px: 2,
                color: activeSection === 'autodesk' ? '#1976D2' : '#475467',
                backgroundColor: activeSection === 'autodesk' ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                '&.Mui-selected': {
                  color: '#1976D2',
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>
                <ViewInArIcon sx={{ fontSize: 18 }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" sx={{ fontWeight: activeSection === 'autodesk' ? 700 : 500 }}>
                    3. Mô hình BIM 3D
                  </Typography>
                }
              />
            </ListItemButton>
          </List>
        </Box>

        {/* Sidebar Student Metadata */}
        <Box sx={{ p: 2, backgroundColor: '#F8F9FA', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600, display: 'block' }}>
            SVTH: Nguyễn Thị Thu Hương
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.7rem', display: 'block', mt: 0.25 }}>
            Lớp: 21KT
          </Typography>
          <Divider sx={{ my: 1, borderColor: 'rgba(0, 0, 0, 0.06)' }} />
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
            GVHD: TS. Trương Ngọc Sơn
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block', fontSize: '0.7rem' }}>
            GVHD: TS. Trương Quỳnh Châu
          </Typography>
        </Box>
      </Box>

      {/* ── Right Container (Header + Content) ── */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: `${SIDEBAR_WIDTH}px`,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Top Header Navbar */}
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${SIDEBAR_WIDTH}px)`,
            marginLeft: `${SIDEBAR_WIDTH}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: 'none',
            zIndex: 1100,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', gap: 2, py: 1 }}>
            {/* Left: Active Section Display */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: '#1976D2',
                  letterSpacing: '0.02em',
                }}
              >
                {getSectionTitle(activeSection)}
              </Typography>
            </Box>

            {/* Right: Controls Command Center */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {/* Autodesk Connection Status in Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, borderRight: '1px solid rgba(0, 0, 0, 0.08)', pr: 1.5 }}>
                <Typography variant="caption" sx={{ color: autodeskConnected ? '#2E7D32' : '#ED6C02', fontWeight: 700, fontSize: '0.75rem', display: { xs: 'none', sm: 'inline-block' } }}>
                  {autodeskConnected ? 'ACC Connected' : 'ACC Disconnected'}
                </Typography>
                {autodeskConnected ? (
                  <Button
                    onClick={onDisconnectAutodesk}
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ py: 0.25, px: 1, fontSize: '0.7rem', height: 26, borderRadius: 1.5 }}
                  >
                    Ngắt kết nối
                  </Button>
                ) : (
                  <Button
                    onClick={onConnectAutodesk}
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ py: 0.25, px: 1, fontSize: '0.7rem', height: 26, borderRadius: 1.5 }}
                  >
                    Kết nối
                  </Button>
                )}
              </Box>

              {/* Power BI Sync Status and Controls */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>

                {/* Auto refresh dropdown */}
                <FormControl size="small" sx={{ minWidth: 95 }}>
                  <InputLabel id="auto-refresh-label" sx={{ color: '#475467', fontSize: '0.7rem', mt: -0.2 }}>
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
                      color: '#1D2939',
                      fontSize: '0.7rem',
                      borderRadius: 1.5,
                      height: 26,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(0, 0, 0, 0.12)',
                      },
                    }}
                  >
                    <MenuItem value="off" sx={{ fontSize: '0.75rem' }}>Tắt</MenuItem>
                    <MenuItem value="1m" sx={{ fontSize: '0.75rem' }}>1 phút</MenuItem>
                    <MenuItem value="5m" sx={{ fontSize: '0.75rem' }}>5 phút</MenuItem>
                    <MenuItem value="15m" sx={{ fontSize: '0.75rem' }}>15 phút</MenuItem>
                  </Select>
                </FormControl>

                {/* Sync refresh button */}
                <Tooltip title="Làm mới dữ liệu Power BI">
                  <IconButton
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    sx={{
                      color: '#1976D2',
                      backgroundColor: 'rgba(25, 118, 210, 0.04)',
                      border: '1px solid rgba(25, 118, 210, 0.12)',
                      borderRadius: 1.5,
                      p: 0.5,
                      width: 26,
                      height: 26,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      }
                    }}
                  >
                    <RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none', fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Fullscreen Toggle */}
              <Tooltip title="Chế độ toàn màn hình">
                <IconButton
                  onClick={onFullscreen}
                  sx={{
                    color: '#64748B',
                    backgroundColor: 'rgba(100, 116, 139, 0.04)',
                    border: '1px solid rgba(100, 116, 139, 0.12)',
                    borderRadius: 1.5,
                    p: 0.5,
                    width: 26,
                    height: 26,
                    '&:hover': {
                      backgroundColor: 'rgba(100, 116, 139, 0.08)',
                    }
                  }}
                >
                  <FullscreenIcon sx={{ fontSize: 14 }} />
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
            p: { xs: 2, sm: 3 },
            width: '100%',
            mt: '64px', // Space for fixed header
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {children}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)',
            backgroundColor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#475467', fontWeight: 500, fontSize: '0.75rem' }}>
            © 2026 ĐỒ ÁN TỐT NGHIỆP KTXD — KHOA QUẢN LÝ DỰ ÁN — TRƯỜNG ĐẠI HỌC BÁCH KHOA - ĐHĐN
          </Typography>
          <Typography variant="caption" sx={{ color: '#98A2B3', display: 'block', mt: 0.5, fontSize: '0.7rem' }}>
            Sinh viên thực hiện: Nguyễn Thị Thu Hương (Lớp 20KTXD) | Giảng viên hướng dẫn: PGS. TS. Nguyễn Thế Quân
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
