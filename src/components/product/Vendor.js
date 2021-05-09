import React from 'react';
import { Link } from 'react-router-dom'

function Vendor({ vendor, city }) {
  return (
    <div id="shopInfo">
      <Link to={`/vendor/${vendor.slug}`}><img src={`${process.env.REACT_APP_APIURL}uploads/vendor/${vendor.logoImage}`} alt={vendor.vendorName} /></Link>
      <div style={{ textTransform: 'capitalize' }}>
        <p style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          {vendor.vendorName}
        </p>
        <i className="fa fa-map-marker"></i> {city.cityName}, {city.province.province}
      </div>
      <Link to={`/vendor/${vendor.slug}`}>Visit Vendor Page</Link>
    </div>
  );
}

export default Vendor;