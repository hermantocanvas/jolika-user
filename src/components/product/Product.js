import React, { useEffect, useContext, useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import "react-confirm-alert/src/react-confirm-alert.css";
import "flatpickr/dist/themes/airbnb.css";
import Flatpickr from "react-flatpickr";
import moment from "moment";
import { Helmet } from "react-helmet";
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

import AlertContext from "../../context/alert/alertContext";
import AuthContext from "../../context/auth/authContext";
import LocationContext from "../../context/location/locationContext";
import CartContext from "../../context/cart/cartContext";
import DisplayImage from "./DisplayImage";
import DisplayNoImage from "./DisplayNoImage";
import Variant from './Variant';
import Vendor from './Vendor';
import SimilarProducts from "./Similarproducts";
import Delivery from './Delivery';

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const Product = ({ match }) => {
  const { locationId } = useContext(LocationContext);
  const { setAlert } = useContext(AlertContext);
  const { addItemToCart } = useContext(CartContext);
  const { setLastProductPage } = useContext(AuthContext);
  const [vendor, setVendor] = useState(null);
  const [city, setCity] = useState(null);
  const [product, setProduct] = useState(null);
  const [chosenProduct, setChosenProduct] = useState({
    productId: null,
    images: [],
    isPreorder: false,
    preorderDay: null,
    vendorId: null,
    chosenCouriers: [],
    price: null,
    discountedPrice: null,
    qty: 1,
    productName: '',
    stock: null,
    weight: null,
    chosenVariant1: null,
    chosenVariantDetail1: null,
    chosenVariant2: null,
    chosenVariantDetail2: null,
    chosenVariant3: null,
    chosenVariantDetail3: null,
    hasVariant: false,
    chosenOptions: [],
    chosenDate: new Date(),
    customerNote: false,
    customNoteMessage: null
  });
  const { images, price, discountedPrice, qty, productName, stock, chosenVariant1, chosenVariant2, chosenVariant3, chosenVariantDetail1, chosenVariantDetail2, chosenVariantDetail3, chosenDate } = chosenProduct;
  const [selectedOption, setSelectedOption] = useState(null);

  const onChangeDate = (date) => {
    setChosenProduct({
      ...chosenProduct,
      chosenDate: date
    });
  }

  useEffect(() => {
    loadProduct();
    setLastProductPage(`/product/${match.params.alias}`);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    //update chosenProduct, because option price change
    setChosenProduct({
      ...chosenProduct,
      chosenOptions: selectedOption
    });
    //eslint-disable-next-line
  }, [selectedOption]);

  async function loadProduct() {
    try {
      //get product detail
      const product = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/visitor/${match.params.alias}`
      );
      setProduct(product.data.data);
      getChosenProduct(product.data.data);

      //get vendor detail
      const vendor = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/vendors/${product.data.data.vendorId._id}`
      );
      setVendor(vendor.data.data);

      //get city data
      const city = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities/${locationId}`
      );
      setCity(city.data.data);

    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  }

  function getChosenProduct(product) {
    if (product.combinations.length > 0) {
      //product with variants
      let newProductName = product.name + '.';
      if (product.combinations[0].combinations[0]) {
        newProductName += ` ${product.combinations[0].combinations[0]}.`;
      }
      if (product.combinations[0].combinations[1]) {
        newProductName += ` ${product.combinations[0].combinations[1]}.`;
      }
      if (product.combinations[0].combinations[2]) {
        newProductName += ` ${product.combinations[0].combinations[2]}`;
      }

      setChosenProduct({
        productId: product._id,
        images: product.combinations[0].images,
        isPreorder: product.isPreorder,
        preorderDay: product.preorderDay,
        vendorId: product.vendorId,
        chosenCouriers: product.chosenCouriers,
        price: product.combinations[0].price,
        discountedPrice: product.combinations[0].discountedPrice,
        qty: 1,
        productName: newProductName,
        stock: product.combinations[0].stock,
        weight: product.combinations[0].weight,
        chosenVariant1: product.chosenVariant1.name,
        chosenVariantDetail1: product.chosenVariant1.variantDetails[0],
        chosenVariant2: product.chosenVariant2.name,
        chosenVariantDetail2: product.chosenVariant2.variantDetails[0],
        chosenVariant3: product.chosenVariant3.name,
        chosenVariantDetail3: product.chosenVariant3.variantDetails[0],
        hasVariant: product.hasVariant,
        customerNote: false,
        customNoteMessage: null
      });
    } else {
      //product without variant
      setChosenProduct({
        productId: product._id,
        images: product.images,
        isPreorder: product.isPreorder,
        preorderDay: product.preorderDay,
        vendorId: product.vendorId,
        chosenCouriers: product.chosenCouriers,
        price: product.price,
        discountedPrice: product.discountedPrice,
        qty: 1,
        productName: product.name,
        stock: product.stock,
        weight: product.weight,
        chosenVariant1: null,
        chosenVariantDetail1: null,
        chosenVariant2: null,
        chosenVariantDetail2: null,
        chosenVariant3: null,
        chosenVariantDetail3: null,
        hasVariant: product.hasVariant,
        customerNote: false,
        customNoteMessage: null
      });
    }
  }

  if (!chosenProduct.productName) {
    return (
      <section id="productDetail">
        <div className="breadcrumb container">
          <p>LOADING PRODUCT...</p>
        </div>
      </section>
    );
  }

  // Create new Date instance for preorder
  var currDate = new Date();
  // Add a day
  if (product.isPreorder) {
    currDate.setDate(currDate.getDate() + product.preorderDay);
  }

  //handle quantity change
  const onIncreaseQty = () => {
    let newQty = qty;
    if (newQty >= stock && product.isPreorder === false) {
      setAlert('Not enough stock. Please choose smaller qty', 'danger');
      return false;
    }
    setChosenProduct({
      ...chosenProduct,
      qty: newQty + 1,
    });
  }

  //handle quantity change
  const onDecreaseQty = () => {
    let newQty = qty;

    if (newQty > 0) {
      newQty--;
      setChosenProduct({
        ...chosenProduct,
        qty: newQty,
      });
    }
  }

  const onChangeSubvariant = (e, varNumber) => {
    //check if combinations exist
    let varDetail1;
    let varDetail2;
    let varDetail3;

    switch (varNumber) {
      case 1:
        varDetail1 = e.target.value;
        varDetail2 = chosenVariantDetail2;
        varDetail3 = chosenVariantDetail3;
        break;
      case 2:
        varDetail1 = chosenVariantDetail1;
        varDetail2 = e.target.value;
        varDetail3 = chosenVariantDetail3;
        break;
      case 3:
        varDetail1 = chosenVariantDetail1;
        varDetail2 = chosenVariantDetail2;
        varDetail3 = e.target.value;
        break;
      default:
        break;
    }

    let existIndex = null;

    product.combinations.map((group, index) => {
      if (varDetail1 === group.combinations[0] && varDetail2 === group.combinations[1] && varDetail3 === group.combinations[2]) {
        //combinations exist
        existIndex = index;
      }
    });

    if (existIndex !== null) {
      //product combinations are exist
      let newProductName = product.name + '.';
      newProductName += ` ${product.combinations[existIndex].combinations[0]}.`;
      newProductName += ` ${product.combinations[existIndex].combinations[1]}.`;
      newProductName += ` ${product.combinations[existIndex].combinations[2]}`;

      setChosenProduct({
        ...chosenProduct,
        images: product.combinations[existIndex].images,
        price: product.combinations[existIndex].price,
        discountedPrice: product.combinations[existIndex].discountedPrice,
        productName: newProductName,
        stock: product.combinations[existIndex].stock,
        weight: product.combinations[existIndex].weight,
        chosenVariant1: product.chosenVariant1.name,
        chosenVariantDetail1: product.combinations[existIndex].combinations[0],
        chosenVariant2: product.chosenVariant2.name,
        chosenVariantDetail2: product.combinations[existIndex].combinations[1],
        chosenVariant3: product.chosenVariant3.name,
        chosenVariantDetail3: product.combinations[existIndex].combinations[2],
      });

    } else {
      //product combinations NOT exist
      let newProductName = product.name + '.';
      newProductName += ` ${varDetail1}.`;
      newProductName += ` ${varDetail2}.`;
      newProductName += ` ${varDetail3}`;

      setChosenProduct({
        ...chosenProduct,
        images: [],
        price: null,
        discountedPrice: null,
        qty: 1,
        productName: newProductName,
        stock: null,
        weight: null,
        chosenVariant1: product.chosenVariant1.name,
        chosenVariantDetail1: varDetail1,
        chosenVariant2: product.chosenVariant2.name,
        chosenVariantDetail2: varDetail2,
        chosenVariant3: product.chosenVariant3.name,
        chosenVariantDetail3: varDetail3,
      });
    }
  }

  //product options
  let productOptions = [];
  if (product.options && product.options.length > 0) {
    product.options.map((option) => {
      productOptions.push({
        label: option.name + ' ' + formatter.format(option.price),
        value: option.price,
      });
    });
  }

  const handleBuy = () => {
    //send to cartState
    if (!chosenDate) {
      setAlert('Please add delivery date', 'danger');
      return false;
    }

    addItemToCart(chosenProduct);
    setAlert(`Product added to cart. Click on cart icon to checkout`, "success");
  };

  function openInfo(evt, infoName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(infoName).style.display = "block";
    evt.currentTarget.className += " active";
  }

  function openDeliveryTab() {
    document.getElementById("tabDelivery").click();
  }

  return (
    <>
      <Helmet>
        <title>Jolika Product {product.name}</title>
        <meta name="description" content={`Jolika Product ${product.name}`} />
      </Helmet>
      <section id="productDetail">
        <div className="breadcrumb container">
          <Link to="/">Home</Link> <i className="fa fa-chevron-right"></i>{" "}
          Product <i className="fa fa-chevron-right"></i> {product.name}
        </div>
        <div id="productDetailContent" className="container py-1">
          {images.length > 0 ? <DisplayImage images={images} /> : <DisplayNoImage />}
          <div className="productDetail card">
            <h4>{product.vendorId.vendorName}</h4>
            <h1>{productName}</h1>
            <p>{selectedOption && selectedOption.length > 0 &&
              selectedOption.map(option => option.label + '. ')
            }</p>
            {!price || price === 0 ?
              <h3 style={{ color: 'red' }}>Product not available</h3>
              :
              <>
                {discountedPrice > 0 ?
                  <h2>{formatter.format(discountedPrice)}
                    <span style={{ color: 'grey', fontSize: '17px', textDecoration: 'line-through', marginLeft: '1rem' }}>{formatter.format(price)}</span>
                  </h2> : <h2>{formatter.format(price)}
                  </h2>
                }
              </>}
            {product.preorderDay > 0 && <div className="productPrice">
              <p>Pre Order</p>
              <p>{product.preorderDay}
                {product.preorderDay > 1 ? ' Days' : ' Day'}
              </p>
            </div>}
            {chosenVariant1 &&
              <Variant varNumber={1} variant={product.chosenVariant1} subVariant={product.chosenVariant1.variantDetails[0]} onChangeSubvariant={onChangeSubvariant} />
            }
            {chosenVariant2 &&
              <Variant varNumber={2} variant={product.chosenVariant2} subVariant={chosenVariantDetail2} onChangeSubvariant={onChangeSubvariant} />
            }
            {chosenVariant3 &&
              <Variant varNumber={3} variant={product.chosenVariant3} subVariant={chosenVariantDetail3} onChangeSubvariant={onChangeSubvariant} />
            }
            {product.options && product.options.length > 0 &&
              <div className="formGroup">
                <label htmlFor="options">Options</label>
                <ReactMultiSelectCheckboxes options={productOptions} onChange={setSelectedOption} defaultValue={selectedOption} />
              </div>
            }
            <div className="formGroup">
              <label htmlFor="daliverydate">Delivery Date</label>
              <Flatpickr
                placeholder="Choose delivery date"
                value={chosenDate}
                onChange={date => {
                  onChangeDate(date);
                }}
                options={{ minDate: moment(currDate).format('YYYY-MM-DD') }}
              />
            </div>
            <br />
            <p className="delivery">
              <a href="#tabDelivery" onClick={openDeliveryTab}>
                Check Delivery Cost
            </a>
            </p>
            {price && price > 0 &&
              <>
                <div className="formGroup">
                  <label>Quantity</label>
                  <div className="inputQty">
                    {qty > 1 ? <button
                      onClick={onDecreaseQty}
                      className="minus"
                      id="minusButton"
                    >
                      -
                    </button> : <button
                      disabled
                      onClick={onDecreaseQty}
                      className="minus"
                      id="minusButton"
                    >
                      -
                    </button>}
                    <input type="number" value={qty} placeholder="QTY" />
                    <button
                      onClick={onIncreaseQty}
                      className="plus"
                    >
                      +
                    </button>
                  </div>
                </div>
                <br />
                <button className="btn-block" onClick={handleBuy}>ADD TO CART</button>
              </>
            }
            <br />
            {vendor && <p><a target="_blank" rel="noopener noreferrer" href={`https://api.whatsapp.com/send?phone=${vendor.handphone}`}><i className="fa fa-whatsapp"></i> Ask About This Product</a></p>}
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
                className="tablinks active"
                onClick={(event) => openInfo(event, 'Description')}
                id="tabDescription"
              >
                Description
            </button>
              <button
                className="tablinks"
                onClick={(event) => openInfo(event, 'Delivery')}
                id="tabDelivery"
              >
                Delivery
            </button>
            </div>
            <div id="Description" className="tabcontent" style={{ display: 'block' }}>
              <h3>Description</h3>
              {product.description}
            </div>
            <div id="Delivery" className="tabcontent">
              <Delivery product={product} />
            </div>
          </div>
          {vendor && city && <Vendor vendor={vendor} city={city} />}
        </div>
      </section>
      <SimilarProducts />
    </>
  );
};

export default Product;
