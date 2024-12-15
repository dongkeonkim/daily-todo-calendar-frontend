import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LoginContext from '@/contexts/LoginContextProvider';
import logoImage from '@/image/logo.webp';

const Header = () => {
  const { isLogin, logout } = useContext(LoginContext);

  const handleClick = (e) => {
    if (!isLogin) {
      e.preventDefault();
    }
  };

  return (
    <header className='flex items-center justify-between p-4 shadow'>
      <div>
        <a
          href='/'
          className='font-medium flex items-center space-x-2'
          onClick={handleClick}
        >
          <img src={logoImage} alt='' className='h-6 w-6 bg-black rounded' />
          <h1 className='text-black font-medium'>Todo Calendar</h1>
        </a>
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
