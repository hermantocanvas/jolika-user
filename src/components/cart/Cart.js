import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";

import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';
import LocationContext from "../../context/location/locationContext";
import AlertContext from "../../context/alert/alertContext";

import CartItem from './CartItem';
import ShippingInfo from './ShippingInfo';
import CourierInfo from './CourierInfo';
import Summary from './Summary';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const Cart = () => {
  const cartContext = useContext(CartContext);
  const { setAlert } = useContext(AlertContext);
  const { cart, getCartCount } = cartContext;
  const { currentUser, isAuthenticated, setLastProductPage } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const { locationId } = useContext(LocationContext);
  const [location, setLocation] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [grandtotal, setGrandtotal] = useState(0);

  useEffect(() => {
    setProducts(cart);
    setLastProductPage(`/cart`);
    getLocation();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setRupiahTotal();
    //eslint-disable-next-line
  }, [products]);

  function setRupiahTotal() {
    products.map(product => {

    })
  }



  async function getLocation() {
    try {
      const location = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities/${locationId}`
      );
      setLocation(location.data.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  }

  if (!cart || getCartCount() < 1) {
    return (
      <section id="checkout" style={{ margin: '2rem' }}>
        <div id="information">
          <div id="cardInfo" style={{ minHeight: '300px' }}>
            <h2 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>YOUR ORDER</h2>
            <h3 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>There are no products in the shopping cart.</h3>
          </div>
        </div>
      </section>
    );
  }

  //handle quantity change
  const onIncreaseQty = (index) => {
    const newProducts = [...products]; //use shallow clone to copy object consists array

    //code dibawah masih bermasalah
    // if (newProducts[index].qty > parseInt(newProducts[index].stock) && newProducts[index].isPreorder === false) {
    //   setAlert('Not enough stock. Please choose smaller qty', 'danger');
    //   return false;
    // }
    const newQty = newProducts[index].qty + 1;
    newProducts[index].qty = newQty;
    setProducts(newProducts);
  }

  //handle quantity change
  const onDecreaseQty = (index) => {
    const newProducts = [...products];
    if (newProducts[index].qty > 0) {
      newProducts[index].qty--;
      setProducts(newProducts);
    }
  }

  return (
    <section id="checkout" style={{ margin: '2rem' }}>
      <div id="information">
        <div id="cardInfo">
          <h2 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>YOUR ORDER</h2>
          <h3 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>You are currently ordering from {cart[0].vendorId.vendorName}</h3>
          <div className="divider">
            <h3>{cart[0].vendorId.vendorName}</h3>
            {location && <p style={{ textTransform: 'capitalize' }}>{location.cityName}</p>}
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="timage"></th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th className="tqty">Quantity</th>
                    <th className="tsubtotal">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 && products.map((product, index) => <CartItem key={index} index={index} product={product} onIncreaseQty={onIncreaseQty} onDecreaseQty={onDecreaseQty} />)}
                </tbody>
              </table>
            </div>
          </div>
          <div id="shipping_result">
            <div className="linkPromo order-2">
              <p>Apply Promo Code</p>
            </div>
            <div className="order-1">
              {/* <div className="subtotalProduct subTotal">
                <h4>Discount :</h4>
                <h4>Rp.50.000 &nbsp;</h4>
              </div> */}
              <div className="subtotalProduct subTotal" style={{ paddingTop: '0.5rem' }}>
                <h4>Subtotal :</h4>
                <h4>Rp.925.000</h4>
              </div>
            </div>
            <div id="noted2" className="order-3">
              <div className="voucherBlock" >
                <input type="text" name="voucher" id="voucher" placeholder="VOUCHER" />
                <button className="btn-block" type="submit" name="submit">APPLY</button>
              </div>
            </div>
          </div>
        </div>
        <ShippingInfo />
        <CourierInfo />
      </div>
      <Summary />
    </section>
  );
};

export default Cart;
