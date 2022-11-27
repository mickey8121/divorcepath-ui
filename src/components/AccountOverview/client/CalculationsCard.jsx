import React, { useMemo } from 'react';

import { Card, CardHeader, CardFooter, Row } from 'reactstrap';

import CalculationsTypeDropdown from 'components/common/CalculationsTypeDropdown';

import PreviousCalculations from 'components/calculations/PreviousCalculations/PreviousCalculations';

import useCurrentUser from 'hooks/useCurrentUser';

const CalculationsCard = ({ calculationsClient, client }) => {
  const { me } = useCurrentUser();

  const clientChildren = useMemo(() => me?.client?.children, [me]);

  return (
    <Card className='calculations-card shadow-hover mb-6 mb-3 mt-3'>
      <CardHeader>
        <Row className='px-3 align-items-center' id='client'>
          <span className='avatar mr-4'>
            <img
              alt='placeholder'
              src='./img/icons/dusk/png/client-base.png'
              className='img-saturate'
            />
          </span>
          <h4 className='m-0'>{`${calculationsClient} Saved Calculations`}</h4>
        </Row>
      </CardHeader>

      <PreviousCalculations isHaveHeader={false} clientName={calculationsClient} client={client} />

      <CardFooter className='calculations-card-footer justify-content-start'>
        <CalculationsTypeDropdown
          client={me?.client}
          clientChildren={clientChildren}
          headerMenuLabel='Calculations'
        />
      </CardFooter>
    </Card>
  );
};

export default CalculationsCard;
