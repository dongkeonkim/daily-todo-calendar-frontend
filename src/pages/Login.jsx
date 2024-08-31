import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../contexts/LoginContextProvider';
import LoginForm from '../components/Login/LoginForm';

function LoginRedirect() {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(isLogin);
    if (isLogin) {
      navigate('/'); // 로그인한 상태라면 홈으로 리다이렉트
    }
  }, [isLogin]);
}

const Login = () => {
  LoginRedirect();
  return (
    <>
      <div>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
