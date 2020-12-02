import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SwiperCore, { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';

const Slideshow = () => {
  const [slideshows, setSlideshows] = useState({
    slides: null,
  });
  const { slides } = slideshows;

  useEffect(() => {
    async function loadSlideshows() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/slideshows?type=slideshow&active=yes&sort=ordering`
        );

        setSlideshows({
          ...slideshows,
          slides: res.data.data,
        });
      } catch (err) {
        console.log(err);
      }
    }
    loadSlideshows();
    //eslint-disable-next-line
  }, []);

  SwiperCore.use([Navigation]);

  return (
    <section id="homeBanners">
      <div id="homeSlideshow">
        <Swiper
          slidesPerView={1}
          navigation
        >
          <SwiperSlide><Link to="#"><img src="https://www.canvaswebdesign.com/jolika/uploads/slide1.jpg" alt="" /></Link></SwiperSlide>
          <SwiperSlide><Link to="#"><img src="https://www.canvaswebdesign.com/jolika/uploads/slide1.jpg" alt="" /></Link></SwiperSlide>
        </Swiper>
      </div>
      <div> 
        <Link to="#" className="promoBanner"><img src="https://www.canvaswebdesign.com/jolika/uploads/slide-banner.jpg" alt="" /></Link>
        <Link to="#" className="promoBanner"><img src="https://www.canvaswebdesign.com/jolika/uploads/slide-banner2.jpg" alt="" /></Link>
      </div>
    </section>
  );
};

export default Slideshow;
