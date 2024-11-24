import React, { useContext } from 'react';
import * as auth from '../../apis/auth';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';

const UserPasswordUpdateForm = (props) => {
  const { userInfo } = props.data;
  const { isLogin, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const updateUser = async (form) => {
    let response;
    let data;

    try {
      response = await auth.update(form);
      showAlert('비밀번호가 변경되었습니다.');
      logout();
    } catch (error) {
      showAlert(error.response.data);
    }
  };

  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const againPassword = form.againPassword.value;

    if (againPassword !== newPassword) {
      showAlert('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    updateUser({ currentPassword, newPassword });
  };

  const onCancel = () => {
    navigate('/user');
  };

  return (
    <>
      <div className='text-center my-5'>
        <h1 className='text-2xl font-bold p-3'>비밀번호 변경</h1>
      </div>
      <div className='flex justify-center'>
        <form onSubmit={(e) => onUpdate(e)} className='w-full max-w-xs'>
          <span className='block bg-gray-200 rounded p-3 mb-4'>
            {userInfo.email}
          </span>

          <div className='mb-4'>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              id='currentPassword'
              placeholder='현재 비밀번호'
              name='currentPassword'
              required
            />
          </div>

          <div className='mb-4'>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              id='newPassword'
              placeholder='새 비밀번호'
              name='newPassword'
              required
            />
          </div>

          <div className='mb-6'>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              id='againPassword'
              placeholder='새 비밀번호 확인'
              name='againPassword'
              required
            />
          </div>

          <div className='flex flex-col items-center justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 w-full focus:outline-none focus:shadow-outline mb-4'
              type='submit'
            >
              확인
            </button>
            <button
              className='font-bold py-1 px-4 w-full focus:outline-none focus:shadow-outline mb-4 border border-black'
              type='button'
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserPasswordUpdateForm;
