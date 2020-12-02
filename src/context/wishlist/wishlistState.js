import React, { useReducer, useEffect, useContext } from 'react';
import WishlistContext from './wishlistContext';
import WishlistReducer from './wishlistReducer';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';
import { WISHLIST_SET_COUNT } from '../types';
import axios from 'axios';

const WishlistState = (props) => {
  const authContext = useContext(AuthContext);
  const { currentUser, isAuthenticated } = authContext;

  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const initialState = {
    count: 0,
  };

  const [state, dispatch] = useReducer(WishlistReducer, initialState);

  const countWishlist = async () => {
    if (!currentUser) {
      dispatch({ type: WISHLIST_SET_COUNT, payload: { count: 0 } });
      return;
    }
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/wishlist/count`
      );
      dispatch({ type: WISHLIST_SET_COUNT, payload: { count: res.data.data } });
    } catch (err) {
      console.log(err);
    }
  };

  const wishProduct = async (product_id) => {
    if (!currentUser || !isAuthenticated) {
      setAlert('Silahkan login untuk menambah wishlist', 'primary');
      return '';
    }

    //add new wishlist
    let formData = new FormData();
    formData.append('productId', product_id);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/wishlist`,
        formData
      );

      // setAlert('Wishlist produk ini berhasil ditambahkan', 'success');
      countWishlist();
      return res.data.data;
    } catch (err) {
      setAlert(err.message);
      return '';
    }
  };

  const unwishProduct = async (product_id) => {
    if (!currentUser || !isAuthenticated) {
      setAlert('Silahkan login untuk menambah wishlist', 'primary');
      return '';
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_APIURL}api/v1/wishlist/${product_id}`
      );

      // setAlert('Wishlist produk ini berhasil dihapus', 'success');
      countWishlist();
      return '';
    } catch (err) {
      setAlert(err.message);
      return '';
    }
  };

  const getWishlist = async (product_id) => {
    if (!isAuthenticated || !currentUser) {
      return '';
    }
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/wishlist/get/${product_id}`
      );
      return res.data.data;
    } catch (err) {
      setAlert(err.message);
      return '';
    }
  };

  const value = {
    count: state.count,
    getWishlist: getWishlist,
    wishProduct: wishProduct,
    countWishlist: countWishlist,
    unwishProduct,
  };
  return (
    <WishlistContext.Provider value={value}>
      {props.children}
    </WishlistContext.Provider>
  );
};

export default WishlistState;
