import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";

import AuthContext from "../../context/auth/authContext";

function Delivery({ product }) {
  const { isAuthenticated, currentUser, loadUser } = useContext(AuthContext);
  const [chosenCourier, setChosenCourier] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      loadUser();
    }
    //eslint-disable-next-line 
  }, []);

  const onSelectCourier = async (e) => {
    //get chosen courier data
    try {
      const courier = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/couriers/${e.target.value}`
      );
      setChosenCourier(courier.data.data);

    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  }

  return (
    <>
      <h3>Available Delivery</h3>
      <div className="formGroup">
        <label htmlFor="flavor">Delivery Courier</label>
        <select name="courier" id="courier" onChange={onSelectCourier}>
          <option value="">Choose Courier</option>
          {product.chosenCouriers.map((courier, index) => <option key={index} value={courier.id}>{courier.name}</option>)}
        </select>
      </div>
      {isAuthenticated && currentUser ? <div className="formGroup">
        <label htmlFor="flavor">Choose Address</label>
        <select name="address" id="address">
          <option value="">Home Address</option>
          <option value="">Office Addres</option>
        </select>
      </div> : <div className="formGroup">
        <label htmlFor="flavor">Your Address</label>
        <select name="address" id="address">
          <option value="">Home Address</option>
          <option value="">Office Addres</option>
        </select>
      </div>
      }

      <p style={{ textAlign: "center", marginTop: "1rem" }}>- OR -</p>

      <div className="deliveryLocation">
        <div className="addLocation" id="inputLocation">
          <input
            type="text"
            name="location"
            placeholder="Enter Location"
          />
        </div>
        <iframe
          className="mapping"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.651661191244!2d106.78848361536957!3d-6.177363262252899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f5802f381d%3A0xe816d65037c3207a!2sCentral%20Park!5e0!3m2!1sid!2sid!4v1601348526467!5m2!1sid!2sid"
          width="100%"
          height="350"
          frameBorder="0"
          style={{ border: "0" }}
          allowFullScreen={true}
          aria-hidden={false}
          tabIndex="0"
        ></iframe>
      </div>
      <button className="btn-block">Check Delivery Cost</button>
    </>
  );
}

export default Delivery;