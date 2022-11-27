import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import cloneDeep from 'lodash/cloneDeep';

const getSerializedFormValues = rawVariables => {
  const variables = rawVariables;

  const clonedVariables = cloneDeep(variables);
  const clonedClient = cloneDeep(variables.data.client);

  delete clonedVariables.data.client;

  const childExpenses = clonedVariables.data.children?.length
    ? { ...clonedVariables.data.childExpenses, id: uuidv4() }
    : null;

  clonedVariables.data = {
    ...clonedVariables.data,
    childExpenses,
    children: clonedVariables.data.children?.map(child => ({ ...child, id: uuidv4() })),
    clientSupportProfile: {
      ...clonedVariables.data.clientSupportProfile,
      id: uuidv4(),
      adjustments: { ...clonedVariables.data.clientSupportProfile.adjustments, id: uuidv4() },
      federalBenefits: {
        ...clonedVariables.data.clientSupportProfile.federalBenefits,
        id: uuidv4(),
      },
      federalCredits: {
        ...clonedVariables.data.clientSupportProfile.federalCredits,
        id: uuidv4(),
      },
      federalDeductions: {
        ...clonedVariables.data.clientSupportProfile.federalDeductions,
        id: uuidv4(),
      },
      hardship: {
        ...clonedVariables.data.clientSupportProfile.hardship,
        id: uuidv4(),
      },
      income: {
        ...clonedVariables.data.clientSupportProfile.income,
        id: uuidv4(),
        createdAt: dayjs().format(),
      },
      provincialBenefits: {
        ...clonedVariables.data.clientSupportProfile.provincialBenefits,
        id: uuidv4(),
      },
      provincialCredits: {
        ...clonedVariables.data.clientSupportProfile.provincialCredits,
        id: uuidv4(),
      },
      provincialDeductions: {
        ...clonedVariables.data.clientSupportProfile.provincialDeductions,
        id: uuidv4(),
      },
    },
    exSupportProfile: {
      ...clonedVariables.data.exSupportProfile,
      id: uuidv4(),
      adjustments: { ...clonedVariables.data.exSupportProfile.adjustments, id: uuidv4() },
      federalBenefits: {
        ...clonedVariables.data.exSupportProfile.federalBenefits,
        id: uuidv4(),
      },
      federalCredits: {
        ...clonedVariables.data.exSupportProfile.federalCredits,
        id: uuidv4(),
      },
      federalDeductions: {
        ...clonedVariables.data.exSupportProfile.federalDeductions,
        id: uuidv4(),
      },
      hardship: {
        ...clonedVariables.data.exSupportProfile.hardship,
        id: uuidv4(),
      },
      income: {
        ...clonedVariables.data.exSupportProfile.income,
        id: uuidv4(),
        createdAt: dayjs().format(),
      },
      provincialBenefits: {
        ...clonedVariables.data.exSupportProfile.provincialBenefits,
        id: uuidv4(),
      },
      provincialCredits: {
        ...clonedVariables.data.exSupportProfile.provincialCredits,
        id: uuidv4(),
      },
      provincialDeductions: {
        ...clonedVariables.data.exSupportProfile.provincialDeductions,
        id: uuidv4(),
      },
    },
    relationship: { ...clonedVariables.data.relationship, id: uuidv4() },
  };

  try {
    variables.data = { client: clonedClient, content: JSON.stringify(clonedVariables.data) };
  } catch (err) {
    return variables;
  }

  return variables;
};

export default getSerializedFormValues;
