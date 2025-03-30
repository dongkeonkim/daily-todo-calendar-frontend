import React, { useState } from 'react';
import { FormErrors, JoinForm as JoinFormType } from '@/types';

interface JoinFormProps {
  join: (form: JoinFormType) => Promise<void>;
  errors: FormErrors;
}

/**
 * 회원가입 폼 컴포넌트
 */
const JoinForm: React.FC<JoinFormProps> = ({ join, errors }) => {
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
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100'>
      <h1 className='mb-5 text-4xl font-bold text-blue-900 bg-gray-100'>
        Join
      </h1>

      <form onSubmit={handleSubmit} className='w-64'>
        <div className='mb-3'>
          <input
            type='email'
            id='email'
            placeholder='이메일'
            name='email'
            value={formData.email}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email}</p>
          )}
        </div>

        <div className='mb-3'>
          <input
            type='password'
            id='password'
            placeholder='비밀번호'
            name='password'
            value={formData.password}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {errors.password && (
            <p className='text-sm text-red-500'>{errors.password}</p>
          )}
        </div>

        <div className='mb-3'>
          <input
            type='text'
            id='name'
            placeholder='이름'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='w-full px-3 py-2 mb-1 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          {errors.name && <p className='text-sm text-red-500'>{errors.name}</p>}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isSubmitting ? '처리 중...' : '회원가입'}
        </button>
      </form>
    </div>
  );
};

export default JoinForm;
