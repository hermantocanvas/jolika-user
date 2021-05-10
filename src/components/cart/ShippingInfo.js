import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

function ShippingInfo({ shippingInfo, onChangeShipping, handleGiftMessage, onChangeGiftMessage }) {
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    loadProvinces();
    loadCities();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (shippingInfo.provinceId) {
      loadDistricts();
    }
    //eslint-disable-next-line
  }, [shippingInfo]);

  useEffect(() => {
    if (shippingInfo.districtId) {
      loadSubdistricts();
    }
    //eslint-disable-next-line
  }, [shippingInfo]);

  async function loadCities() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities`
      );
      setCities(res.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function loadProvinces() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      setProvinces(res.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function loadDistricts() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${shippingInfo.provinceId}`
      );
      setDistricts(res.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function loadSubdistricts() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${shippingInfo.districtId}`
      );
      setSubdistricts(res.data.data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  return (
    <div id="cardInfo" className="deliveryInfo">
      <h2 className="sectionTitleCheckout">DELIVERY INFORMATION</h2>
      <div className="form-control">
        <label>Recipient Name</label>
        <input type="text" value={shippingInfo.recipientName} name="recipientName" placeholder="Recipient Name" onChange={onChangeShipping} />
      </div>
      <div className="form-control">
        <label>Mobile Phone</label>
        <div className="phoneMobile">
          <select name="handphoneCode" value={shippingInfo.handphoneCode} onChange={onChangeShipping}>
            <option value="+62">+62</option>
          </select>
          <input type="number" value={shippingInfo.handphone} name="handphone" placeholder="Handphone" onChange={onChangeShipping} />
        </div>
      </div>
      <div className="form-control">
        <label>Add Address Type</label>
        <input type="text" placeholder="Address type (home, work etc)" value={shippingInfo.addressType} name="addressType" onChange={onChangeShipping} />
      </div>
      <div className="form-control">
        <label>Address</label>
        <textarea value={shippingInfo.address} name="address" placeholder="Enter Full Address" onChange={onChangeShipping}></textarea>
      </div>
      <div className="form-control">
        <label>Select City</label>
        <select
          style={{ textTransform: 'capitalize' }}
          name="cityId"
          value={shippingInfo.cityId}
          onChange={onChangeShipping}
          required>
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option
              value={city._id}
              key={index}
            >
              {city.cityName}
            </option>
          ))}
        </select>
      </div>
      <div className="form-control">
        <div className="detail-address">
          <select
            value={shippingInfo.provinceId}
            name="provinceId"
            onChange={onChangeShipping}
          >
            <option value="">Select Province</option>
            {provinces.map((province) => (
              <option
                value={province.id_indonesia_provinces}
                key={province._id}
              >
                {province.province}
              </option>
            ))}
          </select>
          <select
            value={shippingInfo.districtId}
            name="districtId"
            onChange={onChangeShipping}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option value={district.rajaongkir_id_district} key={district._id}>
                {district.district}
              </option>
            ))}
          </select>
          <select
            value={shippingInfo.subdistrictId}
            name="subdistrictId"
            onChange={onChangeShipping}
          >
            <option value="">Select Subdistrict</option>
            {subdistricts.map((subdistrict) => (
              <option value={subdistrict.rajaongkir_id_subdistrict} key={subdistrict._id}>
                {subdistrict.subdistrict}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="create">
        <input type="checkbox" checked={shippingInfo.useGiftMessage} onClick={handleGiftMessage} /> Add Gift Message
    </div>
      {shippingInfo.useGiftMessage === true && <div id="giftCard">
        <div className="sender">
          <input type="text" value={shippingInfo.giftMessage.from} onChange={(e) => onChangeGiftMessage(e, 'from')} name="from_sender" placeholder="From" />
          <input type="text" value={shippingInfo.giftMessage.to} onChange={(e) => onChangeGiftMessage(e, 'to')} name="to_sender" placeholder="To" />
        </div>
        <div className="message">
          <textarea value={shippingInfo.giftMessage.message} onChange={(e) => onChangeGiftMessage(e, 'message')} name="message" placeholder="Message"></textarea>
        </div>
      </div>}
    </div>
  );
}

export default ShippingInfo;