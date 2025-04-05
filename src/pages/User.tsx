import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as auth from '@/apis/auth';
import api from '@/apis/api';
import { LoginContext } from '@/contexts/LoginContextProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '@/contexts/AlertContext';
import { User as UserType } from '@/types';

interface UserFormData extends Partial<UserType> {
  password?: string;
  newPassword?: string;
  againPassword?: string;
}

/**
 * 사용자 프로필 페이지 컴포넌트
 */
const User: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserFormData | null>(null);
  const [isKakaoUser, setIsKakaoUser] = useState<boolean>(false);
  const { isLogin, logout } = useContext(LoginContext);
  const { darkMode } = useTheme();
  const { showAlert, showConfirmAlert, closeAlert } = useAlert();

  const navigate = useNavigate();

  // 사용자 정보 조회
  const getUserInfo = useCallback(async () => {
    if (!isLogin) {
      navigate('/login');
      return;
    }

    try {
      const response = await auth.info();
      const data = response.data.result;

      // 카카오 사용자 여부 확인 (kakaoId 필드가 있는지 확인)
      setIsKakaoUser(!!data.kakaoId);
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      navigate('/login');
    }
  }, [isLogin, navigate]);

  useEffect(() => {
    if (!isLogin) {
      return;
    }
    getUserInfo();
  }, [isLogin, getUserInfo]);

  if (!userInfo) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // 카카오 사용자가 아닌 경우에만 비밀번호 체크
    if (!isKakaoUser) {
      if (!userInfo?.password) {
        showAlert('비밀번호를 입력해주세요.');
        return;
      }

      if (userInfo.newPassword !== userInfo.againPassword) {
        showAlert('새 비밀번호가 일치하지 않습니다.');
        return;
      }
    }

    showConfirmAlert(
      '수정하시겠습니까?',
      async () => {
        try {
          // 카카오 사용자인 경우 업데이트 데이터에서 비밀번호 관련 필드 제외
          const updateData = isKakaoUser
            ? {
                id: userInfo?.id,
                email: userInfo?.email,
                name: userInfo?.name,
              }
            : userInfo;

          await api.put('/member/update', updateData);
          closeAlert();
          showAlert('수정되었습니다.');
        } catch (error: any) {
          closeAlert();
          showAlert(
            error.response?.data?.message ||
              '수정에 실패했습니다. 다시 시도해주세요.'
          );
        }
      },
      () => {
        closeAlert();
      }
    );
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();

    // 카카오 사용자인 경우 카카오 연결 해제 API 호출
    if (isKakaoUser) {
      showConfirmAlert(
        '카카오 계정 연결을 해제하고 탈퇴하시겠습니까?',
        async () => {
          try {
            await auth.unlinkKakao();
            logout();
            showAlert('탈퇴가 완료되었습니다.');
          } catch (error) {
            closeAlert();
            showAlert('탈퇴에 실패했습니다. 다시 시도해주세요.');
          }
        },
        () => {
          closeAlert();
        }
      );
      return;
    }

    // 일반 사용자인 경우 기존 탈퇴 로직 사용
    if (!userInfo.email || !userInfo.password) {
      showAlert('비밀번호를 입력해주세요.');
      return;
    }

    showConfirmAlert(
      '정말로 탈퇴하시겠습니까?',
      async () => {
        try {
          await auth.remove({
            email: userInfo.email || '',
            password: userInfo.password || '',
          });
          logout();
          showAlert('탈퇴가 완료되었습니다.');
        } catch (error) {
          closeAlert();
          showAlert('탈퇴에 실패했습니다. 다시 시도해주세요.');
        }
      },
      () => {
        closeAlert();
      }
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'} flex justify-center items-center w-full py-10`}>
      <div className={`flex flex-col w-full max-w-md text-base font-normal leading-normal ${darkMode ? 'text-gray-200' : 'text-gray-800'} p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border ${darkMode ? 'border-gray-700' : 'border-gray-200'} animate-fade-in`}>
        <div className={`flex flex-col text-sm items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-8`}>
          <div className='h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4'>
            <div className='text-5xl'>👤</div>
          </div>
          <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'} mb-1`}>{userInfo.name || '닉네임 미설정'}</h2>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>{userInfo.email}</p>
          {isKakaoUser && (
            <span className='px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full shadow-sm'>
              카카오 계정 연동됨
            </span>
          )}
        </div>
        <div className='space-y-5'>
        <div>
          <label htmlFor='name' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            닉네임
          </label>
          <input
            className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
            type='text'
            id='name'
            placeholder='닉네임'
            maxLength={10}
            value={userInfo.name || ''}
            onChange={handleChange}
            name='name'
            required
          />
        </div>

        {!isKakaoUser && (
          <>
            <div>
              <label htmlFor='password' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                현재 비밀번호
              </label>
              <input
                className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                type='password'
                id='password'
                placeholder='비밀번호'
                name='password'
                maxLength={30}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mt-5'>
              <label htmlFor='newPassword' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                새 비밀번호
              </label>
              <input
                className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                type='password'
                id='newPassword'
                placeholder='새 비밀번호'
                maxLength={30}
                onChange={handleChange}
                name='newPassword'
              />
            </div>
            <div className='mt-5'>
              <label htmlFor='againPassword' className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                새 비밀번호 확인
              </label>
              <input
                className={`w-full px-4 py-3 ${darkMode ? 'text-white bg-gray-700 border-gray-600' : 'text-gray-700 bg-gray-50 border-gray-300'} border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200`}
                type='password'
                id='againPassword'
                placeholder='새 비밀번호 확인'
                maxLength={30}
                onChange={handleChange}
                name='againPassword'
              />
            </div>
          </>
        )}

        <div className='flex flex-col space-y-3 mt-8'>
          <button
            className={`w-full px-6 py-3 font-medium text-white ${darkMode ? 'bg-primary-600 hover:bg-primary-700' : 'bg-primary-500 hover:bg-primary-600'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all duration-200 transform hover:translate-y-[-2px] hover:shadow-lg`}
            onClick={handleUpdate}
          >
            {isKakaoUser ? '닉네임 변경하기' : '정보 변경하기'}
          </button>
          <button
            className={`w-full px-6 py-3 font-medium ${darkMode ? 'text-gray-300 bg-gray-700 hover:bg-gray-600' : 'text-gray-700 bg-gray-200 hover:bg-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all duration-200`}
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </button>
        </div>
        
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} mt-6 pt-6 text-center`}>
          <button
            onClick={handleDelete}
            className={`text-sm ${darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-red-900' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'} transition-colors px-4 py-2 rounded-full`}
          >
            {isKakaoUser ? '카카오 연결 해제 및 탈퇴' : '회원탈퇴'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default User;
