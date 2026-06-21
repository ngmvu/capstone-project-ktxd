import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
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
  Avatar,
  Menu,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import SchoolIcon from '@mui/icons-material/School';
import InfoIcon from '@mui/icons-material/Info';
import TimerIcon from '@mui/icons-material/Timer';
import LogoutIcon from '@mui/icons-material/Logout';
import type { AutoRefreshInterval } from '../types/powerbi';
import { useAuth } from '../hooks/useAuth';

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
  const { user, login, logout } = useAuth();
  
  // State for the unified profile menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
              {/* Power BI Sync Controls */}
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
                      '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
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
                    '&:hover': { backgroundColor: 'rgba(100, 116, 139, 0.08)' },
                  }}
                >
                  <FullscreenIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>

              {/* Separator between tools and authentications */}
              <Divider orientation="vertical" variant="middle" flexItem sx={{ mx: 0.5, borderColor: 'rgba(0, 0, 0, 0.08)' }} />

              {/* Authenticaton Group: Autodesk & Microsoft */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {/* Unified Profile Menu */}
                <Box>
                  <Tooltip title="Tài khoản & Kết nối">
                    <IconButton
                      onClick={handleProfileClick}
                      size="small"
                      sx={{
                        ml: 1,
                        p: 0.5,
                        border: '1px solid',
                        borderColor: openMenu ? '#1976D2' : 'transparent',
                        transition: 'all 0.2s',
                      }}
                      aria-controls={openMenu ? 'profile-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={openMenu ? 'true' : undefined}
                    >
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: user ? '#1976D2' : '#9ca3af',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                        }}
                      >
                        {user ? user.name.charAt(0).toUpperCase() : <SchoolIcon fontSize="small" />}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    id="profile-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    onClick={handleMenuClose} // Close menu when an item is clicked
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        mt: 1.5,
                        minWidth: 260,
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.06)',
                        overflow: 'visible',
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                          borderTop: '1px solid rgba(0,0,0,0.06)',
                          borderLeft: '1px solid rgba(0,0,0,0.06)',
                        },
                      }
                    }}
                  >
                    {/* Microsoft Section */}
                    <Box sx={{ px: 2.5, py: 2 }}>
                      <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 700, mb: 1, display: 'block', lineHeight: 1 }}>
                        TÀI KHOẢN MICROSOFT
                      </Typography>
                      {user ? (
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: '#1D2939' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2 }}>
                            {user.email}
                          </Typography>
                          <Button
                            onClick={logout}
                            variant="outlined"
                            color="error"
                            fullWidth
                            size="small"
                            startIcon={<LogoutIcon />}
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Đăng xuất
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5 }}>
                            Chưa đăng nhập. Cần thiết để xem báo cáo Power BI.
                          </Typography>
                          <Button
                            onClick={login}
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{ bgcolor: '#0078D4', '&:hover': { bgcolor: '#006CBF' }, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Đăng nhập Microsoft
                          </Button>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ mx: 2, borderColor: 'rgba(0,0,0,0.06)' }} />

                    {/* Autodesk Section */}
                    <Box sx={{ px: 2.5, py: 2 }}>
                      <Typography variant="overline" sx={{ color: '#64748B', fontWeight: 700, mb: 1, display: 'block', lineHeight: 1 }}>
                        KẾT NỐI AUTODESK
                      </Typography>
                      {autodeskConnected ? (
                        <Box>
                          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 700, mb: 1.5 }}>
                            Đã kết nối (ACC Connected)
                          </Typography>
                          <Button
                            onClick={onDisconnectAutodesk}
                            variant="outlined"
                            color="error"
                            fullWidth
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Ngắt kết nối ACC
                          </Button>
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="body2" sx={{ color: '#ED6C02', fontWeight: 700, mb: 1.5 }}>
                            Chưa kết nối (ACC Disconnected)
                          </Typography>
                          <Button
                            onClick={onConnectAutodesk}
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="small"
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                          >
                            Đăng nhập ACC
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Menu>
                </Box>
              </Box>
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
