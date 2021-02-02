import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import LocationContext from "../../context/location/locationContext";

const LocationMenu = () => {
  const { locationId, changeLocation } = useContext(LocationContext);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    loadCities();
    //eslint-disable-next-line
  }, []);

  async function loadCities() {
    try {
      const cities = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities`
      );

      setCities(cities.data.data);
    } catch (err) {
      console.log(err.message, "danger");
    }
  }

  const onChangeCity = (e) => {
    changeLocation(e.target.value);
  };

  return (
    <div id="categoryMenu">
      <i className="fa fa-map-marker-alt"></i>
      <select
        onChange={onChangeCity}
        id="chooseLocation"
        style={styles.capitalize}
        value={locationId}
      >
        {cities &&
          cities.map((city, index) => (
            <option key={index} value={city._id}>
              {city.cityName}
            </option>
          ))}
      </select>
    </div>
  );
};

const styles = {
  capitalize: {
    textTransform: "capitalize",
  },
};

export default LocationMenu;
