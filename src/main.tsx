import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { msalInstance } from './services/MsalService';
import { exchangeCodeForToken } from './services/AuthService.ts';

/**
 * bootstrap()
 *
 * Order of operations:
 * 1. Initialize MSAL and call handleRedirectPromise() FIRST.
 *    This consumes the Microsoft ?code= param in the URL before anything else.
 * 2. Only if MSAL did NOT handle the redirect, check for the Autodesk OAuth code.
 * 3. Mount React.
 *
 * WHY this order matters:
 *   Microsoft login redirects back with ?code=...&state=... in the URL.
 *   Autodesk also uses ?code=... for PKCE.
 *   Without MSAL processing first, the Autodesk handler grabs the Microsoft code
 *   and tries to exchange it — causing an infinite redirect loop.
 */
async function bootstrap() {
  // ── Step 1: Initialize MSAL and process any pending Microsoft redirect ────
  await msalInstance.initialize();

  // handleRedirectPromise() reads and clears the ?code= / ?state= from the URL
  // if they were put there by a Microsoft login redirect. Returns null otherwise.
  const msalResult = await msalInstance.handleRedirectPromise().catch((err) => {
    console.error('[MSAL] handleRedirectPromise error:', err);
    return null;
  });

  if (msalResult) {
    // Microsoft redirect was successfully processed → just mount the app.
    // MSAL has already cleaned up the URL.
    createRoot(document.getElementById('root')!).render(<App />);
    return;
  }

  // ── Step 2: Check for Autodesk OAuth PKCE callback (only if no MSAL redirect) ──
  const urlParams = new URLSearchParams(window.location.search);
  const errorParam = urlParams.get('autodesk_error');

  // Only treat ?code= as Autodesk if there is no MSAL `state` param
  // (MSAL always includes `state`; Autodesk may or may not).
  const code = urlParams.get('code');
  const hasMsalState = urlParams.has('state') && urlParams.has('session_state');

  if (errorParam) {
    const cleanUrl =
      window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({}, '', cleanUrl);
    document.body.innerHTML = `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#F5F7FA;font-family:Arial,sans-serif;color:#1D2939;padding:2rem;text-align:center">
        <h2 style="color:#D32F2F;margin-bottom:1rem">❌ Autodesk Token Exchange Failed</h2>
        <pre style="background:#FEE2E2;padding:1.5rem;border-radius:12px;max-width:700px;overflow:auto;text-align:left;font-size:0.85rem;color:#7F1D1D">${decodeURIComponent(errorParam)}</pre>
        <p style="margin-top:1.5rem;color:#64748B">Kiểm tra Console (F12) để biết thêm chi tiết.</p>
        <button onclick="window.location.href='/'" style="margin-top:1rem;padding:0.75rem 2rem;border-radius:8px;border:none;background:#1976D2;color:#fff;font-size:1rem;cursor:pointer">← Quay lại</button>
      </div>`;
    return;
  }

  // Autodesk PKCE code — only handle if there is no Microsoft state param
  if (code && !hasMsalState) {
    document.body.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#F5F7FA;font-family:Arial,sans-serif;color:#64748B;flex-direction:column;gap:1rem">
        <div style="width:40px;height:40px;border:3px solid #1976D2;border-top-color:transparent;border-radius:50%;animation:spin 0.8s linear infinite"></div>
        <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
        <p style="margin:0">Đang xác thực với Autodesk...</p>
      </div>`;

    try {
      await exchangeCodeForToken(code);
      const cleanUrl =
        window.location.protocol + '//' + window.location.host + window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
      window.location.reload();
    } catch (err: any) {
      const details = err?.response?.data
        ? JSON.stringify(err.response.data, null, 2)
        : err?.message || String(err);
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#F5F7FA;font-family:Arial,sans-serif;color:#1D2939;padding:2rem;text-align:center">
          <h2 style="color:#D32F2F;margin-bottom:1rem">❌ Autodesk Token Exchange Failed</h2>
          <pre style="background:#FEE2E2;padding:1.5rem;border-radius:12px;max-width:700px;overflow:auto;text-align:left;font-size:0.85rem;color:#7F1D1D">${details}</pre>
          <p style="margin-top:1.5rem;color:#64748B">Kiểm tra Console (F12) → Network tab → request tới /authentication/v2/token để xem chi tiết lỗi.</p>
          <button onclick="window.location.href='/'" style="margin-top:1rem;padding:0.75rem 2rem;border-radius:8px;border:none;background:#1976D2;color:#fff;font-size:1rem;cursor:pointer">← Thử lại</button>
        </div>`;
    }
    return;
  }

  // ── Step 3: Normal startup — mount the React app ──────────────────────────
  createRoot(document.getElementById('root')!).render(<App />);
}

bootstrap();
