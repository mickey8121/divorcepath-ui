import React, { useCallback } from 'react';

import GroupedBarChart from 'components/charts/GroupedBarChart';

const MonthlyBudgetCharts = ({ clientData, exData, showSpousalSupport }) => {
  const Charts = useCallback(() => {
    if (!(clientData[0] && exData[0])) return null;

    return (
      <div
        className='row text-center doughnut-row'
        style={{
          height: 150,
          width: 480,
          marginLeft: -30,
          marginRight: 0,
          marginTop: -80,
          marginBottom: 0,
        }}
      >
        <div className='support-bars text-center'>
          <GroupedBarChart
            data1={clientData}
            data2={exData}
            instant
            labels={['', '', '']}
            displayClass='grouped-chart-overview-container'
          />
        </div>
        {showSpousalSupport ? (
          <div
            className='row text-center doughnut-row pl-0 pr-10'
            style={{ height: 40, width: 315, marginRight: 0, marginLeft: 85, marginTop: -10 }}
          >
            <small className='text-muted'>Low</small>
            <small className='text-muted'>Mid</small>
            <small className='text-muted'>High</small>
          </div>
        ) : (
          <div
            className='row text-center doughnut-row pl-0 pr-10'
            style={{ height: 40, width: 100, marginRight: 0, marginLeft: 25, marginTop: 0 }}
          >
            <small className='text-muted'>Monthly Budget Income</small>
          </div>
        )}
      </div>
    );
  }, [showSpousalSupport, clientData, exData]);

  if (!(clientData[0] && exData[0])) {
    return null;
  }

  return (
    <div
      className='row text-center doughnut-row'
      style={{ height: 150, width: 800, marginRight: -30 }}
    >
      <Charts />
    </div>
  );
};

export default MonthlyBudgetCharts;
