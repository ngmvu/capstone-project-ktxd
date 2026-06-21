import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute
 *
 * Renders children only when the user is authenticated via MSAL.
 * - While MSAL is initialising → full-page spinner
 * - When no account found → LoginPage
 * - When authenticated → children
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F5F7FA',
          gap: 2,
        }}
      >
        <CircularProgress size={40} sx={{ color: '#1976D2' }} />
        <Typography variant="body2" sx={{ color: '#64748B', fontFamily: 'Arial, sans-serif' }}>
          Đang khởi tạo phiên đăng nhập...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
