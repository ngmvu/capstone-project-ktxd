import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PowerBIReport } from '../components/PowerBIReport';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorView } from '../components/ErrorView';
import { usePowerBI } from '../hooks/usePowerBI';
import { powerBIService } from '../services/powerbi.service';

export const DashboardPage: React.FC = () => {
  const {
    reportState,
    isRefreshing,
    autoRefreshInterval,
    setEmbeddedReport,
    setReportError,
    refreshReport,
    toggleFullscreen,
    setAutoRefreshInterval,
  } = usePowerBI();

  const [envConfigError, setEnvConfigError] = useState<string | null>(null);

  // Lấy cấu hình từ biến môi trường
  const embedConfig = useMemo(() => {
    return powerBIService.getEmbedConfigFromEnv();
  }, []);

  // Xác thực cấu hình môi trường ngay khi mount
  useEffect(() => {
    const validation = powerBIService.validateConfig(embedConfig);
    if (!validation.isValid) {
      setEnvConfigError(validation.error);
      setReportError(validation.error || 'Cấu hình không hợp lệ');
    }
  }, [embedConfig, setReportError]);

  // Nhận diện lỗi hiển thị
  const activeError = envConfigError || reportState.error;

  return (
    <DashboardLayout
      lastRefreshed={reportState.lastRefreshed}
      autoRefreshInterval={autoRefreshInterval}
      isRefreshing={isRefreshing}
      onRefresh={refreshReport}
      onFullscreen={toggleFullscreen}
      onChangeInterval={setAutoRefreshInterval}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Banner thông tin môi trường */}
        <Paper
          sx={{
            p: 2,
            mb: 3,
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(6, 182, 212, 0.08) 100%)',
            borderColor: 'rgba(255, 255, 255, 0.06)',
            borderRadius: 3,
          }}
        >
          <Typography variant="body2" sx={{ color: '#d1d5db' }}>
            🚀 <strong>Chế độ hoạt động:</strong> Microsoft Azure AAD Embed Single-Page Application. 
            Mọi thao tác lọc dữ liệu, phân tích sẽ được đồng bộ trực tiếp lên hệ thống đám mây Azure Power BI Cloud.
          </Typography>
        </Paper>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '600px', position: 'relative' }}>
          {/* 1. Hiển thị lỗi cấu hình hoặc lỗi kết nối */}
          {activeError ? (
            <ErrorView 
              errorMessage={activeError} 
              onRetry={!envConfigError ? refreshReport : undefined} 
            />
          ) : (
            <>
              {/* 2. Hiển thị Spinner tải báo cáo */}
              {reportState.isLoading && (
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}>
                  <LoadingSpinner />
                </Box>
              )}

              {/* 3. Báo cáo chính nhúng Power BI */}
              <Box sx={{ width: '100%', height: '100%', flexGrow: 1, visibility: reportState.isLoading ? 'hidden' : 'visible' }}>
                <PowerBIReport
                  config={embedConfig}
                  onReportLoaded={setEmbeddedReport}
                  onReportError={setReportError}
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </DashboardLayout>
  );
};
export default DashboardPage;
