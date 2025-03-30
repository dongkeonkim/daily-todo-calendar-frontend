import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/contexts/AlertContext';
import * as auth from '@/apis/auth';
import JoinForm from '@/components/Join/JoinForm';
import { FormErrors, JoinForm as JoinFormType } from '@/types';

/**
 * 회원가입 페이지 컴포넌트
 */
const Join: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [errors, setErrors] = useState<FormErrors>({});

  const join = async (form: JoinFormType) => {
    try {
      await auth.join(form);
      showAlert('회원가입이 성공하였습니다');
      navigate('/login');
    } catch (error: any) {
      setErrors(error.response?.data?.result || {});
    }
  };

  return (
    <div>
      <JoinForm join={join} errors={errors} />
    </div>
  );
};

export default Join;
