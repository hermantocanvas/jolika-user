import React from 'react';

function Summary() {
  return (
    <div id="cartCard">
      <h2 className="sectionTitleCheckout" style={{ marginBottom: '0px' }}>ORDER SUMMARY</h2>
      <div className="checkoutInfo">
        <h5>Delivery Date</h5>
        <span className="dateTime">10-oct-2020 <a href="#"><i className="fa fa-pencil"></i></a></span>
      </div>
      <div className="checkoutInfo">
        <h5>Delivery Time</h5>
        <span className="dateTime"><input type="time" name="time" value="12:00" /><a href="#"><i className="fa fa-pencil"></i></a></span>
      </div>
      <div className="checkoutInfo">
        <h5>Subtotal</h5>
        <p>Rp.925.000</p>
      </div>
      <div className="checkoutInfo">
        <h5>Estimated Delivery Cost</h5>
        <p>Rp.50.000</p>
      </div>
      <div className="checkoutInfo">
        <h5>Discount</h5>
        <p>Rp.50.000</p>
      </div>
      <div className="checkoutInfo">
        <h5>Estimated Total</h5>
        <p>Rp.975.000</p>
      </div>
      <hr />
      <div id="checkOutNoted">
        <p>Lorem ipsum dolor sit amet, sed do eiusmod tempor labore et dolore magna aliqua</p>
      </div>
      <div className="checkout-button">
        <button className="btn-block" type="submit" name="submit">PROCESS ORDER</button>
      </div>
    </div>
  );
}

export default Summary;