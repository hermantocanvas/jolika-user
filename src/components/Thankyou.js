import React, { useContext, useEffect, Fragment, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import queryString from "query-string";
const Thankyou = (props) => {
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const queryObject = queryString.parse(props.location.search);
    setQuery({
      ...query,
      status: queryObject.status || "",
    });
    setLoading(false);
  }, [props.location.search]);

  if (loading) return null;

  if (query.status === "cancel") {
    return (
      <Fragment>
        <div className="wrapp product_detail">
          <div className="row">
            <div className="col-md-12">
              <div class="ck_thankyou">
                <i class="fa fa-times-circle"></i>
                <h3>Sorry transaction fail.</h3>
                <p>Please contact us to resolve your issue.</p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="wrapp product_detail" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="row">
          <div className="col-md-12">
            <div
              class="ck_thankyou"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: '500px',
                minHeight: '350px',
                textAlign: 'center'
              }}
            >
              <h3
                style={{
                  background: "#735e59",
                  color: "white",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                Thank you for your order.
              </h3>
              <h3>Your payment has been processed.</h3>
              <p style={{ fontSize: "16px" }}>
                Note: for payments using a credit card,
                bills that will be printed on the credit card billing statement
                the customer is on behalf of ESPAY.
              </p>
              <br />
              <br />
            </div>
          </div>
        </div>
      </div>
    </Fragment >
  );
};

export default Thankyou;