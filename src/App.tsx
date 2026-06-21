import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MsalProvider } from '@azure/msal-react';

import { theme } from './theme/theme';
import { msalInstance } from './services/MsalService';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <MsalProvider instance={msalInstance}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <DashboardPage />
        </AuthProvider>
      </ThemeProvider>
    </MsalProvider>
  );
};

export default App;
