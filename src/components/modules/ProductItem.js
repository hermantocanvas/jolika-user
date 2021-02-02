import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ProductItem = ({ product }) => {
  console.log(product);

  if (product) {
    const imgUrl = product.combinations[0].images[0].fileName;

    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

    const price = product.combinations[0].price;
    const discountedPrice = product.combinations[0].discountedPrice;

    return (
      <div className="productItem">
        <Link to="/" className="img-product">
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
              <Link to="/">{product.name}</Link>
            </p>
            <span>
              <Link to="/">
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
