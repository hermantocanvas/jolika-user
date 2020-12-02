import React, { useContext, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';
import Stepper from './MarketplaceStepper';
import CartItem from './CartItem';
const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const Cart = () => {
  const cartContext = useContext(CartContext);
  const {
    getCartCount,
    loadProducts,
    getMarketplacePriceTotal,
    getCartGroupBySellerId,
    getProductByCartItem,
  } = cartContext;

  const authContext = useContext(AuthContext);
  const { currentUser, isAuthenticated, setLastProductPage } = authContext;

  useEffect(() => {
    setLastProductPage(`/cart`);
    loadProducts();
    //eslint-disable-next-line
  }, []);

  //check if user is authenticated, if not, then redirect to  login
  if (!isAuthenticated && !currentUser) {
    return <Redirect to='/login' />;
  }

  if (getCartCount() < 1) {
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <h3>Keranjang Belanja Anda</h3>
            <hr />
            <p>
              Belum ada produk dikeranjang. Silahkan berbelanja terlebih dahulu.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const rows = [];
  getCartGroupBySellerId().forEach((items) => {
    items.forEach((item, index) => {
      const product = getProductByCartItem(item);
      if (!product) return;
      if (index === 0) {
        rows.push(
          <CartItem
            key={product.productCombination_id}
            product={product}
            isShowShopName={true}
            cartInfo={item}
          />
        );
      } else {
        rows.push(
          <CartItem
            key={product.productCombination_id}
            product={product}
            isShowShopName={false}
            cartInfo={item}
          />
        );
      }
    });
  });

  return (
    <Fragment>
      <div className='wrapp product_detail'>
        <div className='row'>
          <div className='col-md-12'>
            <Stepper step={1} />

            <div className='ckc_box_in'>
              <div className='checkout_box'>
                <div className='checkout_table'>{rows}</div>
              </div>
            </div>

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
                    {formatter.format(getMarketplacePriceTotal())}
                  </div>
                </div>
              </div>
              {(() => {
                if (getCartCount() > 0) {
                  return (
                    <div className='checkout_footer_button'>
                      <Link to='/checkout' className='my_button bordered'>
                        Checkout <i className='fa fa-arrow-right'></i>{' '}
                      </Link>
                    </div>
                  );
                } else {
                  return (
                    <div className='checkout_footer_button'>
                      <Link to='/' className='my_button bordered'>
                        Lanjut Belanja <i className='fa fa-arrow-left'></i>{' '}
                      </Link>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
