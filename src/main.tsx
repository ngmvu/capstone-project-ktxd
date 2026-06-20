import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { exchangeCodeForToken } from './services/AuthService.ts'

/**
 * Handle Autodesk OAuth PKCE callback BEFORE React mounts.
 * Runs once in module scope — React Strict Mode cannot interfere.
 */
async function bootstrap() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const errorParam = urlParams.get('autodesk_error');

  // Show error page if token exchange previously failed
  if (errorParam) {
    const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#090d16;font-family:sans-serif;color:#fff;padding:2rem;text-align:center">
        <h2 style="color:#f87171;margin-bottom:1rem">❌ Autodesk Token Exchange Failed</h2>
        <pre style="background:#1e2235;padding:1.5rem;border-radius:12px;max-width:700px;overflow:auto;text-align:left;font-size:0.85rem;color:#fca5a5">${decodeURIComponent(errorParam)}</pre>
        <p style="margin-top:1.5rem;color:#94a3b8">Kiểm tra Console (F12) để biết thêm chi tiết.</p>
        <button onclick="window.location.href='/'" style="margin-top:1rem;padding:0.75rem 2rem;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:1rem;cursor:pointer">← Quay lại</button>
      </div>`;
    return;
  }

  if (code) {
    // Show loading indicator during token exchange
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#090d16;font-family:sans-serif;color:#94a3b8;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid #6366f1;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        <p style="margin:0">Đang xác thực với Autodesk...</p>
      </div>`;

    try {
      await exchangeCodeForToken(code);
      // Success — clean URL and reload into the app
      const cleanUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      window.location.reload();
    } catch (err: any) {
      console.error('Autodesk token exchange failed:', err);
      // Show error inline instead of silently reloading
      const details = err?.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : (err?.message || String(err));
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#090d16;font-family:sans-serif;color:#fff;padding:2rem;text-align:center">
          <h2 style="color:#f87171;margin-bottom:1rem">❌ Autodesk Token Exchange Failed</h2>
          <pre style="background:#1e2235;padding:1.5rem;border-radius:12px;max-width:700px;overflow:auto;text-align:left;font-size:0.85rem;color:#fca5a5">${details}</pre>
          <p style="margin-top:1.5rem;color:#94a3b8">Kiểm tra Console (F12) → Network tab → request tới /authentication/v2/token để xem chi tiết lỗi.</p>
          <button onclick="window.location.href='/'" style="margin-top:1rem;padding:0.75rem 2rem;border-radius:8px;border:none;background:#6366f1;color:#fff;font-size:1rem;cursor:pointer">← Thử lại</button>
        </div>`;
    }
    return;
  }

  // No code param → render the app normally
  createRoot(document.getElementById('root')!).render(
    <App />
  );
}

bootstrap();
