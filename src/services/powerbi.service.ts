import type { PowerBIEmbedConfig } from '../types/powerbi';

class PowerBIService {
  /**
   * Kiểm tra tính hợp lệ của các thông số cấu hình Power BI
   * @param config Cấu hình cần kiểm tra
   */
  public validateConfig(config: PowerBIEmbedConfig): { isValid: boolean; error: string | null } {
    if (!config.embedUrl) {
      return { isValid: false, error: 'Thiếu cấu hình VITE_POWERBI_EMBED_URL. Vui lòng kiểm tra lại file .env và sử dụng Power BI embed URL hợp lệ từ REST API hoặc trang nhúng, không phải URL xem báo cáo.' };
    }
    if (!config.embedUrl.includes('reportEmbed')) {
      return { isValid: false, error: 'VITE_POWERBI_EMBED_URL phải là Power BI embed URL chứa `reportEmbed`, không phải URL xem báo cáo.' };
    }
    if (!config.reportId) {
      return { isValid: false, error: 'Thiếu cấu hình VITE_POWERBI_REPORT_ID. Vui lòng kiểm tra lại file .env.' };
    }
    if (!config.accessToken) {
      return { isValid: false, error: 'Thiếu cấu hình VITE_POWERBI_ACCESS_TOKEN. Vui lòng kiểm tra lại hoặc gia hạn Token.' };
    }

    // Kiểm tra định dạng cơ bản của Report ID (UUID/GUID)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!guidRegex.test(config.reportId)) {
      return { isValid: false, error: 'VITE_POWERBI_REPORT_ID không đúng định dạng GUID chuẩn (Ví dụ: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).' };
    }

    if (config.groupId && !guidRegex.test(config.groupId)) {
      return { isValid: false, error: 'VITE_POWERBI_GROUP_ID không đúng định dạng GUID chuẩn.' };
    }

    return { isValid: true, error: null };
  }

  /**
   * Lấy cấu hình nhúng Power BI từ các biến môi trường
   * Hỗ trợ nạp động trong môi trường client
   */
  public getEmbedConfigFromEnv(): PowerBIEmbedConfig {
    return {
      embedUrl: (import.meta.env.VITE_POWERBI_EMBED_URL || '').trim(),
      reportId: import.meta.env.VITE_POWERBI_REPORT_ID || '',
      groupId: import.meta.env.VITE_POWERBI_GROUP_ID || '',
      accessToken: import.meta.env.VITE_POWERBI_ACCESS_TOKEN || '',
    };
  }

  /**
   * Phương thức mẫu để lấy Token và Config tự động từ Backend (Khuyên dùng cho Production)
   * Trong thực tế, bạn không nên lưu trực tiếp Access Token dài hạn ở client mà sẽ gọi Backend API
   * để lấy Embed Token tạm thời (Service Principal)
   */
  public async fetchEmbedConfigFromBackend(apiEndpoint: string): Promise<PowerBIEmbedConfig> {
    try {
      console.log('Đang gọi API Backend để lấy Embed Token mới...', apiEndpoint);
      const response = await fetch(apiEndpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${userSessionToken}` // Thêm token đăng nhập của app nếu cần
        }
      });

      if (!response.ok) {
        throw new Error(`API Backend trả về lỗi: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        embedUrl: data.embedUrl,
        reportId: data.reportId,
        groupId: data.groupId,
        accessToken: data.embedToken // Token tạm thời sinh bởi Backend API
      };
    } catch (error) {
      console.error('Lỗi khi tải cấu hình Power BI từ Backend:', error);
      throw error;
    }
  }
}

export const powerBIService = new PowerBIService();
