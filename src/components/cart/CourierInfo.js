import React from 'react';

function CourierInfo() {
  return (
    <div id="cardInfo" className="deliveryInfo">
      <h2 className="sectionTitleCheckout">COURIER INFORMATION</h2>
      <div className="form-control">
        <label for="flavor">Choose Courier</label>
        <select name="courier" id="courier">
          <option value="">Choose Courier</option>
          <option value="">Gojek</option>
          <option value="">Grab</option>
        </select>
      </div>
      <div className="form-control">
        <label>Location</label>
      </div>
      <div className="deliveryLocation">
        <div className="form-control" id="inputLocation" style={{ marginTop: '0px' }}>
          <input type="text" name="location" placeholder="Enter Location" style={{ marginTop: '0.5rem' }} />
        </div>
        <iframe className="mapping" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.651661191244!2d106.78848361536957!3d-6.177363262252899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f5802f381d%3A0xe816d65037c3207a!2sCentral%20Park!5e0!3m2!1sid!2sid!4v1601348526467!5m2!1sid!2sid" width="100%" height="250" frameborder="0" style={{ border: '0px' }} allowfullscreen="" aria-hidden="false" tabindex="0">
        </iframe>
      </div>
      <div className="form-control" style={{ marginTop: '0px' }}>
        <button className="btn-block">Update Delivery Cost</button>
      </div>
    </div>
  );
}

export default CourierInfo;