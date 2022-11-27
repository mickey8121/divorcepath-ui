import React, { useMemo } from 'react';

import { Bar } from 'react-chartjs-2';

import formatUSD from 'utils/formatUSD';

const deferred = {
  xOffset: 150, // defer until 150px of the canvas width are inside the viewport
  yOffset: '50%', // defer until 50% of the canvas height are inside the viewport
  delay: 100, // delay of 500 ms after the canvas is considered inside the viewport
};

const GroupedBarChart = ({ labels, data1, data2, instant, displayClass }) => {
  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: data1,
          backgroundColor: '#8eb27a',
          hoverBackgroundColor: '#203639',
        },
        {
          data: data2,
          backgroundColor: '#4c91a1',
          hoverBackgroundColor: '#143042',
        },
      ],
    }),
    [labels, data1, data2],
  );

  const chartOptions = useMemo(
    () => ({
      layout: {
        padding: {
          left: -50,
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      legend: {
        display: false,
      },
      redraw: true,
      responsive: true,
      maintainAspectRatio: false,
      beginAtZero: true,
      scales: {
        xAxes: [
          {
            categoryPercentage: 0.82,
            barPercentage: 1.0,
            position: 'top',
            display: true,
            drawBorder: false,
            ticks: {
              fontSize: 14,
              fontStyle: 'bold',
              display: true,
            },
            gridLines: {
              display: false,
              offsetGridLines: true,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      plugins: {
        deferred: instant ? false : deferred,
        datalabels: {
          color: 'white',
          display: context => context.dataset.data[context.dataIndex] > 15,
          font: {
            size: 15,
          },
          formatter: value => formatUSD(Math.round(value)),
        },
      },
    }),
    [instant],
  );

  return (
    <div>
      <Bar
        data={chartData}
        options={chartOptions}
        height={200}
        width={200}
        displayClass={displayClass}
      />
    </div>
  );
};

export default GroupedBarChart;
