import React, { useContext } from 'react';

import CartContext from '../../context/cart/cartContext';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const Total = () => {
  const { getCheckoutGrandTotal } = useContext(CartContext);
  return (
    <div className='checkout_footer'>
      <div className='row'>
        <div className='col-md-9'>
          <div className='checkout_footer_hd'>
            Total
            <span>Produk Marketplace</span>
          </div>
        </div>
        <div className='col-md-3'>
          <div className='checkout_footer_total'>
            {formatter.format(getCheckoutGrandTotal())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Total;
