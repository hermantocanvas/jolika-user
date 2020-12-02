import React from "react";
import Slideshow from "./modules/Slideshow";
import CurrentAuctions from "./modules/CurrentAuctions";
import MarketplaceNewProducts from "./modules/MarketplaceNewProducts";
import LiveLelang from "./modules/LiveLelang";
import HomeCategories from "./modules/HomeCategories";
import LelangTerbaru from "./modules/LelangTerbaru";

const Home = () => {
  return (
    <>
      <div className="wrapp">
        <Slideshow />
        <LiveLelang />
        <HomeCategories />
      </div>
      <CurrentAuctions />
      <div className="wrapp">
        <LelangTerbaru />
        <MarketplaceNewProducts />
      </div>
    </>
  );
};

export default Home;
