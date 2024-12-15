import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '@/contexts/LoginContextProvider';
import LoginForm from '@/components/Login/LoginForm';

function LoginRedirect() {
  const { isLogin } = useContext(LoginContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogin) {
      navigate('/');
    }
  }, [isLogin]);
}

const Login = () => {
  LoginRedirect();
  return (
    <>
      {/* <div> */}
      <LoginForm />
      {/* </div> */}
    </>
  );
};

export default Login;
