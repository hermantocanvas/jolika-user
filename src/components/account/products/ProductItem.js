import React, { useContext, useState, useEffect, Fragment } from "react";
import AlertContext from "../../../context/alert/alertContext";

import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import Countdown from "react-countdown";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const ProductItem = ({
  product,
  onProductDelete,
  onBidActivated,
  onBidExpired,
  currentUser,
}) => {
  const [currentAuction, setcurrentAuction] = useState({
    auction: null,
  });
  const { auction } = currentAuction;
  const [bidExpired, setBidExpired] = useState(false);
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [currentServerTime, setCurrentServerTime] = useState(null);

  const [productCombination, setProductCombination] = useState({});
  useEffect(() => {
    loadAuction();
    loadProductCombination();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    loadCurrentServerTime();
    //eslint-disable-next-line
  }, [product, onBidActivated, onBidExpired, auction, bidExpired, setAlert]);

  async function loadAuction() {
    //load auction data
    try {
      const auctionData = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auctions/product/${product._id}`
      );
      setcurrentAuction({
        ...currentAuction,
        auction: auctionData.data.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  async function loadProductCombination() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/by-product-id/${product._id}`
      );
      if (res.data.data && res.data.data[0]) {
        setProductCombination(res.data.data[0]);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadCurrentServerTime() {
    try {
      const currentTime = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/setting/current_time`
      );
      setCurrentServerTime(currentTime.data.data);
    } catch (err) {
      if (err.response) {
        setAlert(err.response.data.error, "danger");
      }
    }
  }

  const onDelete = async () => {
    confirmAlert({
      title: "Sudah Yakin ?",
      message: `Yakin hapus produk ${name} ?`,
      buttons: [
        {
          label: "Ya",
          onClick: async () => {
            try {
              await axios.delete(
                `${process.env.REACT_APP_APIURL}api/v1/products/${product._id}`
              );
              setAlert(`Produk ${product.name} berhasil dihapus`, "success");
              onProductDelete();
            } catch (err) {
              setAlert(err.message, "danger");
            }
          },
        },
        {
          label: "Tidak",
          onClick: () => console.log("Cancel Delete..."),
        },
      ],
    });
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  //countdown handling by server time
  let clientTime = Date.now();
  let serverTime = currentServerTime;
  const now = () => {
    return serverTime;
  };
  const onTick = () => {
    const now = Date.now();
    serverTime = serverTime + (now - clientTime);
    clientTime = now;
  };
  setInterval(onTick, 1000);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (product.bidStatus === "aktif") {
      if (completed) {
        if (bidExpired === false) {
          countdownOnComplete();
        }

        // Render a completed state
        return <span>LELANG SELESAI.</span>;
      } else {
        // Render a countdown
        if (bidExpired === false) {
          return (
            <span>
              <strong>
                {(() => {
                  if (days !== 0) return `${days}h${" "}`;
                })()}
                {(() => {
                  if (hours !== 0) return `${hours}j${" "}`;
                })()}
                {(() => {
                  if (minutes !== 0) return `${minutes}m${" "}`;
                })()}
                {(() => {
                  if (seconds !== 0) return `${seconds}d${" "}`;
                })()}
              </strong>
            </span>
          );
        } else {
          return (
            <span style={{ fontWeight: "bold", color: "#dc143c" }}>
              LELANG SELESAI.{" "}
            </span>
          );
        }
      }
    }
  };

  //when countdown timer react 0, change product and acution status to tidak aktif
  const countdownOnComplete = async (e) => {
    try {
      let formData = new FormData();
      formData.append("bidStatus", "selesai");

      if (auction.biddingHistory.length === 0) {
        formData.append("winnerBuyerId", "");
        formData.append("winnerUsername", "");
        formData.append("winnerPrice", "");
        formData.append("auctionId", auction._id);
      } else {
        let winnerBid =
          auction.biddingHistory[auction.biddingHistory.length - 1];

        formData.append("winnerBuyerId", winnerBid.buyerId);
        formData.append("winnerUsername", winnerBid.buyerUsername);
        formData.append("winnerPrice", winnerBid.bid);
        formData.append("auctionId", auction._id);
      }

      const res = await axios.put(
        `${process.env.REACT_APP_APIURL}api/v1/products/bidstatus/${product._id}`,
        formData
      );

      //send emails
      if (res.data.data.bidFinishEmailsSent === "no") {
        await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/products/bidfinishsendemails/${res.data.data._id}`,
          formData
        );
      }

      setBidExpired(true);
      onBidExpired();
    } catch (err) {
      console.log(err.message);
    }
  };

  const name = (() => {
    let tmp = product.name;
    if (productCombination.variantDetail1_id) {
      tmp += ` ${productCombination.variantDetail1_id.nameEn}`;
    }
    if (productCombination.variantDetail2_id) {
      tmp += ` - ${productCombination.variantDetail2_id.nameEn}`;
    }
    return tmp;
  })();

  const image =
    productCombination.image ||
    (product.imagesName && product.imagesName[0]) ||
    "";

  const marketplacePrice =
    productCombination.marketplacePrice || product.marketplacePrice;

  // useEffect(() => {
  //   console.log(productCombination);
  // }, [productCombination.image]);

  return (
    <Fragment>
      <tr>
        <td data-title="Produk">
          <div className="row">
            <div className="col-xs-3 col-sm-3">
              <img
                alt={name}
                src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${image}`}
                style={{ width: "80px" }}
              />
            </div>
            <div className="col-xs-8 col-sm-8">
              <div className="cti_title">
                <Link
                  target="_blank"
                  to={`/produk-marketplace/${product.slug}`}
                  style={{ fontSize: "14px" }}
                >
                  {name}
                </Link>
              </div>
              {product.category}
            </div>
          </div>
        </td>
        <td data-title="Harga Awal">
          <div className="cti_harga_tawar">
            Marketplace:
            <br />
            {formatter.format(marketplacePrice)}
          </div>
          {(() => {
            if (
              currentUser.sellerInfo &&
              currentUser.sellerInfo.membershipId &&
              product.startingPrice
            ) {
              return (
                <div className="cti_harga_tawar">
                  Lelang:
                  <br />
                  {formatter.format(product.startingPrice)}
                </div>
              );
            }
          })()}
        </td>
        <td data-title="Status Lelang">
          <p
            style={{
              textTransform: "capitalize",
              ...(product.marketplaceStatus === "aktif"
                ? { color: "green" }
                : { color: "red" }),
            }}
          >
            Marketplace: {product.marketplaceStatus}
          </p>
          {(() => {
            if (currentUser.sellerInfo && currentUser.sellerInfo.membershipId) {
              return (
                <p
                  style={{
                    textTransform: "capitalize",
                    ...(product.bidStatus === "aktif"
                      ? { color: "green" }
                      : { color: "red" }),
                  }}
                >
                  Lelang: {product.bidStatus}
                </p>
              );
            }
          })()}
          {(() => {
            if (currentUser.sellerInfo && currentUser.sellerInfo.membershipId) {
              if (
                product.bidStatus === "selesai" ||
                product.bidStatus === "tidak aktif" ||
                product.bidStatus === "dibatalkan oleh penjual"
              ) {
                return null;
                // <button className="btn btn-success" onClick={onActivate}>
                //   <strong>Aktifkan Lelang</strong>
                // </button>
              }
            }
          })()}

          {(() => {
            if (currentUser.sellerInfo && currentUser.sellerInfo.membershipId) {
              if (product.bidStatus === "aktif") {
                return (
                  <Fragment>
                    {(() => {
                      if (auction) {
                        return (
                          <Fragment>
                            Mulai:
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {moment(auction.startDate).format(
                                "DD MMM YYYY. HH:mm:ss"
                              )}
                            </span>
                            <br />
                            Berakhir:
                            <br />
                            <span style={{ fontSize: "13px" }}>
                              {moment(auction.endDate).format(
                                "DD MMM YYYY. HH:mm:ss"
                              )}
                            </span>
                            <br />
                          </Fragment>
                        );
                      }
                    })()}
                    <Countdown
                      id={product._id}
                      date={product.expiredAt}
                      now={now}
                      renderer={renderer}
                      key={product._id}
                    />
                  </Fragment>
                );
              }
            }
          })()}
        </td>
        <td>
          <Link
            to={`/akun-edit-produk/${product._id}`}
            className="btn btn-primary"
          >
            <i className="fa fa-pencil"></i>
          </Link>{" "}
          {(() => {
            if (product.bidStatus !== "aktif") {
              return (
                <Fragment>
                  <button className="btn btn-danger">
                    <i
                      id={product._id}
                      onClick={onDelete}
                      className="fa fa-trash"
                    ></i>
                  </button>{" "}
                </Fragment>
              );
            }
          })()}
        </td>
      </tr>
    </Fragment>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ProductItem;
