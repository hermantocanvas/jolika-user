import React from 'react';

const NotFound = () => {
  return (
    <section className='page-section color'>
      <div className='container'>
        <div className='row'>
          <div
            className='col-sm-6 col-sm-offset-3'
            style={{ textAlign: 'center', color: 'black' }}
          >
            <h1 style={{ color: 'black' }}>
              <span style={{ fontSize: '60px' }}>404</span>
              <br /> Halaman tidak ditemukan
            </h1>
            <h3 style={{ color: 'black' }}>
              Mungkin telah dihapus atau Anda salah ketik alamat.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
