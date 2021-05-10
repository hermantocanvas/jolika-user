import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";

import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';
import LocationContext from "../../context/location/locationContext";
import AlertContext from "../../context/alert/alertContext";
import CartItem from './CartItem';
import CustomerInfo from './CustomerInfo';
import ShippingInfo from './ShippingInfo';
import CourierInfo from './CourierInfo';
import Summary from './Summary';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});


const Cart = () => {
  const { cart, getCartCount, removeItemFromCart } = useContext(CartContext);
  const { setAlert } = useContext(AlertContext);
  const { currentUser, isAuthenticated, setLastProductPage, loadUser } = useContext(AuthContext);
  const { locationId } = useContext(LocationContext);
  const [location, setLocation] = useState(null);
  const [voucher, setVoucher] = useState({
    voucherIsActive: false,
    voucherCode: null,
    voucherDiscAmount: null,
  });
  const { voucherIsActive, voucherCode, voucherDiscAmount } = voucher;

  const [products, setProducts] = useState([]);

  const [order, setOrder] = useState({
    buyerId: null,
    productSubTotal: 0,
    shippingFee: 0,
    discount: 0,
    grandTotal: 0,
    deliveryDate: new Date(),
    deliveryTime: new Date(),
  });
  const { productSubTotal, shippingFee, discount, grandTotal, giftMessage } = order;

  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    handphone: "",
    hpCountryCode: "+62",
    password: "",
    password2: "",
    wantToRegister: false,
  });

  const [shippingInfo, setShippingInfo] = useState({
    recipientName: '',
    handphone: '',
    handphoneCode: '+62',
    addressType: '',
    address: '',
    geolocation: '',
    longitude: -6.2,
    latitude: 106.816666,
    cityId: null,
    provinceId: null,
    districtId: null,
    subdistrictId: null,
    useGiftMessage: false,
    giftMessage: {
      from: "",
      to: "",
      message: ""
    },
  });

  const [espayData, setEspayData] = useState({
    key: "",
    paymentId: "",
    backUrl: `${process.env.REACT_APP_APIURL}thankyou`,
    display: "select",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      loadUser();
    }
    //eslint-disable-next-line 
  }, []);

  useEffect(() => {
    setProducts(cart);
    setLastProductPage(`/cart`);
    getLocation();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setTotal();
    //eslint-disable-next-line
  }, [voucher, products]);

  function setTotal() {
    //set product sub total
    let productSubTotal = 0;
    products.map(product => {
      let productPrice;
      if (product.discountedPrice > 0) {
        productPrice = product.discountedPrice;
      } else {
        productPrice = product.price;
      }
      productSubTotal = productSubTotal + (product.qty * productPrice);
    })
    setOrder({
      ...order,
      productSubTotal,
      discount: voucherDiscAmount,
      grandTotal: voucherDiscAmount > 0 ? productSubTotal - voucherDiscAmount : productSubTotal
    });
  }

  async function getLocation() {
    try {
      const location = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/cities/${locationId}`
      );
      setLocation(location.data.data);
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
      }
    }
  }

  if (!cart || getCartCount() < 1) {
    return (
      <section id="checkout" style={{ margin: '2rem' }}>
        <div id="information">
          <div id="cardInfo" style={{ minHeight: '300px' }}>
            <h2 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>YOUR ORDER</h2>
            <h3 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>There are no products in the shopping cart.</h3>
          </div>
        </div>
      </section>
    );
  }

  //handle quantity change
  const onIncreaseQty = (index) => {
    const newProducts = [...products]; //use shallow clone to copy object consists array
    let newQty = newProducts[index].qty;
    let newStock = newProducts[index].stock;
    let isPreOrder = newProducts[index].isPreorder;
    if (newQty >= newStock && isPreOrder === false) {
      setAlert('Not enough stock. Please choose smaller qty', 'danger');
      return false;
    }

    newQty = newQty + 1;
    newProducts[index].qty = newQty;
    setProducts(newProducts);
  }

  const onDecreaseQty = (index) => {
    const newProducts = [...products];
    if (newProducts[index].qty > 0) {
      newProducts[index].qty--;
      setProducts(newProducts);
    }
  }

  const deleteCartItem = (index) => {
    confirmAlert({
      title: "Remove Item?",
      message: `Are you sure to remove this item?`,
      buttons: [
        {
          label: "Yes",
          onClick: () => removeItemFromCart(index),
        },
        {
          label: "No",
          onClick: () => console.log("Cancel..."),
        },
      ],
    });
  }

  const handleAddNote = (index) => {
    const newProducts = [...products]; //use shallow clone to copy object consists array
    newProducts[index].customerNote = !newProducts[index].customerNote;
    setProducts(newProducts);
  }

  const editCustomerNote = (e, index) => {
    const newProducts = [...products]; //use shallow clone to copy object consists array
    newProducts[index].customerNoteMessage = e.target.value;
    setProducts(newProducts);
  }

  const onRedeemVoucher = async () => {
    if (voucherCode === null || voucherCode === "") {
      setAlert("Voucher code is empty", "danger");
    } else {
      //check if voucher exist
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/vouchers/getcode/${voucherCode}`
        );
        if (res.data.data) {
          if (res.data.data.discountType === "amount") {
            setVoucher({
              ...voucher,
              voucherCode: res.data.data.code,
              voucherDiscAmount: res.data.data.discountAmount,
            });
          } else if (res.data.data.discountType === "percentage") {
            setVoucher({
              ...voucher,
              voucherCode: res.data.data.code,
              voucherDiscAmount:
                (productSubTotal * res.data.data.discountAmount) / 100,
            });
          }

          setAlert("Voucher code applied successfully", "success");
        } else {
          setVoucher({
            ...voucher,
            voucherCode: null,
            voucherDiscAmount: null,
          });

          setAlert("Voucher code invalid", "danger");
        }
      } catch (err) {
        setAlert(err.response.data, "danger");
      }
    }
  };

  const onHandleVoucher = () => {
    setVoucher({
      ...voucher,
      voucherIsActive: !voucherIsActive,
      voucherCode: null,
      voucherDiscAmount: null
    });
  }

  const onChangeCustomer = (e) => setCustomer({ ...customer, [e.target.name]: e.target.value });

  const handleWantToRegister = () => {
    const newCustomer = customer;
    newCustomer.wantToRegister = !newCustomer.wantToRegister;
    setCustomer({
      ...customer,
      wantToRegister: newCustomer.wantToRegister
    });
  }

  const handleGiftMessage = () => {
    const newShipping = shippingInfo;
    newShipping.useGiftMessage = !newShipping.useGiftMessage;
    setShippingInfo({
      ...shippingInfo,
      useGiftMessage: newShipping.useGiftMessage
    });
  }

  const onChangeShipping = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const onChangeGiftMessage = (e, type) => {
    let newGiftMessage = shippingInfo.giftMessage;
    switch (type) {
      case 'from':
        newGiftMessage.from = e.target.value;
        break;
      case 'to':
        newGiftMessage.to = e.target.value;
        break;
      case 'message':
        newGiftMessage.message = e.target.value;
        break;
      default:
        break;
    }

    setShippingInfo({
      ...shippingInfo,
      giftMessage: newGiftMessage
    })
  }

  const onChangeDeliveryDate = (date) => {
    setOrder({
      ...order,
      deliveryDate: date
    });
  }

  const onChangeDeliveryTime = (date) => {
    setOrder({
      ...order,
      deliveryTime: date
    });
  }

  const onProcessOrder = () => {

    //validate customer details
    if (
      customer.firstName === "" ||
      customer.lastName === "" ||
      customer.email === "" ||
      customer.handphone === ""
    ) {
      setAlert('Please complete all customer fields', 'danger');
      return false;
    }

    if (customer.wantToRegister === true) {
      if (
        customer.password === "" ||
        customer.password2 === ""
      ) {
        setAlert('Please complete all password fields.', 'danger');
        return false;
      }

      if (customer.password !== customer.password2) {
        setAlert('Password is not the same with password confirmation.', 'danger');
        return false;
      }
    }

    //validate shipping details
    if (
      shippingInfo.recipientName === '' ||
      shippingInfo.handphone === '' ||
      shippingInfo.addressType === '' ||
      shippingInfo.address === '' ||
      shippingInfo.cityId === null ||
      shippingInfo.provinceId === null ||
      shippingInfo.districtId === null ||
      shippingInfo.subdistrictId === null
    ) {
      setAlert('Please complete all shipping fields', 'danger');
      return false;
    }

    if (shippingInfo.useGiftMessage === true) {
      if (
        shippingInfo.giftMessage.to === "" ||
        shippingInfo.giftMessage.from === "" ||
        shippingInfo.giftMessage.message
      ) {
        setAlert('Please complete gift message fields.', 'danger');
        return false;
      }
    }

    setAlert(`Order created. Please continue with payment`, "success");
  }

  async function createNewOrder() {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/orders/submit/guest`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let formData = {};
    formData.cartInfo = location.cartInfo;

    try {
      const order = await axios.post(URL, formData, config);
      // setOrderData(order.data.data);

      //initialize espay
      const key = process.env.REACT_APP_ESPAY_API_KEY;

      setEspayData({
        ...espayData,
        key,
        paymentId: order.data.data._id,
      });

      const sgoPlusIframe = document.getElementById("sgoplus-iframe");

      if (sgoPlusIframe !== null)
        sgoPlusIframe.src = window.SGOSignature.getIframeURL({
          ...espayData,
          key,
          paymentId: order.data.data._id,
        });
      window.SGOSignature.receiveForm();
    } catch (err) {
      console.log(err.response.data, "danger");
    }
  }



  return (
    <section id="checkout" style={{ margin: '2rem' }}>
      <div id="information">
        <div id="cardInfo">
          <h2 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>YOUR ORDER</h2>
          <h3 className="sectionTitleCheckout" style={{ marginBottom: '0rem' }}>You are currently ordering from {cart[0].vendorId.vendorName}</h3>
          <div className="divider">
            <h3>{cart[0].vendorId.vendorName}</h3>
            {location && <p style={{ textTransform: 'capitalize' }}>{location.cityName}</p>}
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th className="timage"></th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th className="tqty">Quantity</th>
                    <th className="tsubtotal">Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 && products.map((product, index) =>
                    <CartItem
                      key={index}
                      index={index}
                      product={product}
                      onIncreaseQty={onIncreaseQty}
                      onDecreaseQty={onDecreaseQty}
                      deleteCartItem={deleteCartItem}
                      handleAddNote={handleAddNote}
                      editCustomerNote={editCustomerNote}
                    />)}
                </tbody>
              </table>
            </div>
          </div>
          <div id="shipping_result">
            <div className="linkPromo order-2">
              <p onClick={onHandleVoucher}>Apply Promo Code</p>
            </div>
            <div className="order-1">
              {discount > 0 && <div className="subtotalProduct subTotal">
                <h4>Discount :</h4>
                <h4>{formatter.format(discount)}</h4>
              </div>}
              <div className="subtotalProduct subTotal" style={{ paddingTop: '0.5rem' }}>
                <h4>Subtotal :</h4>
                <h4>{formatter.format(productSubTotal - discount)}</h4>
              </div>
            </div>
            {voucherIsActive && <div id="noted2" className="order-3">
              <div className="voucherBlock" >
                <input type="text" id="voucher" placeholder="VOUCHER" onChange={(e) =>
                  setVoucher({ ...voucher, voucherCode: e.target.value })
                } />
                <button className="btn-block" onClick={onRedeemVoucher}>APPLY</button>
              </div>
            </div>}
          </div>
        </div>
        {!isAuthenticated && !currentUser && <CustomerInfo customer={customer} onChangeCustomer={onChangeCustomer} handleWantToRegister={handleWantToRegister} />}
        <ShippingInfo shippingInfo={shippingInfo} onChangeShipping={onChangeShipping} handleGiftMessage={handleGiftMessage} onChangeGiftMessage={onChangeGiftMessage} />
        <CourierInfo />
      </div>
      <Summary order={order} onChangeDeliveryDate={onChangeDeliveryDate} onChangeDeliveryTime={onChangeDeliveryTime} onProcessOrder={onProcessOrder} />
    </section>
  );
};

export default Cart;
