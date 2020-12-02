import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { Link } from "react-router-dom";

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

  //Slick slider setting
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 300,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };

  //do not render slideshow component if there is no slideshow
  // if (slides === null || slides.length === 0) {
  //   return null;
  // }
  return (
    <div className="slide_box">
      <div className="sb_left top_slide">
        {(() => {
          if (slides && slides.length > 0) {
            return (
              <Slider {...settings}>
                {slides.map((slide) => {
                  return (
                    <div key={slide._id}>
                      <a href={slide.urlLink}>
                        <img
                          src={`${process.env.REACT_APP_APIURL}uploads/${slide.imageFileName}`}
                        />
                      </a>
                    </div>
                  );
                })}
              </Slider>
            );
          }
        })()}
      </div>
      <div className="sb_right">
        <Link to="/">
          <img src="https://www.okebid.com/uploads/slideshow_844c9a4d-6c34-4723-859e-8a5a8155bbab.jpg" />
        </Link>
      </div>
    </div>
  );
};

export default Slideshow;
