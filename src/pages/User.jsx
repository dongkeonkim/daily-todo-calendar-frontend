import React, { useContext, useEffect, useState } from 'react';

import * as auth from '@/apis/auth';
import api from '@/apis/api';
import { LoginContext } from '@/contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/contexts/AlertContext';

const User = () => {
  const [userInfo, setUserInfo] = useState();
  const { isLogin, logout } = useContext(LoginContext);
  const { showAlert, showConfirmAlert, closeAlert } = useAlert();

  const navigate = useNavigate();

  const getUserInfo = async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    const response = await auth.info();
    const data = response.data.result;

    setUserInfo(data);
  };

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    getUserInfo();
  }, [isLogin]);

  if (!userInfo) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userInfo.password) {
      showAlert('비밀번호를 입력해주세요.');
      return;
    }

    if (userInfo.newPassword !== userInfo.againPassword) {
      showAlert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    showConfirmAlert(
      '수정하시겠습니까?',
      async () => {
        try {
          await api.put('/member/update', userInfo);
          closeAlert();
          showAlert('수정되었습니다.');
        } catch (error) {
          closeAlert();
          showAlert('수정에 실패했습니다. 다시 시도해주세요.'); // 실패 메시지 표시
        }
      },
      () => {
        closeAlert();
      }
    );
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    showConfirmAlert(
      '정말로 탈퇴하시겠습니까?',
      async () => {
        try {
          await auth.remove(userInfo);
          logout();
        } catch (error) {
          closeAlert();
          showAlert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
      },
      () => {
        closeAlert();
      }
    );
  };

  return (
    <div className='flex justify-center items-center w-full h-screen'>
      <div className='flex flex-col w-1/4 h-full mt-16 text-base font-normal leading-normal text-gray-800'>
        <div className='p-4 flex flex-col text-sm items-center text-gray-600'>
          <div className='text-7xl'>👤</div>
          <label>{userInfo.email}</label>
        </div>

        <div className='mb-2'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm'
            type='text'
            id='name'
            placeholder='닉네임'
            maxLength={10}
            value={userInfo.name}
            onChange={handleChange}
            name='name'
            required
          />
        </div>
        <div className='mb-2'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm'
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            maxLength={30}
            onChange={handleChange}
            required
          />
        </div>
        <div className='mb-2'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm'
            type='password'
            id='newPassword'
            placeholder='새 비밀번호'
            maxLength={30}
            onChange={handleChange}
            name='newPassword'
          />
        </div>
        <div className='mb-2'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm'
            type='password'
            id='againPassword'
            placeholder='새 비밀번호 확인'
            maxLength={30}
            onChange={handleChange}
            name='againPassword'
          />
        </div>
        <div className='flex justify-center mt-2'>
          <button
            className='bg-blue-500 text-white py-2 text-sm px-4 rounded hover:bg-blue-600 mr-1'
            onClick={handleUpdate}
          >
            변경
          </button>
          <button
            className='bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded hover:bg-gray-400'
            onClick={() => navigate('/')}
          >
            취소
          </button>
        </div>
        <div className='flex justify-between text-xs text-gray-500 mt-4'>
          <button onClick={handleDelete}>회원탈퇴</button>
          {/* <button onClick={''}>비밀번호를 잊으셨습니까?</button> */}
        </div>
      </div>
    </div>
  );
};

export default User;
