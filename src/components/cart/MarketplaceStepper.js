import React from 'react';

const Stepper = ({ step }) => {
  return (
    <div className='cbt_header'>
      <ul>
        <li className={step === 1 ? '' : 'disable'}>
          <a href='#'>
            <span className='angka'>1</span> Cart
          </a>
        </li>
        <li className={step === 2 ? '' : 'disable'}>
          <a href='#'>
            <span className='angka'>2</span> Checkout
          </a>
        </li>
        <li className={step === 3 ? '' : 'disable'}>
          <a href='#'>
            <span className='angka'>3</span> Pembayaran
          </a>
        </li>
        <li className={step === 4 ? '' : 'disable'}>
          <a href='#'>
            <span className='angka'>4</span> Selesai
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Stepper;
