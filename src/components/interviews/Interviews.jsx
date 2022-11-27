import React, { Fragment } from 'react';

import { ListGroup, ListGroupItem, Row, Col } from 'reactstrap';

import Interview from 'components/interviews/Interview';

import { ReactComponent as NoInterviews } from 'img/backgrounds/no-interviews.svg';

const Interviews = ({ interviews, client }) => {
  return (
    <Fragment>
      {interviews.length ? (
        <ListGroup className='previous-calc-list' flush>
          <ListGroupItem className='px-0'>
            <Row noGutters className='small'>
              <Col xs={6} md={3} className='pr-2'>
                Title
              </Col>

              <Col className='pr-2' xs={4} md={2}>
                Status
              </Col>

              <Col className='d-none d-md-block pr-2'>Sent</Col>

              <Col className='d-none d-md-block pr-2'>Completed</Col>

              <Col xs={2} md={1} className='text-right text-md-center text-nowrap pr-2' />
            </Row>
          </ListGroupItem>

          {interviews?.map(interview => (
            <Interview key={interview.id} interview={interview} client={client} />
          ))}
        </ListGroup>
      ) : (
        <div className='no-interviews'>
          <NoInterviews />
          <p>No interviews for this client</p>
        </div>
      )}
    </Fragment>
  );
};

export default Interviews;
