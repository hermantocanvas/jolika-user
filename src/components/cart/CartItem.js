import React, { useContext } from "react";
import CartContext from "../../context/cart/cartContext";
import AlertContext from "../../context/alert/alertContext";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const CartItem = ({ product, index, onDecreaseQty, onIncreaseQty }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const cartContext = useContext(CartContext);
  const {
    incrementAmount,
    decrementAmount,
    removeItemFromCart,
    updateNote,
  } = cartContext;

  //set pricing
  let productPrice;
  if (product.discountedPrice > 0) {
    productPrice = product.discountedPrice;
  } else {
    productPrice = product.price;
  }

  return (
    <tr>
      <td>
        <div className="img-product">
          <img src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${product.images[0].fileName}`} alt="" />
        </div>
      </td>
      <td data-header="Product Name &nbsp; :">
        <h3>{product.productName}</h3>
        {product.chosenOptions && product.chosenOptions.length > 0 &&
          product.chosenOptions.map((option, index) => <span key={index} style={{ fontStyle: 'italic' }}>{option.label}. </span>)
        }
        <div className="create">
          <input type="checkbox" name="account-create" onclick="notedChecked()" /> Add Note
				</div>
        <div id="noted">
          <div className="message">
            <textarea name="message" placeholder="Message"></textarea>
          </div>
        </div>
      </td>
      <td data-header="Price &nbsp; :">
        <span>{formatter.format(productPrice)}</span>
      </td>
      <td data-header="Qty &nbsp; :">
        <div className="formGroup inputQty inputQty-width">
          {product.qty > 1 ? <button
            onClick={() => onDecreaseQty(index)}
            className="minus"
            id="minusButton"
          >-</button> : <button
            disabled
            onClick={() => onDecreaseQty(index)}
            className="minus"
            id="minusButton"
          >-</button>}
          <input type="number" value={product.qty} placeholder="QTY" />
          <button
            onClick={() => onIncreaseQty(index)}
            className="plus"
          >+</button>
        </div>
      </td>
      <td data-header="Subtotal&nbsp; :"><span><span>{formatter.format(productPrice * product.qty)}</span></span></td>
      <td><a href="#"><i className="fa fa-trash"></i></a></td>
    </tr>
  );
};

export default CartItem;
