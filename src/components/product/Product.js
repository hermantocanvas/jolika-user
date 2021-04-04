import React, { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";

import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import SimilarProducts from "./Similarproducts"; 
import DisplayImage from "./DisplayImage";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const Product = ({ match }) => {
  const { setAlert } = useContext(AlertContext);
  const { setLastProductPage } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [chosenDate, setChosenDate] = useState(new Date());
  
  useEffect(() => {
    loadProduct();
    setLastProductPage(`/product/${match.params.alias}`);
    //eslint-disable-next-line
  }, []);

  async function loadProduct() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/visitor/${match.params.alias}`
      );
      setProduct(res.data.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.error);
      }
    }
  }

  if (!product) {
    return null;
  }

  let images = product.images;
  let price = product.price;
  let discountedPrice = product.discountedPrice;
  let stock = product.stock;
  let productName = product.name;

  if (product.combinations.length > 0) {
    images = product.combinations[0].images;
    price = product.combinations[0].price;
    discountedPrice = product.combinations[0].discountedPrice;
    stock = product.combinations[0].stock;

    if (product.combinations[0].combinations[0]) {
      productName += ` ${product.combinations[0].combinations[0]}`;
    }

    if (product.combinations[0].combinations[1]) {
      productName += ` - ${product.combinations[0].combinations[1]}`;
    }

    if (product.combinations[0].combinations[2]) {
      productName += ` - ${product.combinations[0].combinations[2]}`;
    }
  }

  // Create new Date instance
  var currDate = new Date();
  // Add a day
  if(product.isPreorder) {
    currDate.setDate(currDate.getDate() + product.preorderDay);
  } 

  return ( 
    <>
      <section id="productDetail">
        <div className="breadcrumb container">
          <Link to="/">Home</Link> <i className="fa fa-chevron-right"></i>{" "}
          Product <i className="fa fa-chevron-right"></i> {product.name}
        </div>
        <div id="productDetailContent" className="container py-1">
        <DisplayImage images={images} />
        <div className="productDetail card">
          <h4>{product.vendorId.vendorName}</h4>
          <h1>{productName}</h1>
          <h2>{formatter.format(price)}
          {discountedPrice > 0 && <span style={{color:'grey', fontSize: '17px', textDecoration: 'line-through', marginLeft:'1rem'}}>{formatter.format(discountedPrice)}</span>}
          </h2>
          {product.preorderDay > 0 && <div className="productPrice">
            <p>Pre Order</p>
            <p>{product.preorderDay} 
            {product.preorderDay > 1 ? ' Days' : ' Day'}
            </p>
          </div>}
          {product.chosenVariant1 && 
            <div className="formGroup">
              <label htmlFor="size">{product.chosenVariant1.name}</label>
              <select name={product.chosenVariant1.name} id={product.chosenVariant1.name}>
                <option value="">Select {product.chosenVariant1.name}</option>
                {product.chosenVariant1.variantDetails.length > 0 && 
                  product.chosenVariant1.variantDetails.map((subvariant, index) => <option value={index} key={index}>{subvariant}</option>)
                }
              </select>
            </div>
          }
          {product.chosenVariant2 && 
            <div className="formGroup">
              <label htmlFor="size">{product.chosenVariant2.name}</label>
              <select name={product.chosenVariant2.name} id={product.chosenVariant2.name}>
                <option value="">Select {product.chosenVariant2.name}</option>
                {product.chosenVariant2.variantDetails.length > 0 && 
                  product.chosenVariant2.variantDetails.map((subvariant, index) => <option value={index} key={index}>{subvariant}</option>)
                }
              </select>
            </div>
          }
           {product.chosenVariant3 && 
            <div className="formGroup">
              <label htmlFor="size">{product.chosenVariant3.name}</label>
              <select name={product.chosenVariant3.name} id={product.chosenVariant3.name}>
                <option value="">Select {product.chosenVariant3.name}</option>
                {product.chosenVariant3.variantDetails.length > 0 && 
                  product.chosenVariant3.variantDetails.map((subvariant, index) => <option value={index} key={index}>{subvariant}</option>)
                }
              </select>
            </div>
          }
          {product.options && product.options.length > 0 &&
            <div className="formGroup">
              <label for="flavor">Options</label>
              <div className="multiselect">
                <div className="selectBox" onClick="showCheckboxes()">
                  <select>
                    <option value="">Select options</option>
                    {product.options.map((option, index) => <option value={option._id}>{option.name} {formatter.format(option.price)}</option>)}
                  </select>
                </div>
              </div>
            </div>
          }
          <div className="formGroup">
            <label for="daliverydate">Delivery Date</label>
            <Flatpickr
              placeholder="Choose delivery date"
              value={chosenDate}
              onChange={date => {
                setChosenDate(date);
              }}
              options={{ minDate: moment(currDate).format('YYYY-MM-DD') }}
            />
          </div>
          <br />
          <p className="delivery">
            <a href="#tabDelivery" onClick="openDeliveryTab()">
              Check Delivery Cost
            </a>
          </p>
          <div className="formGroup">
            <label>Quantity</label>
            <div className="inputQty">
              <button
                onClick="this.parentNode.querySelector('input[type=number]').stepDown()"
                className="minus"
              >
                -
              </button>
              <input type="number" value={qty} placeholder="QTY" />
              <button
                onClick="this.parentNode.querySelector('input[type=number]').stepUp()"
                className="plus"
              >
                +
              </button>
            </div>
          </div>
          <br />
          <button className="btn-block">ADD TO CART</button>
          <br />
          <p><i className="fa fa-whatsapp"></i> Ask About This Product</p>
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
              onClick="openInfo(event, 'Description')"
              id="tabDescription"
            >
              Description
            </button>
            <button
              className="tablinks"
              onClick="openInfo(event, 'Delivery')"
              id="tabDelivery"
            >
              Delivery
            </button>
          </div>
          <div id="Description" className="tabcontent">
            <h3>Description</h3>
            {product.description} 
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
                frameBorder="0"
                style={{ border: "0" }}
                allowFullScreen={true}
                aria-hidden={false}
                tabIndex="0"
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
      </section>
      <SimilarProducts />
    </>
  );
};

export default Product;
