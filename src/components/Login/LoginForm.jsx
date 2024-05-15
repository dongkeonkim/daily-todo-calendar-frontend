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
      <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
        <h1 className='mb-5 text-3xl font-bold text-yellow-500'>Login</h1>

        <form onSubmit={(e) => onLogin(e)} className='w-64'>
          <input
            type='text'
            id='email'
            placeholder='이메일'
            name=''
            autoComplete=''
            required
            className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />

          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            autoComplete='password'
            required
            className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />

          <button
            type='submit'
            className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
          >
            로그인
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
