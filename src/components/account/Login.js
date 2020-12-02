import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import { Helmet } from "react-helmet";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";

const Login = () => {
  const authContext = useContext(AuthContext);
  const {
    login,
    facebookLogin,
    googleLogin,
    error,
    clearErrors,
    isAuthenticated,
    currentUser,
    lastProductPage,
    facebookName,
    facebookEmail,
    googleName,
    googleEmail,
  } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  useEffect(() => {
    if (error) {
      if (error === "Request failed with status code 401") {
        setAlert("Email dan password tidak cocok", "danger");
        clearErrors();
      } else {
        setAlert(error, "danger");
        clearErrors();
      }
    }
    //eslint-disable-next-line
  }, [error]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const responseFacebook = async (res) => {
    facebookLogin({
      email: res.email,
      name: res.name,
    });
  };

  const responseGoogle = (res) => {
    if (res.profileObj) {
      googleLogin({
        email: res.profileObj.email,
        name: res.profileObj.name,
      });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setAlert("Mohon mengisi semua field", "danger");
    } else {
      login({
        email: email.toLowerCase(),
        password,
      });
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    if (lastProductPage === null) {
      return <Redirect to="/" />;
    } else {
      return <Redirect to={lastProductPage} />;
    }
  }

  //name and email variables from facebook login
  if (facebookName && facebookEmail) {
    return <Redirect to={`/daftar-sosmed/${facebookName}/${facebookEmail}`} />;
  }

  //name and email variables from google login
  if (googleName && googleEmail) {
    return <Redirect to={`/daftar-sosmed/${googleName}/${googleEmail}`} />;
  }

  return (
    <section className="page-section color">
      <Helmet>
        <title>Login Lelang Online | Okebid</title>
        <meta name="description" content={`Masuk dan Login Ke Okebid.`} />
      </Helmet>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 mx-auto">
            <div className="row">
              {/* <div className="col-xs-6 col-6">
                <FacebookLogin
                  appId="2696342840601130"
                  fields="name,email"
                  callback={responseFacebook}
                  textButton="Login dengan Facebook"
                  icon="fa-facebook"
                  isMobile={false}
                />
              </div> */}
              {/* <div className="col-xs-6 col-6">
                <GoogleLogin
                  clientId="66177611314-nif412qjqn4qq0ccl7bue40o5mk9jbc0.apps.googleusercontent.com"
                  buttonText="Login dengan Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </div> */}
            </div>
            <br />
            <h3>Login</h3>
            <br />
            <form onSubmit={onSubmit} className="form-login">
              <div className="form-group">
                <label htmlFor="email" className="form_label">
                  Email Anda
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={onChange}
                  placeholder="Masukan email..."
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form_label">
                  Password Anda
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukan password..."
                  value={password}
                  onChange={onChange}
                  required
                  minLength="6"
                />
              </div>
              <button type="submit" className="my_button">
                LOGIN <i className="fa fa-arrow-right"></i>
              </button>
              <br />
              <br />
              <Link to="/reset-password">Lupa Password ?</Link>
            </form>
            <br />
            <div className="row">
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <p style={{ color: "black" }}>
                  Belum punya akun? Silahkan <Link to="/daftar">DAFTAR</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
