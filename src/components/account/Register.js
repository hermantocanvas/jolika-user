import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import { Helmet } from "react-helmet";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import PasswordMask from "react-password-mask";

const Register = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const authContext = useContext(AuthContext);
  const {
    register,
    facebookLogin,
    googleLogin,
    error,
    clearErrors,
    isAuthenticated,
    currentUser,
    facebookName,
    facebookEmail,
    googleName,
    googleEmail,
    registerDone,
  } = authContext;

  useEffect(() => {
    if (error) {
      setAlert(error, "danger");
      clearErrors();
    }
    //eslint-disable-next-line
  }, [error]);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    handphone: "",
    hpCountryCode: "+62",
    password: "",
    password2: "",
  });
  const { firstName, lastName, email, handphone, hpCountryCode, password, password2 } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  // const responseFacebook = async (res) => {
  //   facebookLogin({
  //     email: res.email,
  //     name: res.name,
  //   });
  // };

  // const responseGoogle = (res) => {
  //   if (res.profileObj) {
  //     googleLogin({
  //       email: res.profileObj.email,
  //       name: res.profileObj.name,
  //     });
  //   }
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    if (firstName === "" || lastName === "" || handphone === "" || email === "" || password === "" || password2 === "") {
      setAlert("Please provide all fields", "danger");
    } else if (password !== password2) {
      setAlert("Password is not the same with confirm password", "danger");
    } else {
      register({
        name: firstName + ' ' + lastName,
        handphone,
        hpCountryCode,
        email: email.toLowerCase(),
        password,
      });
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    return <Redirect to="/" />;
  }

  //name and email variables from facebook login
  // if (facebookName && facebookEmail) {
  //   return <Redirect to={`/daftar-sosmed/${facebookName}/${facebookEmail}`} />;
  // }

  //name and email variables from google login
  // if (googleName && googleEmail) {
  //   return <Redirect to={`/daftar-sosmed/${googleName}/${googleEmail}`} />;
  // }

  if (registerDone === true) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '330px' }}>
        <div
          style={{
            textAlign: "center",
            padding: "2rem",
            color: "white",
            background: '#55342b',
            width: '400px'
          }}
        >
          <h2 style={{ color: 'white' }}>Thank you for registering.</h2>
          <p>
            Verify link has been sent to your email. Click the link inside email to activate your account.
        </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Jolika Register</title>
        <meta name="description" content={`Register to Jolika`} />
      </Helmet>
      <form onSubmit={onSubmit}>
        <div id="layoutSign">
          <div id="bgImage" style={{ background: 'url("https://www.canvaswebdesign.com/jolika/uploads/product8.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}></div>
          <div id="Login">
            <div id="loginCard">
              <div className="container">
                <h2 className="sectionTitle">WELCOME TO JOLIKA</h2>
                <p>By creating an account you will be able to save your addresses and enjoy faster checkout.</p>
                <h3 className="sectionTitle">CREATE AN ACCOUNT</h3>
                <div className="divide">
                  <div className="line">
                    <span></span>
                  </div>
                  <div className="text-line">
                    <span>CONTINUE WITH</span>
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
                <div className="divide">
                  <div className="line">
                    <span></span>
                  </div>
                  <div className="text-line">
                    <span>OR</span>
                  </div>
                  <div className="line">
                    <span></span>
                  </div>
                </div>
                <div className="formLogin">
                  <div className="inputName">
                    <input required type="text" name="firstName" value={firstName} placeholder="First Name" onChange={onChange} />
                    <input required type="text" name="lastName" value={lastName} placeholder="Last Name" onChange={onChange} />
                  </div>
                </div>
                <div className="formLogin">
                  <input required type="email" name="email" value={email} placeholder="Email" onChange={onChange} />
                </div>
                <div className="formLogin">
                  <div className="Mobilelogin">
                    <select required name="hpCountryCode" value={hpCountryCode} onChange={onChange}>
                      <option value="+62">+62</option>
                    </select>
                    <input required type="number" name="handphone" value={handphone} placeholder="Mobile Phone" onChange={onChange} />
                  </div>
                </div>
                <div className="formLogin">
                  <input required type="password" value={password} name="password" minLength='8' placeholder="Password" onChange={onChange} />
                </div>
                <div className="formLogin">
                  <input required type="password" value={password2} name="password2" minLength='8' placeholder="Confirm Password" onChange={onChange} />
                </div>
                <div className="registerButton">
                  <button className="btn-block" type="submit" name="submit">REGISTER</button>
                </div>
                <p>Already have an account? <Link to="/login" style={{ color: '#eb9588' }}>Log in</Link></p>
                <p>By signing up you agree to Jolika's Terms of Service and Privacy Policy</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default Register;
