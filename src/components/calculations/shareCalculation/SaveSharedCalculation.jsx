import React, { useMemo } from 'react';

import { Col, Row } from 'reactstrap';

import Button from 'components/common/Button';
import Icon from 'components/common/Icon';

import useModal from 'hooks/useModal';

import getUserName from 'utils/getUserName';

const SaveSharedCalculation = ({ sharedBy, loading }) => {
  const sharedClientName = useMemo(() => getUserName(sharedBy), [sharedBy]);
  const { open: openSaveModal } = useModal('SAVE_CALCULATION');

  return (
    <div className='d-flex align-items-flex-start mb-4 flex-column justify-content-between shared-calculation-notification'>
      <Row className='container-fluid m-0 p-0'>
        <div className='container-fluid header-shared'>
          <Icon name='calculator' className='calc-icon' height='20' width='20' />
          <span className='pl-0 shared-calculation-notification-text'>Shared calculation</span>
        </div>

        <Col md={12} className='p-0'>
          <div className='pl-0 shared-calculation-info'>
            <div className='border-top' />

            <div className='client-info pl-4 py-3'>
              {loading ? (
                <div className='loading'>
                  <Icon name='spinner' spin className='mr-2' />
                </div>
              ) : (
                <span className='client-text-info'>
                  {`${
                    sharedBy ? sharedClientName : 'New client'
                  } shared this calculation with you. Save a copy of the calculation if you’d like to make changes.`}
                </span>
              )}
            </div>
          </div>
        </Col>

        <Col md={12} className='p-0'>
          <div className='pl-0 shared-calculation-buttons'>
            <div className='border-top' />

            <div className=' pl-4 py-3'>
              <Button
                size='sm'
                className='px-4 py-2 save-shared-calculation'
                onClick={openSaveModal}
              >
                Save Copy & Edit
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default SaveSharedCalculation;
