import React from 'react';
import Header from '../Header/Header';
import LoginForm from '../Login/LoginForm';

const Login = () => {
  return (
    <>
      <Header />
      <div className='container'>
        <LoginForm />
      </div>
    </>
  );
};

export default Login;
