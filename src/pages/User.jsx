import React, { useContext, useEffect, useState } from 'react';
import UserPasswordUpdateForm from '../components/User/UserPasswordUpdateForm';

import characterImage from '../image/character.jpeg';

import * as auth from '../apis/auth';
import { LoginContext } from '../contexts/LoginContextProvider';
import { Link, Route, useNavigate } from 'react-router-dom';

const User = () => {
  const [userInfo, setUserInfo] = useState();
  const { isLogin, logout } = useContext(LoginContext);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    const response = await auth.info();
    const data = response.data;

    console.log(data);

    setUserInfo(data);
  };

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    getUserInfo();
  }, [isLogin]);

  // userInfo가 없는 경우 렌더링하지 않음
  if (!userInfo) {
    return null;
  }

  console.log(userInfo);

  return (
    <>
      <div className='flex flex-col items-center mt-20 '>
        <div className='w-64'>
          <img
            className='w-64 h-64 rounded-full mx-auto shadow-lg'
            src={characterImage}
            alt='Profile'
          />
          <div className='text-center mt-4'>
            <h2 className='text-2xl font-semibold'>{userInfo.name}</h2>
            <p className='text-gray-600 text-lg'>{userInfo.email}</p>
          </div>
        </div>
        <div className='mt-8'>
          <Link
            to={'/user/changeMember'}
            state={{ data: userInfo }}
            className='inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 mr-2'
          >
            비밀번호 변경
          </Link>
          <Link
            to={'/user/leaveMember'}
            state={{ data: userInfo }}
            className='inline-block bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600'
          >
            회원 탈퇴
          </Link>
        </div>
      </div>
    </>
  );
};

export default User;
