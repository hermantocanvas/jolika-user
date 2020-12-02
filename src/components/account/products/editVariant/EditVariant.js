import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import AccountMenu from "../../AccountMenu";
import AuthContext from "../../../../context/auth/authContext";
import AlertContext from "../../../../context/alert/alertContext";
import VariantTable from "./variantTable/VariantTable";
import ChangeVariant from "./changeVariant/ChangeVariant";
import AddVariantValue from "./addVariantValue/AddVariantValue";
import { Link } from "react-router-dom";
const EditVariant = ({ match }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  const [productCombinations, setProductCombinations] = useState([]);
  const [currentVariantDetails1, setCurrentVariantDetails1] = useState([]);
  const [currentVariantDetails2, setCurrentVariantDetails2] = useState([]);

  const [product, setProduct] = useState({});

  const product_id = match.params.id;

  useEffect(() => {
    loadProductCombinations();
  }, []);

  useEffect(() => {
    loadProductOfUser(product_id);
  }, []);

  async function loadProductOfUser(productId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/user/${productId}`
      );
      setProduct(res.data.data);
      setCurrentVariantDetails1(res.data.data.variant1Options);
      setCurrentVariantDetails2(res.data.data.variant2Options);
    } catch (err) {
      setAlert(err.message, "danger");
      // console.log("error 1", err.message);
    }
  }

  const loadProductCombinations = async () => {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/productCombinations/by-product-id/${product_id}`;

    try {
      const response = await axios.get(URL);
      setProductCombinations(response.data.data);
    } catch (error) {
      console.log({ error });
      // setAlert(error.response.data.error, 'danger');
    }
  };

  return (
    <section className="page-section">
      <div className="wrap container">
        <div className="row">
          <AccountMenu />
          <div className="col-lg-9 col-md-9 col-sm-8">
            <div>
              <Link
                to={`/akun-edit-produk/${product_id}`}
                className="btn btn-primary"
              >
                <i className="fa fa-chevron-left"></i> Kembali ke halaman Edit
                Produk
              </Link>
            </div>
            <br />
            <div className="row">
              <div className="col-md-12">
                <h3>Edit Varian Produk: {product.name}</h3>
                <hr />
                <p>
                  Klik icon edit untuk merubah data masing-masing varian. Klik
                  &#10003; untuk menyimpan, X untuk membatalkan.
                </p>
              </div>
              <div className="col-md-12">
                <VariantTable
                  product_id={product_id}
                  productCombinations={productCombinations}
                  setProductCombinations={setProductCombinations}
                  loadProductCombinations={loadProductCombinations}
                />
              </div>
              {!!productCombinations.length && (
                <div className="col-md-12">
                  <AddVariantValue
                    variant1={productCombinations[0].variant1_id}
                    variant2={productCombinations[0].variant2_id}
                    product_id={product_id}
                    currentVariantDetails1={currentVariantDetails1}
                    currentVariantDetails2={currentVariantDetails2}
                    loadProductCombinations={loadProductCombinations}
                    loadProductOfUser={loadProductOfUser}
                  />
                </div>
              )}

              <div className="col-md-12">
                <br />
                <ChangeVariant
                  product_id={product_id}
                  loadProductCombinations={loadProductCombinations}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditVariant;
