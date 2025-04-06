/**
 * API 에러 처리를 위한 유틸리티 함수
 */

import { AxiosError } from 'axios';
import { FormErrors } from '@/types';

/**
 * API 응답에서 에러 메시지를 추출하는 함수
 * @param error Axios 에러 객체
 * @param defaultMessage 기본 에러 메시지
 * @returns 에러 메시지
 */
export const getErrorMessage = (
  error: AxiosError<any> | any,
  defaultMessage = '요청 처리 중 오류가 발생했습니다.'
): string => {
  // 네트워크 오류 (서버에 연결할 수 없음)
  if (!error.response) {
    return '서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.';
  }

  // 백엔드에서 제공한 메시지가 있으면 사용
  const backendMessage = error.response?.data?.message;
  if (backendMessage && typeof backendMessage === 'string') {
    return backendMessage;
  }

  // HTTP 상태 코드에 따른 메시지
  const status = error.response?.status;
  if (status) {
    switch (status) {
      case 400:
        return '잘못된 요청입니다. 입력 값을 확인해주세요.';
      case 401:
        return '로그인이 필요하거나 인증 정보가 유효하지 않습니다.';
      case 403:
        return '접근 권한이 없습니다.';
      case 404:
        return '요청한 리소스를 찾을 수 없습니다.';
      case 409:
        return '요청이 현재 상태와 충돌합니다.';
      case 500:
        return '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    }
  }

  // 기본 메시지 반환
  return defaultMessage;
};

/**
 * API 응답에서 폼 필드별 에러를 추출하는 함수
 * @param error Axios 에러 객체
 * @returns 필드별 에러 객체
 */
export const getFieldErrors = (error: AxiosError<any> | any): FormErrors => {
  if (error.response?.data?.result && typeof error.response.data.result === 'object') {
    return error.response.data.result;
  }
  
  // 백엔드에서 필드 에러를 다른 형식으로 제공하는 경우 대비
  if (error.response?.data?.errors && typeof error.response.data.errors === 'object') {
    return error.response.data.errors;
  }
  
  return {};
};
