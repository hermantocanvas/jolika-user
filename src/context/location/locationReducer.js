import {
  CART_ADD_ITEM,
  CART_CLEAR_PRODUCTS,
  CART_SET_PRODUCTS,
  CART_REMOVE_ITEM,
  CART_ADD_SHIPPING,
  CART_CLEAR_SHIPPINGS,
} from "../types";

export default (state, action) => {
  if (action.type === CART_ADD_ITEM) {
    const isExists = state.cart.some((c) => c.id === action.payload.id);
    let newCart = [];
    if (isExists) {
      newCart = state.cart.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
    } else {
      newCart = [...state.cart, action.payload];
    }
    localStorage.setItem("cart200", JSON.stringify(newCart));
    return {
      ...state,
      cart: [...newCart],
    };
  }

  if (action.type === CART_REMOVE_ITEM) {
    const newCart = state.cart.filter((c) => c.id !== action.payload.id);

    localStorage.setItem("cart200", JSON.stringify(newCart));
    return {
      ...state,
      cart: [...newCart],
    };
  }

  if (action.type === CART_CLEAR_PRODUCTS) {
    return {
      ...state,
      products: [],
    };
  }

  if (action.type === CART_SET_PRODUCTS) {
    return {
      ...state,
      products: action.payload.products,
    };
  }

  if (action.type === CART_ADD_SHIPPING) {
    return {
      ...state,
      shippings: {
        ...state.shippings,
        ...{ [action.payload.key]: action.payload.value },
      },
    };
  }

  if (action.type === CART_CLEAR_SHIPPINGS) {
    return {
      ...state,
      shippings: {},
    };
  }

  return state;
};
