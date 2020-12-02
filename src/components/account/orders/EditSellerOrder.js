import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import imageCompression from "browser-image-compression";
import Loader from "react-loader-spinner";
import Modal from "react-responsive-modal";

import AccountMenu from "../AccountMenu";
import AuthContext from "../../../context/auth/authContext";
import MarketplaceProductDetail from "./MarketplaceProductDetail";
import AlertContext from "../../../context/alert/alertContext";

const EditSellerOrder = ({ match }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;
  const [loadSpinner, setLoadSpinner] = useState(false);
  //set order data
  const [order, setOrder] = useState({});

  //set tracking airwaybillDetail
  const [airwaybillDetail, setAirwaybillDetail] = useState({
    query: "",
    status: "",
    result: "",
  });

  //modal for live tracing airwaybill
  const [modalIsOpen, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

  //button konfirmasi pegiriman
  const [buttonConfirmSent, setButtonConfirmSent] = useState("active");

  //set auction data
  const [auction, setAuctionData] = useState({
    name: "",
    imagesName: "",
    weight: "",
    condition: "",
    productDesc: "",
    winnerUsername: "",
  });
  const {
    name,
    imagesName,
    weight,
    condition,
    productDesc,
    winnerUsername,
  } = auction;

  //set cities data for buyer
  const [buyerCities, setBuyerCities] = useState({
    buyerSubdistrict: "",
    buyerDistrict: "",
    buyerProvince: "",
  });
  const { buyerSubdistrict, buyerDistrict, buyerProvince } = buyerCities;

  //set cities data for seller
  const [sellerCities, setSellerCities] = useState({
    sellerDistrict: "",
    sellerProvince: "",
    sellerShopName: "",
  });
  const { sellerDistrict, sellerProvince, sellerShopName } = sellerCities;

  //set payment confirmed data
  const [resi, setResi] = useState("");

  //set existing review data
  const [currentReview, setCurrentReview] = useState({
    currentRating: "",
    currentReviewText: "",
    currentReplyText: "",
  });
  const { currentRating, currentReviewText } = currentReview;

  //set review data
  const [review, setReview] = useState({
    rating: "",
    reviewText: "",
  });
  const { rating, reviewText } = review;

  const [images, setImages] = useState({
    image1: "",
  });
  const { image1 } = images;

  useEffect(() => {
    loadData();
    //eslint-disable-next-line
  }, []);

  async function loadData() {
    try {
      const order = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/orders/get/${match.params.orderId}`
      );

      setOrder(order.data.data);

      if (order.data.data.orderSource === "online auction") {
        const auction = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/auctions/order/${match.params.orderId}`
        );

        setAuctionData({
          name: auction.data.data.product.name,
          imagesName: auction.data.data.product.imagesName,
          weight: auction.data.data.product.weight,
          condition: auction.data.data.product.condition,
          sellerUsername: auction.data.data.product.sellerUsername,
          sellerProvinceId: auction.data.data.product.provinceId,
          sellerDistrictId: auction.data.data.product.districtId,
          sellerSubdistrictId: auction.data.data.product.subdistrictId,
          productDesc: auction.data.data.product.description,
          winnerUsername: auction.data.data.winnerUsername,
        });
      }

      const buyerCities = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/data/${order.data.data.recipientProvinceId}&${order.data.data.recipientDistrictId}&${order.data.data.recipientSubdistrictId}`
      );

      setBuyerCities({
        buyerSubdistrict: buyerCities.data.data.subdistrict.subdistrict,
        buyerDistrict: buyerCities.data.data.district.district,
        buyerProvince: buyerCities.data.data.province.province,
      });

      if (order.data.data.orderReviewForBuyer === "ya") {
        //load review
        const review = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/orders/review-buyer/get/${order.data.data.buyerId}/${order.data.data._id}`
        );

        if (review.data.data) {
          setCurrentReview({
            ...currentReview,
            currentRating: review.data.data.rating,
            currentReviewText: review.data.data.reviewText,
          });
        }
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  const onChangeResi = (e) => {
    setResi(e.target.value);
  };

  const onSubmitSentConfirm = async (e) => {
    e.preventDefault();

    setLoadSpinner(true);
    setButtonConfirmSent("nonactive");

    if (resi === "") {
      setAlert("Mohon mengisi semua field", "danger");
      setLoadSpinner(false);
      setButtonConfirmSent("active");
    } else if (image1 === "") {
      setAlert("Foto resi harus diupload", "danger");
      setLoadSpinner(false);
      setButtonConfirmSent("active");
    } else {
      //check if airwaybill valid
      let formData = new FormData();
      //get airwaybill latest info
      if (
        order.chosenCarrier === "Jne Regular" ||
        order.chosenCarrier === "Jne Yes"
      ) {
        formData.append("courier", "jne");
      }
      if (order.chosenCarrier === "JnT Regular") {
        formData.append("courier", "jnt");
      }
      if (
        order.chosenCarrier === "Sicepat Regular" ||
        order.chosenCarrier === "Sicepat Best"
      ) {
        formData.append("courier", "sicepat");
      }
      formData.append("waybill", resi);
      try {
        const tracking = await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/shipping/getTracking`,
          formData
        );

        //set for dummy testing only
        tracking.data.data.rajaongkir.status.code = 200;
        tracking.data.data.rajaongkir.status.description = "OK";

        if (
          tracking.data.data.rajaongkir.status.code === 200 &&
          tracking.data.data.rajaongkir.status.description === "OK"
        ) {
          //valid
          confirmAlert({
            title: "Konfirmasi Pengiriman?",
            message: `Sudah yakin mau konfirmasi Produk Sudah Dikirim?`,
            buttons: [
              {
                label: "Ya",
                onClick: () => {
                  submitSentConfirm();
                },
              },
              {
                label: "Tidak",
                onClick: () => {
                  setLoadSpinner(false);
                  setButtonConfirmSent("active");
                  console.log("Cancel Confirm Sent...");
                },
              },
            ],
          });
        } else {
          //not valid
          setAlert("No Resi tidak tercatat. Mohon dicek kembali.", "danger");
          setLoadSpinner(false);
          setButtonConfirmSent("active");
        }
      } catch (err) {
        setAlert(err.message, "danger");
        setLoadSpinner(false);
        setButtonConfirmSent("active");
      }

      async function submitSentConfirm() {
        let formData = new FormData();
        if (image1) {
          formData.append("files", image1);
        }
        formData.append("imagesName", []);
        formData.append("orderStatus", "sudah dikirim");
        formData.append("orderSent", "ya");
        formData.append("sentNoResi", resi);

        try {
          const res = await axios.put(
            `${process.env.REACT_APP_APIURL}api/v1/orders/sentconfirm/${match.params.orderId}`,
            formData
          );
          setOrder(res.data.data);

          //clear images
          setImages({
            image1: "",
          });

          // setAlert(
          //   "Konfirmasi Pengiriman berhasil dibuat. Sistem telah mengirim email notifikasi ke pembeli",
          //   "success"
          // );

          setAlert("Konfirmasi Pengiriman berhasil dibuat.", "success");
        } catch (err) {
          setAlert(err.message, "danger");
        }
      }
    }
  };

  const onChangeImage = async (e) => {
    const imageId = e.target.id;
    const imageFile = e.target.files[0];

    if (!imageFile.type.startsWith("image")) {
      setAlert(`File harus dalam format gambar/image`, "danger");
    } else {
      const options = {
        maxSizeMB: 0.8,
        maxWidthOrHeight: 600,
        useWebWorker: true,
        onProgress: () => null,
      };
      try {
        //compress file
        const compressedBlob = await imageCompression(imageFile, options);

        const compressedFile = new File([compressedBlob], imageFile.name, {
          lastModified: compressedBlob.lastModified,
          type: "image/jpeg",
        });

        switch (imageId) {
          case "file1":
            setImages({
              ...images,
              image1: compressedFile,
            });
            break;
          default:
            break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDeletePreviewImage = (e) => {
    e.preventDefault();
    const deleteId = e.target.id;

    switch (deleteId) {
      case "delete1":
        document.getElementById(`preview1`).setAttribute("src", "");
        document.getElementById(`file1`).value = null;
        setImages({
          ...images,
          image1: "",
        });
        break;
      default:
        break;
    }
  };

  const onChangeReview = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const onSubmitReview = async (e) => {
    e.preventDefault();

    confirmAlert({
      title: "Sudah Yakin?",
      message: `Sudah yakin mau kirim ulasan?`,
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            submitReview();
          },
        },
        {
          label: "Tidak",
          onClick: () => console.log("Cancel review..."),
        },
      ],
    });

    async function submitReview() {
      let formData = new FormData();
      formData.append("reviewUserId", currentUser._id);
      formData.append("reviewUsername", currentUser.username);
      formData.append("reviewFor", "buyer");
      formData.append("rating", rating);
      formData.append("reviewText", reviewText);
      formData.append("orderId", order._id);
      formData.append("auctionId", order.auctionId);

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/review/${order.buyerId}`,
          formData
        );

        setOrder(res.data.data);

        if (res.data.data.orderReviewForBuyer === "ya") {
          //load review
          const review = await axios.get(
            `${process.env.REACT_APP_APIURL}api/v1/orders/review-buyer/get/${res.data.data.buyerId}/${res.data.data._id}`
          );

          setCurrentReview({
            ...currentReview,
            currentRating: review.data.data.rating,
            currentReviewText: review.data.data.reviewText,
          });
        }

        // setAlert(
        //   "Review berhasil di simpan dan notifikasi email sudah dikirim ke pembeli",
        //   "success"
        // );

        setAlert("Review berhasil di simpan.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
  };

  const onSubmitAcceptedConfirm = async (e) => {
    e.preventDefault();

    confirmAlert({
      title: "Sudah Yakin?",
      message: `Sudah yakin produk retur diterima?`,
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            submitAcceptedConfirm();
          },
        },
        {
          label: "Tidak",
          onClick: () => console.log("Cancel Confirm Receiving..."),
        },
      ],
    });

    async function submitAcceptedConfirm() {
      let formData = new FormData();
      formData.append("orderStatus", "refund sudah diterima");
      formData.append("orderRefundReceive", "ya");
      formData.append("orderRefundAccepted", "ya");

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/refundacceptedconfirm/${match.params.orderId}`,
          formData
        );
        setOrder(res.data.data);

        // setAlert(
        //   "Konfirmasi produk diterima berhasil disimpan. Sistem telah mengirim email notifikasi ke pembeli",
        //   "success"
        // );

        setAlert("Konfirmasi produk diterima berhasil disimpan.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
  };

  const dicussionSubmitted = () => {
    loadData();
  };

  const trackingAirwaybill = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    //get airwaybill latest info
    if (
      order.chosenCarrier === "Jne Regular" ||
      order.chosenCarrier === "Jne Yes"
    ) {
      formData.append("courier", "jne");
    }

    if (order.chosenCarrier === "JnT Regular") {
      formData.append("courier", "jnt");
    }

    if (
      order.chosenCarrier === "Sicepat Regular" ||
      order.chosenCarrier === "Sicepat Best"
    ) {
      formData.append("courier", "sicepat");
    }

    formData.append("waybill", order.sentNoResi);

    try {
      const tracking = await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/getTracking`,
        formData
      );

      setAirwaybillDetail({
        query: tracking.data.data.rajaongkir.query,
        status: tracking.data.data.rajaongkir.status,
        result: tracking.data.data.rajaongkir.result,
      });

      openModal();
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  if (auction && order && currentUser) {
    if (order.sellerId !== currentUser._id) {
      return null;
    }

    const shortenOrderId = match.params.orderId
      .substr(match.params.orderId.length - 5)
      .toUpperCase();

    if (image1) {
      document
        .getElementById("preview1")
        .setAttribute("src", URL.createObjectURL(image1));
    }

    return (
      <section className="page-section">
        <div className="wrap container">
          <div className="row">
            <AccountMenu />
            <div className="col-lg-9 col-md-9 col-sm-8">
              <div className="information-title">
                Penjualan Order Id: {shortenOrderId}
              </div>
              <div className="details-wrap">
                {(() => {
                  if (order.orderCancelReason === "pembeli tidak bayar") {
                    return (
                      <div
                        style={{
                          fontWeight: "bold",
                          background: "brown",
                          color: "white",
                          padding: "10px",
                          marginBottom: "15px",
                        }}
                      >
                        Transaksi ini sudah dibatalkan oleh sistem, karena
                        pembeli Hit &amp; Run (belum melakukan konfirmasi
                        pembayaran setelah batas waktu berakhir).
                      </div>
                    );
                  }

                  if (order.orderCancelReason === "penjual tidak kirim") {
                    return (
                      <>
                        <div
                          style={{
                            fontWeight: "bold",
                            background: "brown",
                            color: "white",
                            padding: "10px",
                            marginBottom: "15px",
                          }}
                        >
                          Transaksi ini sudah dibatalkan oleh sistem, karena
                          Kamu belum melakukan konfirmasi pengiriman produk
                          setelah batas waktu berakhir.
                        </div>
                        {(() => {
                          if (
                            order.refundSettle === "tidak" &&
                            order.orderCancelReason === "penjual tidak kirim"
                          ) {
                            return (
                              <div
                                style={{
                                  fontWeight: "bold",
                                  background: "grey",
                                  color: "white",
                                  padding: "10px",
                                  marginBottom: "15px",
                                }}
                              >
                                Admin Okebid akan mengirimkan refund ke rekening
                                pembeli dalam waktu 24 jam.
                              </div>
                            );
                          } else if (
                            order.refundSettle === "ya" &&
                            order.orderCancelReason === "penjual tidak kirim"
                          ) {
                            return (
                              <div
                                style={{
                                  fontWeight: "bold",
                                  background: "green",
                                  color: "white",
                                  padding: "10px",
                                  marginBottom: "15px",
                                }}
                              >
                                Dana refund sudah dikembalikan ke rekening
                                pembeli.
                              </div>
                            );
                          }
                        })()}
                      </>
                    );
                  }

                  if (order.orderCancelReason === "pembeli tidak kirim retur") {
                    return (
                      <>
                        <div
                          style={{
                            fontWeight: "bold",
                            background: "brown",
                            color: "white",
                            padding: "10px",
                            marginBottom: "15px",
                          }}
                        >
                          Transaksi ini sudah diterima (accepted) oleh sistem,
                          karena pembeli belum melakukan konfirmasi pengiriman
                          produk retur setelah batas waktu berakhir.
                        </div>
                        {(() => {
                          if (
                            order.orderSettle === "tidak" &&
                            order.orderCancelReason ===
                              "pembeli tidak kirim retur"
                          ) {
                            return (
                              <div
                                style={{
                                  fontWeight: "bold",
                                  background: "grey",
                                  color: "white",
                                  padding: "10px",
                                  marginBottom: "15px",
                                }}
                              >
                                Dana belum dikirimkan ke Kamu. Silahkan menunggu
                                maksimal 24 jam.
                              </div>
                            );
                          } else if (
                            order.orderSettle === "ya" &&
                            order.orderCancelReason ===
                              "pembeli tidak kirim retur"
                          ) {
                            return (
                              <div
                                style={{
                                  fontWeight: "bold",
                                  background: "green",
                                  color: "white",
                                  padding: "10px",
                                  marginBottom: "15px",
                                }}
                              >
                                Dana sudah dikirim ke rekening Kamu. Jumlah
                                ditransfer:{" "}
                                {formatter.format(order.settleAmount)} (dipotong
                                3% biaya transaksi dari harga produk{" "}
                                {formatter.format(order.productPrice)}
                                )
                                <br />
                                {order.settleBankAcc}
                              </div>
                            );
                          }
                        })()}
                      </>
                    );
                  }

                  if (order.orderSent === "ya") {
                    return null;
                  } else if (
                    order.paymentConfirmed === "ya" &&
                    order.orderPaid === "ya" &&
                    order.orderSent === "tidak"
                  ) {
                    return (
                      <Fragment>
                        <h3>Konfirmasi Pengiriman Produk</h3>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <p>
                              Pembeli sudah melakukan pembayaran ke Okebid.
                              Silahkan melakukan pengiriman dalam waktu maksimal
                              48 jam (batas waktu{" "}
                              {moment(order.orderSentExpiredDate).format(
                                "DD MMM YYYY. HH:mm:ss"
                              )}
                              ), dan konfirmasikan pengiriman Kamu dengan
                              mengisi Nomor Resi dan tombol KONFIRMASI SUDAH
                              KIRIM.
                            </p>
                          </div>
                          <div className="col-md-6">
                            <form
                              onSubmit={onSubmitSentConfirm}
                              className="form-login"
                            >
                              <div className="form-group">
                                <label htmlFor="resi">
                                  Nomor Resi Pengiriman {order.chosenCarrier}
                                </label>
                                <input
                                  className="form-control"
                                  type="text"
                                  name="resi"
                                  placeholder="Isi Nomor Resi Pengiriman..."
                                  required
                                  value={resi}
                                  onChange={onChangeResi}
                                />
                              </div>
                              <div className="form-group">
                                <label>Upload Foto Resi (AWB)</label>
                                <img
                                  style={{ width: "100px" }}
                                  id="preview1"
                                  alt=""
                                ></img>
                                <br />
                                {(() => {
                                  if (image1) {
                                    return (
                                      <button
                                        id="delete1"
                                        onClick={onDeletePreviewImage}
                                        className="btn btn-default"
                                      >
                                        Hapus Gambar
                                      </button>
                                    );
                                  }
                                })()}
                                <input
                                  type="file"
                                  name="file1"
                                  id="file1"
                                  className="form-control"
                                  onChange={onChangeImage}
                                  required
                                />
                              </div>
                              {(() => {
                                if (buttonConfirmSent !== "active") {
                                  return (
                                    <input
                                      type="submit"
                                      style={{ fontWeight: "bold" }}
                                      value="KONFIRMASI SUDAH KIRIM"
                                      className="btn btn-success custom-class"
                                      disabled="disabled"
                                    />
                                  );
                                } else {
                                  return (
                                    <input
                                      type="submit"
                                      style={{ fontWeight: "bold" }}
                                      value="KONFIRMASI SUDAH KIRIM"
                                      className="btn btn-success custom-class"
                                    />
                                  );
                                }
                              })()}
                            </form>
                            {(() => {
                              if (loadSpinner) {
                                return (
                                  <>
                                    <Loader
                                      type="ThreeDots"
                                      color="green"
                                      height={100}
                                      width={100}
                                    />
                                    <p>
                                      Mohon tunggu, sedang pengecekan ke server
                                      kurir...
                                    </p>
                                  </>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      </Fragment>
                    );
                  }
                })()}
                {(() => {
                  if (
                    order.orderAccepted === "ya" ||
                    order.orderRefundAccepted === "ya" ||
                    (order.complainDate && order.complainAccepted === "tidak")
                  ) {
                    if (order.orderReviewForBuyer === "tidak") {
                      if (order.orderSource === "online auction") {
                        return (
                          <Fragment>
                            <h3>
                              Berikan ulasan untuk pembeli{" "}
                              <span style={{ textTransform: "capitalize" }}>
                                {winnerUsername}
                              </span>
                            </h3>
                            <hr />
                            <div className="row">
                              <div className="col-md-12">
                                <div
                                  style={{
                                    padding: "15px",
                                    background: "#c8ffc2",
                                    marginBottom: "30px",
                                  }}
                                >
                                  <p>
                                    Berikan ulasan untuk{" "}
                                    <span
                                      style={{ textTransform: "capitalize" }}
                                    >
                                      {winnerUsername}
                                    </span>
                                    <br />
                                    (Ulasan yang tidak sesuai dengan{" "}
                                    <Link
                                      to="/syarat-ketentuan"
                                      target="_blank"
                                    >
                                      Syarat dan Ketentuan Okebid
                                    </Link>{" "}
                                    akan dihapus oleh Admin)
                                  </p>
                                  <form
                                    onSubmit={onSubmitReview}
                                    className="form-login"
                                  >
                                    <div className="form-group">
                                      <label htmlFor="rating">
                                        Pilih Rating{" "}
                                        <i className="fa fa-star"></i>
                                      </label>
                                      <select
                                        name="rating"
                                        value={rating}
                                        onChange={onChangeReview}
                                        className="form-control"
                                        required
                                      >
                                        <option value="">
                                          Pilih Rating...
                                        </option>
                                        <option value="5 (Sangat memuaskan)">
                                          5 (Sangat memuaskan)
                                        </option>
                                        <option value="4 (Cukup puas)">
                                          4 (Cukup puas)
                                        </option>
                                        <option value="3 (Biasa saja)">
                                          3 (Biasa saja)
                                        </option>
                                        <option value="2 (Kurang memuaskan)">
                                          2 (Kurang memuaskan)
                                        </option>
                                        <option value="1 (Pelayanan buruk)">
                                          1 (buruk)
                                        </option>
                                      </select>
                                    </div>
                                    <div className="form-group">
                                      <label htmlFor="reviewText">
                                        Isi Ulasan
                                      </label>
                                      <textarea
                                        name="reviewText"
                                        className="form-control"
                                        rows="3"
                                        value={reviewText}
                                        onChange={onChangeReview}
                                        required
                                        maxLength="300"
                                        placeholder="Berikan ulasan untuk pembeli..."
                                      ></textarea>
                                      <label
                                        className="labelInputWarning"
                                        htmlFor="reviewText"
                                      >
                                        Maks 300 karakter
                                      </label>
                                    </div>
                                    <input
                                      type="submit"
                                      style={{ fontWeight: "bold" }}
                                      value="KIRIM ULASAN"
                                      className="btn btn-primary custom-class"
                                    />
                                  </form>
                                </div>
                              </div>
                            </div>
                          </Fragment>
                        );
                      }
                    } else {
                      if (currentRating && currentReviewText) {
                        return (
                          <Fragment>
                            <h3>Ulasan</h3>
                            <hr />
                            <p style={{ fontWeight: "bold" }}>
                              Kamu telah memberi ulasan order {shortenOrderId}{" "}
                              untuk{" "}
                              <span style={{ textTransform: "capitalize" }}>
                                {winnerUsername}.
                              </span>
                              <br />
                              Rating: {currentRating}
                              <br />
                              Ulasan: {currentReviewText}
                            </p>
                          </Fragment>
                        );
                      }
                    }
                  }
                })()}

                {(() => {
                  if (
                    order.paymentConfirmed === "ya" &&
                    order.orderPaid === "ya" &&
                    order.orderSent === "ya" &&
                    order.orderAccepted === "tidak" &&
                    order.complainDate &&
                    order.orderRefundSent === "ya" &&
                    order.orderRefundAccepted === "tidak"
                  ) {
                    return (
                      <Fragment>
                        <h3>Konfirmasi produk retur sudah Kamu terima.</h3>
                        <hr />
                        <div className="row">
                          <div className="col-md-12">
                            <div
                              style={{
                                padding: "15px",
                                background: "#c8ffc2",
                                marginBottom: "30px",
                              }}
                            >
                              <p>
                                Pastikan produk sudah Kamu terima dan klik
                                tombol KONFIRMASI PRODUK RETUR SUDAH DITERIMA.
                              </p>
                              <p>
                                <strong>
                                  Bila waktu sudah melewati 48 jam sejak produk
                                  diterima dan Kamu belum melakukan konfirmasi,
                                  maka transaksi kami anggap selesai dan dana
                                  akan kami kembalikan ke pembeli.
                                </strong>
                              </p>

                              <form
                                onSubmit={onSubmitAcceptedConfirm}
                                className="form-login"
                              >
                                <input
                                  type="submit"
                                  style={{
                                    fontWeight: "bold",
                                    backgroundColor: "green",
                                  }}
                                  value="KONFIRMASI PRODUK RETUR SUDAH DITERIMA"
                                  className="btn btn-success custom-class"
                                />
                              </form>
                            </div>
                          </div>
                        </div>
                      </Fragment>
                    );
                  }
                })()}

                {(() => {
                  if (
                    order.orderStatus === "komplain" &&
                    order.complainDate !== null &&
                    order.complainAccepted === null
                  ) {
                    return (
                      <div style={{ background: "#e8e7e7", padding: "20px" }}>
                        <p>
                          Pembeli diberi waktu maksimal 48 jam (batas waktu{" "}
                          {moment(order.complainEmailExpiredDate).format(
                            "DD MMM YYYY. HH:mm:ss"
                          )}
                          ) untuk email ke{" "}
                          <b>
                            <a href="mailto:cs@Okebid.com">cs@Okebid.com</a>
                          </b>
                          , dengan melampirkan bukti-bukti komplain untuk kami
                          tindaklanjuti dengan Kamu. Bukti-bukti akan kami
                          teruskan ke email Kamu.
                        </p>
                        <p>
                          Bila telah melewati 48 jam dan kami belum menerima
                          email komplain, maka transaksi ini kami anggap selesai
                          dan dana akan diteruskan ke rekening Kamu.
                        </p>
                      </div>
                    );
                  }
                })()}

                <div className="row">
                  <div className="col-md-7">
                    <h3>Status Transaksi</h3>
                    <p>Untuk instruksi lengkap silahkan cek email</p>
                    <hr />
                    <table className="table table-striped">
                      <thead style={{ background: "#dbdbdb" }}>
                        <tr>
                          <th>Step</th>
                          <th style={{ width: "30%" }}>Status</th>
                          <th>Keterangan</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>1</td>
                          <td>
                            <i
                              className="fa fa-check-square"
                              style={{
                                fontSize: "25px",
                                textAlign: "center",
                                color: "green",
                              }}
                            ></i>
                            <br />
                            {moment(order.orderDate).format(
                              "DD MMM YYYY. HH:mm:ss"
                            )}
                          </td>
                          <td>
                            <button
                              style={{
                                color: "white",
                                fontWeight: "bold",
                                background: "green",
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                marginBottom: "5px",
                                fontSize: "13px",
                              }}
                            >
                              Pembeli
                            </button>
                            <br />
                            Pembeli sudah melakukan checkout.
                            <br />
                            {(() => {
                              if (order.orderPaid === "tidak") {
                                return (
                                  <>
                                    Pembayaran belum lunas.
                                    <br />
                                    Batas waktu konfirmasi pembayaran:
                                    <br />
                                    {(() => {
                                      if (order.paymentConfirmedExpiredDate) {
                                        {
                                          moment(
                                            order.paymentConfirmedExpiredDate
                                          ).format("DD MMM YYYY. HH:mm:ss");
                                        }
                                      }
                                    })()}
                                  </>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td>2</td>
                          <td>
                            {(() => {
                              if (order.paymentConfirmed === "ya") {
                                return (
                                  <Fragment>
                                    <i
                                      className="fa fa-check-square"
                                      style={{
                                        fontSize: "25px",
                                        textAlign: "center",
                                        color: "green",
                                      }}
                                    ></i>
                                    <br />
                                    {moment(order.paymentConfirmedDate).format(
                                      "DD MMM YYYY. HH:mm:ss"
                                    )}
                                  </Fragment>
                                );
                              } else {
                                return <Fragment>-</Fragment>;
                              }
                            })()}
                          </td>
                          <td>
                            {(() => {
                              if (order.paymentConfirmed === "ya") {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "green",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Pembeli
                                  </button>
                                );
                              } else {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "grey",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Pembeli
                                  </button>
                                );
                              }
                            })()}
                            <br />
                            {(() => {
                              if (order.orderPaid === "tidak") {
                                return (
                                  <>
                                    <br />
                                    Pembeli sudah konfirmasi pembayaran. Sedang
                                    diverifikasi oleh admin Okebid.
                                  </>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td>3</td>
                          <td>
                            {(() => {
                              if (order.orderPaid === "ya") {
                                return (
                                  <Fragment>
                                    <i
                                      className="fa fa-check-square"
                                      style={{
                                        fontSize: "25px",
                                        textAlign: "center",
                                        color: "green",
                                      }}
                                    ></i>
                                    <br />
                                    {moment(order.paidDate).format(
                                      "DD MMM YYYY. HH:mm:ss"
                                    )}
                                  </Fragment>
                                );
                              } else {
                                return <Fragment>-</Fragment>;
                              }
                            })()}
                          </td>
                          <td>
                            {(() => {
                              if (order.orderPaid === "ya") {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "green",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Admin Okebid
                                  </button>
                                );
                              } else {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "grey",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Admin Okebid
                                  </button>
                                );
                              }
                            })()}
                            <br />
                            {/* Transaksi Lunas. Sistem sudah mengirim notifikasi
                            email ke Kamu dan pembeli. */}
                            Transaksi Lunas.
                            <br />
                            {(() => {
                              if (order.orderSentExpiredDate) {
                                return (
                                  <>
                                    Batas waktu pengiriman produk:
                                    <br />
                                    {moment(order.orderSentExpiredDate).format(
                                      "DD MMM YYYY. HH:mm:ss"
                                    )}
                                  </>
                                );
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td>4</td>
                          <td>
                            {(() => {
                              if (order.orderSent === "ya") {
                                return (
                                  <Fragment>
                                    <i
                                      className="fa fa-check-square"
                                      style={{
                                        fontSize: "25px",
                                        textAlign: "center",
                                        color: "green",
                                      }}
                                    ></i>
                                    <br />
                                    {moment(order.sentDate).format(
                                      "DD MMM YYYY. HH:mm:ss"
                                    )}
                                  </Fragment>
                                );
                              } else {
                                return <Fragment>-</Fragment>;
                              }
                            })()}
                          </td>

                          <td>
                            {(() => {
                              if (order.orderSent === "ya") {
                                return (
                                  <Fragment>
                                    <button
                                      style={{
                                        color: "white",
                                        background: "green",
                                        fontWeight: "bold",
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        marginBottom: "5px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      Penjual
                                    </button>
                                    <br />
                                    Produk sudah dikirimkan oleh Kamu dengan
                                    Nomor resi {order.sentNoResi}.
                                    <br />
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={`${process.env.REACT_APP_APIURL}uploads/resi/${order.resiName}`}
                                    >
                                      Lihat Foto Resi
                                    </a>
                                  </Fragment>
                                );
                              } else {
                                return (
                                  <Fragment>
                                    <button
                                      style={{
                                        color: "white",
                                        background: "grey",
                                        fontWeight: "bold",
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                        marginBottom: "5px",
                                        fontSize: "13px",
                                      }}
                                    >
                                      Penjual
                                    </button>
                                    <br />
                                    Produk sudah dikirimkan oleh Kamu.
                                  </Fragment>
                                );
                              }
                            })()}
                            <br />
                            <br />
                            {(() => {
                              if (order.orderSent === "ya") {
                                switch (order.chosenCarrier) {
                                  case "Jne Regular":
                                  case "Jne Yes":
                                    return (
                                      <>
                                        <button
                                          className="btn btn-primary"
                                          onClick={trackingAirwaybill}
                                        >
                                          Live Tracking Jne
                                        </button>
                                        &nbsp;&nbsp;
                                        <a
                                          href="https://www.jne.co.id/id/tracking/trace"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          atau Cek Manual
                                        </a>
                                      </>
                                    );
                                  case "JnT Regular":
                                    return (
                                      <>
                                        <button
                                          className="btn btn-primary"
                                          onClick={trackingAirwaybill}
                                        >
                                          Live Tracking J&amp;T
                                        </button>
                                        &nbsp;&nbsp;
                                        <a
                                          href="http://www.jet.co.id/track"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          atau Cek Manual
                                        </a>
                                      </>
                                    );
                                  case "Sicepat Regular":
                                  case "Sicepat Best":
                                    return (
                                      <>
                                        <button
                                          className="btn btn-primary"
                                          onClick={trackingAirwaybill}
                                        >
                                          Live Tracking Sicepat
                                        </button>
                                        &nbsp;&nbsp;
                                        <a
                                          href="http://sicepat.com/checkAwb"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          atau Cek Manual
                                        </a>
                                      </>
                                    );
                                  default:
                                    break;
                                }
                              }
                            })()}
                          </td>
                        </tr>
                        <tr>
                          <td>5</td>
                          <td>
                            {(() => {
                              if (
                                order.orderReceive === "ya" &&
                                order.receiveDate !== null
                              ) {
                                return (
                                  <Fragment>
                                    <i
                                      className="fa fa-check-square"
                                      style={{
                                        fontSize: "25px",
                                        textAlign: "center",
                                        color: "green",
                                      }}
                                    ></i>
                                    <br />
                                    {moment(order.receiveDate).format(
                                      "DD MMM YYYY. HH:mm:ss"
                                    )}
                                  </Fragment>
                                );
                              } else {
                                return <Fragment>-</Fragment>;
                              }
                            })()}
                          </td>
                          <td>
                            {(() => {
                              if (
                                order.orderReceive === "ya" &&
                                order.receiveDate !== null
                              ) {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "green",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Admin Okebid
                                  </button>
                                );
                              } else {
                                return (
                                  <button
                                    style={{
                                      color: "white",
                                      background: "grey",
                                      fontWeight: "bold",
                                      paddingLeft: "10px",
                                      paddingRight: "10px",
                                      marginBottom: "5px",
                                      fontSize: "13px",
                                    }}
                                  >
                                    Admin Okebid
                                  </button>
                                );
                              }
                            })()}
                            <br />
                            Produk sudah sampai di alamat pembeli.
                            {(() => {
                              if (order.orderSentExpiredDate) {
                                return (
                                  <>
                                    <br />
                                    Batas waktu penerimaan produk:
                                    <br />
                                    {moment(
                                      order.orderAcceptComplainExpiredDate
                                    ).format("DD MMM YYYY. HH:mm:ss")}
                                  </>
                                );
                              }
                            })()}
                          </td>
                        </tr>

                        {(() => {
                          if (order.complainDate) {
                            return (
                              <tr>
                                <td>6</td>
                                <td>
                                  <i
                                    className="fa fa-check-square"
                                    style={{
                                      fontSize: "25px",
                                      textAlign: "center",
                                      color: "green",
                                    }}
                                  ></i>
                                  <br />
                                  {moment(order.complainDate).format(
                                    "DD MMM YYYY. HH:mm:ss"
                                  )}
                                </td>
                                <td>
                                  {(() => {
                                    if (order.complainDate) {
                                      return (
                                        <button
                                          style={{
                                            color: "white",
                                            background: "green",
                                            fontWeight: "bold",
                                            paddingLeft: "10px",
                                            paddingRight: "10px",
                                            marginBottom: "5px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          Pembeli
                                        </button>
                                      );
                                    } else {
                                      return (
                                        <button
                                          style={{
                                            color: "white",
                                            background: "grey",
                                            fontWeight: "bold",
                                            paddingLeft: "10px",
                                            paddingRight: "10px",
                                            marginBottom: "5px",
                                            fontSize: "13px",
                                          }}
                                        >
                                          Pembeli
                                        </button>
                                      );
                                    }
                                  })()}
                                  <br />
                                  {/* Pembeli komplain dan dimoderasi oleh Admin
                                  Okebid. Sistem mengirim email instruksi ke
                                  pembeli dan Kamu utk penyelesaian komplain
                                  ini. */}
                                  Pembeli komplain dan dimoderasi oleh Admin
                                  Okebid.
                                  {(() => {
                                    if (order.complainEmailExpiredDate) {
                                      return (
                                        <>
                                          <br />
                                          Batas waktu pembeli email komplain:
                                          <br />
                                          {moment(
                                            order.complainEmailExpiredDate
                                          ).format("DD MMM YYYY. HH:mm:ss")}
                                        </>
                                      );
                                    }
                                  })()}
                                </td>
                              </tr>
                            );
                          }
                        })()}

                        {(() => {
                          //IF THERE WAS COMPLAIN
                          if (order.complainDate) {
                            return (
                              <Fragment>
                                {(() => {
                                  if (order.complainDecisionDate) {
                                    return (
                                      <tr>
                                        <td>7</td>
                                        <td>
                                          <i
                                            className="fa fa-check-square"
                                            style={{
                                              fontSize: "25px",
                                              textAlign: "center",
                                              color: "green",
                                            }}
                                          ></i>
                                          <br />
                                          {moment(
                                            order.complainDecisionDate
                                          ).format("DD MMM YYYY. HH:mm:ss")}
                                        </td>
                                        <td>
                                          <button
                                            style={{
                                              color: "white",
                                              background: "green",
                                              fontWeight: "bold",
                                              paddingLeft: "10px",
                                              paddingRight: "10px",
                                              marginBottom: "5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            Admin Okebid
                                          </button>
                                          <br />
                                          {(() => {
                                            if (
                                              order.complainAccepted === "ya"
                                            ) {
                                              return (
                                                <>
                                                  Komplain Pembeli disetujui
                                                  oleh admin Okebid. Pembeli
                                                  harus mengirimkan produk retur
                                                  ke Kamu dalam waktu maksimal
                                                  48 jam.
                                                  {(() => {
                                                    if (
                                                      order.orderRefundSentExpiredDate
                                                    ) {
                                                      return (
                                                        <>
                                                          <br />
                                                          Batas waktu pembeli
                                                          kirim produk retur:
                                                          <br />
                                                          {moment(
                                                            order.orderRefundSentExpiredDate
                                                          ).format(
                                                            "DD MMM YYYY. HH:mm:ss"
                                                          )}
                                                        </>
                                                      );
                                                    }
                                                  })()}
                                                </>
                                              );
                                            } else if (
                                              order.complainAccepted === "tidak"
                                            ) {
                                              return (
                                                <Fragment>
                                                  Komplain ditolak oleh admin
                                                  Okebid. Dana akan diteruskan
                                                  ke Kamu.
                                                </Fragment>
                                              );
                                            }
                                          })()}
                                        </td>
                                      </tr>
                                    );
                                  }
                                })()}

                                {(() => {
                                  if (order.complainAccepted === "ya") {
                                    return (
                                      <Fragment>
                                        <tr>
                                          <td>8</td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundSent ===
                                                  "ya" &&
                                                order.refundSentDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <i
                                                      className="fa fa-check-square"
                                                      style={{
                                                        fontSize: "25px",
                                                        textAlign: "center",
                                                        color: "green",
                                                      }}
                                                    ></i>
                                                    <br />
                                                    {moment(
                                                      order.refundSentDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </Fragment>
                                                );
                                              } else {
                                                return <Fragment>-</Fragment>;
                                              }
                                            })()}
                                          </td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundSent ===
                                                  "ya" &&
                                                order.refundSentDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "green",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Pembeli
                                                    </button>
                                                    <br />
                                                    Produk retur sudah
                                                    dikirimkan oleh pembeli
                                                    dengan Nomor resi{" "}
                                                    {order.refundSentNoResi}.
                                                    <br />
                                                    <a
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      href={`${process.env.REACT_APP_APIURL}uploads/resi/${order.refundResiName}`}
                                                    >
                                                      Lihat Foto Resi
                                                    </a>
                                                  </Fragment>
                                                );
                                              } else {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "grey",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Pembeli
                                                    </button>
                                                    <br />
                                                    Produk retur sudah
                                                    dikirimkan oleh pembeli.
                                                  </Fragment>
                                                );
                                              }
                                            })()}
                                            <br />
                                            {(() => {
                                              if (
                                                order.orderRefundSent ===
                                                  "ya" &&
                                                order.refundSentDate
                                              ) {
                                                switch (order.chosenCarrier) {
                                                  case "Jne Regular":
                                                  case "Jne Yes":
                                                    return (
                                                      <a
                                                        href="https://www.jne.co.id/id/tracking/trace"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        Cek Status Pengiriman
                                                        Jne
                                                      </a>
                                                    );
                                                  case "JnT Regular":
                                                    return (
                                                      <a
                                                        href="http://www.jet.co.id/track"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        Cek Status Pengiriman
                                                        J&amp;T
                                                      </a>
                                                    );
                                                  case "Sicepat Regular":
                                                  case "Sicepat Best":
                                                    return (
                                                      <a
                                                        href="http://sicepat.com/checkAwb"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                      >
                                                        Cek Status Pengiriman
                                                        Sicepat
                                                      </a>
                                                    );
                                                  default:
                                                    break;
                                                }
                                              }
                                            })()}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>9</td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundReceive ===
                                                  "ya" &&
                                                order.refundReceiveDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <i
                                                      className="fa fa-check-square"
                                                      style={{
                                                        fontSize: "25px",
                                                        textAlign: "center",
                                                        color: "green",
                                                      }}
                                                    ></i>
                                                    <br />
                                                    {moment(
                                                      order.refundReceiveDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </Fragment>
                                                );
                                              } else {
                                                return <Fragment>-</Fragment>;
                                              }
                                            })()}
                                          </td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundSent ===
                                                  "ya" &&
                                                order.refundSentDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "green",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Admin Okebid
                                                    </button>
                                                    <br />
                                                    Produk retur sudah sampai di
                                                    alamat Kamu.
                                                  </Fragment>
                                                );
                                              } else {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "grey",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Admin Okebid
                                                    </button>
                                                    <br />
                                                    Produk retur sudah sampai di
                                                    alamat Kamu.
                                                  </Fragment>
                                                );
                                              }
                                            })()}
                                            {(() => {
                                              if (
                                                order.orderRefundAcceptedExpiredDate
                                              ) {
                                                return (
                                                  <>
                                                    <br />
                                                    Batas waktu penerimaan
                                                    produk retur:
                                                    <br />
                                                    {moment(
                                                      order.orderAcceptComplainExpiredDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </>
                                                );
                                              }
                                            })()}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>10</td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundAccepted ===
                                                  "ya" &&
                                                order.refundAcceptedDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <i
                                                      className="fa fa-check-square"
                                                      style={{
                                                        fontSize: "25px",
                                                        textAlign: "center",
                                                        color: "green",
                                                      }}
                                                    ></i>
                                                    <br />
                                                    {moment(
                                                      order.refundAcceptedDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </Fragment>
                                                );
                                              } else {
                                                return <Fragment>-</Fragment>;
                                              }
                                            })()}
                                          </td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.orderRefundAccepted ===
                                                  "ya" &&
                                                order.refundAcceptedDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "green",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Penjual
                                                    </button>
                                                    <br />
                                                    Produk retur sudah diterima
                                                    oleh Kamu. Dana akan
                                                    dikembalikan ke pembeli.
                                                  </Fragment>
                                                );
                                              } else {
                                                return (
                                                  <Fragment>
                                                    <button
                                                      style={{
                                                        color: "white",
                                                        background: "grey",
                                                        fontWeight: "bold",
                                                        paddingLeft: "10px",
                                                        paddingRight: "10px",
                                                        marginBottom: "5px",
                                                        fontSize: "13px",
                                                      }}
                                                    >
                                                      Penjual
                                                    </button>
                                                    <br />
                                                    Produk retur sudah diterima
                                                    oleh Kamu. Dana akan
                                                    dikembalikan ke pembeli.
                                                  </Fragment>
                                                );
                                              }
                                            })()}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>11</td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.refundSettle === "ya" &&
                                                order.refundSettleDate
                                              ) {
                                                return (
                                                  <Fragment>
                                                    <i
                                                      className="fa fa-check-square"
                                                      style={{
                                                        fontSize: "25px",
                                                        textAlign: "center",
                                                        color: "green",
                                                      }}
                                                    ></i>
                                                    <br />
                                                    {moment(
                                                      order.refundSettleDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </Fragment>
                                                );
                                              } else {
                                                return <Fragment>-</Fragment>;
                                              }
                                            })()}
                                          </td>
                                          <td>
                                            {(() => {
                                              if (
                                                order.refundSettle === "ya" &&
                                                order.refundSettleDate
                                              ) {
                                                return (
                                                  <button
                                                    style={{
                                                      color: "white",
                                                      background: "green",
                                                      fontWeight: "bold",
                                                      paddingLeft: "10px",
                                                      paddingRight: "10px",
                                                      marginBottom: "5px",
                                                      fontSize: "13px",
                                                    }}
                                                  >
                                                    Admin Okebid
                                                  </button>
                                                );
                                              } else {
                                                return (
                                                  <button
                                                    style={{
                                                      color: "white",
                                                      background: "grey",
                                                      fontWeight: "bold",
                                                      paddingLeft: "10px",
                                                      paddingRight: "10px",
                                                      marginBottom: "5px",
                                                      fontSize: "13px",
                                                    }}
                                                  >
                                                    Admin Okebid
                                                  </button>
                                                );
                                              }
                                            })()}
                                            <br />
                                            Transaksi selesai. Dana refund sudah
                                            dikembalikan ke rekening pembeli.
                                          </td>
                                        </tr>
                                      </Fragment>
                                    );
                                  } else if (
                                    order.complainDate &&
                                    order.complainDecisionDate &&
                                    order.complainAccepted === "tidak"
                                  ) {
                                    return (
                                      <Fragment>
                                        <tr>
                                          <td>8</td>
                                          <td>
                                            {(() => {
                                              if (order.orderSettle === "ya") {
                                                return (
                                                  <Fragment>
                                                    <i
                                                      className="fa fa-check-square"
                                                      style={{
                                                        fontSize: "25px",
                                                        textAlign: "center",
                                                        color: "green",
                                                      }}
                                                    ></i>
                                                    <br />
                                                    {moment(
                                                      order.settleDate
                                                    ).format(
                                                      "DD MMM YYYY. HH:mm:ss"
                                                    )}
                                                  </Fragment>
                                                );
                                              } else {
                                                return <Fragment>-</Fragment>;
                                              }
                                            })()}
                                          </td>
                                          <td>
                                            {(() => {
                                              if (order.orderSettle === "ya") {
                                                return (
                                                  <button
                                                    style={{
                                                      color: "white",
                                                      background: "green",
                                                      fontWeight: "bold",
                                                      paddingLeft: "10px",
                                                      paddingRight: "10px",
                                                      marginBottom: "5px",
                                                      fontSize: "13px",
                                                    }}
                                                  >
                                                    Admin Okebid
                                                  </button>
                                                );
                                              } else {
                                                return (
                                                  <button
                                                    style={{
                                                      color: "white",
                                                      background: "grey",
                                                      fontWeight: "bold",
                                                      paddingLeft: "10px",
                                                      paddingRight: "10px",
                                                      marginBottom: "5px",
                                                      fontSize: "13px",
                                                    }}
                                                  >
                                                    Admin Okebid
                                                  </button>
                                                );
                                              }
                                            })()}
                                            <br />
                                            Transaksi selesai. Dana sudah
                                            diteruskan ke rekening Kamu.
                                            <br />
                                            {(() => {
                                              if (order.orderSettle === "ya") {
                                                return (
                                                  <Fragment>
                                                    Jumlah ditransfer:{" "}
                                                    {formatter.format(
                                                      order.settleAmount
                                                    )}{" "}
                                                    (dipotong 3% biaya transaksi
                                                    dari harga produk{" "}
                                                    {formatter.format(
                                                      order.productPrice
                                                    )}
                                                    )
                                                    <br />
                                                    {order.settleBankAcc}
                                                  </Fragment>
                                                );
                                              }
                                            })()}
                                          </td>
                                        </tr>
                                      </Fragment>
                                    );
                                  }
                                })()}
                              </Fragment>
                            );
                            //IF THERE WAS NO COMPLAIN
                          } else {
                            return (
                              <Fragment>
                                <tr>
                                  <td>6</td>
                                  <td>
                                    {(() => {
                                      if (order.orderAccepted === "ya") {
                                        return (
                                          <Fragment>
                                            <i
                                              className="fa fa-check-square"
                                              style={{
                                                fontSize: "25px",
                                                textAlign: "center",
                                                color: "green",
                                              }}
                                            ></i>
                                            <br />
                                            {moment(order.acceptedDate).format(
                                              "DD MMM YYYY. HH:mm:ss"
                                            )}
                                          </Fragment>
                                        );
                                      } else {
                                        return <Fragment>-</Fragment>;
                                      }
                                    })()}
                                  </td>
                                  <td>
                                    {(() => {
                                      if (order.orderAccepted === "ya") {
                                        return (
                                          <button
                                            style={{
                                              color: "white",
                                              background: "green",
                                              fontWeight: "bold",
                                              paddingLeft: "10px",
                                              paddingRight: "10px",
                                              marginBottom: "5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            Pembeli
                                          </button>
                                        );
                                      } else {
                                        return (
                                          <button
                                            style={{
                                              color: "white",
                                              background: "grey",
                                              fontWeight: "bold",
                                              paddingLeft: "10px",
                                              paddingRight: "10px",
                                              marginBottom: "5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            Pembeli
                                          </button>
                                        );
                                      }
                                    })()}
                                    <br />
                                    Produk sudah diterima dan disetujui oleh
                                    pembeli. Dana akan diteruskan ke rekening
                                    Kamu.
                                  </td>
                                </tr>
                                <tr>
                                  <td>7</td>
                                  <td>
                                    {(() => {
                                      if (order.orderSettle === "ya") {
                                        return (
                                          <Fragment>
                                            <i
                                              className="fa fa-check-square"
                                              style={{
                                                fontSize: "25px",
                                                textAlign: "center",
                                                color: "green",
                                              }}
                                            ></i>
                                            <br />
                                            {moment(order.settleDate).format(
                                              "DD MMM YYYY. HH:mm:ss"
                                            )}
                                          </Fragment>
                                        );
                                      } else {
                                        return <Fragment>-</Fragment>;
                                      }
                                    })()}
                                  </td>
                                  <td>
                                    {(() => {
                                      if (order.orderSettle === "ya") {
                                        return (
                                          <button
                                            style={{
                                              color: "white",
                                              background: "green",
                                              fontWeight: "bold",
                                              paddingLeft: "10px",
                                              paddingRight: "10px",
                                              marginBottom: "5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            Admin Okebid
                                          </button>
                                        );
                                      } else {
                                        return (
                                          <button
                                            style={{
                                              color: "white",
                                              background: "grey",
                                              fontWeight: "bold",
                                              paddingLeft: "10px",
                                              paddingRight: "10px",
                                              marginBottom: "5px",
                                              fontSize: "13px",
                                            }}
                                          >
                                            Admin Okebid
                                          </button>
                                        );
                                      }
                                    })()}
                                    <br />
                                    Transaksi selesai. Dana sudah diteruskan ke
                                    rekening Kamu.
                                    <br />
                                    {(() => {
                                      if (order.orderSettle === "ya") {
                                        return (
                                          <Fragment>
                                            Jumlah ditransfer:{" "}
                                            {formatter.format(
                                              order.settleAmount
                                            )}{" "}
                                            (dipotong 3% biaya transaksi dari
                                            harga produk{" "}
                                            {formatter.format(
                                              order.productPrice
                                            )}
                                            )
                                            <br />
                                            {order.settleBankAcc}
                                          </Fragment>
                                        );
                                      }
                                    })()}
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          }
                        })()}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-5">
                    <h3>Alamat Pengiriman</h3>
                    <p>Alamat pengiriman pembeli produk</p>
                    <hr />
                    <table className="table table-striped">
                      <tbody>
                        <tr>
                          <td>Nama Penerima:</td>
                          <td>{order.recipientName}</td>
                        </tr>
                        <tr>
                          <td>Handphone:</td>
                          <td>{order.recipientHandphone}</td>
                        </tr>
                        <tr>
                          <td>Alamat Kirim:</td>
                          <td>
                            {order.recipientAddress}
                            <br />
                            {buyerDistrict}. {buyerSubdistrict}. {buyerProvince}
                            <br />
                            {order.recipientPostcode}
                          </td>
                        </tr>
                        <tr>
                          <td>Cara Pembayaran:</td>
                          <td style={{ textTransform: "capitalize" }}>
                            {order.paymentType}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  {(() => {
                    if (order.orderSource === "online auction") {
                      return (
                        <div className="col-md-12">
                          <h3>Detail Order</h3>
                          <hr />
                          <table className="table table-striped noMoreTable">
                            <thead>
                              <tr>
                                <th style={{ width: "50%" }}>Produk</th>
                                <th>Harga Produk</th>
                                <th>Ongkir</th>
                                <th>Kode Unik</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td data-title="Produk">
                                  <div className="row">
                                    <div className="col-xs-4 col-sm-3">
                                      {(() => {
                                        if (imagesName) {
                                          return (
                                            <Fragment>
                                              <img
                                                alt={name}
                                                src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${imagesName[0]}`}
                                                style={{ width: "90px" }}
                                              />
                                            </Fragment>
                                          );
                                        }
                                      })()}
                                    </div>
                                    <div className="col-xs-8 col-sm-9">
                                      <h4
                                        style={{ textTransform: "capitalize" }}
                                      >
                                        {name}
                                      </h4>
                                      Berat: {weight}gr Kondisi: {condition}
                                      <br />
                                      {(() => {
                                        if (sellerDistrict && sellerProvince) {
                                          return (
                                            <Fragment>
                                              Dikirim dari: {sellerDistrict},{" "}
                                              {sellerProvince}
                                            </Fragment>
                                          );
                                        }
                                      })()}
                                    </div>
                                  </div>
                                  <div className="row">
                                    <div className="col-sm-12">
                                      <br />
                                      <p style={{ paddingLeft: "15px" }}>
                                        {" "}
                                        <strong>
                                          Deskripsi produk (snapshot saat
                                          transaksi ini):
                                        </strong>
                                      </p>
                                      <p
                                        style={{
                                          whiteSpace: "pre-line",
                                          paddingLeft: "15px",
                                        }}
                                      >
                                        {productDesc}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td data-title="Harga Produk">
                                  {formatter.format(order.productPrice)}
                                  <br />
                                  <label>Qty: 1</label>
                                </td>
                                <td data-title="Ongkos Kirim">
                                  {order.chosenCarrier}
                                  <br />
                                  {formatter.format(order.shippingFee)}
                                </td>
                                <td data-title="Kode Unik Pembayaran">
                                  {formatter.format(order.kodeUnik)}
                                </td>
                                <td data-title="Total">
                                  {formatter.format(order.grandTotal)}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    } else if (order.orderSource === "marketplace") {
                      return (
                        <div className="col-md-12">
                          <h3>Detail Order</h3>
                          <hr />
                          <p>
                            Penjual: {sellerShopName}
                            <br />
                            {sellerDistrict}. {sellerProvince}
                          </p>
                          <table className="table table-striped noMoreTable">
                            <thead>
                              <tr>
                                <th style={{ width: "50%" }}>Produk</th>
                                <th>Harga Produk</th>
                                <th>Qty</th>
                                <th>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.productMarketplaceDetails.map(
                                (product) => (
                                  <MarketplaceProductDetail
                                    key={product.product_id}
                                    productData={product}
                                  />
                                )
                              )}
                              <tr>
                                <td colSpan="4" style={{ textAlign: "right" }}>
                                  <p
                                    style={{
                                      fontWeight: "bold",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    ONGKOS KIRIM:{" "}
                                    {formatter.format(order.shippingFee)}
                                    <br />
                                    GRAND TOTAL:{" "}
                                    {formatter.format(order.grandTotal)}
                                  </p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={modalIsOpen}
          onClose={closeModal}
          styles={{
            modal: {
              width: "800px",
            },
          }}
        >
          {(() => {
            if (airwaybillDetail.result.manifest) {
              return (
                <>
                  <h2
                    style={{
                      fontSize: "20px",
                      fontWeight: "normal",
                      textAlign: "center",
                    }}
                  >
                    Live Tracking Paket {order.chosenCarrier}
                    <br />
                    No. Resi: {airwaybillDetail.result.summary.waybill_number}
                    <br />
                    Berat: {airwaybillDetail.result.details.weight}
                  </h2>

                  {(() => {
                    if (
                      airwaybillDetail.result.delivery_status.status ===
                      "DELIVERED"
                    ) {
                      return (
                        <h3
                          style={{
                            textAlign: "center",
                            background: "green",
                            color: "white",
                            padding: "5px 10px",
                          }}
                        >
                          STATUS:{" "}
                          {airwaybillDetail.result.delivery_status.status}{" "}
                        </h3>
                      );
                    } else {
                      return (
                        <h3
                          style={{
                            textAlign: "center",
                            background: "orange",
                            color: "white",
                            padding: "5px 10px",
                          }}
                        >
                          STATUS:{" "}
                          {airwaybillDetail.result.delivery_status.status}{" "}
                        </h3>
                      );
                    }
                  })()}

                  {(() => {
                    if (
                      airwaybillDetail.result.delivery_status.status ===
                      "DELIVERED"
                    ) {
                      return (
                        <>
                          <h4>Produk sudah sampai di tujuan:</h4>
                          <table className="table table-striped">
                            <thead>
                              <tr>
                                <th>Tanggal Terima</th>
                                <th>Jam Terima</th>
                                <th>Diterima Oleh</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  {" "}
                                  {moment(
                                    airwaybillDetail.result.delivery_status
                                      .pod_date
                                  ).format("DD MMM YYYY")}
                                </td>
                                <td>
                                  {" "}
                                  {
                                    airwaybillDetail.result.delivery_status
                                      .pod_time
                                  }
                                </td>
                                <td>
                                  {" "}
                                  {
                                    airwaybillDetail.result.delivery_status
                                      .pod_receiver
                                  }
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      );
                    }
                  })()}

                  <h4>Data Pengiriman:</h4>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Data Pengirim</th>
                        <th>Data Penerima</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <p>
                            Asal:
                            <br />
                            {airwaybillDetail.result.details.origin}
                          </p>
                          <p>
                            Nama Pengirim:
                            <br />
                            {airwaybillDetail.result.details.shippper_name}
                          </p>
                          <p>
                            Alamat:
                            <br />
                            {airwaybillDetail.result.details.shipper_address1}
                            <br />
                            {airwaybillDetail.result.details.shipper_address2}
                            <br />
                            {airwaybillDetail.result.details.shipper_address3}
                          </p>
                          <p>
                            Kota:
                            <br />
                            {airwaybillDetail.result.details.shipper_city}
                          </p>
                        </td>
                        <td>
                          <p>
                            Tujuan:
                            <br />
                            {airwaybillDetail.result.details.destination}
                          </p>
                          <p>
                            Nama Penerima:
                            <br />
                            {airwaybillDetail.result.details.receiver_name}
                          </p>
                          <p>
                            Alamat:
                            <br />
                            {airwaybillDetail.result.details.receiver_address1}
                            <br />
                            {airwaybillDetail.result.details.receiver_address2}
                            <br />
                            {airwaybillDetail.result.details.receiver_address3}
                          </p>
                          <p>
                            Kota:
                            <br />
                            {airwaybillDetail.result.details.receiver_city}
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h4>Tracking History:</h4>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Jam</th>
                        <th>Kode</th>
                        <th>Kota</th>
                        <th>Keterangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {airwaybillDetail.result.manifest.map((history, i) => {
                        return (
                          <tr key={i}>
                            <td>
                              {" "}
                              {moment(history.manifest_date).format(
                                "DD MMM YYYY"
                              )}
                            </td>
                            <td>{history.manifest_time}</td>
                            <td>{history.manifest_code}</td>
                            <td>{history.city_name}</td>
                            <td>{history.manifest_description}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              );
            }
          })()}
          <button onClick={closeModal} style={{ float: "right" }}>
            Tutup
          </button>
        </Modal>
      </section>
    );
  } else {
    return null;
  }
};

export default EditSellerOrder;
