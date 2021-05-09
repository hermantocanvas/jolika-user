import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";
import { Helmet } from "react-helmet";
import axios from "axios";
import AuthContext from "../../context/auth/authContext";
import Loader from "react-loader-spinner";

const ResetPassword = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, currentUser, lastProductPage } = authContext;
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [email, setEmail] = useState("");
  const [loadSpinner, setLoadSpinner] = useState(false);

  const onChange = (e) => setEmail(e.target.value);

  const onSubmit = (e) => {
    e.preventDefault();
    if (email === "") {
      setAlert("Please complete email field.", "danger");
    } else {
      resetPassword();
    }

    async function resetPassword() {
      setLoadSpinner(true);

      let formData = new FormData();
      formData.append("email", email.toLowerCase());

      try {
        await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/auth/forgotpassword`,
          formData
        );
        setLoadSpinner(false);

        setAlert(
          "A verification link has been sent to your email. Click the link to reset the password. The link is valid for 10 minutes.",
          "success"
        );
      } catch (err) {
        setLoadSpinner(false);
        if (err.response) {
          setAlert(err.response.data, "danger");
        }
      }
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    if (currentUser.role === "user" || currentUser.role === "vendor") {
      if (lastProductPage === null) {
        return <Redirect to="/" />;
      } else {
        return <Redirect to={lastProductPage} />;
      }
    }
  }

  return (
    <section className="page-section color">
      <Helmet>
        <title>Reset Password</title>
        <meta name="description" content={`Reset Password.`} />
      </Helmet>
      <div className="container loginRegister" style={{ maxWidth: '550px', paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="innerContainer">
          <h3 className="sectionTitleacc">RESET PASSWORD</h3>
          <form onSubmit={onSubmit} className="form-login">
            <div className="row">
              <div className="col-md-12">
                <div className="form-contact">
                  <label htmlFor="email">
                    Enter Your email to reset the password
                  </label>
                  <div className="formLogin">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      value={email}
                      onChange={onChange}
                      placeholder="Email"
                      required
                    />
                  </div>
                </div>
              </div>
              {(() => {
                if (loadSpinner) {
                  return (
                    <div className="col-md-12" style={{ textAlign: "center" }}>
                      <Loader
                        type="ThreeDots"
                        color="green"
                        height={100}
                        width={100}
                      />
                      <p>Please wait, sending...</p>
                    </div>
                  );
                } else {
                  return (
                    <div className="col-md-6">
                      <input
                        type="submit"
                        value="Reset Password"
                        className="btn btn-primary btn-block"
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
    </section>
  );
};

export default ResetPassword;
