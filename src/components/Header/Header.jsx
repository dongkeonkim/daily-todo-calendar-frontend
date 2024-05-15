import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {
  const { isLogin, logout } = useContext(LoginContext);
  return (
    <header className='flex justify-between bg-blue-500 p-4 shadow-md text-lg font-serif'>
      <div className='bg-blue-700 p-2 rounded'>
        <Link
          className='text-white font-bold transition-colors duration-200 hover:text-blue-500'
          to='/'
        >
          로고
        </Link>
      </div>
      <div className='bg-blue-200 p-2 rounded'>
        {!isLogin ? (
          <div>
            <ul className='flex space-x-4'>
              <li>
                <Link
                  className='text-black hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200 ease-in-out transform hover:scale-105'
                  to='/login'
                >
                  로그인
                </Link>
              </li>
              <li>
                <Link
                  className='text-black hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200 ease-in-out transform hover:scale-105'
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
                className='text-black hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200 ease-in-out transform hover:scale-105'
                to='/user'
              >
                마이페이지
              </Link>
            </li>
            <li>
              <Link
                className='text-black hover:text-white hover:bg-blue-700 p-2 rounded transition duration-200 ease-in-out transform hover:scale-105'
                onClick={() => logout()}
              >
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
