import React, { useState, useEffect } from "react";
import queryString from "query-string";

import Filter from "./Filter";
import ProductItem from "../modules/ProductItem";

const dashedToSpaced = (str) => {
  if (!str) return "";
  return str.replace(/-/g, " ");
};

const Category = ({ match, location }) => {
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const queryObject = queryString.parse(location.search);
    setQuery({
      ...query,
      productName: queryObject.productName || "",
      pmin: queryObject.pmin || "",
      pmax: queryObject.pmax || "",
      page: queryObject.page || 1,
      categoryName: dashedToSpaced(match.params.category),
      subcategory1Name: dashedToSpaced(match.params.subcategory1),
      subcategory2Name: dashedToSpaced(match.params.subcategory2),
    });
    setLoading(false);
  }, [location.search, match]);

  //if (loading) return null;

  return (
    <section id="categoryProducts">
      <div className="container py-2">
        <div id="categoryTitleBlock">
          <h1>Cake</h1>
          <p>Total 16 products</p>
        </div>
        <Filter />
        <div id="categoryProductsItems">
          <ProductItem />
        </div>
      </div>
    </section>
  );
};

export default Category;
