import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '@/contexts/LoginContextProvider';
import LoginForm from '@/components/Login/LoginForm';

/**
 * 로그인 페이지 컴포넌트
 */
const Login: React.FC = () => {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  // 이미 로그인한 경우 홈으로 리다이렉트
  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin, navigate]);

  return <LoginForm />;
};

export default Login;
