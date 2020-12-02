import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import Cookies from 'js-cookie';

//the parameter here is a standard way to create private route component in react
const AdminRoute = ({ component: Component, ...rest }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, currentUser } = authContext;
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (
    isAuthenticated === true &&
    currentUser != null &&
    currentUser.role === 'admin'
  ) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else if (Cookies.get('token') && isLoggedIn) {
    return <Route {...rest} render={props => <Component {...props} />} />;
  } else {
    return <Route {...rest} render={() => <Redirect to='/login' />} />;
  }
};

export default AdminRoute;
