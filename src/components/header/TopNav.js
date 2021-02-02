import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Subcategory1 from "./Subcategory1";

const TopNav = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
    //eslint-disable-next-line
  }, []);

  async function loadCategories() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/categories`
      );

      setCategories(res.data.data);
    } catch (err) {
      console.log(err.message, "danger");
    }
  }

  return (
    <div className="container" id="containerBottom">
      <div id="bottom-nav">
        <ul>
          {categories &&
            categories.map((category, index) => (
              <li key={index}>
                <Link
                  to={`/category/${category.url_link_en}`}
                  style={styles.capitalize}
                >
                  {category.category_en}
                </Link>
                <Subcategory1 category={category} />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

const styles = {
  capitalize: {
    textTransform: "capitalize",
  },
};

export default TopNav;
