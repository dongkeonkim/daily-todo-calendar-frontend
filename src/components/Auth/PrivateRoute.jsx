import React from 'react';
import Cookies from 'js-cookie';
import { Navigate } from 'react-router-dom';

const isTokenValid = (token) => {
  if (!token) return false;
  return true;
};

const PrivateRoute = ({ children }) => {
  const token = Cookies.get('accessToken');

  if (!token || !isTokenValid(token)) {
    return <Navigate to='/login' replace />;
  }

  return children;
};

export default PrivateRoute;
