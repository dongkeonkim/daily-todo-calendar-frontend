import React from 'react';
import { useLocation } from 'react-router-dom';

import UserLeaveForm from '../components/User/UserLeaveForm';

const UserLeave = () => {
  const location = useLocation();
  const data = { userInfo: location.state.data };

  return (
    <>
      <UserLeaveForm data={data} />
    </>
  );
};

export default UserLeave;
