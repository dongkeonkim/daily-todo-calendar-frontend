import React from 'react';
import UserPasswordUpdateForm from '../components/User/UserPasswordUpdateForm';
import { useLocation } from 'react-router-dom';

function UserChange() {
  const location = useLocation();
  const data = { userInfo: location.state.data };

  return (
    <>
      <UserPasswordUpdateForm data={data} />
    </>
  );
}

export default UserChange;
