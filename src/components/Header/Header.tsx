import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '@/contexts/LoginContextProvider';
import { useTheme } from '@/contexts/ThemeContext';
import logoImage from '@/image/logo.png';

/**
 * 애플리케이션 상단 헤더 컴포넌트
 * 로고 및 로그인/회원가입 또는 마이페이지/로그아웃 메뉴 표시
 */
const Header: React.FC = () => {
  const { isLogin, logout } = useContext(LoginContext);
  const { darkMode, toggleDarkMode } = useTheme();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLogin) {
      e.preventDefault();
    }
  };

  return (
    <header className='py-4 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-800 transition-colors duration-300'>
      <div className='container mx-auto px-4 flex justify-between items-center'>
        <div>
          <a
            href='/'
            className='font-medium flex items-center space-x-2'
            onClick={handleClick}
          >
            <div className='h-8 w-8 rounded-lg flex items-center justify-center'>
              <img src={logoImage} alt='로고' className='h-8 w-8' />
            </div>
            <h1 className='text-gray-800 dark:text-white font-semibold text-xl flex items-center'>
              TimeLine
            </h1>
          </a>
        </div>

        <div className='flex items-center space-x-4'>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {darkMode ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
              </svg>
            )}
          </button>

          {!isLogin ? (
            <div className='flex space-x-2'>
              <Link
                className='px-3 py-1.5 text-sm font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                to='/login'
              >
                로그인
              </Link>
              <Link
                className='px-3 py-1.5 text-sm font-medium rounded bg-primary-500 text-white hover:bg-primary-600 transition-colors'
                to='/join'
              >
                회원가입
              </Link>
            </div>
          ) : (
            <div className='flex space-x-2'>
              <Link
                className='px-3 py-1.5 text-sm font-medium rounded border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'
                to='/user'
              >
                마이페이지
              </Link>
              <button
                className='px-3 py-1.5 text-sm font-medium rounded bg-primary-500 text-white hover:bg-primary-600 transition-colors'
                onClick={() => logout()}
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
