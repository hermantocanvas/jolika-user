import React, { useState, useEffect } from "react";
import axios from "axios";
import VariantRow from "./VariantRow";

const VariantTable = ({
  product_id,
  productCombinations,
  setProductCombinations,
  loadProductCombinations,
}) => {
  // const [productCombinations, setProductCombinations] = useState([]);

  // useEffect(() => {
  //   loadProductCombinations();
  // }, []);

  // const loadProductCombinations = async () => {
  //   const URL = `${process.env.REACT_APP_APIURL}api/v1/productCombinations/by-product-id/${product_id}`;

  //   try {
  //     const response = await axios.get(URL);
  //     setProductCombinations(response.data.data);

  //     // setVariants(data.data);
  //   } catch (error) {
  //     console.log({ error });
  //     // setAlert(error.response.data.error, 'danger');
  //   }
  // };

  return (
    <table className="table table-striped noMoreTable">
      <thead>
        <tr>
          <th>Varian</th>
          <th>Harga jual marketplace</th>
          <th>Harga pasaran</th>
          <th>Stok</th>
          <th>Berat (gram)</th>
          <th>Sku (Kode stok)</th>
          <th>Foto</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {productCombinations.map((pc) => {
          const key = pc.variantDetail2_id
            ? `${pc.variantDetail1_id._id}${pc.variantDetail2_id._id}`
            : `${pc.variantDetail1_id._id}`;
          return (
            <VariantRow
              pc={pc}
              key={key}
              loadProductCombinations={loadProductCombinations}
            />
          );
        })}
      </tbody>
    </table>
  );
};

export default VariantTable;
