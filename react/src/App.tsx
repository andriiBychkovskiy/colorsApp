import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { CssBaseline } from '@mui/material';
import Header from './components/Layout/Header';
import { AuthProvider } from './context/AuthContext';
import {  BrowserRouter } from 'react-router-dom';

const App: React.FC = () => {
  return (
      <AuthProvider>
      <BrowserRouter>
      <CssBaseline/>
        <Header/>
        <AppRoutes /></BrowserRouter>

      </AuthProvider>

  );
};

export default App;