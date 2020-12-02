import React, { useState, useEffect, Fragment, useContext } from "react";
import axios from "axios";

import alertContext from "../../../../context/alert/alertContext";
import SelectVariant from "./SelectVariant";
import VariantTable from "./VariantTable";

const AddVariant = ({
  productCombinations,
  setProductCombinations,
  variantDetails1,
  setVariantDetails1,
  variantDetails2,
  setVariantDetails2,
}) => {
  const { setAlert } = useContext(alertContext);
  const [variants, setVariants] = useState([]);
  const [variant1, setVariant1] = useState({});
  const [variant2, setVariant2] = useState({});

  // const [productCombinations, setProductCombinations] = useState([]);

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

  // const createProductCombinations = async (product_id) => {
  //   const tmp = productCombinations;
  //   let formData = new FormData();
  //   tmp.forEach((pc, i) => {
  //     if (pc.image) {
  //       formData.append('files', pc.image);
  //     }
  //     tmp[i].product_id = product_id;
  //   });
  //   formData.append('productCombinations', JSON.stringify(tmp));

  //   try {
  //     await axios.post(
  //       `${process.env.REACT_APP_APIURL}api/v1/productCombinations/create-new`,
  //       formData
  //     );
  //   } catch (error) {}
  // };

  return (
    <Fragment>
      {/* -------------------------------- */}
      <div className="col-md-12">
        <br />
        <h3>Varian Produk</h3>
        <hr />
        <p>
          Tambahkan varian produk. Bila Anda menggunakan varian, maka harga
          produk, stok, foto dan berat akan mengikuti data dari varian.
        </p>
      </div>
      {
        <Fragment>
          <SelectVariant
            variants={variants}
            variant={variant1}
            setVariant={setVariant1}
            selectedVariantDetails={variantDetails1}
            setSelectedVariantDetails={setVariantDetails1}
          ></SelectVariant>
        </Fragment>
      }
      {
        <Fragment>
          <SelectVariant
            variants={variants}
            variant={variant2}
            setVariant={setVariant2}
            selectedVariantDetails={variantDetails2}
            setSelectedVariantDetails={setVariantDetails2}
          ></SelectVariant>
        </Fragment>
      }
      {
        <Fragment>
          <VariantTable
            productCombinations={productCombinations}
            handleProductCombinationChange={handleProductCombinationChange}
          />
        </Fragment>
      }
      {/* <div className='col-md-12'>
        <button onClick={createProductCombinations}>SUBMIT</button>
      </div> */}
      {/* -------------------------------- */}
    </Fragment>
  );
};

export default AddVariant;
