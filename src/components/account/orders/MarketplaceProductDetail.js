import React, { useState, useContext, useEffect, Fragment } from 'react';
import AlertContext from '../../../context/alert/alertContext';
import axios from 'axios';

export default function MarketplaceProductDetail({ productData }) {
  //set order data
  const [product, setProduct] = useState({});
  const [productCombination, setProductCombination] = useState({});
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  useEffect(() => {
    loadProduct();
    loadProductCombination();
    //eslint-disable-next-line
  }, []);

  async function loadProduct() {
    try {
      const product = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/getbyid/${productData.product_id}`
      );
      if (product) {
        setProduct(product.data.data);
      }
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  }
  async function loadProductCombination() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/${productData.productCombination_id}`
      );
      if (res.data.data) {
        setProductCombination(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  }

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  const weight = productCombination.weight || product.weight;
  const name = (() => {
    let tmp = product.name;
    if (productCombination.variantDetail1_id) {
      tmp += ` ${productCombination.variantDetail1_id.nameEn}`;
    }
    if (productCombination.variantDetail2_id) {
      tmp += ` - ${productCombination.variantDetail2_id.nameEn}`;
    }
    return tmp;
  })();

  const image =
    productCombination.image ||
    (product.imagesName && product.imagesName[0]) ||
    '';

  return (
    <>
      <tr>
        <td data-title='Produk'>
          <div className='row'>
            <div className='col-xs-4 col-sm-3'>
              {(() => {
                if (image) {
                  return (
                    <Fragment>
                      <img
                        alt={name}
                        src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${image}`}
                        style={{ width: '90px' }}
                      />
                    </Fragment>
                  );
                }
              })()}
            </div>
            <div className='col-xs-8 col-sm-9'>
              <p style={{ textTransform: 'capitalize' }}>
                <strong>{name}</strong>
              </p>
              Catatan Pembeli: {productData.note}
              <br />
              Berat: {weight}gr
              <br />
              Kondisi: {product.condition}
            </div>
          </div>
        </td>
        <td data-title='Harga Produk'>{formatter.format(productData.price)}</td>
        <td data-title='Kuantitas'>{productData.quantity}</td>
        <td data-title='Sub Total'>
          {formatter.format(productData.quantity * productData.price)}
        </td>
      </tr>
      <tr>
        <td colSpan='4'>
          <p>
            <strong>Deskripsi Produk:</strong>
            <br />
            {product.description}
          </p>
        </td>
      </tr>
    </>
  );
}
