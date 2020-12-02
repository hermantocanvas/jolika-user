import React, { useContext } from "react";
import { Link } from "react-router-dom";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

import VariantProductMarketplace from "./variantOptions/VariantProductMarketplace";
import CartContext from "../../context/cart/cartContext";
import AuthContext from "../../context/auth/authContext";
import AlertContext from "../../context/alert/alertContext";
function capitalize(s) {
  return s.toLowerCase().replace(/\b./g, function (a) {
    return a.toUpperCase();
  });
}

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const ProductDetail = ({
  product,
  productCombination,
  setProductCombination,
  cities,
  alias,
  quantity,
  setQuantity,
  note,
  setNote,
}) => {
  const { currentUser } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);
  const { setAlert } = useContext(AlertContext);

  let productName = product.name;
  const district = cities.district.district;
  const province = cities.province.province;
  let marketPrice = product.marketPrice;
  let marketplacePrice = product.marketplacePrice;
  let stock = product.stock;

  if (productCombination) {
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

  const isOwner = currentUser && currentUser._id === product.user;
  const sellerName = product.username;

  const handleBuy = () => {
    if (quantity === "" || quantity <= 0) {
      setAlert(`Kuantitas tidak boleh 0 atau kosong".`, "danger");
    } else if (quantity > stock) {
      setAlert(
        `Maaf stok tinggal ${stock}. Silahkan memilih kuantitas lebih kecil`,
        "danger"
      );
    } else {
      //send to cartState
      addItemToCart({
        product_id: product._id,
        quantity: quantity,
        note: note,
        seller_id: product.user,
        productCombination_id: productCombination && productCombination._id,
      });

      setAlert(
        `Produk berhasil ditambahkan ke keranjang. Klik keranjang untuk checkout`,
        "success"
      );
    }
  };

  let stars = [];
  for (let i = 1; i <= 5; i++) {
    if (parseInt(product.productRating) >= i) {
      stars.push(<span key={i} className="fa fa-star star checked"></span>);
    } else {
      stars.push(<span key={i} className="fa fa-star star"></span>);
    }
  }

  let sellerStars = [];
  for (let i = 1; i <= 5; i++) {
    if (parseInt(product.sellerRating) >= i) {
      sellerStars.push(
        <span key={i} className="fa fa-star star checked"></span>
      );
    } else {
      sellerStars.push(<span key={i} className="fa fa-star star"></span>);
    }
  }

  return (
    <div className="prd_detail_des">
      <div className="pdd_title">
        <h1>{capitalize(productName)}</h1>
        <div className="pdd_meta">
          <ul>
            <li className="pdd_rating">{stars}</li>

            <li>
              <i className="fa fa-map-marker"></i>&nbsp;
              {district}, {province}
            </li>
          </ul>
        </div>
        <div className="pdd_price">
          <span className="li_coret">{formatter.format(marketPrice)}</span>
          {formatter.format(marketplacePrice)}
        </div>
        {!!product && (
          <div>
            <VariantProductMarketplace
              product={product}
              productCombination={productCombination}
              setProductCombination={setProductCombination}
            />
          </div>
        )}
        <div className="form-group selectpicker-wrapper">
          {stock < 5 && (
            <p
              style={{ fontSize: "14px", color: "#ff4866", fontWeight: "bold" }}
            >
              Stock {`<`} 5. Buruan beli sebelum habis!
            </p>
          )}

          <label
            htmlFor="quantityInput"
            style={{ fontSize: "14px", paddingTop: "6px" }}
          >
            Kuantitas
          </label>

          <div className="def-number-input number-input safari_only">
            <button
              className="minus"
              onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
            ></button>
            <input
              className="quantity"
              id="quantityInput"
              type="number"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;

                if (value > stock) {
                  return setQuantity(stock);
                }
                if (value < 1) {
                  return setQuantity(1);
                }
                return setQuantity(value);
              }}
              min={0}
            />
            <button
              className="plus"
              onClick={() => setQuantity((q) => (q < stock ? q + 1 : stock))}
            ></button>
          </div>

          <label
            htmlFor="notesInput"
            style={{ fontSize: "14px", paddingTop: "20px" }}
          >
            Tulis catatan untuk toko (opsional)
          </label>

          <input
            style={{ maxWidth: "250px", width: "250px", fontSize: "12px" }}
            type="text"
            className="form-control productDetailInput"
            placeholder={`Contoh: Warna Putih, Size M`}
            id="notesInput"
            name="customerNote"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {isOwner ? (
            <p
              style={{
                paddingTop: "20px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              Kamu adalah pemilik produk ini.
            </p>
          ) : (
            <div className="pdd_button">
              <ul>
                <div className="buttons">
                  <button
                    className="my_button productDetailInput"
                    onClick={handleBuy}
                    style={{ width: "250px", borderRadius: "5px" }}
                  >
                    <i className="lni lni-shopping-basket"></i> BELI PRODUK
                  </button>
                </div>
              </ul>
            </div>
          )}

          <div className="pdd_info_seller">
            <ul>
              <li>
                <i style={{ fontSize: "40px" }} class="fa fa-user-circle"></i>
              </li>
              <li className="ppd_seler_rating">
                <Link to={`/products-of-seller/${sellerName}`}>
                  {sellerName}
                </Link>
                <div className="seller_star">{sellerStars}</div>
                {/* <span className="add_ss">
                  {district.district}, {province.province}
                </span> */}
              </li>
            </ul>
          </div>
          <div className="social_share">
            <FacebookShareButton
              url={`http://andromeda.okebid.com/produk/${alias}`}
              quote={`Lelang ${capitalize(productName)}`}
              className="product-share-button"
            >
              <FacebookIcon size={30} square />
            </FacebookShareButton>{" "}
            <WhatsappShareButton
              url={`http://andromeda.okebid.com/produk/${alias}`}
              title={`Lelang ${capitalize(productName)}`}
              separator=". Yuk ikut lelang di "
              className="product-share-button"
            >
              <WhatsappIcon size={30} square />
            </WhatsappShareButton>{" "}
            <TwitterShareButton
              url={`http://andromeda.okebid.com/produk/${alias}`}
              title={`Lelang ${capitalize(productName)}`}
              className="product-share-button"
            >
              <TwitterIcon size={30} square />
            </TwitterShareButton>{" "}
            <EmailShareButton
              url={`http://andromeda.okebid.com/produk/${alias}`}
              subject={`Lelang ${capitalize(productName)}`}
              separator=". Yuk ikut lelang di "
              className="product-share-button"
            >
              <EmailIcon size={30} square />
            </EmailShareButton>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
