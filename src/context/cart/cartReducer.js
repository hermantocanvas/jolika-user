import {
  CART_ADD_ITEM,
  CART_REMOVE_ITEM,
} from '../types';

export default (state, action) => {

  if (action.type === CART_ADD_ITEM) {
    const isExists = state.cart.some((c) => c.productId === action.payload.productId);
    let newCart = [];
    if (isExists) {
      newCart = state.cart.map((c) =>
        c.productId === action.payload.productId ? action.payload : c
      );
    } else {
      newCart = [...state.cart, action.payload];
    }
    localStorage.setItem('cart200', JSON.stringify(newCart));
    return {
      ...state,
      cart: [...newCart],
    };
  }

  if (action.type === CART_REMOVE_ITEM) {
    const newCart = state.cart.filter((c) => c.id !== action.payload.id);

    localStorage.setItem('cart200', JSON.stringify(newCart));
    return {
      ...state,
      cart: [...newCart],
    };
  }

  return state;
};
