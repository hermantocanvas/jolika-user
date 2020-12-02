import React, { useState, useContext, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import AlertContext from "../../../context/alert/alertContext";
import ProductItem from "./ProductItem";
import axios from "axios";
import AuthContext from "../../../context/auth/authContext";

const Products = () => {
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: null,
    per_page: null,
    current_page: 1,
    total_pages: null,
    start_index: null,
  });
  const {
    total,
    per_page,
    current_page,
    total_pages,
    start_index,
  } = pagination;

  useEffect(() => {
    loadProductsOfUser(1);
    //eslint-disable-next-line
  }, []);

  async function loadProductsOfUser(pageNumber) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/user/get/${pageNumber}`
      );
      setProducts(res.data.data);

      setPagination({
        ...pagination,
        total: res.data.total,
        per_page: res.data.per_page,
        current_page: res.data.page,
        total_pages: res.data.total_pages,
        start_index: res.data.startIndex,
      });
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  const onProductDelete = async () => {
    loadProductsOfUser(1);
  };

  const onBidActivated = async () => {
    loadProductsOfUser(1);
  };

  const onBidExpired = async () => {
    loadProductsOfUser(current_page);
  };

  if (products === null || products.length === 0) {
    return (
      <Fragment>
        <h3>Daftar Produk</h3>
        <hr />
        <div className="details-wrap">
          <div className="details-box orders">
            <p>
              <Link to="/akun/buat-produk" className="btn btn-success">
                BUAT PRODUK BARU
              </Link>
            </p>
            <p>
              Anda belum memiliki produk untuk dijual. Ayo upload produk baru
              sekarang juga.
            </p>
          </div>
        </div>
      </Fragment>
    );
  } else {
    const pageNumbers = [];
    let renderPageNumbers;

    if (total !== null) {
      for (let i = 1; i <= Math.ceil(total / per_page); i++) {
        pageNumbers.push(i);
      }

      renderPageNumbers = pageNumbers.map((number) => {
        let classLink = current_page === number ? "active" : "";
        let classList = current_page === number ? "active" : "";
        return (
          <li className={classList} key={number}>
            <Link
              to="#"
              className={classLink}
              onClick={() => loadProductsOfUser(number)}
            >
              {number}
            </Link>
          </li>
        );
      });
    }

    //get productLastIndex
    let productLastIndex;
    if (current_page === total_pages) {
      //this is the last page
      productLastIndex = total;
    } else {
      productLastIndex = start_index + per_page;
    }

    return (
      <Fragment>
        <h3>Daftar Produk</h3>
        <hr />
        <div className="details-wrap">
          <div className="details-box orders">
            <p>
              <Link to="/akun/buat-produk" className="btn btn-success">
                BUAT PRODUK BARU
              </Link>
            </p>

            <p>
              Menampilkan {start_index + 1} - {productLastIndex} dari total{" "}
              {total} produk
            </p>

            <table className="table table-striped noMoreTable">
              <thead>
                <tr>
                  <th style={{ width: "45%" }}>Produk</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <ProductItem
                    onProductDelete={onProductDelete}
                    onBidActivated={onBidActivated}
                    onBidExpired={onBidExpired}
                    product={product}
                    key={product._id}
                    currentUser={currentUser}
                  />
                ))}
              </tbody>
            </table>
            <div className="pagination-wrapper" style={{ borderTop: "none" }}>
              <ul className="pagination">
                <li>
                  <Link to="#" onClick={() => loadProductsOfUser(1)}>
                    <i className="fa fa-angle-double-left"></i>
                  </Link>
                </li>
                {renderPageNumbers}
                <li>
                  <Link to="#" onClick={() => loadProductsOfUser(total_pages)}>
                    <i className="fa fa-angle-double-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default Products;
