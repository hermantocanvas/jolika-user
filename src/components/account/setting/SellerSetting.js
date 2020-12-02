import React, { useState, useContext, useEffect, Fragment } from "react";
import AlertContext from "../../../context/alert/alertContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const SellerSetting = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [setting, setSetting] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    shippingRegularJne: true,
    shippingRegularJnt: false,
    shippingRegularSicepat: false,
    shippingRegularPos: false,
    shippingRegularRpx: false,
    shippingRegularWahana: false,
    shippingRegularNinja: false,
    shippingRegularRex: false,
    shippingRegularSap: false,
    shippingRegularJet: false,
    shippingRegularDse: false,
    shippingRegularLion: false,
    shippingNextDayJne: false,
    shippingNextDaySicepat: false,
    shippingNextDayPos: false,
    shippingNextDayRpx: false,
    shippingNextDayRex: false,
    shippingNextDaySap: false,
    shippingNextDayJet: false,
    shippingNextDayDse: false,
    shippingNextDayLion: false,
    countryId: "",
    provinceId: "",
    districtId: "",
    subdistrictId: "",
    password: "",
  });

  const {
    bankName,
    accountName,
    accountNumber,
    shippingRegularJne,
    shippingRegularJnt,
    shippingRegularSicepat,
    shippingRegularPos,
    shippingRegularRpx,
    shippingRegularWahana,
    shippingRegularNinja,
    shippingRegularRex,
    shippingRegularSap,
    shippingRegularJet,
    shippingRegularDse,
    shippingRegularLion,
    shippingNextDayJne,
    shippingNextDaySicepat,
    shippingNextDayPos,
    shippingNextDayRpx,
    shippingNextDayRex,
    shippingNextDaySap,
    shippingNextDayJet,
    shippingNextDayDse,
    shippingNextDayLion,
    countryId,
    provinceId,
    districtId,
    subdistrictId,
    password,
  } = setting;

  //this is for sender
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    //load setting
    loadSetting();
    //eslint-disable-next-line
  }, []);

  async function loadSetting() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/setting`
      );

      setSetting({
        ...setting,
        bankName: res.data.data.bankName,
        accountName: res.data.data.accountName,
        accountNumber: res.data.data.accountNumber,
        shippingRegularJne: res.data.data.shippingRegularJne,
        shippingRegularJnt: res.data.data.shippingRegularJnt,
        shippingRegularSicepat: res.data.data.shippingRegularSicepat,
        shippingRegularPos: res.data.data.shippingRegularPos,
        shippingRegularRpx: res.data.data.shippingRegularRpx,
        shippingRegularWahana: res.data.data.shippingRegularWahana,
        shippingRegularNinja: res.data.data.shippingRegularNinja,
        shippingRegularRex: res.data.data.shippingRegularRex,
        shippingRegularSap: res.data.data.shippingRegularSap,
        shippingRegularJet: res.data.data.shippingRegularJet,
        shippingRegularDse: res.data.data.shippingRegularDse,
        shippingRegularLion: res.data.data.shippingRegularLion,
        shippingNextDayJne: res.data.data.shippingNextDayJne,
        shippingNextDaySicepat: res.data.data.shippingNextDaySicepat,
        shippingNextDayPos: res.data.data.shippingNextDayPos,
        shippingNextDayRpx: res.data.data.shippingNextDayRpx,
        shippingNextDayRex: res.data.data.shippingNextDayRex,
        shippingNextDaySap: res.data.data.shippingNextDaySap,
        shippingNextDayJet: res.data.data.shippingNextDayJet,
        shippingNextDayDse: res.data.data.shippingNextDayDse,
        shippingNextDayLion: res.data.data.shippingNextDayLion,
        countryId: res.data.data.countryId,
        provinceId: res.data.data.provinceId,
        districtId: res.data.data.districtId,
        subdistrictId: res.data.data.subdistrictId,
      });

      //load cities for sender
      loadCountries();
      loadProvinces();
      loadDistricts(res.data.data.provinceId);
      loadSubdistricts(res.data.data.districtId);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //LOAD SENDER ADDRESSES..
  async function loadCountries() {
    try {
      const countries = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/countries`
      );
      setCountries(countries.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //load provinces
  async function loadProvinces() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      if (res) {
        setProvinces(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //load districts
  async function loadDistricts(provinceId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      if (res) {
        setDistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //load subdistricts
  async function loadSubdistricts(districtId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );
      if (res) {
        setSubdistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  const onChange = (e) =>
    setSetting({ ...setting, [e.target.name]: e.target.value });

  const onChangeCheck = (e) =>
    setSetting({ ...setting, [e.target.name]: e.target.checked });

  //Control for sender shipping address (provinces, districts, subdisticts)
  const onChangeProvince = async (e) => {
    const provinceId = e.target.value;
    setSetting({ ...setting, provinceId: provinceId });
    //reset subdistricts
    setSubdistricts([]);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      if (res) {
        setDistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeDistrict = async (e) => {
    const districtId = e.target.value;
    setSetting({ ...setting, districtId: districtId });

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );
      if (res) {
        setSubdistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeSubdistrict = async (e) => {
    const subdistrictId = e.target.value;
    setSetting({ ...setting, subdistrictId: subdistrictId });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (
      provinceId === "" ||
      districtId === "" ||
      subdistrictId === "" ||
      password === ""
    ) {
      setAlert("Mohon mengisi semua field", "danger");
    } else if (shippingRegularJne.checked === false) {
      setAlert("Shipping regular harus diisi", "danger");
    } else {
      confirmAlert({
        title: "Sudah Yakin ?",
        message: `Sudah yakin data mau disimpan ?`,
        buttons: [
          {
            label: "Ya",
            onClick: () => saveSetting(),
          },
          {
            label: "Tidak",
            onClick: () => console.log("Cancel save..."),
          },
        ],
      });

      async function saveSetting() {
        let formData = new FormData();
        formData.append("bankName", bankName);
        formData.append("accountName", accountName);
        formData.append("accountNumber", accountNumber);
        formData.append("shippingRegularJne", shippingRegularJne);
        formData.append("shippingRegularJnt", shippingRegularJnt);
        formData.append("shippingRegularSicepat", shippingRegularSicepat);
        formData.append("shippingRegularPos", shippingRegularPos);
        formData.append("shippingRegularRpx", shippingRegularRpx);
        formData.append("shippingRegularWahana", shippingRegularWahana);
        formData.append("shippingRegularNinja", shippingRegularNinja);
        formData.append("shippingRegularRex", shippingRegularRex);
        formData.append("shippingRegularSap", shippingRegularSap);
        formData.append("shippingRegularJet", shippingRegularJet);
        formData.append("shippingRegularDse", shippingRegularDse);
        formData.append("shippingRegularLion", shippingRegularLion);
        formData.append("shippingNextDayJne", shippingNextDayJne);
        formData.append("shippingNextDaySicepat", shippingNextDaySicepat);
        formData.append("shippingNextDayPos", shippingNextDayPos);
        formData.append("shippingNextDayRpx", shippingNextDayRpx);
        formData.append("shippingNextDayRex", shippingNextDayRex);
        formData.append("shippingNextDaySap", shippingNextDaySap);
        formData.append("shippingNextDayJet", shippingNextDayJet);
        formData.append("shippingNextDayDse", shippingNextDayDse);
        formData.append("shippingNextDayLion", shippingNextDayLion);
        formData.append("countryId", countryId);
        formData.append("provinceId", provinceId);
        formData.append("districtId", districtId);
        formData.append("subdistrictId", subdistrictId);
        formData.append("password", password);

        try {
          const res = await axios.put(
            `${process.env.REACT_APP_APIURL}api/v1/setting`,
            formData
          );

          setSetting({
            ...setting,
            bankName: res.data.data.bankName,
            accountName: res.data.data.accountName,
            accountNumber: res.data.data.accountNumber,
            shippingRegularJne: res.data.data.shippingRegularJne,
            shippingRegularJnt: res.data.data.shippingRegularJnt,
            shippingRegularSicepat: res.data.data.shippingRegularSicepat,
            shippingRegularPos: res.data.data.shippingRegularPos,
            shippingRegularRpx: res.data.data.shippingRegularRpx,
            shippingRegularWahana: res.data.data.shippingRegularWahana,
            shippingRegularNinja: res.data.data.shippingRegularNinja,
            shippingRegularRex: res.data.data.shippingRegularRex,
            shippingRegularSap: res.data.data.shippingRegularSap,
            shippingRegularJet: res.data.data.shippingRegularJet,
            shippingRegularDse: res.data.data.shippingRegularDse,
            shippingRegularLion: res.data.data.shippingRegularLion,
            shippingNextDayJne: res.data.data.shippingNextDayJne,
            shippingNextDaySicepat: res.data.data.shippingNextDaySicepat,
            shippingNextDayPos: res.data.data.shippingNextDayPos,
            shippingNextDayRpx: res.data.data.shippingNextDayRpx,
            shippingNextDayRex: res.data.data.shippingNextDayRex,
            shippingNextDaySap: res.data.data.shippingNextDaySap,
            shippingNextDayJet: res.data.data.shippingNextDayJet,
            shippingNextDayDse: res.data.data.shippingNextDayDse,
            shippingNextDayLion: res.data.data.shippingNextDayLion,
            provinceId: res.data.data.provinceId,
            districtId: res.data.data.districtId,
            subdistrictId: res.data.data.subdistrictId,
          });

          setAlert("Data berhasil disimpan", "success");
        } catch (err) {
          setAlert(err.response.data.error, "danger");
        }

        //clear password field
        setSetting({ ...setting, password: "" });
      }
    }
  };

  let indonesiaDetailsBlock;
  //if country is Indonesia, load additional inputs
  if (countryId === "5f142c0c3c69e5284cb36ffb") {
    indonesiaDetailsBlock = (
      <>
        <p>
          Asal Pengiriman produk dan pilihan kurir. Kamu dapat mengganti di
          halaman produk.
        </p>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseProvince"
                name="chooseProvince"
                value={provinceId || ""}
                required
                onChange={onChangeProvince}
              >
                <option value="">Pilih Provinsi...</option>
                {provinces.map((province) => (
                  <option
                    value={province.rajaongkir_province_id}
                    key={province.rajaongkir_province_id}
                  >
                    {province.province}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseDistrict"
                name="chooseDistrict"
                value={districtId || ""}
                required
                onChange={onChangeDistrict}
              >
                <option value="">Pilih Kota/kabupaten...</option>
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
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseSubdistrict"
                value={subdistrictId || ""}
                name="chooseSubdistrict"
                required
                onChange={onChangeSubdistrict}
              >
                <option value="">Pilih Kecamatan...</option>
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
          <div className="col-sm-6">
            <label className="form_label">
              <strong>Regular (1-4 Hari)</strong>
            </label>
            <div className="row">
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      JNE
                      <input
                        type="checkbox"
                        name="shippingRegularJne"
                        onChange={onChangeCheck}
                        checked={shippingRegularJne}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      J&amp;T
                      <input
                        type="checkbox"
                        name="shippingRegularJnt"
                        onChange={onChangeCheck}
                        checked={shippingRegularJnt}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      SICEPAT
                      <input
                        type="checkbox"
                        name="shippingRegularSicepat"
                        onChange={onChangeCheck}
                        checked={shippingRegularSicepat}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      POS
                      <input
                        type="checkbox"
                        name="shippingRegularPos"
                        onChange={onChangeCheck}
                        checked={shippingRegularPos}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      RPX
                      <input
                        type="checkbox"
                        name="shippingRegularRpx"
                        onChange={onChangeCheck}
                        checked={shippingRegularRpx}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      WAHANA
                      <input
                        type="checkbox"
                        name="shippingRegularWahana"
                        onChange={onChangeCheck}
                        checked={shippingRegularWahana}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      NINJA
                      <input
                        type="checkbox"
                        name="shippingRegularNinja"
                        onChange={onChangeCheck}
                        checked={shippingRegularNinja}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      REX
                      <input
                        type="checkbox"
                        name="shippingRegularRex"
                        onChange={onChangeCheck}
                        checked={shippingRegularRex}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      SAP
                      <input
                        type="checkbox"
                        name="shippingRegularSap"
                        onChange={onChangeCheck}
                        checked={shippingRegularSap}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      JET
                      <input
                        type="checkbox"
                        name="shippingRegularJet"
                        onChange={onChangeCheck}
                        checked={shippingRegularJet}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      DSE
                      <input
                        type="checkbox"
                        name="shippingRegularDse"
                        onChange={onChangeCheck}
                        checked={shippingRegularDse}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      LION
                      <input
                        type="checkbox"
                        name="shippingRegularLion"
                        onChange={onChangeCheck}
                        checked={shippingRegularLion}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <label className="form_label">
              <strong>Next Day (1 Hari)</strong>
            </label>
            <div className="row">
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      JNE
                      <input
                        type="checkbox"
                        name="shippingNextDayJne"
                        onChange={onChangeCheck}
                        checked={shippingNextDayJne}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      SICEPAT
                      <input
                        type="checkbox"
                        name="shippingNextDaySicepat"
                        onChange={onChangeCheck}
                        checked={shippingNextDaySicepat}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      POS
                      <input
                        type="checkbox"
                        name="shippingNextDayPos"
                        onChange={onChangeCheck}
                        checked={shippingNextDayPos}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      RPX
                      <input
                        type="checkbox"
                        name="shippingNextDayRpx"
                        onChange={onChangeCheck}
                        checked={shippingNextDayRpx}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      REX
                      <input
                        type="checkbox"
                        name="shippingNextDayRex"
                        onChange={onChangeCheck}
                        checked={shippingNextDayRex}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      SAP
                      <input
                        type="checkbox"
                        name="shippingNextDaySap"
                        onChange={onChangeCheck}
                        checked={shippingNextDaySap}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      JET
                      <input
                        type="checkbox"
                        name="shippingNextDayJet"
                        onChange={onChangeCheck}
                        checked={shippingNextDayJet}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      DSE
                      <input
                        type="checkbox"
                        name="shippingNextDayDse"
                        onChange={onChangeCheck}
                        checked={shippingNextDayDse}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      LION
                      <input
                        type="checkbox"
                        name="shippingNextDayLion"
                        onChange={onChangeCheck}
                        checked={shippingNextDayLion}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Fragment>
      <h3>Setting Penjualan</h3>
      <hr />
      <div
        style={{
          padding: "15px",
          background: "#c8ffc2",
          marginBottom: "30px",
        }}
      >
        Sebelum menjual produk di Okebid, silahkan melengkapi data-data di
        halaman ini.
      </div>
      <div className="details-wrap">
        <form onSubmit={onSubmit} className="form-login">
          <div className="row">
            <div className="col-md-12">
              <h3>Asal Pengiriman Produk Saya</h3>
              <hr />
              <p>Barang dikirim dari:</p>
              <div className="row">
                <div className="col-sm-12" style={{ paddingBottom: "15px" }}>
                  <label className="form_label" htmlFor="countryId">
                    Pilih Negara
                  </label>
                  <select
                    id="countryId"
                    name="countryId"
                    value={countryId || ""}
                    required
                    onChange={onChange}
                  >
                    <option value="">Pilih Negara...</option>
                    {countries.map((country) => (
                      <option value={country._id} key={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {indonesiaDetailsBlock}
            </div>
            <div className="col-md-12">
              <br />
              <h3>Rekening Bank Saya</h3>
              <hr />
              <p>
                Untuk menerima pembayaran sebagai penjual atau pembeli).
                <br />
                Mohon mengisi rekening bank dengan lengkap dan benar. Okebid
                tidak bertanggungjawab atas kesalahan penulisan data rekening.
              </p>
              <div className="row">
                <div className="col-sm-4">
                  <div className="form-group">
                    <label className="form_label" htmlFor="weight">
                      Nama Bank
                    </label>

                    <select
                      name="bankName"
                      value={bankName || ""}
                      onChange={onChange}
                      required
                    >
                      <option value="">Pilih Bank...</option>
                      <option value="BCA">BCA</option>
                      <option value="BTN">BTN</option>
                      <option value="BRI">BRI</option>
                      <option value="BNI">BNI</option>
                      <option value="CIMB NIAGA">CIMB NIAGA</option>
                      <option value="MANDIRI">MANDIRI</option>
                      <option value="OCBC NISP">OCBC NISP</option>
                      <option value="PERMATA">PERMATA</option>
                      <option value="PANIN">PANIN</option>
                      <option value="UOB">UOB</option>
                      <option value="DANAMON">DANAMON</option>
                      <option value="DBS">DBS</option>
                      <option value="HSBC">HSBC</option>
                      <option value="ANZ">ANZ</option>
                      <option value="ARTHA GRAHA">ARTHA GRAHA</option>
                      <option value="BTPN">
                        BANK TABUNGAN PENSIUNAN NASIONAL
                      </option>
                      <option value="CITIBANK">CITIBANK</option>
                      <option value="ACEH SYARIAH">ACEH SYARIAH</option>
                      <option value="AGRIS">AGRIS</option>
                      <option value="ALTOREM/PAY">ALTOREM/PAY</option>
                      <option value="ARTAJASA">
                        ARTAJASA PEMBAYARAN ELEK. (RTGS)
                      </option>
                      <option value="ARTOS">ARTOS</option>
                      <option value="ATMB LSB">ATMB LSB</option>
                      <option value="ATMBPLUS">ATMBPLUS</option>
                      <option value="BALI">BALI</option>
                      <option value="BANGKOK BANK">
                        BANGKOK BANK PUBLIC CO.LTD
                      </option>
                      <option value="BANK INDONESIA">BANK INDONESIA</option>
                      <option value="BANK INDONESIA KP JAKARTA">
                        BANK INDONESIA KP JAKARTA
                      </option>
                      <option value="BANK MEGA SYARIAH">
                        BANK MEGA SYARIAH
                      </option>
                      <option value="BANK OF AMERICA">
                        BANK OF AMERICA NA
                      </option>
                      <option value="BANK ROYAL">BANK ROYAL</option>
                      <option value="BANTEN">BANTEN</option>
                      <option value="BENGKULU">BENGKULU</option>
                      <option value="BI CABANG AMBON">
                        BI CABANG AMBON,AMB
                      </option>
                      <option value="BI CABANG BALIKPAPAN">
                        BI CABANG BALIKPAPAN,BLP
                      </option>
                      <option value="22">BI CABANG BANDA ACEH,BDA</option>
                      <option value="23">BI CABANG BANDAR LAMPUNG,BDL</option>
                      <option value="24">BI CABANG BANDUNG,BDG</option>
                      <option value="25">BI CABANG BANJARMASIN</option>
                      <option value="26">BI CABANG BATAM,BTM</option>
                      <option value="27">BI CABANG BENGKULU</option>
                      <option value="28">BI CABANG CIREBON,CRB</option>
                      <option value="29">BI CABANG DENPASAR,BALI</option>
                      <option value="30">BI CABANG JAMBI</option>
                      <option value="31">BI CABANG JAYAPURA</option>
                      <option value="32">BI CABANG JEMBER,JBR</option>
                      <option value="33">BI CABANG KEDIRI,KDR</option>
                      <option value="34">BI CABANG KENDARI,KDI</option>
                      <option value="35">BI CABANG KUPANG,KPG</option>
                      <option value="36">BI CABANG LHOKSEUMAWE,LSM</option>
                      <option value="37">BI CABANG MALANG,MLG</option>
                      <option value="38">BI CABANG MANADO,MDO</option>
                      <option value="39">BI CABANG MATARAM,CKA</option>
                      <option value="40">BI CABANG MEDAN,MDN</option>
                      <option value="41">BI CABANG PADANG,PDG</option>
                      <option value="42">BI CABANG PALANGKARAYA</option>
                      <option value="43">BI CABANG PALEMBANG,PLG</option>
                      <option value="44">BI CABANG PALU,PLS</option>
                      <option value="45">BI CABANG PEKAN BARU,PKB</option>
                      <option value="46">BI CABANG PONTIANAK,PTK</option>
                      <option value="47">BI CABANG SAMARINDA,SMD</option>
                      <option value="48">BI CABANG SEMARANG,SMG</option>
                      <option value="49">BI CABANG SIBOLGA</option>
                      <option value="50">BI CABANG SOLO,SLO</option>
                      <option value="51">BI CABANG SURABAYA,SBY</option>
                      <option value="52">BI CABANG TEGAL</option>
                      <option value="53">BI CABANG TERNATE</option>
                      <option value="54">BI CABANG UJUNG PANDANG</option>
                      <option value="55">BI CABANG YOGYAKARTA,YOG</option>
                      <option value="56">BI PURWOKERTO,PWT</option>
                      <option value="57">BI TASIKMALAYA,TSM</option>
                      <option value="BJB">BJB</option>
                      <option value="BJB SYARIAH">BJB SYARIAH</option>
                      <option value="BKE">BKE</option>
                      <option value="BNI SYARIAH">BNI SYARIAH</option>
                      <option value="BOC INDONESIA">BOC INDONESIA</option>
                      <option value="64">BPD DKI SYARIAH</option>
                      <option value="65">BPD JAMBI SYARIAH</option>
                      <option value="66">BPD JATENG SYARIAH</option>
                      <option value="67">BPD JATIM SYARIAH</option>
                      <option value="68">BPD KALBAR SYARIAH</option>
                      <option value="69">BPD KALSEL SYARIAH</option>
                      <option value="70">
                        BPD KALTIM &amp; KALTARA SYARIAH
                      </option>
                      <option value="71">BPD RIAU SYARIAH</option>
                      <option value="72">BPD SULSELBAR SYARIAH</option>
                      <option value="73">BPD SUMBAR SYARIAH</option>
                      <option value="74">BPD SUMSEL BABEL SYARIAH</option>
                      <option value="75">BPD SUMUT SYARIAH</option>
                      <option value="76">BPD YOGYAKARTA SYARIAH</option>
                      <option value="77">BPR EKA</option>
                      <option value="78">BPR KS</option>
                      <option value="80">BRI AGRONIAGA</option>
                      <option value="81">BRI SYARIAH</option>
                      <option value="82">BSM</option>
                      <option value="BTN SYARIAH">BTN SYARIAH</option>
                      <option value="BTPN SYARIAH">BTPN SYARIAH</option>
                      <option value="BUKOPIN">BUKOPIN</option>
                      <option value="BUMI ARTA">BUMI ARTA</option>
                      <option value="88">CAPITAL INDONESIA</option>
                      <option value="CCB INDONESIA">CCB INDONESIA</option>
                      <option value="CIMB NIAGA SYARIAH">
                        CIMB NIAGA SYARIAH
                      </option>
                      <option value="COMMONWEALTH">COMMONWEALTH</option>
                      <option value="CTBC INDONESIA">CTBC INDONESIA</option>
                      <option value="DANAMON SYARIAH">DANAMON SYARIAH</option>
                      <option value="DEUTSCHE BANK">DEUTSCHE BANK AG.</option>
                      <option value="98">DINAR</option>
                      <option value="99">DIY</option>
                      <option value="DKI">DKI</option>
                      <option value="101">DOKU</option>
                      <option value="102">FINNET INDONESIA (RTGS)</option>
                      <option value="103">GANESHA</option>
                      <option value="104">HARDA</option>
                      <option value="106">ICBC</option>
                      <option value="107">INA PERDANA</option>
                      <option value="108">INDEX</option>
                      <option value="109">INDONESIA EXIMBANK (RTGS)</option>
                      <option value="110">
                        JALIN PEMBAYARAN NUSANTARA (JALIN)
                      </option>
                      <option value="111">JAMBI</option>
                      <option value="112">JASA JAKARTA</option>
                      <option value="113">JATENG</option>
                      <option value="114">JATIM</option>
                      <option value="JTRUST">JTRUST BANK</option>
                      <option value="116">KALBAR</option>
                      <option value="117">KALSEL</option>
                      <option value="118">KALTENG</option>
                      <option value="119">KALTIMKALTARA</option>
                      <option value="120">KC JPMORGAN CHASE BANK, N.A</option>
                      <option value="121">KEB HANA</option>
                      <option value="122">KSEI (RTGS)</option>
                      <option value="123">KSEI(REKSADANA)</option>
                      <option value="124">LAMPUNG</option>
                      <option value="125">MALUKUMALUT</option>
                      <option value="127">MANTAP</option>
                      <option value="128">MAS</option>
                      <option value="129">MASPION</option>
                      <option value="MAYAPADA">MAYAPADA</option>
                      <option value="MAYBANK (D/H BII)">
                        MAYBANK (D/H BII)
                      </option>
                      <option value="132">MAYBANK INDONESIA SYARIAH</option>
                      <option value="MAYORA">MAYORA</option>
                      <option value="MEGA">MEGA</option>
                      <option value="135">MESTIKA</option>
                      <option value="MNC BANK">MNC BANK</option>
                      <option value="137">MUAMALAT</option>
                      <option value="138">MUFG BANK, LTD</option>
                      <option value="139">NAGARI</option>
                      <option value="NOBU">NOBU</option>
                      <option value="141">NTB SYARIAH</option>
                      <option value="142">NTT</option>
                      <option value="143">OCBC NISP SYARIAH</option>
                      <option value="PANIN SYARIAH">PANIN SYARIAH</option>
                      <option value="147">PAPUA</option>
                      <option value="148">PAYPRO</option>
                      <option value="PERMATA SYARIAH">PERMATA SYARIAH</option>
                      <option value="151">PRIMA MASTER BANK</option>
                      <option value="152">PT ALTO NETWORK (PT ALTO)</option>
                      <option value="153">
                        PT RINTIS SEJAHTERA (PT RINTIS)
                      </option>
                      <option value="154">PT. BANK AMAR INDONESIA</option>
                      <option value="BCA SYARIAH">PT. BANK BCA SYARIAH</option>
                      <option value="156">PT. BANK BISNIS INTERNASIONAL</option>
                      <option value="157">
                        PT. BANK BNP PARIBAS INDONESIA
                      </option>
                      <option value="158">PT. BANK FAMA INTERNATIONAL</option>
                      <option value="159">
                        PT. BANK MAYBANK SYARIAH INDONESIA
                      </option>
                      <option value="160">PT. BANK MIZUHO INDONESIA</option>
                      <option value="161">PT. BANK RESONA PERDANIA</option>
                      <option value="162">QNB INDONESIA</option>
                      <option value="163">RABOBANK</option>
                      <option value="164">RIAU</option>
                      <option value="165">SAHABAT SAMPOERN</option>
                      <option value="166">SBI INDONESIA</option>
                      <option value="167">SHINHAN</option>
                      <option value="SINARMAS">SINARMAS</option>
                      <option value="SINARMAS SYARIAH">SINARMAS SYARIAH</option>
                      <option value="170">STANDARD CHARTERED</option>
                      <option value="171">SULSELBAR</option>
                      <option value="172">SULTENG</option>
                      <option value="173">SULTRA</option>
                      <option value="174">SULUT</option>
                      <option value="175">SUMSELBABEL</option>
                      <option value="176">SUMUT</option>
                      <option value="177">SWADESI</option>
                      <option value="178">SYARIAH BUKOPIN</option>
                      <option value="179">TCASH</option>
                      <option value="180">TELKOM</option>
                      <option value="VICTORIA">VICTORIA</option>
                      <option value="183">VICTORIA SYARIAH</option>
                      <option value="184">WOORI SAUDARA</option>
                      <option value="185">XL TUNAI</option>
                      <option value="186">YUDHA BHAKTI</option>
                    </select>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label className="form_label" htmlFor="weight">
                      Nama Rekening
                    </label>
                    <input
                      type="text"
                      name="accountName"
                      placeholder="Nama rekening, contoh: Budi S..."
                      required
                      value={accountName || ""}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <label className="form_label" htmlFor="weight">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      name="accountNumber"
                      placeholder="Isi nomor rekening..."
                      required
                      value={accountNumber || ""}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label className="form_label">
                  Konfirmasi password demi keamanan datamu
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Isi Password Akun Kamu..."
                  value={password}
                  required
                  onChange={onChange}
                />
              </div>
              <br />
              <button
                type="submit"
                className="my_button"
                style={{ width: "252px" }}
              >
                SIMPAN DATA SAYA <i className="fa fa-file"></i>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default SellerSetting;
