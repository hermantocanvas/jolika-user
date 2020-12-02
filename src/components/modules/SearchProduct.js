import React, { useState } from "react";
import { Link } from "react-router-dom";

const SearchProduct = ({ searchIconState }) => {
  const [inputText, setInputText] = useState("");

  return (
    <div className="search_form_form">
      <input
        type="text"
        id="search-input-form"
        name="s"
        data-toggle="dropdown"
        className=""
        placeholder="Cari Produk di OkeBid"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Link
        to={`/cari-produk/?productName=${inputText}`}
        onClick={searchIconState}
      >
        <button className="">
          Cari&nbsp;&nbsp;<i className="fa fa-search"></i>
        </button>
      </Link>
    </div>
  );
};

export default SearchProduct;
