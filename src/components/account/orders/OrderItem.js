import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PropTypes from "prop-types";
import axios from "axios";

const OrderItem = ({ order, userType }) => {
  const [auction, setAuction] = useState({});

  useEffect(() => {
    loadAuction(order._id);
    //eslint-disable-next-line
  }, []);

  async function loadAuction(orderId) {
    try {
      const auction = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auctions/order/${orderId}`
      );
      if (auction.data.data.product) {
        setAuction(auction.data.data.product);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  if (auction) {
    const shortenOrderId = order._id.substr(order._id.length - 5).toUpperCase();

    return (
      <Fragment>
        <tr>
          <td data-title="ID Transaksi">{shortenOrderId}</td>
          {/* <td data-title='Produk' style={{ textTransform: 'capitalize' }}>
            <div className='row'>
              {/* <div className="col-xs-4 col-sm-4">
                {(() => {
                  if (auction.imagesName) {
                    return (
                      <img
                        alt={auction.name}
                        src={`${process.env.REACT_APP_APIURL}uploads/thumbnails/${auction.imagesName[0]}`}
                        style={{ width: "80px" }}
                      />
                    );
                  }
                })()}
              </div> 
              <div className='col-xs-12 col-sm-12'>{auction.name}</div>
            </div>
          </td> */}
          <td data-title="Tgl Transaksi">
            {moment(order.orderDate).format("DD MMM YYYY")}
          </td>
          <td
            data-title="Jenis Transaksi"
            style={{ textTransform: "capitalize" }}
          >
            {order.orderSource}
          </td>
          <td data-title="Total">{formatter.format(order.grandTotal)}</td>
          <td data-title="Cara Bayar" style={{ textTransform: "capitalize" }}>
            {order.paymentType}
          </td>
          <td
            data-title="Status Transaksi"
            style={{ textTransform: "capitalize" }}
          >
            {(() => {
              switch (order.orderStatus) {
                case "sudah kirim refund":
                  return "sudah kirim retur";
                case "refund sudah sampai":
                  return "retur sudah sampai";
                case "refund sudah diterima":
                  return "retur sudah diterima";
                default:
                  return order.orderStatus;
              }
            })()}
          </td>
          <td data-title="Tindakan">
            {(() => {
              if (userType === "buyer") {
                return (
                  <Link
                    to={`/akun-edit-pembelian/${order._id}`}
                    className="btn btn-primary"
                  >
                    <i className="fa fa-pencil"></i>
                    {(() => {
                      if (
                        order.orderReview === "tidak" &&
                        (order.orderAccepted === "ya" ||
                          order.orderRefundAccepted === "ya" ||
                          (order.complainDate &&
                            order.complainAccepted === "tidak"))
                      ) {
                        return null;
                        // <Fragment>
                        //   <br />
                        //   <span style={{ fontSize: "12px" }}>
                        //     BERI ULASAN
                        //   </span>
                        // </Fragment>
                      }
                    })()}
                  </Link>
                );
              } else if (userType === "seller") {
                return (
                  <Link
                    to={`/akun-edit-penjualan/${order._id}`}
                    className="btn btn-primary"
                  >
                    <i className="fa fa-pencil"></i>
                    {(() => {
                      if (
                        order.orderReviewForBuyer === "tidak" &&
                        (order.orderAccepted === "ya" ||
                          order.orderRefundAccepted === "ya" ||
                          (order.complainDate &&
                            order.complainAccepted === "tidak"))
                      ) {
                        return null;
                        // <Fragment>
                        //   <br />
                        //   <span style={{ fontSize: "12px" }}>
                        //     BERI ULASAN
                        //   </span>
                        // </Fragment>
                      }
                    })()}
                  </Link>
                );
              }
            })()}
          </td>
        </tr>
      </Fragment>
    );
  }
};

OrderItem.propTypes = {
  order: PropTypes.object.isRequired,
  userType: PropTypes.string.isRequired,
};

export default OrderItem;
