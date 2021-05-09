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
      setAlert(error, "danger");
      clearErrors();
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
      setAlert("Please provide all fields", "danger");
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
    <>
      <Helmet>
        <title>Login Jolika</title>
        <meta name="description" content={`Login to Jolika`} />
      </Helmet>
      <form onSubmit={onSubmit}>
        <div id="layoutSign">
          <div id="bgImage" className="bg-login" style={{ background: 'url("https://www.canvaswebdesign.com/jolika/uploads/product5.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
          <div id="loginCard">
            <div className="container">
              <h2 className="sectionTitleacc">WELCOME TO JOLIKA</h2>
              <h3 className="sectionTitleacc">LOGIN</h3>
              <div className="formLogin">
                <input required type="email" name="email" value={email} placeholder="Email Address" onChange={onChange} />
              </div>
              <div className="formLogin">
                <input required type="password" name="password" value={password} placeholder="Password" onChange={onChange} />
              </div>
              <div className="checkbox">
                {/* <div id="remember">
                <input type="checkbox" name="check" /> Remember Me
              </div> */}
                <div className="forgot">
                  <Link to="/reset-password">
                    <p>Forgot Password ?</p>
                  </Link>
                </div>
              </div>
              <div className="loginButton">
                <button className="btn-block" type="submit" name="submit">LOGIN</button>
              </div>
              <div className="divide">
                <div className="line">
                  <span></span>
                </div>
                <div className="text-line">
                  <span>OR LOGIN WITH</span>
                </div>
                <div className="line">
                  <span></span>
                </div>
              </div>
              <div className="sosmedButton">
                <div className="fbButton">
                  <a href="#"><i className="fa fa-facebook-f"></i>  Facebook</a>
                </div>
                <div className="googleButton">
                  <a href="#"><i className="fa fa-google"></i>  Google</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Login;
