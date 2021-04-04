import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Thumbs } from 'swiper/core';
import "swiper/swiper-bundle.min.css";

// install Swiper's Thumbs component
SwiperCore.use([Thumbs]);

const DisplayImage = ({ images }) => {

  // store thumbs swiper instance
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="productImages">
      <Swiper thumbs={{ swiper: thumbsSwiper }} slidesPerView={1}>
        {images.map((image, index) => <SwiperSlide key={index}>
          <img src={`${process.env.REACT_APP_APIURL}uploads/products/${image.fileName}`} alt="product images" />
        </SwiperSlide>)}
      </Swiper>
      <div style={{display:'flex', justifyContent:'center'}}>
        <Swiper
          onSwiper={setThumbsSwiper}
          watchSlidesVisibility
          watchSlidesProgress
          slidesPerView={3}
          spaceBetween={8}
          style={{display:'flex', justifyContent:'center'}}
          breakpoints={{
            // when window width is >= 768px
            768: {
              width: 768,
              slidesPerView: 5,
            },
          }}
        >
          {images.map((image, index) => 
          <SwiperSlide key={index}>
            <img src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${image.fileName}`} alt="product thumbnails" />
          </SwiperSlide>)}
        </Swiper>
      </div>
    </div>
  );
};

export default DisplayImage;
