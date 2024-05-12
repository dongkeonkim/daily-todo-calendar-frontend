import React, { useContext } from 'react';

import * as auth from '../../apis/auth';
import { LoginContext } from '../../contexts/LoginContextProvider';

const UserPasswordUpdateForm = (props) => {
  const { userInfo } = props.data;
  const { isLogin, logout } = useContext(LoginContext);

  const updateUser = async (form) => {
    let response;
    let data;

    console.log(form);

    try {
      response = await auth.update(form);

      alert('수정되었습니다.');
      logout();
    } catch (error) {
      alert(error.response.data);
    }
  };

  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const againPassword = form.againPassword.value;

    if (againPassword !== newPassword) {
      alert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    //TODO: 제한 길이, 비밀번호 형식 추가

    updateUser({ currentPassword, newPassword });
  };

  return (
    <>
      <div>
        <h1 className='bg-green-200'>비밀번호 변경</h1>
      </div>
      <div className='flex'>
        <form onSubmit={(e) => onUpdate(e)}>
          <span>{userInfo.email}</span>

          <div>
            <input
              type='password'
              id='currentPassword'
              placeholder='현재 비밀번호'
              name='currentPassword'
              required
            />
          </div>

          <div>
            <input
              type='password'
              id='newPassword'
              placeholder='새 비밀번호'
              name='newPassword'
              required
            />
          </div>

          <div>
            <input
              type='password'
              id='againPassword'
              placeholder='새 비밀번호 확인'
              name='againPassword'
              required
            />
          </div>

          <div>
            <div>
              <button type='submit' className='bg-blue-500 text-white'>
                확인
              </button>
            </div>
            <div>
              <button>취소</button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserPasswordUpdateForm;
