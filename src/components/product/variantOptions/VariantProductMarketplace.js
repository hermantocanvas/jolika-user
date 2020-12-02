import React, { useEffect, useState, Fragment } from "react";
import axios from "axios";
import OptionBox from "./OptionBox";
const VariantProductMarketplace = ({
  product,
  productCombination,
  setProductCombination,
}) => {
  const [productCombinations, setProductCombinations] = useState([]);
  const [variant1, setVariant1] = useState({});
  const [variant2, setVariant2] = useState({});

  useEffect(() => {
    loadProductCombinations();
    setVariant1(product.variant1Options[0]);
    setVariant2(product.variant2Options[0]);
  }, []);

  useEffect(() => {
    handleSetProductCombination();
  }, [variant1, variant2, productCombinations]);

  const handleSetProductCombination = () => {
    if (!!product.variant1Options.length && !!product.variant2Options.length) {
      const tmp = productCombinations.find(
        (pc) =>
          pc.variantDetail1_id._id === variant1._id &&
          pc.variantDetail2_id._id === variant2._id
      );
      if (tmp) {
        setProductCombination(tmp);
      }
    } else if (
      !!product.variant1Options.length &&
      !product.variant2Options.length
    ) {
      const tmp = productCombinations.find((pc) => {
        return pc.variantDetail1_id._id === variant1._id;
      });

      if (tmp) {
        setProductCombination(tmp);
      }
    }
  };

  const loadProductCombinations = async () => {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/productCombinations/by-product-id/${product._id}`;

    try {
      const response = await axios.get(URL);
      setProductCombinations(response.data.data);
      console.log(response.data.data);

      // setVariants(data.data);
    } catch (error) {
      console.log({ error });
      // setAlert(error.response.data.error, 'danger');
    }
  };

  return (
    <Fragment>
      {!!product.variant1Options.length && (
        <div>
          <p style={{ position: "relative", top: "10px", fontSize: "14px" }}>
            Pilih {product.variant1.nameId}:
          </p>
          {product.variant1Options.map((option) => {
            return (
              <OptionBox
                key={option._id}
                option={option}
                setVariant={setVariant1}
                selected={variant1._id === option._id}
              />
            );
          })}
        </div>
      )}

      {!!product.variant2Options.length && (
        <div>
          <p style={{ position: "relative", top: "10px", fontSize: "14px" }}>
            Pilih {product.variant2.nameId}:
          </p>
          {product.variant2Options.map((option) => {
            return (
              <OptionBox
                key={option._id}
                option={option}
                setVariant={setVariant2}
                selected={variant2._id === option._id}
              />
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export default VariantProductMarketplace;
