import React, { useContext, useState, useEffect } from 'react';
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import AddressItem from './AddressItem';

function Address() {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
    //eslint-disable-next-line
  }, []);

  async function loadAddresses() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/users/bypartner`
      );
      setAddresses(res.data.data);

    } catch (err) {
      console.log(err.message);
    }
  }

  if (addresses.length === 0) return (
    <>
      <div className="information-title">Your Shipping Addresses</div>
      <Link className="btn btn-brown" to="/account/add-address"><i className="fa fa-plus"></i> ADD NEW ADDRESS</Link>
      <p style={{ marginTop: '10px' }}>No shipping address. Please add new address.</p>
    </>
  );

  return (
    <>
      <div className="information-title">Your Shipping Addresses</div>
      <Link className="btn btn-brown" to="/account/add-address"><i className="fa fa-plus"></i> ADD NEW ADDRESS</Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Type</th>
            <th>Address</th>
            <th>Subdistrict</th>
            <th>District</th>
            <th>Province</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((address, index) => (
            <AddressItem address={address} key={index} />
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Address;