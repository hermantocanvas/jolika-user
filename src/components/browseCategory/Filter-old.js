import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
const spacedToDashed = (str) => {
  return str.replace(/ /g, "-");
};

const Filter = ({ query }) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [subcategories1, setSubcategories1] = useState([]);
  const [subcategories2, setSubcategories2] = useState([]);

  const [category, setCategory] = useState({});
  const [subcategory1, setSubcategory1] = useState({});
  const [subcategory2, setSubcategory2] = useState({});

  const [name, setName] = useState("");
  const [pmin, setPmin] = useState("");
  const [pmax, setPmax] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    setSubcategory1({});
    setSubcategory2({});
    if (category) {
      loadSubcategories1(category.categoryId);
    }
  }, [category]);

  useEffect(() => {
    setSubcategory2({});
    if (subcategory1) {
      loadSubcategories2(subcategory1.categoryId);
    }
  }, [subcategory1]);

  useEffect(() => {
    if (query.categoryName) {
      const tmpC = categories.find(
        (c) => c.category_ind === query.categoryName
      );

      if (tmpC) {
        setCategory(tmpC);
      }
    }
  }, [categories]);

  useEffect(() => {
    if (query.subcategory1Name) {
      const tmpC = subcategories1.find(
        (c) => c.category_ind === query.subcategory1Name
      );

      if (tmpC) {
        setSubcategory1(tmpC);
      }
    }
  }, [subcategories1]);

  useEffect(() => {
    if (query.subcategory2Name) {
      const tmpC = subcategories2.find(
        (c) => c.category_ind === query.subcategory1Name
      );

      if (tmpC) {
        setSubcategory1(tmpC);
      }
    }
  }, [subcategories2]);

  const loadCategories = async () => {
    const URL = `${process.env.REACT_APP_APIURL}api/v1/categories`;
    try {
      const response = await axios.get(URL);
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSubcategories1 = async (categoryId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/subcategories1/${categoryId}`
      );
      setSubcategories1(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadSubcategories2 = async (subcategory1Id) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/subcategories2/${subcategory1Id}`
      );

      setSubcategories2(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let URL = `/kategori`;
    if (category.category_ind) {
      URL += `/${spacedToDashed(category.category_ind)}`;
    } else {
      return;
    }
    if (subcategory1.category_ind) {
      URL += `/${spacedToDashed(subcategory1.category_ind)}`;
    }
    if (subcategory2.category_ind) {
      URL += `/${spacedToDashed(subcategory2.category_ind)}`;
    }

    URL += `?`;
    if (name) {
      URL += `productName=${name}&`;
    }
    if (pmin) {
      URL += `pmin=${pmin}&`;
    }
    if (pmax) {
      URL += `pmax=${pmax}&`;
    }
    history.push(URL);
  };

  useEffect(() => {
    setName(query.productName);

    setPmin(query.pmin);

    setPmax(query.pmax);
  }, [query]);

  return (
    <div className="col-md-3">
      <div className="user_left">
        <h3 className="left_widget_title">Filter Kategori</h3>

        <div className="form_search">
          <form>
            <select
              id="category-select"
              onChange={(e) => {
                if (!e.target.value) {
                  setCategory({});
                  return;
                }

                setCategory(categories[e.target.value]);
              }}
              value={categories.findIndex((c) => c._id === category._id)}
            >
              <option value="">Pilih Category</option>
              {categories.map((category, i) => (
                <option key={category._id} value={i}>
                  {category.category_ind}
                </option>
              ))}
            </select>

            <select
              id="subcategory1-select"
              onChange={(e) => {
                if (!e.target.value) {
                  setSubcategory1({});
                  return;
                }
                setSubcategory1(subcategories1[e.target.value]);
              }}
              value={subcategories1.findIndex(
                (c) => c._id === subcategory1._id
              )}
            >
              <option value="">Pilih Category</option>
              {subcategories1.map((sc1, i) => (
                <option key={sc1._id} value={i}>
                  {sc1.category_ind}
                </option>
              ))}
            </select>

            <select
              id="subcategory2-select"
              onChange={(e) => {
                if (!e.target.value) {
                  setSubcategory2({});
                  return;
                }
                setSubcategory2(subcategories2[e.target.value]);
              }}
              value={subcategories2.findIndex(
                (c) => c._id === subcategory2._id
              )}
            >
              <option value="">Pilih Kategori</option>
              {subcategories2.map((sc, i) => (
                <option key={sc._id} value={i}>
                  {sc.category_ind}
                </option>
              ))}
            </select>
            <div class="left_space">
              <h4 class="form_title">Batas Harga</h4>
              <div class="row">
                <div class="col-md-6">
                  <div className="number-input-filter">
                    <input
                      type="number"
                      placeholder="Rp. Min"
                      value={pmin}
                      onChange={(e) => {
                        setPmin(e.target.value);
                      }}
                    />
                  </div>
                </div>
                {/* <div class='col-md-1'>-</div> */}
                <div class="col-md-6">
                  <div className="number-input-filter">
                    <input
                      type="number"
                      placeholder="Rp. Max"
                      value={pmax}
                      onChange={(e) => {
                        setPmax(e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="form_action_button">
              <button className="" onClick={handleSubmit}>
                Cari&nbsp;&nbsp;<i className="fa fa-search"></i>
              </button>
            </div>
          </form>
        </div>
      </div>{" "}
    </div>
  );
};

export default Filter;
