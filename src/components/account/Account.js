import React from "react";
import AccountMenu from "./AccountMenu";
import Dashboard from "./Dashboard";
import ChangePassword from "../ChangePassword";
import Orders from "./orders/Orders";
import Address from './Address/Address';
import AddAddress from './Address/AddAddress';

const Account = ({ match }) => {
  let accountPage;

  switch (match.params.accountPage) {
    case "dashboard":
      accountPage = <Dashboard />;
      break;
    case "ganti-password":
      accountPage = <ChangePassword />;
      break;
    case "pembelian":
      accountPage = <Orders />;
      break;
    case "address":
      accountPage = <Address />;
      break;
    case "add-address":
      accountPage = <AddAddress />;
      break;
    default:
      accountPage = <Dashboard />;
      break;
  }

  return (
    <>
      <section className="page-section">
        <div className="wrap container">
          <div className="row" id="mainDashboard">
            <AccountMenu />
            <div className="backendPage">{accountPage}</div>
          </div>
        </div>
      </section>
      <br />
      <br />
    </>
  );
};

export default Account;