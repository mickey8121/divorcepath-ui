import React, { Fragment, useMemo, useCallback, useEffect } from 'react';

import { Row } from 'reactstrap';

import CancelPlanModal from 'components/modals/profile/CancelPlanModal';

import PlanCard from 'components/billing/PlanCard';
import TogglePlanButtons from 'components/billing/TogglePlanButtons';
import {
  defaultPeriods,
  defaultPlans,
  getPlanList,
} from 'components/calculations/utils/defaultValues';

import useCurrentUser from 'hooks/useCurrentUser';

const { pro, client } = defaultPlans;

const dataLayer = window.dataLayer || [];

const PlanCards = ({
  isUserLawyer,
  isOrgMember,
  chosenPlanId,
  handleClick,
  loading,
  newChosenPlanId,
}) => {
  const { me, currentPeriodPlanLength, handleChangeCurrentPlanPeriodLength } = useCurrentUser();

  const planPeriod = useMemo(
    () => currentPeriodPlanLength || defaultPeriods[0].value,
    [currentPeriodPlanLength],
  );

  const TrialDescription = useCallback(() => {
    if (me?.subscription?.status === 'TRIALING') {
      return (
        <b className='billing-trial-description'>
          {me?.subscription?.plan?.trialDays || '7'}-day free trial before first invoice
        </b>
      );
    }

    return null;
  }, [me]);

  const buttons = useMemo(
    () =>
      defaultPeriods.map(({ value, label }) => ({
        value,
        label,
        onClick: () => handleChangeCurrentPlanPeriodLength(value),
      })),
    [handleChangeCurrentPlanPeriodLength],
  );

  const isActive = id => chosenPlanId === id;
  const isFree = id => id === pro.freePlan.FREE.id;
  const isClientFree = id => id === client.freePlan.FREE.id;

  const buttonText = (btnText, title) => (isFree(chosenPlanId) ? btnText : `Change to ${title}`);

  useEffect(() => {
    // trigger conversion event for google analytics

    dataLayer.push({ ecommerce: null });
    const planList = getPlanList(isUserLawyer);

    dataLayer.push({
      event: 'view_item_list',
      traffic_type: window.location.hostname === 'www.divorcepath.com' ? 'external' : 'internal',
      ecommerce: {
        items: planList,
      },
    });
  }, [isUserLawyer]);

  return (
    <div className='billing-container'>
      {isUserLawyer ? (
        <TrialDescription />
      ) : (
        <TogglePlanButtons buttons={buttons} currentValue={planPeriod} />
      )}
      <Row noGutters className={`billing-cards ${isUserLawyer ? 'pro' : ''}`}>
        {isUserLawyer ? (
          isOrgMember === false && (
            <Fragment>
              {Object.values(pro.subscription).map(
                ({ className, id, pricePrepend, price, title, btnText, subPrice, features }) => (
                  <PlanCard
                    key={id}
                    className={className}
                    isActive={isActive(id)}
                    pricePrepend={pricePrepend}
                    price={price}
                    title={title}
                    btnText={buttonText(btnText, title)}
                    subPrice={subPrice}
                    features={features}
                    loading={newChosenPlanId === id && loading}
                    handleClick={() => handleClick(id)}
                  />
                ),
              )}
              <PlanCard
                className={pro.freePlan.FREE.className}
                isActive={isFree(chosenPlanId)}
                title={pro.freePlan.FREE.title}
                price={pro.freePlan.FREE.price}
                subPrice={pro.freePlan.FREE.subPrice}
                btnText={pro.freePlan.FREE.btnText}
                features={pro.freePlan.FREE.features}
                loading={newChosenPlanId === pro.freePlan.FREE.id && loading}
                handleClick={() => handleClick(pro.freePlan.FREE.id)}
              />
            </Fragment>
          )
        ) : (
          <Fragment>
            {Object.values(client[planPeriod]).map(
              ({
                className,
                id,
                pricePrepend,
                price,
                title,
                btnText,
                subPrice,
                features,
                isBest,
              }) => (
                <PlanCard
                  key={id}
                  className={className}
                  isActive={isActive(id)}
                  pricePrepend={pricePrepend}
                  price={price}
                  title={title}
                  btnText={btnText}
                  subPrice={subPrice}
                  features={features}
                  isBest={isBest}
                  loading={newChosenPlanId === id && loading}
                  handleClick={() => handleClick(id)}
                />
              ),
            )}
            <PlanCard
              className={client.freePlan.FREE.className}
              isActive={isClientFree(chosenPlanId)}
              title={client.freePlan.FREE.title}
              price={client.freePlan.FREE.price}
              subPrice={client.freePlan.FREE.subPrice}
              btnText={client.freePlan.FREE.btnText}
              features={client.freePlan.FREE.features}
              loading={newChosenPlanId === client.freePlan.FREE.id && loading}
              handleClick={() => handleClick(client.freePlan.FREE.id)}
            />
          </Fragment>
        )}
      </Row>
      <CancelPlanModal />
    </div>
  );
};

export default PlanCards;
