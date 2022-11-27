import React from 'react';

import { FieldArray } from 'formik';
import { uniqueId } from 'lodash/util';
import { Col } from 'reactstrap';

import Icon from 'components/common/Icon';

const ShareCalculationList = ({ emails, loading, updateLoading, removeHandler }) => (
  <FieldArray
    name='emails'
    render={arrayHelper => {
      if (emails?.length) {
        return emails?.map(email => (
          <React.Fragment key={uniqueId()}>
            <Col md={10} xs={10} className='shared-with-row text-truncate border-bottom'>
              <p className='mb-1 mt-1'>{email}</p>
            </Col>

            <Col md={2} xs={2} className='d-flex justify-content-end border-bottom'>
              <div
                className='remove-email close-btn pb-0'
                onClick={() => !updateLoading && removeHandler(arrayHelper, email)}
              >
                <Icon name='cross' />
              </div>
            </Col>
          </React.Fragment>
        ));
      }

      if (loading || updateLoading) {
        return (
          <div className='loading'>
            <Icon name='spinner' spin className='mr-2' />
          </div>
        );
      }

      if (!loading || !updateLoading) {
        return (
          <Col md={12} xs={12}>
            <p className='text-muted pt-2 text-center not-shared'>
              This calculation was not shared
            </p>
          </Col>
        );
      }
    }}
  />
);

export default ShareCalculationList;
