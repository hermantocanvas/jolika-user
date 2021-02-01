import React, { useReducer } from "react";
import LocationContext from "./locationContext";
import LocationReducer from "./locationReducer";
import { LOCATION_ID } from "../types";
import axios from "axios";

const LocationState = (props) => {
  const storage = localStorage.getItem("locationId");
  const locationId = storage ? storage : "";

  const initialState = {
    locationId: locationId,
  };

  const [state, dispatch] = useReducer(LocationReducer, initialState);

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
        productCombination_id: productCombination_id || "",
      },
    });
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

export default LocationState;
