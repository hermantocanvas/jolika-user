import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import AuthContext from "../../context/auth/authContext";

const Dashboard = () => {
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  const [countWinBid, setCountWinBid] = useState(0);
  const [countUnpaidOrder, setCountUnpaidOrder] = useState(0);
  const [countUnsentOrder, setCountUnsentOrder] = useState(0);
  const [countAcceptedOrder, setCountAcceptedOrder] = useState(0);
  const [countUnreviewOrderSeller, setCountUnreviewOrderSeller] = useState(0);
  const [countUnreviewOrderBuyer, setCountUnreviewOrderBuyer] = useState(0);
  const [countComplainOrderBuyer, setCountComplainOrderBuyer] = useState(0);
  const [countComplainOrderSeller, setCountComplainOrderSeller] = useState(0);
  const [countProductDiscussion, setCountProductDiscussion] = useState(0);
  const [countOrderDiscussion, setCountOrderDiscussion] = useState(0);

  useEffect(() => {
    loadAllCounts();
    //eslint-disable-next-line
  }, []);

  async function loadAllCounts() {
    try {
      const countWinBid = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/bidwin/count`
      );
      setCountWinBid(countWinBid.data.count);

      const countUnpaidOrder = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/unpaid_order/count`
      );
      setCountUnpaidOrder(countUnpaidOrder.data.count);

      const countUnsentOrder = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/unsent_order/count`
      );
      setCountUnsentOrder(countUnsentOrder.data.count);

      const countAcceptedOrder = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/accepted_order/count`
      );
      setCountAcceptedOrder(countAcceptedOrder.data.count);

      const countUnreviewOrderSeller = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/unreview_order_seller/count`
      );
      setCountUnreviewOrderSeller(countUnreviewOrderSeller.data.count);

      const countUnreviewOrderBuyer = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/unreview_order_buyer/count`
      );
      setCountUnreviewOrderBuyer(countUnreviewOrderBuyer.data.count);

      const countComplainOrderBuyer = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/complain_order_buyer/count`
      );
      setCountComplainOrderBuyer(countComplainOrderBuyer.data.count);

      const countComplainOrderSeller = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/complain_order_seller/count`
      );
      setCountComplainOrderSeller(countComplainOrderSeller.data.count);

      const countProductDiscussion = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/product_discussion/count`
      );
      setCountProductDiscussion(countProductDiscussion.data.count);

      const countOrderDiscussion = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/statistic/order_discussion/count`
      );
      setCountOrderDiscussion(countOrderDiscussion.data.count);
    } catch (err) {
      console.log("error:", err.message);
    }
  }

  return (
    <Fragment>
      <h3>Beranda</h3>
      <hr />
      <div className="details-wrap">
        <h2 style={{ fontSize: "16px", marginBottom: "15px" }}>
          Penting untuk ditindaklanjuti. {moment(Date()).format("DD MMM YYYY")}
        </h2>
        <div className="row">
          <div className="col-sm-4">
            <div className="card" style={styles.myCard}>
              <Link to="/akun/lelang" style={{ color: "black" }}>
                <div className="card-body">
                  <p className="card-text">
                    Lelang (Bid) Menang
                    <br />
                    Segera lanjutkan checkout
                  </p>
                  <h4 style={{}}>{countWinBid}</h4>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card-body" style={styles.myCard}>
              <Link to="/akun/pembelian" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>
                    Transaksi Beli belum bayar
                    <br />
                    Lakukan konfirmasi pembayaran
                  </p>
                  <h4 style={{}}>{countUnpaidOrder}</h4>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card-body" style={styles.myCard}>
              <Link to="/akun/pembelian" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>Transaksi Beli belum terima produk</p>
                  <h4 style={{}}>{countAcceptedOrder}</h4>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card-body" style={styles.myCard}>
              <Link to="/akun/pembelian" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>
                    Transaksi Beli komplain
                    <br />
                    Tindaklanjuti &amp; monitor komplain
                  </p>
                  <h4 style={{}}>{countComplainOrderBuyer}</h4>
                </div>
              </Link>
            </div>
          </div>

          <div className="col-sm-4">
            <div className="card-body" style={styles.myCard}>
              <Link to="/akun/pembelian" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>
                    Ulasan kepada penjual
                    <br />
                    Berikan ulasan kepada penjual
                  </p>
                  <h4 style={{}}>{countUnreviewOrderSeller}</h4>
                </div>
              </Link>
            </div>
          </div>

          {(() => {
            if (currentUser && currentUser.role === "seller") {
              return (
                <>
                  <div className="col-sm-4">
                    <div className="card-body" style={styles.myCard}>
                      <Link to="/akun/penjualan" style={{ color: "black" }}>
                        <div className="panel-body">
                          <p>
                            Transaksi Jual belum dikirim
                            <br />
                            Lakukan konfirmasi pengiriman produk
                          </p>
                          <h4 style={{}}>{countUnsentOrder}</h4>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="card-body" style={styles.myCard}>
                      <Link to="/akun/penjualan" style={{ color: "black" }}>
                        <div className="panel-body">
                          <p>
                            Transaksi Jual komplain
                            <br />
                            Tindaklanjuti &amp; monitoring komplain
                          </p>
                          <h4 style={{}}>{countComplainOrderSeller}</h4>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="col-sm-4">
                    <div className="card-body" style={styles.myCard}>
                      <Link to="/akun/penjualan" style={{ color: "black" }}>
                        <div className="panel-body">
                          <p>
                            Ulasan kepada pembeli
                            <br />
                            Berikan ulasan kepada pembeli
                          </p>
                          <h4 style={{}}>{countUnreviewOrderBuyer}</h4>
                        </div>
                      </Link>
                    </div>
                  </div>
                </>
              );
            }
          })()}

          {/* <div className="col-sm-4">
            <div className="card-body" style={{ background: 'hsl(210, 11%, 96%)' }}>
              <Link to="/akun/diskusi-produk" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>
                    Diskusi produk belum dibalas
                    <br />
                    Balas pertanyaan diskusi produk
                  </p>
                  <h4 style={{  }}>
                    {countProductDiscussion}
                  </h4>
                </div>
              </Link>
            </div>
          </div> */}

          <div className="col-sm-4">
            <div className="card-body" style={styles.myCard}>
              <Link to="/akun/diskusi-transaksi" style={{ color: "black" }}>
                <div className="panel-body">
                  <p>Diskusi transaksi belum dibalas</p>
                  <h4 style={{}}>{countOrderDiscussion}</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const styles = {
  myCard: {
    background: "hsl(210, 11%, 96%)",
    minHeight: "180px",
    marginBottom: "20px",
  },
};

export default Dashboard;
