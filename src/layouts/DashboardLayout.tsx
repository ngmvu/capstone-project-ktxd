import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  useTheme,
  Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import TimerIcon from '@mui/icons-material/Timer';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import type { AutoRefreshInterval } from '../types/powerbi';

const drawerWidth = 240;

interface DashboardLayoutProps {
  children: React.ReactNode;
  lastRefreshed: Date | null;
  autoRefreshInterval: AutoRefreshInterval;
  isRefreshing: boolean;
  onRefresh: () => void;
  onFullscreen: () => void;
  onChangeInterval: (interval: AutoRefreshInterval) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  lastRefreshed,
  autoRefreshInterval,
  isRefreshing,
  onRefresh,
  onFullscreen,
  onChangeInterval,
}) => {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Định dạng giờ hiển thị
  const formatTime = (date: Date | null) => {
    if (!date) return 'Chưa cập nhật';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const sidebarContent = (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', justifyItems: 'space-between' }}>
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
          <DashboardIcon sx={{ color: theme.palette.primary.main, fontSize: 32 }} />
          <Typography variant="h6" sx={{ fontFamily: 'Outfit', fontWeight: 700, background: 'linear-gradient(45deg, #6366f1 30%, #06b6d4 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            PBI Analytics
          </Typography>
        </Box>
        
        {/* Menu Items (Tương lai có thể thêm nhiều trang) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 3,
            backgroundColor: 'rgba(99, 102, 241, 0.12)',
            color: '#6366f1',
            borderLeft: '4px solid #6366f1',
            fontWeight: 600,
            cursor: 'pointer',
            mb: 2,
          }}
        >
          <DashboardIcon fontSize="small" />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>Dashboard Báo Cáo</Typography>
        </Box>
      </Box>

      {/* Thông tin trạng thái ở Sidebar Bottom */}
      <Box sx={{ mt: 'auto', p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 3, border: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mb: 1 }}>
          DỰ ÁN CAPSTONE
        </Typography>
        <Typography variant="body2" sx={{ color: '#f3f4f6', fontWeight: 500 }}>
          Power BI Integration
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          Version 1.0.0 (Production)
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      {/* Header Navbar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: '100%',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', gap: 2, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <CloudDoneIcon sx={{ color: '#06b6d4', display: { xs: 'none', sm: 'block' } }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontFamily: 'Outfit',
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.25rem' }
              }}
            >
              Hệ thống Báo cáo Power BI tự động
            </Typography>
          </Box>

          {/* Công cụ điều khiển tích hợp trên Navbar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            
            {/* Trạng thái Đồng bộ */}
            <Chip
              icon={<CloudDoneIcon style={{ color: '#10b981' }} />}
              label={`Đồng bộ: ${formatTime(lastRefreshed)}`}
              variant="outlined"
              size="medium"
              sx={{
                color: '#10b981',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                backgroundColor: 'rgba(16, 185, 129, 0.05)',
                display: { xs: 'none', md: 'flex' }
              }}
            />

            {/* Điều khiển Auto Refresh */}
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="auto-refresh-label" sx={{ color: '#9ca3af', fontSize: '0.85rem' }}>
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
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  fontSize: '0.85rem',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.25)',
                  },
                }}
              >
                <MenuItem value="off">Tắt tự động</MenuItem>
                <MenuItem value="1m">Mỗi 1 phút</MenuItem>
                <MenuItem value="5m">Mỗi 5 phút</MenuItem>
                <MenuItem value="15m">Mỗi 15 phút</MenuItem>
              </Select>
            </FormControl>

            {/* Nút Refresh thủ công */}
            <Tooltip title="Làm mới dữ liệu Power BI">
              <span>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  startIcon={<RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />}
                  sx={{
                    borderColor: 'rgba(99, 102, 241, 0.4)',
                    color: '#818cf8',
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': {
                      borderColor: '#6366f1',
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                    }
                  }}
                >
                  {isRefreshing ? 'Đang nạp...' : 'Đồng bộ'}
                </Button>
                <IconButton
                  color="primary"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  sx={{ display: { xs: 'flex', sm: 'none' }, border: '1px solid rgba(99, 102, 241, 0.3)' }}
                >
                  <RefreshIcon sx={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Nút Toàn màn hình */}
            <Tooltip title="Xem toàn màn hình">
              <IconButton
                onClick={onFullscreen}
                sx={{
                  color: '#06b6d4',
                  backgroundColor: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                  }
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawers - Mobile vs Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Tối ưu hiệu năng trên di động
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#0b0f19',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
        
        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#090d16',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            },
          }}
          open
        >
          <Toolbar /> {/* Tạo khoảng cách bên dưới AppBar */}
          {sidebarContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar /> {/* Tạo khoảng cách bên dưới AppBar */}
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};
