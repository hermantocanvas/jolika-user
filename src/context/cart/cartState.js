import React, { useReducer } from 'react';

import CartContext from './cartContext';
import CartReducer from './cartReducer';
import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
} from '../types';

const CartState = (props) => {
  const storage = localStorage.getItem('cart200');
  const cart = storage ? JSON.parse(storage) : [];
  const initialState = {
    cart,
  };
  const [state, dispatch] = useReducer(CartReducer, initialState);

  const getCartCount = () => {
    return state.cart.length;
  };

  const addItemToCart = (chosenProduct) => {
    return dispatch({
      type: CART_ADD_ITEM,
      payload: chosenProduct,
    });
  };

  const removeItemFromCart = ({ id }) => {
    dispatch({ type: CART_REMOVE_ITEM, payload: { id } });
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

  const value = {
    cart: state.cart,
    getCartCount,
    addItemToCart,
    removeItemFromCart,
    incrementAmount,
    decrementAmount,
    updateNote,
  };

  return (
    <CartContext.Provider value={value}>{props.children}</CartContext.Provider>
  );
};

export default CartState;
