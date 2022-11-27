import React, { useState, useCallback, useMemo } from 'react';

import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { ListGroupItem, Row, Collapse, Col } from 'reactstrap';

import Icon from 'components/common/Icon';

import InterviewFields from 'components/interviews/InterviewFields';

import useCurrentUser from 'hooks/useCurrentUser';

const Interview = ({ interview, client }) => {
  const [isOpen, toggleOpen] = useState(false);

  const { me } = useCurrentUser();

  const formUrn = useMemo(
    () => me?.professional?.organization?.formUrn,
    [me?.professional?.organization?.formUrn],
  );

  const { token, status, createdAt, updatedAt } = interview || {};

  const handleClick = useCallback(() => toggleOpen(!isOpen), [isOpen]);

  const path = useMemo(
    () => `${process.env.REACT_APP_INTAKE_FORM_LINK}/interview/${formUrn}/${token}`,
    [token, formUrn],
  );

  return (
    <ListGroupItem className='px-0'>
      <Row className='no-gutters cursor-pointer list-line' onClick={handleClick}>
        <Col xs={6} md={3} className='text-limit pr-2'>
          <a href={path} target='_blank' rel='noopener noreferrer' className='calculation-link'>
            Interview
          </a>
        </Col>

        <Col xs={4} md={2} className='text-limit'>
          {capitalize(status)}
        </Col>

        <Col className='d-none d-md-block text-limit'>{dayjs(createdAt).format('MMM-DD-YYYY')}</Col>

        <Col className='d-none d-md-block text-limit'>
          {status === 'COMPLETE' ? dayjs(updatedAt).format('MMM-DD-YYYY') : '-'}
        </Col>

        <Col xs={2} md={1} className='text-right text-md-center pr-2 pr-md-0 text-limit'>
          <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} height='17' width='17' />
        </Col>
      </Row>

      <Collapse isOpen={isOpen} className='interview-collapse'>
        <InterviewFields token={token} client={client} isOpen={isOpen} />
      </Collapse>
    </ListGroupItem>
  );
};

export default Interview;
