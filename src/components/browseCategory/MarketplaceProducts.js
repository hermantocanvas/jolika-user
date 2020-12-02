import React, { useState } from 'react';
import ProductItem from '../modules/ProductItem';
import { Fragment } from 'react';
import Axios from 'axios';
import { useEffect } from 'react';
import Pagination from '../search/Pagination';
import { useHistory } from 'react-router-dom';
const MarketplaceProducts = ({ query }) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    perPage: 0,
    currentPage: 0,
    totalPages: 0,
    startIndex: 0,
  });
  const history = useHistory();

  useEffect(() => {
    loadMarketplaceProducts(query.page);
  }, [query]);

  const handleChangePage = (page) => {
    let URL = `?`;
    if (query.productName) {
      URL += `productName=${query.productName}&`;
    }
    if (query.pmin) {
      URL += `pmin=${query.pmin}&`;
    }
    if (query.pmax) {
      URL += `pmax=${query.pmax}&`;
    }
    URL += `page=${page}&`;
    history.push(URL);
  };

  const loadMarketplaceProducts = async (pageNumber) => {
    let URL = '';
    URL += `${process.env.REACT_APP_APIURL}api/v1/browse/marketplace`;
    let formData = {};
    formData.pageNumber = parseInt(pageNumber);
    formData.limitPerPage = 60;
    formData.sort = 'lastest';
    formData.productName = query.productName;
    formData.minPrice = parseInt(query.pmin);
    formData.maxPrice = parseInt(query.pmax);
    formData.sellerUsername = query.sellerUsername;
    formData.categoryName = query.categoryName;
    formData.subcategory1Name = query.subcategory1Name;
    formData.subcategory2Name = query.subcategory2Name;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await Axios.post(URL, formData, config);
      const data = response.data;

      setProducts(data.data);
      console.log(data.data);
      setPagination({
        ...pagination,
        total: data.total,
        perPage: data.perPage,
        currentPage: data.page,
        totalPages: data.totalPages,
        startIndex: data.startIndex,
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (!products || !products.length)
    return (
      <Fragment>
        <p>
          Belum ada produk untuk{' '}
          {(
            query.subcategory2Name ||
            query.subcategory1Name ||
            query.categoryName
          ).toUpperCase()}
        </p>
      </Fragment>
    );

  return (
    <Fragment>
      <h2 className='module_title'>
        <span>MARKETPLACE</span>
      </h2>
      <div className='list_product_hdc'>
        <ul className='lp_listing browse_product'>
          {products.map((product) => (
            <ProductItem key={product._id} product={product} />
          ))}
        </ul>

        <Pagination
          currentPage={pagination.currentPage}
          lastPage={pagination.totalPages}
          onPageChange={handleChangePage}
        />
      </div>
    </Fragment>
  );
};

export default MarketplaceProducts;
