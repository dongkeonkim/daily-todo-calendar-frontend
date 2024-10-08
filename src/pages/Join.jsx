import React from 'react';
import JoinForm from '../components/Join/JoinForm';
import * as auth from '../apis/auth';
import { useNavigate } from 'react-router-dom';

const Join = () => {
  const navigate = useNavigate();

  const join = async (form) => {
    let response;
    let data;

    try {
      response = await auth.join(form);
      alert('회원가입이 성공하였습니다');
    } catch (error) {
      alert(error.response.data);
      return;
    }

    data = response.data;
    const status = response.status;
    if (status === 200) {
      navigate('/login');
    } else {
      alert('실패');
    }
  };

  return (
    <>
      <div>
        <JoinForm join={join} />
      </div>
    </>
  );
};

export default Join;
