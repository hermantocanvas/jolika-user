import React, { useContext } from 'react';
import AuthContext from '../../context/auth/authContext';
import { Redirect } from 'react-router-dom';

const Logout = () => {
  //initialize auth context
  const authContext = useContext(AuthContext);

  //destructuring
  const { logout, isAuthenticated } = authContext;

  //check if user is authenticated, if not, then redirect to  login
  if (!isAuthenticated) {
    return <Redirect to='/login' />;
  }

  //logout the user
  logout();

  return null;
};

export default Logout;
