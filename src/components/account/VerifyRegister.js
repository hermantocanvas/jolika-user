import React, { useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";

import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";

const VerifyRegister = ({ match }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const authContext = useContext(AuthContext);
  const { verifyRegistration, registerSuccess } = authContext;

  useEffect(() => {
    verifyRegistration(match.params.token);
    //eslint-disable-next-line
  }, []);

  //check if user is authenticated, if yes, then redirect to  homepage
  if (registerSuccess) {
    setAlert(
      "Anda telah terdaftar. Silahkan login untuk melanjutkan.",
      "success"
    );
    return <Redirect to="/login" />;
  }

  return (
    <section className="page-section color">
      <div className="container">
        <div className="row">
          <div className="col-sm-6 col-sm-offset-3">
            <h3 className="block-title">
              <span>Verifikasi Pendaftaran</span>
            </h3>
            {registerSuccess ? (
              <p>Sedang melakukan verifikasi...</p>
            ) : (
              <p>Pendaftaran tidak berhasil.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyRegister;
