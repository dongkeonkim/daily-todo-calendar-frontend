import './App.css';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import User from './pages/User';
import LoginContextProvider from './contexts/LoginContextProvider';
import PrivateRoute from './components/Auth/PrivateRoute';
import { AlertProvider } from './contexts/AlertContext';
import { LoadingProvider } from './contexts/LoadingContext';
import LoadingSpinner from './components/Loadings/LoadingSpinner';
import KakaoCallback from './pages/KakaoCallback';

/**
 * 애플리케이션 루트 컴포넌트
 */
const App: React.FC = () => {
  useEffect(() => {
    // Kakao SDK 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      const KAKAO_APP_KEY = process.env.REACT_APP_KAKAO_CLIENT_ID;

      if (KAKAO_APP_KEY) {
        window.Kakao.init(KAKAO_APP_KEY);
        console.log('Kakao SDK initialized');
      } else {
        console.error('Kakao Client ID is not defined');
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <LoadingProvider>
        <LoadingSpinner />
        <AlertProvider>
          <LoginContextProvider>
            <AppContent />
          </LoginContextProvider>
        </AlertProvider>
      </LoadingProvider>
    </BrowserRouter>
  );
};

/**
 * 메인 앱 컨텐츠 컴포넌트
 */
const AppContent: React.FC = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/join' element={<Join />} />
          <Route path='/auth/kakao/callback' element={<KakaoCallback />} />

          <Route
            path='/user'
            element={
              <PrivateRoute>
                <User />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

export default App;
