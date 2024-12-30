import React, { useEffect, useState } from 'react'
import SFM_Data from '../LabelerGraphs/SFM_Data'
import Assigned_Data from '../LabelerGraphs/Assigned_Data'
import axios from 'axios'
var api_url = import.meta.env.VITE_API_URL;

const ParticulerLabProfile = ({data}) => {
  const [totalImageLab, setTotalImageLab] = useState({});

  const fetchTotalImage = async()=>{
    try {
      const response = await axios.get(`${api_url}/total-image-data-for-labeler`,{
        params:{
          labId: data._id
        }
      })
      setTotalImageLab(response.data);
      console.log("luckyxx", totalImageLab.totalImageCount);
    } catch (error) {
      console.log("error", error)
    }
  }
  useEffect(()=>{
    fetchTotalImage();
  }, [])
  return (
    <>
      <div className="total-item-box">
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Ready To Process This Month</h4>
          <div className='number-box'>
           <h4>{totalImageLab.totalFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Is One Step Away From Being Ready Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalNonFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Labeled This Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalLabeledImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Uploaded This Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalImageCount}</h4>
          </div>
        </div>
      </div>

      <div className="graphs">
        <div className="graph graph-1">
         <SFM_Data user={data}/>
        </div>
        <div className="graph graph-2">
          <Assigned_Data user={data}/>
        </div>
      </div>
    </>
  )
}

export default ParticulerLabProfile