import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';
import logoImage from '../../image/logo.webp';

const Header = () => {
  const { isLogin, logout } = useContext(LoginContext);
  return (
    <header className='flex items-center justify-between p-4 shadow'>
      <div>
        <Link className='font-medium flex items-center space-x-3' to='/'>
          <img
            src={logoImage}
            alt=''
            className='h-10 w-10 bg-black rounded-lg'
          />

          <h1 className='text-black font-medium'>Todo Calendar</h1>
        </Link>
      </div>
      <div>
        {!isLogin ? (
          <div>
            <ul className='flex space-x-4'>
              <li>
                <Link className='text-sm' to='/login'>
                  로그인
                </Link>
              </li>
              <li>
                <Link className='text-sm' to='/join'>
                  회원가입
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <ul className='flex space-x-4'>
            <li>
              <Link className='text-sm' to='/user'>
                마이페이지
              </Link>
            </li>
            <li>
              <Link className='text-sm' onClick={() => logout()}>
                로그아웃
              </Link>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};
export default Header;
