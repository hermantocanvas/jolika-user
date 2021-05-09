import React from 'react';

function ShippingInfo() {
  return (
    <>
      <div id="cardInfo" className="deliveryInfo">
        <h2 className="sectionTitleCheckout">YOUR INFORMATION</h2>
        <p>You're checking out as guest, <a style={{ color: '#eb9588' }} href="login.php">Login</a> to check out faster.</p>
        <div className="form-control">
          <label>Name</label>
          <div className="inputName">
            <input type="text" name="first" placeholder="First Name" />
            <input type="text" name="last" placeholder="Last Name" />
          </div>
        </div>
        <div className="form-control">
          <label>Email</label>
          <input type="email" name="email" placeholder="Email Address" />
        </div>
        <div className="form-control">
          <label>Mobile Phone</label>
          <div className="phoneMobile">
            <select>
              <option>+62</option>
              <option>+63</option>
              <option>+64</option>
              <option>+65</option>
            </select>
            <input type="text" name="phone" placeholder="Mobile Phone" />
          </div>
        </div>
        <div className="create">
          <input type="checkbox" name="account-create" onclick="check()" /> Create Account
			    </div>
        <div id="createPasssword" style={{ display: 'none' }}>
          <div className="form-control">
            <label>Password</label>
            <input type="password" name="password1" placeholder="Password" />
          </div>
          <div className="form-control">
            <label>Confirm Password</label>
            <input type="password" name="password2" placeholder="Confirm Password" />
          </div>
        </div>
      </div>
      <div id="cardInfo" className="deliveryInfo">
        <h2 className="sectionTitleCheckout">DELIVERY INFORMATION</h2>
        <div className="form-control">
          <label>Recipient Name</label>
          <input type="text" name="nama" placeholder="Name" />
        </div>
        <div className="form-control">
          <label>Mobile Phone</label>
          <div className="phoneMobile">
            <select>
              <option>+62</option>
              <option>+63</option>
              <option>+64</option>
              <option>+65</option>
            </select>
            <input type="text" name="phone" placeholder="Mobile Phone" />
          </div>
        </div>
        <div className="form-control">
          <label>Choose Address</label>
          <select name="address" id="address">
            <option value="">Home Address</option>
            <option value="">Office Addres</option>
          </select>
        </div>
        <div className="form-control">
          <label>Address</label>
          <textarea name="address" placeholder="Address"></textarea>
        </div>
        <div className="form-control">
          <div className="detail-address">
            <select>
              <option>Province</option>
              <option>DKI Jakarta</option>
              <option>Jawa Barat</option>
              <option>Jawa Tengah</option>
              <option>Jawa Timur</option>
            </select>
            <select>
              <option>City/District</option>
              <option>Jakarta Pusat</option>
              <option>Jakarta Timur</option>
              <option>Jakarta Barat</option>
            </select>
            <select>
              <option>Subdistrict</option>
              <option>Senen</option>
              <option>Sawah Besar</option>
              <option>Kemayoran</option>
            </select>
          </div>
        </div>
        <div className="create">
          <input type="checkbox" name="account-create" onclick="giftChecked()" /> Add Gift Message
    </div>
        <div id="giftCard" style={{ display: 'none' }}>
          <div className="sender">
            <input type="text" name="from_sender" placeholder="From" />
            <input type="text" name="to_sender" placeholder="To" />
          </div>
          <div className="message">
            <textarea name="message" placeholder="Message"></textarea>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShippingInfo;