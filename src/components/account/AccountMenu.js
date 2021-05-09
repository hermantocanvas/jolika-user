import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth/authContext";

const AccountMenu = () => {
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  return (
    <div className="menuLeft">
      <div className="user_left">
        <div className="widget account-details">
          <div className="user_prof_left">
            {(() => {
              if (currentUser) {
                return (
                  <>
                    <span>{currentUser.name}</span>
                    <br />
                    <span style={{ textTransform: "capitalize" }}>
                      {" "}
                      Account Type: {currentUser.role}{" "}
                    </span>{" "}
                  </>
                );
              } else {
                return (
                  <>
                    <i className="fa fa-user-circle"></i>{" "}
                    <span>Welcome Member</span>
                  </>
                );
              }
            })()}
          </div>
          <hr />
          <div id="accountChooseMenu">
            <ul>
              <li>
                <Link to="/account/dashboard">
                  <i className="fa fa-home"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/account/pembelian">
                  <i className="fa fa-shopping-cart"></i> My Purchases
                </Link>
              </li>
              <li>
                <Link to="/account/address">
                  <i className="fa fa-truck"></i> Shipping Addresses
                </Link>
              </li>
              <li>
                <Link to="/account/ganti-password">
                  <i className="fa fa-key"></i> Change Password
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountMenu;

