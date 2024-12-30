import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';

const LabeledImage_Graph = ({ data }) => {
  const [state, setState] = useState({
    options: {
      chart: {
        id: 'labeled-image-bar',
        toolbar: {
          show: false
        }
      },
      xaxis: {
        categories: [],  // Annotator names will go here
        labels: {
          style: {
            colors: '#ffffff', // Set the color of the categories to white
          },
        },
        title: {
          text: 'Annotator Names',
          style: {
            color: '#ffffff',
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff',
          },
        },
        title: {
          text: 'Number Of Labeled Images',
          style: {
            color: '#ffffff',
          }
        }
      },
    },
    series: [{
      name: 'Labeled Images',
      data: [], // Number of labeled images will go here
    }],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Extract annotator names and the corresponding total labeled image counts
      const annotatorNames = data.map(item => item.annotatorName);
      const labeledImageCounts = data.map(item => item.totalLabeledImageCount);

      setState(prevState => ({
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: annotatorNames,
          },
        },
        series: [{
          name: 'Labeled Images',
          data: labeledImageCounts,
        }],
      }));
    }
  }, [data]);

  return (
    <div className='graph-cont'>
      <Chart
        options={state.options}
        series={state.series}
        type='bar'  // Change the chart type to 'bar'
        width='100%'
        height='100%'
      />
    </div>
  );
}

export default LabeledImage_Graph;
