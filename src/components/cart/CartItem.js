import React, { useContext } from "react";
import AlertContext from "../../context/alert/alertContext";
import { Link } from "react-router-dom";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const CartItem = ({ product, index, onDecreaseQty, onIncreaseQty, deleteCartItem, handleAddNote, editCustomerNote }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

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
          <input type="checkbox" checked={product.customerNote} onClick={() => handleAddNote(index)} /> Add Note
				</div>
        {product.customerNote === true && <div id="noted">
          <div className="message">
            <textarea placeholder="Message" value={product.customNoteMessage} onChange={(e) => editCustomerNote(e, index)}></textarea>
          </div>
        </div>}
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
      <td><Link to="#" onClick={() => deleteCartItem(index)}><i className="fa fa-trash"></i></Link></td>
    </tr>
  );
};

export default CartItem;
