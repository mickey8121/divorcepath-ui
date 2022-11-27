import React, { useMemo, useCallback, useEffect, useState } from 'react';

import { connect, useFormikContext } from 'formik';
import { useHistory, useParams } from 'react-router';
import * as dayjs from 'dayjs';
import classNames from 'classnames';
import { throttle } from 'lodash';
import relativeTime from 'dayjs/plugin/relativeTime';

import ChildSupportType from 'components/calculations/components/common/ChildSupportType';
import ScrollLink from 'components/common/ScrollLink';

import SidebarTimelineItem from 'components/calculations/sidebar/SidebarTimelineItem';
import ResultsSection from 'components/calculations/sidebar/ResultsSection';
import CalculateButtons from 'components/calculations/CalculateButtons';
import regionNames from 'components/calculations/utils/regionNames';

import useCalculationContext from 'hooks/useCalculationContext';

import toUSD from 'utils/toUSD';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

dayjs.extend(relativeTime);

const Sidebar = ({
  updatedAt,
  isSubmitting,
  handleSubmit,
  isChanged,
  setIsChanged,
  supportCalculation,
  loading,
  queryLoading,
  showTaxes,
}) => {
  const { isProfessional, type } = useCalculationContext();
  const { clientId } = useParams();
  const { touched, values } = useFormikContext();

  const { push } = useHistory();

  // const agreedChildSupport = customGet(supportCalculation, 'agreedChildSupport');
  // const s3childSupport = Math.abs(
  //   customGet(supportCalculation, 'childSupport.client.netMonthlySupport', 0)
  // );
  // const childSupportDisplayValue = agreedChildSupport >= 0 ? agreedChildSupport : s3childSupport;

  // const minDuration = customGet(supportCalculation, 'spousalSupport.minDuration', 0);
  // const maxDuration = customGet(supportCalculation, 'spousalSupport.maxDuration', 0);
  // let indefiniteDuration = false;
  // if (minDuration > 99) {
  //   indefiniteDuration = true;
  // }

  const profile = useMemo(() => values?.clientSupportProfile, [values]);
  const exProfile = useMemo(() => values?.exSupportProfile, [values]);

  const clientName = useMemo(
    () => `${profile?.firstName || ''} ${profile?.lastName || ''}`,
    [profile],
  );

  const SavingInfo = useCallback(() => {
    if (isSubmitting) return <em>Saving...</em>;

    return (
      <span>
        <span>Saved </span>
        {dayjs(updatedAt).fromNow()}
      </span>
    );
  }, [updatedAt, isSubmitting]);

  const relationship = useMemo(
    () =>
      dayjs(values?.relationship?.separationDate).diff(
        values?.relationship?.cohabitationDate,
        'years',
      ),
    [values],
  );

  const children = useMemo(() => values?.children, [values]);

  const totalIncome = useCallback(
    profileType =>
      values?.[profileType]?.income?.all.reduce(
        (acc, item) => acc + parseInt(item?.userAmount || item?.amount, 10) || 0,
        0,
      ) +
      values?.[profileType]?.adjustments?.all?.reduce(
        (acc, item) => acc + parseInt(item?.userAmount || item?.amount, 10) || 0,
        0,
      ),
    [values],
  );

  const clientTotalIncome = useMemo(() => totalIncome('clientSupportProfile'), [totalIncome]);
  const exTotalIncome = useMemo(() => totalIncome('exSupportProfile'), [totalIncome]);

  const linkToProfile = useMemo(
    () => (
      <span className='text-link link-to-profile' onClick={() => push(`/clients/${clientId}/edit`)}>
        profile
      </span>
    ),
    [clientId, push],
  );

  const resultsSectionCount = useMemo(
    () => (type === 'create' && !showTaxes ? 5 : 6),
    [type, showTaxes],
  );

  const [current, setCurrent] = useState('#calculation');

  const getChildParenting = useCallback(
    child => {
      if (!child?.isOfRelationship || !child?.parenting) return 'other';

      if (isProfessional) return child.parenting.toLowerCase();

      return child.parenting === 'CLIENT' ? 'you' : child.parenting.toLowerCase();
    },
    [isProfessional],
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mainNavLinks = document.querySelectorAll('.timeline-item a');
      const height = document.documentElement.clientHeight;

      const handleScroll = throttle(() => {
        if (window.scrollY === 0) {
          setCurrent('#calculation');
        } else {
          const currentLink = [...mainNavLinks].find(link => {
            if (link.name) {
              const section = document.querySelector(link.name);

              if (section) {
                const { top, bottom } = section.getBoundingClientRect();

                return (top >= 0 && top < height / 3) || bottom > height / 2;
              }
            }

            return false;
          });

          if (currentLink) {
            setCurrent(currentLink.name);
          }
        }
      }, 100);

      window.addEventListener('scroll', handleScroll);
      handleScroll();

      return () => window.removeEventListener('scroll', handleScroll);
    }

    return () => {};
  }, [supportCalculation]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div className='sidebar-container'>
      <div className='custom-timeline'>
        <div
          className='timeline-item my-0 pb-4'
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <ScrollLink to='#calculation' onClick={handleMouseLeave}>
            <span
              className={classNames(
                'custom-timeline-step bg-primary border-primary text-white',
                'custom-timeline-step-hover-primary',
                {
                  'custom-timeline-step-shadow-primary': current === '#calculation' || isHovered,
                },
              )}
            >
              1
            </span>
            <div className={classNames('timeline-item-content', { underline: isHovered })}>
              <h6
                className={classNames('text-sm mb-1', {
                  underline: current === '#calculation',
                })}
              >
                Calculation
              </h6>

              <div className='text-muted text-sm mt-0 truncated'>
                {clientName.trim() || 'New Client'}

                {isProfessional && clientId && linkToProfile}
              </div>

              <div className='truncated'>
                <small className='text-muted timeline-item-text'>
                  <FontAwesomeIcon icon='file' className='mr-2' />
                  {values?.title || 'Untitled calculation'}
                </small>
              </div>

              {updatedAt && (
                <div className='truncated'>
                  <small className='text-muted truncated'>
                    <FontAwesomeIcon icon='save' className='mr-1' />
                    <SavingInfo />
                  </small>
                </div>
              )}
            </div>
          </ScrollLink>
        </div>
      </div>

      <SidebarTimelineItem
        id='#background'
        index='2'
        color='info'
        title='Background'
        current={current}
      >
        <div className='text-muted text-sm truncated'>
          {profile?.firstName || 'Client & '}
          {profile?.firstName && ' & '}
          {exProfile?.firstName || 'Ex'}
        </div>

        <div className='truncated'>
          <small className='text-muted'>
            <FontAwesomeIcon icon='user' className='mr-1' />
            {profile?.birthDate ? `${dayjs().diff(profile?.birthDate, 'years')} / ` : ''}
            {profile?.gender ? `${profile?.gender.charAt(0)} / ` : ''}
            {regionNames[profile?.residence]} / {profile?.hasNewPartner ? ' R' : ' S'}
          </small>
        </div>

        <div className='truncated'>
          <small className='text-muted'>
            <FontAwesomeIcon icon='user' className='mr-1' />
            {exProfile?.birthDate ? `${dayjs().diff(exProfile?.birthDate, 'years')} / ` : ''}
            {exProfile?.gender ? `${exProfile?.gender.charAt(0)} / ` : ''}
            {regionNames[exProfile?.residence]} / {exProfile?.hasNewPartner ? ' R' : ' S'}
          </small>
        </div>

        {!!relationship && (
          <div className='truncated'>
            <small className='text-muted'>
              <FontAwesomeIcon icon='clock' className='mr-1' />
              {relationship} year relationship
            </small>
          </div>
        )}
      </SidebarTimelineItem>

      <SidebarTimelineItem
        id='#children'
        index='3'
        color='success'
        title='Children'
        current={current}
      >
        {children?.map((child, index) => (
          <div className='truncated' key={child?.id || index}>
            <small className='text-muted'>
              <FontAwesomeIcon icon='child' className='mr-1' />
              {child?.firstName} /{' '}
              {child?.birthDate &&
                dayjs().diff(child.birthDate, 'years') - (dayjs().year() - values.taxYear)}{' '}
              / {getChildParenting(child)} /{' '}
            </small>
            <ChildSupportType child={child} abridged />
            <br />
          </div>
        ))}

        {!children?.length && <small className='text-muted'>N/A</small>}
      </SidebarTimelineItem>

      <SidebarTimelineItem id='#income' index='4' color='warning' title='Income' current={current}>
        {!values?.clientSupportProfile?.income && (
          <div className='truncated'>
            <small className='text-muted'>N/A</small>
          </div>
        )}

        <div className='truncated'>
          <small className='text-muted'>
            <FontAwesomeIcon icon='money-bill-alt' className='mr-1' />
            {isProfessional ? 'Client' : 'You'}: {toUSD(clientTotalIncome)}
          </small>
        </div>

        {profile?.hasNewPartner && (
          <div className='truncated'>
            <small className='text-muted'>
              <FontAwesomeIcon icon='money-bill-alt' className='mr-1' />
              {isProfessional ? "Client's " : 'Your '} Partner: {toUSD(profile?.partnerIncome)}
            </small>
            <br />
          </div>
        )}

        <div className='truncated'>
          <small className='text-muted'>
            <FontAwesomeIcon icon='money-bill-alt' className='mr-1' />
            Ex: {toUSD(exTotalIncome)}
          </small>
        </div>

        {exProfile?.hasNewPartner && (
          <div className='truncated'>
            <small className='text-muted'>
              <FontAwesomeIcon icon='money-bill-alt' className='mr-1' />
              Ex partner: {toUSD(exProfile?.partnerIncome)}
            </small>
          </div>
        )}
      </SidebarTimelineItem>

      {(type === 'update' || showTaxes) && (
        <SidebarTimelineItem
          id='#tax'
          index='5'
          color='danger'
          title='Taxes & Benefits'
          current={current}
        >
          <div className='truncated'>
            <small className='text-muted'>
              <FontAwesomeIcon icon='calculator' className='mr-1' />
              {/* {isCalculated ? automatically calculated : enter inputs to calculate} */}
              Automatically calculated
            </small>
          </div>
        </SidebarTimelineItem>
      )}

      <SidebarTimelineItem
        id='#results'
        index={resultsSectionCount}
        color='dark'
        title='Results'
        current={current}
        noLink={!!supportCalculation?.calculationResult}
      >
        <ResultsSection
          supportCalculation={supportCalculation}
          isSubmitting={isSubmitting}
          handleSubmitForm={handleSubmit}
          values={values}
          isChanged={isChanged}
        />
      </SidebarTimelineItem>

      <div className='mt-3 sidebar-buttons'>
        <CalculateButtons
          supportCalculation={supportCalculation}
          values={values}
          touched={touched}
          handleSubmit={handleSubmit}
          loading={loading}
          queryLoading={queryLoading}
          setIsChanged={setIsChanged}
          isChanged={isChanged}
        />
      </div>
    </div>
  );
};

export default connect(Sidebar);
