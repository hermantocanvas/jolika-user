import React, { useState, useContext, Fragment, useEffect } from 'react';

import AlamatPengiriman from './AlamatPengiriman';
import Preview from './Preview';
import Total from './Total';

import CartContext from '../../context/cart/cartContext';

import Submit from './Submit';
const Coba = () => {
  const cartContext = useContext(CartContext);
  const { isShippingReady } = cartContext;

  const [formData, setFormData] = useState({
    recipientName: '',
    handphone: '',
    address: '',
    postcode: '',
    addressCountryId: '',
    provinceId: '',
    districtId: '',
    subdistrictId: '',
  });

  return (
    <div className='main_content'>
      <div className='wrapp'>
        <div className='row'>
          <div className='col-md-12'>
          </div>
          <div className='col-md-12'>
            <AlamatPengiriman formData={formData} setFormData={setFormData} />
          </div>
          <div className='col-md-12'>
            <Preview formData={formData} />
          </div>
          {isShippingReady() && (
            <Fragment>
              <div className='col-md-12'>
                <Total />
              </div>

              <div className='col-md-12'>
                <Submit formData={formData} />
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coba;
