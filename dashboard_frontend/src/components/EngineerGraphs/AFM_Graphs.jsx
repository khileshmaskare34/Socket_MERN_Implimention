import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const AFM_Graphs = ({ data }) => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#D5ECFE', // Set the color of the categories to white
          },
        },
        title: {
          text: 'Uploaded Folders Dates',
          style: {
            color: '#ffffff',
          }
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff',
          },
        },
        title: {
          text: 'Number Of Uploaded Folders',
          style: {
            color: '#ffffff',
          }
        },
      },
      colors: ['#F3BE47']
    },
    series: [
      {
        name: 'Folders Assigned',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Aggregate the data by date
      const dateCount = data.reduce((acc, folder) => {
        const date = new Date(folder.createdAt).toLocaleDateString(); // Format the date
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += 1; // Increment count for this date
        return acc;
      }, {});

      // Convert aggregated data to arrays for the chart
      const categories = Object.keys(dateCount);
      const seriesData = Object.values(dateCount);

      setState(prevState => ({
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: categories,
          },
        },
        series: [
          {
            name: 'Folders Assigned',
            data: seriesData,
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
        type='area'
        width='100%'
        height='100%'
      />
    </div>
  );
}

export default AFM_Graphs;
