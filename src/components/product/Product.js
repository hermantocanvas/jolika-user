import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";

import AlertContext from "../../context/alert/alertContext";
import ProductDetail from "./ProductDetail";
import AuthContext from "../../context/auth/authContext";
import SimilarProducts from "./Similarproducts";

const Product = ({ match }) => {
  const { setAlert } = useContext(AlertContext);
  const { setLastProductPage } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [productCombination, setProductCombination] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [cities, setCities] = useState({
    province: null,
    district: null,
    subdistrict: null,
  });

  useEffect(() => {
    // loadProduct();
    // setLastProductPage(`/produk-marketplace/${match.params.alias}`);
    //eslint-disable-next-line
  }, []);

  async function loadProduct() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/marketplace/${match.params.alias}`
      );

      setProduct({
        ...res.data.data,
      });

      //load cities data
      try {
        const citiesData = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/data/${res.data.data.provinceId}&${res.data.data.districtId}&${res.data.data.subdistrictId}`
        );

        if (citiesData) {
          setCities({
            province: citiesData.data.data.province,
            district: citiesData.data.data.district,
            subdistrict: citiesData.data.data.subdistrict,
          });
        }
      } catch (err) {
        if (err.response) {
          setAlert(err.response.data.error, "danger");
        }
      }
    } catch (err) {
      if (err.response) {
        setAlert(err.response.data.error, "danger");
      }
    }
  }
  useEffect(() => {
    if (product) {
      console.log(product.imagesName);
    }
  }, [product]);
  // if (
  //   product === null ||
  //   product.length === 0 ||
  //   cities.province === null ||
  //   cities.district === null ||
  //   cities.subdistrict === null
  // ) {
  //   return null;
  // }

  // let images = product.imagesName;
  // let marketPrice = product.marketPrice;
  // let marketplacePrice = product.marketplacePrice;
  // let stock = product.stock;
  // let productName = product.name;

  // if (productCombination) {
  //   images = [productCombination.image, ...images];
  //   marketPrice = productCombination.marketPrice;
  //   marketplacePrice = productCombination.marketplacePrice;
  //   stock = productCombination.stock;

  //   if (productCombination.variantDetail1_id) {
  //     productName += ` ${productCombination.variantDetail1_id.nameEn}`;
  //   }

  //   if (productCombination.variantDetail2_id) {
  //     productName += ` - ${productCombination.variantDetail2_id.nameEn}`;
  //   }
  // }

  return (
    <>
      <section id="productDetail">
        <div className="breadcrumb container">
          <a href="index.php">Home</a> <i className="fa fa-chevron-right"></i>{" "}
          Product <i className="fa fa-chevron-right"></i> Coco Sprinkle Cake
        </div>
        <ProductDetail />
      </section>
      <SimilarProducts />
    </>
  );
};

export default Product;
