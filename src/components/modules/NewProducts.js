import React, { useEffect, useState, useContext } from "react";
import ProductItem from "./ProductItem";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import LocationContext from "../../context/location/locationContext";

const NewProducts = () => {
  const { locationId } = useContext(LocationContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
    //eslint-disable-next-line
  }, [locationId]);

  async function loadProducts() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/get/new/${locationId}`
      );

      setProducts(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section id="homeNewIn" className="py-2">
      <div className="container">
        <h2 className="sectionTitle">NEW IN</h2>
        <Swiper slidesPerView={4} spaceBetween={20}>
          {products &&
            products.map((product, index) => (
              <SwiperSlide key={index}>
                <ProductItem product={product} />
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default NewProducts;
