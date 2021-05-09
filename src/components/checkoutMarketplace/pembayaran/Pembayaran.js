import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PilihPembayaran from './PilihPembayaran';

const Pembayaran = ({ match }) => {
  return (
    <div className='wrapp product_detail'>
      <div className='row'>
        <div className='col-md-12'>

          <PilihPembayaran paymentId={match.params.paymentId} />
        </div>
      </div>
    </div>
  );
};

export default Pembayaran;
