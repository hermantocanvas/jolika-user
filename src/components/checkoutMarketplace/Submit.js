import React, { useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import AlertContext from '../../context/alert/alertContext';
import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';
const Submit = ({ formData }) => {
  let history = useHistory();
  const { setAlert } = useContext(AlertContext);
  const cartContext = useContext(CartContext);

  const { currentUser } = useContext(AuthContext);
  const buyer_id = (currentUser && currentUser._id) || '';

  const {
    isShippingReady,
    shippings,
    getCheckoutGrandTotalBySellerId,
    removeItemFromCart,
    clearShippings,
    clearProducts,
    getCartGroupBySellerId,
    getProductByCartItem,
  } = cartContext;

  const isReadyToOrder = () => {
    let ready = true;
    if (!formData.recipientName) {
      ready = false;
      setAlert('isi recipientName', 'danger');
    }
    if (!formData.handphone) {
      ready = false;
      setAlert('isi handphone', 'danger');
    }
    if (!formData.address) {
      ready = false;
      setAlert('isi address', 'danger');
    }
    if (!formData.districtId) {
      ready = false;
      setAlert('isi districtId', 'danger');
    }
    if (!formData.provinceId) {
      ready = false;
      setAlert('isi provinceId', 'danger');
    }
    if (!formData.subdistrictId) {
      ready = false;
      setAlert('isi subdistrictId', 'danger');
    }
    if (!formData.postcode) {
      ready = false;
      setAlert('isi postcode', 'danger');
    }

    return ready;
  };

  const handleBuy = () => {
    if (!isShippingReady() || !isReadyToOrder()) return;
    const carts = getCartGroupBySellerId();
    const orders = [];
    carts.forEach((cart) => {
      const seller_id = cart[0].seller_id;
      const chosenShipping = shippings[seller_id]
        ? shippings[seller_id].name
        : '';
      const shippingFee = shippings[seller_id] ? shippings[seller_id].fee : '';
      const grandTotal = getCheckoutGrandTotalBySellerId(seller_id);

      const productMarketplaceDetails = cart.map((item) => {
        const product = getProductByCartItem(item);
        return {
          product_id: product.product_id,
          price: product.marketplacePrice,
          quantity: item.quantity,
          note: item.note,
          productCombination_id: product.productCombination_id,
        };
      });

      orders.push({
        sellerId: seller_id,
        buyerId: buyer_id,

        recipientName: formData.recipientName,
        recipientHandphone: formData.handphone,
        recipientAddress: formData.address,
        recipientPostcode: formData.postcode,
        recipientCountryId: formData.addressCountryId,
        recipientProvinceId: formData.provinceId,
        recipientDistrictId: formData.districtId,
        recipientSubdistrictId: formData.subdistrictId,

        chosenCarrier: chosenShipping,
        shippingFee: shippingFee,
        grandTotal: grandTotal,
        productMarketplaceDetails: productMarketplaceDetails,

        orderSource: 'marketplace',
      });
    });
    createTransaction(orders);
  };

  async function createTransaction(orders) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const URL = `${process.env.REACT_APP_APIURL}api/v1/cart/checkout`;
    const formData = { orders: orders };
    try {
      const res = await axios.post(URL, formData, config);

      clearShippings();
      clearProducts();

      for (const newOrder of res.data.data.orders) {
        newOrder.productMarketplaceDetails.forEach((product) => {
          removeItemFromCart({
            id: product.productCombination_id || product.product_id,
          });
        });
      }

      setAlert('Sukses', 'success');
      history.push(`/checkout/${res.data.data.transaction.paymentId}`);
    } catch (err) {
      console.log(err.response);
      setAlert(err.response.data.error, 'danger');
    }
  }

  return (
    <div
      className='row margin_bottom'
      style={{
        float: 'right',
        paddingTop: '30px',
        paddingBottom: '30px',
        position: 'relative',
        right: '20px',
      }}
    >
      <button className='my_button rounded' onClick={handleBuy}>
        <i className='lni lni-shopping-basket'></i> Buat Order dan Lanjut ke
        Pembayaran{' '}
      </button>
    </div>
  );
};

export default Submit;
