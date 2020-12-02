import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import AlertContext from '../../../context/alert/alertContext';

const PilihPembayaran = ({ paymentId }) => {
  let history = useHistory();
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [banktransferActive, setBanktransferActive] = useState('');
  const [paymentType, setPaymentType] = useState('');
  const paymentTypes = [
    {
      value: 'bank transfer Bca',
      label: 'BCA Bank Transfer',
      sublabel: 'Pembayaran melalui rekening BCA',
    },
    {
      value: 'bank transfer Mandiri',
      label: 'Mandiri Bank Transfer',
      sublabel: 'Pembayaran melalui rekening Mandiri',
    },
    {
      value: 'bank transfer Mega',
      label: 'Mega Bank Transfer',
      sublabel: 'Pembayaran melalui rekening Mega',
    },
  ];

  const [selectedValue, setSelectedValue] = useState(0);

  const [espayData, setEspayData] = useState({
    key: '',
    paymentId: paymentId,
    backUrl: `${process.env.REACT_APP_APIURL}thankyou`,
    display: 'select'
  });

  const handleSelectPayment = (e) => {
    setSelectedValue(parseInt(e.target.value));
    setPaymentType(paymentTypes[parseInt(e.target.value)].value);
  };

  useEffect(() => {
    setPaymentType(paymentTypes[selectedValue].value);
  }, []);

  useEffect(() => {
    getEspayPaymentForm();
  }, []);

  useEffect(() => {
    loadBanktransferActive();
  }, []);

  async function loadBanktransferActive() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/configuration/get`
      );
      setBanktransferActive(res.data.data.banktransferActive);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function getEspayPaymentForm() {
    try {
      //mengambil Espay api key dari okebid backend
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/paymentgateway/getespayapikey`
      );

      setEspayData({
        ...espayData,
        key: res.data.data,
      });

      //pemanggilan pilihan pembayaran ke payment gateway Espay
      const sgoPlusIframe = document.getElementById('sgoplus-iframe');
      if (sgoPlusIframe !== null)
        sgoPlusIframe.src = window.SGOSignature.getIframeURL({
          ...espayData,
          key: res.data.data,
        });
      window.SGOSignature.receiveForm();
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  }

  const handlePilihPembayaran = async () => {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/cart/pilih-pembayaran/transactions/`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const formData = { paymentId: paymentId, paymentType: paymentType };

    try {
      const response = await axios.post(URL, formData, config);
      if (response.data.success) {
        history.push(`/thankyou`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='ckc_box'>
      <div className='ckc_box_title'>
        <i className='fa fa-credit-card'></i> Pilih Pembayaran
      </div>
      <div className='row'>
        <div className='col-sm-4'>
          <div style={{ paddingLeft: '24px', paddingTop: '10px' }}>
            <p>
              <strong>Pembayaran Instan</strong>
            </p>
            <p>
              Checkout with confidence
              <br />
              <img
                style={{ width: '280px', maxWidth: '100%' }}
                src='https://www.nicepng.com/png/full/359-3598674_some-text-some-text-norton-secured-logo-png.png'
                alt=''
              />
            </p>
          </div>
          <iframe id='sgoplus-iframe'></iframe>
        </div>
        {banktransferActive === 'yes' && (
          <div className='col-sm-4'>
            <div style={{ paddingLeft: '24px', paddingTop: '10px' }}>
              <p>
                <strong>Manual Bank Transfer</strong>
              </p>
            </div>
            {paymentTypes.map((p, idx) => (
              <div className='ckc_box_in' key={p.value}>
                <label className='radio_ctn'>
                  {p.label} <span>{p.sublabel}</span>
                  <input
                    type='radio'
                    name='radio_payment'
                    id='transfer'
                    value={idx}
                    onClick={handleSelectPayment}
                    checked={selectedValue === idx}
                  />
                  <span className='checkmark_rd'></span>
                </label>
              </div>
            ))}
            <button
              className='my_button rounded'
              style={{ padding: '5px', fontSize: '14px', marginLeft: '20px' }}
              onClick={handlePilihPembayaran}
            >
              Bayar dengan bank transfer{' '}
            </button>
          </div>
          )}
      </div>
    </div>
  );
};

export default PilihPembayaran;
