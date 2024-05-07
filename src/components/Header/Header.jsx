import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {
  const { isLogin, logout } = useContext(LoginContext);
  return (
    <header className='flex justify-between bg-green-500'>
      <div className='bg-green-700 m-4'>
        <Link to='/'>로고</Link>
      </div>
      <div className='bg-green-200 m-4'>
        {!isLogin ? (
          <div>
            <ul className='flex'>
              <li>
                <Link to='/login'>로그인</Link>
              </li>
              <li>
                <Link to='/join'>회원가입</Link>
              </li>
            </ul>
          </div>
        ) : (
          <ul>
            <li>
              <Link to='/user'>마이페이지</Link>
            </li>
            <li>
              <button onClick={() => logout()}>로그아웃</button>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};
export default Header;
