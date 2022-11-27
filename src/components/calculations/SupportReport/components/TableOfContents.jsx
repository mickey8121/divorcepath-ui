import React from 'react';

import { compact } from 'lodash';

import ContentsItem from './ContentsItem';

const TableOfContents = ({ showChildSupportResults, showSpousalSupport }) => {
  const items = [
    {
      text: 'Overview',
      src: './img/icons/dusk/png/teacher-hiring.png',
      content: 'Summary of Support',
    },
    showSpousalSupport && {
      text: 'Spousal Support',
      src: './img/icons/dusk/png/receive-cash.png',
      content: 'Amount & Duration',
    },
    showChildSupportResults && {
      text: 'Child Support (s. 3)',
      src: './img/icons/dusk/png/guardian.png',
      content: 'fixed monthly child support',
    },
    showChildSupportResults && {
      text: 'Child Support (s. 7)',
      src: './img/icons/dusk/png/soccer-ball.png',
      content: 'special child-related expenses',
    },
    showChildSupportResults && {
      text: 'Total Support',
      src: './img/icons/dusk/png/money-box.png',
      content: 'child support + spousal support',
    },
    {
      text: 'Monthly Budget',
      src: './img/icons/dusk/png/pie-chart.png',
      content: 'net income comparison',
    },
    {
      text: 'Detailed Inputs',
      src: './img/icons/dusk/png/accounting.png',
      content: 'basis of support calculation',
    },
    {
      text: 'Help & Additional Information',
      src: './img/icons/dusk/png/technical-support.png',
      content: 'further reading & resources',
    },
  ];

  return (
    <div className='report-contents page'>
      <div className='reportBody'>
        <div className='row display-flex'>
          <div className='col-6 offset-1'>
            <h1 className='ml-5' style={{ marginBottom: '68px' }}>
              Table of Contents
            </h1>
            {compact(items).map((item, index) => (
              <ContentsItem
                key={item.src}
                text={`${index + 1}. ${item.text}`}
                src={item.src}
                avatarContent={item.content}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
