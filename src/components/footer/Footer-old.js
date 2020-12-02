import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import FooterNav from "./FooterNav";

const Footer = ({ toggleCategory }) => {
  return (
    <Fragment>
      <div className="footer">
        <div className="wrapp">
          <div className="row">
            <div className="col-6 col-sm-3">
              <ul>
                <li>
                  <Link to="/">Tentang Kami</Link>
                </li>
                <li>
                  <Link to="/">Syarat Dan Ketentuan</Link>
                </li>
                <li>
                  <Link to="/">Kontak Kami</Link>
                </li>
                <li>
                  <Link to="/">Bantuan</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-sm-3">
              <ul>
                <li>
                  <Link to="/">Tentang Kami</Link>
                </li>
                <li>
                  <Link to="/">Syarat Dan Ketentuan</Link>
                </li>
                <li>
                  <Link to="/">Kontak Kami</Link>
                </li>
                <li>
                  <Link to="/">Bantuan</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-sm-3">
              <ul>
                <li>
                  <Link to="/">Kebijakan Privasi</Link>
                </li>
                <li>
                  <Link to="/">Cara Berjualan</Link>
                </li>
                <li>
                  <Link to="/">Beriklan</Link>
                </li>
                <li>
                  <Link to="/">Mendaftarkan Toko</Link>
                </li>
              </ul>
            </div>
            <div className="col-6 col-sm-3">
              <ul>
                <li>
                  <Link to="/">Menjadi Member</Link>
                </li>
                <li>
                  <Link to="/">Cara Berbelanja</Link>
                </li>
                <li>
                  <Link to="/">Pembayaran</Link>
                </li>
                <li>
                  <Link to="/">Pengiriman</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer_newsletter">
            <input type="text" placeholder="Newsletter Sign Up" />
            <button className="">
              Sign Up&nbsp;&nbsp;<i className="fa fa-paper-plane"></i>
            </button>
          </div>

          <div className="cc_img">
            <img src={`${process.env.PUBLIC_URL}/assets/img/credit-card.png`} />
          </div>
          <div className="footer_social">
            <ul>
              <li style={{ margin: "2px" }}>
                <Link to="/" target="_blank">
                  <i className="fa fa-facebook"></i>
                </Link>
              </li>
              <li style={{ margin: "2px" }}>
                <Link to="/" target="_blank">
                  <i className="fa fa-twitter"></i>
                </Link>
              </li>
              <li style={{ margin: "2px" }}>
                <Link to="/" target="_blank">
                  <i className="fa fa-youtube"></i>
                </Link>
              </li>
              <li style={{ margin: "2px" }}>
                <Link to="/" target="_blank">
                  <i className="fa fa-instagram"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <FooterNav toggleCategory={toggleCategory} />
    </Fragment>
  );
};

export default Footer;
