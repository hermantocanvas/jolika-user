import React, { useState, useEffect, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import { Helmet } from "react-helmet";

const RegisterSosmed = ({ match }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const authContext = useContext(AuthContext);
  const {
    registerSosmed,
    error,
    clearErrors,
    isAuthenticated,
    currentUser,
  } = authContext;

  useEffect(() => {
    if (error) {
      if (error === "Request failed with status code 400") {
        setAlert(
          "Email atau username sudah pernah terdaftar. Silahkan login atau gunakan email/username lain.",
          "danger"
        );
        clearErrors();
      } else {
        setAlert(error, "danger");
        clearErrors();
      }
    }
    //eslint-disable-next-line
  }, [error]);

  const [user, setUser] = useState({
    name: match.params.name,
    email: match.params.email,
    password: "",
    password2: "",
    username: "",
  });
  const { name, email, password, password2, username } = user;

  const onChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    if (password === "" || username === "") {
      setAlert("Mohon mengisi semua field", "danger");
    } else if (document.getElementById("agreeToc").checked === false) {
      setAlert("Mohon menyetujui ketentuan layanan", "danger");
    } else if (password !== password2) {
      setAlert("Password tidak cocok dengan konfirmasi password", "danger");
    } else {
      registerSosmed({
        name,
        email,
        password,
        username,
      });
    }
  };

  //check if user is authenticated, if yes, then redirect to  homepage
  if (isAuthenticated && currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <section className="page-section color">
      <Helmet>
        <title>Daftar Lelang Online | Okebid</title>
        <meta
          name="description"
          content={`Daftar dan Masuk Ke Okebid. Lelang Online Aman dan Nyaman hanya di Okebid.`}
        />
      </Helmet>
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h3 className="block-title">
              <span>Daftar Akun Baru</span>
            </h3>
            <p>
              Hi {match.params.name}. Kamu belum memiliki akun di Okebid.
              Silahkan mengisi username dan password untuk menyelesaikan
              pendaftaran.
            </p>
            <form onSubmit={onSubmit} className="form-login">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="name"
                      placeholder="Nama Kamu"
                      required
                      value={name}
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="email"
                      name="email"
                      placeholder="Alamat E-mail"
                      value={email}
                      required
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="text"
                      name="username"
                      placeholder="Username"
                      value={username}
                      onChange={onChange}
                      required
                      maxLength="20"
                    />
                    <label style={{ color: "#bbb9b9" }}>
                      Tuliskan username yang diinginkan (Maks 20 karakter)
                    </label>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="password"
                      name="password"
                      placeholder="Password Okebid. Minimal 8 karakter"
                      value={password}
                      onChange={onChange}
                      required
                      minLength="8"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <input
                      className="form-control"
                      type="password"
                      name="password2"
                      placeholder="Konfirmasi Password Okebid"
                      value={password2}
                      onChange={onChange}
                      required
                      minLength="8"
                    />
                  </div>
                </div>
                <div className="col-md-12 col-lg-12">
                  <div className="checkbox">
                    <label>
                      <input id="agreeToc" type="checkbox" /> Saya telah membaca
                      dan menyetujui{" "}
                      <Link to="/syarat-ketentuan" target="_blank">
                        Syarat dan Ketentuan Okebid.
                      </Link>
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <input
                    type="submit"
                    value="Daftar"
                    className="btn btn-theme btn-block btn-theme-dark"
                  />
                </div>
              </div>
            </form>
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

export default RegisterSosmed;
