import React from 'react';

function AddressItem({ address }) {
  return (
    <tr>
      <td>{address.addressType}</td>
      <td>{address.address}</td>
      <td>Sawah Besar</td>
      <td>Jakarta Pusat</td>
      <td>DKI Jakarta</td>
      <td>Edit</td>
      <td>Delete</td>
    </tr>
  );
}

export default AddressItem;