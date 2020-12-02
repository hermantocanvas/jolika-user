import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import imageCompression from "browser-image-compression";
import { confirmAlert } from "react-confirm-alert";
import Modal from "react-responsive-modal";

import SubcategoryBlock from "./SubcategoryBlock";
import AccountMenu from "../../AccountMenu";
import AlertContext from "../../../../context/alert/alertContext";
import AuthContext from "../../../../context/auth/authContext";

const formatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const EditProduct = ({ match }) => {
  const { setAlert } = useContext(AlertContext);
  const { currentUser } = useContext(AuthContext);
  const [formState, setFormState] = useState({
    name: "",
    categoryId: "",
    description: "",
  });
  const [agreements, setAgreements] = useState({
    commission: false,
    toc: false,
  });
  const [submitType, setSubmitType] = useState("");
  const [product, setProduct] = useState(null);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories1, setSubcategories1] = useState([]);
  const [subCategories2, setSubcategories2] = useState([]);
  const [subCategories3, setSubcategories3] = useState([]);
  const [subCategories4, setSubcategories4] = useState([]);
  const [subCategories5, setSubcategories5] = useState([]);
  const [subCategories6, setSubcategories6] = useState([]);
  const [isShowKelipatan, setIsShowKelipatan] = useState(false);
  const [isShowTipsHargaAwal, setIsShowTipsHargaAwal] = useState(false);
  const [isShowHargaTargetInfo, setIsShowHargaTargetInfo] = useState(false);
  const [loadings, setLoadings] = useState({ save: false });
  const [newImage, setNewImage] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: "",
    image6: "",
  });
  //to handle existing images
  const [image, setImage] = useState({
    files: [],
  });
  const [reservedPriceToken, setReservedPriceToken] = useState("");

  useEffect(() => {
    loadProduct();
  }, []);

  useEffect(() => {
    if (product) {
      loadReservedPriceToken();
      loadCategories();
      loadCountries();
      loadProvinces();
      setFormState(product);
      setImage({
        files: product.imagesName,
      });
      setNewImage({
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        image6: "",
      });
      setImage({
        files: product.imagesName,
      });
    }
    setAgreements({ toc: false, commission: false });
  }, [product]);

  useEffect(() => {
    if (formState.categoryId) {
      loadSubcategories1(formState.categoryId);
    }

    setSubcategories1([]);
  }, [formState.categoryId]);

  useEffect(() => {
    if (formState.subcategory1Id) {
      loadSubcategories2(formState.subcategory1Id);
    }

    setSubcategories2([]);
  }, [formState.subcategory1Id]);

  useEffect(() => {
    if (formState.subcategory2Id) {
      loadSubcategories3(formState.subcategory2Id);
    }

    setSubcategories3([]);
  }, [formState.subcategory2Id]);

  useEffect(() => {
    if (formState.subcategory3Id) {
      loadSubcategories4(formState.subcategory3Id);
    }

    setSubcategories4([]);
  }, [formState.subcategory3Id]);

  useEffect(() => {
    if (formState.subcategory4Id) {
      loadSubcategories5(formState.subcategory4Id);
    }

    setSubcategories5([]);
  }, [formState.subcategory4Id]);

  useEffect(() => {
    if (formState.subcategory5Id) {
      loadSubcategories6(formState.subcategory5Id);
    }

    setSubcategories6([]);
  }, [formState.subcategory5Id]);

  useEffect(() => {
    if (categories) {
      const isExists = categories.find(
        (c) => c.categoryId === formState.categoryId
      );
      if (!isExists) {
        setFormState({ ...formState, categoryId: "" });
      }
    }
  }, [categories]);

  useEffect(() => {
    if (subCategories1) {
      const isExists = subCategories1.find(
        (c) => c.categoryId === formState.subcategory1Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory1Id: "" });
      }
    }
  }, [subCategories1]);

  useEffect(() => {
    if (subCategories2) {
      const isExists = subCategories2.find(
        (c) => c.categoryId === formState.subcategory2Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory2Id: "" });
      }
    }
  }, [subCategories2]);

  useEffect(() => {
    if (subCategories3) {
      const isExists = subCategories3.find(
        (c) => c.categoryId === formState.subcategory3Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory3Id: "" });
      }
    }
  }, [subCategories3]);

  useEffect(() => {
    if (subCategories4) {
      const isExists = subCategories4.find(
        (c) => c.categoryId === formState.subcategory4Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory4Id: "" });
      }
    }
  }, [subCategories4]);

  useEffect(() => {
    if (subCategories5) {
      const isExists = subCategories5.find(
        (c) => c.categoryId === formState.subcategory5Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory5Id: "" });
      }
    }
  }, [subCategories5]);

  useEffect(() => {
    if (subCategories6) {
      const isExists = subCategories6.find(
        (c) => c.categoryId === formState.subcategory6Id
      );
      if (!isExists) {
        setFormState({ ...formState, subcategory6Id: "" });
      }
    }
  }, [subCategories6]);

  useEffect(() => {
    if (formState.provinceId) {
      loadDistricts(formState.provinceId);
    }
    setSubdistricts([]);
  }, [formState.provinceId]);

  useEffect(() => {
    if (formState.districtId) {
      loadSubdistricts(formState.districtId);
    }
  }, [formState.districtId]);

  const onFormStateChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const onChangeAgreements = (e) =>
    setAgreements({ ...agreements, [e.target.name]: e.target.checked });

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

  const loadProduct = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/user/${match.params.id}`
      );
      setProduct(res.data.data);
    } catch (error) {}
  };

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

  async function loadSubcategories1(categoryId) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories1/${categoryId}`
      );
      setSubcategories1(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategories2(subcategory1Id) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories2/${subcategory1Id}`
      );
      setSubcategories2(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategories3(subcategory2Id) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories3/${subcategory2Id}`
      );
      setSubcategories3(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategories4(subcategory3Id) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories4/${subcategory3Id}`
      );
      setSubcategories4(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategories5(subcategory4Id) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories5/${subcategory4Id}`
      );
      setSubcategories5(res.data.data);
    } catch (err) {
      setAlert(err.message, "danger");
    }
  }

  async function loadSubcategories6(subcategory5Id) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories6/${subcategory5Id}`
      );
      setSubcategories6(res.data.data);
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

  const onChangeCheck = (e) =>
    setFormState({ ...formState, [e.target.name]: e.target.checked });

  const onDeleteImage = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Yakin gambar mau dihapus ?");
    if (confirmDelete) {
      try {
        const res = await axios.put(
          `${process.env.REACT_APP_APIURL}api/v1/products/image/${product._id}/${e.target.id}`
        );

        setProduct(res.data.data);

        setAlert("Gambar produk berhasil dihapus.", "success");
      } catch (err) {
        setAlert(err.message, "danger");
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
        setNewImage({
          ...newImage,
          image1: "",
        });
        break;
      case "delete2":
        document.getElementById(`preview2`).setAttribute("src", "");
        document.getElementById(`file2`).value = null;
        setNewImage({
          ...newImage,
          image2: "",
        });
        break;
      case "delete3":
        document.getElementById(`preview3`).setAttribute("src", "");
        document.getElementById(`file3`).value = null;
        setNewImage({
          ...newImage,
          image3: "",
        });
        break;
      case "delete4":
        document.getElementById(`preview4`).setAttribute("src", "");
        document.getElementById(`file4`).value = null;
        setNewImage({
          ...newImage,
          image4: "",
        });
        break;
      case "delete5":
        document.getElementById(`preview5`).setAttribute("src", "");
        document.getElementById(`file5`).value = null;
        setNewImage({
          ...newImage,
          image5: "",
        });
        break;
      case "delete6":
        document.getElementById(`preview6`).setAttribute("src", "");
        document.getElementById(`file6`).value = null;
        setNewImage({
          ...newImage,
          image6: "",
        });
        break;
      default:
        break;
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
            setNewImage({
              ...newImage,
              image1: compressedFile,
            });
            break;
          case "file2":
            setNewImage({
              ...newImage,
              image2: compressedFile,
            });
            break;
          case "file3":
            setNewImage({
              ...newImage,
              image3: compressedFile,
            });
            break;
          case "file4":
            setNewImage({
              ...newImage,
              image4: compressedFile,
            });
            break;
          case "file5":
            setNewImage({
              ...newImage,
              image5: compressedFile,
            });
            break;
          case "file6":
            setNewImage({
              ...newImage,
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

  const checkStartingPrice = () => {
    //check the input price if modulus is 0
    let bidStep;
    let isPriceCorrect = true;
    if (
      formState.marketPrice !== "" &&
      parseInt(formState.marketPrice) <= parseInt(formState.startingPrice)
    ) {
      setAlert(
        "Harga normal/pasaran harus lebih tinggi dari harga jual/lelang.",
        "danger"
      );
      return false;
    }

    if (
      formState.reservedPrice !== null &&
      parseInt(formState.reservedPrice) <=
        parseInt(formState.startingPrice + (30 / 100) * formState.startingPrice)
    ) {
      setAlert(
        "Harga target harus 30% lebih tinggi dari harga lelang awal",
        "danger"
      );
      return false;
    }

    if (formState.startingPrice > 100000000) {
      setAlert("Harga awal produk maksimal 100 Juta Rupiah", "danger");
      return false;
    }

    if (formState.startingPrice && formState.startingPrice <= 999999) {
      bidStep = 10000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan Rp ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (
      formState.startingPrice &&
      formState.startingPrice > 999999 &&
      formState.startingPrice <= 2499999
    ) {
      bidStep = 20000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (
      formState.startingPrice &&
      formState.startingPrice > 2499999 &&
      formState.startingPrice <= 4999999
    ) {
      bidStep = 50000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (
      formState.startingPrice &&
      formState.startingPrice > 4999999 &&
      formState.startingPrice <= 9999999
    ) {
      bidStep = 100000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (
      formState.startingPrice &&
      formState.startingPrice > 9999999 &&
      formState.startingPrice <= 24999999
    ) {
      bidStep = 250000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (
      formState.startingPrice &&
      formState.startingPrice > 24999999 &&
      formState.startingPrice <= 49999999
    ) {
      bidStep = 500000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    if (formState.startingPrice && formState.startingPrice > 49999999) {
      bidStep = 1000000;
      if (formState.startingPrice % bidStep !== 0) {
        isPriceCorrect = false;
        setAlert(
          `Mohon mengisi harga awal produk sesuai kelipatan ${formatter.format(
            bidStep
          )}`,
          "danger"
        );
        document.getElementById("startingPrice").focus();
        return false;
      }
    }
    return true;
  };

  const checkForm = () => {
    // const phoneRegex =
    //   "(\\()?(\\+62|62|0|8)(\\d{2,3})?\\)?[ .-]?\\d{2,4}[ .-]?\\d{2,4}[ .-]?\\d{2,4}";
    // const emailRegex = "^[^@]+@[^@]+\\.[^@]+$";

    if (
      formState.categoryId === "" ||
      formState.condition === "" ||
      formState.description === "" ||
      formState.marketplacePrice === "" ||
      formState.weight === "" ||
      formState.countryId === "" ||
      formState.provinceId === "" ||
      formState.districtId === "" ||
      formState.subdistrictId === ""
    ) {
      setAlert("Mohon mengisi field yang diharuskan", "danger");
      return false;
    }

    // if (
    //   formState.description.match(phoneRegex) !== null ||
    //   formState.name.match(phoneRegex) !== null
    // ) {
    //   setAlert(
    //     "Nama barang dan deskripsi tidak boleh mengandung nomor hp/telepon.",
    //     "danger"
    //   );
    //   return false;
    // }

    // if (
    //   formState.description.match(emailRegex) !== null ||
    //   formState.name.match(emailRegex) !== null
    // ) {
    //   setAlert(
    //     "Nama barang dan deskripsi tidak boleh mengandung email.",
    //     "danger"
    //   );
    //   return false;
    // }

    if (agreements.toc === false) {
      setAlert("Mohon menyetujui Syarat dan Ketentuan Okebid", "danger");
      // } else if (agreeCommission === false) {
      //   setAlert(
      //     "Mohon menyetujui biaya transaksi X% dari harga jual akhir",
      //     "danger"
      //   );
      return false;
    }
    if (formState.shippingRegularJne.checked === false) {
      setAlert("Shipping regular harus diisi", "danger");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!checkForm()) return;

    if (submitType === "auction" && checkStartingPrice()) {
      if (formState.stock < 2) {
        setAlert("Minimal stok harus 2", "danger");
        return false;
      }

      if (
        formState.reservedPrice !== null &&
        parseInt(formState.reservedPrice) <=
          parseInt(
            formState.startingPrice + (30 / 100) * formState.startingPrice
          )
      ) {
        setAlert(
          "Harga target harus 30% lebih tinggi dari harga lelang awal",
          "danger"
        );
        return false;
      }

      if (
        formState.reservedPrice > 0 &&
        currentUser.currentToken < reservedPriceToken
      ) {
        setAlert(
          "Token tidak cukup untuk mengaktifkan Harga Target. Silahkan tambah token.",
          "danger"
        );
        return false;
      }

      confirmAlert({
        title: "Aktifkan Lelang?",
        message: `Pastikan Stok Tersedia. Produk Tidak Bisa diedit selama masa lelang. Sudah yakin mau diaktifkan?`,
        buttons: [
          {
            label: "Ya",
            onClick: () => saveAuction(),
          },
          {
            label: "Tidak",
            // onClick: () => console.log("Cancel Auction..."),
          },
        ],
      });
      return;
    }

    if (submitType === "marketplace") {
      confirmAlert({
        title: "Aktifkan Produk Marketplace?",
        message: `Pastikan Stok Tersedia. Sudah yakin mau diaktifkan?`,
        buttons: [
          {
            label: "Ya",
            onClick: () => saveMarketplace(),
          },
          {
            label: "Tidak",
            // onClick: () => console.log("Cancel marketplace active..."),
          },
        ],
      });
    }

    if (submitType === "draftMarketplace") {
      saveDraftMarketplace();
    }
  };

  const saveAuction = async () => {
    setLoadings({ ...loadings, save: true });

    let formData = new FormData();

    if (newImage.image1) {
      formData.append("files", newImage.image1);
    }
    if (newImage.image2) {
      formData.append("files", newImage.image2);
    }
    if (newImage.image3) {
      formData.append("files", newImage.image3);
    }
    if (newImage.image4) {
      formData.append("files", newImage.image4);
    }
    if (newImage.image5) {
      formData.append("files", newImage.image5);
    }
    if (newImage.image6) {
      formData.append("files", newImage.image6);
    }

    formData.append("name", formState.name);
    formData.append("bidStatus", "aktif");
    formData.append("marketplaceStatus", product.marketplaceStatus);
    formData.append("categoryId", formState.categoryId);

    if (formState.subcategory1Id) {
      formData.append("subcategory1", formState.subcategory1Id);
    }

    if (formState.subcategory2Id) {
      formData.append("subcategory2", formState.subcategory2Id);
    }

    if (formState.subcategory3Id) {
      formData.append("subcategory3", formState.subcategory3Id);
    }

    if (formState.subcategory4Id) {
      formData.append("subcategory4", formState.subcategory4Id);
    }

    if (formState.subcategory5Id) {
      formData.append("subcategory5", formState.subcategory5Id);
    }

    if (formState.subcategory6Id) {
      formData.append("subcategory6", formState.subcategory6Id);
    }

    formData.append("condition", formState.condition);
    formData.append("description", formState.description);
    formData.append("duration", formState.duration);
    formData.append("startingPrice", formState.startingPrice);
    if (formState.reservedPrice) {
      formData.append("reservedPrice", formState.reservedPrice);
    }
    formData.append("marketPrice", formState.marketPrice);
    formData.append("marketplacePrice", formState.marketplacePrice);
    formData.append("stock", formState.stock);
    formData.append("shippingRegularJne", formState.shippingRegularJne);
    formData.append("shippingRegularJnt", formState.shippingRegularJnt);
    formData.append("shippingRegularSicepat", formState.shippingRegularSicepat);
    formData.append("shippingRegularPos", formState.shippingRegularPos);
    formData.append("shippingRegularRpx", formState.shippingRegularRpx);
    formData.append("shippingRegularWahana", formState.shippingRegularWahana);
    formData.append("shippingRegularNinja", formState.shippingRegularNinja);
    formData.append("shippingRegularRex", formState.shippingRegularRex);
    formData.append("shippingRegularSap", formState.shippingRegularSap);
    formData.append("shippingRegularJet", formState.shippingRegularJet);
    formData.append("shippingRegularDse", formState.shippingRegularDse);
    formData.append("shippingRegularLion", formState.shippingRegularLion);
    formData.append("shippingNextDayJne", formState.shippingNextDayJne);
    formData.append("shippingNextDaySicepat", formState.shippingNextDaySicepat);
    formData.append("shippingNextDayPos", formState.shippingNextDayPos);
    formData.append("shippingNextDayRpx", formState.shippingNextDayRpx);
    formData.append("shippingNextDayRex", formState.shippingNextDayRex);
    formData.append("shippingNextDaySap", formState.shippingNextDaySap);
    formData.append("shippingNextDayJet", formState.shippingNextDayJet);
    formData.append("shippingNextDayDse", formState.shippingNextDayDse);
    formData.append("shippingNextDayLion", formState.shippingNextDayLion);

    formData.append("weight", formState.weight);
    // formData.append("imagesName", []);
    formData.append("slug", "");
    formData.append("countryId", formState.countryId);
    formData.append("provinceId", formState.provinceId);
    formData.append("districtId", formState.districtId);
    formData.append("subdistrictId", formState.subdistrictId);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_APIURL}api/v1/products/${match.params.id}/auction`,
        formData
      );

      setProduct(res.data.data);

      for (let i = 1; i <= 6; i++) {
        document.getElementById(`preview${i}`).setAttribute("src", "");
      }
      //reset input file
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`file${i}`).value = null;
      }

      setLoadings({ ...loadings, save: false });
      setAlert("Produk berhasil dibuat.", "success");
    } catch (err) {
      setLoadings({ ...loadings, save: false });
      setAlert(err.message, "danger");
    }
  };

  const saveMarketplace = async (marketplaceStatus = "aktif") => {
    setLoadings({ ...loadings, save: true });

    let formData = new FormData();

    if (newImage.image1) {
      formData.append("files", newImage.image1);
    }
    if (newImage.image2) {
      formData.append("files", newImage.image2);
    }
    if (newImage.image3) {
      formData.append("files", newImage.image3);
    }
    if (newImage.image4) {
      formData.append("files", newImage.image4);
    }
    if (newImage.image5) {
      formData.append("files", newImage.image5);
    }
    if (newImage.image6) {
      formData.append("files", newImage.image6);
    }

    formData.append("name", formState.name);
    formData.append("marketplaceStatus", marketplaceStatus);
    formData.append("categoryId", formState.categoryId);

    if (formState.subcategory1Id) {
      formData.append("subcategory1", formState.subcategory1Id);
    }

    if (formState.subcategory2Id) {
      formData.append("subcategory2", formState.subcategory2Id);
    }

    if (formState.subcategory3Id) {
      formData.append("subcategory3", formState.subcategory3Id);
    }

    if (formState.subcategory4Id) {
      formData.append("subcategory4", formState.subcategory4Id);
    }

    if (formState.subcategory5Id) {
      formData.append("subcategory5", formState.subcategory5Id);
    }

    if (formState.subcategory6Id) {
      formData.append("subcategory6", formState.subcategory6Id);
    }

    formData.append("condition", formState.condition);
    formData.append("description", formState.description);
    formData.append("marketplacePrice", formState.marketplacePrice);
    formData.append("marketPrice", formState.marketPrice);
    formData.append("shippingRegularJne", formState.shippingRegularJne);
    formData.append("shippingRegularJnt", formState.shippingRegularJnt);
    formData.append("shippingRegularSicepat", formState.shippingRegularSicepat);
    formData.append("shippingRegularPos", formState.shippingRegularPos);
    formData.append("shippingRegularRpx", formState.shippingRegularRpx);
    formData.append("shippingRegularWahana", formState.shippingRegularWahana);
    formData.append("shippingRegularNinja", formState.shippingRegularNinja);
    formData.append("shippingRegularRex", formState.shippingRegularRex);
    formData.append("shippingRegularSap", formState.shippingRegularSap);
    formData.append("shippingRegularJet", formState.shippingRegularJet);
    formData.append("shippingRegularDse", formState.shippingRegularDse);
    formData.append("shippingRegularLion", formState.shippingRegularLion);
    formData.append("shippingNextDayJne", formState.shippingNextDayJne);
    formData.append("shippingNextDaySicepat", formState.shippingNextDaySicepat);
    formData.append("shippingNextDayPos", formState.shippingNextDayPos);
    formData.append("shippingNextDayRpx", formState.shippingNextDayRpx);
    formData.append("shippingNextDayRex", formState.shippingNextDayRex);
    formData.append("shippingNextDaySap", formState.shippingNextDaySap);
    formData.append("shippingNextDayJet", formState.shippingNextDayJet);
    formData.append("shippingNextDayDse", formState.shippingNextDayDse);
    formData.append("shippingNextDayLion", formState.shippingNextDayLion);
    formData.append("weight", formState.weight);
    formData.append("stock", formState.stock);
    formData.append("slug", "");
    formData.append("countryId", formState.countryId);
    formData.append("provinceId", formState.provinceId);
    formData.append("districtId", formState.districtId);
    formData.append("subdistrictId", formState.subdistrictId);

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_APIURL}api/v1/products/marketplace/${match.params.id}`,
        formData
      );

      setProduct(res.data.data);

      for (let i = 1; i <= 6; i++) {
        document.getElementById(`preview${i}`).setAttribute("src", "");
      }
      //reset input file
      for (let i = 1; i <= 6; i++) {
        document.getElementById(`file${i}`).value = null;
      }

      setLoadings({ ...loadings, save: false });
      setAlert("Produk berhasil dibuat.", "success");
    } catch (err) {
      setLoadings({ ...loadings, save: false });
      setAlert(err.message, "danger");
    }
  };

  const saveDraftMarketplace = async () => {
    saveMarketplace("tidak aktif");
  };

  if (!product || !currentUser) return null;

  if (newImage.image1) {
    document
      .getElementById("preview1")
      .setAttribute("src", URL.createObjectURL(newImage.image1));
  }
  if (newImage.image2) {
    document
      .getElementById(`preview2`)
      .setAttribute("src", URL.createObjectURL(newImage.image2));
  }
  if (newImage.image3) {
    document
      .getElementById(`preview3`)
      .setAttribute("src", URL.createObjectURL(newImage.image3));
  }
  if (newImage.image4) {
    document
      .getElementById(`preview4`)
      .setAttribute("src", URL.createObjectURL(newImage.image4));
  }
  if (newImage.image5) {
    document
      .getElementById(`preview5`)
      .setAttribute("src", URL.createObjectURL(newImage.image5));
  }
  if (formState.image6) {
    document
      .getElementById(`preview6`)
      .setAttribute("src", URL.createObjectURL(formState.image6));
  }

  return (
    <section className="page-section">
      <div className="wrap container">
        <div className="row">
          <AccountMenu />
          <div className="col-lg-9 col-md-9 col-sm-8">
            <h3>Edit Produk : {product.name}</h3>
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
                        value={formState.name}
                        onChange={onFormStateChange}
                        maxLength="200"
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        Maks 200 karakter ({formState.name.length}-200)
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
                          <SubcategoryBlock
                            value={formState.categoryId}
                            name="categoryId"
                            onChange={onFormStateChange}
                            subcategories={categories}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory1Id}
                            name="subcategory1Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories1}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory2Id}
                            name="subcategory2Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories2}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory3Id}
                            name="subcategory3Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories3}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory4Id}
                            name="subcategory4Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories4}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory5Id}
                            name="subcategory5Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories5}
                          />
                        </div>
                        <div className="col-sm-3">
                          <SubcategoryBlock
                            value={formState.subcategory6Id}
                            name="subcategory6Id"
                            onChange={onFormStateChange}
                            subcategories={subCategories6}
                          />
                        </div>
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
                        value={formState.marketplacePrice}
                        onChange={onFormStateChange}
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
                        value={formState.marketPrice}
                        onChange={onFormStateChange}
                      />
                      <small id="emailHelp" className="form-text text-muted">
                        Bila diisi, harga normal (harga pasaran) akan muncul
                        dalam bentuk coretan di sisi pengunjung. Harga normal
                        harus lebih tinggi dari harga jual.
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
                        value={formState.stock}
                        required
                        onChange={onFormStateChange}
                      />
                    </div>
                    <div>
                      <br />
                      <Link
                        to={`/akun-edit-variant-produk/${product._id}`}
                        className="btn btn-primary"
                      >
                        EDIT/TAMBAH VARIAN PRODUK
                      </Link>
                      <br />
                      <br />
                    </div>
                  </div>
                  <div className="col-md-6">
                    {currentUser && currentUser.sellerInfo.membershipId && (
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
                          <span
                            style={{ fontSize: "14px", fontWeight: "bold" }}
                          >
                            <Link
                              to="#"
                              onClick={() => {
                                setIsShowKelipatan(true);
                              }}
                            >
                              (Lihat Tabel Kelipatan)
                            </Link>
                          </span>
                          <input
                            type="number"
                            min="0"
                            name="startingPrice"
                            id="startingPrice"
                            placeholder="Isi harga jual awal sesuai kelipatannya..."
                            value={formState.startingPrice}
                            onChange={onFormStateChange}
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
                              <Link
                                to="#"
                                onClick={() => {
                                  setIsShowTipsHargaAwal(true);
                                }}
                              >
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
                          <br />
                          <label className="form_label" htmlFor="duration">
                            Jangka Waktu Lelang
                          </label>
                          <select
                            name="duration"
                            value={formState.duration}
                            onChange={onFormStateChange}
                          >
                            <option value="">
                              Pilih Jangka Waktu Lelang...
                            </option>
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
                        <br />
                        <div className="form-group">
                          <label className="form_label" htmlFor="reservedPrice">
                            Harga Target (Rp){" "}
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
                          </label>
                          <input
                            type="number"
                            min="0"
                            name="reservedPrice"
                            id="reservedPrice"
                            placeholder="Isi target harga"
                            value={formState.reservedPrice}
                            onChange={onFormStateChange}
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
                        <br />
                      </div>
                    )}
                    <div className="form-group">
                      <label className="form_label" htmlFor="condition">
                        Kondisi Produk
                      </label>
                      <select
                        name="condition"
                        required
                        value={formState.condition}
                        onChange={onFormStateChange}
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
                        value={formState.weight}
                        onChange={onFormStateChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="form_label" htmlFor="description">
                        Deskripsi Produk (Mohon mengisi dengan akurat dan
                        lengkap, untuk menghindari komplain)
                      </label>
                      <textarea
                        name="description"
                        rows="10"
                        value={formState.description}
                        onChange={onFormStateChange}
                        required
                        maxLength="2000"
                      ></textarea>
                      <small id="emailHelp" className="form-text text-muted">
                        Maks 2000 karakter ({formState.description.length}-2000)
                      </small>
                    </div>
                  </div>

                  {image.files && image.files.length > 0 && (
                    <div className="col-md-12">
                      <p>Gambar produk Sekarang</p>
                      {image.files.map((file, index) => (
                        <div style={{ float: "left" }} key={index}>
                          <img
                            src={`${process.env.REACT_APP_APIURL}uploads/products/thumbnails/${file}`}
                            alt=""
                            style={{ width: "100px", marginRight: "5px" }}
                          />
                          <br />
                          {product.bidStatus !== "aktif" && (
                            <button
                              id={index}
                              onClick={onDeleteImage}
                              className="btn btn-default"
                            >
                              Hapus
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

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
                      <img
                        style={{ width: "100px" }}
                        id="preview1"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image1 && (
                        <button
                          id="delete1"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 1
                        </button>
                      )}
                    </div>
                    <div className="col-xs-4" style={{ marginTop: "0px" }}>
                      <img
                        style={{ width: "100px" }}
                        id="preview2"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image2 && (
                        <button
                          id="delete2"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 2
                        </button>
                      )}
                    </div>
                    <div className="col-xs-4" style={{ marginTop: "0px" }}>
                      <img
                        style={{ width: "100px" }}
                        id="preview3"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image3 && (
                        <button
                          id="delete3"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 3
                        </button>
                      )}
                    </div>
                    <div className="col-xs-4" style={{ marginTop: "0px" }}>
                      <img
                        style={{ width: "100px" }}
                        id="preview4"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image4 && (
                        <button
                          id="delete4"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 4
                        </button>
                      )}
                    </div>
                    <div className="col-xs-4" style={{ marginTop: "0px" }}>
                      <img
                        style={{ width: "100px" }}
                        id="preview5"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image5 && (
                        <button
                          id="delete5"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 5
                        </button>
                      )}
                    </div>
                    <div className="col-xs-4" style={{ marginTop: "0px" }}>
                      <img
                        style={{ width: "100px" }}
                        id="preview6"
                        alt=""
                      ></img>
                      <br />
                      {newImage.image6 && (
                        <button
                          id="delete6"
                          onClick={onDeletePreviewImage}
                          className="btn btn-default"
                        >
                          Hapus 6
                        </button>
                      )}
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

                  {/* negara */}
                  <div className="col-md-12">
                    <h3>Asal Pengiriman Produk</h3>
                    <hr />
                    <p>Produk dikirim dari:</p>
                    <div className="row">
                      <div
                        className="col-sm-12"
                        style={{ paddingBottom: "15px" }}
                      >
                        <label className="form_label" htmlFor="countryId">
                          Pilih Negara
                        </label>
                        <select
                          id="countryId"
                          name="countryId"
                          value={formState.countryId || ""}
                          required
                          onChange={onFormStateChange}
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
                    {formState.countryId === "5f142c0c3c69e5284cb36ffb" && (
                      <>
                        <p>
                          Asal Pengiriman produk dan pilihan kurir. Anda dapat
                          mengatur pilihan default di Setting Penjualan.
                        </p>
                        <div className="row">
                          <div className="col-sm-4">
                            <div className="form-group">
                              <select
                                id="chooseProvince"
                                name="provinceId"
                                value={formState.provinceId || ""}
                                required
                                onChange={onFormStateChange}
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
                                name="districtId"
                                value={formState.districtId || ""}
                                required
                                onChange={onFormStateChange}
                              >
                                <option value="">
                                  Pilih Kota/kabupaten...
                                </option>
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
                                value={formState.subdistrictId || ""}
                                name="subdistrictId"
                                required
                                onChange={onFormStateChange}
                              >
                                <option value="">Pilih Kecamatan...</option>
                                {subdistricts.map((subdistrict) => (
                                  <option
                                    value={
                                      subdistrict.rajaongkir_id_subdistrict
                                    }
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
                                        checked={formState.shippingRegularJne}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      J&amp;T
                                      <input
                                        type="checkbox"
                                        name="shippingRegularJnt"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularJnt}
                                      />
                                      <span className="checkmark"></span>
                                    </label>

                                    <label className="container_cbx">
                                      SICEPAT
                                      <input
                                        type="checkbox"
                                        name="shippingRegularSicepat"
                                        onChange={onChangeCheck}
                                        checked={
                                          formState.shippingRegularSicepat
                                        }
                                      />
                                      <span className="checkmark"></span>
                                    </label>

                                    <label className="container_cbx">
                                      POS
                                      <input
                                        type="checkbox"
                                        name="shippingRegularPos"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularPos}
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
                                        checked={formState.shippingRegularRpx}
                                      />
                                      <span className="checkmark"></span>
                                    </label>

                                    <label className="container_cbx">
                                      WAHANA
                                      <input
                                        type="checkbox"
                                        name="shippingRegularWahana"
                                        onChange={onChangeCheck}
                                        checked={
                                          formState.shippingRegularWahana
                                        }
                                      />
                                      <span className="checkmark"></span>
                                    </label>

                                    <label className="container_cbx">
                                      NINJA
                                      <input
                                        type="checkbox"
                                        name="shippingRegularNinja"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularNinja}
                                      />
                                      <span className="checkmark"></span>
                                    </label>

                                    <label className="container_cbx">
                                      REX
                                      <input
                                        type="checkbox"
                                        name="shippingRegularRex"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularRex}
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
                                        checked={formState.shippingRegularSap}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      JET
                                      <input
                                        type="checkbox"
                                        name="shippingRegularJet"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularJet}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      DSE
                                      <input
                                        type="checkbox"
                                        name="shippingRegularDse"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularDse}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      LION
                                      <input
                                        type="checkbox"
                                        name="shippingRegularLion"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingRegularLion}
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
                                        checked={formState.shippingNextDayJne}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      SICEPAT
                                      <input
                                        type="checkbox"
                                        name="shippingNextDaySicepat"
                                        onChange={onChangeCheck}
                                        checked={
                                          formState.shippingNextDaySicepat
                                        }
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      POS
                                      <input
                                        type="checkbox"
                                        name="shippingNextDayPos"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingNextDayPos}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      RPX
                                      <input
                                        type="checkbox"
                                        name="shippingNextDayRpx"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingNextDayRpx}
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
                                        checked={formState.shippingNextDayRex}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      SAP
                                      <input
                                        type="checkbox"
                                        name="shippingNextDaySap"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingNextDaySap}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      JET
                                      <input
                                        type="checkbox"
                                        name="shippingNextDayJet"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingNextDayJet}
                                      />
                                      <span className="checkmark"></span>
                                    </label>
                                    <label className="container_cbx">
                                      DSE
                                      <input
                                        type="checkbox"
                                        name="shippingNextDayDse"
                                        onChange={onChangeCheck}
                                        checked={formState.shippingNextDayDse}
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
                                        checked={formState.shippingNextDayLion}
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
                    )}

                    <br />
                    <div
                      style={{
                        padding: "15px",
                        background: "#c8ffc2",
                        marginBottom: "30px",
                      }}
                    >
                      {(() => {
                        if (
                          currentUser &&
                          currentUser.sellerInfo.membershipId
                        ) {
                          return (
                            <div className="form-group">
                              <label className="container_cbx">
                                Saya setuju Okebid akan mengenakan biaya
                                transaksi X% dari harga jual akhir.
                                <input
                                  type="checkbox"
                                  name="commission"
                                  onChange={onChangeAgreements}
                                  checked={agreements.commission}
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
                            name="toc"
                            onChange={onChangeAgreements}
                            checked={agreements.toc}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  {loadings.save ? (
                    <div className="col-md-12" style={{ textAlign: "center" }}>
                      <Loader
                        type="ThreeDots"
                        color="green"
                        height={100}
                        width={100}
                      />
                      <p>Mohon tunggu, sedang menyimpan...</p>
                    </div>
                  ) : (
                    <div className="col-md-12">
                      {(() => {
                        if (
                          currentUser &&
                          currentUser.sellerInfo.membershipId
                        ) {
                          return (
                            <>
                              <input
                                type="submit"
                                style={{ fontWeight: "bold" }}
                                value={
                                  product.bidStatus === "aktif"
                                    ? "Lelang sedang berlangsung. Silahkan tunggu sampai lelang selesai"
                                    : "SIMPAN DAN AKTIFKAN LELANG"
                                }
                                className="btn btn-success custom-class"
                                name="auction"
                                onClick={() => {
                                  setSubmitType("auction");
                                }}
                                disabled={product.bidStatus === "aktif"}
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
                        name="marketplace"
                        onClick={() => {
                          setSubmitType("marketplace");
                        }}
                        // onClick={onClickSimpanMarketplaceAktif}
                      >
                        SIMPAN &amp; AKTIFKAN MARKETPLACE{" "}
                      </button>
                      &nbsp;&nbsp;&nbsp;
                      <button
                        type="submit"
                        className="my_button buttonGray"
                        name="draftMarketplace"
                        onClick={() => {
                          setSubmitType("draftMarketplace");
                        }}
                        // onClick={onClickSimpanDraftMarketplace}
                      >
                        SIMPAN SEBAGAI DRAFT{" "}
                      </button>
                    </div>
                  )}
                </div>
              </form>
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
                Anda dapat memasang harga target untuk produk ini, yaitu harga
                terendah yang mau Anda lepas. Bila lelang telah berakhir dan
                harga bid belum mencapai harga ini, Anda tidak perlu melepas
                produk ini. Kosongkan kotak isian bila tidak mau digunakan.
                <br />
                Token yang dibutuhkan: {reservedPriceToken}
              </p>
              <p>Harga target harus 30% lebih tinggi dari harga lelang awal.</p>
              <button
                onClick={() => {
                  setIsShowHargaTargetInfo(false);
                }}
                style={{ float: "right" }}
              >
                Tutup
              </button>
            </Modal>
            <Modal
              open={isShowKelipatan}
              onClose={() => {
                setIsShowKelipatan(false);
              }}
            >
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

              <button
                onClick={() => {
                  setIsShowKelipatan(false);
                }}
                style={{ float: "right" }}
              >
                Tutup
              </button>
            </Modal>

            <Modal
              open={isShowTipsHargaAwal}
              onClose={() => {
                setIsShowTipsHargaAwal();
              }}
            >
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
                Untuk meningkatkan peluang produk Kamu laku dilelang, sebaiknya
                Kamu memasang harga awal dibawah harga jual pasaran. Misalnya
                75% dari harga pasaran.
              </p>
              <button
                onClick={() => {
                  setIsShowTipsHargaAwal();
                }}
                style={{ float: "right" }}
              >
                Tutup
              </button>
            </Modal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProduct;
