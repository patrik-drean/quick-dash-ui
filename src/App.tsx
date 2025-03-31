import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { DashboardProvider } from './context/DashboardContext';
import { DashboardView } from './components/dashboard/DashboardView';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardProvider>
        <DashboardView />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;
