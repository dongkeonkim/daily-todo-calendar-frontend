import React, { useContext, useEffect, useState } from 'react';
import UserForm from '../components/User/UserForm';

import * as auth from '../apis/auth';
import { LoginContext } from '../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';

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

  const updateUser = async (form) => {
    let response;
    let data;

    console.log(form);

    try {
      response = await auth.update(form);
    } catch (error) {
      console.error(`${error}`);
    }

    data = response.data;
    const status = response.status;
    console.log(data);
    console.log(status);

    if (status === 200) {
      alert('수정!');
      logout();
    } else {
      alert('실패');
    }
  };

  const deleteUser = async (userId) => {
    console.log(userId);

    let response;
    let data;
    try {
      response = await auth.remove(userId);
    } catch (error) {
      console.error(error);
    }

    data = response.data;
    const status = response.status;
    console.log(data);
    console.log(status);

    if (status === 200) {
      console.log('성공');
      logout();
    } else {
      console.log('실패');
    }
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

  return (
    <>
      <div className='container'>
        <h1 className='bg-green-200'>User</h1>
        <UserForm
          userInfo={userInfo}
          updateUser={updateUser}
          deleteUser={deleteUser}
        />
      </div>
    </>
  );
};

export default User;
