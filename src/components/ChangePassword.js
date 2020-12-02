import React, { useState, useContext, Fragment } from "react";
import AlertContext from "../context/alert/alertContext";
import axios from "axios";

const ChangePassword = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const { oldPassword, newPassword, confirmNewPassword } = passwords;

  const onChange = (e) =>
    setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (oldPassword === "" || newPassword === "" || confirmNewPassword === "") {
      setAlert("Mohon mengisi semua field", "danger");
    } else if (newPassword !== confirmNewPassword) {
      setAlert(
        "Password baru tidak cocok dengan konfirmasi password",
        "danger"
      );
    } else {
      changePassword();
    }

    async function changePassword() {
      let formData = new FormData();
      formData.append("currentPassword", oldPassword);
      formData.append("newPassword", newPassword);

      try {
        await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/auth/updatepassword`,
          formData
        );

        setAlert("Password berhasil dirubah.", "success");

        setPasswords({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } catch (err) {
        if (err.response) {
          setAlert(err.response.data.error, "danger");
        }
      }
    }
  };

  return (
    <Fragment>
      <h3>Ganti Password</h3>
      <hr />
      <div className="details-wrap">
        <form onSubmit={onSubmit} className="form-login">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="oldPassword" className="form_label">
                      Password Lama
                    </label>
                    <input
                      type="password"
                      name="oldPassword"
                      id="oldPassword"
                      placeholder="Isi password lama"
                      required
                      value={oldPassword}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword" className="form_label">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      id="newPassword"
                      placeholder="Isi password baru"
                      required
                      value={newPassword}
                      onChange={onChange}
                    />
                    <small className="form-text text-muted">
                      Password minimal 8 karakter
                    </small>
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmNewPassword" className="form_label">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      name="confirmNewPassword"
                      id="confirmNewPassword"
                      placeholder="Ketik ulang password baru"
                      required
                      value={confirmNewPassword}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <button type="submit" className="my_button">
                GANTI PASSWORD <i className="fa fa-key"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default ChangePassword;
