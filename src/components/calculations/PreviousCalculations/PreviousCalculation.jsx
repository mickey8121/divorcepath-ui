import React, { useState, useCallback, useMemo, Fragment } from 'react';

import { Link, useLocation } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import { ListGroupItem, Row, Collapse, Col } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';

import Button from 'components/common/Button';
import Badge from 'components/common/Badge';
import Icon from 'components/common/Icon';

import GeneratePDFButtonContainer from 'components/calculations/SupportReport/components/GeneratePDF/GeneratePDFButtonContainer';
import ShareCalculationForm from 'components/calculations/shareCalculation/ShareCalculationForm';

import useCurrentUser from 'hooks/useCurrentUser';

import ME from 'graphql/queries/user/me';
import CLIENT_FRAGMENT from 'graphql/fragments/client';
import REMOVE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/removeSupportCalculation';
import CHANGE_SHARE_SUPPORT_CALCULATION from 'graphql/mutations/calculations/changeShareSupportCalculation';
import SHARED_SUPPORT_CALCULATIONS from 'graphql/queries/calculations/sharedSupportCalculations';

const checkIsActive = emails => emails?.find(({ status }) => status === 'ACTIVE');

const PreviousCalculation = ({ calculation, clientId, isShared }) => {
  const [isOpen, toggleOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [deleteNotification] = useMutation(CHANGE_SHARE_SUPPORT_CALCULATION);

  const { pathname } = useLocation();

  const { isActiveSub, isPro, me } = useCurrentUser();

  const [removeSupportCalculation] = useMutation(REMOVE_SUPPORT_CALCULATION);

  const { id, title, createdAt, updatedAt, showSpousalSupport } = calculation;

  const handleClick = useCallback(() => toggleOpen(!isOpen), [isOpen]);

  const isSharedByYou = useMemo(
    () => !isPro && Boolean(calculation?.shares?.find(({ email }) => email !== me?.email)),
    [calculation?.shares, me?.email, isPro],
  );

  const path = useMemo(
    () =>
      isShared
        ? `/shared-calculation/${id}`
        : `/${showSpousalSupport ? 'spousal' : 'child'}-support/${id}${
            isPro ? `/${clientId}` : ''
          }`,
    [isShared, clientId, showSpousalSupport, id, isPro],
  );

  const handleDeleteCalculation = useCallback(() => {
    const variables = { where: { id } };

    setSubmitting(true);

    if (isShared) {
      return deleteNotification({
        variables: {
          data: {
            email: me.email,
            supportCalculationId: id,
          },
        },
        update: cache => {
          try {
            const { sharedSupportCalculations } = cache.readQuery({
              query: SHARED_SUPPORT_CALCULATIONS,
            });

            cache.writeQuery({
              query: SHARED_SUPPORT_CALCULATIONS,
              data: {
                sharedSupportCalculations: sharedSupportCalculations.filter(
                  sharedNotification => sharedNotification.id !== id,
                ),
              },
            });
          } catch (error) {
            toast.error(error.message);
          }
        },
      })
        .then(() => {
          toast.success('Shared calculation was deleted');
        })
        .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)));
    }

    removeSupportCalculation({
      variables,
      update: (cache, { data }) => {
        try {
          let cacheClient;

          try {
            cacheClient = cache.readFragment({
              id: `Client:${clientId}`,
              fragment: CLIENT_FRAGMENT,
              fragmentName: 'CLIENT_FRAGMENT',
            });
          } catch (error) {}

          const clientCalculations = cache.readQuery({ query: ME, skip: !me?.client?.id });

          cache.writeQuery({
            query: ME,
            data: {
              me: {
                ...clientCalculations.me,
                client: {
                  ...clientCalculations.me?.client,
                  supportCalculations: clientCalculations.me?.client?.supportCalculations.filter(
                    supportCalculation =>
                      supportCalculation.id !== data.removeSupportCalculation.id,
                  ),
                },
              },
            },
          });

          cache.writeFragment({
            id: `Client:${clientId}`,
            fragment: CLIENT_FRAGMENT,
            fragmentName: 'CLIENT_FRAGMENT',
            data: {
              ...cacheClient,
              supportCalculations: cacheClient?.supportCalculations.filter(
                supportCalculation => supportCalculation.id !== data.removeSupportCalculation.id,
              ),
            },
          });
        } catch (error) {}
      },
    })
      .catch(err => err.graphQLErrors.map(({ message }) => toast.error(message)))
      .finally(() => setSubmitting(false));
  }, [id, clientId, removeSupportCalculation, me, deleteNotification, isShared]);

  const showSharedWithYou = useMemo(
    () => !pathname.includes('spousal-support') && !pathname.includes('child-support'),
    [pathname],
  );

  return (
    <ListGroupItem className='px-0' key={calculation?.id}>
      <Row className='no-gutters cursor-pointer list-line' onClick={handleClick}>
        <Col xs={6} md={3} className='text-limit pr-2'>
          <Link to={path} className='calculation-link'>
            {title || id}
          </Link>
        </Col>

        <Col xs={3} md={2} className='text-limit'>
          {showSpousalSupport ? 'Spousal' : 'Child'}
        </Col>

        <Col md={2} className='d-none d-md-block text-limit'>
          {dayjs(createdAt).format('MMM-DD-YYYY')}
        </Col>

        <Col className='d-none d-md-block text-limit'>{dayjs(updatedAt).format('MMM-DD-YYYY')}</Col>

        {!isEmpty(calculation.shares) && checkIsActive(calculation.shares) && (
          <Col className='d-none d-md-block text-limit text-right'>
            <Badge
              className={`custom-badge ${
                isSharedByYou ? 'shared-by-you' : isShared && 'shared-with-you'
              }`}
            >
              {isSharedByYou ? 'Shared by you' : isShared && 'Shared with you'}
            </Badge>
          </Col>
        )}

        {!calculation.shares && (
          <Col className='d-none d-md-block text-limit text-right'>
            <Badge className={`custom-badge ${isShared && 'shared-with-you'}`}>
              {isShared && 'Shared with you'}
            </Badge>
          </Col>
        )}

        <Col xs={2} md={1} className='text-right text-md-center pr-2 pr-md-0 text-limit'>
          <Icon name={`arrow-${isOpen ? 'up' : 'down'}`} width='17' height='17' />
        </Col>
      </Row>

      <Collapse isOpen={isOpen}>
        <GeneratePDFButtonContainer
          propsCalculationId={id}
          isOpen={isOpen}
          isSubActive={isActiveSub}
          isCalculationCard
        >
          <Fragment>
            {showSharedWithYou && !isShared && (
              <ShareCalculationForm
                calculationId={calculation?.id}
                sharedWith={calculation?.shares}
                isClientsList
              />
            )}

            <Button
              size='sm'
              color='red-link'
              onClick={handleDeleteCalculation}
              disabled={submitting}
              leftIcon='trash'
            >
              Delete Calculation
            </Button>
          </Fragment>
        </GeneratePDFButtonContainer>

        <div className='d-flex justify-content-between mt-2 justify-content-md-end flex-column flex-sm-row'>
          <div className='calculation-info d-md-none mb-2 mb-sm-0'>
            <div className='info-item'>
              <span>Created: </span>
              <span>{dayjs(createdAt).format('MMM-DD-YYYY')}</span>
            </div>
            <div className='info-item'>
              <span>Updated: </span>
              <span>{dayjs(updatedAt).format('MMM-DD-YYYY')}</span>
            </div>
          </div>
        </div>
      </Collapse>
    </ListGroupItem>
  );
};

export default PreviousCalculation;
