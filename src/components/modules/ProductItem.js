import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import ReactImageAppear from "react-image-appear";

import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
import WishlistContext from "../../context/wishlist/wishlistContext";

const ProductItem = ({ product, timeoutSendEmail = 0 }) => {
  const authContext = useContext(AuthContext);
  const { currentUser, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const wishlistContext = useContext(WishlistContext);
  const { getWishlist, wishProduct, unwishProduct } = wishlistContext;

  const [cities, setCities] = useState({
    province: null,
    district: null,
    subdistrict: null,
  });
  const { province, district, subdistrict } = cities;

  const [wishlist, setWishlist] = useState("");

  useEffect(() => {
    //fetchWishlist();
  }, []);

  async function fetchWishlist() {
    const data = await getWishlist(product.product_id);
    setWishlist(data);
  }

  const onClickWishlist = async () => {
    if (wishlist) {
      const data = await unwishProduct(product.product_id);
      setWishlist(data);
      return;
      // setAlert('Anda sudah wishlist untuk produk ini', 'success');
      // return;
    }
    const data = await wishProduct(product.product_id);
    setWishlist(data);
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  //format string to capitalize
  function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }

  // let stars = [];
  // for (let i = 1; i <= 5; i++) {
  //   if (parseInt(product.productRating) >= i) {
  //     stars.push(<span key={i} className='fa fa-star star checked'></span>);
  //   } else {
  //     stars.push(<span key={i} className='fa fa-star star'></span>);
  //   }
  // }

  return (
    <div className="productItem">
      <a href="product.php" className="img-product">
        <img
          src="https://www.canvaswebdesign.com/jolika/uploads/product8.jpg"
          alt=""
        />
      </a>
      <div className="productItemText">
        <div className="ProductTitlePrice">
          <h4>
            <a href="product.php">Gouw heritage</a>
          </h4>
          <p>
            <a href="product.php">Legacy Box 39pcs</a>
          </p>
          <span>
            <a href="product.php">Rp.700.000</a>
          </span>
        </div>
        <div className="productItemDate">
          <i className="fa fa-clock"></i> 2d
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductItem;
