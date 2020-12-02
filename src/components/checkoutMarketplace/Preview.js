import React, { useContext } from 'react';
import CartContext from '../../context/cart/cartContext';
import PreviewToko from './PreviewToko';
import { useEffect } from 'react';
const Preview = ({ formData }) => {
  const { getCartGroupBySellerId, loadProducts } = useContext(CartContext);

  useEffect(() => {
    loadProducts();
  }, []);

  const carts = getCartGroupBySellerId();

  return (
    <div className='ckc_box'>
      <div className='ckc_box_title'>
        <i className='lni lni-shopping-basket'></i> Produk Anda
      </div>
      <div className='ckc_box_in'>
        <div className='checkout_box'>
          <div className='checkout_table'>
            {carts.map((cart) => {
              return (
                <PreviewToko
                  key={cart[0].seller_id}
                  cart={cart}
                  formData={formData}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
