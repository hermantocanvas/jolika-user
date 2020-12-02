import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";
import { Link } from "react-router-dom";

const DisplayImage = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  // useEffect(() => {
  //   setNav2(slider2);
  // }, [slider2]);

  // useEffect(() => {
  //   setNav1(slider1);
  // }, [slider1]);

  // const imagesToShow = images.length > 4 ? images : [...images, ...images];

  return (
    <div className="productImages">
      <Swiper slidesPerView={1} navigation>
        <SwiperSlide>
          <Link to="#">
            <img
              src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to="#">
            <img
              src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
      </Swiper>

      {/* <div className="swiper-container productPageSwiper">
        <div div className="swiper-wrapper">
          <div className="swiper-slide swiper-main">
            <div className="swiper-zoom-container">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
          </div>
          <div className="swiper-slide swiper-main">
            <div className="swiper-zoom-container">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
          </div>
          <div className="swiper-slide swiper-main">
            <div className="swiper-zoom-container">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
          </div>
        </div>
        <div className="swiper-container gallery-thumbs">
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
            <div className="swiper-slide">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
            <div className="swiper-slide">
              <img
                src="https://www.canvaswebdesign.com/jolika/uploads/product-detail.jpg"
                className="media-object img-circle thumbnail"
                alt=""
              />
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DisplayImage;
