import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import Cookies from 'js-cookie';

const api: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error) => {
    // 401 Unauthorized 오류 처리 - 토큰 만료/유효하지 않음
    if (error.response && error.response.status === 401) {
      const originalRequest = error.config;

      if (originalRequest.url !== '/auth/login') {
        // 로그인 요청이 아닌 경우에만 로그인 페이지로 이동
        window.location.href = '/login';
      }
    }
    
    // 500 Server Error 처리
    if (error.response && error.response.status >= 500) {
      console.error('서버 오류 발생:', error.response.data);
    }
    
    // 네트워크 오류 처리
    if (!error.response) {
      console.error('네트워크 오류 발생. 서버에 연결할 수 없습니다.');
    }
    
    return Promise.reject(error);
  }
);

export default api;
