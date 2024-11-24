import React, { useContext } from 'react';
import * as auth from '../../apis/auth';
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../../contexts/AlertContext';

function UserLeaveForm(props) {
  const { userInfo } = props.data;
  const { isLogin, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const deleteUser = async (userInfo) => {
    let response;

    try {
      response = await auth.remove(userInfo);
      logout();
    } catch (error) {
      showAlert(error.response.data);
    }
  };

  const onDelete = (e) => {
    e.preventDefault();

    const form = e.target;
    userInfo.password = form.password.value;
    deleteUser(userInfo);
  };

  const onCancel = () => {
    navigate('/user');
  };

  return (
    <>
      <div className='text-center my-5'>
        <h1 className='text-2xl font-bold p-3'>회원 탈퇴</h1>
      </div>

      <div className='mb-5 px-5 flex flex-col justify-center text-center'>
        <span className='mb-2'>
          사용하고 계신 아이디({userInfo.email})는 탈퇴할 경우 재사용 및 복구가
          불가능합니다. 신중하게 선택하시기 바랍니다.
        </span>
        <div className='h-4'></div>
        <span>삭제하시겠다면, 비밀번호를 입력해주세요.</span>
      </div>

      <div className='flex justify-center'>
        <form onSubmit={(e) => onDelete(e)} className='w-full max-w-xs'>
          <span className='block bg-gray-200 rounded p-3 mb-4'>
            {userInfo.email}
          </span>

          <div className='mb-4'>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type='password'
              id='password'
              placeholder='비밀번호'
              name='password'
              required
            />
          </div>

          <div className='flex flex-col items-center justify-between'>
            <button
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 w-full focus:outline-none focus:shadow-outline mb-4'
              type='submit'
            >
              확인
            </button>
            <button
              className='font-bold py-1 px-4 w-full focus:outline-none focus:shadow-outline mb-4 border border-black'
              type='button'
              onClick={onCancel}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserLeaveForm;
