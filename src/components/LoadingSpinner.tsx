import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Đang đồng bộ và tải báo cáo Power BI...' 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '450px',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(11, 15, 25, 0.4)',
        backdropFilter: 'blur(8px)',
        borderRadius: 4,
        padding: 4,
        textAlign: 'center',
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'inline-flex',
          marginBottom: 3,
        }}
      >
        {/* Glow Background Circular ring */}
        <CircularProgress
          variant="determinate"
          value={100}
          size={70}
          thickness={4}
          sx={{
            color: 'rgba(99, 102, 241, 0.15)',
            position: 'absolute',
          }}
        />
        {/* Rotating active circular spinner */}
        <CircularProgress
          variant="indeterminate"
          size={70}
          thickness={4}
          sx={{
            color: '#6366f1',
            animationDuration: '1.2s',
            // Thêm hiệu ứng phát sáng mờ
            filter: 'drop-shadow(0px 0px 8px rgba(99, 102, 241, 0.6))',
          }}
        />
      </Box>

      <Typography
        variant="h6"
        sx={{
          color: '#f3f4f6',
          fontWeight: 500,
          marginBottom: 1,
          fontFamily: 'Outfit',
        }}
      >
        {message}
      </Typography>
      
      <Typography
        variant="body2"
        sx={{
          color: '#9ca3af',
          maxWidth: '320px',
        }}
      >
        Vui lòng đợi trong giây lát khi hệ thống thiết lập kết nối an toàn với máy chủ Microsoft Power BI...
      </Typography>
    </Box>
  );
};
