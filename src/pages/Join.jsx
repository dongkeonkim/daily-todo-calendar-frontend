import React from 'react';
import JoinForm from '@/components/Join/JoinForm';
import * as auth from '@/apis/auth';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/contexts/AlertContext';

const Join = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const join = async (form) => {
    let response;
    let data;

    try {
      response = await auth.join(form);
      showAlert('회원가입이 성공하였습니다');
    } catch (error) {
      showAlert(error.response.data);
      return;
    }

    data = response.data;
    const status = response.status;
    if (status === 200) {
      navigate('/login');
    } else {
      showAlert('실패');
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
