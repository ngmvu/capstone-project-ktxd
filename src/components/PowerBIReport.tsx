import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';
import type { PowerBIEmbedConfig } from '../types/powerbi';
import { Box } from '@mui/material';

interface PowerBIReportProps {
  config: PowerBIEmbedConfig;
  onReportLoaded: (report: Report) => void;
  onReportError: (errorMessage: string) => void;
}

export const PowerBIReport: React.FC<PowerBIReportProps> = ({
  config,
  onReportLoaded,
  onReportError,
}) => {
  // Xác định TokenType dựa vào độ dài hoặc biến môi trường. 
  // Mặc định khi lấy trực tiếp từ Power BI Service bằng AAD User sẽ là Aad (0).
  // Khi lấy bằng Service Principal (App Owns Data) thông qua Backend sẽ là Embed (1).
  const envTokenType = import.meta.env.VITE_POWERBI_TOKEN_TYPE?.toUpperCase();
  const tokenType = envTokenType === 'EMBED' 
    ? models.TokenType.Embed 
    : models.TokenType.Aad;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#0b0f19',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        // Ghi đè CSS của powerbi iframe để nó hiển thị 100% diện tích
        '& iframe': {
          border: 'none !important',
          width: '100% !important',
          height: '100% !important',
          minHeight: '600px !important',
        },
        '& .powerbi-container': {
          width: '100%',
          height: '100%',
        }
      }}
    >
      <PowerBIEmbed
        embedConfig={{
          type: 'report', // Loại nhúng: report, dashboard, tile, vv.
          id: config.reportId,
          embedUrl: config.embedUrl,
          accessToken: config.accessToken,
          tokenType: tokenType,
          settings: {
            panes: {
              filters: {
                expanded: false,
                visible: true, // Hiển thị khung filter để người dùng tuỳ chọn
              },
              pageNavigation: {
                visible: true, // Hiển thị thanh chuyển trang ở dưới
              },
            },
            background: models.BackgroundType.Default,
          },
        }}
        eventHandlers={
          new Map([
            [
              'loaded',
              (event?: any) => {
                console.log('Power BI Report loaded event fired!');
                if (event && event.detail) {
                  // Lấy đối tượng report đã nhúng từ event hoặc hàm helper
                  // powerbi-client-react sẽ gửi instance qua getEmbeddedComponent
                }
              },
            ],
            [
              'rendered',
              () => {
                console.log('Power BI Report rendered successfully!');
              },
            ],
            [
              'error',
              (event?: any) => {
                console.error('Power BI SDK Error:', event);
                const detailedError = event?.detail?.detailedMessage || event?.detail?.message || 'Lỗi không xác định khi nhúng báo cáo';
                onReportError(detailedError);
              },
            ],
          ])
        }
        cssClassName="powerbi-container"
        getEmbeddedComponent={(embeddedReport) => {
          console.log('Lấy thành công đối tượng Embedded Component (Report Instance).');
          onReportLoaded(embeddedReport as Report);
        }}
      />
    </Box>
  );
};
export default PowerBIReport;
