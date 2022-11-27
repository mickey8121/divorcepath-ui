import dayjs from 'dayjs';
import { isObject, sortBy } from 'lodash';

import getSchoolDates from 'utils/getSchoolDates';

import { defaultIncome } from './defaultValues';

const initialRelationship = (sc, client) => {
  if (isObject(sc?.relationship)) return sc?.relationship;

  const { __typename, ...rest } = client?.relationship || {};

  return rest;
};

const initialIncome = () => ({
  income: {
    all: [
      {
        key: 'employment_t4',
        userAmount: 0,
        amount: 0,
      },
    ],
  },
});

const fillIncomeValue = (savedIncomeValue, isSubscriptionActive, type, prefill) => {
  if (type === 'update' && !savedIncomeValue) {
    return {
      all: prefill ? [defaultIncome] : [],
    };
  }

  if (savedIncomeValue) {
    return {
      id: savedIncomeValue?.id,
      total: savedIncomeValue?.total,
      all: [...savedIncomeValue?.all]
        ?.sort((a, b) => (dayjs(a?.createdAt).isBefore(b?.createdAt) ? -1 : 1))
        ?.map(
          ({
            id,
            key,
            amount,
            createdAt,
            defaultAmount,
            userAmount,
            defaultInputs,
            userInputs,
            status,
          }) => {
            const userInputsForUpdate = userInputs?.length ? userInputs : undefined;

            return {
              id,
              key,
              amount,
              createdAt,
              userAmount,
              defaultAmount,
              status,
              defaultInputs: defaultInputs?.map(
                // eslint-disable-next-line no-shadow
                ({ id, name, floatData, childrenArray, stringData }) => ({
                  id,
                  name,
                  floatData,
                  stringData,
                  childrenArray: childrenArray?.length > 0 ? { set: childrenArray } : void 0,
                }),
              ),
              userInputs: userInputsForUpdate?.map(
                // eslint-disable-next-line no-shadow
                ({ id, name, floatData, childrenArray, stringData }) => ({
                  id,
                  name,
                  floatData,
                  stringData,
                  childrenArray: childrenArray?.length > 0 ? { set: childrenArray } : void 0,
                }),
              ),
            };
          },
        ),
    };
  }

  return {
    all: prefill ? [defaultIncome] : [],
  };
};

const fillSupportProfile = ({
  supportProfile,
  profile,
  isSubscriptionActive,
  type,
  defaultName,
  defaultResidence,
}) => ({
  firstName: supportProfile?.firstName || (profile?.firstName ?? defaultName),
  lastName: supportProfile?.lastName || profile?.lastName,
  gender: supportProfile?.gender || profile?.gender || null,
  residence: supportProfile?.residence || defaultResidence,
  northernResident: supportProfile?.northernResident || false,
  ruralResident: supportProfile?.ruralResident || false,
  disabled: supportProfile?.disabled || false,
  energyCosts: supportProfile?.energyCosts || 0,
  propertyCosts: supportProfile?.propertyCosts || 0,
  birthDate: dayjs(supportProfile?.birthDate || profile?.birthDate || void 0).toDate(),

  hasNewPartner: supportProfile?.hasNewPartner || false,
  partnerIncome: supportProfile?.partnerIncome || null,

  income: fillIncomeValue(supportProfile?.income, isSubscriptionActive, type, true),
  hardship: fillIncomeValue(supportProfile?.hardship, isSubscriptionActive, type, false),
  adjustments: fillIncomeValue(supportProfile?.adjustments, isSubscriptionActive, type, false),
  federalBenefits: fillIncomeValue(supportProfile?.federalBenefits, isSubscriptionActive, type),
  provincialBenefits: fillIncomeValue(
    supportProfile?.provincialBenefits,
    isSubscriptionActive,
    type,
  ),
  federalDeductions: fillIncomeValue(supportProfile?.federalDeductions, isSubscriptionActive, type),
  provincialDeductions: fillIncomeValue(
    supportProfile?.provincialDeductions,
    isSubscriptionActive,
    type,
  ),
  federalCredits: fillIncomeValue(supportProfile?.federalCredits, isSubscriptionActive, type),
  provincialCredits: fillIncomeValue(supportProfile?.provincialCredits, isSubscriptionActive, type),
});

const fillChildren = (savedChildren, type) => {
  if (type === 'update' && savedChildren?.length) {
    return sortBy(
      savedChildren?.map(
        ({
          id,
          firstName,
          gender,
          birthDate,
          isOfRelationship,
          claimAsDependent,
          isDependent,
          parenting,
          priorRelationship,
          supportedBy,
          supportDeductible,
          supportAmount,
          supportType,
          childIncome,
          disabled,
          createdAt,
          startSchoolDate,
          endSchoolDate,
        }) => {
          const { defaultSchoolStartDate, defaultSchoolEndDate } = getSchoolDates(birthDate);

          return {
            id,
            firstName,
            gender,
            birthDate,
            isOfRelationship,
            createdAt,
            isDependent: isDependent || true,
            parenting,
            claimAsDependent,
            disabled: disabled || false,
            priorRelationship: priorRelationship || true,
            supportedBy: supportedBy || 'EX',
            supportType: supportType || 'GUIDELINE',
            supportDeductible: supportDeductible || false,
            supportAmount: supportAmount || null,
            childIncome: childIncome ? (childIncome === null ? 0 : childIncome) : 0,
            startSchoolDate: startSchoolDate || defaultSchoolStartDate || null,
            endSchoolDate: endSchoolDate || defaultSchoolEndDate || null,
          };
        },
      ),
      o => new Date(o?.createdAt),
    );
  }

  if (type === 'create') {
    return savedChildren?.map(
      ({
        id,
        firstName,
        gender,
        birthDate,
        isOfRelationship,
        claimAsDependent,
        isDependent,
        parenting,
        priorRelationship,
        supportedBy,
        supportDeductible,
        supportAmount,
        supportType,
        childIncome,
        disabled,
        startSchoolDate,
        endSchoolDate,
      }) => {
        const { defaultSchoolStartDate, defaultSchoolEndDate } = getSchoolDates(birthDate);

        return {
          id,
          firstName,
          gender,
          birthDate,
          isOfRelationship,
          isDependent: isDependent || true,
          parenting,
          claimAsDependent,
          disabled: disabled || false,
          priorRelationship: priorRelationship || true,
          supportedBy: supportedBy || 'EX',
          supportType: supportType || 'GUIDELINE',
          supportDeductible: supportDeductible || false,
          supportAmount: supportAmount || null,
          childIncome: childIncome || 0,
          startSchoolDate: startSchoolDate || defaultSchoolStartDate || null,
          endSchoolDate: endSchoolDate || defaultSchoolEndDate || null,
        };
      },
    );
  }

  return void 0;
};

export { fillChildren, fillSupportProfile, fillIncomeValue, initialIncome, initialRelationship };
