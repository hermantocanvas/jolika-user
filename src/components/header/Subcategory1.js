import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Subcategory2 from "./Subcategory2";

function Subcategory1({ category }) {
  const [subcategories1, setSubcategories1] = useState([]);

  useEffect(() => {
    loadSubcategories1();
    //eslint-disable-next-line
  }, []);

  async function loadSubcategories1() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories1/${category.categoryId}`
      );

      setSubcategories1(res.data.data);
    } catch (err) {
      console.log(err.message, "danger");
    }
  }

  return (
    <ul className="topMegaMenu">
      {subcategories1 &&
        subcategories1.map((subcategory1, index) => (
          <div key={index}>
            <h3 style={styles.capitalize}>{subcategory1.category_en}</h3>
            <Subcategory2 subcategory1={subcategory1} />
          </div>
        ))}
    </ul>
  );
}

const styles = {
  capitalize: {
    textTransform: "capitalize",
  },
};

export default Subcategory1;
