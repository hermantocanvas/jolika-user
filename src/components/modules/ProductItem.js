import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({ product }) => {
  if (product) {
    let imgUrl;
    let price;
    let discountedPrice;

    if(product.combinations && product.combinations.length > 0) {
      imgUrl = product.combinations[0].images[0].fileName;
      price = product.combinations[0].price;
      discountedPrice = product.combinations[0].discountedPrice;
    } else {
      imgUrl = product.images[0].fileName;
      price = product.price;
      discountedPrice = product.discountedPrice;
    }

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    return (
      <div className="productItem">
        <Link to={`/product/${product.slug}`} className="img-product">
          <img
            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${imgUrl}`}
            alt={product.name}
          />
        </Link>
        <div className="productItemText">
          <div className="ProductTitlePrice">
            <h4>
              <Link to="/">{product.vendorId.vendorName}</Link>
            </h4>
            <p>
              <Link to={`/product/${product.slug}`}>{product.name}</Link>
            </p>
            <span>
              <Link to={`/product/${product.slug}`}>
                {discountedPrice > 0
                  ? formatter.format(price)
                  : formatter.format(discountedPrice)}
              </Link>
            </span>
          </div>
          {product.preorderDay > 0 && (
            <div className="productItemDate">
              <i className="fa fa-clock"></i> 2d
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductItem;
