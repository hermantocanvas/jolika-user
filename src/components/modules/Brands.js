import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import { Link } from "react-router-dom";

const Brands = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    //loadMarketplaceProducts();
    //eslint-disable-next-line
  }, []);

  const loadMarketplaceProducts = async (pageNumber) => {
    let URL = "";
    URL += `${process.env.REACT_APP_APIURL}api/v1/browse/marketplace`;
    let formData = {};
    formData.pageNumber = parseInt(pageNumber);
    formData.limitPerPage = 12;
    formData.sort = "lastest";

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(URL, formData, config);
      const data = response.data;

      setProducts(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // if (products === null || products.length === 0) {
  //   return null;
  // }

  return (
    <section id="homeBrands" className="py-2">
    <div className="container">
      <h2 className="sectionTitle">BRANDS</h2>
      <Swiper
          slidesPerView={8}
        >
          <SwiperSlide><Link to="category.php"><img src="https://www.canvaswebdesign.com/jolika/uploads/brand6.jpg" alt="" /></Link></SwiperSlide>
      </Swiper>
    </div>
  </section>
  );
};

export default Brands;
