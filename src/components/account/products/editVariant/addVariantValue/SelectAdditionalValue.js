import React, { Fragment, useEffect, useState, useContext } from "react";
import axios from "axios";

import alertContext from "../../../../../context/alert/alertContext";
import CurrentValueBox from "./CurrentValueBox";

const SelectAdditionalValue = ({
  variant = {},
  selectedVariantDetails,
  setSelectedVariantDetails,
  currentVariantDetails,
  deleteVariantValue,
}) => {
  const { setAlert } = useContext(alertContext);

  const [variantDetails, setVariantDetails] = useState([]);
  const [variantDetail, setVariantDetail] = useState({});

  useEffect(() => {
    loadVariantDetails();
  }, [variant]);

  // useEffect(() => {
  //   setSelectedVariantDetails([]);
  //   setVariantDetail({});
  // }, [variantDetails]);

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
    <div className="row">
      <div className="col-md-12">
        <div className="form-group">
          <label className="form_label" style={{ textTransform: "uppercase" }}>
            <strong>{variant.nameEn}</strong>
          </label>
          <p>Sub varian sekarang: </p>
          {currentVariantDetails.map((sv) => (
            <CurrentValueBox
              key={sv._id}
              variantDetail={sv}
              deleteVariantValue={deleteVariantValue}
            />
          ))}

          <select
            value={variantDetail._id || ""}
            onChange={onVariantDetailChange}
          >
            <option value="">Pilih sub varian baru</option>
            {variantDetails.map((v) => {
              if (currentVariantDetails.find((cvd) => cvd._id === v._id)) {
                return null;
              }
              return (
                <option key={v._id} value={v._id || ""}>
                  {" "}
                  {v.nameEn}
                </option>
              );
            })}
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
    </div>
  );
};

export default SelectAdditionalValue;
