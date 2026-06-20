import React from 'react';
import { PowerBIEmbed } from 'powerbi-client-react';
import { models, Report } from 'powerbi-client';
import type { PowerBIEmbedConfig } from '../types/powerbi';
import { Box } from '@mui/material';

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
  // Resolve the token type based on environment variable config
  const tokenType = import.meta.env.VITE_POWERBI_TOKEN_TYPE === 'AAD'
    ? models.TokenType.Aad
    : models.TokenType.Embed;

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#0b0f19',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
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
          accessToken: config.accessToken,
          tokenType: tokenType,
          settings: {
            panes: {
              filters: { expanded: false, visible: true },
              pageNavigation: { visible: true },
            },
            background: models.BackgroundType.Default,
          },
        }}
        eventHandlers={new Map([
          ['loaded', () => {
            console.log('Power BI Report loaded event fired!');
          }],
          ['rendered', () => {
            console.log('Power BI Report rendered successfully!');
          }],
          ['error', (event?: any) => {
            console.error('Power BI SDK Error:', event);
            const detailedError =
              event?.detail?.detailedMessage ||
              event?.detail?.message ||
              'Lỗi không xác định khi nhúng báo cáo';
            onReportError(detailedError);
          }],
        ])}
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
