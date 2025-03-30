import React, { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * 토큰 유효성 검증
 * @param token JWT 토큰
 * @returns 유효 여부
 */
const isTokenValid = (token: string | undefined): boolean => {
  if (!token) return false;

  // 실제 구현에서는 토큰 만료 시간 체크 등의 로직을 추가할 수 있음
  return true;
};

/**
 * 인증이 필요한 라우트를 보호하는 컴포넌트
 * 유효한 토큰이 없으면 로그인 페이지로 리다이렉트
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = Cookies.get('accessToken');

  if (!token || !isTokenValid(token)) {
    return <Navigate to='/login' replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
