import React, { useEffect, useState } from 'react'
import AFM_Data from '../EngineerGraphs/AFM_Data';
import SFML_Data from '../EngineerGraphs/SFML_Data';
import CFM_Data from '../EngineerGraphs/CFM_Data';
import FCFM_Data from '../EngineerGraphs/FCFM_Data';
import LabeledImage from '../EngineerGraphs/LabeledImage';
import axios from 'axios';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;


const ParticulerEngProfile = ({user}) => {
    const [totalImage, setTotalImage] = useState({});
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchTotalImage = async () => {
          try {
            const response = await axios.get(`${api_url}/total-image`)
            setTotalImage(response.data);
            console.log("luckyxx", totalImage.totalImageCount);
          } catch (error) {
            console.log("error", error)
          } finally {
            setLoading(false)
          }
        }
        fetchTotalImage();
      }, [])

  // check if data arrived or not, if not arrived show loader
  if(loading){
    return (
     <div>
      <Loader />
     </div>
    ) 
  }

  return (
    <>
      <div className="total-item-box">
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Ready To Process This Month</h4>
          <div className='number-box'>
           <h4>{totalImage.totalFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Is One Step Away From Being Ready Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalNonFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Labeled This Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalLabeledImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Image Uploaded This Month</h4>
          <div className='number-box'>
            <h4>{totalImage.totalImageCount}</h4>
          </div>
        </div>
      </div>

      <div className="graphs">

        <div className="graph graph-1">
          <FCFM_Data />
        </div>

        <div className="graph graph-2">
          <CFM_Data />
        </div>

        <div className="graph graph-3">
          <LabeledImage/>
        </div>

        <div className="graph graph-4 ">
          <SFML_Data/>
        </div>

        <div className="graph graph-5">
          <AFM_Data/>
        </div>

      </div>
    </>
  )
}

export default ParticulerEngProfile