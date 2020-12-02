import React, { Fragment, useState, useContext, useEffect } from 'react';
import axios from 'axios';

import AlertContext from '../../context/alert/alertContext';

const AlamatPengiriman = ({ formData, setFormData }) => {
  const { setAlert } = useContext(AlertContext);

  const handleFormDataChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    loadCountries();
    loadProvinces();
    loadBuyerData();
  }, []);

  useEffect(() => {
    if (formData.provinceId) {
      loadDistricts(formData.provinceId);
    }
    //eslint-disable-next-line
  }, [formData.provinceId]);

  useEffect(() => {
    if (formData.districtId) {
      loadSubdistricts(formData.districtId);
    }
    //eslint-disable-next-line
  }, [formData.districtId]);

  const loadBuyerData = async () => {
    const resSetting = await axios.get(
      `${process.env.REACT_APP_APIURL}api/v1/setting`
    );
    const settingData = resSetting.data.data;
    if (!settingData) return;

    setFormData({
      ...formData,
      recipientName: settingData.recipientName,
      handphone: settingData.handphone,
      address: settingData.address,
      postcode: settingData.postcode,
      addressCountryId: settingData.addressCountryId,
      provinceId: settingData.addressProvinceId,
      districtId: settingData.addressDistrictId,
      subdistrictId: settingData.addressSubdistrictId,
    });
  };

  async function loadCountries() {
    try {
      const countries = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/countries`
      );
      setCountries(countries.data.data);
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  }

  const loadProvinces = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      setProvinces(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadDistricts = async (provinceId) => {
    setDistricts([]);
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      setDistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  };

  const loadSubdistricts = async (districtId) => {
    setSubdistricts([]);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );

      setSubdistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, 'danger');
    }
  };

  return (
    <div className='ckc_box'>
      <div className='ck_address'>
        <div className='ckc_box_title'>
          <i className='fa fa-map-marker'></i> Alamat Pengiriman
        </div>
        <div className='row'>
          <div className='col-sm-12 col-md-6'>
            <div className='form-group'>
              <label htmlFor='recipientName'>Nama Penerima</label>
              <input
                id='recipientName'
                type='text'
                name='recipientName'
                placeholder='Nama penerima barang...'
                required
                value={formData.recipientName}
                onChange={handleFormDataChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='handphone'>Handphone</label>
              <input
                id='handphone'
                type='text'
                name='handphone'
                placeholder='Handphone penerima barang...'
                required
                value={formData.handphone}
                onChange={handleFormDataChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='addressCountryId'>Negara</label>
              <select
                id='addressCountryId'
                name='addressCountryId'
                required
                value={formData.addressCountryId}
                onChange={handleFormDataChange}
              >
                <option value=''>Pilih Negara...</option>
                {countries.map((country) => (
                  <option value={country._id} key={country._id}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='col-sm-12 col-md-6'>
            <div className='form-group'>
              <label htmlFor='weight'>Alamat Lengkap</label>
              <textarea
                name='address'
                rows='6'
                required
                value={formData.address}
                onChange={handleFormDataChange}
              ></textarea>
            </div>
            <div className='form-group'>
              <label className='form_label' htmlFor='postcode'>
                Kode Pos (Zip)
              </label>
              <input
                type='text'
                name='postcode'
                placeholder='Kode Pos/Zip...'
                required
                value={formData.postcode}
                onChange={handleFormDataChange}
              />
            </div>
          </div>
          {formData.addressCountryId === '5f142c0c3c69e5284cb36ffb' && (
            <Fragment>
              <div className='col-sm-4'>
                {' '}
                <div className='form-group'>
                  <select
                    id='chooseAddressProvince'
                    required
                    name='provinceId'
                    value={formData.provinceId}
                    onChange={handleFormDataChange}
                  >
                    <option value=''>Pilih Provinsi...</option>
                    {provinces.map((province) => (
                      <option
                        value={province.rajaongkir_province_id}
                        key={province.rajaongkir_province_id}
                      >
                        {province.province}
                      </option>
                    ))}
                  </select>
                </div>{' '}
              </div>
              <div className='col-sm-4'>
                <div className='form-group'>
                  <select
                    id='chooseAddressDistrict'
                    name='districtId'
                    required
                    value={formData.districtId}
                    onChange={handleFormDataChange}
                  >
                    <option value=''>Pilih Kota/kabupaten...</option>
                    {districts.map((district) => (
                      <option
                        value={district.rajaongkir_id_district}
                        key={district.rajaongkir_id_district}
                      >
                        {district.district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='col-sm-4'>
                <div className='form-group'>
                  <select
                    id='chooseAddressSubdistrict'
                    name='subdistrictId'
                    required
                    value={formData.subdistrictId}
                    onChange={handleFormDataChange}
                  >
                    <option value=''>Pilih Kecamatan...</option>
                    {subdistricts.map((subdistrict) => (
                      <option
                        value={subdistrict.rajaongkir_id_subdistrict}
                        key={subdistrict.rajaongkir_id_subdistrict}
                      >
                        {subdistrict.subdistrict}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlamatPengiriman;
