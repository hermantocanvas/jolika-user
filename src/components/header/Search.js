import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";

const Search = () => {

  return (
    <div id="searchBlock">
      <form id="searchForm">
          <input size="2" type="text" name="" id="" placeholder="Find Product" />
          <button className="btn" type="submit"><i className="fa fa-search"></i></button>
      </form>
    </div>
  );
};

export default Search;