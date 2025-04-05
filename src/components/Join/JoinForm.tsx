import React, { useState } from 'react';
import { FormErrors, JoinForm as JoinFormType } from '@/types';
import { useTheme } from '@/contexts/ThemeContext';

interface JoinFormProps {
  join: (form: JoinFormType) => Promise<void>;
  errors: FormErrors;
}

/**
 * 회원가입 폼 컴포넌트
 */
const JoinForm: React.FC<JoinFormProps> = ({ join, errors }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState<JoinFormType>({
    email: '',
    password: '',
    name: '',
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await join(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] ${darkMode ? 'bg-gray-900' : 'bg-white'} px-4`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-8 border animate-fade-in`}>
        <h1 className={`mb-8 text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          회원가입
          <div className='h-1 w-24 bg-primary-500 mx-auto mt-2'></div>
        </h1>

        <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <label htmlFor='email' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            이메일
          </label>
          <input
            type='email'
            id='email'
            placeholder='이메일 주소를 입력해주세요'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
          />
          {errors.email && (
            <p className='mt-1 text-sm text-red-500'>{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor='password' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            비밀번호
          </label>
          <input
            type='password'
            id='password'
            placeholder='비밀번호를 입력해주세요'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
          />
          {errors.password && (
            <p className='mt-1 text-sm text-red-500'>{errors.password}</p>
          )}
        </div>

        <div>
          <label htmlFor='name' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            이름
          </label>
          <input
            type='text'
            id='name'
            placeholder='이름을 입력해주세요'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
          />
          {errors.name && <p className='mt-1 text-sm text-red-500'>{errors.name}</p>}
        </div>

        <div className='pt-3'>
          <button
            type='submit'
            disabled={isSubmitting}
            className='w-full px-6 py-3 font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg'
          >
            {isSubmitting ? '처리 중...' : '회원가입 완료'}
          </button>
        </div>
        
        <div className='mt-8 text-center'>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            이미 계정이 있으신가요? <a href='/login' className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}>로그인</a>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default JoinForm;
