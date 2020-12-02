import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import axios from "axios";
import { Link } from "react-router-dom";

const NewProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    loadMarketplaceProducts();
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

  if (products === null || products.length === 0) {
    return null;
  }

  return (
    <div className="list_product_hdc">
      <h2 className="module_title">
        <span>Marketplace Terbaru</span>
      </h2>
      <Link to="/browse/marketplace" className="lihat_semua">
        Lihat Semua <i className="fa fa-angle-right"></i>
      </Link>
      <ul className="lp_listing ">
        {products.map((product, i) => (
          <MarketplaceProductItem
            key={`${product._id}${i}`}
            product={product}
          />
        ))}
      </ul>
    </div>
  );
};

export default NewProducts;
