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
    } catch (error) {
      alert(error.response.data);
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
      <div>
        <JoinForm join={join} />
      </div>
    </>
  );
};

export default Join;
