import React, { useState, useEffect } from "react";
import Slider from "react-slick";
const images2 = [
  "https://www.canvaswebdesign.com/okebid-html/images/prdt-sam1.jpg",
  "https://www.canvaswebdesign.com/okebid-html/images/prdt-sam2.jpg",
  "https://www.canvaswebdesign.com/okebid-html/images/prdt-sam3.jpg",
  "https://www.canvaswebdesign.com/okebid-html/images/prdt-sam4.jpg",
];
const DisplayImage = ({ images }) => {
  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  const [slider1, setSlider1] = useState(null);
  const [slider2, setSlider2] = useState(null);

  useEffect(() => {
    setNav2(slider2);
  }, [slider2]);

  useEffect(() => {
    setNav1(slider1);
  }, [slider1]);

  const imagesToShow = images.length > 4 ? images : [...images, ...images];

  return (
    <div className="row">
      <div className="col-md-12">
        <div className="prd_detail_imgslider">
          <Slider asNavFor={nav2} ref={(slider) => setSlider1(slider)}>
            {imagesToShow.map((image, i) => (
              <div key={i} className="item">
                <img
                  src={`${process.env.REACT_APP_APIURL}uploads/products/${image}`}
                  alt=""
                />
              </div>
            ))}
          </Slider>
          {images.length > 1 && (
            <Slider
              asNavFor={nav1}
              ref={(slider) => setSlider2(slider)}
              slidesToShow={4}
              swipeToSlide={true}
              focusOnSelect={true}
            >
              {imagesToShow.map((image, i) => (
                <div key={i} className="item">
                  <img
                    src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${image}`}
                    alt=""
                  />
                </div>
              ))}
            </Slider>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayImage;
