import React, { useEffect, useState } from 'react'
import CFM_Data from '../MangagerGraphs/CFM_Data'
import SFML_Data from '../MangagerGraphs/SFML_Data'
import LabeledImage from '../EngineerGraphs/LabeledImage'
import axios from 'axios'
import AFM_Data from '../EngineerGraphs/AFM_Data'
var api_url = import.meta.env.VITE_API_URL;

const MangDashboard = ({user}) => {
  console.log("user_", user)
  const [totalImage, setTotalImage] = useState({});

  const fetchTotalImage = async () => {
    try {
      const response = await axios.get(`${api_url}/total-image`)
      setTotalImage(response.data);
      console.log("luckyxx", totalImage.totalImageCount);
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(()=>{
    fetchTotalImage();
  },[])

  return (
    <>
      <div className="dash-top">
        <div className="eng-name">
          <h4>Welcome: {user.Name} </h4>
        </div>
      </div>

      <div className="total-item-box">
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Ready To Process This Month</h4>
          <div className='number-box'>
           <h4>{totalImage.totalFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images One Step Away From Being Ready Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalNonFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Labeled This Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalLabeledImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Uploaded This Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalImageCount}</h4>
          </div>
        </div>
      </div>

      <div className="graphs">

        <div className="graph graph-1">
          <AFM_Data />
        </div>

        <div className="graph graph-2">
          <CFM_Data /> 
        </div>

        <div className="graph graph-3">
          <SFML_Data />
        </div>

        <div className="graph graph-4">
          <LabeledImage/>
        </div>

      </div>

    </>
  )
}

export default MangDashboard