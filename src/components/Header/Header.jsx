import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const Header = () => {
  const { isLogin, login, logout } = useContext(LoginContext);
  return (
    <header>
      <div className='logo'>
        <Link to='/'>로고</Link>
      </div>

      <div>
        <h1 className='text-blue-500 text-xl font-bold'>Hello, React!</h1>
      </div>
      <div className='util'>
        {!isLogin ? (
          <ul>
            <li>
              <Link to='/login'>로그인</Link>
            </li>
            <li>
              <Link to='/join'>회원가입</Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link to='/user'>마이페이지</Link>
            </li>
            <li>
              <button className='link' onClick={() => logout()}>
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
