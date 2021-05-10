import React from 'react';
import { Link } from 'react-router-dom';

function CustomerInfo({ customer, onChangeCustomer, handleWantToRegister }) {
  return (
    <div id="cardInfo" className="deliveryInfo">
      <h2 className="sectionTitleCheckout">YOUR INFORMATION</h2>
      <p>You're checking out as guest, <Link style={{ color: '#eb9588' }} to="/login">Login</Link> for faster check out.</p>
      <div className="form-control">
        <label>Name</label>
        <div className="inputName">
          <input type="text" name="firstName" value={customer.firstName} placeholder="First Name" onChange={onChangeCustomer} />
          <input type="text" name="lastName" value={customer.lastName} placeholder="Last Name" onChange={onChangeCustomer} />
        </div>
      </div>
      <div className="form-control">
        <label>Email</label>
        <input type="email" name="email" value={customer.email} placeholder="Email Address" onChange={onChangeCustomer} />
      </div>
      <div className="form-control">
        <label>Mobile Phone</label>
        <div className="phoneMobile">
          <select name="hpCountryCode" value={customer.hpCountryCode} onChange={onChangeCustomer}>
            <option value="+62">+62</option>
          </select>
          <input type="number" name="handphone" value={customer.handphone} placeholder="Handphone" onChange={onChangeCustomer} />
        </div>
      </div>
      <div className="create">
        <input type="checkbox" checked={customer.wantToRegister} onClick={handleWantToRegister} /> Create Account
			    </div>
      {customer.wantToRegister === true && <div id="createPasssword">
        <div className="form-control">
          <label>Password</label>
          <input type="password" value={customer.password} name="password" minLength='8' placeholder="Password" onChange={onChangeCustomer} />
        </div>
        <div className="form-control">
          <label>Confirm Password</label>
          <input type="password" value={customer.password2} name="password2" minLength='8' placeholder="Confirm Password" onChange={onChangeCustomer} />
        </div>
      </div>}
    </div>
  );
}

export default CustomerInfo;