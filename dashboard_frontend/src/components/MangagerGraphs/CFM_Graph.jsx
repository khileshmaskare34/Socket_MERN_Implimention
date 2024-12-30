import React, { useEffect, useState } from 'react'
import Chart from "react-apexcharts";

const CFM_Graph = ({ data }) => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: '#ffffff', // Set the color of the categories to white
          },
        },
        title: {
          text: 'Checked Folders Dates',
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
          text: 'Number Of Checked Folders',
          style: {
            color: '#ffffff',
          }
        },
      },
      colors: ['#F0AE1A']
    },
    series: [
      {
        name: 'Checked Folders',
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Aggregate the data by date
      const dateCount = data.reduce((acc, folder) => {
        const date = new Date(folder.checkedDate).toLocaleDateString(); // Format the date
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
            name: 'Checked Folder',
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
        type="line" 
        width="100%"
        height="100%"
         />
    </div>
  )
}

export default CFM_Graph