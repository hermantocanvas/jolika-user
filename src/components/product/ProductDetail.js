import React, { useContext, useState } from "react";
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

import DisplayImage from "./DisplayImage";
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

const ProductDetail = ({ stock, product, price, discountedPrice, productName }) => {
  const { currentUser } = useContext(AuthContext);
  const { addItemToCart } = useContext(CartContext);
  const { setAlert } = useContext(AlertContext);

  const [quantity, setQuantity] = useState(1);

  //const isOwner = currentUser && currentUser._id === product.user;
 
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
        seller_id: product.user,
      });

      setAlert(
        `Produk berhasil ditambahkan ke keranjang. Klik keranjang untuk checkout`,
        "success"
      );
    }
  };

  return (
    <>
      <div id="productDetailContent" className="container py-1">
        <DisplayImage />
        <div className="productDetail card">
          <h4>KARA Bakery</h4>
          <h1>{productName}</h1>
          <h2>Rp 160.000</h2>
          <div className="productPrice">
            <p>Pre Order</p>
            <p>1 Day</p>
          </div>
          <div className="formGroup">
            <label for="size">Size</label>
            <select name="size" id="size">
              <option value="">Select Size</option>
              <option value="">30 x 10 cm</option>
              <option value="">40 x 10 cm</option>
              <option value="">50 x 10 cm</option>
            </select>
          </div>

          <div className="formGroup">
            <label for="flavor">Flavor</label>
            <select name="flavor" id="flavor">
              <option value="">Choose Flavor</option>
              <option value="">Vanilla</option>
              <option value="">Mocca</option>
              <option value="">chocolate</option>
            </select>
          </div>
          <div className="formGroup">
            <label for="flavor">Options</label>
            <div className="multiselect">
              <div className="selectBox" onclick="showCheckboxes()">
                <select>
                  <option>Select options</option>
                  <option>Gift Wrap Rp 5,000</option>
                  <option>Birthday Card Rp 15.000</option>
                </select>
              </div>
            </div>
          </div>
          <div className="formGroup">
            <label for="daliverydate">Delivery Date</label>
            <input
              id="productDeliveryDate"
              type="text"
              placeholder="Select Delivery Date"
              readonly="readonly"
              style={{ borderColor: "#ccc" }}
            />
          </div>
          <br />
          <p className="delivery">
            <a href="#tabDelivery" onclick="openDeliveryTab()">
              Check Delivery Cost
            </a>
          </p>
          <div className="formGroup">
            <label>Quantity</label>
            <div className="inputQty">
              <button
                onclick="this.parentNode.querySelector('input[type=number]').stepDown()"
                className="minus"
              >
                -
              </button>
              <input type="number" value={quantity} placeholder="QTY" onChange={setQuantity(e => e.target.value)} />
              <button
                onclick="this.parentNode.querySelector('input[type=number]').stepUp()"
                className="plus"
              >
                +
              </button>
            </div>
          </div>
          <br />
          <button className="btn-block">ADD TO CART</button>
          <br />
          <p>
            <i className="fa fa-whatsapp"></i> Ask About This Product
          </p>
          <div id="productSosmed">
            <a href="#" alt="Favorit">
              <i className="far fa-heart"></i>
            </a>
            <a href="#">
              <i className="fa fa-share" style={{ fontSize: "1rem" }}>
                {" "}
                Share
              </i>
            </a>
            <a href="#">
              <i className="fa fa-facebook"></i>
            </a>
            <a href="#">
              <i className="fa fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="container" id="productAdditionalInfo">
        <div id="specification">
          <div className="tab">
            <button
              className="tablinks"
              onclick="openInfo(event, 'Description')"
              id="tabDescription"
            >
              Description
            </button>
            <button
              className="tablinks"
              onclick="openInfo(event, 'Delivery')"
              id="tabDelivery"
            >
              Delivery
            </button>
          </div>
          <div id="Description" className="tabcontent">
            <h3>Description</h3>
            <p>
              This classic, soft coconut sponge cake filled with mocha
              buttercream between definitely be your new favorite. We put
              chocolate sprinkle as the topping as well.
            </p>
            <ul>
              <li>
                Please write the sender's name and the recipient's name on the
                order note. Otherwise, the greetings card will be blank.
              </li>
              <li>
                Keep refrigerate to extend shelf life up to 6 days. Storage in
                room temperature max. 6 hours
              </li>
              <li>Best consumed within 4 days.</li>
            </ul>
          </div>
          <div id="Delivery" className="tabcontent">
            <h3>Delivery</h3>
            <div className="formGroup">
              <label for="flavor">Delivery Courier</label>
              <select name="courier" id="courier">
                <option value="">Choose Courier</option>
                <option value="">Gojek</option>
                <option value="">Grab</option>
              </select>
            </div>
            <div className="formGroup">
              <label for="flavor">Choose Address</label>
              <select name="address" id="address">
                <option value="">Home Address</option>
                <option value="">Office Addres</option>
              </select>
            </div>

            <p style={{ textAlign: "center", marginTop: "1rem" }}>- OR -</p>

            <div className="deliveryLocation">
              <div className="addLocation" id="inputLocation">
                <input
                  type="text"
                  name="location"
                  placeholder="Enter Location"
                />
              </div>
              <iframe
                className="mapping"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.651661191244!2d106.78848361536957!3d-6.177363262252899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f6f5802f381d%3A0xe816d65037c3207a!2sCentral%20Park!5e0!3m2!1sid!2sid!4v1601348526467!5m2!1sid!2sid"
                width="100%"
                height="350"
                frameborder="0"
                style={{ border: "0" }}
                allowfullscreen=""
                aria-hidden="false"
                tabindex="0"
              ></iframe>
            </div>
            <button className="btn-block">Check Delivery Cost</button>
          </div>
        </div>
        <div id="shopInfo">
          <img src="uploads/logo-detail.jpg" alt="" />
          <div>
            <p style={{ textAlign: "center", marginBottom: "0.5rem" }}>
              Vendor Name
            </p>
            <i className="fa fa-map-marker"></i> Pantai Indah Kapuk, Jakarta
          </div>
          <a href="category.php">Visit Vendor Page</a>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
