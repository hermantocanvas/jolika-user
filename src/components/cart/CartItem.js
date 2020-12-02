import React, { useContext } from "react";
import CartContext from "../../context/cart/cartContext";
import AlertContext from "../../context/alert/alertContext";
import { Link } from "react-router-dom";
const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});
const CartItem = ({ product, isShowShopName, cartInfo }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const cartContext = useContext(CartContext);
  const {
    incrementAmount,
    decrementAmount,
    removeItemFromCart,
    updateNote,
  } = cartContext;
  // const [note, setNote]
  const handleIncrement = (e) => {
    if (cartInfo.quantity >= product.stock) {
      setAlert(
        `Maaf stok tinggal ${product.stock}. Silahkan memilih kuantitas lebih kecil`,
        "danger"
      );
      return;
    }
    incrementAmount({
      id: product.productCombination_id || product.product_id,
    });
  };

  const handleDecrement = (e) => {
    if (cartInfo.quantity <= 1) {
      handleRemove();
    } else {
      decrementAmount({
        id: product.productCombination_id || product.product_id,
      });
    }
  };

  const handleRemove = () => {
    const removeConfirm = window.confirm("Remove product form cart?");
    if (removeConfirm) {
      removeItemFromCart({
        id: product.productCombination_id || product.product_id,
      });
    }
  };

  const { shopName } = product.user.sellerInfo;
  const total = formatter.format(
    parseInt(product.marketplacePrice) * parseInt(cartInfo.quantity)
  );

  const productName = product.name;

  return (
    <div className="checkout_table_item clearfix">
      {isShowShopName && (
        <p>
          {shopName}
          <br />
          <span style={{ fontSize: "12px" }}>
            {product.district.district}, {product.province.province}
          </span>
        </p>
      )}
      <div className="cti_img">
        <a href="#">
          {/* <img
            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${product.imagesName[0]}`}
            alt='product'
          /> */}
          <img
            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${product.image}`}
            alt="product"
          />
        </a>
      </div>
      <div className="cti_dsc cht_mp_desc">
        <div className="cti_title">
          <Link to={`produk-marketplace/${product.slug}`}>{productName}</Link>
        </div>
        <div className="cti_harga_tawar cht_mp">
          <ul>
            <li>
              <span>Harga</span>
              {formatter.format(product.marketplacePrice)}
            </li>
            <li className="qty_bx">
              <div className="qty_bx_in">
                <span>Qty</span>
                <div className="def-number-input number-input safari_only">
                  <button onClick={handleDecrement} className="minus"></button>
                  <input
                    className="quantity"
                    min="0"
                    name="quantity"
                    value={cartInfo.quantity}
                    type="number"
                  />
                  <button className="plus" onClick={handleIncrement}></button>
                </div>
              </div>
            </li>
            <li className="ttl">
              <span>Total</span>
              {total}
            </li>
            <li className="hps" onClick={handleRemove}>
              <span>Hapus</span>
              <i className="fa fa-close"></i>{" "}
            </li>
          </ul>
          {/* {cartInfo.note && (
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              Catatan: {cartInfo.note}
            </p>
          )} */}
          <br />
          <label htmlFor="exampleSelect1" style={{ fontSize: "14px" }}>
            Catatan untuk toko
          </label>
          <input
            style={{ maxWidth: "210px", width: "210px" }}
            type="text"
            className="form-control"
            placeholder={`Contoh: Warna Putih, Size M`}
            name="customerNote"
            value={cartInfo.note}
            onChange={(e) =>
              updateNote({
                id: product.productCombination_id || product.product_id,
                note: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CartItem;
