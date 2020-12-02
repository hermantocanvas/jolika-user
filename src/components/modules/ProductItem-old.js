import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import ReactImageAppear from 'react-image-appear';

import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import WishlistContext from '../../context/wishlist/wishlistContext';

const MarketplaceProductItem = ({ product, timeoutSendEmail = 0 }) => {
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

  const [wishlist, setWishlist] = useState('');

  useEffect(() => {
    fetchWishlist();
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

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  //format string to capitalize
  function capitalize(s) {
    return s.toLowerCase().replace(/\b./g, function (a) {
      return a.toUpperCase();
    });
  }

  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (parseInt(product.productRating) >= i) {
      stars.push(<span key={i} className='fa fa-star star checked'></span>);
    } else {
      stars.push(<span key={i} className='fa fa-star star'></span>);
    }
  }

  return (
    <li>
      <div className='list_item'>
        <Link to={`/produk-marketplace/${product.slug}`}>
          <img
            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${product.image}`}
            alt='produk'
          />
        </Link>
        <div className='list_item_in'>
          <h3 className='li_title'>
            <Link to={`/produk-marketplace/${product.slug}`}>
              {capitalize(product.name)}
            </Link>
          </h3>

          <div className='li_star'>
            {stars}

            {(() => {
              if (wishlist) {
                return (
                  <div className='li_favorite'>
                    <i
                      onClick={onClickWishlist}
                      className='fa fa-heart'
                      style={{ color: '#ff4866' }}
                    ></i>
                  </div>
                );
              } else {
                return (
                  <div className='li_favorite'>
                    <i onClick={onClickWishlist} className='fa fa-heart'></i>
                  </div>
                );
              }
            })()}
          </div>
          <div className='li_price'>
            {(() => {
              if (product.marketPrice) {
                return (
                  <>
                    <span className='li_coret'>
                      {formatter.format(product.marketPrice)}
                    </span>
                  </>
                );
              }
            })()}
            {formatter.format(product.marketplacePrice)}
          </div>
          <div className='li_bottom'>
            {(() => {
              if (district && province) {
                return (
                  <div className='li_ct_lcoation'>
                    <i className='fa fa-map-marker'></i> {district.district}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>
    </li>
  );
};

MarketplaceProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default MarketplaceProductItem;
