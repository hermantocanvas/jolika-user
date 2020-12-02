import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';
import uuid from 'uuid';
import PropTypes from 'prop-types';

const Reviews = ({ product, userId }) => {
  const [reviews, setReviews] = useState([]);
  const [pagination, setPagination] = useState({
    total: null,
    per_page: null,
    current_page: 1,
    total_pages: null,
    start_index: null,
  });
  const {
    total,
    per_page,
    current_page,
    total_pages,
    start_index,
  } = pagination;

  useEffect(() => {
    loadReviews(1);
    //eslint-disable-next-line
  }, []);

  async function loadReviews(pageNumber) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_APIURL}api/v1/products/reviews/${userId}/${pageNumber}`
      );
      setReviews(res.data.data);

      setPagination({
        ...pagination,
        total: res.data.total,
        per_page: res.data.per_page,
        current_page: res.data.page,
        total_pages: res.data.total_pages,
        start_index: res.data.startIndex,
      });
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.error, 'danger');
      }
    }
  }

  //calculate review average rating, and count each star
  let totalRating = 0;
  let star5 = 0;
  let star4 = 0;
  let star3 = 0;
  let star2 = 0;
  let star1 = 0;

  reviews.forEach((review) => {
    totalRating = totalRating + parseInt(review.rating);

    switch (parseInt(review.rating)) {
      case 5:
        star5++;
        break;
      case 4:
        star4++;
        break;
      case 3:
        star3++;
        break;
      case 2:
        star2++;
        break;
      case 1:
        star1++;
        break;
      default:
        break;
    }
  });
  const countStar5 = (star5 / reviews.length) * 100;
  const countStar4 = (star4 / reviews.length) * 100;
  const countStar3 = (star3 / reviews.length) * 100;
  const countStar2 = (star2 / reviews.length) * 100;
  const countStar1 = (star1 / reviews.length) * 100;
  let averageRating = 0;
  if (reviews.length > 0) {
    averageRating = (totalRating / reviews.length).toFixed(2);
  }

  const pageNumbers = [];
  let renderPageNumbers;

  if (total !== null) {
    for (let i = 1; i <= Math.ceil(total / per_page); i++) {
      pageNumbers.push(i);
    }

    renderPageNumbers = pageNumbers.map((number) => {
      let classLink = current_page === number ? 'active' : '';
      let classList = current_page === number ? 'active' : '';
      return (
        <li className={classList} key={number}>
          <Link
            to='#'
            className={classLink}
            onClick={() => loadReviews(number)}
          >
            {number}
          </Link>
        </li>
      );
    });
  }

  //get reviewLastIndex
  let reviewLastIndex;
  if (current_page === total_pages) {
    //this is the last page
    reviewLastIndex = total;
  } else {
    reviewLastIndex = start_index + per_page;
  }

  return (
    <Fragment>
      <div className='panel panel-default'>
        <div className='panel-heading'>
          <h2
            className='product-title'
            style={{
              fontSize: '16px',
              // color: "white",
              background: 'dc143c',
              textTransform: 'capitalize',
            }}
          >
            Ulasan Pelelang: {product.username}
          </h2>
        </div>
        <div className='panel-body'>
          <strong style={{ textTransform: 'capitalize' }}>
            Ulasan untuk {product.username}
          </strong>
          <div className='row'>
            <div className='col-xs-3'>
              <h2 style={{ fontSize: '30px' }}>
                {averageRating}
                <span style={{ fontSize: '16px' }}>/5</span>
              </h2>
              <p style={{ fontSize: '14px' }}>
                <nobr>{reviews.length} Ulasan</nobr>
              </p>
            </div>
            <div className='col-xs-9'>
              <br />
              <div style={{ clear: 'both' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '10px',
                    position: 'relative',
                    bottom: '7px',
                  }}
                >
                  <i className='fa fa-star'></i> 5{' '}
                </div>
                <div
                  className='progress'
                  style={{ height: '10px', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar progress-bar-striped active progress-bar-danger'
                    role='progressbar'
                    style={{ width: `${countStar5}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ clear: 'both' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '10px',
                    position: 'relative',
                    bottom: '7px',
                  }}
                >
                  <i className='fa fa-star'></i> 4{' '}
                </div>
                <div
                  className='progress'
                  style={{ height: '10px', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar progress-bar-striped active progress-bar-danger'
                    role='progressbar'
                    style={{ width: `${countStar4}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ clear: 'both' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '10px',
                    position: 'relative',
                    bottom: '7px',
                  }}
                >
                  <i className='fa fa-star'></i> 3{' '}
                </div>
                <div
                  className='progress'
                  style={{ height: '10px', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar progress-bar-striped active progress-bar-danger'
                    role='progressbar'
                    style={{ width: `${countStar3}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ clear: 'both' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '10px',
                    position: 'relative',
                    bottom: '7px',
                  }}
                >
                  <i className='fa fa-star'></i> 2{' '}
                </div>
                <div
                  className='progress'
                  style={{ height: '10px', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar progress-bar-striped active progress-bar-danger'
                    role='progressbar'
                    style={{ width: `${countStar2}%` }}
                  ></div>
                </div>
              </div>
              <div style={{ clear: 'both' }}>
                <div
                  style={{
                    float: 'left',
                    marginRight: '10px',
                    position: 'relative',
                    bottom: '7px',
                  }}
                >
                  <i className='fa fa-star'></i> 1{' '}
                </div>
                <div
                  className='progress'
                  style={{ height: '10px', marginBottom: '15px' }}
                >
                  <div
                    className='progress-bar progress-bar-striped active progress-bar-danger'
                    role='progressbar'
                    style={{ width: `${countStar1}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            {(() => {
              if (reviews.length > 0) {
                return (
                  <Fragment>
                    <br />
                    <p>
                      Menampilkan {start_index + 1} - {reviewLastIndex} dari
                      total {total} ulasan
                    </p>
                    {reviews.map((review) => (
                      <div key={review._id}>
                        <p style={{ textTransform: 'capitalize' }}>
                          {review.reviewUsername}
                          <br />
                          <span style={{ fontSize: '12px' }}>
                            {moment(review.date).format('DD MMM YYYY')}
                            {' | '}untuk {review.reviewFor}
                          </span>
                          <br />
                          {(() => {
                            const starIcons = [];
                            for (let i = 0; i < parseInt(review.rating); i++) {
                              starIcons.push(
                                <i className='fa fa-star' key={uuid()}></i>
                              );
                            }
                            return starIcons;
                          })()}{' '}
                          <br />
                          {review.reviewText}
                        </p>
                        <hr />
                      </div>
                    ))}
                  </Fragment>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {(() => {
        if (reviews.length > 0) {
          return (
            <Fragment>
              <div className='pagination-wrapper' style={{ borderTop: 'none' }}>
                <ul className='pagination'>
                  <li>
                    <Link to='#' onClick={() => loadReviews(1)}>
                      <i className='fa fa-angle-double-left'></i>
                    </Link>
                  </li>
                  {renderPageNumbers}
                  <li>
                    <Link to='#' onClick={() => loadReviews(total_pages)}>
                      <i className='fa fa-angle-double-right'></i>
                    </Link>
                  </li>
                </ul>
              </div>
              <br />
            </Fragment>
          );
        }
      })()}
    </Fragment>
  );
};

Reviews.propTypes = {
  product: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Reviews;
