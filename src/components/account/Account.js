import React from "react";
import AccountMenu from "./AccountMenu";
import Dashboard from "./Dashboard";
import Products from "./products/Products";
import AddProduct from "./products/AddProduct";
import BuyerSetting from "./setting/BuyerSetting";
import SellerSetting from "./setting/SellerSetting";
import BuyerOrders from "./orders/BuyerOrders";
import SellerOrders from "./orders/SellerOrders";
import Rating from "./Rating";
import TransactionDiscussion from "./TransactionDiscusion";
import ProductDiscussion from "./ProductDiscussion";
import ChangePassword from "../ChangePassword";
import UpgradeToSeller from "./UpgradeToSeller";

const Account = ({ match, location }) => {
  let accountPage;

  switch (match.params.accountPage) {
    case "dashboard":
      accountPage = <Dashboard />;
      break;
    case "produk":
      accountPage = <Products />;
      break;
    case "buat-produk":
      accountPage = <AddProduct />;
      break;
    case "pengaturan-beli":
      accountPage = <BuyerSetting />;
      break;
    case "pengaturan-jual":
      accountPage = <SellerSetting />;
      break;
    case "pembelian":
      accountPage = <BuyerOrders />;
      break;
    case "penjualan":
      accountPage = <SellerOrders />;
      break;
    case "rating":
      accountPage = <Rating />;
      break;
    case "diskusi-transaksi":
      accountPage = <TransactionDiscussion />;
      break;
    case "diskusi-produk":
      accountPage = <ProductDiscussion />;
      break;
    case "ganti-password":
      accountPage = <ChangePassword />;
      break;
    case "upgrade-ke-seller":
      accountPage = <UpgradeToSeller />;
      break;
    default:
      accountPage = <Dashboard />;
      break;
  }

  return (
    <section className="page-section">
      <div className="wrap container">
        <div className="row">
          <AccountMenu />
          <div className="col-lg-9 col-md-9 col-sm-8">{accountPage}</div>
        </div>
      </div>
    </section>
  );
};

export default Account;
