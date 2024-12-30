import React,{useState} from 'react'
import Chart from "react-apexcharts";

const FinalCheckedFolders = () => {
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
            name: "series-1",
            data: [30, 40, 45, 50, 49, 60, 70, 91]
          }
        ]
      })

  return (
    <div className='graph-cont'>
        <Chart
              options={state.options}
              series={state.series}
              type="bar"
               width="100%"
              height="100%"
            />
    </div>
  )
}
export default FinalCheckedFolders