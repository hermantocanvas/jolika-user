import React, { Fragment, useContext, useState, useEffect } from "react";
import axios from "axios";

import alertContext from "../../../../../context/alert/alertContext";
import SelectVariant from "../../addVariant/SelectVariant";
import VariantTable from "../../addVariant/VariantTable";

const ChangeVariant = ({ product_id, loadProductCombinations }) => {
  const { setAlert } = useContext(alertContext);
  const [variants, setVariants] = useState([]);
  const [variant1, setVariant1] = useState({});
  const [variant2, setVariant2] = useState({});
  const [variantDetails1, setVariantDetails1] = useState([]);
  const [variantDetails2, setVariantDetails2] = useState([]);

  const [productCombinations, setProductCombinations] = useState([]);

  useEffect(() => {
    loadVariants();
  }, []);

  useEffect(() => {
    generateProductCombinations();
  }, [variantDetails1, variantDetails2]);

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

  const generateProductCombinations = () => {
    const newPc = [];

    if (variantDetails1.length && !variantDetails2.length) {
      variantDetails1.forEach((vd1) => {
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
    } else if (variantDetails1.length && variantDetails2.length) {
      variantDetails1.forEach((vd1) => {
        variantDetails2.forEach((vd2) => {
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
    }
    setProductCombinations([...newPc]);
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
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/create-new`,
        formData
      );
      loadProductCombinations();
      setVariant1({});
      setVariant2({});
      setVariantDetails1([]);
      setVariantDetails2([]);
    } catch (error) {}
  };

  const loadVariants = async (pageNumber) => {
    const itemPerPage = 10;
    let URL = "";
    URL += `${process.env.REACT_APP_APIURL}api/v1/variants?`;
    URL += `page=${pageNumber}&`;
    URL += `limit=${itemPerPage}&`;

    try {
      const response = await axios.get(URL);
      const data = response.data;

      setVariants(data.data);
    } catch (error) {
      console.log({ error });
      setAlert(error.response.data.error, "danger");
    }
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <br />
        <br />
        <h3>Tambah Varian Baru</h3>
        <hr />
        <p>
          Tambahkan varian produk. Bila Anda menggunakan varian, maka harga
          produk, stok, foto dan berat akan mengikuti data dari varian.
        </p>
      </div>
      <SelectVariant
        variants={variants}
        variant={variant1}
        setVariant={setVariant1}
        selectedVariantDetails={variantDetails1}
        setSelectedVariantDetails={setVariantDetails1}
      ></SelectVariant>
      <SelectVariant
        variants={variants}
        variant={variant2}
        setVariant={setVariant2}
        selectedVariantDetails={variantDetails2}
        setSelectedVariantDetails={setVariantDetails2}
      ></SelectVariant>
      <VariantTable
        productCombinations={productCombinations}
        handleProductCombinationChange={handleProductCombinationChange}
      />
      {!!productCombinations.length && (
        <div className="col-md-12">
          <button
            className="btn btn-primary"
            onClick={createProductCombinations}
          >
            CHANGE VARIANT
          </button>
        </div>
      )}
    </div>
  );
};

export default ChangeVariant;
