import React, { useEffect, useState } from 'react'
import SFM_Data from '../LabelerGraphs/SFM_Data'
import Assigned_Data from '../LabelerGraphs/Assigned_Data'
import axios from 'axios';
var api_url = import.meta.env.VITE_API_URL;

const LabDashboard = ({user}) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [totalImageLab, setTotalImageLab] = useState({});


  const fetchTotalImage = async()=>{
    try {
      const response = await axios.get(`${api_url}/total-image-data-for-labeler`,{
        params:{
          labId: user._id
        }
      })
      setTotalImageLab(response.data);
      // console.log("luckyxx", totalImageLab.totalImageCount);
    } catch (error) {
      console.log("error", error)
    }
  }
  
  useEffect(() => {
    // Load clock-in state from local storage when the component mounts
    const savedIsClockedIn = localStorage.getItem('isClockedIn') === 'true';
    const savedClockInTime = localStorage.getItem('clockInTime');

    // for break
    const savedIsOnBreak = localStorage.getItem('isOnBreak') === 'true';
    
    const currentDate = new Date().toDateString();

    if (savedIsClockedIn && savedClockInTime) {
      const savedDate = new Date(savedClockInTime).toDateString();


     // Check if the saved date is different from the current date (indicating a new day)
     if (savedDate !== currentDate) {
        // Reset for a new day
        setIsClockedIn(false);
        localStorage.removeItem('isClockedIn');
        localStorage.removeItem('clockInTime');
        localStorage.removeItem('isOnBreak');
      } else {
        // Set state from local storage
        setIsClockedIn(savedIsClockedIn);
        setClockInTime(savedClockInTime);

        // for break
        setIsOnBreak(savedIsOnBreak);
      }
    }
    fetchTotalImage()
  }, []);

  const handleClockIn = async () => {
    const currentTime = new Date().toISOString();
    
    try {  
      const response = await axios.post(`${api_url}/clock-in`, {
        userId: user._id,
        clockInTime: currentTime,
      });

      console.log("clockinData", response)
        setIsClockedIn(true);
        setClockInTime(currentTime);
        localStorage.setItem('isClockedIn', true);
        localStorage.setItem('clockInTime', currentTime);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message);
      } else {
        console.error('Error during clock in:', error);
        alert('An unexpected error occurred. Please try again later.');
      } 
   }
  };

  const handleClockOut = async () => {
    const currentTime = new Date().toISOString();

    try {
      await axios.post(`${api_url}/clock-out`, {
        userId: user._id,
        clockOutTime: currentTime,
      });

      setIsClockedIn(false);
      localStorage.removeItem('isClockedIn');
      localStorage.removeItem('clockInTime');
    } catch (error) {
      console.error('Error during clock out:', error);
    }
  };

  const handleBreakStart = async () => {
    const currentTime = new Date().toISOString();
    try {
      await axios.post(`${api_url}/break-start`, {
        userId: user._id,
        breakStartTime: currentTime,
      });
  
      setIsOnBreak(true);
      localStorage.setItem('isOnBreak', true);
      localStorage.setItem('breakStartTime', currentTime);
    } catch (error) {
      console.error('Error starting break:', error);
    }
  }

  const handleBreakEnd = async () => {
    const currentTime = new Date().toISOString();

    try {
      await axios.post(`${api_url}/break-end`, {
        userId: user._id,
        breakEndTime: currentTime,
      });
  
      setIsOnBreak(false);
      localStorage.removeItem('isOnBreak');
      localStorage.removeItem('breakStartTime');
    } catch (error) {
      console.error('Error ending break:', error);
    }
  }


  return (
    <>
      <div className="dash-top">
        <div className="eng-name">
          {user && (
            <h4>Welcome:{user.Name}</h4>
          )}
        </div>

        <div>
          {isClockedIn ? (
            <div className='folder-assign-btn'>
              {isOnBreak ? (
                <button className='action-button' onClick={handleBreakEnd}> Break-End </button>
              ) : (
                <div className='folder-assign-btn'>
                  <button className='action-button' onClick={handleClockOut}> Clock-Out </button>
                  <button className='action-button' onClick={handleBreakStart}>Break-Start</button>
                </div>
              )}
            </div>
          ) : (
            <button className='action-button' onClick={handleClockIn}> Clock-In </button>
          )}
        </div>
      </div>

      <div className="total-item-box">
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Ready To Process This Month</h4>
          <div className='number-box'>
           <h4>{totalImageLab.totalFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images One Step Away From Being Ready This Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalNonFinalImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Labeled This Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalLabeledImageCount}</h4>
          </div>
        </div>
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Uploaded This Month</h4>
          <div className='number-box'>
            <h4>{totalImageLab.totalImageCount}</h4>
          </div>
        </div>
      </div>

      <div className="graphs">
        <div className="graph graph-1">
         <SFM_Data user={user}/>
        </div>
        <div className="graph graph-2">
          <Assigned_Data user={user}/>
        </div>
      </div>
    </>
  )
}

export default LabDashboard