import React, { useReducer } from 'react';
import CartContext from './cartContext';
import CartReducer from './cartReducer';
import {
  CART_ADD_ITEM,
  CART_CLEAR_PRODUCTS,
  CART_SET_PRODUCTS,
  CART_REMOVE_ITEM,
  CART_ADD_SHIPPING,
  CART_CLEAR_SHIPPINGS,
} from '../types';
import axios from 'axios';
const CartState = (props) => {
  const storage = localStorage.getItem('cart200');
  const cart = storage ? JSON.parse(storage) : [];
  const initialState = {
    cart: cart,
    products: [],
    shippings: {}, //group By Seller
    loading: false,
  };

  const [state, dispatch] = useReducer(CartReducer, initialState);
  const getCartCount = () => {
    return state.cart.length;
  };

  const addItemToCart = ({
    product_id,
    quantity,
    note,
    seller_id,
    productCombination_id,
  }) => {
    const id = productCombination_id || product_id;
    console.log(id);
    if (!id) return;
    return dispatch({
      type: CART_ADD_ITEM,
      payload: {
        id,
        quantity,
        note,
        seller_id,
        product_id,
        productCombination_id: productCombination_id || '',
      },
    });
  };

  const removeItemFromCart = ({ id }) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: { id } });
  };

  const getCartGroupBySellerId = () => {
    const rows = [];
    let lastCategory = null;
    let tmp = [];

    const tmpCart = [...state.cart];

    tmpCart.sort((a, b) => {
      const idA = a.seller_id.toUpperCase();
      const idB = b.seller_id.toUpperCase();
      let comparison = 0;
      if (idA > idB) {
        comparison = 1;
      } else if (idA < idB) {
        comparison = -1;
      }
      return comparison;
    });

    tmpCart.forEach((item) => {
      if (item.seller_id !== lastCategory) {
        if (tmp.length) {
          rows.push(tmp);
          tmp = [];
        }
      }
      tmp.push(item);
      lastCategory = item.seller_id;
    });

    if (tmp.length) {
      rows.push(tmp);
    }

    return rows;
  };

  const incrementAmount = ({ id }) => {
    const item = getCartItemById(id);
    if (!item) return;
    item.quantity++;
    addItemToCart({ ...item });
  };

  const decrementAmount = ({ id }) => {
    const item = getCartItemById(id);
    if (!item) return;
    item.quantity--;
    addItemToCart({ ...item });
  };

  const getCartItemById = (id) => {
    return state.cart.find((c) => {
      return c.id === id;
    });
  };

  const updateNote = ({ id, note }) => {
    const item = getCartItemById(id);

    addItemToCart({ ...item, note });
  };

  const loadProducts = async () => {
    dispatch({ type: CART_CLEAR_PRODUCTS });

    let formData = new FormData();
    const cart = [];
    state.cart.forEach((cartItem) => {
      cart.push({
        product_id: cartItem.product_id,
        productCombination_id: cartItem.productCombination_id,
      });
    });

    formData.append('cart', JSON.stringify(cart));
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/cart/items3`,
        formData
      );
      console.log(res.data.data);
      dispatch({
        type: CART_SET_PRODUCTS,
        payload: { products: res.data.data },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getProductByCartItem = ({ productCombination_id, product_id }) => {
    if (productCombination_id) {
      return state.products.find((p) => {
        return p.productCombination_id === productCombination_id;
      });
    }

    return state.products.find((p) => {
      return p.product_id === product_id;
    });
  };

  const getMarketplacePriceTotal = () => {
    let grandTotal = 0;
    state.cart.forEach((cartItem) => {
      const product = getProductByCartItem(cartItem);

      if (!product) return;
      grandTotal +=
        parseInt(product.marketplacePrice) * parseInt(cartItem.quantity);
    });
    return grandTotal;
  };

  const isShippingReady = () => {
    let ready = true;
    state.cart.forEach((item) => {
      if (
        !state.shippings[item.seller_id] ||
        !state.shippings[item.seller_id].fee
      ) {
        ready = false;
      }
    });
    return ready;
  };

  const getTotalWeightBySellerId = (seller_id) => {
    if (state.products) {
      const selectedProducts = state.products.filter((product) => {
        return product.user._id === seller_id;
      });

      return selectedProducts.reduce((accumulator, currentProduct) => {
        const cartItem = getCartItemById(
          currentProduct.productCombination_id || currentProduct.product_id
        );
        return accumulator + currentProduct.weight * cartItem.quantity;
      }, 0);
    }
  };

  const addShipping = ({ seller_id, shipping }) => {
    console.log(shipping);
    const newShipping = {
      sellerId: seller_id,
      fee: shipping.fee,
      name: shipping.value,
      weight: getTotalWeightBySellerId(seller_id),
    };

    dispatch({
      type: CART_ADD_SHIPPING,
      payload: { key: seller_id, value: newShipping },
    });
  };

  const getCheckoutGrandTotal = () => {
    let grandTotal = 0;
    getCartGroupBySellerId().forEach((items) => {
      grandTotal += getCheckoutGrandTotalBySellerId(items[0].seller_id);
    });
    return grandTotal;
  };

  const getCheckoutGrandTotalBySellerId = (seller_id) => {
    let grandTotal = 0;
    const shipping = state.shippings[seller_id];
    if (!shipping) return 0;
    state.cart.forEach((item) => {
      const product = getProductByCartItem(item);
      if (!product || item.seller_id !== seller_id) return 0;
      grandTotal += product.marketplacePrice * item.quantity;
    });
    grandTotal += shipping.fee;
    return grandTotal;
  };

  const clearProducts = () => {
    dispatch({ type: CART_CLEAR_PRODUCTS });
  };
  const clearShippings = () => {
    dispatch({ type: CART_CLEAR_SHIPPINGS });
  };

  const value = {
    cart: state.cart,
    products: state.products,
    loading: state.loading,
    shippings: state.shippings,
    getCartCount,
    addItemToCart,
    removeItemFromCart,
    incrementAmount,
    decrementAmount,
    updateNote,
    getCartGroupBySellerId,
    loadProducts,
    getMarketplacePriceTotal,
    getProductByCartItem,
    isShippingReady,
    getTotalWeightBySellerId,
    addShipping,
    getCheckoutGrandTotal,
    getCheckoutGrandTotalBySellerId,
    clearProducts,
    clearShippings,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export default CartState;
