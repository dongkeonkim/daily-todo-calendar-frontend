import React, { createContext, useEffect, useState, ReactNode } from 'react';
import api from '@/apis/api';
import Cookies from 'js-cookie';
import * as auth from '@/apis/auth';
import { useNavigate } from 'react-router-dom';
import { useAlert } from './AlertContext';
import { LoginContextType, User } from '@/types';
import { getErrorMessage } from '@/utils/errorHandlers';

export const LoginContext = createContext<LoginContextType>({
  isLogin: false,
  userInfo: null,
  login: async () => {},
  kakaoLogin: async () => {},
  logout: () => {},
});

LoginContext.displayName = 'LoginContext';

interface LoginContextProviderProps {
  children: ReactNode;
}

const LoginContextProvider: React.FC<LoginContextProviderProps> = ({
  children,
}) => {
  const [isLogin, setLogin] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const { showAlert } = useAlert();

  const navigate = useNavigate();

  const loginCheck = async (): Promise<void> => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      logoutSetting();
      navigate('/login', { replace: true });
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    try {
      const response = await auth.info();
      const data = response.data;

      if (data.code === 'UNAUTHRIZED' || response.status === 401) {
        console.error('인증에 실패하였습니다.');
        logoutSetting();
        return;
      }

      loginSetting(data.result, accessToken);
    } catch (error) {
      logoutSetting();
      return;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const result = await auth.login(email, password);
      const { data, status } = result;
      const accessToken = data.result.accessToken;

      if (status === 200) {
        Cookies.set('accessToken', accessToken);
        await loginCheck();
        navigate('/');
      }
    } catch (error: any) {
      showAlert(getErrorMessage(error, '로그인에 실패했습니다.'));
    }
  };

  const kakaoLogin = async (code: string): Promise<void> => {
    try {
      const result = await auth.kakaoLogin(code);
      const { data, status } = result;
      const accessToken = data.result.accessToken;

      if (status === 200) {
        Cookies.set('accessToken', accessToken);
        await loginCheck();
        navigate('/');
      }
    } catch (error: any) {
      showAlert(getErrorMessage(error, '카카오 로그인에 실패했습니다.'));
      throw error;
    }
  };

  const loginSetting = (userData: User, accessToken: string): void => {
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setLogin(true);
    setUserInfo(userData);
  };

  const logoutSetting = (): void => {
    if (api.defaults.headers.common.Authorization) {
      delete api.defaults.headers.common.Authorization;
    }
    Cookies.remove('accessToken');
    setLogin(false);
    setUserInfo(null);
  };

  const logout = (): void => {
    logoutSetting();
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 0);
  };

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <LoginContext.Provider
      value={{ isLogin, userInfo, login, kakaoLogin, logout }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
