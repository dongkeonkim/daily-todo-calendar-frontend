import React from 'react';

const UserForm = ({ userInfo, updateUser, deleteUser }) => {
  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;

    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;

    updateUser({ currentPassword, newPassword });
  };

  return (
    <>
      <div className='flex'>
        <form onSubmit={(e) => onUpdate(e)}>
          <label>{userInfo.email}</label>

          <div>
            <input
              type='password'
              id='currentPassword'
              placeholder='기존 비밀번호를 입력해주세요'
              name='currentPassword'
              required
            />
          </div>

          <div>
            <input
              type='password'
              id='newPassword'
              placeholder='변경할 비밀번호를 입력해주세요'
              name='newPassword'
              required
            />
          </div>

          <div>
            <button type='submit' className='bg-yellow-500'>
              수정
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserForm;
