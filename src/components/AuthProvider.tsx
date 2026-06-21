import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { InteractionRequiredAuthError } from '@azure/msal-browser';
import type { AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { useMsal } from '@azure/msal-react';
import { loginRequest, powerBIRequest } from '../services/MsalService';

export interface AuthUser {
  name: string;
  email: string;
  accountInfo: AccountInfo;
}

export interface AuthContextValue {
  user: AuthUser | null;
  powerBIAccessToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  authError: string | null;
  /** True when Power BI scope needs user consent (click required) */
  needsPowerBIConsent: boolean;
  login: () => void;
  logout: () => void;
  /** Try silent token refresh */
  refreshPowerBIToken: () => Promise<string | null>;
  /** User-click handler: opens popup to consent Power BI scope */
  grantPowerBIConsent: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { instance, accounts, inProgress } = useMsal();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [powerBIAccessToken, setPowerBIAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [needsPowerBIConsent, setNeedsPowerBIConsent] = useState(false);

  const activeAccountRef = useRef<AccountInfo | null>(null);

  // Sync user state from MSAL accounts list
  useEffect(() => {
    if (inProgress !== 'none') return;

    const account = accounts[0] ?? null;
    activeAccountRef.current = account;

    if (account) {
      setUser({
        name: account.name ?? account.username,
        email: account.username,
        accountInfo: account,
      });
    } else {
      setUser(null);
      setPowerBIAccessToken(null);
    }

    setIsInitialized(true);
    setIsLoading(false);
  }, [accounts, inProgress]);

  // Acquire Power BI token silently (no popup, no redirect)
  const refreshPowerBIToken = useCallback(async (): Promise<string | null> => {
    const account = activeAccountRef.current;
    if (!account) return null;

    try {
      const result: AuthenticationResult = await instance.acquireTokenSilent({
        ...powerBIRequest,
        account,
      });
      setPowerBIAccessToken(result.accessToken);
      setAuthError(null);
      setNeedsPowerBIConsent(false);
      return result.accessToken;
    } catch (err) {
      if (err instanceof InteractionRequiredAuthError) {
        // Need user consent — set flag so UI can show a button
        console.warn('[Auth] Power BI needs user consent (click "Cấp quyền" to proceed).');
        setNeedsPowerBIConsent(true);
      } else {
        console.error('[Auth] Failed to acquire Power BI token:', err);
        setAuthError('Lỗi khi lấy token Power BI.');
      }
      return null;
    }
  }, [instance]);

  // User-click handler: opens consent popup (must be called from user gesture!)
  const grantPowerBIConsent = useCallback(async (): Promise<string | null> => {
    const account = activeAccountRef.current;
    if (!account) return null;

    try {
      const result = await instance.acquireTokenPopup({
        ...powerBIRequest,
        account,
      });
      setPowerBIAccessToken(result.accessToken);
      setAuthError(null);
      setNeedsPowerBIConsent(false);
      return result.accessToken;
    } catch (err) {
      console.error('[Auth] Power BI consent popup failed:', err);
      setAuthError('Cấp quyền Power BI thất bại. Vui lòng thử lại.');
      return null;
    }
  }, [instance]);

  // Fetch token once user is set (silent only — no popup)
  useEffect(() => {
    if (user) refreshPowerBIToken();
  }, [user, refreshPowerBIToken]);

  // Pro-active refresh every 50 minutes (silent only)
  useEffect(() => {
    if (!user || needsPowerBIConsent) return;
    const timer = setInterval(() => refreshPowerBIToken(), 50 * 60 * 1000);
    return () => clearInterval(timer);
  }, [user, needsPowerBIConsent, refreshPowerBIToken]);

  const login = useCallback(() => {
    setAuthError(null);
    instance.loginRedirect(loginRequest).catch((err) => {
      console.error('[Auth] loginRedirect failed:', err);
      setAuthError('Đăng nhập thất bại. Vui lòng thử lại.');
    });
  }, [instance]);

  const logout = useCallback(() => {
    instance.logoutRedirect({
      account: activeAccountRef.current ?? undefined,
      postLogoutRedirectUri: window.location.origin,
    });
  }, [instance]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user, powerBIAccessToken, isLoading, isInitialized, authError,
      needsPowerBIConsent, login, logout, refreshPowerBIToken, grantPowerBIConsent,
    }),
    [user, powerBIAccessToken, isLoading, isInitialized, authError,
     needsPowerBIConsent, login, logout, refreshPowerBIToken, grantPowerBIConsent]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>');
  return ctx;
};
