import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SwiperCore, { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.min.css";

import LocationContext from "../../context/location/locationContext";

const Slideshow = () => {
  const { locationId } = useContext(LocationContext);
  const [slideshows, setSlideshows] = useState([]);

  useEffect(() => {
    loadSlideshows();
    //eslint-disable-next-line
  }, [locationId]);

  async function loadSlideshows() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/slideshows/get/all/${locationId}`
      );

      setSlideshows(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  SwiperCore.use([Navigation]);

  //get promo banners
  let promoBanner1 = {
    url: "",
    image: "",
    title: "",
  };
  let promoBanner2 = {
    url: "",
    image: "",
    title: "",
  };
  let count = 0;

  if (slideshows.length > 0) {
    slideshows.forEach((banner) => {
      if (banner.type === "banner") {
        count++;
        if (count === 1) {
          promoBanner1 = {
            url: banner.urlLink,
            image: banner.imageFileName,
            title: banner.title,
          };
        } else if (count === 2) {
          promoBanner2 = {
            url: banner.urlLink,
            image: banner.imageFileName,
            title: banner.title,
          };
        }
      }
    });
  }

  return (
    <section id="homeBanners">
      <div id="homeSlideshow">
        {slideshows.length > 0 && (
          <Swiper slidesPerView={1} navigation>
            {slideshows.map((slide) => {
              if (slide.type === "slideshow")
                return (
                  <SwiperSlide key={slide._id}>
                    <Link to={slide.urlLink}>
                      <img
                        src={`${process.env.REACT_APP_APIURL}uploads/${slide.imageFileName}`}
                        alt={slide.title}
                      />
                    </Link>
                  </SwiperSlide>
                );
            })}
          </Swiper>
        )}
      </div>
      <div>
        <Link to={promoBanner1.url} className="promoBanner">
          <img
            src={`${process.env.REACT_APP_APIURL}uploads/${promoBanner1.image}`}
            alt={promoBanner1.title}
          />
        </Link>
        <Link to={promoBanner2.url} className="promoBanner">
          <img
            src={`${process.env.REACT_APP_APIURL}uploads/${promoBanner2.image}`}
            alt={promoBanner2.title}
          />
        </Link>
      </div>
    </section>
  );
};

export default Slideshow;
