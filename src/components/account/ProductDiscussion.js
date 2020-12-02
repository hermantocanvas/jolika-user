import React, { useState, useContext, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";
import AuthContext from "../../context/auth/authContext";
import { Link } from "react-router-dom";

const ProductDiscussion = () => {
  const [discussions, setDiscussions] = useState(null);
  const authContext = useContext(AuthContext);
  const { currentUser } = authContext;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadDiscussions();
    //eslint-disable-next-line
  }, []);

  async function loadDiscussions() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/auctions/unread-discussion`
      );

      setDiscussions(res.data.data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getProductData(productId) {
    try {
      const product = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/productData/${productId}`
      );
      setProduct(product.data.data);
    } catch (err) {
      console.log(err.message);
    }
  }

  if (discussions === null) {
    return (
      <Fragment>
        <div className="information-title">
          Diskusi Produk yang belum dibalas
        </div>
        <div className="details-wrap">
          <div className="details-box orders">
            <p>Belum ada diskusi baru.</p>
          </div>
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <div className="information-title">
          Diskusi Produk yang belum dibalas
        </div>
        <div className="details-wrap">
          <div className="details-box orders">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Tanggal</th>
                  <th>Balasan terakhir</th>
                  <th>Balas Sekarang</th>
                </tr>
              </thead>
              <tbody>
                {discussions.map((discussion) => {
                  if (
                    (discussion.discussions.length === 0 &&
                      currentUser.username !== discussion.buyerUsername) ||
                    (discussion.discussions.length > 0 &&
                      discussion.discussions[discussion.discussions.length - 1]
                        .userName !== currentUser.username)
                  ) {
                    const product = getProductData(discussion.productI);

                    return (
                      <tr key={discussion._id}>
                        <td>{product.name}</td>
                        {(() => {
                          if (discussion.discussions.length === 0) {
                            return (
                              <Fragment>
                                <td>
                                  {moment(discussion.questionDate).format(
                                    "DD MMM YYYY. HH:mm:ss"
                                  )}
                                </td>
                                <td>
                                  {discussion.question}
                                  <br />
                                  Oleh: {discussion.sellerUsername}
                                </td>
                                <td>
                                  <Link
                                    to={`/produk/${product.slug}`}
                                    className="btn btn-primary"
                                  >
                                    Balas Sekarang
                                  </Link>
                                </td>
                              </Fragment>
                            );
                          } else {
                            return (
                              <Fragment>
                                <td>
                                  {moment(
                                    discussion.discussions[
                                      discussion.discussions.length - 1
                                    ].discussDate
                                  ).format("DD MMM YYYY. HH:mm:ss")}
                                </td>
                                <td>
                                  {
                                    discussion.discussions[
                                      discussion.discussions.length - 1
                                    ].discussionText
                                  }
                                  <br />
                                  <span style={{ fontSize: "12px" }}>
                                    Oleh:{" "}
                                    {
                                      discussion.discussions[
                                        discussion.discussions.length - 1
                                      ].userName
                                    }
                                  </span>
                                </td>
                                <td>
                                  <Link
                                    to={`/produk/${product.slug}`}
                                    className="btn btn-primary"
                                  >
                                    Balas Sekarang
                                  </Link>
                                </td>
                              </Fragment>
                            );
                          }
                        })()}
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default ProductDiscussion;
