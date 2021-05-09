import React from 'react';

function DisplayNoImage() {
  return (
    <div className="productImages">
      <img style={{ borderRadius: '5px' }}
        src={process.env.PUBLIC_URL + "/assets/img/noimage.jpg"}
        alt="No content"
      />
    </div>
  );
}

export default DisplayNoImage;