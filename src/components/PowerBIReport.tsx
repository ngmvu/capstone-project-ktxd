import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';
import type { PowerBIEmbedConfig } from '../types/powerbi';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../hooks/useAuth';

interface PowerBIReportProps {
  config: PowerBIEmbedConfig;
  onReportLoaded: (report: Report) => void;
  onReportError: (errorMessage: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const PowerBIReport: React.FC<PowerBIReportProps> = ({
  config,
  onReportLoaded,
  onReportError,
  className,
  style,
}) => {
  const { user, login, powerBIAccessToken, needsPowerBIConsent, grantPowerBIConsent, refreshPowerBIToken } = useAuth();

  // If not logged in, show login prompt right here instead of a full-screen block
  if (!user) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          backgroundColor: '#F8F9FA',
          borderRadius: 3,
          border: '1px dashed rgba(0, 0, 0, 0.12)',
          p: 4,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" sx={{ color: '#1D2939', fontWeight: 700, maxWidth: 600 }}>
          Ứng dụng báo cáo đồng bộ Power BI và mô hình 3D Autodesk trong quản lý dự án kinh tế xây dựng.
        </Typography>
        <Typography variant="body1" sx={{ color: '#475467', mt: 1 }}>
          Đăng nhập bằng tài khoản Microsoft của trường để tiếp tục.
        </Typography>
        
        <Button
          variant="contained"
          onClick={login}
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: '#0078D4',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '1rem',
            py: 1.2,
            px: 4,
            borderRadius: 2,
            '&:hover': { backgroundColor: '#006CBF' },
          }}
        >
          Đăng nhập an toàn qua Microsoft Entra ID
        </Button>
        
        <Typography variant="caption" sx={{ color: '#98A2B3' }}>
          Chỉ tài khoản Microsoft được cấp quyền mới có thể truy cập báo cáo Power BI.
        </Typography>
      </Box>
    );
  }

  // Need consent — show button (must be user click so browser allows popup)
  if (!powerBIAccessToken && needsPowerBIConsent) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2.5,
          backgroundColor: '#F8F9FA',
          borderRadius: 3,
          border: '1px dashed rgba(25, 118, 210, 0.3)',
        }}
      >
        <SecurityIcon sx={{ fontSize: 48, color: '#1976D2' }} />
        <Typography variant="body1" sx={{ color: '#1D2939', fontWeight: 600, textAlign: 'center' }}>
          Cần cấp quyền truy cập Power BI
        </Typography>
        <Typography variant="body2" sx={{ color: '#475467', textAlign: 'center', maxWidth: 400 }}>
          Ứng dụng cần quyền truy cập dữ liệu Power BI. Bấm nút bên dưới để cấp quyền qua tài khoản Microsoft.
        </Typography>
        <Button
          variant="contained"
          onClick={grantPowerBIConsent}
          startIcon={<SecurityIcon />}
          sx={{
            textTransform: 'none',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 700,
            fontSize: '0.9rem',
            py: 1.2,
            px: 3,
            borderRadius: 2,
            backgroundColor: '#1976D2',
            '&:hover': { backgroundColor: '#1565C0' },
          }}
        >
          Cấp quyền Power BI
        </Button>
      </Box>
    );
  }

  // Token not yet available — loading
  if (!powerBIAccessToken) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '600px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          backgroundColor: '#F8F9FA',
          borderRadius: 3,
          border: '1px dashed rgba(0,0,0,0.12)',
        }}
      >
        <CircularProgress size={32} sx={{ color: '#1976D2' }} />
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Đang lấy token Power BI...
        </Typography>
      </Box>
    );
  }

  // ── Render embedded report with AAD token ───────────────────────────────
  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
        '& iframe': {
          border: 'none !important',
          width: '100% !important',
          height: '100% !important',
          minHeight: '600px !important',
        },
        '& .powerbi-container': {
          width: '100%',
          height: '100%',
        },
        ...style,
      }}
    >
      <PowerBIEmbed
        embedConfig={{
          type: 'report',
          id: config.reportId,
          embedUrl: config.embedUrl,
          // Inject the MSAL-acquired AAD token — no hardcoded value
          accessToken: powerBIAccessToken,
          tokenType: models.TokenType.Aad,
          settings: {
            panes: {
              filters: { expanded: false, visible: true },
              pageNavigation: { visible: true },
            },
            background: models.BackgroundType.Default,
          },
        }}
        eventHandlers={
          new Map([
            [
              'loaded',
              () => {
                console.log('[PowerBI] Report loaded.');
              },
            ],
            [
              'rendered',
              () => {
                console.log('[PowerBI] Report rendered.');
              },
            ],
            [
              'error',
              async (event?: any) => {
                const code: string = event?.detail?.errorCode ?? '';
                // TokenExpired → silently refresh and let the SDK retry
                if (code === 'TokenExpired' || code === '403') {
                  console.warn('[PowerBI] Token expired — refreshing silently...');
                  await refreshPowerBIToken();
                  return;
                }
                const msg =
                  event?.detail?.detailedMessage ||
                  event?.detail?.message ||
                  'Lỗi không xác định khi nhúng báo cáo';
                console.error('[PowerBI] SDK Error:', event);
                onReportError(msg);
              },
            ],
          ])
        }
        cssClassName="powerbi-container"
        getEmbeddedComponent={(embeddedReport) => {
          onReportLoaded(embeddedReport as Report);
        }}
      />
    </Box>
  );
};

export default PowerBIReport;
