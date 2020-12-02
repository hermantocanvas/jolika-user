import React, { useState, useContext, useEffect, Fragment } from "react";
import AlertContext from "../context/alert/alertContext";
import axios from "axios";

const CheckoutMarketplace = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [settingData, setSettingData] = useState({
    recipientName: "",
    handphone: "",
    address: "",
    buyerProvinceId: "",
    buyerDistrictId: "",
    buyerSubdistrictId: "",
  });
  const {
    recipientName,
    handphone,
    address,
    buyerProvinceId,
    buyerDistrictId,
    buyerSubdistrictId,
  } = settingData;

  //set product auction data
  const [auction, setAuctionData] = useState({
    name: "",
    auctionId: "",
    imagesName: "",
    weight: "",
    condition: "",
    subdistrictId: "",
    sellerUsername: "",
    winnerBuyerId: "",
    sellerId: "",
    winnerPrice: "",
    shippingRegularJne: "",
    shippingRegularJnt: "",
    shippingRegularSicepat: "",
    shippingNextDayJne: "",
    shippingNextDaySicepat: "",
    orderCreated: "no",
  });
  const {
    name,
    auctionId,
    imagesName,
    weight,
    condition,
    subdistrictId,
    sellerUsername,
    winnerBuyerId,
    sellerId,
    winnerPrice,
    shippingRegularJne,
    shippingRegularJnt,
    shippingRegularSicepat,
    shippingNextDayJne,
    shippingNextDaySicepat,
    orderCreated,
  } = auction;

  //get all available array of cities
  const [buyerProvinces, setBuyerProvinces] = useState([]);
  const [buyerDistricts, setBuyerDistricts] = useState([]);
  const [buyerSubdistricts, setBuyerSubdistricts] = useState([]);

  //set shipping fee Jne for this product with real weight, get price from Rajaongkir
  const [shippingFeeJne, setShippingFeeJne] = useState({
    feeRegularJne: "",
    feeNextDayJne: "",
  });
  const { feeRegularJne, feeNextDayJne } = shippingFeeJne;

  //set shipping fee Jnt for this product with real weight, get price from Rajaongkir
  const [shippingFeeJnt, setShippingFeeJnt] = useState({
    feeRegularJnt: "",
  });
  const { feeRegularJnt } = shippingFeeJnt;

  //set shipping fee Sicepat for this product with real weight, get price from Rajaongkir
  const [shippingFeeSicepat, setShippingFeeSicepat] = useState({
    feeRegularSicepat: "",
    feeNextDaySicepat: "",
  });
  const { feeRegularSicepat, feeNextDaySicepat } = shippingFeeSicepat;

  const onChange = (e) =>
    setSettingData({ ...settingData, [e.target.name]: e.target.value });

  //Control for buyer address (provinces, districts, subdisticts)
  const onChangeBuyerProvince = async (e) => {
    const buyerProvinceId = e.target.value;
    setSettingData({ ...settingData, buyerProvinceId: buyerProvinceId });
    //reset subdistricts
    setBuyerSubdistricts([]);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${buyerProvinceId}`
      );

      setBuyerDistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeBuyerDistrict = async (e) => {
    const buyerDistrictId = e.target.value;
    setSettingData({ ...settingData, buyerDistrictId: buyerDistrictId });

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${buyerDistrictId}`
      );

      setBuyerSubdistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeBuyerSubdistrict = async (e) => {
    const buyerSubdistrictId = e.target.value;
    setSettingData({
      ...settingData,
      buyerSubdistrictId: buyerSubdistrictId,
    });

    //reload shipping fee
    //get shipping fee Jne
    getShippingFee(subdistrictId, buyerSubdistrictId, weight, "jne");

    //get shipping fee Jnt
    getShippingFee(subdistrictId, buyerSubdistrictId, weight, "jnt");

    //get shipping fee Sicepat
    getShippingFee(subdistrictId, buyerSubdistrictId, weight, "sicepat");
  };

  async function getShippingFee(
    subdistrictId,
    buyersubdistrictId,
    weight,
    courier
  ) {
    let formData = new FormData();
    formData.append("origin", subdistrictId);
    formData.append("destination", buyersubdistrictId);
    formData.append("weight", weight);

    // console.log('formdata before submitting...');
    // for (var pair of formData.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }

    switch (courier) {
      case "jne":
        const resJne = await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/getShippingFeeJne`,
          formData
        );
        // console.log(resJne.data.data.rajaongkir.results[0]);

        let feeJneRegular = "";
        let feeJneYes = "";

        if (resJne.data.data.rajaongkir.results[0].costs[0]) {
          feeJneRegular =
            resJne.data.data.rajaongkir.results[0].costs[0].cost[0].value;
        }
        if (resJne.data.data.rajaongkir.results[0].costs[1]) {
          feeJneYes =
            resJne.data.data.rajaongkir.results[0].costs[1].cost[0].value;
        }
        setShippingFeeJne({
          feeRegularJne: feeJneRegular,
          feeNextDayJne: feeJneYes,
        });
        break;
      case "jnt":
        const resJnt = await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/getShippingFeeJnt`,
          formData
        );
        // console.log(resJnt.data.data.rajaongkir.results[0]);

        let feeJntRegular = "";
        let feeJntYes = "";

        if (resJnt.data.data.rajaongkir.results[0].costs[0]) {
          feeJntRegular =
            resJnt.data.data.rajaongkir.results[0].costs[0].cost[0].value;
        }
        if (resJnt.data.data.rajaongkir.results[0].costs[1]) {
          feeJntYes =
            resJnt.data.data.rajaongkir.results[0].costs[1].cost[0].value;
        }

        setShippingFeeJnt({
          feeRegularJnt: feeJntRegular,
          feeNextDayJnt: feeJntYes,
        });
        break;
      case "sicepat":
        const resSicepat = await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/getShippingFeeSicepat`,
          formData
        );
        // console.log(resSicepat.data.data.rajaongkir.results[0]);

        let feeSicepatRegular = "";
        let feeSicepatYes = "";

        if (resSicepat.data.data.rajaongkir.results[0].costs[0]) {
          feeSicepatRegular =
            resSicepat.data.data.rajaongkir.results[0].costs[0].cost[0].value;
        }
        if (resSicepat.data.data.rajaongkir.results[0].costs[1]) {
          feeSicepatYes =
            resSicepat.data.data.rajaongkir.results[0].costs[1].cost[0].value;
        }
        setShippingFeeSicepat({
          feeRegularSicepat: feeSicepatRegular,
          feeNextDaySicepat: feeSicepatYes,
        });
        break;
      default:
        break;
    }
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  return (
    <div className="main_content">
      <div className="wrapp">
        <div>
          <div className="cbt_header">
            <ul>
              <li className="ceked">
                <a href="#">
                  <span className="angka">
                    <i className="fa fa-check"></i>
                  </span>{" "}
                  Cart
                </a>
              </li>
              <li>
                <a href="#">
                  <span className="angka">2</span> Checkout
                </a>
              </li>
              <li className="disable">
                <a href="#">
                  <span className="angka">3</span> Selesai
                </a>
              </li>
            </ul>
          </div>

          <div className="ckc_box">
            <div className="ck_address">
              <div className="ckc_box_title">
                <i className="fa fa-map-marker"></i> Alamat Pengiriman
              </div>
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <div className="form-group">
                    <label htmlFor="weight">Nama Penerima</label>
                    <input
                      type="text"
                      name="recipientName"
                      placeholder="Nama penerima barang..."
                      required
                      value={recipientName || ""}
                      onChange={onChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="weight">Handphone</label>
                    <input
                      type="text"
                      name="handphone"
                      placeholder="Handphone penerima barang..."
                      required
                      value={handphone || ""}
                      onChange={onChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="weight">Alamat Lengkap</label>
                    <textarea
                      name="address"
                      rows="6"
                      value={address || ""}
                      onChange={onChange}
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="form-group">
                    <select
                      id="chooseAddressProvince"
                      name="chooseAddressProvince"
                      value={buyerProvinceId || ""}
                      required
                      onChange={onChangeBuyerProvince}
                    >
                      <option value="">Pilih Provinsi...</option>
                      {buyerProvinces.map((province) => (
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
                      id="chooseAddressDistrict"
                      name="chooseAddressDistrict"
                      value={buyerDistrictId || ""}
                      required
                      onChange={onChangeBuyerDistrict}
                    >
                      <option value="">Pilih Kota/kabupaten...</option>
                      {buyerDistricts.map((district) => (
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
                      id="chooseAddressSubdistrict"
                      value={buyerSubdistrictId || ""}
                      name="chooseAddressSubdistrict"
                      required
                      onChange={onChangeBuyerSubdistrict}
                    >
                      <option value="">Pilih Kecamatan...</option>
                      {buyerSubdistricts.map((subdistrict) => (
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
              </div>
            </div>
          </div>

          <div className="ckc_box">
            <div className="ckc_box_title">
              <i className="lni lni-shopping-basket"></i> Produk Anda
            </div>
            <div className="ckc_box_in">
              <div className="checkout_box">
                <div className="checkout_table">
                  <div className="checkout_table_item clearfix">
                    <p>
                      Nama Toko
                      <br />
                      <span style={{ fontSize: "12px" }}>
                        Jakarta Pusat, DKI jakarta
                      </span>
                    </p>
                    <div className="cti_img">
                      <a href="#">
                        <img src="images/live2.jpg" />
                      </a>
                    </div>
                    <div className="cti_dsc cht_mp_desc">
                      <div className="cti_title">
                        <a href="#">
                          Hot Toys 1/6 Michael Jackson Billie Jean History Tour
                        </a>
                      </div>
                      <div className="cti_harga_tawar cht_mp">
                        <ul>
                          <li>
                            <span>Harga</span>Rp. 270.000
                          </li>
                          <li className="qty_bx">
                            <div className="qty_bx_in">
                              <span>1 barang (500gr)</span>
                            </div>
                          </li>
                          <li className="ttl">
                            <span>Total</span>Rp. 270.000
                          </li>
                          <li className="ttl">
                            <label>Pilih Pengiriman</label>
                            <select>
                              <option value="">Pilih Kurir...</option>
                              <option value="">Jne Regular (Rp 9.000)</option>
                              <option value="">Jne Yes (Rp 18.000)</option>
                            </select>
                          </li>
                        </ul>
                        <p style={{ fontSize: "12px", marginTop: "10px" }}>
                          Catatan: Minta yang size M
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="checkout_table_item clearfix">
                    <div className="cti_img">
                      <a href="#">
                        <img src="images/live1.jpg" />
                      </a>
                    </div>
                    <div className="cti_dsc cht_mp_desc">
                      <div className="cti_title">
                        <a href="#">
                          Hot Toys 1/6 Michael Jackson Billie Jean History Tour
                        </a>
                      </div>
                      <div className="cti_harga_tawar cht_mp">
                        <ul>
                          <li>
                            <span>Harga</span>Rp. 270.000
                          </li>
                          <li className="qty_bx">
                            <div className="qty_bx_in">
                              <span>1 barang (500gr)</span>
                            </div>
                          </li>
                          <li className="ttl">
                            <span>Total</span>Rp. 270.000
                          </li>
                          <li className="ttl">
                            <label>Pilih Pengiriman</label>
                            <select>
                              <option value="">Pilih Kurir...</option>
                              <option value="">Jne Regular (Rp 9.000)</option>
                              <option value="">Jne Yes (Rp 18.000)</option>
                            </select>
                          </li>
                        </ul>
                        <p style={{ fontSize: "12px", marginTop: "10px" }}>
                          Catatan: Minta yang size M
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ckc_box">
          <div className="ckc_box_title">
            <i className="fa fa-credit-card"></i> Pilih Pembayaran
          </div>
          <div className="ckc_box_in">
            <label className="radio_ctn">
              Bank Transfer <span>Pembayaran melalui rekening BCA</span>
              <input
                type="radio"
                checked="checked"
                name="radio_payment"
                id="transfer"
              />
              <span className="checkmark_rd"></span>
            </label>
          </div>
        </div>

        <div className="row margin_bottom">
          <div className="col-md-12">
            <button className="my_button rounded">
              <i className="lni lni-shopping-basket"></i> Pesan Sekarang{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMarketplace;
