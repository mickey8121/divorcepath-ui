import React, { Fragment, useMemo, useCallback } from 'react';

import { useQuery } from '@apollo/client';
import { ListGroup, ListGroupItem, Row, Col, CardHeader } from 'reactstrap';

import Preloader from 'components/common/Preloader';

import PreviousCalculation from 'components/calculations/PreviousCalculations/PreviousCalculation';

import useCurrentUser from 'hooks/useCurrentUser';

import SHARED_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/sharedSupportCalculations';

import { ReactComponent as NoCalculations } from 'img/backgrounds/no-calculations.svg';

const PreviousCalculations = ({ isHaveHeader, clientName, client }) => {
  const { me } = useCurrentUser();

  const { data: { sharedSupportCalculations } = [], loading: calculationsLoading } = useQuery(
    SHARED_SUPPORT_CALCULATIONS,
    { skip: !me?.client },
  );

  const sharedCalculations = useMemo(() => {
    if (!calculationsLoading || sharedSupportCalculations) return sharedSupportCalculations;
  }, [calculationsLoading, sharedSupportCalculations]);

  const isClient = useMemo(() => me?.client, [me]);

  const calculations = useMemo(() => {
    return me?.client?.supportCalculations || client?.supportCalculations;
  }, [me, client]);

  const Content = useCallback(() => {
    if (calculations?.length || sharedSupportCalculations?.length) {
      return (
        <ListGroup className='previous-calc-list mb-2' flush>
          <ListGroupItem className='px-0'>
            <Row noGutters className='small'>
              <Col xs={6} md={3} className='pr-2'>
                Title
              </Col>

              <Col className='pr-2' xs={3} md={2}>
                Type
              </Col>

              <Col md={2} className='d-none d-md-block pr-2'>
                Created
              </Col>

              <Col className='d-none d-md-block pr-2'>Updated</Col>

              <Col xs={2} md={1} className='text-right text-md-center text-nowrap pr-2' />
            </Row>
          </ListGroupItem>

          {calculations?.map(calculation => (
            <PreviousCalculation
              key={calculation.id}
              calculation={calculation}
              clientId={client?.id}
            />
          ))}

          {!me?.professional &&
            !calculationsLoading &&
            sharedCalculations?.map(calculation => (
              <PreviousCalculation
                key={calculation.id}
                calculation={calculation}
                clientId={calculation.clientSupportProfile.id}
                isShared
              />
            ))}
        </ListGroup>
      );
    }

    if (isClient) {
      return (
        <div className='welcome-card'>
          <h5>Welcome!</h5>
          <p>
            {me.client.profile.firstName}, welcome to Divorcepath. Here's a few tips to get started:
          </p>
          <ul>
            <li>Calculate child support or spousal support by clicking the buttons below</li>
            <li>Your saved support calculations will be listed here</li>
          </ul>
          <p>
            Get help at any time by clicking the chat button on the lower-right corner of your
            screen, or visiting the{' '}
            <a target='new' href='https://www.divorcepath.com/help'>
              Help Centre
            </a>
            .
          </p>
        </div>
      );
    }

    return (
      <div className='no-calculations'>
        <NoCalculations />
        <p>No calculations for this client</p>
      </div>
    );
  }, [
    calculations,
    sharedSupportCalculations?.length,
    isClient,
    me,
    calculationsLoading,
    sharedCalculations,
    client?.id,
  ]);

  if (calculationsLoading) return <Preloader />;

  return (
    <Fragment>
      {isHaveHeader && (
        <CardHeader className='py-4 pl-4'>
          <h6 className='mb-1'>{`${clientName} Saved Calculations`}</h6>
          <p className='mb-0'>Review, edit or delete saved calculations</p>
        </CardHeader>
      )}

      <Content />
    </Fragment>
  );
};

export default PreviousCalculations;
