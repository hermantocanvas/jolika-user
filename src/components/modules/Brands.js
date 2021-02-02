import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import { Link } from "react-router-dom";

import LocationContext from "../../context/location/locationContext";

const Brands = () => {
  const { locationId } = useContext(LocationContext);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadBrands();
    //eslint-disable-next-line
  }, []);

  async function loadBrands() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/vendors/get/homepage/${locationId}`
      );

      setBrands(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section id="homeBrands" className="py-2">
      <div className="container">
        <h2 className="sectionTitle">BRANDS</h2>
        <Swiper slidesPerView={8} spaceBetween={20}>
          {brands &&
            brands.map((brand) => (
              <SwiperSlide>
                <Link to="/">
                  <img
                    src={`${process.env.REACT_APP_APIURL}uploads/vendor/${brand.logoImage}`}
                    alt={brand.vendorName}
                  />
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Brands;
