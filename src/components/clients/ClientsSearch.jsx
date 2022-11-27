import React, { useState, useCallback, useRef, useEffect } from 'react';

import { Media, FormGroup } from 'reactstrap';
import classNames from 'classnames';

import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

const UPDATE_REQUEST_DELAY_MS = 200;

const ClientsSearch = ({
  searchValue: defaultSearchValue,
  onChange,
  setToggleForm,
  debounceLoading,
}) => {
  const [searchValue, setSearchValue] = useState(defaultSearchValue);
  const textInput = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    textInput.current.focus();
  }, [textInput]);

  const handleOnChange = useCallback(({ target: { value } }) => {
    setSearchValue(value);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      onChange(searchValue);
    }, UPDATE_REQUEST_DELAY_MS);

    return () => clearTimeout(delay);
  }, [searchValue, onChange]);

  useEffect(() => {
    if (searchValue !== defaultSearchValue) {
      setSearchValue(defaultSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSearchValue]);

  const handleClick = useCallback(() => {
    setToggleForm();
    onChange('');
  }, [onChange, setToggleForm]);

  return (
    <Media className='d-flex align-items-flex-start mb-2 mx-3 flex-column flex-sm-row'>
      <Media body className='w-100 w-sm-auto'>
        <FormGroup className={classNames('custom-input input-lg mb-0', { focused: isFocused })}>
          <div className='input-group search-input'>
            <div className='prepend-icon' onClick={handleFocus}>
              <Icon name={debounceLoading ? 'spinner' : 'search'} spin={debounceLoading} />
            </div>

            <input
              className='form-control'
              type='search'
              placeholder='Search your clients...'
              value={searchValue}
              onChange={handleOnChange}
              ref={textInput}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </div>
        </FormGroup>
      </Media>

      <Button
        size='md'
        className='ml-sm-2 mt-2 mt-sm-0 w-100 w-sm-auto'
        onClick={handleClick}
        leftIcon='add-person'
      >
        Add Client
      </Button>
    </Media>
  );
};

export default ClientsSearch;
