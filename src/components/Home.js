import React from "react";

import Slideshow from "./modules/Slideshow";
import NewProducts from './modules/NewProducts';
import TrendingProducts from './modules/TrendingProducts';
import Brands from './modules/Brands';

const Home = () => {
  return (
    <>
      <Slideshow />
      <NewProducts />
      <TrendingProducts />
      <Brands />
    </>
  );
};

export default Home;