import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import imageCompression from 'browser-image-compression';
import alertContext from '../../../../../context/alert/alertContext';
const VariantRow = ({ pc, loadProductCombinations }) => {
  const { setAlert } = useContext(alertContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    marketplacePrice: pc.marketplacePrice,
    marketPrice: pc.marketPrice,
    stock: pc.stock,
    weight: pc.weight,
    sku: pc.sku,
    image: pc.image,
  });

  useEffect(() => {
    setFormState({
      marketplacePrice: pc.marketplacePrice,
      marketPrice: pc.marketPrice,
      stock: pc.stock,
      weight: pc.weight,
      sku: pc.sku,
      image: '',
    });
  }, [isEditing]);

  const handleFormChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdate = () => {
    updateProductCombination();
  };

  const onImageChange = async (e) => {
    const imageFile = e.target.files[0];

    if (!imageFile.type.startsWith('image')) {
      setAlert(`File harus dalam format gambar/image`, 'danger');
      return;
    }

    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 600,
      useWebWorker: true,
      onProgress: () => null,
    };

    try {
      //compress file
      const compressedBlob = await imageCompression(imageFile, options);

      const compressedFile = new File([compressedBlob], imageFile.name, {
        lastModified: compressedBlob.lastModified,
        type: 'image/jpeg',
      });

      setFormState({ ...formState, image: compressedFile });
    } catch (error) {
      console.log(error);
    }
  };

  const updateProductCombination = async () => {
    let formData = new FormData();
    formData.append('marketplacePrice', formState.marketplacePrice);
    formData.append('marketPrice', formState.marketPrice);
    formData.append('stock', formState.stock);
    formData.append('weight', formState.weight);
    formData.append('sku', formState.sku);
    if (formState.image) {
      formData.append('files', formState.image);
    }
    try {
      const res = await axios.put(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/${pc._id}`,
        formData
      );
      const data = res.data.data;
      setIsEditing(false);
      loadProductCombinations();
    } catch (error) {
      console.log(error);
      // setAlert(error.response.data.error, 'danger');
    }
  };
  const label = pc.variantDetail2_id
    ? `${pc.variantDetail1_id.nameEn} - ${pc.variantDetail2_id.nameEn}`
    : `${pc.variantDetail1_id.nameEn}`;
  if (isEditing) {
    return (
      <tr>
        <td>{label}</td>
        <td>
          <input
            type='number'
            value={formState.marketplacePrice}
            name='marketplacePrice'
            onChange={handleFormChange}
          />
        </td>
        <td>
          <input
            type='number'
            value={formState.marketPrice}
            name='marketPrice'
            onChange={handleFormChange}
          />
        </td>
        <td>
          <input
            type='number'
            value={formState.stock}
            name='stock'
            onChange={handleFormChange}
          />
        </td>
        <td>
          <input
            type='number'
            value={formState.weight}
            name='weight'
            onChange={handleFormChange}
          />
        </td>
        <td>
          <input
            type='text'
            value={formState.sku}
            name='sku'
            onChange={handleFormChange}
          />
        </td>
        <td>
          <input type='file' onChange={onImageChange} />
          {(formState.image && (
            <img
              style={{ height: '50px' }}
              src={URL.createObjectURL(formState.image)}
              alt=''
            />
          )) ||
            'Belum ada gambar terupload'}
        </td>
        <td>
          <button onClick={onUpdate} className='btn btn-success'>
            <i className='fa fa-check'></i>
          </button>{' '}
          <button
            onClick={() => {
              setIsEditing(false);
            }}
            className='btn btn-danger'
          >
            <i className='fa fa-times'></i>
          </button>
        </td>
      </tr>
    );
  }

  if (!isEditing) {
    return (
      <tr>
        <td>{label}</td>
        <td>{pc.marketplacePrice}</td>
        <td>{pc.marketPrice}</td>
        <td>{pc.stock}</td>
        <td>{pc.weight}</td>
        <td>{pc.sku}</td>
        <td>
          <img
            style={{ height: '40px' }}
            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${pc.image}`}
            alt=''
          />
        </td>
        <td>
          <button
            onClick={() => {
              setIsEditing(true);
            }}
            className='btn btn-primary'
          >
            <i className='fa fa-pencil'></i>
          </button>{' '}
        </td>
      </tr>
    );
  }
};

export default VariantRow;
