/* eslint-disable import-helpers/order-imports */
import React from 'react';

// tax credit forms
import CreditForm from './InputForms/CreditForm';
import NewCreditForm from './InputForms/NewCreditForm';
import AutoCreditForm from './InputForms/AutoCreditForm';
import OverrideCreditForm from './InputForms/OverrideCreditForm';
// import ToggleCreditForm from '../../../components/supportcalculator/ToggleCreditForm';

// tax deduction forms
import DeductionForm from './InputForms/DeductionForm';
import NewDeductionForm from './InputForms/NewDeductionForm';
import NorthernResidentsForm from './InputForms/NorthernResidentsForm';
import OtherPaymentsDeductionForm from './InputForms/OtherPaymentsDeductionForm';
import OverrideDeductionForm from './InputForms/OverrideDeductionForm';

// benefit forms
import ChildrenToggleContainer from './InputForms/forms/ChildrenToggleContainer';
import ClimateActionIncentiveForm from './InputForms/ClimateActionIncentiveForm';
import OntEnergyAndPropertyTaxCreditForm from './InputForms/OntEnergyAndPropertyTaxCreditForm';
import OntEnergyAndPropertyTaxCreditSeniorsForm from './InputForms/OntEnergyAndPropertyTaxCreditSeniorsForm';
import NorthernOntarioEnergyCreditForm from './InputForms/NorthernOntarioEnergyCreditForm';
import OntSeniorPropertyTaxGrantForm from './InputForms/OntSeniorPropertyTaxGrantForm';
import NewBenefitForm from './InputForms/NewBenefitForm';
import YukonCarbonPriceRebateForm from './InputForms/YukonCarbonPriceRebateForm';

// make a reference using a Capitalized variable name
// to the component you need to render
// where props.type is one of 'Type1' or 'Type2'

// make references to the components by type
const Components = {
  federalCredits: CreditForm,
  provincialCredits: CreditForm,
  federalDeductions: DeductionForm,
  provincialDeductions: DeductionForm,
  default_deduction: NewDeductionForm,
  default_credit: NewCreditForm,
  basic_personal_amount: AutoCreditForm,
  eligible_dependant: OverrideCreditForm,
  cpp_qpp: OverrideCreditForm,
  ei_premiums: OverrideCreditForm,
  canada_employment: OverrideCreditForm,
  cpp_qpp_enhanced: OverrideDeductionForm,
  cpp_qpp_self: OverrideDeductionForm,
  child_care_expenses_s7: OverrideDeductionForm,
  other_payments: OverrideDeductionForm,
  capital_gains: OverrideDeductionForm,

  // basic_benefit: BasicBenefit,
  canada_child_benefit: ChildrenToggleContainer,
  default_benefit: NewBenefitForm,
  working_income_tax_benefit: ChildrenToggleContainer,
  canada_workers_benefit: ChildrenToggleContainer,
  gst_credit: ChildrenToggleContainer,
  climate_action_incentive: ClimateActionIncentiveForm,
  northern_residents: NorthernResidentsForm,
  other_payments_deduction: OtherPaymentsDeductionForm,
  // Alberta
  alberta_child_benefit: ChildrenToggleContainer,
  family_employment_tax_credit: ChildrenToggleContainer,
  // BC
  bc_climate_action_tax_credit: ChildrenToggleContainer,
  early_childhood_tax_benefit: ChildrenToggleContainer,
  // Manitoba
  manitoba_child_benefit: ChildrenToggleContainer,
  // NB
  new_brunswick_hst_credit: ChildrenToggleContainer,
  // NFLD
  newfoundland_mother_baby_nutrition_supplement: ChildrenToggleContainer,
  newfoundland_income_supplement: ChildrenToggleContainer,
  newfoundland_child_benefit: ChildrenToggleContainer,
  // NWT
  nwt_child_benefit: ChildrenToggleContainer,
  nwt_colo: ChildrenToggleContainer,
  // NS
  nova_scotia_affordable_living: ChildrenToggleContainer,
  nova_scotia_child_benefit: ChildrenToggleContainer,
  // NU
  nunavut_child_benefit: ChildrenToggleContainer,
  // Ont
  ontario_sales_tax_credit: ChildrenToggleContainer,
  ontario_child_benefit: ChildrenToggleContainer,
  senior_homeowner_property_tax_grant: OntSeniorPropertyTaxGrantForm,
  ontario_energy_and_property_tax_credit_seniors: OntEnergyAndPropertyTaxCreditSeniorsForm,
  ontario_energy_and_property_tax_credit: OntEnergyAndPropertyTaxCreditForm,
  northern_ontario_energy_credit: NorthernOntarioEnergyCreditForm,
  // PEI
  pei_sales_tax_credit: ChildrenToggleContainer,
  // QC
  work_premium_refund: ChildrenToggleContainer,
  // SK
  saskatchewan_low_income_tax_credit: ChildrenToggleContainer,
  // YK
  yukon_child_benefit: ChildrenToggleContainer,
  carbon_price_rebate: YukonCarbonPriceRebateForm,
  // ei_premiums: EICredit,
  // cpp_qpp: CPPCredit,
  // eligible_dependant: ToggleCreditForm,
  // basic_personal_amount: BasicPersonalAmount,
};

// a component that will render one or more components
// that it doesn't explicitly include in it's JSX
const AmountInputForm = props => {
  const { amount, fieldType } = props;

  if (!amount?.key) return null;

  const Component = Components[amount.key] || Components[fieldType];

  if (typeof Component === 'undefined') return <React.Fragment />;
  // use the reference to the component with the
  // Capitalized variable name to render it
  return <Component {...props} />;
};

export default AmountInputForm;
