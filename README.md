# Hướng dẫn Tích hợp Power BI Dashboard vào ReactJS (Vite + TypeScript + MUI)

Dự án này là một mẫu template **Production-Ready** hoàn chỉnh tích hợp Power BI Dashboard (.pbix) sử dụng các công nghệ hiện đại bậc nhất: **Vite**, **TypeScript**, **Material UI (v6)** và **Power BI Client SDK**. Giao diện được thiết kế với phong cách hiện đại (Dark Mode mặc định, cấu trúc Glassmorphism, hiệu ứng chuyển động mượt mà) đi kèm các công cụ quản lý đồng bộ dữ liệu tự động nâng cao.

---

## 🚀 Các Tính Năng Nổi Bật

1. **Hiển thị Toàn màn hình & Khung điều khiển chuyên nghiệp:** Tận dụng tối đa diện tích hiển thị của Power BI, hỗ trợ chế độ xem Fullscreen tiêu chuẩn qua SDK.
2. **Cơ chế Tự động Đồng bộ (Auto-sync Refresh):**
   - Hỗ trợ menu **Auto Refresh** định kỳ (1 phút, 5 phút, 15 phút hoặc Tắt).
   - Nút **Đồng bộ (Refresh)** thủ công tiện lợi ngay trên AppBar giúp gọi trực tiếp API `report.refresh()` để làm mới biểu đồ mà không tải lại trang.
3. **Quản lý trạng thái & Xử lý lỗi toàn diện:**
   - **Loading Spinner:** Vòng xoay chuyển động glow sang trọng khi tải báo cáo.
   - **Error Handling Card:** Hiển thị thông báo chi tiết khi hết hạn Token hoặc sai định dạng ID, đi kèm danh sách kiểm tra lỗi (troubleshooting checklist) và nút thử lại (retry).
4. **Cơ cấu phân tầng chuẩn Production:** Tách biệt hoàn toàn `service` kết nối, custom `react hooks` điều khiển vòng đời báo cáo, `layout` dùng chung và các `components` trình diễn.

---

## 🛠️ Hướng Dẫn Cấu Hình Biến Môi Trường (.env)

Mở file `.env` ở thư mục gốc của dự án và điền đầy đủ các thông tin:

```env
VITE_POWERBI_EMBED_URL="[Dán Embed URL tại đây]"
VITE_POWERBI_REPORT_ID="[Dán Report ID dạng GUID tại đây]"
VITE_POWERBI_GROUP_ID="[Dán Group ID dạng GUID tại đây nếu có]"
VITE_POWERBI_ACCESS_TOKEN="[Dán Access Token (còn hạn) tại đây]"
VITE_POWERBI_TOKEN_TYPE="AAD"
```

> `VITE_POWERBI_GROUP_ID` là tuỳ chọn. Nếu bạn chỉ muốn dùng `reportId` thì `VITE_POWERBI_EMBED_URL` có thể để trống và hệ thống sẽ tự sinh ra URL dạng:
> `https://app.powerbi.com/reportEmbed?reportId=<REPORT_ID>&autoAuth=true`

---

## 📖 CẨM NANG CHI TIẾT: CÁCH LẤY THÔNG SỐ TỪ POWER BI SERVICE

Để nhúng thành công báo cáo vào ứng dụng React, bạn cần thu thập 4 thông số chính dưới đây từ **Power BI Service (https://app.powerbi.com)**:

### 1. Cách lấy Report ID và Group ID (Workspace ID)
Đây là cách nhanh nhất và trực quan nhất bằng cách phân tích đường dẫn URL của báo cáo trên trình duyệt.

1. Đăng nhập vào [Power BI Service](https://app.powerbi.com).
2. Đi vào **Workspaces** (Không gian làm việc) của bạn và chọn Báo cáo (.pbix) mà bạn đã publish lên.
3. Nhìn lên thanh địa chỉ của trình duyệt, đường dẫn URL sẽ có cấu trúc như sau:
   `https://app.powerbi.com/groups/e374828f-7c15-46aa-ac9b-xxxxxxxxxxxx/reports/51296bf3-9d08-410a-b328-yyyyyyyyyyyy/ReportSection`
4. **Phân tách các giá trị:**
   - **Group ID (Workspace ID):** Là chuỗi ký tự nằm ngay sau `/groups/` (Trong ví dụ là `e374828f-7c15-46aa-ac9b-xxxxxxxxxxxx`).
   - **Report ID:** Là chuỗi ký tự nằm ngay sau `/reports/` (Trong ví dụ là `51296bf3-9d08-410a-b328-yyyyyyyyyyyy`).

---

### 2. Cách lấy Embed URL (Đường dẫn nhúng báo cáo)
Đường dẫn này xác định địa chỉ để iframe của SDK Power BI tải giao diện báo cáo của bạn.

1. Tại màn hình xem báo cáo trên Power BI Service, nhấp vào menu **File** (Tệp) ở góc trên bên trái.
2. Chọn **Embed report** (Nhúng báo cáo) -> Chọn **Website or portal** (Trang web hoặc cổng thông tin).
3. Một cửa sổ pop-up sẽ xuất hiện. Hãy sao chép liên kết nằm ở ô đầu tiên: **"Here's a link you can use to embed this content"** (Đây là liên kết bạn có thể sử dụng để nhúng nội dung này).
   - Ví dụ: `https://app.powerbi.com/reportEmbed?reportId=51296bf3-9d08-410a-b328-yyyyyyyyyyyy&groupId=e374828f-7c15-46aa-ac9b-xxxxxxxxxxxx&w=2&config=eyJj...`
4. Dán đường dẫn này vào biến `VITE_POWERBI_EMBED_URL` trong file `.env`.

> Lưu ý: `VITE_POWERBI_EMBED_URL` phải là Power BI embed URL hợp lệ, không phải URL xem báo cáo dạng `/groups/me/reports/...`.
> Nếu bạn muốn chắc chắn, lấy giá trị `embedUrl` từ REST API Power BI (`GET /reports/{reportId}` hoặc `GET /groups/{groupId}/reports/{reportId}`) hoặc từ trang nhúng của Power BI Service.

### 3. Cách lấy Access Token (Mã truy cập)
Để kiểm tra lập trình nhanh ở môi trường local, bạn cần một Azure AD Access Token. Vì Token này chỉ tồn tại trong 60 phút, bạn có thể lấy bằng 2 cách sau:

#### Cách A: Lấy nhanh từ Developer Console (Khuyên dùng khi Dev/Test)
1. Truy cập vào trang báo cáo của bạn trên [Power BI Service](https://app.powerbi.com).
2. Nhấn phím `F12` (hoặc `Ctrl + Shift + I`) để mở Công cụ nhà phát triển (Developer Tools) -> Chọn tab **Console**.
3. Dán dòng lệnh JavaScript dưới đây vào ô Console và nhấn `Enter`:
   ```javascript
console.log(powerBIAccessToken);
   ```
4. Lệnh này sẽ tự động sao chép Access Token hiện tại từ phiên đăng nhập của bạn vào Clipboard.
5. Quay lại dự án React, dán chuỗi dài này vào biến `VITE_POWERBI_ACCESS_TOKEN` trong `.env`.

#### Cách B: Sử dụng Azure CLI (Nếu bạn thích dùng Command Line)
1. Cài đặt Azure CLI trên máy tính của bạn.
2. Mở terminal và chạy lệnh đăng nhập:
   ```bash
   az login
   ```
3. Chạy lệnh sau để sinh ra Access Token cho dịch vụ Power BI:
   ```bash
   az account get-access-token --resource https://analysis.windows.net/powerbi/api --query accessToken --output tsv
   ```
4. Copy token trả về và dán vào file `.env`.

> [!WARNING]
> **Lưu ý Production:** Trong thực tế, bạn không nên lưu cứng Access Token trong file `.env` ở client (vì sẽ hết hạn sau 1 tiếng). 
> Hãy thiết lập một ứng dụng **Azure AD App (Service Principal)** và xây dựng một API Backend (Node.js/C#/.NET) để sinh **Embed Token** tạm thời thông qua API `GenerateToken` của Microsoft, sau đó gọi API này từ React để nạp động Token mới (được hỗ trợ sẵn cấu trúc trong `powerbi.service.ts`).

---

## 🏃 Cài Đặt và Khởi Chạy Dự Án

### Bước 1: Di chuyển vào thư mục dự án và cài đặt dependencies
```bash
npm install
```

### Bước 2: Chạy dự án ở chế độ Development
```bash
npm run dev
```
Trình duyệt sẽ tự động mở tại địa chỉ: `http://localhost:5173`.

### Bước 3: Biên dịch mã nguồn (Build Production Bundle)
```bash
npm run build
```
Lệnh này sẽ biên dịch toàn bộ code TypeScript, tối ưu hóa CSS và tạo các file build tĩnh đặt trong thư mục `/dist` sẵn sàng deploy lên Vercel, Netlify, hoặc Azure Static Web Apps.

---

## 📂 Cấu Trúc Thư Mục Thực Tế

```text
pbix-capstone-project-ktxd/
├── src/
│   ├── components/
│   │   ├── LoadingSpinner.tsx     # Spinner glow cực đẹp khi tải
│   │   ├── ErrorView.tsx          # Báo lỗi sang trọng & tài liệu gỡ lỗi
│   │   └── PowerBIReport.tsx      # Lõi tích hợp powerbi-client-react
│   ├── hooks/
│   │   └── usePowerBI.ts          # Hook điều khiển logic, refresh, interval
│   ├── layouts/
│   │   └── DashboardLayout.tsx    # AppBar Glassmorphism & Sidebar 
│   ├── pages/
│   │   └── DashboardPage.tsx      # Trang chủ ghép nối luồng dữ liệu
│   ├── services/
│   │   └── powerbi.service.ts     # Dịch vụ kiểm tra & kết nối API
│   ├── theme/
│   │   └── theme.ts               # Cấu hình MUI Dark Mode, Palette, Button
│   ├── types/
│   │   └── powerbi.ts             # Interface định nghĩa kiểu dữ liệu TS
│   ├── App.tsx                    # Điểm kết nối ThemeProvider và các trang
│   ├── index.css                  # CSS toàn cục & Keyframes hiệu ứng
│   └── main.tsx                   # Khởi tạo React Virtual DOM
├── .env                           # File cấu hình môi trường đang chạy
├── .env.example                   # File mẫu biến cấu hình
├── package.json                   # Quản lý thư viện
└── tsconfig.json                  # Cấu hình TypeScript compiler
```
