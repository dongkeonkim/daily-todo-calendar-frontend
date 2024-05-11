import React from 'react';
import LoginContext from '../contexts/LoginContextProvider';

export const Home = () => {
  return (
    <>
      <div className='bg-red-500'>
        <h1>Home</h1>
        <h2>메인 페이지</h2>
        <LoginContext />
      </div>
    </>
  );
};
export default Home;
