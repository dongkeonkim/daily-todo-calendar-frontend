import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContextProvider';

const LoginForm = () => {
  const { login } = useContext(LoginContext);

  const onLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.email.value;
    const password = form.password.value;

    login(username, password);
  };

  return (
    <>
      <div>
        <h1 className='bg-yellow-200'>Login</h1>

        <form onSubmit={(e) => onLogin(e)}>
          <input
            type='text'
            id='email'
            placeholder='이메일'
            name=''
            autoComplete=''
            required
          />

          <input
            type='text'
            id='password'
            placeholder='비밀번호'
            name='password'
            autoComplete='password'
            required
          />

          <button type='submit' className='bg-blue-500 '>
            로그인
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
