import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";

import AlertContext from "../../context/alert/alertContext";
import DisplayImage from "./DisplayImage";
import ProductDetail from "./ProductDetail";
import AuthContext from "../../context/auth/authContext";
import ProductReview from "./productReview/ProductReview";

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
    loadProduct();
    setLastProductPage(`/produk-marketplace/${match.params.alias}`);
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
  if (
    product === null ||
    product.length === 0 ||
    cities.province === null ||
    cities.district === null ||
    cities.subdistrict === null
  ) {
    return null;
  }

  let images = product.imagesName;
  let marketPrice = product.marketPrice;
  let marketplacePrice = product.marketplacePrice;
  let stock = product.stock;
  let productName = product.name;

  if (productCombination) {
    images = [productCombination.image, ...images];
    marketPrice = productCombination.marketPrice;
    marketplacePrice = productCombination.marketplacePrice;
    stock = productCombination.stock;

    if (productCombination.variantDetail1_id) {
      productName += ` ${productCombination.variantDetail1_id.nameEn}`;
    }

    if (productCombination.variantDetail2_id) {
      productName += ` - ${productCombination.variantDetail2_id.nameEn}`;
    }
  }

  return (
    <div className="wrapp product_detail">
      <div className="row">
        <div className="col-md-6">
          <DisplayImage images={images} />
        </div>
        <div className="col-md-6">
          <ProductDetail
            product={product}
            productCombination={productCombination}
            setProductCombination={setProductCombination}
            cities={cities}
            alias={match.params.alias}
            quantity={quantity}
            setQuantity={setQuantity}
            note={note}
            setNote={setNote}
          />
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="pdd_keteranga">
            <h3>Deskripsi Produk</h3>
            <div className="pdd_keteranga_in">
              <p style={{ whiteSpace: "pre-line" }}>{product.description}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <ProductReview product={product} />
        </div>
      </div>
    </div>
  );
};

export default Product;
