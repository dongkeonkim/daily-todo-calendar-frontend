import React, { useContext, useState } from 'react';
import { LoginContext } from '@/contexts/LoginContextProvider';

/**
 * 로그인 폼 컴포넌트
 * 이메일과 비밀번호를 입력받아 로그인 처리
 */
const LoginForm: React.FC = () => {
  const { login } = useContext(LoginContext);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-gray-100'>
      <h1 className='mb-5 text-4xl font-bold text-blue-900 bg-gray-100'>
        Login
      </h1>

      <form onSubmit={handleLogin} className='w-64'>
        <input
          type='email'
          id='email'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <input
          type='password'
          id='password'
          placeholder='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className='w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500'
        />

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
