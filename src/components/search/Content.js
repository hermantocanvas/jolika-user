import React from "react";

import MarketplaceProducts from "../browseCategory/MarketplaceProducts";

const Content = ({ query }) => {
  return (
    <div className="col-md-9">
      <MarketplaceProducts query={query} />
    </div>
  );
};

export default Content;
