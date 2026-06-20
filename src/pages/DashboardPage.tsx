import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
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
  const [autodeskConnected, setAutodeskConnected] = useState<boolean>(false);
  const [selectedUrn, setSelectedUrn] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'cover' | 'powerbi' | 'autodesk'>('cover');
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

  // Custom fullscreen handler depending on active view
  const handleFullscreen = () => {
    if (activeView === 'powerbi') {
      toggleFullscreen();
    } else {
      const docEl = document.documentElement;
      if (!document.fullscreenElement) {
        docEl.requestFullscreen().catch((err) => {
          console.error('Failed to enter fullscreen:', err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const activeError = envConfigError || reportState.error;

  return (
    <DashboardLayout
      lastRefreshed={reportState.lastRefreshed}
      autoRefreshInterval={autoRefreshInterval}
      isRefreshing={isRefreshing}
      onRefresh={refreshReport}
      onFullscreen={handleFullscreen}
      onChangeInterval={setAutoRefreshInterval}
      activeView={activeView}
      onViewChange={setActiveView}
    >
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* VIEW 1: Presentation Cover Slide */}
        {activeView === 'cover' && (
          <div className="animate-[fadeInUp_0.4s_ease-out]">
            <CoverSlide onStart={() => setActiveView('powerbi')} />
          </div>
        )}

        {/* VIEW 2: Power BI Report Slide */}
        {activeView === 'powerbi' && (
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: '650px', position: 'relative' }} className="animate-[fadeInUp_0.4s_ease-out]">
            {activeError ? (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <ErrorView
                  errorMessage={activeError}
                  onRetry={!envConfigError ? refreshReport : undefined}
                />
              </Box>
            ) : (
              <>
                {reportState.isLoading && (
                  <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(9, 13, 22, 0.7)', borderRadius: 3 }}>
                    <LoadingSpinner />
                  </Box>
                )}
                <Box sx={{ flexGrow: 1, height: '100%', visibility: reportState.isLoading ? 'hidden' : 'visible' }}>
                  <PowerBIReport
                    config={embedConfig}
                    onReportLoaded={setEmbeddedReport}
                    onReportError={setReportError}
                  />
                </Box>
              </>
            )}
          </Box>
        )}

        {/* VIEW 3: Autodesk 3D Model Viewer Slide */}
        {activeView === 'autodesk' && (
          <div className="flex flex-col h-full gap-4 animate-[fadeInUp_0.4s_ease-out]">
            {/* ── Status Banner ── */}
            <div className="flex items-center justify-between flex-wrap gap-3 px-5 py-3
                            rounded-2xl border border-white/6
                            bg-gradient-to-r from-indigo-600/10 via-slate-800/40 to-cyan-500/10
                            backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-sm text-slate-300 font-medium font-[Outfit]">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400">
                  🚀
                </span>
                <span><strong className="text-white">Chế độ hoạt động:</strong> Tích hợp dữ liệu Autodesk Construction Cloud (ACC)</span>
              </div>

              {/* Connection status */}
              <div className="flex items-center gap-3">
                <span className={`flex items-center gap-1.5 text-sm font-semibold font-[Outfit] ${autodeskConnected ? 'text-emerald-400' : 'text-amber-400'}`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${autodeskConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${autodeskConnected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  </span>
                  {autodeskConnected ? 'Autodesk Connected' : 'Autodesk Not Connected'}
                </span>

                {autodeskConnected ? (
                  <button
                    onClick={handleDisconnectAutodesk}
                    className="px-3 py-1 rounded-lg text-xs font-semibold font-[Outfit]
                               border border-red-500/30 text-red-400 bg-red-500/5
                               hover:bg-red-500/15 hover:border-red-500/60 transition-all duration-200"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button
                    onClick={handleConnectAutodesk}
                    className="px-3 py-1 rounded-lg text-xs font-semibold font-[Outfit]
                               bg-indigo-500/90 text-white border border-indigo-400/40
                               hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:shadow-md
                               transition-all duration-200"
                  >
                    Connect
                  </button>
                )}
              </div>
            </div>

            {/* ── Main Pane Area ── */}
            <div style={{ flex: 1, position: 'relative', display: 'flex', minHeight: 600, height: '100%' }}>
              {autodeskConnected ? (
                <ResizablePanel
                  collapsed={browserCollapsed}
                  onCollapseToggle={() => setBrowserCollapsed(v => !v)}
                  defaultLeftWidth={300}
                  minLeftWidth={200}
                  maxLeftWidth={520}
                  left={
                    /* ── ACC Browser Panel ── */
                    <div className="h-full flex flex-col rounded-2xl border border-white/6 bg-slate-900/80 backdrop-blur-md shadow-xl overflow-hidden">
                      {/* Panel header */}
                      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-gradient-to-r from-indigo-600/10 to-transparent flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        <span className="text-xs font-bold uppercase tracking-widest text-indigo-300 font-[Outfit]">ACC Browser</span>
                      </div>
                      {/* Tree content */}
                      <div className="flex-1 overflow-y-auto p-2">
                        <HubsBrowser onVersionSelected={setSelectedUrn} />
                      </div>
                    </div>
                  }
                  right={
                    /* ── 3D Viewer Panel ── */
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
                      {/* Viewer header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-gradient-to-r from-cyan-600/10 to-transparent flex-shrink-0">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 font-[Outfit]">3D Model Viewer</span>
                        </div>
                        {selectedUrn && autodeskLoadStatus && (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border font-[Outfit] ${
                            autodeskLoadStatus.includes('✅') ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            autodeskLoadStatus.includes('❌') ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                            'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          }`}>
                            {autodeskLoadStatus.split('\n')[0].substring(0, 45)}
                          </span>
                        )}
                      </div>
                      {/* Viewer content */}
                      <div style={{ flex: 1, position: 'relative', minHeight: 500, overflow: 'hidden' }}>
                        <AutodeskViewer
                          onConnect={handleConnectAutodesk}
                          urn={selectedUrn}
                          onLoadStatusChange={setAutodeskLoadStatus}
                        />
                      </div>
                    </div>
                  }
                />
              ) : (
                /* Not connected: full-width viewer placeholder */
                <div className="flex-1 rounded-2xl border border-white/6 bg-slate-900/60 backdrop-blur-md shadow-xl overflow-hidden">
                  <AutodeskViewer onConnect={handleConnectAutodesk} urn={null} />
                </div>
              )}
            </div>
          </div>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default DashboardPage;
