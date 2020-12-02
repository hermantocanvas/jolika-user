import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";
import AuthContext from "../../context/auth/authContext";
import { Link } from "react-router-dom";

const TransactionDiscussion = () => {
  const [orders, setOrders] = useState(null);
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  //set auction data
  const [auction, setAuctionData] = useState({
    sellerUsername: "",
  });
  const { sellerUsername } = auction;

  useEffect(() => {
    loadOrders();
    //eslint-disable-next-line
  }, []);

  async function loadOrders() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/orders/unread-discussion`
      );

      setOrders(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getAuctionData(orderId) {
    try {
      const auction = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auctions/order/${orderId}`
      );
      setAuctionData({
        sellerUsername: auction.data.data.product.sellerUsername,
      });
    } catch (err) {
      console.log(err.message);
    }
  }

  if (orders === null) {
    return (
      <Fragment>
        <h3>Diskusi Transaksi</h3>
        <hr />
        <div className="details-wrap">
          <div className="details-box orders">
            <p>Belum ada diskusi baru.</p>
          </div>
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h3>Diskusi Transaksi</h3>
        <div className="details-wrap">
          <div className="details-box orders">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>No. Transaksi</th>
                  <th>Tanggal</th>
                  <th>Balasan terakhir</th>
                  <th>Balas Sekarang</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  if (
                    (order.discussions.length === 0 &&
                      currentUser.username !== order.questionSenderUsername) ||
                    (order.discussions.length > 0 &&
                      order.discussions[order.discussions.length - 1]
                        .userName !== currentUser.username)
                  ) {
                    const shortenOrderId = order._id
                      .substr(order._id.length - 5)
                      .toUpperCase();

                    return (
                      <tr key={order._id}>
                        <td>{shortenOrderId}</td>
                        {(() => {
                          if (order.discussions.length === 0) {
                            return (
                              <Fragment>
                                <td>
                                  {moment(order.questionDate).format(
                                    "DD MMM YYYY. HH:mm:ss"
                                  )}
                                </td>
                                <td>
                                  {order.question}
                                  <br />
                                  Oleh: {order.questionSenderUsername}
                                </td>
                                {(() => {
                                  //get auction sellerUsername
                                  getAuctionData(order._id);

                                  if (
                                    order.questionSenderUsername ===
                                    sellerUsername
                                  ) {
                                    return (
                                      <td>
                                        <Link
                                          to={`/akun-edit-pembelian/${order._id}`}
                                          className="btn btn-primary"
                                        >
                                          Balas Sekarang
                                        </Link>
                                      </td>
                                    );
                                  } else {
                                    return (
                                      <td>
                                        <Link
                                          to={`/akun-edit-penjualan/${order._id}`}
                                          className="btn btn-primary"
                                        >
                                          Balas Sekarang
                                        </Link>
                                      </td>
                                    );
                                  }
                                })()}
                              </Fragment>
                            );
                          } else {
                            return (
                              <Fragment>
                                <td>
                                  {moment(
                                    order.discussions[
                                      order.discussions.length - 1
                                    ].discussDate
                                  ).format("DD MMM YYYY. HH:mm:ss")}
                                </td>
                                <td>
                                  {
                                    order.discussions[
                                      order.discussions.length - 1
                                    ].discussionText
                                  }
                                  <br />
                                  <span style={{ fontSize: "12px" }}>
                                    Oleh:{" "}
                                    {
                                      order.discussions[
                                        order.discussions.length - 1
                                      ].userName
                                    }
                                  </span>
                                </td>
                                {(() => {
                                  //get auction sellerUsername
                                  getAuctionData(order._id);

                                  if (
                                    order.discussions[
                                      order.discussions.length - 1
                                    ].userName === sellerUsername
                                  ) {
                                    return (
                                      <td>
                                        <Link
                                          to={`/akun-edit-pembelian/${order._id}`}
                                          className="btn btn-primary"
                                        >
                                          Balas Sekarang
                                        </Link>
                                      </td>
                                    );
                                  } else {
                                    return (
                                      <td>
                                        <Link
                                          to={`/akun-edit-penjualan/${order._id}`}
                                          className="btn btn-primary"
                                        >
                                          Balas Sekarang
                                        </Link>
                                      </td>
                                    );
                                  }
                                })()}
                              </Fragment>
                            );
                          }
                        })()}
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default TransactionDiscussion;
