import React from 'react';

const Pagination = ({ firstPage, lastPage, currentPage = 0, onPageChange }) => {
  if (!currentPage) return null;

  const startIdx = currentPage - 3 > 0 ? currentPage - 3 : 1;
  const endIdx = currentPage + 3 <= lastPage ? currentPage + 3 : lastPage;

  let buttons = [];

  for (let i = startIdx; i <= endIdx; i++) {
    buttons.push(
      <li key={i} onClick={() => onPageChange(i)}>
        <a href='#' className={i === currentPage ? 'active' : ''}>
          {i}
        </a>
      </li>
    );
  }
  return (
    <div className='pagination'>
      <ul>{buttons}</ul>
    </div>
  );
};

export default Pagination;
