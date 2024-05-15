import React, { createContext, useEffect, useState } from 'react';
import api from '../apis/api';
import Cookies from 'js-cookie';
import * as auth from '../apis/auth';
import { useNavigate } from 'react-router-dom';

export const LoginContext = createContext();
LoginContext.displayName = 'LoginCOntextName';

const LoginContextProvider = ({ children }) => {
  const [isLogin, setLogin] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const navigate = useNavigate();

  const loginCheck = async () => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
      logoutSetting();
      return;
    }

    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    let response;
    let data;

    try {
      response = await auth.info();
    } catch (error) {
      console.log(`error: ${error}`);
      console.log(`status: ${response.status}`);
      logoutSetting();
      return;
    }

    data = response.data;
    console.log(data);

    if (data == 'UNAUTHRIZED' || response.status === 401) {
      console.error('인증에 실패하였습니다.');
      return;
    }

    loginSetting(data, accessToken);
  };

  const login = async (username, password) => {
    console.log(username);
    console.log(password);

    try {
      const response = await auth.login(username, password);
      const data = response.data;
      const status = response.status;
      const headers = response.headers;
      const authorization = headers.authorization;
      const accessToken = authorization.replace('Bearer ', '');
      console.log(status);
      console.log(accessToken);

      if (status == 200) {
        Cookies.set('accessToken', accessToken);

        loginCheck();
        alert('로그인 성공');
        navigate('/');
      }
    } catch (error) {
      alert('로그인 실패');
    }
  };

  const loginSetting = (userData, accessToken) => {
    const { email, id, name } = userData;
    api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

    setLogin(true);

    const updateUserInfo = { email, id, name };

    setUserInfo(updateUserInfo);
  };

  const logoutSetting = () => {
    api.defaults.headers.common.Authorization = undefined;
    Cookies.remove('accessToken');
    setLogin(false);
    setUserInfo(null);
  };

  const logout = () => {
    logoutSetting();
    navigate('/');

    alert('로그아웃 되었습니다.');
  };

  useEffect(() => {
    loginCheck();
  }, []);

  return (
    <LoginContext.Provider value={{ isLogin, userInfo, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export default LoginContextProvider;
