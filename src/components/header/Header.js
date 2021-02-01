import React from "react";
import { Link } from "react-router-dom";

import TopNav from "./TopNav";
import Search from "./Search";
import LocationMenu from "./LocationMenu";
import LocationMenuMobile from "./LocationMenuMobile";

const Header = () => {
  return (
    <section id="main-nav">
      <div id="top-nav">
        <div className="container">
          <div id="topNavLinks">
            <ul>
              <li id="topClock">
                <i className="fa fa-clock"></i> <span>8.30 - 18:00</span>
              </li>
              <li id="topCs">
                <i className="fa fa-phone"></i> <span>Customer Service</span>{" "}
                +62 21 1234 5678
              </li>
              <li id="topFaq">
                <Link to="/faq">
                  <i className="fa fa-question-circle"></i> <span>Faq</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container">
        <div id="center-nav">
          <Link to="#my-menu" id="mobileMenuIcon">
            <i className="fa fa-bars"></i>
          </Link>
          <Link to="/" id="logo">
            <img
              src={process.env.PUBLIC_URL + "/assets/img/logo.png"}
              alt="Jolika"
            />
          </Link>
          <LocationMenu />
          <Search />
          <div id="accountIcons">
            <Link to="/register" className="sign-up">
              Sign Up
            </Link>
            <span className="sign-up">|</span>
            <Link to="/login" className="sign-up">
              Login
            </Link>
            <div id="cart">
              <Link to="/cart">
                <i className="tiny material-icons">shopping_basket</i>
              </Link>
              <span id="cartQty">1</span>
            </div>
          </div>
          <LocationMenuMobile />
        </div>
      </div>
      <TopNav />
    </section>
  );
};

export default Header;
