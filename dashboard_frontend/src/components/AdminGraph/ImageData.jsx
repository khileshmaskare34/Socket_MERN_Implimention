import React, { useState } from 'react'
import Chart from "react-apexcharts";

const ImageData = () => {
  const [state, setstate] = useState({
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        labels: {
          style: {
            colors: '#ffffff' // Set the color of the categories to white
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#ffffff'
          }
        }
      }
    },
    series: [
      {
        name: "Total Folders",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      },
      {
        name: "Accepted",
        data: [4, 6, 5, 15, 19, 22, 30, 41]
      },
      {
        name: "Rejected",
        data: [10, 20, 35, 40, 49, 50, 77, 100]
      }
    ]
  })

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

export default ImageData