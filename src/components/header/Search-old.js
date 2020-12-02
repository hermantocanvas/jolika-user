import React, { useState, useContext, useEffect } from "react";
import AlertContext from "../../context/alert/alertContext";

const Search = () => {
  const alertContext = useContext(AlertContext);
  const { setAlert } = alertContext;
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    //submit form by entering ENTER key
    // Get the input field
    const input = document.getElementById("searchQuery");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (e) {
      // Number 13 is the "Enter" key on the keyboard
      if (e.keyCode === 13) {
        // Cancel the default action, if needed
        //event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("searchSubmit").click();
      }
    });
    //eslint-disable-next-line
  }, []);

  const onChangeSearch = (e) => setSearchQuery(e.target.value);

  const onSubmit = (e) => {
    if (searchQuery === "") {
      e.preventDefault();
      setAlert("Kotak pencarian produk belum diisi", "danger");
    }
  };

  // Slugify a string
  function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, "");

    // Make the string lowercase
    str = str.toLowerCase();

    // Remove accents, swap ñ for n, etc
    var from =
      "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆÍÌÎÏŇÑÓÖÒÔÕØŘŔŠŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇíìîïňñóöòôõøðřŕšťúůüùûýÿžþÞĐđßÆa·/_,:;";
    var to =
      "AAAAAACCCDEEEEEEEEIIIINNOOOOOORRSTUUUUUYYZaaaaaacccdeeeeeeeeiiiinnooooooorrstuuuuuyyzbBDdBAa------";
    for (var i = 0, l = from.length; i < l; i++) {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }

    // Remove invalid chars
    str = str
      .replace(/[^a-z0-9 -]/g, "")
      // Collapse whitespace and replace by -
      .replace(/\s+/g, "-")
      // Collapse dashes
      .replace(/-+/g, "-");

    return str;
  }

  return (
    <div className="header-search">
      <input
        className="form-control"
        type="text"
        placeholder="Cari Produk di Okebid"
        value={searchQuery}
        onChange={onChangeSearch}
        name="searchQuery"
        id="searchQuery"
      />
      <a
        id="searchSubmit"
        href={`/cari-produk/${slugify(searchQuery)}`}
        onClick={onSubmit}
      >
        <button>
          <i className="fa fa-search"></i>
        </button>
      </a>
    </div>
  );
};

export default Search;
