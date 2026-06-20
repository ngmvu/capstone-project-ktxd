import React from 'react';
import { Box, Typography, Paper, Divider, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { 
  ErrorOutlined, 
  CheckCircleOutlined, 
  Key, 
  Code, 
  Refresh 
} from '@mui/icons-material';

interface ErrorViewProps {
  title?: string;
  errorMessage: string | null;
  onRetry?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({
  title = 'Lỗi kết nối Power BI Dashboard',
  errorMessage,
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '500px',
        width: '100%',
        padding: 3,
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <Paper
        sx={{
          maxWidth: '650px',
          width: '100%',
          padding: 4,
          background: 'rgba(239, 68, 68, 0.05)', // Màu đỏ nhạt sang trọng
          borderColor: 'rgba(239, 68, 68, 0.25)',
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <ErrorOutlined sx={{ color: '#ef4444', fontSize: '2.5rem' }} />
          <Typography variant="h5" sx={{ color: '#f3f4f6', fontFamily: 'Outfit', fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 3 }} />

        <Box
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: 2.5,
            borderRadius: 3,
            borderLeft: '4px solid #ef4444',
            marginBottom: 4,
          }}
        >
          <Typography variant="body1" sx={{ color: '#f9fafb', fontFamily: 'monospace', fontSize: '0.9rem', wordBreak: 'break-word' }}>
            {errorMessage || 'Không tìm thấy cấu hình kết nối hoặc Token của bạn đã hết hạn.'}
          </Typography>
        </Box>

        <Typography variant="subtitle1" sx={{ color: '#f3f4f6', fontWeight: 600, marginBottom: 1 }}>
          💡 Các bước kiểm tra và khắc phục nhanh:
        </Typography>

        <List sx={{ color: '#9ca3af', marginBottom: 4, padding: 0 }}>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: '36px', color: '#6366f1', marginTop: '4px' }}>
              <Key fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>Access Token hết hạn</Typography>}
              secondary={<Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>Access Token của Power BI chỉ có thời hạn sử dụng tối đa là 60 phút. Vui lòng gia hạn và cập nhật lại biến VITE_POWERBI_ACCESS_TOKEN trong file .env.</Typography>}
            />
          </ListItem>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: '36px', color: '#6366f1', marginTop: '4px' }}>
              <Code fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>Sai định dạng ID</Typography>}
              secondary={<Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>Report ID và Group ID phải tuân thủ chuẩn GUID của Microsoft (ví dụ: e374828f-7c15-46aa-ac9b-xxxxxxxxxxxx). Hãy kiểm tra xem ID đã bị thừa ký tự hay khoảng trắng nào không.</Typography>}
            />
          </ListItem>
          <ListItem disableGutters sx={{ alignItems: 'flex-start' }}>
            <ListItemIcon sx={{ minWidth: '36px', color: '#6366f1', marginTop: '4px' }}>
              <CheckCircleOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="body2" sx={{ color: '#e5e7eb', fontWeight: 600 }}>Kiểm tra quyền truy cập trên Power BI Service</Typography>}
              secondary={<Typography variant="body2" sx={{ color: '#9ca3af', mt: 0.5 }}>Đảm bảo tài khoản hoặc Service Principal (ứng dụng Azure AD) của bạn đã được phân quyền làm thành viên (Member/Admin) của Workspace chứa báo cáo này.</Typography>}
            />
          </ListItem>
        </List>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          {onRetry && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Refresh />}
              onClick={onRetry}
            >
              Thử kết nối lại
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
