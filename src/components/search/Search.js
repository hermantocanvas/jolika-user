import React, { useState, useEffect } from "react";
import queryString from "query-string";
import Filter from "../browseCategory/Filter";
import Content from "./Content";

const Search = ({ match, location }) => {
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
    });
    setLoading(false);
  }, [location.search]);

  if (loading) return null;

  return (
    <div className="wrapp product_detail">
      <div className="page_heading">
        <i className="fa fa-search"></i> Hasil pencarian{" "}
        <b>"{query.productName}"</b>{" "}
      </div>

      <div className="row">
        <Filter query={query} />
        <Content query={query} />
      </div>
    </div>
  );
};

export default Search;
