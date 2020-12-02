import React, { Fragment, useEffect, useState, useContext } from "react";
import axios from "axios";

import alertContext from "../../../../context/alert/alertContext";

const SelectVariant = ({
  variants = [],
  variant = {},
  setVariant,
  selectedVariantDetails,
  setSelectedVariantDetails,
}) => {
  const { setAlert } = useContext(alertContext);

  const [variantDetails, setVariantDetails] = useState([]);
  const [variantDetail, setVariantDetail] = useState({});

  useEffect(() => {
    loadVariantDetails();
  }, [variant]);

  useEffect(() => {
    setSelectedVariantDetails([]);
    setVariantDetail({});
  }, [variantDetails]);

  const onVariantChange = (e) => {
    const tmp = variants.find((v) => v._id === e.target.value) || {};
    setVariant(tmp);
  };

  const onVariantDetailChange = (e) => {
    const newVd = variantDetails.find((vd) => vd._id === e.target.value);
    if (!newVd) {
      setVariantDetail({});
      return;
    }

    setVariantDetail(newVd);

    const isExists = selectedVariantDetails.find(
      (svd) => svd._id === e.target.value
    );
    if (!isExists) {
      setSelectedVariantDetails([...selectedVariantDetails, newVd]);
    }
  };

  const removeSelectedVariantDetail = (id) => {
    setVariantDetail({});
    setSelectedVariantDetails(
      selectedVariantDetails.filter((svd) => svd._id !== id)
    );
  };

  const loadVariantDetails = async () => {
    setVariantDetails([]);

    if (!variant._id) return;
    let URL = "";
    URL += `${process.env.REACT_APP_APIURL}api/v1/variantDetails?`;
    URL += `variant_id=${variant._id}&`;

    try {
      const response = await axios.get(URL);
      setVariantDetails(response.data.data);
    } catch (error) {
      console.log({ error });
      setAlert(error.response.data.error, "danger");
    }
  };

  return (
    <Fragment>
      <div className="col-md-12">
        <div className="form-group">
          <label className="form_label">
            Tipe Varian (Contoh: ukuran, warna)
          </label>
          <select value={variant._id || ""} onChange={onVariantChange}>
            <option value="">Pilih Tipe Varian</option>
            {variants.map((v) => (
              <option key={v._id} value={v._id || ""}>
                {" "}
                {v.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="col-md-12">
        <div className="form-group">
          <label className="form_label">
            Nilai Varian (Contoh: S, M, L, Biru)
          </label>
          <select
            value={variantDetail._id || ""}
            onChange={onVariantDetailChange}
          >
            <option value="">Pilih Nilai varian</option>
            {variantDetails.map((v) => (
              <option key={v._id} value={v._id || ""}>
                {" "}
                {v.nameEn}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedVariantDetails.map((sv) => (
        <div key={sv._id} className="col-md-3">
          {sv.nameEn}{" "}
          <i
            className="fa fa-trash"
            style={{ cursor: "pointer", color: "red" }}
            onClick={(e) => removeSelectedVariantDetail(sv._id)}
          ></i>
        </div>
      ))}
    </Fragment>
  );
};

export default SelectVariant;
