import React, { useContext } from 'react';
import { LoginContext } from './LoginContextProvider';

const LoginContextConsumer = () => {
  const { isLogin } = useContext(LoginContext);
  return (
    <div>
      <h1>로그인 여부 : {isLogin ? '로그인' : '로그아웃'}</h1>
    </div>
  );
};

export default LoginContextConsumer;
