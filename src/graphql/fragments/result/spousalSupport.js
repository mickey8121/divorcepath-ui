import gql from 'graphql-tag';

import AMOUNT_ARRAY_RESULT from '../calculation/amountArrayResult';

const SPOUSAL_SUPPORT = gql`
  ${AMOUNT_ARRAY_RESULT}

  fragment SPOUSAL_SUPPORT on SpousalSupport {
    id
    formula
    maxDuration
    minDuration
    payee
    payor
    ruleOf65
    twentyYearRelationship
    yearsUntilEndSchool
    yearsUntilStartSchool
    ageAtSeparation
    durationOfRelationship
    clientCustodialPayorCs
    exCustodialPayorCs
    exCustodialPayorCsGrossUp
    clientCustodialPayorCsGrossUp
    clientAdjustedGuidelineIncome
    exAdjustedGuidelineIncome
    incomeDifferential
    claimAsDependentDefault

    scenarios {
      id
      name
      percent
      clientSpousalSupport {
        id
        annualCash
        annualIndi
        childExpenses {
          id
          monthlyAdditionalBenefits
          monthlyAdjustedIncome
          monthlyGuidelineIncome
          monthlyNetExpenses
          monthlyNetPaid
          monthlyPaid
          monthlySavings
          monthlyShare
          monthlySupport
          monthlyTaxSavings
          monthlyTotalExpenses
          netExpenses
          netPaid
          paid
          percentShare
          savings
          share
          support
          taxSavings
          totalExpenses
          additionalBenefits
          adjustedIncome
          guidelineIncome
        }
        federalBenefits {
          ...AMOUNT_ARRAY_RESULT
        }
        federalCredits {
          ...AMOUNT_ARRAY_RESULT
        }
        federalDeductions {
          ...AMOUNT_ARRAY_RESULT
        }
        federalTaxAdjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        federalTax
        income {
          id
          all {
            id
            key
            amount
            userAmount
            defaultAmount
          }
          incomeNetSpousal
          partnerIncome
          provincialTaxableIncome
          provincialTaxableIncomeNoExpenses
          provincialTaxableIncomeNoSupport
          spousalSupportGuidelineIncome
          total
          totalNetIncome
          adjustedFamilyIncome
          childSupportGuidelineIncome
          employmentIncome
          federalTaxableIncome
          federalTaxableIncomeNoExpenses
          federalTaxableIncomeNoSupport
          selfEmploymentIncome
          otherPartyTaxableIncome
        }
        incomeNetSupport
        monthlyBenefits
        monthlyCash
        monthlyChildSupportNet
        monthlyChildSupportNotional
        monthlyChildSupportTable
        formulaMonthlyTableSupport
        formulaMonthlyNotionalSupport
        monthlyCostSpousalSupport
        monthlyGuidelineIncome
        monthlyIncomeNetSupport
        monthlyIndi
        monthlySpousalSupport
        monthlyTax
        monthlyTotalSupport
        netSpousalSupport
        npvChildSupport
        npvSpousalSupport
        percentCash
        percentIndi
        provincialBenefits {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialCredits {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialDeductions {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialTaxAdjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialTax
        totalSupport
        monthlyNdi
        annualNdi
        cppEi
        totalTax
        adjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        hardship {
          ...AMOUNT_ARRAY_RESULT
        }
      }
      exSpousalSupport {
        id
        annualCash
        annualIndi
        childExpenses {
          id
          monthlyAdditionalBenefits
          monthlyAdjustedIncome
          monthlyGuidelineIncome
          monthlyNetExpenses
          monthlyNetPaid
          monthlyPaid
          monthlySavings
          monthlyShare
          monthlySupport
          monthlyTaxSavings
          monthlyTotalExpenses
          netExpenses
          netPaid
          paid
          percentShare
          savings
          share
          support
          taxSavings
          totalExpenses
          additionalBenefits
          adjustedIncome
          guidelineIncome
        }
        federalBenefits {
          ...AMOUNT_ARRAY_RESULT
        }
        federalCredits {
          ...AMOUNT_ARRAY_RESULT
        }
        federalDeductions {
          ...AMOUNT_ARRAY_RESULT
        }
        federalTaxAdjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        federalTax
        income {
          id
          all {
            id
            key
            amount
            userAmount
            defaultAmount
          }
          incomeNetSpousal
          partnerIncome
          provincialTaxableIncome
          provincialTaxableIncomeNoExpenses
          provincialTaxableIncomeNoSupport
          spousalSupportGuidelineIncome
          total
          totalNetIncome
          adjustedFamilyIncome
          childSupportGuidelineIncome
          employmentIncome
          federalTaxableIncome
          federalTaxableIncomeNoExpenses
          federalTaxableIncomeNoSupport
          selfEmploymentIncome
          otherPartyTaxableIncome
        }
        incomeNetSupport
        monthlyBenefits
        monthlyCash
        monthlyChildSupportNet
        monthlyChildSupportNotional
        monthlyChildSupportTable
        monthlyCostSpousalSupport
        monthlyGuidelineIncome
        monthlyIncomeNetSupport
        monthlyIndi
        monthlySpousalSupport
        formulaMonthlyTableSupport
        formulaMonthlyNotionalSupport
        monthlyTax
        monthlyTotalSupport
        netSpousalSupport
        npvChildSupport
        npvSpousalSupport
        percentCash
        percentIndi
        provincialBenefits {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialCredits {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialDeductions {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialTaxAdjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        provincialTax
        totalSupport
        monthlyNdi
        annualNdi
        cppEi
        totalTax
        adjustments {
          ...AMOUNT_ARRAY_RESULT
        }
        hardship {
          ...AMOUNT_ARRAY_RESULT
        }
      }
    }
  }
`;

export default SPOUSAL_SUPPORT;
