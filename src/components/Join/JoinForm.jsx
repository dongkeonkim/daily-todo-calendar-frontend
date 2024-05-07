import React from 'react';

const JoinForm = ({ join }) => {
  const onJoin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name.value;

    join({ email, password, name });
  };

  return (
    <>
      <div>
        <h1 className='bg-yellow-200'>Login</h1>

        <form onSubmit={(e) => onJoin(e)}>
          <input type='text' id='email' placeholder='이메일' name='' required />

          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            required
          />

          <input type='text' id='name' placeholder='이름' required />

          <button type='submit' className='bg-blue-500 '>
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default JoinForm;
