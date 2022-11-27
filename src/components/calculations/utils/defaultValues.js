import flattenDeep from 'lodash/flattenDeep';
import { v4 as uuidv4 } from 'uuid';

import getSchoolDates from 'utils/getSchoolDates';

export const defaultChildExpense = {
  userInputs: [
    { floatData: 0, name: 'client' },
    { floatData: 0, name: 'ex' },
  ],
  key: 'other',
  amount: 0,
  userAmount: 0,
  id: uuidv4(),
};

export const defaultIncome = {
  key: 'employment_t4',
  amount: 0,
  userAmount: 0,
  id: uuidv4(),
};

export const defaultAdjustment = {
  key: 'employment_expenses',
  amount: 0,
  userAmount: 0,
  id: uuidv4(),
};

export const defaultHardship = {
  key: 'high_debts',
  amount: 0,
  userAmount: 0,
  id: uuidv4(),
};

const { defaultSchoolStartDate, defaultSchoolEndDate } = getSchoolDates(new Date().toISOString());

export const defaultChildren = {
  birthDate: new Date().toISOString(),
  claimAsDependent: null,
  firstName: '',
  lastName: '',
  middleName: '',
  gender: 'FEMALE',
  parenting: 'SHARED',
  isOfRelationship: true,
  disabled: false,
  isDependent: true,
  priorRelationship: true,
  supportedBy: 'EX',
  supportType: 'GUIDELINE',
  supportDeductible: false,
  supportAmount: null,
  childIncome: 0,
  startSchoolDate: defaultSchoolStartDate,
  endSchoolDate: defaultSchoolEndDate,
};

export const freeIncomeOptions = [
  {
    key: 'employment_t4',
    label: 'T4 Employment',
    description:
      'Employment income for which you receive a T4. Reported on lines 10100-10200 of your tax return.',
    reference:
      'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/tax-slips/understand-your-tax-slips/t4-slips/t4-statement-remuneration-paid.html',
  },
];

export const defaultRelationship = {
  cohabitationDate: new Date(),
  separationDate: new Date(),
};

export const defaultPlans = {
  pro: {
    subscription: {
      SOLO: {
        id: 'SOLO',
        title: 'Solo',
        price: '59',
        pricePrepend: '$',
        subPrice: 'Monthly',
        className: 'mt-5',
        btnText: '7-day free trial',
        features: [
          { label: 'Spousal & Child Support', value: true },
          { label: 'Complex Income & Tax', value: true },
          { label: 'Unlimited Clients', value: true },
          { label: 'Unlimited PDF Reports', value: true },
          { label: 'Unlimited Users', value: false },
          { label: 'Firm Branding', value: false },
        ],
      },
      FIRM_1: {
        id: 'FIRM_1',
        title: 'Firm',
        price: '120',
        pricePrepend: '$',
        subPrice: 'Monthly',
        className: 'mt-5',
        btnText: '7-day free trial',
        features: [
          { label: 'Spousal & Child Support', value: true },
          { label: 'Complex Income & Tax', value: true },
          { label: 'Unlimited Clients', value: true },
          { label: 'Unlimited PDF Reports', value: true },
          { label: 'Unlimited Users', value: true },
          { label: 'Firm Branding', value: true },
        ],
      },
    },
    freePlan: {
      FREE: {
        id: 'FREE',
        title: 'Free',
        price: 'Free',
        subPrice: 'Limited Features, No Credit Card',
        btnText: 'Change to Free',
        className: 'mt-5',
        features: [
          { label: 'Spousal & Child Support', value: true },
          { label: 'Complex Income & Tax', value: false },
          { label: 'Unlimited Clients', value: true },
          { label: 'Unlimited PDF Reports', value: false },
          { label: 'Unlimited Users', value: false },
          { label: 'Firm Branding', value: false },
        ],
      },
    },
  },

  client: {
    1: {
      CHILD_SUPPORT_1: {
        id: 'CHILD_SUPPORT_1',
        title: 'Child Support',
        price: '19',
        pricePrepend: '$',
        btnText: 'Purchase',
        className: 'mt-5',
        features: [
          { label: 'Calculate Child Support', value: true },
          { label: 'Calculate Spousal support', value: false },
          { label: 'Apportion Special Expenses', value: true },
          { label: 'All Income Types', value: true },
          { label: 'Edit Tax Credits & Benefits', value: true },
          { label: 'PDF Reports', value: true },
        ],
      },
      CHILD_SPOUSAL_SUPPORT_1: {
        id: 'CHILD_SPOUSAL_SUPPORT_1',
        title: 'Child & Spousal Support',
        price: '39',
        pricePrepend: '$',
        btnText: 'Purchase',
        features: [
          { label: 'Calculate Child Support', value: true },
          { label: 'Calculate Spousal support', value: true },
          { label: 'Apportion Special Expenses', value: true },
          { label: 'All Income Types', value: true },
          { label: 'Edit Tax Credits & Benefits', value: true },
          { label: 'PDF Reports', value: true },
        ],
        isBest: true,
      },
    },
    6: {
      CHILD_SUPPORT_6: {
        id: 'CHILD_SUPPORT_6',
        title: 'Child Support',
        price: '29',
        subPrice: '6-month access',
        pricePrepend: '$',
        btnText: 'Purchase',
        className: 'mt-5',
        features: [
          { label: 'Calculate Child Support', value: true },
          { label: 'Calculate Spousal support', value: false },
          { label: 'Apportion Special Expenses', value: true },
          { label: 'All Income Types', value: true },
          { label: 'Edit Tax Credits & Benefits', value: true },
          { label: 'PDF Reports', value: true },
        ],
      },
      CHILD_SPOUSAL_SUPPORT_6: {
        id: 'CHILD_SPOUSAL_SUPPORT_6',
        title: 'Child & Spousal Support',
        price: '59',
        subPrice: '6-month access',
        pricePrepend: '$',
        btnText: 'Purchase',
        features: [
          { label: 'Calculate Child Support', value: true },
          { label: 'Calculate Spousal support', value: true },
          { label: 'Apportion Special Expenses', value: true },
          { label: 'All Income Types', value: true },
          { label: 'Edit Tax Credits & Benefits', value: true },
          { label: 'PDF Reports', value: true },
        ],
        isBest: true,
      },
    },
    freePlan: {
      FREE: {
        id: 'FREE',
        title: 'Starter',
        price: 'Free',
        subPrice: 'Basic Calculations',
        btnText: 'Create Free Account',
        className: 'mt-5',
        features: [
          { label: 'Calculate Child Support', value: true },
          { label: 'Calculate Spousal support', value: true },
          { label: 'Apportion Special Expenses', value: false },
          { label: 'All Income Types', value: false },
          { label: 'Edit Tax Credits & Benefits', value: false },
          { label: 'PDF Reports', value: false },
        ],
      },
    },
  },
};

export const defaultPlansForAnalytics = {
  pro: {
    subscription: {
      SOLO: {
        item_id: defaultPlans.pro.subscription.SOLO.id,
        item_name: defaultPlans.pro.subscription.SOLO.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.pro.subscription.SOLO.price) || null,
        trial: true,
        pro: true,
        recurring: true,
      },
      FIRM_1: {
        item_id: defaultPlans.pro.subscription.FIRM_1.id,
        item_name: defaultPlans.pro.subscription.FIRM_1.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.pro.subscription.FIRM_1.price) || null,
        trial: true,
        pro: true,
        recurring: true,
      },
    },
    freePlan: {
      FREE: {
        item_id: defaultPlans.pro.freePlan.FREE.id,
        item_name: defaultPlans.pro.freePlan.FREE.title,
        currency: 'CAD',
        price: 0,
        trial: false,
        pro: true,
        recurring: true,
      },
    },
  },
  client: {
    1: {
      CHILD_SUPPORT_1: {
        item_id: defaultPlans.client[1].CHILD_SUPPORT_1.id,
        item_name: defaultPlans.client[1].CHILD_SUPPORT_1.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.client[1].CHILD_SUPPORT_1.price) || null,
        trial: false,
        pro: false,
        recurring: false,
      },
      CHILD_SPOUSAL_SUPPORT_1: {
        item_id: defaultPlans.client[1].CHILD_SPOUSAL_SUPPORT_1.id,
        item_name: defaultPlans.client[1].CHILD_SPOUSAL_SUPPORT_1.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.client[1].CHILD_SPOUSAL_SUPPORT_1.price) || null,
        trial: false,
        pro: false,
        recurring: false,
      },
    },
    6: {
      CHILD_SUPPORT_6: {
        item_id: defaultPlans.client[6].CHILD_SUPPORT_6.id,
        item_name: defaultPlans.client[6].CHILD_SUPPORT_6.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.client[6].CHILD_SUPPORT_6.price) || null,
        trial: false,
        pro: false,
        recurring: false,
      },
      CHILD_SPOUSAL_SUPPORT_6: {
        item_id: defaultPlans.client[6].CHILD_SPOUSAL_SUPPORT_6.id,
        item_name: defaultPlans.client[6].CHILD_SPOUSAL_SUPPORT_6.title,
        currency: 'CAD',
        price: parseFloat(defaultPlans.client[6].CHILD_SPOUSAL_SUPPORT_6.price) || null,
        trial: false,
        pro: false,
        recurring: false,
      },
    },
    freePlan: {
      FREE: {
        item_id: defaultPlans.client.freePlan.FREE.id,
        item_name: defaultPlans.client.freePlan.FREE.title,
        currency: 'CAD',
        price: 0,
        trial: false,
        pro: false,
        recurring: false,
      },
    },
  },
};

export const defaultPeriods = [
  { value: 1, label: '1 month' },
  { value: 6, label: '6 months' },
];

export const defaultErrorPlanNote = 'Upgrade not successful. Limited features.';

export const getPlanList = isPro =>
  flattenDeep(
    Object.values(defaultPlansForAnalytics[isPro ? 'pro' : 'client']).map(item =>
      Object.values(item),
    ),
  );

export const getDefaultPersonalPlanNote =
  fullDate => `Your account will be automatically switched to 
"free" on ${fullDate}. You will still have access to your saved calculations.`;

export const getDefaultProPlanNote = (fullDate, isTrial) =>
  isTrial
    ? `You have a trial subscription period and 
when it ends on ${fullDate} - the subscription will be renewed automatically each month. To cancel 
your subscription or downgrade to a free account, go to your billing settings.`
    : `The subscription will be renewed automatically each month. To cancel your subscription or downgrade 
      to a free account, go to your billing settings`;
