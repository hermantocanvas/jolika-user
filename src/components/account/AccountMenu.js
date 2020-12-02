import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const AccountMenu = () => {
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;
  const [currentMembership, setCurrentMembership] = useState(null);
  const [accountMenuOn, setAccountMenuOn] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setCurrentMembership(
        currentUser.sellerInfo.membershipDetails.find(
          (m) => m._id === currentUser.sellerInfo.membershipId
        )
      );
    } else {
      setCurrentMembership(null);
    }
  }, [currentUser]);

  useEffect(() => {
    if (accountMenuOn) {
      if (window.innerWidth <= 576) {
        document.querySelector("#accountChooseMenu").style.display = "block";
      }
    } else {
      if (window.innerWidth <= 576) {
        document.querySelector("#accountChooseMenu").style.display = "none";
      }
    }
  }, [accountMenuOn]);

  return (
    <div className="col-lg-3 col-md-3 col-sm-4">
      <div className="user_left">
        <div className="widget account-details">
          <div className="user_prof_left">
            {(() => {
              if (currentUser) {
                return (
                  <>
                    <i className="fa fa-user-circle"></i>{" "}
                    <span>{currentUser.username}</span>
                    <br />
                    <span style={{ textTransform: "capitalize" }}>
                      {" "}
                      {currentUser.role}{" "}
                      {currentUser.role === "seller" &&
                        (currentMembership
                          ? `(${currentMembership.name})`
                          : "(Free)")}
                    </span>{" "}
                    <br />
                    <span style={{ fontSize: "0.9rem" }}>
                      OkeToken: <strong>{currentUser.currentToken}</strong>{" "}
                      <Link
                        to="/akun/oketoken"
                        style={{
                          margin: "0",
                          display: "inline",
                          color: "#ff4866",
                        }}
                      >
                        <strong>Tambah</strong>
                      </Link>
                    </span>
                  </>
                );
              } else {
                return (
                  <>
                    <i className="fa fa-user-circle"></i>{" "}
                    <span>Welcome User</span>
                  </>
                );
              }
            })()}
            {/* <Link to="/logout">Logout</Link> */}
          </div>

          <div
            id="accountMenuFilter"
            className="browse_filter margin_bottom show_mob"
          >
            <Link
              className="my_button full_rounded bordered gray_button btn_full"
              onClick={() => {
                setAccountMenuOn(!accountMenuOn);
              }}
            >
              <i className="fa fa-cog"></i> Account Menu
            </Link>
          </div>

          <div
            id="accountChooseMenu"
            onClick={() => setAccountMenuOn(!accountMenuOn)}
          >
            <ul>
              <li>
                <Link to="/akun/dashboard">
                  <i className="fa fa-home"></i> Beranda
                </Link>
              </li>
              <li>
                <Link to="/akun/oketoken">
                  <i className="fas fa-coins"></i> OkeToken
                </Link>
              </li>
              <li>
                <Link to="/akun/diskusi-transaksi">
                  <i className="fa fa-comment"></i> Diskusi Transaksi
                </Link>
              </li>
              <li>
                <Link to="/akun/rating">
                  <i className="fa fa-star"></i> Ulasan Saya
                </Link>
              </li>
              <li>
                <Link to="/akun/ganti-password">
                  <i className="fa fa-key"></i> Ganti Password
                </Link>
              </li>
            </ul>

            <div className="widget account-details">
              <h2>Beli</h2>
              <ul>
                <li>
                  <Link to="/akun/pengaturan-beli">
                    <i className="fa fa-cog"></i> Setting Pembelian
                  </Link>
                </li>
                <li>
                  <Link to="/akun/lelang">
                    <i className="fa fa-gavel"></i> Daftar Lelang (Bid)
                  </Link>
                </li>
                <li>
                  <Link to="/akun/pembelian">
                    <i className="fa fa-shopping-cart"></i> Transaksi Beli
                  </Link>
                </li>
              </ul>
            </div>

            <div className="widget account-details">
              <h2>Jual</h2>
              <ul>
                {(() => {
                  if (currentUser && currentUser.role === "seller") {
                    return (
                      <>
                        <li>
                          <Link to="/akun/pengaturan-jual">
                            <i className="fa fa-cog"></i> Setting Penjualan
                          </Link>
                        </li>
                        <li>
                          <Link to="/akun/produk">
                            <i className="fa fa-th-large"></i> Daftar Produk
                          </Link>
                        </li>
                        {(() => {
                          if (currentUser.sellerInfo.membershipId) {
                            return (
                              <li>
                                <Link to="/akun/lelang-jual">
                                  <i className="fa fa-gavel"></i> Daftar Lelang
                                  (Jual)
                                </Link>
                              </li>
                            );
                          }
                        })()}
                        <li>
                          <Link to="/akun/penjualan">
                            <i className="fa fa-shopping-cart"></i> Transaksi
                            Jual
                          </Link>
                        </li>
                      </>
                    );
                  }
                })()}
                <li>
                  <Link to="/akun/upgrade-ke-seller">
                    {(() => {
                      if (currentUser && currentUser.role === "seller") {
                        return (
                          <>
                            <i className="fa fa-id-card"></i>&nbsp;Data Penjual
                          </>
                        );
                      } else {
                        return (
                          <>
                            <i className="fa fa-level-up"></i>&nbsp;Daftar
                            Menjadi Penjual
                          </>
                        );
                      }
                    })()}
                  </Link>
                </li>
                {(() => {
                  if (currentUser && currentUser.role === "seller") {
                    return (
                      <li>
                        <Link to="/akun/membership-upgrade">
                          <i className="fa fa-arrow-up"></i> Membership Upgrade
                        </Link>
                      </li>
                    );
                  }
                })()}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;
