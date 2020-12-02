import React, { useState, useContext, useEffect, Fragment } from "react";
import AlertContext from "../../context/alert/alertContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import PhoneInput from "react-phone-input-2";

const UpgradeToSeller = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;

  const [sellerDetail, setSellerDetail] = useState({
    shopName: "",
    companyName: "",
    npwp: "",
    address: "",
    postcode: "",
    countryId: "",
    provinceId: "",
    districtId: "",
    subdistrictId: "",
    upgradeToSellerStatus: "",
    identityNum: "",
    identityCard: "",
    registerDone: false,
  });

  const {
    shopName,
    companyName,
    npwp,
    address,
    countryId,
    provinceId,
    districtId,
    subdistrictId,
    upgradeToSellerStatus,
    identityNum,
    identityCard,
    postcode,
    registerDone,
  } = sellerDetail;

  const [image, setImage] = useState({});
  const [telephone, setTelephone] = useState("");

  const onChangeImage = (e) => {
    if (e.target.files[0].size > 5242880) {
      setAlert(`Max image size 5MB`, "danger");
    } else if (!e.target.files[0].type.startsWith("image")) {
      setAlert(`File must in format of image`, "danger");
    } else {
      setImage(e.target.files[0]);
    }
  };

  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  useEffect(() => {
    loadUser();
    loadCities();
    //eslint-disable-next-line
  }, []);

  async function loadCities() {
    try {
      //load countries
      const countries = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/countries`
      );
      setCountries(countries.data.data);

      //load provinces
      const provinces = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      setProvinces(provinces.data.data);

      //load districts
      const districts = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinces.data.data.id_indonesia_provinces}`
      );
      setDistricts(districts.data.data);

      //load subdistricts
      const subdistricts = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districts.data.data.id_indonesia_districts}`
      );
      setSubdistricts(subdistricts.data.data);
    } catch (err) {
      // setAlert(err.message, "danger");
    }
  }

  async function loadUser() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/users/getuserdetail`
      );

      if (res.data.data.sellerInfo) {
        setSellerDetail({
          ...sellerDetail,
          shopName: res.data.data.sellerInfo.shopName,
          companyName: res.data.data.sellerInfo.companyName,
          npwp: res.data.data.sellerInfo.npwp,
          address: res.data.data.sellerInfo.address,
          postcode: res.data.data.sellerInfo.postcode,
          countryId: res.data.data.sellerInfo.countryId,
          provinceId: res.data.data.sellerInfo.provinceId,
          districtId: res.data.data.sellerInfo.districtId,
          subdistrictId: res.data.data.sellerInfo.subdistrictId,
          upgradeToSellerStatus: res.data.data.upgradeToSellerStatus,
          identityNum: res.data.data.sellerInfo.identityNum,
          identityCard: res.data.data.sellerInfo.identityCard,
        });

        setTelephone(res.data.data.sellerInfo.telephone);

        //load provinces
        const provinces = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
        );
        setProvinces(provinces.data.data);

        //load districts
        const districts = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${res.data.data.sellerInfo.provinceId}`
        );
        setDistricts(districts.data.data);

        //load subdistricts
        const subdistricts = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${res.data.data.sellerInfo.districtId}`
        );
        setSubdistricts(subdistricts.data.data);
      }
    } catch (err) {
      // setAlert(err.message, "danger");
    }
  }

  const onChange = (e) =>
    setSellerDetail({ ...sellerDetail, [e.target.name]: e.target.value });

  const onChangeProvince = async (e) => {
    const provinceId = e.target.value;
    setSellerDetail({ ...sellerDetail, provinceId: provinceId });
    //reset subdistricts
    setSubdistricts([]);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      setDistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeDistrict = async (e) => {
    const districtId = e.target.value;
    setSellerDetail({ ...sellerDetail, districtId: districtId });

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );

      setSubdistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeSubdistrict = async (e) => {
    const subdistrictId = e.target.value;
    setSellerDetail({
      ...sellerDetail,
      subdistrictId: subdistrictId,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (countryId === "5f142c0c3c69e5284cb36ffb") {
      if (
        shopName === "" ||
        companyName === "" ||
        countryId === "" ||
        telephone === "" ||
        address === "" ||
        postcode === "" ||
        npwp === "" ||
        provinceId === "" ||
        districtId === "" ||
        subdistrictId === "" ||
        image === "" ||
        identityNum === ""
      ) {
        setAlert("Mohon mengisi field", "danger");
      } else {
        confirmAlert({
          title: "Sudah Yakin ?",
          message: `Sudah yakin data mau ajukan upgrade ?`,
          buttons: [
            {
              label: "Ya",
              onClick: () => submitUpgrade(),
            },
            {
              label: "Tidak",
              onClick: () => console.log("Cancel save..."),
            },
          ],
        });
      }
    } else {
      if (
        shopName === "" ||
        companyName === "" ||
        countryId === "" ||
        telephone === "" ||
        address === "" ||
        postcode === ""
      ) {
        setAlert("Mohon mengisi field", "danger");
      } else {
        confirmAlert({
          title: "Sudah Yakin ?",
          message: `Sudah yakin data mau ajukan upgrade ?`,
          buttons: [
            {
              label: "Ya",
              onClick: () => submitUpgrade(),
            },
            {
              label: "Tidak",
              onClick: () => console.log("Cancel save..."),
            },
          ],
        });
      }
    }

    async function submitUpgrade() {
      let formData = new FormData();

      formData.append("shopName", shopName);
      formData.append("companyName", companyName);
      formData.append("telephone", telephone);
      formData.append("address", address);
      formData.append("postcode", postcode);
      formData.append("countryId", countryId);

      if (countryId === "5f142c0c3c69e5284cb36ffb") {
        formData.append("provinceId", provinceId);
        formData.append("districtId", districtId);
        formData.append("subdistrictId", subdistrictId);
        formData.append("files", image);
        formData.append("npwp", npwp);
        formData.append("identityNum", identityNum);
      }

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/users/upgradetoseller`,
          formData
        );

        setSellerDetail({
          ...sellerDetail,
          shopName: res.data.data.sellerInfo.shopName,
          companyName: res.data.data.sellerInfo.companyName,
          npwp: res.data.data.sellerInfo.npwp,
          address: res.data.data.sellerInfo.address,
          postcode: res.data.data.sellerInfo.postcode,
          countryId: res.data.data.sellerInfo.countryId,
          provinceId: res.data.data.sellerInfo.provinceId,
          districtId: res.data.data.sellerInfo.districtId,
          subdistrictId: res.data.data.sellerInfo.subdistrictId,
          identityCard: res.data.data.sellerInfo.identityCard,
          registerDone: true,
        });

        setTelephone(res.data.data.sellerInfo.telephone);

        setAlert(
          "Data berhasil dikirim. Silahkan menunggu verifikasi",
          "success"
        );
      } catch (err) {
        setAlert(err.response.data.error, "danger");
      }
    }
  };

  let indonesiaDetailsBlock;
  //if country is Indonesia, load additional inputs
  if (countryId === "5f142c0c3c69e5284cb36ffb") {
    indonesiaDetailsBlock = (
      <div className="row">
        <div className="col-sm-4" style={{ paddingTop: "30px" }}>
          <label className="form_label" htmlFor="chooseAddressProvince">
            Pilih Provinsi
          </label>
          <select
            id="chooseAddressProvince"
            name="chooseAddressProvince"
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
        <div className="col-sm-4" style={{ paddingTop: "30px" }}>
          <label className="form_label" htmlFor="chooseAddressDistrict">
            Pilih Kabupaten/Kota
          </label>
          <select
            id="chooseAddressDistrict"
            name="chooseAddressDistrict"
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
        <div className="col-sm-4" style={{ paddingTop: "30px" }}>
          <label className="form_label" htmlFor="chooseAddressSubdistrict">
            Pilih Kecamatan
          </label>
          <select
            id="chooseAddressSubdistrict"
            value={subdistrictId || ""}
            name="chooseAddressSubdistrict"
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
        <div className="col-sm-6" style={{ paddingTop: "30px" }}>
          <div className="form-group">
            <label className="form_label" htmlFor="npwp">
              NPWP
            </label>
            <input
              type="text"
              name="npwp"
              placeholder="Isi Nomor NPWP..."
              required
              value={npwp || ""}
              onChange={onChange}
            />
          </div>
        </div>
        <div className="col-sm-6" style={{ paddingTop: "30px" }}>
          <div className="form-group">
            <label className="form_label" htmlFor="identityNum">
              Nomor KTP
            </label>
            <input
              type="text"
              name="identityNum"
              placeholder="Isi Nomor KTP..."
              required
              value={identityNum || ""}
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`${process.env.REACT_APP_APIURL}uploads/${identityCard}`}
            >
              <img
                src={`${process.env.REACT_APP_APIURL}uploads/${identityCard}`}
                alt=""
                style={{ width: "150px", marginRight: "5px" }}
              />
            </a>
            <label className="form_label" htmlFor="files">
              Upload KTP
            </label>
            <input
              type="file"
              name="files"
              id="files"
              onChange={onChangeImage}
              required
            />
            <label className="form_label" htmlFor="files">
              Format: jpg, jpeg, png
            </label>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <h3>Daftar Sebagai Seller</h3>
      <hr />
      {(() => {
        if (upgradeToSellerStatus === "in process") {
          return (
            <p
              style={{
                padding: "10px 20px 10px 20px",
                color: "white",
                backgroundColor: "#346fbd",
              }}
            >
              Pengajuan penjual sedang diverifikasi oleh admin Okebid. Silahkan
              menunggu. Anda akan mendapatkan hasil melalui notifikasi email.
            </p>
          );
        } else if (upgradeToSellerStatus === "approved") {
          return (
            <p
              style={{
                padding: "10px 20px 10px 20px",
                color: "white",
                backgroundColor: "#346fbd",
              }}
            >
              Selamat! pendaftaran Anda sebagai seller sudah disetujui. Anda
              sudah dapat menjual produk di Marketplace Okebid.
            </p>
          );
        } else if (upgradeToSellerStatus === "rejected") {
          return (
            <p
              style={{
                padding: "10px 20px 10px 20px",
                color: "white",
                backgroundColor: "brown",
              }}
            >
              Maaf. pendaftaran Anda sebagai seller belum disetujui. Silahkan
              melengkapi dan perbaharui dokumen, dan silahkan mencoba mendaftar
              kembali.
            </p>
          );
        }
      })()}
      {(() => {
        if (registerDone === true) {
          return (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                background: "#4b89dc",
                color: "white",
              }}
            >
              <h2>Terima kasih sudah melakukan pendaftaran seller.</h2>
              <br />
              <p>
                Pengajuan sedang diverifikasi oleh admin Okebid. Silahkan
                menunggu.
                <br />
                Anda akan mendapatkan hasil melalui notifikasi email.
              </p>
            </div>
          );
        } else {
          return (
            <div className="details-wrap">
              <form onSubmit={onSubmit} className="form-login">
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label className="form_label" htmlFor="shopName">
                            Nama Toko
                          </label>
                          <input
                            type="text"
                            name="shopName"
                            id="shopName"
                            placeholder="Nama toko..."
                            required
                            value={shopName || ""}
                            onChange={onChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form_label" htmlFor="weight">
                            Nama Perusahaan
                          </label>
                          <input
                            type="text"
                            name="companyName"
                            placeholder="Nama perusahaan..."
                            required
                            value={companyName || ""}
                            onChange={onChange}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form_label" htmlFor="telephone">
                            Telepon
                          </label>
                          <PhoneInput
                            country={"id"}
                            value={telephone}
                            onChange={(phone) => setTelephone(phone)}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label className="form_label" htmlFor="weight">
                            Alamat Lengkap
                          </label>
                          <textarea
                            name="address"
                            rows="6"
                            value={address || ""}
                            onChange={onChange}
                            required
                          ></textarea>
                        </div>
                        <div className="form-group">
                          <label className="form_label" htmlFor="postcode">
                            Kode Pos (Zip)
                          </label>
                          <input
                            type="text"
                            name="postcode"
                            placeholder="Kode Pos/Zip..."
                            required
                            value={postcode || ""}
                            onChange={onChange}
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
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
                  {(() => {
                    if (
                      !upgradeToSellerStatus ||
                      upgradeToSellerStatus === "rejected"
                    ) {
                      return (
                        <div
                          className="col-sm-6"
                          style={{ paddingTop: "30px" }}
                        >
                          <button type="submit" className="my_button">
                            DAFTAR SEBAGAI SELLER{" "}
                            <i className="fa fa-arrow-up"></i>
                          </button>
                        </div>
                      );
                    }
                  })()}
                </div>
              </form>
            </div>
          );
        }
      })()}
    </Fragment>
  );
};

export default UpgradeToSeller;
