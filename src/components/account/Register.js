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
      if (error === "Request failed with status code 400") {
        setAlert(
          "Email atau Username sudah pernah terdaftar. Silahkan login atau gunakan email/username lain.",
          "danger"
        );
        clearErrors();
      } else if (error === "Request failed with status code 500") {
        setAlert(
          "Username tidak tersedia. Silahkan gunakan username lain.",
          "danger"
        );
      } else {
        setAlert(error, "danger");
        clearErrors();
      }
    }
    //eslint-disable-next-line
  }, [error]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
    username: "",
  });
  const { name, email, password, password2, username } = user;

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
    if (name === "" || email === "" || password === "" || username === "") {
      setAlert("Mohon mengisi semua field", "danger");
    } else if (document.getElementById("agreeToc").checked === false) {
      setAlert("Mohon menyetujui ketentuan layanan", "danger");
    } else if (password !== password2) {
      setAlert("Password tidak cocok dengan konfirmasi password", "danger");
    } else {
      register({
        name,
        email: email.toLowerCase(),
        password,
        username,
      });
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    return <Redirect to="/" />;
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
        <title>Daftar Okebid</title>
        <meta name="description" content={`Daftar dan Masuk Ke Okebid.`} />
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
                  textButton="Daftar dengan Facebook"
                  icon="fa-facebook"
                  isMobile={false}
                />
              </div> */}
              {/* <div className="col-xs-6">
                <GoogleLogin
                  clientId="66177611314-nif412qjqn4qq0ccl7bue40o5mk9jbc0.apps.googleusercontent.com"
                  buttonText="Daftar dengan Google"
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                />
              </div> */}
            </div>
            <br />
            <h3>Daftar Akun Baru</h3>
            <br />
            {(() => {
              if (registerDone === true) {
                return (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "20px",
                      background: "#4b89dc",
                      color: "white",
                    }}
                  >
                    <h2>Terima kasih sudah mendaftar.</h2>
                    <p>
                      Link verifikasi telah dikirim ke email Anda. Klik link di
                      dalam email untuk mengaktifkan akun.
                    </p>
                  </div>
                );
              } else {
                return (
                  <form onSubmit={onSubmit} className="form-login">
                    <div className="form-group">
                      <label htmlFor="name" className="form_label">
                        Nama Anda
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Isi nama Anda..."
                        required
                        value={name}
                        onChange={onChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form_label">
                        Email Anda
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Isi alamat E-mail..."
                        value={email}
                        onChange={onChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email" className="form_label">
                        Username Anda
                      </label>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={username}
                        onChange={onChange}
                        required
                        maxLength="20"
                      />
                      <small className="form-text text-muted">
                        Tulis username yang diinginkan (Maks 20 karakter)
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="password" className="form_label">
                        Password
                      </label>
                      <PasswordMask
                        id="password"
                        name="password"
                        placeholder="Isi password..."
                        value={password}
                        onChange={onChange}
                        buttonStyles={{ fontSize: "12px" }}
                        minLength="8"
                      />
                      <small className="form-text text-muted">
                        Password minimal 8 karakter
                      </small>
                    </div>
                    <div className="form-group">
                      <label htmlFor="passwor2" className="form_label">
                        Konfirmasi Password
                      </label>
                      <PasswordMask
                        name="password2"
                        placeholder="Tulis ulang password..."
                        value={password2}
                        onChange={onChange}
                        buttonStyles={{ fontSize: "12px" }}
                        minLength="8"
                      />
                    </div>
                    <div className="form-group">
                      <label className="container_cbx">
                        Saya telah membaca dan menyetujui{" "}
                        <Link to="/syarat-ketentuan" target="_blank">
                          Syarat dan Ketentuan Okebid.
                        </Link>
                        <input id="agreeToc" type="checkbox" />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <button type="submit" className="my_button">
                      DAFTAR <i className="fa fa-arrow-right"></i>
                    </button>
                  </form>
                );
              }
            })()}

            <br />
            <div className="row">
              <div className="col-md-12" style={{ textAlign: "center" }}>
                <p style={{ color: "black" }}>
                  Sudah punya akun? Silahkan <Link to="/login">LOGIN</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
