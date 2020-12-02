import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import AlertContext from '../../context/alert/alertContext';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import AuthContext from '../../context/auth/authContext';
import Loader from 'react-loader-spinner';

const ResetPassword = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, currentUser, lastProductPage } = authContext;
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [email, setEmail] = useState('');
  const [loadSpinner, setLoadSpinner] = useState(false);

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === '') {
      setAlert('Mohon mengisi field email', 'danger');
    } else {
      resetPassword();
    }

    async function resetPassword() {
      setLoadSpinner(true);

      let formData = new FormData();
      formData.append('email', email.toLowerCase());

      try {
        await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/auth/forgotpassword`,
          formData
        );

        setLoadSpinner(false);

        setAlert(
          'Link verifikasi telah dikirim ke email Kamu. Klik link untuk reset password. Link berlaku untuk 10 menit.',
          'success'
        );
      } catch (err) {
        setLoadSpinner(false);
        if (err.response) {
          setAlert(err.response.data.error, 'danger');
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

  return (
    <section className='page-section color'>
      <Helmet>
        <title>Reset Password Lelang Online | Okebid</title>
        <meta name='description' content={`Reset Password Okebid.`} />
      </Helmet>
      <div className='container'>
        <div className='row'>
          <div className='col-sm-6 mx-auto'>
            <h3 className='block-title'>
              <span>Reset Password</span>
            </h3>
            <form onSubmit={onSubmit} className='form-login'>
              <div className='row'>
                <div className='col-md-12'>
                  <div className='form-group'>
                    <label htmlFor='email'>
                      Masukan email untuk reset password
                    </label>
                    <input
                      className='form-control'
                      type='email'
                      name='email'
                      value={email}
                      onChange={onChange}
                      placeholder='Masukan email'
                      required
                    />
                  </div>
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
                        <p>Mohon tunggu, mengirim email...</p>
                      </div>
                    );
                  } else {
                    return (
                      <div className='col-md-6'>
                        <input
                          type='submit'
                          value='Reset Password'
                          className='btn btn-primary btn-block'
                        />
                      </div>
                    );
                  }
                })()}
              </div>
            </form>
            <br />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
