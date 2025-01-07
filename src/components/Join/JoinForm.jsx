import React from 'react';

const JoinForm = ({ join, errors }) => {
  const onJoin = (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const name = form.name.value;

    join({ email, password, name });
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100'>
      <h1 className='mb-5 text-4xl font-bold text-blue-900 bg-gray-100'>
        Join
      </h1>

      <form onSubmit={onJoin} className='w-64'>
        <div className='mb-3'>
          <input
            type='text'
            id='email'
            placeholder='이메일'
            name='email'
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email}</p>
          )}
        </div>

        <div className='mb-3'>
          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password}</p>
          )}
        </div>

        <div className='mb-3'>
          <input
            type='text'
            id='name'
            placeholder='이름'
            name='name'
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
        </div>

        <button
          type='submit'
          className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline'
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
