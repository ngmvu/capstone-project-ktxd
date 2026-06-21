import { useAuthContext } from '../components/AuthProvider';

/**
 * useAuth — typed hook for authentication state and actions.
 *
 * Usage:
 *   const { user, login, logout, powerBIAccessToken } = useAuth();
 */
export const useAuth = useAuthContext;

export type { AuthUser, AuthContextValue } from '../components/AuthProvider';
