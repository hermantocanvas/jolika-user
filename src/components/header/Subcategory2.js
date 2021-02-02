import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Subcategory3 from "./Subcategory3";

function Subcategory2({ subcategory1 }) {
  const [subcategories2, setSubcategories2] = useState([]);

  useEffect(() => {
    loadSubcategories2();
    //eslint-disable-next-line
  }, []);

  async function loadSubcategories2() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories2/${subcategory1.categoryId}`
      );

      setSubcategories2(res.data.data);
    } catch (err) {
      console.log(err.message, "danger");
    }
  }

  return (
    <ul className="middleLevelMegaMenu">
      {subcategories2 &&
        subcategories2.map((subcategory2, index) => (
          <li key={index}>
            <Link to="/" style={styles.capitalize}>
              {subcategory2.category_en}
            </Link>
            <Subcategory3 subcategory2={subcategory2} />
          </li>
        ))}
    </ul>
  );
}

const styles = {
  capitalize: {
    textTransform: "capitalize",
  },
};

export default Subcategory2;
