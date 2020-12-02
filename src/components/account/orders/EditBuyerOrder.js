import React, {
  useState,
  useContext,
  useEffect,
  Fragment,
  createRef,
} from "react";
import AlertContext from "../../../context/alert/alertContext";
import axios from "axios";
import AccountMenu from "../AccountMenu";
import { Link } from "react-router-dom";
import moment from "moment";
// import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AuthContext from "../../../context/auth/authContext";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import imageCompression from "browser-image-compression";
import Modal from "react-responsive-modal";
import Loader from "react-loader-spinner";
import MarketplaceProductDetail from "./MarketplaceProductDetail";

const EditBuyerOrder = ({ match }) => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;

  const scrollDiv = createRef();
  const scrollSmoothHandler = () => {
    scrollDiv.current.scrollIntoView({ behavior: "smooth" });
  };
  const [loadSpinner, setLoadSpinner] = useState(false);
  //button konfirmasi pegiriman
  const [buttonConfirmSent, setButtonConfirmSent] = useState("active");
  //set order data
  const [order, setOrder] = useState({});

  //set tracking airwaybillDetail
  const [airwaybillDetail, setAirwaybillDetail] = useState({
    query: "",
    status: "",
    result: "",
  });

  //set auction data
  const [auction, setAuctionData] = useState({
    name: "",
    imagesName: "",
    weight: "",
    condition: "",
    sellerUsername: "",
    productDesc: "",
  });
  const {
    name,
    imagesName,
    weight,
    condition,
    sellerUsername,
    productDesc,
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
  const [paymentConfirm, setPaymentConfirm] = useState({
    paymentDate: new Date(),
    bankName: "",
    accName: "",
    accNumber: "",
    paymentAmount: "",
  });
  const {
    paymentDate,
    bankName,
    accName,
    accNumber,
    paymentAmount,
  } = paymentConfirm;

  //set send retur resi data
  const [resi, setResi] = useState("");

  //set existing review data
  const [currentReview, setCurrentReview] = useState({
    currentRating: "",
    currentReviewText: "",
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

  //modal for live tracing airwaybill
  const [modalIsOpen, setModal] = useState(false);
  const openModal = () => {
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
  };

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

      setPaymentConfirm({
        ...paymentConfirm,
        paymentAmount: order.data.data.grandTotal,
      });

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

      if (order.data.data.orderReview === "ya") {
        //load review
        const review = await axios.get(
          `${process.env.REACT_APP_APIURL}api/v1/orders/review/get/${order.data.data.sellerId}/${order.data.data._id}`
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

  const dicussionSubmitted = () => {
    loadData();
  };

  const onChangePaymentConfirm = (e) => {
    setPaymentConfirm({ ...paymentConfirm, [e.target.name]: e.target.value });
  };

  //   const onChangeConfirmDate = date => {
  //     setPaymentConfirm({
  //       ...paymentConfirm,
  //       paymentDate: date
  //     });
  //   };

  const onSubmitPaymentConfirm = async (e) => {
    e.preventDefault();

    if (
      paymentDate === "" ||
      bankName === "" ||
      accName === "" ||
      accNumber === "" ||
      paymentAmount === ""
    ) {
      setAlert("Mohon mengisi semua field", "danger");
    } else {
      confirmAlert({
        title: "Konfirmasi Pembayaran?",
        message: `Sudah yakin mau kirim konfirmasi pembayaran ?`,
        buttons: [
          {
            label: "Ya",
            onClick: () => {
              const paymentConfirmedFields = `
              Jumlah Transfer: ${formatter.format(
                paymentAmount
              )}. Nama Bank: ${bankName}. Nomor Rekening: ${accNumber}. Nama Rekening: ${accName}`;
              submitPaymentConfirm(paymentConfirmedFields);
            },
          },
          {
            label: "Tidak",
            onClick: () => console.log("Cancel Confirm Payment..."),
          },
        ],
      });

      async function submitPaymentConfirm(paymentConfirmedFields) {
        let formData = new FormData();
        formData.append("orderStatus", "sudah konfirmasi");
        formData.append("paymentConfirmed", "ya");
        formData.append("paymentConfirmedFields", paymentConfirmedFields);

        try {
          const res = await axios.put(
            `${process.env.REACT_APP_APIURL}api/v1/orders/paymentconfirm/${match.params.orderId}`,
            formData
          );
          setOrder(res.data.data);

          setAlert("Konfirmasi Pembayaran berhasil dibuat", "success");
        } catch (err) {
          setAlert(err.message, "danger");
        }
      }
    }
  };

  const onSubmitRejectComplain = (e) => {
    e.preventDefault();

    confirmAlert({
      title: "Yakin Komplain?",
      message: `Yakin mau komplain order ini ke Admin? Sudah diskusi dengan penjual?`,
      buttons: [
        {
          label: "Yakin",
          onClick: () => {
            submitComplain();
          },
        },
        {
          label: "Batalkan",
          onClick: () => console.log("Cancel Complain..."),
        },
      ],
    });

    async function submitComplain() {
      let formData = new FormData();
      formData.append("orderStatus", "komplain");
      formData.append("orderReceive", "ya");

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/complain/${match.params.orderId}`,
          formData
        );
        setOrder(res.data.data);

        // setAlert(
        //   "Komplain berhasi dibuat untuk order ini. Sistem sudah mengirim email instruksi kepada Kamu dan penjual.",
        //   "success"
        // );

        setAlert("Komplain berhasi dibuat untuk order ini.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
  };

  const onSubmitAcceptedConfirm = async (e) => {
    e.preventDefault();

    confirmAlert({
      title: "Sudah Yakin?",
      message: `Sudah yakin produk diterima dan sesuai deskripsi?`,
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
      formData.append("orderStatus", "sudah diterima");
      formData.append("orderReceive", "ya");
      formData.append("orderAccepted", "ya");

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/acceptedconfirm/${match.params.orderId}`,
          formData
        );
        setOrder(res.data.data);

        // setAlert(
        //   "Konfirmasi produk diterima berhasil disimpan. Sistem telah mengirim email notifikasi ke penjual",
        //   "success"
        // );

        setAlert("Konfirmasi produk diterima berhasil disimpan.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
  };

  const onChangeResi = (e) => {
    setResi(e.target.value);
  };

  const onSubmitSentConfirm = async (e) => {
    e.preventDefault();

    setLoadSpinner(true);
    setButtonConfirmSent("nonactive");

    if (resi === "") {
      setAlert("Mohon mengisi semua field", "danger");
    } else if (image1 === "") {
      setAlert("Foto resi harus diupload", "danger");
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

        if (
          tracking.data.data.rajaongkir.status.code === 200 &&
          tracking.data.data.rajaongkir.status.description === "OK"
        ) {
          //valid
          confirmAlert({
            title: "Konfirmasi Pengiriman?",
            message: `Sudah yakin mau konfirmasi Produk Retur Sudah Dikirim?`,
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
        formData.append("orderStatus", "sudah kirim refund");
        formData.append("orderRefundSent", "ya");
        formData.append("refundSentNoResi", resi);

        try {
          const res = await axios.put(
            `${process.env.REACT_APP_APIURL}api/v1/orders/sentrefundconfirm/${match.params.orderId}`,
            formData
          );
          setOrder(res.data.data);

          //clear images
          setImages({
            image1: "",
          });

          // setAlert(
          //   "Konfirmasi Pengiriman retur berhasil dibuat. Sistem telah mengirim email notifikasi ke penjual",
          //   "success"
          // );

          setAlert("Konfirmasi Pengiriman retur berhasil dibuat.", "success");
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
      formData.append("reviewFor", "seller");
      formData.append("rating", rating);
      formData.append("reviewText", reviewText);
      formData.append("orderId", order._id);
      formData.append("auctionId", order.auctionId);

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/review/${order.sellerId}`,
          formData
        );

        setOrder(res.data.data);

        if (res.data.data.orderReview === "ya") {
          //load review
          const review = await axios.get(
            `${process.env.REACT_APP_APIURL}api/v1/orders/review/get/${res.data.data.sellerId}/${res.data.data._id}`
          );

          setCurrentReview({
            ...currentReview,
            currentRating: review.data.data.rating,
            currentReviewText: review.data.data.reviewText,
          });
        }

        // setAlert(
        //   "Review berhasil di simpan dan notifikasi email sudah dikirim ke penjual",
        //   "success"
        // );

        setAlert("Review berhasil di simpan.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
  };

  const onSubmitReviewProduct = async (e) => {
    e.preventDefault();

    confirmAlert({
      title: "Sudah Yakin?",
      message: `Sudah yakin mau kirim ulasan?`,
      buttons: [
        {
          label: "Ya",
          onClick: () => {
            submitReviewProduct();
          },
        },
        {
          label: "Tidak",
          onClick: () => console.log("Cancel review..."),
        },
      ],
    });

    async function submitReviewProduct() {
      let formData = new FormData();
      formData.append("reviewUserId", currentUser._id);
      formData.append("reviewUsername", currentUser.username);
      formData.append("reviewFor", "seller");
      formData.append("rating", rating.charAt(0));
      formData.append("reviewText", reviewText);
      formData.append("orderId", order._id);
      formData.append("auctionId", order.auctionId);

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/orders/reviewproduct/${order.sellerId}`,
          formData
        );

        // setOrder(res.data.data);

        // if (res.data.data.orderReview === "ya") {
        //   //load review
        //   const review = await axios.get(
        //     `${process.env.REACT_APP_APIURL}api/v1/orders/review/get/${res.data.data.sellerId}/${res.data.data._id}`
        //   );

        //   setCurrentReview({
        //     ...currentReview,
        //     currentRating: review.data.data.rating,
        //     currentReviewText: review.data.data.reviewText,
        //   });
        // }

        // setAlert(
        //   "Review berhasil di simpan dan notifikasi email sudah dikirim ke penjual",
        //   "success"
        // );

        setAlert("Review berhasil di simpan.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
      }
    }
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
    if (order.buyerId !== currentUser._id) {
      return null;
    }

    let payConfirmFields;

    if (order.paymentConfirmed === "ya") {
      if (order.paymentConfirmedFields) {
        payConfirmFields = order.paymentConfirmedFields.replace(
          "&lt;br />",
          ""
        );
        payConfirmFields = payConfirmFields.replace("&lt;br />", "");
      }
    } else {
      payConfirmFields = "";
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
                Pembelian Order Id: {shortenOrderId}
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
                        Transaksi ini sudah dibatalkan oleh sistem, karena Kamu
                        Hit &amp; Run (belum melakukan konfirmasi pembayaran
                        setelah batas waktu berakhir).
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
                          penjual belum melakukan konfirmasi pengiriman produk
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
                                Silahkan tunggu maksimal 24 jam. Dana refund
                                akan dikembalikan ke rekening Kamu.
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
                                Dana refund sudah dikembalikan ke rekening Kamu.
                                Jumlah ditransfer:{" "}
                                {formatter.format(order.refundSettleAmount)}{" "}
                                (dipotong 3% biaya transaksi dari harga produk{" "}
                                {formatter.format(order.productPrice)}
                                )
                                <br />
                                {order.refundSettleBankAcc}
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
                          karena Kamu belum melakukan konfirmasi pengiriman
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
                                Admin akan mengirimkan dana ke penjual.
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
                                Dana sudah dikirim ke rekening penjual.
                              </div>
                            );
                          }
                        })()}
                      </>
                    );
                  }

                  if (order.paymentConfirmed === "ya") {
                    return null;
                  } else {
                    return (
                      <Fragment>
                        <h3>Konfirmasi Pembayaran</h3>
                        <hr />
                        <div className="row">
                          <div className="col-md-5">
                            <p>
                              Silahkan melakukan pembayaran senilai
                              <br />
                              <strong style={{ fontSize: "20px" }}>
                                {formatter.format(order.grandTotal)}
                              </strong>
                              {(() => {
                                if (order.orderSource === "online auction") {
                                  return (
                                    <>
                                      <br />
                                      {order.kodeUnik} adalah kode unik
                                      pembayaran
                                      <br />
                                    </>
                                  );
                                }
                              })()}
                              <br />
                              Ke rekening:
                              <br />
                              <strong style={{ fontSize: "20px" }}>
                                {(() => {
                                  switch (order.paymentType) {
                                    case "bank transfer Bca":
                                      return "BCA No Rek: XXXX-XXXXX";
                                    case "bank transfer Mandiri":
                                      return "MANDIRI No Rek: XXXX-XXXXX";
                                    case "bank transfer Mega":
                                      return "MEGA No Rek: XXXX-XXXXX";
                                  }
                                })()}
                              </strong>
                              <br />
                              <strong style={{ fontSize: "20px" }}>
                                PT Okebid
                              </strong>
                              <br />
                              Lalu isi Konfirmasi Pembayaran di disamping.
                            </p>
                            <p style={{ fontSize: "17px" }}></p>
                          </div>
                          <div className="col-md-7">
                            <form
                              onSubmit={onSubmitPaymentConfirm}
                              className="form-login"
                            >
                              {/* <div className='form-group'>
                                <label htmlFor='paymentDate'>
                                  Tanggal Bayar
                                </label>
                                <br />
                                <DatePicker
                                  selected={paymentDate}
                                  onChange={onChangeConfirmDate}
                                  className='form-control'
                                  filterDate={date => {
                                    return moment() > date;
                                  }}
                                />
                              </div> */}
                              <div className="form-group">
                                <label htmlFor="bankDetail">
                                  Transfer Dari
                                </label>
                                <div className="row">
                                  <div className="col-xs-6 col-sm-4">
                                    <select
                                      name="bankName"
                                      value={bankName}
                                      onChange={onChangePaymentConfirm}
                                      className="form-control"
                                    >
                                      <option value="">Pilih Bank...</option>
                                      <option value="BCA">BCA</option>
                                      <option value="BTN">BTN</option>
                                      <option value="BRI">BRI</option>
                                      <option value="BNI">BNI</option>
                                      <option value="CIMB NIAGA">
                                        CIMB NIAGA
                                      </option>
                                      <option value="MANDIRI">MANDIRI</option>
                                      <option value="OCBC NISP">
                                        OCBC NISP
                                      </option>
                                      <option value="PERMATA">PERMATA</option>
                                      <option value="PANIN">PANIN</option>
                                      <option value="UOB">UOB</option>
                                      <option value="DANAMON">DANAMON</option>
                                      <option value="DBS">DBS</option>
                                      <option value="HSBC">HSBC</option>
                                      <option value="ANZ">ANZ</option>
                                      <option value="ARTHA GRAHA">
                                        ARTHA GRAHA
                                      </option>
                                      <option value="BTPN">
                                        BANK TABUNGAN PENSIUNAN NASIONAL
                                      </option>
                                      <option value="CITIBANK">CITIBANK</option>
                                      <option value="ACEH SYARIAH">
                                        ACEH SYARIAH
                                      </option>
                                      <option value="AGRIS">AGRIS</option>
                                      <option value="ALTOREM/PAY">
                                        ALTOREM/PAY
                                      </option>
                                      <option value="ARTAJASA">
                                        ARTAJASA PEMBAYARAN ELEK. (RTGS)
                                      </option>
                                      <option value="ARTOS">ARTOS</option>
                                      <option value="ATMB LSB">ATMB LSB</option>
                                      <option value="ATMBPLUS">ATMBPLUS</option>
                                      <option value="BALI">BALI</option>
                                      <option value="BANGKOK BANK">
                                        BANGKOK BANK PUBLIC CO.LTD
                                      </option>
                                      <option value="BANK INDONESIA">
                                        BANK INDONESIA
                                      </option>
                                      <option value="BANK INDONESIA KP JAKARTA">
                                        BANK INDONESIA KP JAKARTA
                                      </option>
                                      <option value="BANK MEGA SYARIAH">
                                        BANK MEGA SYARIAH
                                      </option>
                                      <option value="BANK OF AMERICA">
                                        BANK OF AMERICA NA
                                      </option>
                                      <option value="BANK ROYAL">
                                        BANK ROYAL
                                      </option>
                                      <option value="BANTEN">BANTEN</option>
                                      <option value="BENGKULU">BENGKULU</option>
                                      <option value="BI CABANG AMBON">
                                        BI CABANG AMBON,AMB
                                      </option>
                                      <option value="BI CABANG BALIKPAPAN">
                                        BI CABANG BALIKPAPAN,BLP
                                      </option>
                                      <option value="22">
                                        BI CABANG BANDA ACEH,BDA
                                      </option>
                                      <option value="23">
                                        BI CABANG BANDAR LAMPUNG,BDL
                                      </option>
                                      <option value="24">
                                        BI CABANG BANDUNG,BDG
                                      </option>
                                      <option value="25">
                                        BI CABANG BANJARMASIN
                                      </option>
                                      <option value="26">
                                        BI CABANG BATAM,BTM
                                      </option>
                                      <option value="27">
                                        BI CABANG BENGKULU
                                      </option>
                                      <option value="28">
                                        BI CABANG CIREBON,CRB
                                      </option>
                                      <option value="29">
                                        BI CABANG DENPASAR,BALI
                                      </option>
                                      <option value="30">
                                        BI CABANG JAMBI
                                      </option>
                                      <option value="31">
                                        BI CABANG JAYAPURA
                                      </option>
                                      <option value="32">
                                        BI CABANG JEMBER,JBR
                                      </option>
                                      <option value="33">
                                        BI CABANG KEDIRI,KDR
                                      </option>
                                      <option value="34">
                                        BI CABANG KENDARI,KDI
                                      </option>
                                      <option value="35">
                                        BI CABANG KUPANG,KPG
                                      </option>
                                      <option value="36">
                                        BI CABANG LHOKSEUMAWE,LSM
                                      </option>
                                      <option value="37">
                                        BI CABANG MALANG,MLG
                                      </option>
                                      <option value="38">
                                        BI CABANG MANADO,MDO
                                      </option>
                                      <option value="39">
                                        BI CABANG MATARAM,CKA
                                      </option>
                                      <option value="40">
                                        BI CABANG MEDAN,MDN
                                      </option>
                                      <option value="41">
                                        BI CABANG PADANG,PDG
                                      </option>
                                      <option value="42">
                                        BI CABANG PALANGKARAYA
                                      </option>
                                      <option value="43">
                                        BI CABANG PALEMBANG,PLG
                                      </option>
                                      <option value="44">
                                        BI CABANG PALU,PLS
                                      </option>
                                      <option value="45">
                                        BI CABANG PEKAN BARU,PKB
                                      </option>
                                      <option value="46">
                                        BI CABANG PONTIANAK,PTK
                                      </option>
                                      <option value="47">
                                        BI CABANG SAMARINDA,SMD
                                      </option>
                                      <option value="48">
                                        BI CABANG SEMARANG,SMG
                                      </option>
                                      <option value="49">
                                        BI CABANG SIBOLGA
                                      </option>
                                      <option value="50">
                                        BI CABANG SOLO,SLO
                                      </option>
                                      <option value="51">
                                        BI CABANG SURABAYA,SBY
                                      </option>
                                      <option value="52">
                                        BI CABANG TEGAL
                                      </option>
                                      <option value="53">
                                        BI CABANG TERNATE
                                      </option>
                                      <option value="54">
                                        BI CABANG UJUNG PANDANG
                                      </option>
                                      <option value="55">
                                        BI CABANG YOGYAKARTA,YOG
                                      </option>
                                      <option value="56">
                                        BI PURWOKERTO,PWT
                                      </option>
                                      <option value="57">
                                        BI TASIKMALAYA,TSM
                                      </option>
                                      <option value="BJB">BJB</option>
                                      <option value="BJB SYARIAH">
                                        BJB SYARIAH
                                      </option>
                                      <option value="BKE">BKE</option>
                                      <option value="BNI SYARIAH">
                                        BNI SYARIAH
                                      </option>
                                      <option value="BOC INDONESIA">
                                        BOC INDONESIA
                                      </option>
                                      <option value="64">
                                        BPD DKI SYARIAH
                                      </option>
                                      <option value="65">
                                        BPD JAMBI SYARIAH
                                      </option>
                                      <option value="66">
                                        BPD JATENG SYARIAH
                                      </option>
                                      <option value="67">
                                        BPD JATIM SYARIAH
                                      </option>
                                      <option value="68">
                                        BPD KALBAR SYARIAH
                                      </option>
                                      <option value="69">
                                        BPD KALSEL SYARIAH
                                      </option>
                                      <option value="70">
                                        BPD KALTIM &amp; KALTARA SYARIAH
                                      </option>
                                      <option value="71">
                                        BPD RIAU SYARIAH
                                      </option>
                                      <option value="72">
                                        BPD SULSELBAR SYARIAH
                                      </option>
                                      <option value="73">
                                        BPD SUMBAR SYARIAH
                                      </option>
                                      <option value="74">
                                        BPD SUMSEL BABEL SYARIAH
                                      </option>
                                      <option value="75">
                                        BPD SUMUT SYARIAH
                                      </option>
                                      <option value="76">
                                        BPD YOGYAKARTA SYARIAH
                                      </option>
                                      <option value="77">BPR EKA</option>
                                      <option value="78">BPR KS</option>
                                      <option value="80">BRI AGRONIAGA</option>
                                      <option value="81">BRI SYARIAH</option>
                                      <option value="82">BSM</option>
                                      <option value="BTN SYARIAH">
                                        BTN SYARIAH
                                      </option>
                                      <option value="BTPN SYARIAH">
                                        BTPN SYARIAH
                                      </option>
                                      <option value="BUKOPIN">BUKOPIN</option>
                                      <option value="BUMI ARTA">
                                        BUMI ARTA
                                      </option>
                                      <option value="88">
                                        CAPITAL INDONESIA
                                      </option>
                                      <option value="CCB INDONESIA">
                                        CCB INDONESIA
                                      </option>
                                      <option value="CIMB NIAGA SYARIAH">
                                        CIMB NIAGA SYARIAH
                                      </option>
                                      <option value="COMMONWEALTH">
                                        COMMONWEALTH
                                      </option>
                                      <option value="CTBC INDONESIA">
                                        CTBC INDONESIA
                                      </option>
                                      <option value="DANAMON SYARIAH">
                                        DANAMON SYARIAH
                                      </option>
                                      <option value="DEUTSCHE BANK">
                                        DEUTSCHE BANK AG.
                                      </option>
                                      <option value="98">DINAR</option>
                                      <option value="99">DIY</option>
                                      <option value="DKI">DKI</option>
                                      <option value="101">DOKU</option>
                                      <option value="102">
                                        FINNET INDONESIA (RTGS)
                                      </option>
                                      <option value="103">GANESHA</option>
                                      <option value="104">HARDA</option>
                                      <option value="106">ICBC</option>
                                      <option value="107">INA PERDANA</option>
                                      <option value="108">INDEX</option>
                                      <option value="109">
                                        INDONESIA EXIMBANK (RTGS)
                                      </option>
                                      <option value="110">
                                        JALIN PEMBAYARAN NUSANTARA (JALIN)
                                      </option>
                                      <option value="111">JAMBI</option>
                                      <option value="112">JASA JAKARTA</option>
                                      <option value="113">JATENG</option>
                                      <option value="114">JATIM</option>
                                      <option value="JTRUST">
                                        JTRUST BANK
                                      </option>
                                      <option value="116">KALBAR</option>
                                      <option value="117">KALSEL</option>
                                      <option value="118">KALTENG</option>
                                      <option value="119">KALTIMKALTARA</option>
                                      <option value="120">
                                        KC JPMORGAN CHASE BANK, N.A
                                      </option>
                                      <option value="121">KEB HANA</option>
                                      <option value="122">KSEI (RTGS)</option>
                                      <option value="123">
                                        KSEI(REKSADANA)
                                      </option>
                                      <option value="124">LAMPUNG</option>
                                      <option value="125">MALUKUMALUT</option>
                                      <option value="127">MANTAP</option>
                                      <option value="128">MAS</option>
                                      <option value="129">MASPION</option>
                                      <option value="MAYAPADA">MAYAPADA</option>
                                      <option value="MAYBANK (D/H BII)">
                                        MAYBANK (D/H BII)
                                      </option>
                                      <option value="132">
                                        MAYBANK INDONESIA SYARIAH
                                      </option>
                                      <option value="MAYORA">MAYORA</option>
                                      <option value="MEGA">MEGA</option>
                                      <option value="135">MESTIKA</option>
                                      <option value="MNC BANK">MNC BANK</option>
                                      <option value="137">MUAMALAT</option>
                                      <option value="138">
                                        MUFG BANK, LTD
                                      </option>
                                      <option value="139">NAGARI</option>
                                      <option value="NOBU">NOBU</option>
                                      <option value="141">NTB SYARIAH</option>
                                      <option value="142">NTT</option>
                                      <option value="143">
                                        OCBC NISP SYARIAH
                                      </option>
                                      <option value="PANIN SYARIAH">
                                        PANIN SYARIAH
                                      </option>
                                      <option value="147">PAPUA</option>
                                      <option value="148">PAYPRO</option>
                                      <option value="PERMATA SYARIAH">
                                        PERMATA SYARIAH
                                      </option>
                                      <option value="151">
                                        PRIMA MASTER BANK
                                      </option>
                                      <option value="152">
                                        PT ALTO NETWORK (PT ALTO)
                                      </option>
                                      <option value="153">
                                        PT RINTIS SEJAHTERA (PT RINTIS)
                                      </option>
                                      <option value="154">
                                        PT. BANK AMAR INDONESIA
                                      </option>
                                      <option value="BCA SYARIAH">
                                        PT. BANK BCA SYARIAH
                                      </option>
                                      <option value="156">
                                        PT. BANK BISNIS INTERNASIONAL
                                      </option>
                                      <option value="157">
                                        PT. BANK BNP PARIBAS INDONESIA
                                      </option>
                                      <option value="158">
                                        PT. BANK FAMA INTERNATIONAL
                                      </option>
                                      <option value="159">
                                        PT. BANK MAYBANK SYARIAH INDONESIA
                                      </option>
                                      <option value="160">
                                        PT. BANK MIZUHO INDONESIA
                                      </option>
                                      <option value="161">
                                        PT. BANK RESONA PERDANIA
                                      </option>
                                      <option value="162">QNB INDONESIA</option>
                                      <option value="163">RABOBANK</option>
                                      <option value="164">RIAU</option>
                                      <option value="165">
                                        SAHABAT SAMPOERN
                                      </option>
                                      <option value="166">SBI INDONESIA</option>
                                      <option value="167">SHINHAN</option>
                                      <option value="SINARMAS">SINARMAS</option>
                                      <option value="SINARMAS SYARIAH">
                                        SINARMAS SYARIAH
                                      </option>
                                      <option value="170">
                                        STANDARD CHARTERED
                                      </option>
                                      <option value="171">SULSELBAR</option>
                                      <option value="172">SULTENG</option>
                                      <option value="173">SULTRA</option>
                                      <option value="174">SULUT</option>
                                      <option value="175">SUMSELBABEL</option>
                                      <option value="176">SUMUT</option>
                                      <option value="177">SWADESI</option>
                                      <option value="178">
                                        SYARIAH BUKOPIN
                                      </option>
                                      <option value="179">TCASH</option>
                                      <option value="180">TELKOM</option>
                                      <option value="VICTORIA">VICTORIA</option>
                                      <option value="183">
                                        VICTORIA SYARIAH
                                      </option>
                                      <option value="184">WOORI SAUDARA</option>
                                      <option value="185">XL TUNAI</option>
                                      <option value="186">YUDHA BHAKTI</option>
                                    </select>
                                  </div>
                                  <div className="col-xs-6 col-sm-4">
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="accNumber"
                                      placeholder="Nomor Rek"
                                      required
                                      value={accNumber}
                                      onChange={onChangePaymentConfirm}
                                    />
                                  </div>
                                  <div className="col-xs-6 col-sm-4">
                                    <input
                                      className="form-control"
                                      type="text"
                                      name="accName"
                                      placeholder="Nama Rek"
                                      required
                                      value={accName}
                                      onChange={onChangePaymentConfirm}
                                    />
                                  </div>
                                </div>
                              </div>
                              <input
                                type="submit"
                                style={{ fontWeight: "bold" }}
                                value="KIRIM KONFIRMASI PEMBAYARAN"
                                className="btn btn-success custom-class"
                              />
                            </form>
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
                    (order.complainDate &&
                      order.complainAccepted === "tidak") ||
                    order.orderCancelReason === "penjual tidak kirim"
                  ) {
                    if (order.orderReview === "tidak") {
                      if (order.orderSource === "online auction") {
                        return (
                          <Fragment>
                            <h3>
                              Berikan ulasan untuk penjual{" "}
                              <span style={{ textTransform: "capitalize" }}>
                                {sellerUsername}
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
                                      {sellerUsername}
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
                                        required
                                        name="rating"
                                        value={rating}
                                        onChange={onChangeReview}
                                        className="form-control"
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
                                          1 (Pelayanan buruk)
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
                                        placeholder="Berikan ulasan untuk penjual..."
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
                      } else if (order.orderSource === "marketplace") {
                        return (
                          <Fragment>
                            <h3>Berikan ulasan produk</h3>
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
                                    Berikan ulasan produk.
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
                                    onSubmit={onSubmitReviewProduct}
                                    className="form-login"
                                  >
                                    <div className="form-group">
                                      <label htmlFor="rating">
                                        Pilih Rating{" "}
                                        <i className="fa fa-star"></i>
                                      </label>
                                      <select
                                        required
                                        name="rating"
                                        value={rating}
                                        onChange={onChangeReview}
                                        className="form-control"
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
                                          1 (Pelayanan buruk)
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
                                        placeholder="Berikan ulasan produk..."
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
                                {sellerUsername}.
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
                  } else if (
                    order.paymentConfirmed === "ya" &&
                    order.orderPaid === "ya" &&
                    order.orderSent === "ya" &&
                    order.orderAccepted === "tidak" &&
                    !order.complainDate
                  ) {
                    return (
                      <Fragment>
                        <h3>
                          Konfirmasi produk sudah Kamu terima dan sesuai
                          deskripsi produk.
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
                                Pastikan produk sudah Kamu terima dan sudah
                                sesuai dengan deskripsi, dan klik tombol PRODUK
                                SUDAH DITERIMA.
                              </p>
                              <p>
                                Apabila produk tidak sesuai dan butuh bantuan
                                Admin, klik tombol LAPOR KOMPLAIN KE ADMIN.
                              </p>
                              <p>
                                <strong>
                                  Bila waktu sudah melewati 48 jam sejak produk
                                  diterima dan Kamu belum melakukan konfirmasi,
                                  maka transaksi kami anggap selesai dan dana
                                  akan kami teruskan ke penjual.
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
                                    float: "left",
                                    marginRight: "15px",
                                    marginBottom: "10px",
                                  }}
                                  value="PRODUK SUDAH DITERIMA"
                                  className="btn btn-success custom-class"
                                />
                              </form>
                              {(() => {
                                if (!order.complainDate) {
                                  return (
                                    <Fragment>
                                      <button
                                        onClick={scrollSmoothHandler}
                                        className="btn btn-warning custom-class"
                                        style={{
                                          float: "left",
                                          marginRight: "15px",
                                          marginBottom: "10px",
                                          width: "100%",
                                        }}
                                      >
                                        <strong>DISKUSI DENGAN PENJUAL</strong>
                                      </button>
                                      <form
                                        onSubmit={onSubmitRejectComplain}
                                        className="form-login"
                                      >
                                        <input
                                          type="submit"
                                          style={{
                                            fontWeight: "bold",
                                            marginBottom: "10px",
                                          }}
                                          value="LAPOR KOMPLAIN KE ADMIN"
                                          className="btn btn-danger custom-class"
                                        />
                                      </form>
                                    </Fragment>
                                  );
                                }
                              })()}
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
                          Mohon email bukti komplain Kamu dalam waktu maksimal
                          48 jam (batas waktu{" "}
                          {moment(order.complainEmailExpiredDate).format(
                            "DD MMM YYYY. HH:mm:ss"
                          )}
                          ) ke{" "}
                          <b>
                            <a href="mailto:cs@Okebid.com">cs@Okebid.com</a>
                          </b>
                          , dengan subject "KOMPLAIN, ORDER {order.orderId}".
                        </p>
                        <p>
                          Lampirkan bukti-bukti yang lengkap, foto-foto dan
                          video unboxing, untuk kami tindaklanjuti dengan
                          penjual. Bukti-bukti akan kami teruskan ke email
                          penjual.
                        </p>
                        <p>
                          Bila telah melewati 48 jam dan kami belum menerima
                          email komplain, maka transaksi ini kami anggap selesai
                          dan dana akan diteruskan ke penjual.
                        </p>
                      </div>
                    );
                  }
                })()}

                {(() => {
                  if (order.orderRefundSent === "ya") {
                    return null;
                  } else if (
                    order.paymentConfirmed === "ya" &&
                    order.orderPaid === "ya" &&
                    order.orderSent === "ya" &&
                    order.orderAccepted === "tidak" &&
                    order.complainDate &&
                    order.complainAccepted === "ya" &&
                    order.orderRefundSent === "tidak" &&
                    order.orderCancelReason !== "pembeli tidak kirim retur"
                  ) {
                    return (
                      <Fragment>
                        <h3>Konfirmasi Pengiriman Produk Retur</h3>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <p>
                              Silahkan melakukan pengiriman retur dalam waktu
                              maksimal 48 jam (batas waktu{" "}
                              {moment(order.orderRefundSentExpiredDate).format(
                                "DD MMM YYYY. HH:mm:ss"
                              )}
                              ), dan konfirmasikan pengiriman Kamu dengan
                              mengisi Nomor Resi dan tombol KONFIRMASI SUDAH
                              KIRIM RETUR.
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
                                      value="KONFIRMASI SUDAH KIRIM RETUR"
                                      className="btn btn-success custom-class"
                                      disabled="disabled"
                                    />
                                  );
                                } else {
                                  return (
                                    <input
                                      type="submit"
                                      style={{ fontWeight: "bold" }}
                                      value="KONFIRMASI SUDAH KIRIM RETUR"
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
                            Kamu sudah melakukan checkout.
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
                            {(() => {
                              if (order.orderPaid === "tidak") {
                                return (
                                  <>
                                    <br />
                                    Kamu sudah konfirmasi pembayaran. Sedang
                                    diverifikasi oleh admin Okebid.
                                  </>
                                );
                              }
                            })()}

                            <br />
                            {payConfirmFields}
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
                            email ke penjual dan Kamu. */}
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
                                    Produk sudah dikirimkan oleh penjual dengan
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
                                    Produk sudah dikirimkan oleh penjual.
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
                            Produk sudah sampai di alamat Kamu.
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
                                  {/* Kamu komplain dan dimoderasi oleh Admin
                                  Okebid. Sistem mengirim email instruksi ke
                                  Kamu dan penjual utk penyelesaian komplain
                                  ini. */}
                                  Kamu komplain dan dimoderasi oleh Admin
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
                                                  Komplain Kamu disetujui oleh
                                                  admin Okebid. Kamu harus
                                                  mengirimkan produk retur
                                                  kepada penjual dalam waktu
                                                  maksimal 48 jam.
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
                                                  ke penjual.
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
                                                    dikirimkan oleh Kamu dengan
                                                    Nomor resi{" "}
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
                                                    dikirimkan oleh Kamu.
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
                                                    alamat penjual.
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
                                                    alamat penjual.
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
                                                    oleh penjual. Dana akan
                                                    dikembalikan ke Kamu.
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
                                                    oleh penjual. Dana akan
                                                    dikembalikan ke Kamu.
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
                                            dikembalikan ke rekening Kamu.
                                            <br />
                                            {(() => {
                                              if (order.refundSettle === "ya") {
                                                return (
                                                  <Fragment>
                                                    Jumlah ditransfer:{" "}
                                                    {formatter.format(
                                                      order.refundSettleAmount
                                                    )}{" "}
                                                    (dipotong 3% biaya transaksi
                                                    dari harga produk{" "}
                                                    {formatter.format(
                                                      order.productPrice
                                                    )}
                                                    )
                                                    <br />
                                                    {order.refundSettleBankAcc}
                                                  </Fragment>
                                                );
                                              }
                                            })()}
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
                                            diteruskan ke rekening penjual.
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
                                    Kamu. Dana akan diteruskan ke penjual.
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
                                    rekening penjual.
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
                    <table className="table table-striped" ref={scrollDiv}>
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
                                      <br />
                                      Penjual: {sellerUsername}
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

export default EditBuyerOrder;
