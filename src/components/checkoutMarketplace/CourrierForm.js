import React, { Fragment, useEffect, useState, useContext } from 'react';
import CartContext from '../../context/cart/cartContext';
import useShipping, { courrierInfo, group } from './useShipping/useShipping';

const CourrierForm = ({ cartItem, formData, product }) => {
  const cartContext = useContext(CartContext);
  const { addShipping, getTotalWeightBySellerId, clearShippings } = cartContext;

  const [selectedShipping, setSelectedShipping] = useState({});
  const [selectedValue, setSelectedValue] = useState('');

  const originSubdistrictId = product.subdistrict.rajaongkir_id_subdistrict;
  const destinationSubdistrictId = formData.subdistrictId;

  const seller_id = cartItem.seller_id;
  const weight = getTotalWeightBySellerId(seller_id);
  const [shippingData] = useShipping(
    originSubdistrictId,
    destinationSubdistrictId,
    weight
  );

  useEffect(() => {
    clearShippings();
  }, [destinationSubdistrictId]);

  useEffect(() => {
    if (selectedShipping.courrierName) {
      const value =
        courrierInfo[selectedShipping.courrierName][selectedShipping.type][
          'value'
        ];
      addShipping({
        seller_id: seller_id,
        shipping: {
          ...selectedShipping,
          value,
        },
      });
    } else {
      addShipping({
        seller_id: seller_id,
        shipping: {
          fee: '',
          value: '',
        },
      });
    }
  }, [selectedShipping]);

  const handleSelectShipping = (e) => {
    setSelectedValue(e.target.value);

    if (!e.target.value) {
      setSelectedShipping({});
      return;
    }

    setSelectedShipping(shippingData[e.target.value]);
  };

  if (!product) return null;

  return (
    <Fragment>
      <label>Pilih Pengiriman ({weight} gr)</label>
      <select value={selectedValue} onChange={handleSelectShipping}>
        <option value=''>Pilih Kurir...</option>
        {group.map((group, i) => {
          return (
            <optgroup key={i} label={group.label}>
              {shippingData.map((sd, idx) => {
                if (!sd.fee || sd.type !== group.type) return null;

                const productInfo = product.shippings.find(
                  (ps) => ps.name === sd.courrierName && ps.type === group.type
                );

                if (!productInfo || !productInfo.isShipping) {
                  return null;
                }

                return (
                  <option key={idx} value={idx}>
                    {courrierInfo[sd.courrierName][group.type]['label']} {` - `}
                    {sd.fee}
                  </option>
                );
              })}
            </optgroup>
          );
        })}
      </select>
    </Fragment>
  );
};

export default CourrierForm;
