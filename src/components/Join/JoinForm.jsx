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
      <div className='flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100'>
        <h1 className='mb-5 text-4xl font-bold text-blue-900 bg-gray-100'>
          Join
        </h1>

        <form onSubmit={(e) => onJoin(e)} className='w-64'>
          <input
            type='text'
            id='email'
            placeholder='이메일'
            name='email'
            required
            className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />

          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            required
            className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />

          <input
            type='text'
            id='name'
            placeholder='이름'
            required
            className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />

          <button
            type='submit'
            className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
          >
            회원가입
          </button>
        </form>
      </div>
    </>
  );
};

export default JoinForm;
