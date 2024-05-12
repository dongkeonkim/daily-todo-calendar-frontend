import React, { useContext } from 'react';
import * as auth from '../../apis/auth';
import { LoginContext } from '../../contexts/LoginContextProvider';

function UserLeaveForm(props) {
  const { userInfo } = props.data;
  const { isLogin, logout } = useContext(LoginContext);

  const deleteUser = async (userInfo) => {
    let response;
    let data;

    try {
      response = await auth.remove(userInfo);
    } catch (error) {
      console.error(error);
    }
    data = response.data;
    const status = response.status;
    console.log(data);
    console.log(status);
    if (status === 200) {
      console.log('성공');
      logout();
    } else {
      console.log('실패');
    }
  };

  const onDelete = (e) => {
    e.preventDefault();

    const form = e.target;
    userInfo.password = form.password.value;
    deleteUser(userInfo);
  };

  return (
    <>
      <div>
        <h1>회원 탈퇴</h1>
      </div>

      <div>
        <p>
          사용하고 계신 아이디({userInfo.email})는 탈퇴할 경우 재사용 및 복구가
          불가능합니다. 신중하게 선택하시기 바랍니다.
        </p>
        <p>삭제하시겠다면, 비밀번호를 입력해주세요.</p>
      </div>

      <div>
        <form onSubmit={(e) => onDelete(e)}>
          <div>
            <input
              type='password'
              id='password'
              placeholder='비밀번호'
              name='password'
              required
            />
          </div>

          <div>
            <button type='submit' className='bg-blue-500 text-white'>
              확인
            </button>
          </div>

          <div>
            <button>취소</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UserLeaveForm;
