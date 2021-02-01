import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationMenu = () => {
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

  return (
    <div id="categoryMenu">
      <i className="fa fa-map-marker-alt"></i>
      <select id="chooseLocation" style={styles.capitalize}>
        {cities &&
          cities.map((city) => (
            <option value={city._id}>{city.cityName}</option>
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
