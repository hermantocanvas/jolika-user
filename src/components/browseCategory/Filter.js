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

  // useEffect(() => {
  //   loadCategories();
  // }, []);

  // useEffect(() => {
  //   setSubcategory1({});
  //   setSubcategory2({});
  //   if (category) {
  //     loadSubcategories1(category.categoryId);
  //   }
  // }, [category]);

  // useEffect(() => {
  //   setSubcategory2({});
  //   if (subcategory1) {
  //     loadSubcategories2(subcategory1.categoryId);
  //   }
  // }, [subcategory1]);

  // useEffect(() => {
  //   if (query.categoryName) {
  //     const tmpC = categories.find(
  //       (c) => c.category_ind === query.categoryName
  //     );

  //     if (tmpC) {
  //       setCategory(tmpC);
  //     }
  //   }
  // }, [categories]);

  // useEffect(() => {
  //   if (query.subcategory1Name) {
  //     const tmpC = subcategories1.find(
  //       (c) => c.category_ind === query.subcategory1Name
  //     );

  //     if (tmpC) {
  //       setSubcategory1(tmpC);
  //     }
  //   }
  // }, [subcategories1]);

  // useEffect(() => {
  //   if (query.subcategory2Name) {
  //     const tmpC = subcategories2.find(
  //       (c) => c.category_ind === query.subcategory1Name
  //     );

  //     if (tmpC) {
  //       setSubcategory1(tmpC);
  //     }
  //   }
  // }, [subcategories2]);

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

  // useEffect(() => {
  //   setName(query.productName);

  //   setPmin(query.pmin);

  //   setPmax(query.pmax);
  // }, [query]);

  return (
    <div id="categoryFilters">
      <div id="mobileFilter">
        <button id="btnfilter" onclick="filters()" c>
          <i className="fas fa-filter"></i> Filters
        </button>
      </div>
      <div id="productFilter">
        <p>
          <strong>PRODUCT FILTERS</strong> &nbsp;&nbsp;
          <span id="comboFilter">
            <select className="filterSelectBox" name="" id="">
              <option value="">Choose Filter 1</option>
              <option value="">value 1</option>
              <option value="">value 2</option>
              <option value="">value 3</option>
              <option value="">value 4</option>
            </select>
            <select className="filterSelectBox" name="" id="">
              <option value="">Choose Filter 2</option>
              <option value="">value 1</option>
              <option value="">value 2</option>
              <option value="">value 3</option>
              <option value="">value 4</option>
            </select>
            <select className="filterSelectBox" name="" id="">
              <option value="">Choose Filter 3</option>
              <option value="">value 1</option>
              <option value="">value 2</option>
              <option value="">value 3</option>
              <option value="">value 4</option>
            </select>
            <select className="filterSelectBox" name="" id="">
              <option value="">Choose Filter 4</option>
              <option value="">value 1</option>
              <option value="">value 2</option>
              <option value="">value 3</option>
              <option value="">value 4</option>
            </select>
          </span>
        </p>
        <p id="filterResults">
          You choose &nbsp;&nbsp;
          <span>
            Option 1 <i className="fa fa-close"></i>
          </span>{" "}
          <span>
            Option 2 <i className="fa fa-close"></i>
          </span>{" "}
          <span>
            Option 3 <i className="fa fa-close"></i>
          </span>
        </p>
      </div>
      <div id="productSort">
        <p>
          3 Products | <strong>SORT BY</strong>&nbsp;&nbsp;
          <select className="filterSelectBox">
            <option value="">Lowest Price</option>
            <option value="">Highest Price</option>
            <option value="">New Products</option>
            <option value="">Trending Products</option>
          </select>
        </p>
      </div>
    </div>
  );
};

export default Filter;
