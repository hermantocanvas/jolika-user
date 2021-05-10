import React from 'react';
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import moment from "moment";

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

function Summary({ order, onChangeDeliveryDate, onChangeDeliveryTime, onProcessOrder }) {

  var currDate = new Date();

  return (
    <div id="cartCard">
      <h2 className="sectionTitleCheckout" style={{ marginBottom: '0px' }}>ORDER SUMMARY</h2>
      <div className="checkoutInfo">
        <h5>Delivery Date</h5>
        <div className="dateTime">
          <Flatpickr
            placeholder="Delivery date"
            value={order.deliveryDate}
            onChange={date => {
              onChangeDeliveryDate(date);
            }}
            options={{ minDate: moment(currDate).format('YYYY-MM-DD') }}
          />
          {/* <a href="#"><i className="fa fa-pencil"></i></a> */}
        </div>
      </div>
      <div className="checkoutInfo">
        <h5>Delivery Time</h5>
        <div className="dateTime">
          <Flatpickr
            placeholder="Delivery time"
            value={order.deliveryDate}
            onChange={date => {
              onChangeDeliveryTime(date);
            }}
            options={{
              minDate: moment(currDate).format('YYYY-MM-DD'), enableTime: true,
              noCalendar: true,
              dateFormat: "H:i",
            }}
          />
          {/* <a href="#"><i className="fa fa-pencil"></i></a> */}
        </div>
      </div>
      <div className="checkoutInfo">
        <h5>Subtotal</h5>
        <p>{formatter.format(order.productSubTotal)}</p>
      </div>
      <div className="checkoutInfo">
        <h5>Estimated Delivery Cost</h5>
        <p>{formatter.format(order.shippingFee)}</p>
      </div>
      {order.discount > 0 && <div className="checkoutInfo">
        <h5>Discount</h5>
        <p>{formatter.format(order.discount)}</p>
      </div>}
      <div className="checkoutInfo">
        <h5>Estimated Total</h5>
        <p>{formatter.format(order.grandTotal)}</p>
      </div>
      <hr />
      <div id="checkOutNoted">
        <p>Lorem ipsum dolor sit amet, sed do eiusmod tempor labore et dolore magna aliqua</p>
      </div>
      <div className="checkout-button">
        <button className="btn-block" onClick={onProcessOrder}>PROCESS ORDER</button>
      </div>
    </div>
  );
}

export default Summary;