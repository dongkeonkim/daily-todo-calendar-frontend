import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/contexts/AlertContext';
import { useTheme } from '@/contexts/ThemeContext';
import * as auth from '@/apis/auth';
import JoinForm from '@/components/Join/JoinForm';
import { FormErrors, JoinForm as JoinFormType } from '@/types';

/**
 * 회원가입 페이지 컴포넌트
 */
const Join: React.FC = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { darkMode } = useTheme();
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
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <JoinForm join={join} errors={errors} />
    </div>
  );
};

export default Join;
