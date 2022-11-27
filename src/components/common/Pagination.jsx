import React, { Fragment, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import ceil from 'lodash/ceil';

import Icon from 'components/common/Icon';

const Pagination = ({ count = 0, currentPage = 1, step = 5, onPageClick, disabled }) => {
  const pagesByStep = useMemo(() => {
    const pagesCount = ceil(count / step);

    return Array(pagesCount)
      .fill(0)
      .map((_, index) => index + 1);
  }, [count, step]);

  const lastPage = useMemo(() => pagesByStep.length, [pagesByStep]);

  const handlePageClick = useCallback(
    page => {
      if (currentPage === page) return null;

      return onPageClick && onPageClick(page);
    },
    [onPageClick, currentPage],
  );

  const slicedPages = useMemo(() => {
    if (currentPage < 5) return pagesByStep.slice(0, 5);
    if (currentPage > pagesByStep?.length - 4) {
      return pagesByStep.slice(pagesByStep?.length - 5, pagesByStep?.length);
    }

    return pagesByStep.slice(currentPage - 3, currentPage + 2);
  }, [currentPage, pagesByStep]);

  const showLastBtn = useMemo(() => {
    if (pagesByStep?.length >= 8) return currentPage < pagesByStep?.length - 3;
    if (pagesByStep?.length > 6) return currentPage < pagesByStep?.length - 2;

    return pagesByStep?.length > 5 && currentPage < pagesByStep?.length - 1;
  }, [pagesByStep, currentPage]);

  return (
    <div className='pagination'>
      <button
        onClick={() => handlePageClick(currentPage === 1 ? 1 : currentPage - 1)}
        type='button'
        className={classNames('prev', { disabled: currentPage === 1 })}
        disabled={disabled}
      >
        <Icon name='arrow-up' />
      </button>

      <div className='pages'>
        {pagesByStep?.length >= 6 && currentPage >= 5 && (
          <Fragment>
            <button
              key={1}
              type='button'
              className='page'
              onClick={() => handlePageClick(1)}
              disabled={disabled}
            >
              01
            </button>
            <button
              key='prev-5'
              type='button'
              className='page'
              onClick={() => handlePageClick(currentPage - 5)}
              disabled={disabled}
            >
              ...
            </button>
          </Fragment>
        )}
        {slicedPages.map(page => (
          <button
            key={page}
            type='button'
            className={classNames('page', { active: page === currentPage })}
            onClick={() => handlePageClick(page)}
            disabled={disabled}
          >
            {page < 10 ? page.toString().padStart(2, '0') : page}
          </button>
        ))}
        {showLastBtn && (
          <Fragment>
            <button
              key='next-5'
              type='button'
              className='page'
              onClick={() => handlePageClick(currentPage + 5)}
              disabled={disabled}
            >
              ...
            </button>
            <button
              key={lastPage}
              type='button'
              className='page'
              onClick={() => handlePageClick(lastPage)}
              disabled={disabled}
            >
              {lastPage < 10 ? lastPage.toString().padStart(2, '0') : lastPage}
            </button>
          </Fragment>
        )}
      </div>

      <button
        type='button'
        onClick={() => handlePageClick(currentPage === lastPage ? lastPage : currentPage + 1)}
        className={classNames('next', { disabled: currentPage === lastPage })}
        disabled={disabled}
      >
        <Icon name='arrow-up' />
      </button>
    </div>
  );
};

export default Pagination;
