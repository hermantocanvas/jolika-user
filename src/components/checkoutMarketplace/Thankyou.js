import React, { useContext, useEffect, Fragment, useState } from 'react';
import AuthContext from '../../context/auth/authContext';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
const Thankyou = (props) => {
  const authContext = useContext(AuthContext);
  const { currentUser, isAuthenticated } = authContext;

  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const queryObject = queryString.parse(props.location.search);
    setQuery({
      ...query,
      status: queryObject.status || '',
    });
    setLoading(false);
  }, [props.location.search]);

  if (loading) return null;

  if (query.status === 'cancel') {
    return (
      <Fragment>
        <div className='wrapp product_detail'>
          <div className='row'>
            <div className='col-md-12'>
              <div class='ck_thankyou'>
                <i class='fa fa-times-circle'></i>
                <h3>Transaksi gagal.</h3>
                <p>silakan berbelanja kembali.</p>
                <p style={{ fontSize: '16px' }}>
                  Klik untuk kembali ke halaman utama{' '}
                  <Link to='/akun/pembelian'>HOME PAGE</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className='wrapp product_detail'>
        <div className='row'>
          <div className='col-md-12'>

            <div class='ck_thankyou'>
              <i class='fa fa-check-circle'></i>
              <h3>Terima kasih untuk pembelian Anda.</h3>
              <p>Transaksi Anda sudah dibuat.</p>
              <p style={{ fontSize: '16px' }}>
                Catatan: untuk pembayaran dengan menggunakan Kartu Kredit, tagihan yang akan tercetak di lembar tagihan kartu kredit pelanggan adalah atas nama ESPAY.
              </p>
              <p style={{ fontSize: '16px' }}>
                Silahkan melanjutkan dengan proses transaksi, dengan cara klik{' '}
                <Link to='/akun/pembelian'>TRANSAKSI BELI</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Thankyou;
