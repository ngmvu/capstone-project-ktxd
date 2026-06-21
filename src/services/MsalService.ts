import { PublicClientApplication, LogLevel } from '@azure/msal-browser';
import type { Configuration } from '@azure/msal-browser';

// Microsoft Entra ID (Azure AD) application credentials
const CLIENT_ID = import.meta.env.VITE_MSAL_CLIENT_ID || '';
const TENANT_ID = import.meta.env.VITE_MSAL_TENANT_ID || '';
const REDIRECT_URI = import.meta.env.VITE_MSAL_REDIRECT_URI || window.location.origin;

const msalConfig: Configuration = {
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    redirectUri: REDIRECT_URI,
    postLogoutRedirectUri: REDIRECT_URI,
  },
  cache: {
    cacheLocation: 'localStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error('[MSAL]', message);
            break;
          case LogLevel.Warning:
            console.warn('[MSAL]', message);
            break;
          default:
            break;
        }
      },
      logLevel: LogLevel.Warning,
    },
  },
};

// Login scopes — user profile only
export const loginRequest = {
  scopes: ['openid', 'profile', 'User.Read'],
};

// Power BI token — specific scopes (don't use .default — needs admin consent)
export const powerBIRequest = {
  scopes: [
    'https://analysis.windows.net/powerbi/api/Report.Read.All',
    'https://analysis.windows.net/powerbi/api/Dataset.Read.All',
  ],
};

// Singleton MSAL instance shared across the app
export const msalInstance = new PublicClientApplication(msalConfig);
