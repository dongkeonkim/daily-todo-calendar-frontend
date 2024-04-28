import React from 'react';

const JoinForm = ({ join }) => {
  const onJoin = (e) => {
    e.preventDefault();

    const form = e.target;
    const userId = form.username.value;
    const userPw = form.password.value;
    const name = form.name.value;

    join({ userId, userPw, name });
  };

  return (
    <>
      <div className='form'>
        <h2 className='login-title'>Join</h2>
        <form className='login-form' onSubmit={(e) => onJoin(e)}></form>
        <label htmlFor='name'>username</label>
        <input
          type='text'
          id='username'
          placeholder=''
          name=''
          autocomplete=''
          required
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

      <div className='form'>
        <form className='login-form' onSubmit={(e) => onJoin}></form>
        <label htmlFor='name'>name</label>
        <input
          type='text'
          id='name'
          placeholder=''
          name=''
          autocomplete=''
          required
        />
      </div>

      <div className='form'>
        <form className='login-form' onSubmit={(e) => onJoin}></form>
        <label htmlFor='name'>name</label>
        <input
          type='text'
          id='name'
          placeholder=''
          name=''
          autocomplete=''
          required
        />
      </div>
      <button className='btn btn--form btn-login'>Login</button>
    </>
  );
};

export default JoinForm;
