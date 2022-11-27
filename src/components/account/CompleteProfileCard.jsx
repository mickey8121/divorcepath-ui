import React, { useMemo } from 'react';

import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardDeck, CardFooter, Col, Row, Media } from 'reactstrap';

import Button from 'components/common/Button';

const CompleteProfileCard = ({ me }) => {
  const profileProgress = useMemo(() => me?.client?.profileProgress || [], [me]);
  const progressKeys = useMemo(
    () => Object.keys(profileProgress).filter(key => profileProgress[key] !== 'COMPLETE'),
    [profileProgress],
  );
  const path = useMemo(
    () => (progressKeys.length ? `profile/${progressKeys[1]}` : 'profile'),
    [progressKeys],
  );

  return (
    <CardDeck className='flex-lg-column'>
      <Col>
        <Card className='shadow-hover mb-3'>
          <CardHeader className='py-3'>
            <div className='d-flex justify-content-between align-items-center'>
              <h6 className='mb-0'>Complete your Profile</h6>
            </div>
          </CardHeader>
          <CardBody className='pt-3'>
            <Media className='d-flex align-top'>
              <img
                alt='placeholder'
                src='./img/icons/dusk/svg/contacts.svg'
                className='img-saturate'
              />
              <Media body className='ml-3'>
                <p className='mb-2'>
                  Enter some basic personal information about yourself and your family to complete
                  your profile.
                </p>
                <p className='mb-2'>
                  We&apos;ll save this information to your profile, and use it in your support
                  calculations.
                </p>
              </Media>
            </Media>
          </CardBody>
          <CardFooter>
            <Row className='align-items-center'>
              <Col>
                <Link to={path}>
                  <Button>Complete Profile</Button>
                </Link>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </Col>
    </CardDeck>
  );
};

export default CompleteProfileCard;
