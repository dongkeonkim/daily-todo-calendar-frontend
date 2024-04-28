import React from 'react';
import Header from '../Header/Header';
import JoinForm from '../Join/JoinForm';
import * as auth from '../../apis/auth';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const navigate = useNavigate();

  const join = async (form) => {
    let response;
    let data;

    try {
      response = await auth.join(form);
    } catch (error) {
      console.error(`${error}`);
      return;
    }

    data = response.data;
    const status = response.status;
    if (status === 200) {
      alert('성공');
      navigate('/login');
    } else {
      alert('실패');
    }
  };

  return (
    <>
      <Header />
      <div className='container'>
        <JoinForm join={join} />
      </div>
    </>
  );
};

export default Join;
