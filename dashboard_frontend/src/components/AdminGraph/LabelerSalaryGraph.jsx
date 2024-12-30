import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const LabeledSalaryGraph = ({ data }) => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'salary-bar'
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#ffffff'
          }
        }
      },
      yaxis: {
        title: {
          text: 'Salary',
          style: {
            color: '#ffffff'
          }
        },
        labels: {
          style: {
            colors: '#ffffff'
          }
        }
      }
    },
    series: [
      {
        name: 'Total Salary',
        data: []
      }
    ]
  });

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      // Extract labeler names and their salaries
      const labelerNames = Object.keys(data);
      const salaries = labelerNames.map(labeler => data[labeler].totalSalary);

      // Update the chart state
      setState(prevState => ({
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: labelerNames,
          },
        },
        series: [
          {
            name: 'Total Salary',
            data: salaries,
          },
        ],
      }));
    }
  }, [data]);

  return (
    <div className='graph-cont'>
      <Chart
        options={state.options}
        series={state.series}
        type='bar'
        width='100%'
        height='100%'
      />
    </div>
  );
};

export default LabeledSalaryGraph;
