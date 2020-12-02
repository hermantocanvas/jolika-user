import React, { useEffect, useState, useContext, Fragment } from "react";
import { Link, useHistory } from "react-router-dom";
import Modal from "react-responsive-modal";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert";
import Loader from "react-loader-spinner";
import imageCompression from "browser-image-compression";

import "react-confirm-alert/src/react-confirm-alert.css";
import AlertContext from "../../../context/alert/alertContext";
import AuthContext from "../../../context/auth/authContext";
import AddVariant from "./addVariant/AddVariant";

const AddProduct = () => {
  const history = useHistory();
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;
  //set initial local state
  const [product, setProduct] = useState({
    name: "",
    categoryId: "",
    subcategory_id1: "",
    subcategory_id2: "",
    subcategory_id3: "",
    subcategory_id4: "",
    subcategory_id5: "",
    subcategory_id6: "",
    condition: "",
    description: "",
    duration: "",
    stock: "",
    marketplacePrice: "",
    useMarketplaceButton: false,
    startingPrice: "",
    marketPrice: "",
    weight: "",
    shippingRegularJne: true,
    shippingRegularJnt: false,
    shippingRegularSicepat: false,
    shippingRegularPos: false,
    shippingRegularRpx: false,
    shippingRegularWahana: false,
    shippingRegularNinja: false,
    shippingRegularRex: false,
    shippingRegularSap: false,
    shippingRegularJet: false,
    shippingRegularDse: false,
    shippingRegularLion: false,
    shippingNextDayJne: false,
    shippingNextDaySicepat: false,
    shippingNextDayPos: false,
    shippingNextDayRpx: false,
    shippingNextDayRex: false,
    shippingNextDaySap: false,
    shippingNextDayJet: false,
    shippingNextDayDse: false,
    shippingNextDayLion: false,
    bidStatus: "",
    marketplaceStatus: "",
    countryId: "",
    provinceId: "",
    districtId: "",
    subdistrictId: "",
    agreeToc: false,
    agreeCommission: false,
  });
  const {
    name,
    categoryId,
    subcategory_id1,
    subcategory_id2,
    subcategory_id3,
    subcategory_id4,
    subcategory_id5,
    subcategory_id6,
    condition,
    description,
    duration,
    marketplacePrice,
    useMarketplaceButton,
    startingPrice,
    marketPrice,
    stock,
    weight,
    shippingRegularJne,
    shippingRegularJnt,
    shippingRegularSicepat,
    shippingRegularPos,
    shippingRegularRpx,
    shippingRegularWahana,
    shippingRegularNinja,
    shippingRegularRex,
    shippingRegularSap,
    shippingRegularJet,
    shippingRegularDse,
    shippingRegularLion,
    shippingNextDayJne,
    shippingNextDaySicepat,
    shippingNextDayPos,
    shippingNextDayRpx,
    shippingNextDayRex,
    shippingNextDaySap,
    shippingNextDayJet,
    shippingNextDayDse,
    shippingNextDayLion,
    bidStatus,
    marketplaceStatus,
    countryId,
    provinceId,
    districtId,
    subdistrictId,
    agreeToc,
    agreeCommission,
    reservedPrice,
  } = product;
  const [images, setImages] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
  });
  const { image1, image2, image3, image4, image5, image6 } = images;
  const [nameCount, setNameCount] = useState(0);
  const [descriptionCount, setDescriptionCount] = useState(0);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategory1, setSubcategory1] = useState([]);
  const [subcategory2, setSubcategory2] = useState([]);
  const [subcategory3, setSubcategory3] = useState([]);
  const [subcategory4, setSubcategory4] = useState([]);
  const [subcategory5, setSubcategory5] = useState([]);
  const [subcategory6, setSubcategory6] = useState([]);
  const [modal2IsOpen, setModal2] = useState(false);
  const [modal3IsOpen, setModal3] = useState(false);
  const [isShowHargaTargetInfo, setIsShowHargaTargetInfo] = useState(false);
  const [loadSpinner, setLoadSpinner] = useState(false);
  const [reservedPriceToken, setReservedPriceToken] = useState("");

  useEffect(() => {
    loadCountries();
    loadProvinces();
    loadCategories();
    loadSetting();
    loadReservedPriceToken();
    //eslint-disable-next-line
  }, []);

  async function loadCountries() {
    try {
      const countries = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/countries`
      );
      setCountries(countries.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadReservedPriceToken() {
    try {
      const token = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/configuration/get`
      );
      setReservedPriceToken(token.data.data.reservedPriceToken);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSetting() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/setting`
      );

      setProduct({
        ...product,
        shippingRegularJne: res.data.data.shippingRegularJne,
        shippingRegularJnt: res.data.data.shippingRegularJnt,
        shippingRegularSicepat: res.data.data.shippingRegularSicepat,
        shippingRegularPos: res.data.data.shippingRegularPos,
        shippingRegularRpx: res.data.data.shippingRegularRpx,
        shippingRegularWahana: res.data.data.shippingRegularWahana,
        shippingRegularNinja: res.data.data.shippingRegularNinja,
        shippingRegularRex: res.data.data.shippingRegularRex,
        shippingRegularSap: res.data.data.shippingRegularSap,
        shippingRegularJet: res.data.data.shippingRegularJet,
        shippingRegularDse: res.data.data.shippingRegularDse,
        shippingRegularLion: res.data.data.shippingRegularLion,
        shippingNextDayJne: res.data.data.shippingNextDayJne,
        shippingNextDaySicepat: res.data.data.shippingNextDaySicepat,
        shippingNextDayPos: res.data.data.shippingNextDayPos,
        shippingNextDayRpx: res.data.data.shippingNextDayRpx,
        shippingNextDayRex: res.data.data.shippingNextDayRex,
        shippingNextDaySap: res.data.data.shippingNextDaySap,
        shippingNextDayJet: res.data.data.shippingNextDayJet,
        shippingNextDayDse: res.data.data.shippingNextDayDse,
        shippingNextDayLion: res.data.data.shippingNextDayLion,
        countryId: res.data.data.countryId,
        provinceId: res.data.data.provinceId,
        districtId: res.data.data.districtId,
        subdistrictId: res.data.data.subdistrictId,
      });

      if (res.data.data.provinceId !== undefined) {
        loadDistricts(res.data.data.provinceId);
      }

      if (res.data.data.districtId !== undefined) {
        loadSubdistricts(res.data.data.districtId);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadProvinces() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/provinces`
      );
      setProvinces(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //load districts
  async function loadDistricts(provinceId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      setDistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  //load subdistricts
  async function loadSubdistricts(districtId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );
      setSubdistricts(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadCategories() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/?sort=categoryId`
      );

      setCategories(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory1(categoryId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories1/${categoryId}`
      );
      setSubcategory1(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory2(parentId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories2/${parentId}`
      );
      setSubcategory2(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory3(parentId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories3/${parentId}`
      );
      setSubcategory3(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory4(parentId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories4/${parentId}`
      );
      setSubcategory4(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory5(parentId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories5/${parentId}`
      );
      setSubcategory5(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategory6(parentId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories6/${parentId}`
      );
      setSubcategory6(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  const onChange = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const onNameChange = (e) => {
    let count = e.target.value.length;
    setNameCount(count);
    setProduct({ ...product, name: e.target.value });
  };

  const onDescriptionChange = (e) => {
    let count = e.target.value.length;
    setDescriptionCount(count);
    setProduct({ ...product, description: e.target.value });
  };

  const onChangeCheck = (e) =>
    setProduct({ ...product, [e.target.name]: e.target.checked });

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
          case "file2":
            setImages({
              ...images,
              image2: compressedFile,
            });
            break;
          case "file3":
            setImages({
              ...images,
              image3: compressedFile,
            });
            break;
          case "file4":
            setImages({
              ...images,
              image4: compressedFile,
            });
            break;
          case "file5":
            setImages({
              ...images,
              image5: compressedFile,
            });
            break;
          case "file6":
            setImages({
              ...images,
              image6: compressedFile,
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
      case "delete2":
        document.getElementById(`preview2`).setAttribute("src", "");
        document.getElementById(`file2`).value = null;
        setImages({
          ...images,
          image2: "",
        });
        break;
      case "delete3":
        document.getElementById(`preview3`).setAttribute("src", "");
        document.getElementById(`file3`).value = null;
        setImages({
          ...images,
          image3: "",
        });
        break;
      case "delete4":
        document.getElementById(`preview4`).setAttribute("src", "");
        document.getElementById(`file4`).value = null;
        setImages({
          ...images,
          image4: "",
        });
        break;
      case "delete5":
        document.getElementById(`preview5`).setAttribute("src", "");
        document.getElementById(`file5`).value = null;
        setImages({
          ...images,
          image5: "",
        });
        break;
      case "delete6":
        document.getElementById(`preview6`).setAttribute("src", "");
        document.getElementById(`file6`).value = null;
        setImages({
          ...images,
          image6: "",
        });
        break;
      default:
        break;
    }
  };

  const onChangeProvince = async (e) => {
    const provinceId = e.target.value;

    setProduct({ ...product, provinceId: provinceId });

    //reset subdistricts
    setSubdistricts([]);

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/districts/${provinceId}`
      );
      if (res) {
        setDistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeDistrict = async (e) => {
    const districtId = e.target.value;

    setProduct({ ...product, districtId: districtId });

    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/shipping/subdistricts/${districtId}`
      );
      if (res) {
        setSubdistricts(res.data.data);
      }
    } catch (err) {
      setAlert(err.message, "danger");
    }
  };

  const onChangeSubdistrict = async (e) => {
    const subdistrictId = e.target.value;
    setProduct({ ...product, subdistrictId: subdistrictId });
  };

  const onChangeCategory = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, categoryId: categoryId });
    if (categoryId) {
      loadSubcategory1(categoryId);
    }
  };

  const onChangeSubcategory1 = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, subcategory_id1: categoryId });
    if (categoryId) {
      loadSubcategory2(categoryId);
    }
  };

  const onChangeSubcategory2 = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, subcategory_id2: categoryId });
    if (categoryId) {
      loadSubcategory3(categoryId);
    }
  };

  const onChangeSubcategory3 = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, subcategory_id3: categoryId });
    if (categoryId) {
      loadSubcategory4(categoryId);
    }
  };

  const onChangeSubcategory4 = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, subcategory_id4: categoryId });
    if (categoryId) {
      loadSubcategory5(categoryId);
    }
  };

  const onChangeSubcategory5 = (e) => {
    const categoryId = e.target.value;
    setProduct({ ...product, subcategory_id5: categoryId });
    if (categoryId) {
      loadSubcategory6(categoryId);
    }
  };

  const openModal2 = () => {
    setModal2(true);
  };
  const closeModal2 = () => {
    setModal2(false);
  };

  const openModal3 = () => {
    setModal3(true);
  };
  const closeModal3 = () => {
    setModal3(false);
  };

  const onClickSimpanAktif = (e) => {
    setProduct({ ...product, bidStatus: "aktif" });
  };

  const onClickSimpanMarketplaceAktif = (e) => {
    setProduct({
      ...product,
      marketplaceStatus: "aktif",
      useMarketplaceButton: true,
    });
  };

  const onClickSimpanDraft = (e) => {
    setProduct({
      ...product,
      bidStatus: "tidak aktif",
      marketplaceStatus: "tidak aktif",
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    //check for phone number and email (prohibited)
    // const phoneRegex =
    //   "(\\()?(\\+62|62|0|8)(\\d{2,3})?\\)?[ .-]?\\d{2,4}[ .-]?\\d{2,4}[ .-]?\\d{2,4}";
    // const emailRegex = "^[^@]+@[^@]+\\.[^@]+$";

    if (
      categoryId === "" ||
      condition === "" ||
      description === "" ||
      marketplacePrice === "" ||
      weight === "" ||
      countryId === "" ||
      provinceId === "" ||
      districtId === "" ||
      subdistrictId === ""
    ) {
      setAlert("Mohon mengisi field yang diharuskan", "danger");
      // } else if (
      //   description.match(phoneRegex) !== null ||
      //   name.match(phoneRegex) !== null
      // ) {
      //   setAlert(
      //     "Nama barang dan deskripsi tidak boleh mengandung nomor hp/telepon.",
      //     "danger"
      //   );
      // } else if (
      //   description.match(emailRegex) !== null ||
      //   name.match(emailRegex) !== null
      // ) {
      //   setAlert(
      //     "Nama barang dan deskripsi tidak boleh mengandung email.",
      //     "danger"
      //   );
    } else if (
      marketPrice !== "" &&
      parseInt(marketPrice) <= parseInt(startingPrice)
    ) {
      setAlert(
        "Harga normal/pasaran harus lebih tinggi dari harga jual/lelang.",
        "danger"
      );
    } else if (
      reservedPrice !== "" &&
      parseInt(reservedPrice) <
        parseInt(startingPrice) + (30 / 100) * parseInt(startingPrice)
    ) {
      setAlert(
        `Harga target harus 30% lebih tinggi dari harga lelang awal. Minimal Rp ${
          parseInt(startingPrice) + (30 / 100) * parseInt(startingPrice)
        }`,
        "danger"
      );
    } else if (agreeToc === false) {
      setAlert("Mohon menyetujui Syarat dan Ketentuan Okebid", "danger");
      // } else if (agreeCommission === false) {
      //   setAlert(
      //     "Mohon menyetujui biaya transaksi X% dari harga jual akhir",
      //     "danger"
      //   );
    } else if (image1 === "") {
      setAlert("Gambar 1 (Cover) harus diisi", "danger");
    } else if (shippingRegularJne.checked === false) {
      setAlert("Shipping regular harus diisi", "danger");
    } else if (startingPrice > 100000000) {
      setAlert("Harga awal produk maksimal 100 Juta Rupiah", "danger");
    } else {
      //check the input price if modulus is 0
      let bidStep;
      let isPriceCorrect = true;

      if (startingPrice && startingPrice <= 999999) {
        bidStep = 10000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan Rp ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (
        startingPrice &&
        startingPrice > 999999 &&
        startingPrice <= 2499999
      ) {
        bidStep = 20000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (
        startingPrice &&
        startingPrice > 2499999 &&
        startingPrice <= 4999999
      ) {
        bidStep = 50000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (
        startingPrice &&
        startingPrice > 4999999 &&
        startingPrice <= 9999999
      ) {
        bidStep = 100000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (
        startingPrice &&
        startingPrice > 9999999 &&
        startingPrice <= 24999999
      ) {
        bidStep = 250000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (
        startingPrice &&
        startingPrice > 24999999 &&
        startingPrice <= 49999999
      ) {
        bidStep = 500000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      } else if (startingPrice && startingPrice > 49999999) {
        bidStep = 1000000;
        if (startingPrice % bidStep !== 0) {
          isPriceCorrect = false;
          setAlert(
            `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
              bidStep
            )}`,
            "danger"
          );
          document.getElementById("startingPrice").focus();
        }
      }

      if (bidStatus === "aktif" && isPriceCorrect === true) {
        if (stock < 2) {
          setAlert("Minimal stok harus 2", "danger");
          return false;
        }

        if (
          reservedPrice !== "" &&
          parseInt(reservedPrice) <
            parseInt(startingPrice) + (30 / 100) * parseInt(startingPrice)
        ) {
          setAlert(
            `Harga target harus 30% lebih tinggi dari harga lelang awal. Minimal Rp ${
              parseInt(startingPrice) + (30 / 100) * parseInt(startingPrice)
            }`,
            "danger"
          );
        }

        confirmAlert({
          title: "Aktifkan Lelang?",
          message: `Pastikan Stok Tersedia. Produk Tidak Bisa diedit selama masa lelang. Sudah yakin mau diaktifkan?`,
          buttons: [
            {
              label: "Ya",
              onClick: () => saveProduct(),
            },
            {
              label: "Tidak",
              onClick: () => console.log("Cancel Auction..."),
            },
          ],
        });
      } else if (
        bidStatus !== "aktif" &&
        isPriceCorrect === true &&
        useMarketplaceButton === false
      ) {
        saveProduct();
      } else if (
        marketplaceStatus === "aktif" &&
        useMarketplaceButton === true
      ) {
        confirmAlert({
          title: "Aktifkan Produk Marketplace?",
          message: `Pastikan Stok Tersedia. Sudah yakin mau diaktifkan?`,
          buttons: [
            {
              label: "Ya",
              onClick: () => saveProductMarketplace(),
            },
            {
              label: "Tidak",
              onClick: () => console.log("Cancel marketplace active..."),
            },
          ],
        });
      } else if (marketplaceStatus !== "aktif") {
        saveProductMarketplace();
      }
    }

    async function saveProduct() {
      setLoadSpinner(true);

      let formData = new FormData();

      if (image1) {
        formData.append("files", image1);
      }
      if (image2) {
        formData.append("files", image2);
      }
      if (image3) {
        formData.append("files", image3);
      }
      if (image4) {
        formData.append("files", image4);
      }
      if (image5) {
        formData.append("files", image5);
      }
      if (image6) {
        formData.append("files", image6);
      }

      formData.append("name", name);
      formData.append("bidStatus", bidStatus);
      formData.append("categoryId", categoryId);
      formData.append("subcategory1", subcategory_id1);
      formData.append("subcategory2", subcategory_id2);
      formData.append("subcategory3", subcategory_id3);
      formData.append("subcategory4", subcategory_id4);
      formData.append("subcategory5", subcategory_id5);
      formData.append("subcategory6", subcategory_id6);
      formData.append("condition", condition);
      formData.append("description", description);
      formData.append("duration", duration);
      formData.append("startingPrice", startingPrice);
      formData.append("marketPrice", marketPrice);
      formData.append("marketplacePrice", marketplacePrice);
      formData.append("shippingRegularJne", shippingRegularJne);
      formData.append("shippingRegularJnt", shippingRegularJnt);
      formData.append("shippingRegularSicepat", shippingRegularSicepat);
      formData.append("shippingRegularPos", shippingRegularPos);
      formData.append("shippingRegularRpx", shippingRegularRpx);
      formData.append("shippingRegularWahana", shippingRegularWahana);
      formData.append("shippingRegularNinja", shippingRegularNinja);
      formData.append("shippingRegularRex", shippingRegularRex);
      formData.append("shippingRegularSap", shippingRegularSap);
      formData.append("shippingRegularJet", shippingRegularJet);
      formData.append("shippingRegularDse", shippingRegularDse);
      formData.append("shippingRegularLion", shippingRegularLion);
      formData.append("shippingNextDayJne", shippingNextDayJne);
      formData.append("shippingNextDaySicepat", shippingNextDaySicepat);
      formData.append("shippingNextDayPos", shippingNextDayPos);
      formData.append("shippingNextDayRpx", shippingNextDayRpx);
      formData.append("shippingNextDayRex", shippingNextDayRex);
      formData.append("shippingNextDaySap", shippingNextDaySap);
      formData.append("shippingNextDayJet", shippingNextDayJet);
      formData.append("shippingNextDayDse", shippingNextDayDse);
      formData.append("shippingNextDayLion", shippingNextDayLion);
      formData.append("weight", weight);
      formData.append("imagesName", []);
      formData.append("slug", "");
      formData.append("countryId", countryId);
      formData.append("provinceId", provinceId);
      formData.append("districtId", districtId);
      formData.append("subdistrictId", subdistrictId);
      if (reservedPrice) {
        formData.append("reservedPrice", reservedPrice);
      }

      try {
        await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/products/`,
          formData
        );

        setAlert("Produk berhasil dibuat.", "success");

        setLoadSpinner(false);

        history.push("/akun/produk");
      } catch (err) {
        setLoadSpinner(false);
        // setAlert(err.message, "danger");
      }
    }

    async function saveProductMarketplace() {
      setLoadSpinner(true);

      let formData = new FormData();

      if (image1) {
        formData.append("files", image1);
      }
      if (image2) {
        formData.append("files", image2);
      }
      if (image3) {
        formData.append("files", image3);
      }
      if (image4) {
        formData.append("files", image4);
      }
      if (image5) {
        formData.append("files", image5);
      }
      if (image6) {
        formData.append("files", image6);
      }

      formData.append("name", name);
      formData.append("marketplaceStatus", marketplaceStatus);
      formData.append("categoryId", categoryId);
      formData.append("subcategory1", subcategory_id1);
      formData.append("subcategory2", subcategory_id2);
      formData.append("subcategory3", subcategory_id3);
      formData.append("subcategory4", subcategory_id4);
      formData.append("subcategory5", subcategory_id5);
      formData.append("subcategory6", subcategory_id6);
      formData.append("condition", condition);
      formData.append("description", description);
      formData.append("marketplacePrice", marketplacePrice);
      formData.append("marketPrice", marketPrice);
      formData.append("shippingRegularJne", shippingRegularJne);
      formData.append("shippingRegularJnt", shippingRegularJnt);
      formData.append("shippingRegularSicepat", shippingRegularSicepat);
      formData.append("shippingRegularPos", shippingRegularPos);
      formData.append("shippingRegularRpx", shippingRegularRpx);
      formData.append("shippingRegularWahana", shippingRegularWahana);
      formData.append("shippingRegularNinja", shippingRegularNinja);
      formData.append("shippingRegularRex", shippingRegularRex);
      formData.append("shippingRegularSap", shippingRegularSap);
      formData.append("shippingRegularJet", shippingRegularJet);
      formData.append("shippingRegularDse", shippingRegularDse);
      formData.append("shippingRegularLion", shippingRegularLion);
      formData.append("shippingNextDayJne", shippingNextDayJne);
      formData.append("shippingNextDaySicepat", shippingNextDaySicepat);
      formData.append("shippingNextDayPos", shippingNextDayPos);
      formData.append("shippingNextDayRpx", shippingNextDayRpx);
      formData.append("shippingNextDayRex", shippingNextDayRex);
      formData.append("shippingNextDaySap", shippingNextDaySap);
      formData.append("shippingNextDayJet", shippingNextDayJet);
      formData.append("shippingNextDayDse", shippingNextDayDse);
      formData.append("shippingNextDayLion", shippingNextDayLion);
      formData.append("weight", weight);
      formData.append("stock", stock);
      formData.append("imagesName", []);
      formData.append("slug", "");
      formData.append("countryId", countryId);
      formData.append("provinceId", provinceId);
      formData.append("districtId", districtId);
      formData.append("subdistrictId", subdistrictId);

      try {
        const resProduct = await axios.post(
          `${process.env.REACT_APP_APIURL}api/v1/products/marketplace`,
          formData
        );

        await createProductCombinations(resProduct.data.data._id);

        setLoadSpinner(false);

        setAlert("Produk berhasil dibuat.", "success");

        history.push("/akun/produk");
      } catch (err) {
        setLoadSpinner(false);
        setAlert(err.message, "danger");
      }
    }
  };

  // ----------------------ADD VARIANT -------------------------//
  const [productCombinations, setProductCombinations] = useState([]);
  const [variantDetails1, setVariantDetails1] = useState([]);
  const [variantDetails2, setVariantDetails2] = useState([]);
  const [isVariant, setIsVariant] = useState(false);
  const createProductCombinations = async (product_id) => {
    const tmp = productCombinations;
    let formData = new FormData();
    tmp.forEach((pc, i) => {
      if (pc.image) {
        formData.append("files", pc.image);
      }
      tmp[i].product_id = product_id;
    });
    formData.append("productCombinations", JSON.stringify(tmp));
    formData.append("variant1Options", JSON.stringify(variantDetails1));
    formData.append("variant2Options", JSON.stringify(variantDetails2));

    try {
      await axios.post(
        `${process.env.REACT_APP_APIURL}api/v1/productCombinations/create-new`,
        formData
      );
    } catch (error) {}
  };
  //-----------------------END ADD VARIANT-------------------------//

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });

  if (image1) {
    document
      .getElementById("preview1")
      .setAttribute("src", URL.createObjectURL(image1));
  }
  if (image2) {
    document
      .getElementById(`preview2`)
      .setAttribute("src", URL.createObjectURL(image2));
  }
  if (image3) {
    document
      .getElementById(`preview3`)
      .setAttribute("src", URL.createObjectURL(image3));
  }
  if (image4) {
    document
      .getElementById(`preview4`)
      .setAttribute("src", URL.createObjectURL(image4));
  }
  if (image5) {
    document
      .getElementById(`preview5`)
      .setAttribute("src", URL.createObjectURL(image5));
  }
  if (image6) {
    document
      .getElementById(`preview6`)
      .setAttribute("src", URL.createObjectURL(image6));
  }

  let subcategory1Block;
  if (subcategory1.length > 0) {
    subcategory1Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id1"
          required
          value={subcategory_id1}
          onChange={onChangeSubcategory1}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory1.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let subcategory2Block;
  if (subcategory2.length > 0) {
    subcategory2Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id2"
          required
          value={subcategory_id2}
          onChange={onChangeSubcategory2}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory2.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let subcategory3Block;
  if (subcategory3.length > 0) {
    subcategory3Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id3"
          required
          value={subcategory_id3}
          onChange={onChangeSubcategory3}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory3.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let subcategory4Block;
  if (subcategory4.length > 0) {
    subcategory4Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id4"
          required
          value={subcategory_id4}
          onChange={onChangeSubcategory4}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory4.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let subcategory5Block;
  if (subcategory5.length > 0) {
    subcategory5Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id5"
          required
          value={subcategory_id5}
          onChange={onChangeSubcategory5}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory5.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let subcategory6Block;
  if (subcategory6.length > 0) {
    subcategory6Block = (
      <div className="col-sm-3">
        <select
          style={{ textTransform: "capitalize" }}
          name="subcategory_id6"
          required
          value={subcategory_id6}
          onChange={onChange}
        >
          <option value="">Pilih Sub Kategori...</option>
          {subcategory6.map((subcategory) => (
            <option value={subcategory.categoryId} key={subcategory.categoryId}>
              {subcategory.category_ind}
            </option>
          ))}
        </select>
      </div>
    );
  }

  let indonesiaDetailsBlock;
  //if country is Indonesia, load additional inputs
  if (countryId === "5f142c0c3c69e5284cb36ffb") {
    indonesiaDetailsBlock = (
      <>
        <p>
          Asal Pengiriman produk dan pilihan kurir. Anda dapat mengatur pilihan
          default di Setting Penjualan.
        </p>
        <div className="row">
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseProvince"
                name="chooseProvince"
                value={provinceId || ""}
                required
                onChange={onChangeProvince}
              >
                <option value="">Pilih Provinsi...</option>
                {provinces.map((province) => (
                  <option
                    value={province.rajaongkir_province_id}
                    key={province.rajaongkir_province_id}
                  >
                    {province.province}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseDistrict"
                name="chooseDistrict"
                value={districtId || ""}
                required
                onChange={onChangeDistrict}
              >
                <option value="">Pilih Kota/kabupaten...</option>
                {districts.map((district) => (
                  <option
                    value={district.rajaongkir_id_district}
                    key={district.rajaongkir_id_district}
                  >
                    {district.district}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="form-group">
              <select
                id="chooseSubdistrict"
                value={subdistrictId || ""}
                name="chooseSubdistrict"
                required
                onChange={onChangeSubdistrict}
              >
                <option value="">Pilih Kecamatan...</option>
                {subdistricts.map((subdistrict) => (
                  <option
                    value={subdistrict.rajaongkir_id_subdistrict}
                    key={subdistrict.rajaongkir_id_subdistrict}
                  >
                    {subdistrict.subdistrict}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-sm-6">
            <label className="form_label">
              <strong>Regular (1-4 Hari)</strong>
            </label>
            <div className="row">
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      JNE
                      <input
                        type="checkbox"
                        name="shippingRegularJne"
                        onChange={onChangeCheck}
                        checked={shippingRegularJne}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      J&amp;T
                      <input
                        type="checkbox"
                        name="shippingRegularJnt"
                        onChange={onChangeCheck}
                        checked={shippingRegularJnt}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      SICEPAT
                      <input
                        type="checkbox"
                        name="shippingRegularSicepat"
                        onChange={onChangeCheck}
                        checked={shippingRegularSicepat}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      POS
                      <input
                        type="checkbox"
                        name="shippingRegularPos"
                        onChange={onChangeCheck}
                        checked={shippingRegularPos}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      RPX
                      <input
                        type="checkbox"
                        name="shippingRegularRpx"
                        onChange={onChangeCheck}
                        checked={shippingRegularRpx}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      WAHANA
                      <input
                        type="checkbox"
                        name="shippingRegularWahana"
                        onChange={onChangeCheck}
                        checked={shippingRegularWahana}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      NINJA
                      <input
                        type="checkbox"
                        name="shippingRegularNinja"
                        onChange={onChangeCheck}
                        checked={shippingRegularNinja}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <label className="container_cbx">
                      REX
                      <input
                        type="checkbox"
                        name="shippingRegularRex"
                        onChange={onChangeCheck}
                        checked={shippingRegularRex}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      SAP
                      <input
                        type="checkbox"
                        name="shippingRegularSap"
                        onChange={onChangeCheck}
                        checked={shippingRegularSap}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      JET
                      <input
                        type="checkbox"
                        name="shippingRegularJet"
                        onChange={onChangeCheck}
                        checked={shippingRegularJet}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      DSE
                      <input
                        type="checkbox"
                        name="shippingRegularDse"
                        onChange={onChangeCheck}
                        checked={shippingRegularDse}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      LION
                      <input
                        type="checkbox"
                        name="shippingRegularLion"
                        onChange={onChangeCheck}
                        checked={shippingRegularLion}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <label className="form_label">
              <strong>Next Day (1 Hari)</strong>
            </label>
            <div className="row">
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      JNE
                      <input
                        type="checkbox"
                        name="shippingNextDayJne"
                        onChange={onChangeCheck}
                        checked={shippingNextDayJne}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      SICEPAT
                      <input
                        type="checkbox"
                        name="shippingNextDaySicepat"
                        onChange={onChangeCheck}
                        checked={shippingNextDaySicepat}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      POS
                      <input
                        type="checkbox"
                        name="shippingNextDayPos"
                        onChange={onChangeCheck}
                        checked={shippingNextDayPos}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      RPX
                      <input
                        type="checkbox"
                        name="shippingNextDayRpx"
                        onChange={onChangeCheck}
                        checked={shippingNextDayRpx}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      REX
                      <input
                        type="checkbox"
                        name="shippingNextDayRex"
                        onChange={onChangeCheck}
                        checked={shippingNextDayRex}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      SAP
                      <input
                        type="checkbox"
                        name="shippingNextDaySap"
                        onChange={onChangeCheck}
                        checked={shippingNextDaySap}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      JET
                      <input
                        type="checkbox"
                        name="shippingNextDayJet"
                        onChange={onChangeCheck}
                        checked={shippingNextDayJet}
                      />
                      <span className="checkmark"></span>
                    </label>
                    <label className="container_cbx">
                      DSE
                      <input
                        type="checkbox"
                        name="shippingNextDayDse"
                        onChange={onChangeCheck}
                        checked={shippingNextDayDse}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="form-group">
                  <div className="checkbox_styling">
                    <label className="container_cbx">
                      LION
                      <input
                        type="checkbox"
                        name="shippingNextDayLion"
                        onChange={onChangeCheck}
                        checked={shippingNextDayLion}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Fragment>
      <h3>Buat Produk Baru</h3>
      <hr />
      <div className="details-wrap">
        <form onSubmit={onSubmit} className="form-login">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label className="form_label" htmlFor="name">
                  Nama Produk
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Tulis nama produk..."
                  required
                  value={name}
                  onChange={onNameChange}
                  maxLength="200"
                />
                <small id="emailHelp" className="form-text text-muted">
                  Maks 200 karakter ({nameCount}-200)
                </small>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label className="form_label" htmlFor="category">
                  Kategori Produk
                </label>

                <div className="row">
                  <div className="col-sm-3">
                    <select
                      style={{ textTransform: "capitalize" }}
                      name="parentcategory"
                      required
                      onChange={onChangeCategory}
                    >
                      <option value="">Pilih Kategori...</option>
                      {categories.map((category) => (
                        <option
                          value={category.categoryId}
                          key={category.categoryId}
                        >
                          {category.category_ind}
                        </option>
                      ))}
                    </select>
                  </div>
                  {subcategory1Block}
                  {subcategory2Block}
                  {subcategory3Block}
                  {subcategory4Block}
                  {subcategory5Block}
                  {subcategory6Block}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label className="form_label" htmlFor="startingPrice">
                  Harga Jual (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  name="marketplacePrice"
                  id="marketplacePrice"
                  placeholder="Isi harga jual marketplace..."
                  value={marketplacePrice}
                  onChange={onChange}
                />
              </div>

              <div className="form-group">
                <label className="form_label" htmlFor="startingPrice">
                  Harga Normal / Harga Pasaran (Rp)
                </label>
                <input
                  type="number"
                  min="0"
                  name="marketPrice"
                  id="marketPrice"
                  placeholder="Opsional. Isi harga pasaran..."
                  value={marketPrice}
                  onChange={onChange}
                />
                <small id="emailHelp" className="form-text text-muted">
                  Bila diisi, harga normal (harga pasaran) akan muncul dalam
                  bentuk coretan di sisi pengunjung. Harga normal harus lebih
                  tinggi dari harga jual.
                </small>
              </div>

              <div className="form-group">
                <label className="form_label" htmlFor="stock">
                  Stok
                </label>
                <input
                  type="number"
                  min="0"
                  name="stock"
                  id="stock"
                  placeholder="Isi stock barang..."
                  value={stock}
                  required
                  onChange={onChange}
                />
              </div>

              <Modal open={modal2IsOpen} onClose={closeModal2}>
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: "normal",
                    textAlign: "center",
                  }}
                >
                  Tabel Kelipatan Harga
                </h2>

                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Dari (Rp)</th>
                      <th>Sampai (Rp)</th>
                      <th>Kelipatan (Rp)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>0</td>
                      <td>999.999</td>
                      <td>10.000</td>
                    </tr>
                    <tr>
                      <td>1.000.000</td>
                      <td>2.499.999</td>
                      <td>20.000</td>
                    </tr>
                    <tr>
                      <td>2.500.000</td>
                      <td>4.999.999</td>
                      <td>50.000</td>
                    </tr>
                    <tr>
                      <td>5.000.000</td>
                      <td>9.999.999</td>
                      <td>100.000</td>
                    </tr>
                    <tr>
                      <td>10.000.000</td>
                      <td>24.999.999</td>
                      <td>250.000</td>
                    </tr>
                    <tr>
                      <td>25.000.000</td>
                      <td>49.999.999</td>
                      <td>500.000</td>
                    </tr>
                    <tr>
                      <td>50.000.000</td>
                      <td>-</td>
                      <td>1.000.000</td>
                    </tr>
                  </tbody>
                </table>

                <button onClick={closeModal2} style={{ float: "right" }}>
                  Tutup
                </button>
              </Modal>

              <Modal open={modal3IsOpen} onClose={closeModal3}>
                <h2
                  style={{
                    fontSize: "17px",
                    fontWeight: "normal",
                    textAlign: "center",
                  }}
                >
                  Tips Harga Awal Lelang
                </h2>
                <p>
                  Untuk meningkatkan peluang produk Kamu laku dilelang,
                  sebaiknya Kamu memasang harga awal dibawah harga jual pasaran.
                  Misalnya 75% dari harga pasaran.
                </p>
                <button onClick={closeModal3} style={{ float: "right" }}>
                  Tutup
                </button>
              </Modal>
            </div>
            <div className="col-md-6">
              {(() => {
                if (currentUser && currentUser.sellerInfo.membershipId) {
                  return (
                    <div
                      style={{
                        padding: "20px",
                        backgroundColor: "#dfdfdf",
                        marginBottom: "10px",
                      }}
                    >
                      <h4>Setting Lelang</h4>
                      <br />
                      <div className="form-group">
                        <label className="form_label" htmlFor="startingPrice">
                          Harga Awal Lelang (Rp)
                        </label>
                        &nbsp;&nbsp;
                        <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                          <Link to="#" onClick={openModal2}>
                            (Lihat Tabel Kelipatan)
                          </Link>
                        </span>
                        <input
                          type="number"
                          min="0"
                          name="startingPrice"
                          id="startingPrice"
                          placeholder="Isi harga jual awal sesuai kelipatannya..."
                          value={startingPrice}
                          onChange={onChange}
                        />
                        <label
                          className="labelInputWarning"
                          className="form_label"
                          htmlFor="startingPrice"
                          style={{ float: "left" }}
                        >
                          Harga awal produk maksimal 100 Juta
                          Rupiah.&nbsp;&nbsp;
                          <br />
                          <span
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              textAlign: "right",
                            }}
                          >
                            <Link to="#" onClick={openModal3}>
                              <i
                                className="fa fa-lightbulb-o"
                                aria-hidden="true"
                              ></i>{" "}
                              Tips Harga Awal
                            </Link>
                          </span>
                        </label>
                      </div>
                      <br />
                      <div className="form-group">
                        <label className="form_label" htmlFor="reservedPrice">
                          <br />
                          Harga Target (Rp)
                        </label>
                        <Link
                          to="#"
                          onClick={() => {
                            setIsShowHargaTargetInfo(true);
                          }}
                        >
                          <i
                            className="fa fa-lightbulb-o"
                            aria-hidden="true"
                          ></i>
                        </Link>

                        <input
                          type="number"
                          min="0"
                          name="reservedPrice"
                          id="reservedPrice"
                          placeholder="Isi target harga"
                          value={reservedPrice}
                          onChange={onChange}
                          disabled={
                            currentUser.currentToken < reservedPriceToken
                          }
                        />
                        <label
                          className="labelInputWarning"
                          className="form_label"
                          htmlFor="reservedPrice"
                          style={{ float: "left" }}
                        >
                          Butuh {reservedPriceToken} token. Token Anda:{" "}
                          {currentUser.currentToken}.{" "}
                          <Link to="/akun/oketoken">Tambah Token.</Link>
                          &nbsp;&nbsp;
                          <br />
                        </label>
                      </div>
                      <Modal
                        open={isShowHargaTargetInfo}
                        onClose={() => {
                          setIsShowHargaTargetInfo(false);
                        }}
                      >
                        <h2
                          style={{
                            fontSize: "17px",
                            fontWeight: "normal",
                            textAlign: "center",
                          }}
                        >
                          Tips Harga Target
                        </h2>
                        <p>
                          Anda dapat memasang harga target untuk produk ini,
                          yaitu harga terendah yang mau Anda lepas. Bila lelang
                          telah berakhir dan harga bid belum mencapai harga ini,
                          Anda tidak perlu melepas produk ini. Kosongkan kotak
                          isian bila tidak mau digunakan.
                          <br />
                          Token yang dibutuhkan: {reservedPriceToken}
                        </p>
                        <p>
                          Harga target harus 30% lebih tinggi dari harga lelang
                          awal.
                        </p>
                        <button
                          onClick={() => {
                            setIsShowHargaTargetInfo(false);
                          }}
                          style={{ float: "right" }}
                        >
                          Tutup
                        </button>
                      </Modal>
                      <br />
                      <div className="form-group">
                        <br />
                        <label className="form_label" htmlFor="duration">
                          Jangka Waktu Lelang
                        </label>
                        <select
                          name="duration"
                          value={duration}
                          onChange={onChange}
                        >
                          <option value="">Pilih Jangka Waktu Lelang...</option>
                          {/* {(() => {
                            if (process.env.NODE_ENV === 'development') {
                              return (
                                <option value='2menit'>
                                  2 menit (utk beta testing saja)
                                </option>
                              );
                            }
                          })()} */}
                          <option value="2menit">
                            2 menit (utk beta testing saja)
                          </option>
                          <option value="5menit">
                            5 menit (utk beta testing saja)
                          </option>
                          <option value="10menit">
                            10 menit (utk beta testing saja)
                          </option>
                          {/* <option value="15menit">
                            15 menit (utk beta testing saja)
                          </option> */}
                          <option value="1">1 hari</option>
                          <option value="2">2 hari</option>
                          <option value="3">3 hari</option>
                          <option value="5">5 hari</option>
                          <option value="7">7 hari</option>
                        </select>
                      </div>
                    </div>
                  );
                }
              })()}

              <div className="form-group">
                <label className="form_label" htmlFor="condition">
                  Kondisi Produk
                </label>
                <select
                  name="condition"
                  required
                  value={condition}
                  onChange={onChange}
                >
                  <option value="">Pilih Kondisi Produk...</option>
                  <option value="baru">Baru</option>
                  <option value="bekas">Bekas</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form_label" htmlFor="weight">
                  Berat Produk &amp; kemasan (Gram)
                </label>
                <input
                  type="number"
                  name="weight"
                  placeholder="Isi berat produk dalam gram..."
                  required
                  value={weight}
                  onChange={onChange}
                />
              </div>
            </div>

            <div className="col-md-12">
              <br />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setIsVariant(!isVariant);
                }}
                className="btn btn-primary"
              >
                {isVariant
                  ? "HAPUS VARIAN PRODUK"
                  : "TAMBAH VARIAN PRODUK (OPSIONAL)"}
              </button>
              <br />
            </div>
            {isVariant && (
              <AddVariant
                productCombinations={productCombinations}
                setProductCombinations={setProductCombinations}
                variantDetails1={variantDetails1}
                setVariantDetails1={setVariantDetails1}
                variantDetails2={variantDetails2}
                setVariantDetails2={setVariantDetails2}
              />
            )}

            <div className="col-md-12">
              <br />
              <div className="form-group">
                <label className="form_label" htmlFor="description">
                  Deskripsi Produk (Mohon mengisi dengan akurat dan lengkap,
                  untuk menghindari komplain)
                </label>
                <textarea
                  name="description"
                  rows="10"
                  value={description}
                  onChange={onDescriptionChange}
                  required
                  maxLength="2000"
                ></textarea>
                <small id="emailHelp" className="form-text text-muted">
                  Maks 2000 karakter ({descriptionCount}-2000)
                </small>
              </div>
            </div>
            <div className="col-md-12">
              <p>
                <label>Gambar produk (Maksimal 6 gambar)</label>
              </p>
            </div>
            <div
              className="row"
              style={{ paddingLeft: "15px", scrollPaddingRight: "15px" }}
            >
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview1" alt=""></img>
                <br />
                {(() => {
                  if (image1) {
                    return (
                      <button
                        id="delete1"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 1
                      </button>
                    );
                  }
                })()}
              </div>
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview2" alt=""></img>
                <br />
                {(() => {
                  if (image2) {
                    return (
                      <button
                        id="delete2"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 2
                      </button>
                    );
                  }
                })()}
              </div>
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview3" alt=""></img>
                <br />
                {(() => {
                  if (image3) {
                    return (
                      <button
                        id="delete3"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 3
                      </button>
                    );
                  }
                })()}
              </div>
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview4" alt=""></img>
                <br />
                {(() => {
                  if (image4) {
                    return (
                      <button
                        id="delete4"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 4
                      </button>
                    );
                  }
                })()}
              </div>
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview5" alt=""></img>
                <br />
                {(() => {
                  if (image5) {
                    return (
                      <button
                        id="delete5"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 5
                      </button>
                    );
                  }
                })()}
              </div>
              <div className="col-xs-4" style={{ marginTop: "0px" }}>
                <img style={{ width: "100px" }} id="preview6" alt=""></img>
                <br />
                {(() => {
                  if (image6) {
                    return (
                      <button
                        id="delete6"
                        onClick={onDeletePreviewImage}
                        className="btn btn-default"
                      >
                        Hapus 6
                      </button>
                    );
                  }
                })()}
              </div>
            </div>
            <div
              className="row"
              style={{ paddingLeft: "15px", paddingRight: "15px" }}
            >
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 1 (Cover)</label>
                  <input
                    type="file"
                    name="file1"
                    id="file1"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 2</label>
                  <input
                    type="file"
                    name="file2"
                    id="file2"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 3</label>
                  <input
                    type="file"
                    name="file3"
                    id="file3"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 4</label>
                  <input
                    type="file"
                    name="file4"
                    id="file4"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 5</label>
                  <input
                    type="file"
                    name="file5"
                    id="file5"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
              <div className="col-xs-6 col-6">
                <div className="form-group">
                  <label>Gambar 6</label>
                  <input
                    type="file"
                    name="file6"
                    id="file6"
                    onChange={onChangeImage}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <h3>Asal Pengiriman Produk</h3>
              <hr />
              <p>Produk dikirim dari:</p>
              <div className="row">
                <div className="col-sm-12" style={{ paddingBottom: "15px" }}>
                  <label className="form_label" htmlFor="countryId">
                    Pilih Negara
                  </label>
                  <select
                    id="countryId"
                    name="countryId"
                    value={countryId || ""}
                    required
                    onChange={onChange}
                  >
                    <option value="">Pilih Negara...</option>
                    {countries.map((country) => (
                      <option value={country._id} key={country._id}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {indonesiaDetailsBlock}
              <br />
              <div
                style={{
                  padding: "15px",
                  background: "#c8ffc2",
                  marginBottom: "30px",
                }}
              >
                {(() => {
                  if (currentUser && currentUser.sellerInfo.membershipId) {
                    return (
                      <div className="form-group">
                        <label className="container_cbx">
                          Saya setuju Okebid akan mengenakan biaya transaksi X%
                          dari harga jual akhir.
                          <input
                            type="checkbox"
                            name="agreeCommission"
                            onChange={onChangeCheck}
                            checked={agreeCommission}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    );
                  }
                })()}
                <div className="form-group">
                  <label className="container_cbx">
                    Saya setuju produk ini sudah sesuai dengan{" "}
                    <Link to="/syarat-ketentuan" target="_blank">
                      Syarat dan Ketentuan Okebid
                    </Link>
                    . Produk yang melanggar syarat dan ketentuan akan
                    dinon-aktifkan oleh tim Okebid.
                    <input
                      type="checkbox"
                      name="agreeToc"
                      onChange={onChangeCheck}
                      checked={agreeToc}
                    />
                    <span className="checkmark"></span>
                  </label>
                </div>
              </div>
            </div>

            {(() => {
              if (loadSpinner) {
                return (
                  <div className="col-md-12" style={{ textAlign: "center" }}>
                    <Loader
                      type="ThreeDots"
                      color="green"
                      height={100}
                      width={100}
                    />
                    <p>Mohon tunggu, sedang menyimpan...</p>
                  </div>
                );
              }
            })()}
            {(() => {
              if (!loadSpinner) {
                return (
                  <div className="col-md-12">
                    {(() => {
                      if (currentUser && currentUser.sellerInfo.membershipId) {
                        return (
                          <>
                            <input
                              type="submit"
                              style={{ fontWeight: "bold" }}
                              value="SIMPAN DAN AKTIFKAN LELANG"
                              className="btn btn-success custom-class"
                              onClick={onClickSimpanAktif}
                            />
                            &nbsp;&nbsp;&nbsp;
                          </>
                        );
                      }
                    })()}
                    <br />
                    <button
                      type="submit"
                      className="my_button"
                      onClick={onClickSimpanMarketplaceAktif}
                    >
                      SIMPAN &amp; AKTIFKAN MARKETPLACE{" "}
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                      type="submit"
                      className="my_button buttonGray"
                      onClick={onClickSimpanDraft}
                    >
                      SIMPAN SEBAGAI DRAFT{" "}
                    </button>
                  </div>
                );
              }
            })()}
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default AddProduct;
