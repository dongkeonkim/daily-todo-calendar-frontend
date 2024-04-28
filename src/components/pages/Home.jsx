import React from 'react';
import Header from '../Header/Header';
import LoginContext from '../../contexts/LoginContextConsumer';

export const Home = () => {
  return (
    <>
      <Header />
      <div className='container'>
        <h1>Home</h1>
        <hr />
        <h2>메인 페이지</h2>
        <LoginContext />
      </div>
    </>
  );
};
export default Home;
