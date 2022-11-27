import React from 'react';

import styled from 'styled-components';
import { Progress } from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PreloaderStyles = styled.div`
  .preloader .query {
    margin: 30px 0;
    text-align: center;
  }
`;

const Preloader = ({ text, type, style, mutationClassName }) => {
  if (type === 'query') {
    return <Progress style={style} animated color='info' value='100' />;
  }

  if (type === 'mutation') {
    return (
      <div className={mutationClassName}>
        <FontAwesomeIcon icon='spinner' style={{ color: '#6E00FF' }} spin />
        {text || null}
      </div>
    );
  }

  return (
    <PreloaderStyles>
      <div className='preloader'>{text || 'Loading...'}</div>
    </PreloaderStyles>
  );
};

export default Preloader;
