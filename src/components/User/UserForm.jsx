import React from 'react';

const UserForm = ({ userInfo, updateUser, deleteUser }) => {
  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const userId = form.username.value;
    const userPw = form.password.value;
    const name = form.name.value;

    updateUser({ userId, userPw, name });
  };

  return (
    <>
      <div className='form'>
        <h2 className='login-title'>user info</h2>
        <form className='login-form' onSubmit={(e) => onUpdate(e)}></form>
        <label htmlFor='name'>username</label>
        <input
          type='text'
          id='username'
          placeholder=''
          name=''
          autocomplete=''
          required
          defaultValue={userInfo?.userId}
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
        정보 수정
      </button>
      <button
        type='button'
        className='btn btn--form btn-login'
        onClick={() => deleteUser(userInfo.userId)}
      >
        회원 탈퇴
      </button>
    </>
  );
};

export default UserForm;
