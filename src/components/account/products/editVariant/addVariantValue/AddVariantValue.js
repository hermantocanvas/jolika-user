import React, { useState, useEffect, useContext } from "react";
import axios from "axios";

import AlertContext from "../../../../../context/alert/alertContext";
import SelectAdditionalValue from "./SelectAdditionalValue";
import VariantTable from "../../addVariant/VariantTable";

const AddVariantValue = ({
  variant1,
  variant2,
  product_id,
  loadProductCombinations,
  currentVariantDetails1,
  currentVariantDetails2,
  loadProductOfUser,
}) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [variants, setVariants] = useState([]);
  const [variantDetails1, setVariantDetails1] = useState([]);
  const [variantDetails2, setVariantDetails2] = useState([]);

  const [productCombinations, setProductCombinations] = useState([]);

  useEffect(() => {
    generateProductCombinations();
  }, [variantDetails1, variantDetails2]);

  const generateProductCombinations = () => {
    const newPc = [];

    if (!!variant1 && !!variant2) {
      [...variantDetails1].forEach((vd1) => {
        [...variantDetails2].forEach((vd2) => {
          newPc.push({
            label: `${vd1.nameEn} - ${vd2.nameEn}`,
            variant1_id: vd1.variant_id,
            variantDetail1_id: vd1._id,
            variant2_id: vd2.variant_id,
            variantDetail2_id: vd2._id,
            marketplacePrice: 0,
            marketPrice: 0,
            stock: 0,
            weight: 0,
            sku: "",
            image: "",
          });
        });
      });

      [...variantDetails1].forEach((vd1) => {
        [...currentVariantDetails2].forEach((vd2) => {
          newPc.push({
            label: `${vd1.nameEn} - ${vd2.nameEn}`,
            variant1_id: vd1.variant_id,
            variantDetail1_id: vd1._id,
            variant2_id: vd2.variant_id,
            variantDetail2_id: vd2._id,
            marketplacePrice: 0,
            marketPrice: 0,
            stock: 0,
            weight: 0,
            sku: "",
            image: "",
          });
        });
      });

      [...currentVariantDetails1].forEach((vd1) => {
        [...variantDetails2].forEach((vd2) => {
          newPc.push({
            label: `${vd1.nameEn} - ${vd2.nameEn}`,
            variant1_id: vd1.variant_id,
            variantDetail1_id: vd1._id,
            variant2_id: vd2.variant_id,
            variantDetail2_id: vd2._id,
            marketplacePrice: 0,
            marketPrice: 0,
            stock: 0,
            weight: 0,
            sku: "",
            image: "",
          });
        });
      });
    } else if (!!variant1 && !variant2) {
      [...variantDetails1].forEach((vd1) => {
        newPc.push({
          label: `${vd1.nameEn}`,
          variant1_id: vd1.variant_id,
          variantDetail1_id: vd1._id,
          marketplacePrice: 0,
          marketPrice: 0,
          stock: 0,
          weight: 0,
          sku: "",
          image: "",
        });
      });
    }

    setProductCombinations([...newPc]);
  };

  const handleProductCombinationChange = (label, key, value) => {
    setProductCombinations(
      productCombinations.map((pc) => {
        if (pc.label === label) {
          return { ...pc, [key]: value };
        } else {
          return pc;
        }
      })
    );
  };

  const createProductCombinations = async () => {
    const tmp = productCombinations;
    let formData = new FormData();
    tmp.forEach((pc, i) => {
      if (pc.image) {
        formData.append("files", pc.image);
      }
      tmp[i].product_id = product_id;
    });
    formData.append("productCombinations", JSON.stringify(tmp));
    formData.append("variant1Options", JSON.stringify(variantDetails1));
    formData.append("variant2Options", JSON.stringify(variantDetails2));

    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/add-new-values`,
        formData
      );
      loadProductCombinations();

      setVariantDetails1([]);
      setVariantDetails2([]);
      loadProductOfUser(product_id);
    } catch (error) {}
  };

  const handleSubmit = () => {
    createProductCombinations();
  };

  const deleteVariantValue = async (variantDetail_id) => {
    let formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("variantDetail_id", variantDetail_id);
    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/delete-variant-value`,
        formData
      );
      loadProductCombinations();
      loadProductOfUser(product_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="row">
      <div className="col-md-12">
        <br />
        <h3>Tambah/Hapus Sub Varian</h3>
        <hr />
        <p>
          Klik icon hapus (Trash) untuk menghapus Sub Varian. Anda dapat
          menambah Sub Varian baru dengan memilih dari kotak pilihan dibawah
          ini. Klik hapus (trash) untuk menghapus sub varian.
        </p>
      </div>
      {!!variant1 && (
        <div className="col-md-12">
          <SelectAdditionalValue
            variants={variants}
            variant={variant1}
            selectedVariantDetails={variantDetails1}
            setSelectedVariantDetails={setVariantDetails1}
            currentVariantDetails={currentVariantDetails1}
            deleteVariantValue={deleteVariantValue}
          />
        </div>
      )}

      {!!variant2 && (
        <div className="col-md-12">
          <SelectAdditionalValue
            variants={variants}
            variant={variant2}
            selectedVariantDetails={variantDetails2}
            setSelectedVariantDetails={setVariantDetails2}
            currentVariantDetails={currentVariantDetails2}
            deleteVariantValue={deleteVariantValue}
          />
        </div>
      )}

      <div className="col-md-12">
        <VariantTable
          productCombinations={productCombinations}
          handleProductCombinationChange={handleProductCombinationChange}
        />
      </div>

      <div className="col-md-12">
        <button className="btn btn-primary" onClick={handleSubmit}>
          <i className="fa fa-plus"></i> Simpan Sub Varian
        </button>
      </div>
    </div>
  );
};

export default AddVariantValue;
