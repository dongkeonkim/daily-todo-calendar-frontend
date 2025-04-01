import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '@/contexts/LoginContextProvider';
import { useLoading } from '@/contexts/LoadingContext';

const KakaoCallback: React.FC = () => {
  const { kakaoLogin } = useContext(LoginContext);
  const { startLoading, finishLoading } = useLoading();
  const navigate = useNavigate();

  useEffect(() => {
    const processKakaoLogin = async () => {
      startLoading();
      try {
        const code = new URL(window.location.href).searchParams.get('code');

        if (code) {
          await kakaoLogin(code);
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('카카오 로그인 처리 중 오류:', error);
        navigate('/login', { replace: true });
      } finally {
        finishLoading();
      }
    };

    processKakaoLogin();
  }, [kakaoLogin, navigate, startLoading, finishLoading]);

  return (
    <div className='flex justify-center items-center h-screen'>
      카카오 로그인 처리 중...
    </div>
  );
};

export default KakaoCallback;
