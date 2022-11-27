import React, { Fragment } from 'react';

import CardHeader from 'components/calculations/components/CardHeader';

const spousalLinks = [
  {
    href: 'https://www.divorcepath.com/help/spousal-support-quickstart',
    text: 'Spousal Support Calculator Quickstart',
    description:
      ': Get started with the Divorcepath Spousal Support Calculator and learn how to generate courtroom-ready child support reports in minutes.',
  },
  {
    href: 'https://www.divorcepath.com/help/calculate-spousal-support',
    text: 'How to Calculate Spousal Support',
    description:
      ': Learn how to calculate spousal support with children, or without children. Simple step-by-step guide, updated for 2020.',
  },
  {
    href: 'https://www.divorcepath.com/help/spousal-support-in-canada',
    text: 'Guide to Spousal Support in Canada',
    description:
      ': Learn how to claim, defend, increase or reduce spousal support in Canada. Our plain-language guide, updated for 2020.',
  },
  {
    href: 'https://www.justice.gc.ca/eng/fl-df/spousal-epoux/ssag-ldfpae.html',
    text: 'Federal Spousal Support Advisory Guidelines',
    description:
      ": the Government of Canada's website for the Spousal Support Advisory Guidelines.",
  },
];

const childLinks = [
  {
    href: 'https://www.divorcepath.com/help/child-support-quickstart',
    text: 'Child Support Calculator Quickstart',
    description:
      ': Get started with the Divorcepath Child Support Calculator and learn how to generate courtroom-ready child support reports in minutes.',
  },
  {
    href: 'https://www.divorcepath.com/help/calculate-child-support',
    text: 'How to Calculate Child Support',
    description:
      ': Learn how to calculate child support for sole, shared, and split custody arrangements. Simple step-by-step guide, updated for 2020.',
  },
  {
    href: 'https://www.divorcepath.com/help/child-support-in-canada',
    text: 'Guide to Child Support in Canada',
    description:
      ': Learn how to claim, defend, increase or reduce child support in Canada. Our plain-language guide, updated for 2020.',
  },
  {
    href: 'https://laws-lois.justice.gc.ca/eng/regulations/sor-97-175/index.html',
    text: 'Federal Child Support Guidelines',
    description: ": the Government of Canada's website for the Child Support Guidelines.",
  },
];

const Help = ({ showSpousalSupport, index, showChildSupportResults }) => (
  <div className='support-report-page'>
    <CardHeader
      text={`${index}. Help & Additional Information`}
      src='./img/icons/dusk/png/technical-support.png'
      avatarContent='further reading & resources'
      report
    />

    <div className='calculator-section'>
      <p>
        This support report was created using the Divorcepath support calculator. Please visit
        Divorcepath online at <a href='https://www.divorcepath.com'>https://www.divorcepath.com</a>{' '}
        to learn more, or to perform your own support calculations.
      </p>
      <p>
        This calculation is only as reliable as the inputs provided by the user: if income,
        expenses, or benefits are different than set out in the "Detailed Inputs" section of this
        report, the amount of support should be recalculated to reflect reality.
      </p>
      <p>
        Tax and benefit calculations are calculated for the 2020 tax year, based on inputs provided
        by the user as set out in this report. Calculations are current based on the laws and
        regulations in force as of the date the report was calculated. Note that actual taxes and
        benefits may vary based on interpretations and calculations performed by the Canada Revenue
        Agency or relevant provincial or territorial authorities. Divorcepath is a private company,
        not a government agency and does not collect taxes or administer benefits. Please review the
        disclaimer and waiver at the end of this report.
      </p>
      {showSpousalSupport && (
        <Fragment>
          <p style={{ marginBottom: '8px' }}>
            Spousal support is calculated based on the Spousal Support Advisory Guidelines (SSAGs).
            For more information on how to reliably & accurately calculate spousal support using
            Divorcepath, we recommend the following resources:
          </p>
          <ul className='mt-2'>
            {spousalLinks.map(({ text, description, href }) => (
              <li key={href}>
                <a href={href}>{text}</a>
                {description}
              </li>
            ))}
          </ul>
        </Fragment>
      )}
      {showChildSupportResults && (
        <Fragment>
          <p style={{ marginBottom: '8px' }}>
            Child support is calculated based on the Federal Child Support Guidelines. For more
            information on how to reliably & accurately calculate child support using Divorcepath,
            we recommend the following resources:
          </p>
          <ul className='mt-2'>
            {childLinks.map(({ text, description, href }) => (
              <li key={href}>
                <a href={href}>{text}</a>
                {description}
              </li>
            ))}
          </ul>
        </Fragment>
      )}
      <p>
        If you have questions or concerns regarding this support calculation, please contact us at{' '}
        <a href='mailto:hello@divorcepath.com'>hello@divorcepath.com</a> or using the online chat
        feature available at <a href='https://www.divorcepath.com'>https://www.divorcepath.com</a>
      </p>
      <p>
        Information for Courts: this report is prepared using the professional support calculator
        developed by Divorcepath Corp., a Canadian family law software company. Divorcepath is
        committed to addressing the access to justice challenge by providing family law tools with a
        high level of reliability and accessibility. Our calculators are designed to ensure
        "accuracy through design" by guiding users through the process of calculating support in
        accordance with applicable law. We offer free access and training to court users. Please
        visit <a href='https://www.divorcepath.com/courts'>https://www.divorcepath.com/courts</a>{' '}
        for more information.
      </p>
      <p>
        Information for Family Law Professionals: we offer family law professionals a suite of
        professional support calculation and client management tools. Try Divorcepath Pro Tools free
        for 7 days. Please visit{' '}
        <a href='https://www.divorcepath.com/pro-tools'>https://www.divorcepath.com/pro-tools</a>{' '}
        for more information.
      </p>
      <div className='card'>
        <div className='card-body background-secondary mt-0 pt-0 text-left'>
          <p className='mt-4 mb-0'>
            This report does not contain legal advice or establish a lawyer-client relationship. By
            using or referencing this report in any way, you agree to indemnify Divorcepath.com for
            any loss, damages, costs, or expenses incurred by you or any third parties in relation
            to this report, howsoever arising, regardless of theory of liability.
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default Help;
