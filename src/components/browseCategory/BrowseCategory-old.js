import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Filter from './Filter';
import Content from './Content';
const dashedToSpaced = (str) => {
  if (!str) return '';
  return str.replace(/-/g, ' ');
};
const Category = ({ match, location }) => {
  const [query, setQuery] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const queryObject = queryString.parse(location.search);
    setQuery({
      ...query,
      productName: queryObject.productName || '',
      pmin: queryObject.pmin || '',
      pmax: queryObject.pmax || '',
      page: queryObject.page || 1,
      categoryName: dashedToSpaced(match.params.category),
      subcategory1Name: dashedToSpaced(match.params.subcategory1),
      subcategory2Name: dashedToSpaced(match.params.subcategory2),
    });
    setLoading(false);
  }, [location.search, match]);

  if (loading) return null;
  return (
    <div className='wrapp product_detail'>
      <div className='page_heading'>
        <i className='fa fa-search'></i> Hasil pencarian{' '}
        <b>
          {(
            query.subcategory2Name ||
            query.subcategory1Name ||
            query.categoryName
          ).toUpperCase()}
        </b>
      </div>

      <div className='row'>
        <Filter query={query} />
        <Content query={query} />
      </div>
    </div>
  );
};

export default Category;
