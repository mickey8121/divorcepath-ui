import React, { useCallback, useState } from 'react';

import { useHistory } from 'react-router-dom';
import classnames from 'classnames';
import { Container, ButtonGroup, Col, Row } from 'reactstrap';

import PlanPage from 'layout/PlanPage';

import Button from 'components/common/Button';

import PlanCards from 'components/billing/PlanCards';

import usePlanForAnalytics from 'hooks/usePlanForAnalytics';

const buttons = [
  {
    value: false,
    label: 'Personal',
  },
  {
    value: true,
    label: 'Professional',
  },
];

// ChooseBillingPlan component is for signed-in users, this component is for users who haven't signed up yet
// shows the same planCards as ChooseBillingPlan except instead of going to checkout immediately,
// save planId to localstorage for checkout after signup. Also different layout.
const Upgrade = () => {
  const { push } = useHistory();
  const getPlanForAnalytics = usePlanForAnalytics();

  const [planId, setPlanId] = useState(localStorage.getItem('planCode') || null);
  const [isProfessional, setIsPro] = useState(localStorage.getItem('isProfessional') === 'true');

  const handleProClick = useCallback(value => {
    localStorage.setItem('isProfessional', value);
    setIsPro(value);
  }, []);

  const handlePlanClick = useCallback(
    planCode => {
      // trigger conversion event for google analytics
      const dataLayer = window.dataLayer || [];
      dataLayer.push({ ecommerce: null });

      const plan = getPlanForAnalytics(planCode, isProfessional);

      dataLayer.push({
        event: 'add_to_cart',
        traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
        ecommerce: {
          items: plan,
        },
      });
      localStorage.setItem('planCode', planCode);
      setPlanId(planCode);
      push('/sign-up');
    },
    [getPlanForAnalytics, isProfessional, push],
  );

  return (
    <PlanPage noInvite>
      <div className='text-center mb-2'>
        <h6 className='h3 mb-2'>Choose your path.</h6>
        <Container>
          <Row className='justify-content-md-center'>
            <Col className='col-12 col-md-8 col-lg-6'>
              <p>
                Easy & accurate child support and spousal support calculations. Courtroom-ready
                reports in minutes. For lawyers, and for everyone.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
      <main className='home-page-content'>
        <Row className='justify-content-center mb-0'>
          <Col className='col-12 col-md-8 pl-2 pr-2 text-center'>
            <span>How will you use Divorcepath?</span>
            <div className='form-group mt-2'>
              <ButtonGroup className='custom-btn-group mb-0'>
                {buttons.map(({ value, label }) => (
                  <Button
                    key={value}
                    value={value}
                    className={classnames({ active: value === isProfessional })}
                    onClick={() => {
                      handleProClick(value);
                    }}
                  >
                    {label}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </Col>
        </Row>
        <Row className='justify-content-center'>
          <Col className='col-10 col-md-8 pl-2 pr-2 mt-2 mb-1 text-center'>
            {isProfessional === true ? (
              'Divorcepath Pro Tools enables you to calculate support for multiple clients, generate compelling, persuasive support reports, and keep track of client profile information.'
            ) : (
              <span>
                Our personal use plans allow you to calculate support yourself, generate a detailed
                and compelling support report, and prepare for mediation, court or negotiation.{' '}
                <br />
                <br />
                <em>*Personal plans are charged once, and are not recurring subscriptions.</em>
              </span>
            )}
          </Col>
        </Row>
        <Container className='pl-4 pr-4 mt-2 mt-sm-4 mt-md-5 pt-0'>
          <PlanCards
            isUserLawyer={isProfessional}
            isOrgMember={false}
            chosenPlanId={planId}
            handleClick={handlePlanClick}
          />
        </Container>
        <p className='plan-page-description mb-0 text-muted text-center'>
          Select the plan that's right for you. If you have questions, please don't hesitate to ask
          using the chat window or by emailing{' '}
          <a href='mailto:help@divorcepath.com'>help@divorcepath.com</a>.
        </p>
      </main>
    </PlanPage>
  );
};

export default Upgrade;
