import api from './api';
import { AuthResponse, JoinForm, User } from '@/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface ApiResponse<T> {
  code: string;
  message: string;
  result: T;
  timestamp: string;
}

export const login = (email: string, password: string) =>
  api.post<ApiResponse<AuthResponse>>('/auth/login', {
    email,
    password,
  });

export const kakaoLogin = (code: string) =>
  api.get<ApiResponse<AuthResponse>>(`/auth/kakao/callback?code=${code}`);

export const info = () => api.get<ApiResponse<User>>(`/member/info`);

export const join = (data: JoinForm) =>
  api.post<ApiResponse<void>>('/auth/sign-up', data);

export const update = (data: Partial<User>) =>
  api.put<ApiResponse<void>>('/member/update', data);

export const remove = (data: { email: string; password: string }) =>
  api.put<ApiResponse<void>>('/member/delete', data);

export const unlinkKakao = () => api.post<ApiResponse<void>>('/member/unlink');
