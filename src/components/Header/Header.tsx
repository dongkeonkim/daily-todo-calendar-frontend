import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '@/contexts/LoginContextProvider';
import logoImage from '@/image/logo.webp';

/**
 * 애플리케이션 상단 헤더 컴포넌트
 * 로고 및 로그인/회원가입 또는 마이페이지/로그아웃 메뉴 표시
 */
const Header: React.FC = () => {
  const { isLogin, logout } = useContext(LoginContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
          <img
            src={logoImage}
            alt='로고'
            className='h-6 w-6 bg-black rounded'
          />
          <h1 className='text-black font-medium'>Todo Calendar</h1>
        </a>
      </div>
      <div>
        {!isLogin ? (
          <div>
            <ul className='flex space-x-4'>
              <li>
                <Link
                  className='text-sm hover:text-blue-500 transition-colors'
                  to='/login'
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  className='text-sm hover:text-blue-500 transition-colors'
                  to='/join'
                >
                  회원가입
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <ul className='flex space-x-4'>
            <li>
              <Link
                className='text-sm hover:text-blue-500 transition-colors'
                to='/user'
              >
                마이페이지
              </Link>
            </li>
            <li>
              <button
                className='text-sm hover:text-blue-500 transition-colors'
                onClick={() => logout()}
              >
                로그아웃
              </button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};
export default Header;
