import React, { useEffect, useState, useContext } from 'react';
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-modal";
import Geocode from "react-geocode";
import { LoadScript } from "@react-google-maps/api";
import { GoogleMap, Marker } from "@react-google-maps/api";

import AlertContext from "../../../context/alert/alertContext";

function AddAddress() {
  const history = useHistory();
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  //set initial local state
  const [addressInfo, setAddressInfo] = useState({
    recipientName: '',
    handphone: '',
    handphoneCode: '+62',
    addressType: '',
    address: '',
    geolocation: '',
    longitude: -6.2,
    latitude: 106.816666,
    cityId: null,
    provinceId: null,
    districtId: null,
    subdistrictId: null,
  });
  const { recipientName, handphone, handphoneCode, addressType, address, geolocation, longitude, latitude, cityId, provinceId, districtId, subdistrictId } = addressInfo;
  const [cities, setCities] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    loadProvinces();
    loadCities();
    Geocode.setApiKey(process.env.REACT_APP_GOOGLEMAP);
    Geocode.setLanguage("en");
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (provinceId) {
      loadDistricts();
    }
    //eslint-disable-next-line
  }, [provinceId]);

  useEffect(() => {
    if (districtId) {
      loadSubdistricts();
    }
    //eslint-disable-next-line
  }, [districtId]);

  async function loadCities() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities`
      );
      setCities(res.data.data);
    } catch (err) {
      setAlert(err.response.data, "danger");
    }
  }

  async function loadProvinces() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      setProvinces(res.data.data);
    } catch (err) {
      setAlert(err.response.data, "danger");
    }
  }

  async function loadDistricts() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      setDistricts(res.data.data);
    } catch (err) {
      setAlert(err.response.data, "danger");
    }
  }

  async function loadSubdistricts() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );
      setSubdistricts(res.data.data);
    } catch (err) {
      setAlert(err.response.data, "danger");
    }
  }

  const onChange = (e) => {
    setAddressInfo({ ...addressInfo, [e.target.name]: e.target.value });
  };

  const onChangeAddress = (e) => {
    setAddressInfo({
      ...addressInfo,
      address: e.target.value,
      geolocation: e.target.value
    });

    //addGeolocation(e.target.value);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (
      recipientName === "" ||
      handphone === "" ||
      handphoneCode === "" ||
      addressType === "" ||
      address === "" ||
      cityId === "" ||
      provinceId === "" ||
      districtId === "" ||
      subdistrictId === ""
    ) {
      setAlert("Please complete required fields", "danger");
    } else {
      confirmAlert({
        title: "Save Address?",
        message: `Are you sure to save new address?`,
        buttons: [
          {
            label: "Yes",
            onClick: () => saveAddress(),
          },
          {
            label: "No",
            onClick: () => console.log("Cancel..."),
          },
        ],
      });
    }
  };

  async function saveAddress() {
    let formData = new FormData();
    formData.append("recipientName", recipientName);
    formData.append("handphone", handphone);
    formData.append("handphoneCode", handphoneCode);
    formData.append("addressType", addressType);
    formData.append("address", address);
    formData.append("geolocation", geolocation);
    formData.append("longitude", longitude);
    formData.append("latitude", latitude);
    formData.append("cityId", cityId);
    formData.append("provinceId", provinceId);
    formData.append("districtId", districtId);
    formData.append("subdistrictId", subdistrictId);

    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/users/createuseraddress`,
        formData
      );
      setAlert("Address saved.", "success");
      history.push("/account/address");
    } catch (err) {
      setAlert(err.response.data, "danger");
    }
  }

  const MapContainer = ({ lat, lng }) => {
    const mapStyles = {
      height: "300px",
      width: "100%",
    };

    const defaultCenter = {
      lat,
      lng,
    };

    return (
      <GoogleMap mapContainerStyle={mapStyles} zoom={19} center={defaultCenter}>
        <Marker
          position={{
            lat,
            lng,
          }}
          draggable={true}
          onDragEnd={(e) => onMarkerDragEnd(e)}
        />
      </GoogleMap>
    );
  };

  const addGeolocation = (location) => {
    let longitude;
    let latitude;

    Geocode.fromAddress(location).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        longitude = lng;
        latitude = lat;
      },
      (error) => {
        console.error(error);
      }
    );

    setAddressInfo({
      ...addressInfo,
      geolocation: location,
      longitude,
      latitude
    });
  };

  const onMarkerDragEnd = (e) => {
    let longitude = e.latLng.lng();
    let latitude = e.latLng.lat();
    let geolocation;

    Geocode.fromLatLng(e.latLng.lat(), e.latLng.lng()).then(
      (response) => {
        const address = response.results[0].formatted_address;
        geolocation = address;
      },
      (error) => {
        console.error(error);
      }
    );

    setAddressInfo({
      ...addressInfo,
      longitude,
      latitude,
      geolocation,
    });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLEMAP}>
      <div id="cardInfo">
        <div className="information-title">Add New Address</div>
        <form onSubmit={onSubmit}>
          <div className="form-control">
            <div className="inputName3col">
              <input required type="text" value={addressType} name="addressType" placeholder="Address type (home, work etc)" onChange={onChange} />
              <input required type="text" value={recipientName} name="recipientName" placeholder="Recipient Name" onChange={onChange} />
              <div className="phoneMobile">
                <select required name="handphoneCode" value={handphoneCode} onChange={onChange}>
                  <option value="+62">+62</option>
                </select>
                <input required type="number" value={handphone} name="handphone" placeholder="Handphone" onChange={onChange} />
              </div>
            </div>
            <div className="inputName3col">
              <select
                value={provinceId}
                name="provinceId"
                onChange={onChange}
                required>
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
                value={districtId}
                name="districtId"
                onChange={onChange}
                required>
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option value={district.rajaongkir_id_district} key={district._id}>
                    {district.district}
                  </option>
                ))}
              </select>
              <select
                value={subdistrictId}
                name="subdistrictId"
                onChange={onChange}
                required
              >
                <option value="">Select Subdistrict</option>
                {subdistricts.map((subdistrict) => (
                  <option value={subdistrict.rajaongkir_id_subdistrict} key={subdistrict._id}>
                    {subdistrict.subdistrict}
                  </option>
                ))}
              </select>
            </div>
            <div className="inputName3colLocation">
              <input required type="text" defaultValue={address} name="address" placeholder="Enter Full Address" onChange={onChangeAddress} />
              <select
                style={{ textTransform: 'capitalize' }}
                name="cityId"
                value={cityId}
                onChange={onChange}
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
              {address && cityId ? (
                <Link style={{ position: 'relative', top: '5px' }} to="#" onClick={openModal}>
                  <i className="fa fa-map-marker"></i> EDIT MAP
                </Link>
              ) : (
                <Link
                  style={{ position: 'relative', top: '5px' }}
                  disabled
                  to="#"
                >
                  <i className="fa fa-map-marker"></i> Fill in address & city
                </Link>
              )}
            </div>
            <br />
            <button type="submit" className="btn btn-brown">ADD NEW ADDRESS</button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            width: "800px",
            top: "52%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            position: "relative",
          },
        }}
        contentLabel="Google Map Location"
      >
        <div>
          <label htmlFor="locationAdd">
            Edit map location address (please include city &amp; country)
          </label>
          <div className="form-control">
            <input
              type="text"
              placeholder="Enter location address &amp; city..."
              value={geolocation}
              required
              onChange={(e) => addGeolocation(e.target.value)}
            />
          </div>

        </div>
        <button style={{ position: 'absolute', top: '20px', right: '20px', border: 'none' }}
          onClick={closeModal}
        >
          <i className="fa fa-times" style={{ fontSize: '15px' }}></i>
        </button>
        <MapContainer lng={longitude} lat={latitude} />
      </Modal>
    </LoadScript>
  );
}

export default AddAddress;