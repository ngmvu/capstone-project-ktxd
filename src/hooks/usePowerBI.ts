import { useState, useEffect, useCallback } from 'react';
import { Report } from 'powerbi-client';
import type { ReportState, AutoRefreshInterval } from '../types/powerbi';

export const usePowerBI = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<AutoRefreshInterval>('off');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [reportState, setReportState] = useState<ReportState>({
    isLoading: true,
    error: null,
    isLoaded: false,
    lastRefreshed: null,
  });

  // Khi component báo cáo nhúng thành công và trả về instance Report
  const setEmbeddedReport = useCallback((embeddedReport: Report) => {
    setReport(embeddedReport);
    setReportState(prev => ({
      ...prev,
      isLoading: false,
      isLoaded: true,
      lastRefreshed: new Date(),
    }));
  }, []);

  // Thiết lập trạng thái lỗi
  const setReportError = useCallback((errorMessage: string) => {
    setReportState(prev => ({
      ...prev,
      isLoading: false,
      error: errorMessage,
    }));
  }, []);

  // Thiết lập bắt đầu tải báo cáo
  const startLoading = useCallback(() => {
    setReportState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));
  }, []);

  // Hàm gọi làm mới dữ liệu từ Power BI Service
  const refreshReport = useCallback(async () => {
    if (!report) {
      console.warn('Báo cáo chưa được khởi tạo. Không thể refresh.');
      return;
    }

    setIsRefreshing(true);
    try {
      console.log('Đang gửi lệnh yêu cầu Power BI SDK đồng bộ và làm mới dữ liệu...');
      await report.refresh();
      console.log('Đồng bộ và làm mới dữ liệu Power BI thành công!');
      setReportState(prev => ({
        ...prev,
        lastRefreshed: new Date(),
        error: null,
      }));
    } catch (err: any) {
      console.error('Lỗi khi làm mới dữ liệu báo cáo:', err);
      // Không ghi đè lỗi nặng làm mất giao diện trừ khi mong muốn
    } finally {
      setIsRefreshing(false);
    }
  }, [report]);

  // Hàm kích hoạt mở rộng toàn màn hình
  const toggleFullscreen = useCallback(() => {
    if (!report) {
      console.warn('Báo cáo chưa sẵn sàng để hiển thị toàn màn hình.');
      return;
    }
    try {
      console.log('Kích hoạt chế độ hiển thị toàn màn hình Power BI...');
      report.fullscreen();
    } catch (err) {
      console.error('Không thể mở toàn màn hình:', err);
    }
  }, [report]);

  // Quản lý cơ chế tự động đồng bộ (Auto Refresh Sync)
  useEffect(() => {
    if (!report || autoRefreshInterval === 'off') return;

    let intervalMs = 60000; // Mặc định 1 phút
    if (autoRefreshInterval === '5m') {
      intervalMs = 5 * 60 * 1000;
    } else if (autoRefreshInterval === '15m') {
      intervalMs = 15 * 60 * 1000;
    }

    console.log(`Đã cấu hình tự động đồng bộ định kỳ mỗi ${autoRefreshInterval} (${intervalMs}ms)`);

    const timer = setInterval(() => {
      console.log(`[Auto Sync] Bắt đầu tự động làm mới dữ liệu...`);
      report.refresh()
        .then(() => {
          console.log('[Auto Sync] Tự động cập nhật dữ liệu thành công!');
          setReportState(prev => ({
            ...prev,
            lastRefreshed: new Date(),
          }));
        })
        .catch(err => {
          console.error('[Auto Sync] Tự động cập nhật dữ liệu thất bại:', err);
        });
    }, intervalMs);

    return () => {
      clearInterval(timer);
      console.log(`Đã dọn dẹp bộ hẹn giờ tự động đồng bộ (${autoRefreshInterval})`);
    };
  }, [report, autoRefreshInterval]);

  return {
    report,
    reportState,
    isRefreshing,
    autoRefreshInterval,
    setEmbeddedReport,
    setReportError,
    startLoading,
    refreshReport,
    toggleFullscreen,
    setAutoRefreshInterval,
  };
};
