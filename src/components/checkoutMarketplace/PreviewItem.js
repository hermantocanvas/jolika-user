import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';

const formatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const PreviewItem = ({ children, cartItem, product }) => {
  const image = (product && product.image) || '';
  const name = (product && product.name) || '';
  const marketplacePrice = (product && product.marketplacePrice) || '';
  const weight = (product && product.weight) || '';
  const quantity = cartItem.quantity;
  const note = cartItem.note;

  if (!product) return null;
  return (
    <Fragment>
      <div className='checkout_table_item clearfix'>
        <div className='cti_img'>
          <Link>
            <img
              src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${image}`}
              alt='produk'
            />
          </Link>
        </div>
        <div className='cti_dsc cht_mp_desc'>
          <div className='cti_title'>
            <Link>{name}</Link>
          </div>
          <div className='cti_harga_tawar cht_mp'>
            <ul>
              <li>
                <span>Harga</span>
                {formatter.format(parseInt(marketplacePrice))}
                <div>
                  <span>
                    {weight}
                    gr
                  </span>
                </div>
              </li>
              <li className='qty_bx'>
                <div className='qty_bx_in'>
                  <span>
                    {quantity} barang ({parseInt(weight) * parseInt(quantity)}
                    gr)
                  </span>
                </div>
              </li>
              <li className='ttl'>
                <span>Total</span>
                {formatter.format(
                  parseInt(marketplacePrice) * parseInt(quantity)
                )}
              </li>
              <li className='ttl'>{children}</li>
            </ul>
            <p style={{ fontSize: '12px', marginTop: '10px' }}>
              Catatan: {note}
            </p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PreviewItem;
