import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import moment from "moment";

const Rating = () => {
  const [ratingsData, setRatings] = useState({
    ratings: null,
  });
  const { ratings } = ratingsData;

  useEffect(() => {
    loadRatings();
    //eslint-disable-next-line
  }, []);

  async function loadRatings() {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/ratings/view/all`
      );

      setRatings({
        ...ratingsData,
        ratings: res.data.data,
      });
    } catch (err) {
      console.log(err);
    }
  }

  if (ratings === null || ratings.length === 0) {
    return (
      <Fragment>
        <h3>Ulasan Saya</h3>
        <hr />
        <div className="details-wrap">
          <div className="details-box orders">
            <p>Belum ada ulasan.</p>
          </div>
        </div>
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <h3>Ulasan Saya</h3>
        <hr />
        <div className="details-wrap">
          <div className="details-box orders">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Diulas oleh</th>
                  <th>Ulasan untuk</th>
                  <th>Rating</th>
                  <th>Ulasan</th>
                  <th>Sumber ulasan</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((rating) => (
                  <tr key={rating._id}>
                    <td>
                      {moment(rating.date).format("DD MMM YYYY. HH:mm:ss")}
                    </td>
                    <td>{rating.reviewUsername}</td>
                    <td>{rating.reviewFor}</td>
                    <td>{rating.rating}</td>
                    <td>{rating.reviewText}</td>
                    <td>
                      {(() => {
                        let shortenOrderId;
                        if (rating.orderId) {
                          shortenOrderId = rating.orderId
                            .substr(rating.orderId.length - 5)
                            .toUpperCase();
                        }

                        const shortenAuctionId = rating.auctionId
                          .substr(rating.auctionId.length - 5)
                          .toUpperCase();

                        return (
                          <Fragment>
                            {(() => {
                              if (shortenOrderId) {
                                return (
                                  <Fragment>
                                    Order ID: {shortenOrderId}
                                    <br />
                                  </Fragment>
                                );
                              }
                            })()}
                            Auction ID: {shortenAuctionId}
                          </Fragment>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Fragment>
    );
  }
};

export default Rating;
