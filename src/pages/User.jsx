import React, { useContext, useEffect, useState } from 'react';
import UserPasswordUpdateForm from '../components/User/UserPasswordUpdateForm';

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
      <div>
        <div>
          <span>image</span>
        </div>
        <div>
          <span>이름</span>
        </div>
        <div>
          <span>{userInfo.email}</span>
        </div>

        <div>
          <Link
            to={'/user/changeMember'}
            state={{
              data: userInfo,
            }}
          >
            비밀번호 변경
          </Link>
          <Link
            to={'/user/leaveMember'}
            state={{
              data: userInfo,
            }}
          >
            회원 탈퇴
          </Link>
        </div>
      </div>
    </>
  );
};

export default User;
