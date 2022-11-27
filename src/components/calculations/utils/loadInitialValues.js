import dayjs from 'dayjs';
import { get } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

import { fillSupportProfile, fillChildren, fillIncomeValue } from './initialValues';
import { regionsKeys } from './regionNames';
import { defaultChildren } from './defaultValues';

const loadInitialValues = ({
  calculatorType,
  client,
  hasChildren,
  isSubscriptionActive,
  me,
  showChildSupport,
  supportCalculation,
  type,
  isProfessional,
}) => {
  const defaultClientResidence =
    supportCalculation?.clientSupportProfile?.residence ||
    client?.address?.residence ||
    regionsKeys[get(me, 'professional.locations.0.residence')] ||
    'Alberta';

  const defaultExResidence =
    supportCalculation?.exSupportProfile?.residence ||
    client?.exAddress?.residence ||
    regionsKeys[get(me, 'professional.locations.0.residence')] ||
    'Alberta';
  // const maxDuration = supportCalculation?.calculationResult?.spousalSupport?.maxDuration;

  // const indefiniteDuration =
  //   supportCalculation?.calculationResult?.spousalSupport?.minDuration > 99;

  const clientHasChildren = !!client?.children?.length > 0;

  const hasChildrenValue =
    typeof hasChildren === 'undefined' || type === 'update'
      ? (type === 'create' && clientHasChildren) ||
        calculatorType === 'CHILD' ||
        supportCalculation?.hasChildren ||
        false
      : hasChildren;

  const getChildren = () => {
    if (!hasChildren && type === 'create' && calculatorType !== 'CHILD') return undefined;
    if (
      clientHasChildren ||
      calculatorType === 'CHILD' ||
      supportCalculation?.hasChildren ||
      hasChildren
    ) {
      const children = type === 'update' ? supportCalculation?.children : client?.children;
      const defaultChildrenValue = [{ ...defaultChildren, firstName: 'Child 1', id: uuidv4() }];

      if (children?.length) return fillChildren(children, type);
      if (!children?.length && type === 'create') return fillChildren(defaultChildrenValue, type);

      return undefined;
    }

    return undefined;
  };

  const initialValues = {
    title: supportCalculation?.title || `Untitled Calculation`,
    agreedChildSupport: supportCalculation?.agreedChildSupport || -1,
    agreedSpousalSupport: supportCalculation?.agreedSpousalSupport || -1,
    showSpousalSupport: supportCalculation?.showSpousalSupport || calculatorType === 'SPOUSAL',
    showChildSupport,
    npvDiscountRate: supportCalculation?.npvDiscountRate || 4,
    npvDuration: supportCalculation?.npvDuration || null,
    taxYear: supportCalculation?.taxYear || dayjs().format('YYYY'),
    hasChildren: hasChildrenValue,

    clientSupportProfile: fillSupportProfile({
      supportProfile: supportCalculation?.clientSupportProfile,
      profile: client?.profile,
      isSubscriptionActive,
      type,
      defaultName: isProfessional ? 'Client' : 'You',
      defaultResidence: defaultClientResidence,
    }),

    exSupportProfile: fillSupportProfile({
      supportProfile: supportCalculation?.exSupportProfile,
      profile: client?.exProfile,
      isSubscriptionActive,
      type,
      defaultName: 'Ex',
      defaultResidence: defaultExResidence,
    }),

    children: getChildren(),
    childExpenses: fillIncomeValue(supportCalculation?.childExpenses, isSubscriptionActive, type),
  };

  if (calculatorType === 'SPOUSAL') {
    const { __typename, id, ...relationship } =
      supportCalculation?.relationship || client?.relationship || {};

    if (supportCalculation?.relationship) {
      return {
        ...initialValues,
        relationship: {
          id,
          ...relationship,
        },
      };
    }

    const defaultRelationship = {
      cohabitationDate: null,
      separationDate: null,
    };

    const relationshipObj = Object.values(relationship).length ? relationship : defaultRelationship;

    return {
      ...initialValues,
      relationship: relationshipObj,
    };
  }
  return initialValues;
};

export default loadInitialValues;
