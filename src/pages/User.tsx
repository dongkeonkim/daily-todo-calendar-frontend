import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as auth from '@/apis/auth';
import api from '@/apis/api';
import { LoginContext } from '@/contexts/LoginContextProvider';
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
    <div className='flex justify-center items-center w-full h-full'>
      <div className='flex flex-col w-full max-w-md h-full mt-16 text-base font-normal leading-normal text-gray-800 px-4'>
        <div className='p-4 flex flex-col text-sm items-center text-gray-600'>
          <div className='text-7xl'>👤</div>
          <label>{userInfo.email}</label>
          {isKakaoUser && (
            <span className='mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full'>
              카카오 계정
            </span>
          )}
        </div>

        <div className='mb-2'>
          <input
            className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
            <div className='mb-2'>
              <input
                className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                type='password'
                id='password'
                placeholder='비밀번호'
                name='password'
                maxLength={30}
                onChange={handleChange}
                required
              />
            </div>
            <div className='mb-2'>
              <input
                className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                type='password'
                id='newPassword'
                placeholder='새 비밀번호'
                maxLength={30}
                onChange={handleChange}
                name='newPassword'
              />
            </div>
            <div className='mb-2'>
              <input
                className='w-full px-4 py-2 border border-gray-300 rounded placeholder-gray-400 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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

        <div className='flex justify-center mt-2'>
          <button
            className='bg-blue-500 text-white py-2 text-sm px-4 rounded hover:bg-blue-600 mr-1 transition-colors'
            onClick={handleUpdate}
          >
            {isKakaoUser ? '닉네임만 변경' : '정보 변경'}
          </button>
          <button
            className='bg-gray-300 text-gray-800 text-sm py-2 px-4 rounded hover:bg-gray-400 transition-colors'
            onClick={() => navigate('/')}
          >
            취소
          </button>
        </div>
        <div className='flex justify-end text-xs text-gray-500 mt-4'>
          <button
            onClick={handleDelete}
            className='hover:text-red-500 transition-colors'
          >
            {isKakaoUser ? '카카오 연결 해제 및 탈퇴' : '회원탈퇴'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default User;
