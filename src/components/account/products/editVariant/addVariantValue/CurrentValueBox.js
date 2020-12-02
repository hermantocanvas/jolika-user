import React from 'react';

const CurrentValueBox = ({ variantDetail, deleteVariantValue }) => {
  const handleDelete = () => {
    const isConfirmed = window.confirm(`Hapus ${variantDetail.nameEn}`);

    if (isConfirmed) {
      deleteVariantValue(variantDetail._id);
    }
  };

  return (
    <div style={{ display: 'inline-block', margin: '0 20px' }}>
      {variantDetail.nameEn}
      {'  '}
      <span style={{ color: 'red', cursor: 'pointer' }} onClick={handleDelete}>
        <i className='fa fa-trash'></i>
      </span>
    </div>
  );
};

export default CurrentValueBox;
