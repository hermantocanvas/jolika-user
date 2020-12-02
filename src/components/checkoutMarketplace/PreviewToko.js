import React, { useContext } from 'react';
import PreviewItem from './PreviewItem';
import CourrierForm from './CourrierForm';
import CartContext from '../../context/cart/cartContext';

const PreviewToko = ({ cart, formData }) => {
  const cartContext = useContext(CartContext);
  const { getProductByCartItem } = cartContext;
  const someProduct = getProductByCartItem(cart[0]);

  if (!someProduct) return null;
  const seller = someProduct.user;
  const province = someProduct.province.province;
  const district = someProduct.district.district;

  return (
    <div className='checkout_table_item clearfix'>
      <p>
        {seller.name}
        <br />
        <span style={{ fontSize: '12px' }}>
          {district}, {province}
        </span>
      </p>
      {cart.map((cartItem, index) => {
        const product = getProductByCartItem(cartItem);
        if (!product) return null;
        if (index === 0) {
          return (
            <PreviewItem
              key={`${index}${product.user._id}`}
              cartItem={cartItem}
              product={product}
            >
              <CourrierForm
                cartItem={cartItem}
                product={product}
                formData={formData}
              />
            </PreviewItem>
          );
        } else {
          return (
            <PreviewItem key={index} cartItem={cartItem} product={product} />
          );
        }
      })}
    </div>
  );
};

export default PreviewToko;
