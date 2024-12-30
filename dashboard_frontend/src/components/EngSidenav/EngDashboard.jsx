import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';
import AFM_Data from '../EngineerGraphs/AFM_Data';
import SFML_Data from '../EngineerGraphs/SFML_Data';
import CFM_Data from '../EngineerGraphs/CFM_Data';
import FCFM_Data from '../EngineerGraphs/FCFM_Data';
import LabeledImage from '../EngineerGraphs/LabeledImage';
import Loader from '../Loader';
import '../popup_style.css'
import UploadFolders from './UploadFolders';

var api_url = import.meta.env.VITE_API_URL;

const EngDashboard = () => {
  const user = useSelector((store) => store.engineer);
  
  const [totalImage, setTotalImage] = useState({});

  const [refreshGraphs, setRefreshGraphs] = useState(false);
  const [loading, setLoading] = useState(false); 

  // form input
  


  const fetchTotalImage = async () => {
    try {
      const response = await axios.get(`${api_url}/total-image`)
      setTotalImage(response.data);
    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchTotalImage();
  }, [])



  const refreshGraphData = () => {
    // You can set a state that will be passed to the graphs to trigger re-fetch
    setRefreshGraphs((prevState) => !prevState); // This will act as a toggle to re-render the graphs
  };



  if (loading) {
  return (
    <div>
      <Loader /> 
    </div>
  );
  }

  return (
    <>
      <div className="dash-top">
        <div className="eng-name">
          {user && (
            <h4>Welcome {user.Name}!</h4>
          )}
        </div>

        <div className="folder-assign-btn">
          <UploadFolders  
          role={'engineer'}
          user={user}   
          fetchTotalImage={fetchTotalImage}
          refreshGraphData={refreshGraphData}
          />
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
          <FCFM_Data refreshGraphs={refreshGraphs}/>
        </div>

        <div className="graph graph-2">
          <CFM_Data refreshGraphs={refreshGraphs}/>
        </div>

        <div className="graph graph-3">
          <LabeledImage refreshGraphs={refreshGraphs}/>
        </div>

        <div className="graph graph-4 ">
          <SFML_Data refreshGraphs={refreshGraphs}/>
        </div>

        <div className="graph graph-5">
          <AFM_Data refreshGraphs={refreshGraphs}/>
        </div>

      </div>


    </>
  )
}

export default EngDashboard