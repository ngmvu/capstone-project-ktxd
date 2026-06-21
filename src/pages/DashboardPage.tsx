import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { PowerBIReport } from '../components/PowerBIReport';
import { AutodeskViewer } from '../components/AutodeskViewer';
import { HubsBrowser } from '../components/HubsBrowser';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorView } from '../components/ErrorView';
import { ResizablePanel } from '../components/ResizablePanel';
import { CoverSlide } from '../components/CoverSlide';
import { usePowerBI } from '../hooks/usePowerBI';
import { powerBIService } from '../services/powerbi.service';
import { getStoredToken, getAuthUrl, clearAuth } from '../services/AuthService';
import { useAuth } from '../hooks/useAuth';

export const DashboardPage: React.FC = () => {
  const {
    reportState,
    isRefreshing,
    autoRefreshInterval,
    setEmbeddedReport,
    setReportError,
    refreshReport,
    setAutoRefreshInterval,
  } = usePowerBI();

  const { powerBIAccessToken } = useAuth();

  const [envConfigError, setEnvConfigError] = useState<string | null>(null);
  const [autodeskConnected, setAutodeskConnected] = useState<boolean>(false);
  const [selectedUrn, setSelectedUrn] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('intro');
  const [browserCollapsed, setBrowserCollapsed] = useState(false);
  const [autodeskLoadStatus, setAutodeskLoadStatus] = useState<string>('');

  // Check initial Autodesk authentication status
  useEffect(() => {
    setAutodeskConnected(!!getStoredToken());
  }, []);

  // Get Power BI configurations from environment variables
  const embedConfig = useMemo(() => {
    return powerBIService.getEmbedConfigFromEnv();
  }, []);

  // Validate environmental configs on component mount
  useEffect(() => {
    const validation = powerBIService.validateConfig(embedConfig);
    if (!validation.isValid) {
      setEnvConfigError(validation.error);
      setReportError(validation.error || 'Cấu hình không hợp lệ');
    }
  }, [embedConfig, setReportError]);

  // Autodesk connection actions
  const handleConnectAutodesk = async () => {
    try {
      const authUrl = await getAuthUrl();
      window.location.href = authUrl;
    } catch (err) {
      console.error('Failed to generate Autodesk auth URL:', err);
    }
  };

  const handleDisconnectAutodesk = () => {
    clearAuth();
    setAutodeskConnected(false);
    setSelectedUrn(null);
    window.location.reload();
  };

  // Custom fullscreen handler depending on current screen context
  const handleFullscreen = () => {
    const docEl = document.documentElement;
    if (!document.fullscreenElement) {
      docEl.requestFullscreen().catch((err) => {
        console.error('Failed to enter fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle sidebar navigation clicks (smooth scroll to anchor target)
  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // IntersectionObserver to auto-update active sidebar nav item on scroll
  useEffect(() => {
    const sections = ['intro', 'powerbi', 'autodesk'];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Section is considered active if it takes up significant portion of screen
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              setActiveSection(id);
            }
          });
        },
        {
          root: null,
          rootMargin: '-80px 0px -50% 0px', // Offset header height (64px)
          threshold: [0.1, 0.25, 0.5],
        }
      );

      observer.observe(el);
      return { el, observer };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) {
          obs.observer.unobserve(obs.el);
        }
      });
    };
  }, []);

  const activeError = envConfigError || reportState.error;

  return (
    <DashboardLayout
      lastRefreshed={reportState.lastRefreshed}
      autoRefreshInterval={autoRefreshInterval}
      isRefreshing={isRefreshing}
      onRefresh={refreshReport}
      onFullscreen={handleFullscreen}
      onChangeInterval={setAutoRefreshInterval}
      activeSection={activeSection}
      onSectionClick={handleSectionClick}
      autodeskConnected={autodeskConnected}
      onConnectAutodesk={handleConnectAutodesk}
      onDisconnectAutodesk={handleDisconnectAutodesk}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Section 1: Introduction Card */}
        <Box id="intro">
          <CoverSlide onStart={() => handleSectionClick('powerbi')} />
        </Box>

        {/* Section 2: Power BI Report Card */}
        <Box
          id="powerbi"
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            p: { xs: 2.5, sm: 4 },
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)', pb: 2 }}>
            <Typography variant="h5" sx={{ color: '#1D2939', fontWeight: 700, mb: 0.5 }}>
              2. Báo cáo phân tích dữ liệu trực quan Power BI
            </Typography>
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Báo cáo tiến độ xây dựng, biểu đồ tài chính, và các chỉ số kinh tế dự án KTXD.
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, minHeight: '620px', position: 'relative' }}>
            {activeError ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <ErrorView
                  errorMessage={activeError}
                  onRetry={!envConfigError ? refreshReport : undefined}
                />
              </Box>
            ) : (
              <Box sx={{ height: '100%', position: 'relative' }}>
                <PowerBIReport
                  config={embedConfig}
                  onReportLoaded={setEmbeddedReport}
                  onReportError={setReportError}
                />
                {/* Only show the full-cover loading overlay if we have a token but the report hasn't finished rendering yet.
                    PowerBIReport handles its own "waiting for auth" or "needs consent" UI internally. */}
                {reportState.isLoading && powerBIAccessToken && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 3 }}>
                    <LoadingSpinner />
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Section 3: Autodesk 3D Model Card */}
        <Box
          id="autodesk"
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: 3,
            p: { xs: 2.5, sm: 4 },
            border: '1px solid rgba(0, 0, 0, 0.08)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.03)',
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
          }}
        >
          <Box sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.06)', pb: 2 }}>
            <Typography variant="h5" sx={{ color: '#1D2939', fontWeight: 700, mb: 0.5 }}>
              3. Mô hình BIM 3D Autodesk Construction Cloud
            </Typography>
            <Typography variant="body2" sx={{ color: '#475467' }}>
              Tích hợp duyệt thư mục tệp tin và hiển thị mô hình 3D trực quan của dự án.
            </Typography>
            {/* Split Screen Browser Panel Area */}
            <Box sx={{ height: '650px', position: 'relative', display: 'flex', minHeight: 0 }}>
              {autodeskConnected ? (
                <ResizablePanel
                  collapsed={browserCollapsed}
                  onCollapseToggle={() => setBrowserCollapsed(v => !v)}
                  defaultLeftWidth={280}
                  minLeftWidth={200}
                  maxLeftWidth={450}
                  left={
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Browser Header */}
                      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#475467', letterSpacing: 0.5 }}>
                          TRÌNH DUYỆT THƯ MỤC (ACC)
                        </Typography>
                      </Box>
                      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}>
                        <HubsBrowser onVersionSelected={setSelectedUrn} />
                      </Box>
                    </Box>
                  }
                  right={
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        border: '1px solid rgba(0, 0, 0, 0.08)',
                        backgroundColor: '#FFFFFF',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Viewer Header */}
                      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.06)', backgroundColor: '#F8F9FA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#475467', letterSpacing: 0.5 }}>
                          BẢN VẼ / MÔ HÌNH 3D TRỰC QUAN
                        </Typography>
                        {selectedUrn && autodeskLoadStatus && (
                          <Chip
                            label={autodeskLoadStatus.split('\n')[0].substring(0, 40)}
                            size="small"
                            variant="outlined"
                            sx={{
                              fontSize: '0.7rem',
                              height: 20,
                              borderColor: 'rgba(0, 0, 0, 0.12)',
                              color: '#1976D2',
                              fontWeight: 600,
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1, position: 'relative', minHeight: 0 }}>
                        <AutodeskViewer
                          onConnect={handleConnectAutodesk}
                          urn={selectedUrn}
                          onLoadStatusChange={setAutodeskLoadStatus}
                        />
                      </Box>
                    </Box>
                  }
                />
              ) : (
                <Box sx={{ flexGrow: 1, borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.08)', overflow: 'hidden', position: 'relative' }}>
                  <AutodeskViewer onConnect={handleConnectAutodesk} urn={null} />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </DashboardLayout >
  );
};

export default DashboardPage;
