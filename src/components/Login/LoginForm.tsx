import React, { useContext, useState, useEffect } from 'react';
import { LoginContext } from '@/contexts/LoginContextProvider';
import { useTheme } from '@/contexts/ThemeContext';
import KakaoLoginButton from './KakaoLoginbutton';

const LoginForm: React.FC = () => {
  const { login, kakaoLogin } = useContext(LoginContext);
  const { darkMode } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 카카오 로그인 리다이렉트 처리
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    if (code) {
      kakaoLogin(code);
    }
  }, [kakaoLogin]);

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

  const handleKakaoLogin = () => {
    const KAKAO_CLIENT_ID = process.env.REACT_APP_KAKAO_CLIENT_ID;
    const REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-64px)] ${darkMode ? 'bg-gray-900' : 'bg-white'} px-4`}>
      <div className={`w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-md p-8 border animate-fade-in`}>
        <h1 className={`mb-8 text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          로그인
          <div className='h-1 w-24 bg-primary-500 mx-auto mt-2'></div>
        </h1>

        <form onSubmit={handleLogin} className='space-y-6'>
        <input
          type='email'
          id='email'
          placeholder='이메일'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
        />

        <input
          type='password'
          id='password'
          placeholder='비밀번호'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
        />

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full px-6 py-3 font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg'
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </button>

        <div className='pt-4'>
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-300 dark:border-gray-700'></div>
            </div>
            <div className='relative flex justify-center text-sm'>
              <span className={`px-2 ${darkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-500 bg-white'}`}>또는</span>
            </div>
          </div>
        </div>
        
        <div className='mt-6'>
          <KakaoLoginButton onClick={handleKakaoLogin} />
        </div>
        
        <div className='mt-8 text-center'>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            계정이 없으신가요? <a href='/join' className={`font-medium ${darkMode ? 'text-primary-400 hover:text-primary-300' : 'text-primary-600 hover:text-primary-500'}`}>회원가입</a>
          </p>
        </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
