import React, { useContext, useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

import OrdersItem from "./OrdersItem";

function Orders() {
  const [orderData, setOrderData] = useState("");

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
    loadOrders(1);
    //eslint-disable-next-line
  }, []);

  async function loadOrders(pageNumber) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/orders/bypartner/${pageNumber}`
      );

      setOrderData(res.data.data);

      setPagination({
        ...pagination,
        total: res.data.total,
        per_page: res.data.per_page,
        current_page: res.data.page,
        total_pages: res.data.total_pages,
        start_index: res.data.startIndex,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

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
          <Link to="#" className={classLink} onClick={() => loadOrders(number)}>
            {number}
          </Link>
        </li>
      );
    });
  }

  return (
    <>
      <div className="information-title">Pembelian Anda</div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Tgl Order</th>
            <th>Program &amp; Jadwal</th> 
            <th>Harga</th>
            <th>Grand Total</th>
            <th>Status</th>
            <th>Detail</th>
          </tr>
        </thead>
        <tbody>
          {orderData &&
            orderData.map((order, index) => (
              <OrdersItem order={order} key={index} />
            ))}
        </tbody>
      </table>
      <div className="pagination-wrapper" style={{ borderTop: "none" }}>
        <ul className="pagination">
          <li>
            <Link to="#" onClick={() => loadOrders(1)}>
              <i className="fa fa-angle-double-left"></i>
            </Link>
          </li>
          {renderPageNumbers}
          <li>
            <Link to="#" onClick={() => loadOrders(total_pages)}>
              <i className="fa fa-angle-double-right"></i>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Orders;
