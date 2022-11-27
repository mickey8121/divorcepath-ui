import React from 'react';

import { Container } from 'reactstrap';

import ChooseBillingPlan from 'components/billing/ChooseBillingPlan';

const ChooseBillingPlanPage = () => (
  <main className='home-page-content'>
    <Container className='pl-4 pr-4 mt-0 mt-sm-5'>
      <ChooseBillingPlan />
    </Container>
  </main>
);

export default ChooseBillingPlanPage;
