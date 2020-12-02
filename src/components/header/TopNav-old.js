import React from "react";
import { Link } from "react-router-dom";

const TopNav = ({ toggleCategory }) => {
  return (
    <div className="top_nav">
      <nav>
        <ul className="nav-menu nav-center">
          {/* <li>
            <Link to='#'>
              <i className='fa fa-circle blinking'></i> Live Lelang
            </Link>
          </li> */}
          <li>
            <Link to="/browse/auction">
              {" "}
              <i className="fa fa-circle blinking"></i> Lelang Statik
            </Link>
          </li>
          <li>
            <Link to="/browse/marketplace">Marketplace</Link>
          </li>
          <li onClick={toggleCategory}>
            <Link to="#">
              Kategori Produk <i className="fa fa-angle-down"></i>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default TopNav;
