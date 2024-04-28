import React, { useContext } from 'react';
import { LoginContext } from '../../contexts/LoginContextProvider';

const LoginForm = () => {
  const { login } = useContext(LoginContext);

  const onLogin = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;

    login(username, password);
  };

  return (
    <>
      <div className='form'>
        <h2 className='login-title'>Login</h2>
        <form className='login-form' onSubmit={(e) => onLogin}></form>
        <label htmlFor='name'>username</label>
        <input
          type='text'
          id='username'
          placeholder=''
          name=''
          autocomplete=''
          required
          //TODO: after id save
          // dafeultValue()
        />
      </div>

      <div>
        <label htmlFor='password'>password</label>
        <input
          type='text'
          id='password'
          placeholder='password'
          name='password'
          autoComplete='password'
          required
        />
      </div>

      <button type='submit' className='btn btn--form btn-login'>
        Login
      </button>
    </>
  );
};

export default LoginForm;
