import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Subcategory3({ subcategory2 }) {
  const [subcategories3, setSubcategories3] = useState([]);

  useEffect(() => {
    loadSubcategories3();
    //eslint-disable-next-line
  }, []);

  async function loadSubcategories3() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories/admin/get/subcategories3/${subcategory2.categoryId}`
      );

      setSubcategories3(res.data.data);
    } catch (err) {
      console.log(err.message, "danger");
    }
  }

  return (
    <ul className="bottomLevelMegaMenu">
      {subcategories3 &&
        subcategories3.map((subcategory3, index) => (
          <li key={index}>
            <Link to="/" style={styles.capitalize}>
              {subcategory3.category_en}
            </Link>
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

export default Subcategory3;
