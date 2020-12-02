import React, { useState } from "react";
import TopHeader from "./TopHeader";
import MidHeader from "./MidHeader";
import SearchProduct from "../modules/SearchProduct";

const Header = ({ toggleCategory }) => {
  const [searchIconState, setSearhIconState] = useState(false);

  const handleSearchIconState = (e) => {
    setSearhIconState(!searchIconState);
  };

  return (
    <div className="header">
      <TopHeader />
      <div className="wrapp">
        <MidHeader
          toggleCategory={toggleCategory}
          searchIconState={handleSearchIconState}
        />
        {searchIconState && (
          <div id="searchHeaderBottom">
            <SearchProduct searchIconState={handleSearchIconState} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
