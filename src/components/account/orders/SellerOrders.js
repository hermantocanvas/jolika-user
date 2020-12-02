import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import AlertContext from "../../../context/alert/alertContext";
import OrderItem from "./OrderItem";
import { Link } from "react-router-dom";

const SellerOrders = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [orders, setOrders] = useState([]);
  const [chosenStatus, setChosenStatus] = useState("tampilkan semua");
  const [chosenOrderId, setOrderId] = useState(null);
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
    loadOrdersOfSeller(1);
    //eslint-disable-next-line
  }, [chosenStatus, chosenOrderId]);

  async function loadOrdersOfSeller(pageNumber) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/orders/seller/get/${chosenOrderId}/${chosenStatus}/${pageNumber}`
      );
      setOrders(res.data.data);

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

  const onChangeStatus = (e) => {
    setChosenStatus(e.target.value);
  };

  const onClickReset = () => {
    setChosenStatus("tampilkan semua");
    setOrderId(null);
  };

  const onInputOrderId = (e) => {
    if (e.target.value === "") {
      setOrderId(null);
    } else {
      setOrderId(e.target.value);
    }
  };

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
            onClick={() => loadOrdersOfSeller(number)}
          >
            {number}
          </Link>
        </li>
      );
    });
  }

  //get auctionLastIndex
  let auctionLastIndex;
  if (current_page === total_pages) {
    //this is the last page
    auctionLastIndex = total;
  } else {
    auctionLastIndex = start_index + per_page;
  }

  return (
    <Fragment>
      <h3>Daftar Transaksi Penjualan</h3>
      <hr />
      <div className="details-wrap">
        <div className="details-box orders">
          <div className="row">
            <div className="col-sm-3">
              {(() => {
                if (orders === null || orders.length === 0) {
                  return <p>Tidak ada transaksi.</p>;
                } else {
                  return (
                    <p>
                      Menampilkan {start_index + 1} - {auctionLastIndex} dari
                      total {total} transaksi
                    </p>
                  );
                }
              })()}
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  onChange={onInputOrderId}
                  value={chosenOrderId || ""}
                  placeholder="Cari ID Transaksi.."
                />
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <select
                  onChange={onChangeStatus}
                  className="form-control"
                  style={{ width: "100%" }}
                  value={chosenStatus}
                >
                  <option value="tampilkan semua">Cari Status</option>
                  <option value="belum bayar">Belum bayar</option>
                  <option value="sudah konfirmasi">Sudah konfirmasi</option>
                  <option value="lunas">Lunas</option>
                  <option value="sudah dikirim">Sudah dikirim</option>
                  <option value="sudah sampai">Sudah sampai</option>
                  <option value="sudah diterima">Sudah diterima</option>
                  <option value="komplain">Komplain</option>
                  <option value="selesai">Selesai</option>
                  <option value="dibatalkan sistem">Dibatalkan sistem</option>
                  <option value="dibatalkan admin">Dibatalkan admin</option>
                  <option value="komplain diterima">Komplain diterima</option>
                  <option value="komplain ditolak">Komplain ditolak</option>
                  <option value="sudah kirim refund">Sudah kirim retur</option>
                  <option value="refund sudah sampai">
                    Retur sudah sampai
                  </option>
                  <option value="refund sudah diterima">
                    Retur sudah diterima
                  </option>
                  <option value="refund selesai">Refund selesai</option>
                </select>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="form-group">
                <button className="btn btn-success" onClick={onClickReset}>
                  RESET
                </button>
              </div>
            </div>
          </div>
          <table className="table table-striped noMoreTable">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Tgl Transaksi</th>
                <th>Jenis</th>
                <th>Total</th>
                <th>Cara Bayar</th>
                <th>Status</th>
                <th>Tindakan</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderItem key={order._id} order={order} userType="seller" />
              ))}
            </tbody>
          </table>
          <div className="pagination-wrapper" style={{ borderTop: "none" }}>
            <ul className="pagination">
              <li>
                <Link to="#" onClick={() => loadOrdersOfSeller(1)}>
                  <i className="fa fa-angle-double-left"></i>
                </Link>
              </li>
              {renderPageNumbers}
              <li>
                <Link to="#" onClick={() => loadOrdersOfSeller(total_pages)}>
                  <i className="fa fa-angle-double-right"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default SellerOrders;
