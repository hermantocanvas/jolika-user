import React, { useState, useContext, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import AuthContext from '../../context/auth/authContext';
import Loader from 'react-loader-spinner';

const ProcessResetPassword = ({ match }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, currentUser, lastProductPage } = authContext;
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [verifiedToken, setVerifiedToken] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [loadSpinner, setLoadSpinner] = useState(false);

  const [user, setUser] = useState({
    password: '',
    password2: '',
  });
  const { password, password2 } = user;

  useEffect(() => {
    //check incoming token if valid or not..
    checkToken();
    //eslint-disable-next-line
  }, []);

  async function checkToken() {
    try {
      await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auth/verifyresettoken/${match.params.token}`
      );

      setVerifiedToken(true);
    } catch (err) {
      setVerifiedToken(false);
    }
  }

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === '' || password2 === '') {
      setAlert('Please fill in the password field.', 'danger');
    } else if (password !== password2) {
      setAlert('Password does not match password confirmation.', 'danger');
    } else {
      resetPassword();
    }

    async function resetPassword() {
      setLoadSpinner(true);

      let formData = new FormData();
      formData.append('password', password);

      try {
        await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/auth/resetpassword/${match.params.token}`,
          formData
        );

        setLoadSpinner(false);
        setPasswordChanged(true);

        setAlert(
          'Password changed successfully. Please login to continue.',
          'success'
        );

        return <Redirect to='/login' />;
      } catch (err) {
        setLoadSpinner(false);
        if (err.response) {
          setAlert(err.response.data, 'danger');
        }
      }
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    if (currentUser.role === 'user') {
      if (lastProductPage === null) {
        return <Redirect to='/' />;
      } else {
        return <Redirect to={lastProductPage} />;
      }
    } else if (currentUser.role === 'admin') {
      return <Redirect to='/admin/dashboard' />;
    }
  }

  if (match.params.token && verifiedToken === true) {
    return (
      <section className='page-section color'>
        <Helmet>
          <title>Reset Password</title>
          <meta
            name='description'
            content={`Reset Password.`}
          />
        </Helmet>
        <div className="container loginRegister" style={{ maxWidth: '550px', paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className='row'>
            <div className='col-sm-6 col-sm-offset-3'>
              <h3 className="sectionTitleacc">RESET PASSWORD</h3>
              {(() => {
                if (passwordChanged === false) {
                  return (
                    <form onSubmit={onSubmit} className='form-login'>
                      <div className='row'>
                        <div className="formLogin">
                          <input
                            type='password'
                            name='password'
                            placeholder='New Password'
                            value={password}
                            onChange={onChange}
                            required
                            minLength='8'
                          />
                        </div>
                        <div className="formLogin">
                          <input
                            type='password'
                            name='password2'
                            placeholder='Confirm New Password'
                            value={password2}
                            onChange={onChange}
                            required
                            minLength='8'
                          />
                        </div>
                        {(() => {
                          if (loadSpinner) {
                            return (
                              <div
                                className='col-md-12'
                                style={{ textAlign: 'center' }}
                              >
                                <Loader
                                  type='ThreeDots'
                                  color='green'
                                  height={100}
                                  width={100}
                                />
                                <p>Please wait, changing...</p>
                              </div>
                            );
                          } else {
                            return (
                              <div className='col-md-6'>
                                <input
                                  type='submit'
                                  value='Reset Password'
                                  className='btn btn-theme btn-block btn-theme-dark'
                                />
                              </div>
                            );
                          }
                        })()}
                      </div>
                    </form>
                  );
                } else {
                  return (
                    <p style={{ textAlign: 'center' }}>
                      Click <Link to='/login'>LOGIN</Link> to continue.
                    </p>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className='page-section color'>
        <Helmet>
          <title>Reset Password</title>
          <meta
            name='description'
            content={`Reset Password.`}
          />
        </Helmet>
        <div className="container loginRegister" style={{ maxWidth: '550px', paddingTop: '4rem', paddingBottom: '4rem' }}>
          <div className='row'>
            <div className='col-sm-6 col-sm-offset-3'>
              <h3 className="sectionTitleacc">RESET PASSWORD</h3>
              <p style={{ textAlign: 'center' }}>Email link not valid or expired.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }
};

export default ProcessResetPassword;
