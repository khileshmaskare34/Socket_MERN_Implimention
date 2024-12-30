import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import FCFM_Data from '../EngineerGraphs/FCFM_Data';
import CFM_Data from '../EngineerGraphs/CFM_Data';
import LabeledImage from '../EngineerGraphs/LabeledImage';
import SFML_Data from '../EngineerGraphs/SFML_Data';
import AFM_Data from '../EngineerGraphs/AFM_Data';
import axios from 'axios';
import LabelerSalaryData from '../AdminGraph/LabelerSalaryData';
import UploadFolders from '../EngSidenav/UploadFolders';
var api_url = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [salaryData, setSalaryData] = useState({});
  const [previousMonthSalary, setPreviousMonthSalary] = useState({});
  const [refreshGraphs, setRefreshGraphs] = useState(false);


  const user = useSelector((store) => store.administration);
  // console.log("administration", user)

  const fetchSalaryData = async () => {
    try {
      const response = await axios.get(`${api_url}/salary-data`)
      setSalaryData(response.data.currentMonth);
      setPreviousMonthSalary(response.data.previousMonth)
    } catch (error) {
      console.log("error", error)
    }
  }
  useEffect(()=>{
    fetchSalaryData()
  }, [])

  const refreshGraphData = () => {
    // You can set a state that will be passed to the graphs to trigger re-fetch
    setRefreshGraphs((prevState) => !prevState); // This will act as a toggle to re-render the graphs
  };

  return (
    <>
      <div className="dash-top">
        <div className="eng-name">
          <h4>Welcome {user.Name}</h4>
        </div>
        <div className="folder-assign-btn">
          {/* <button onClick={handleAssignFolderClick}> Upload Folder</button> */}
          <UploadFolders  
          role={'admin'}
          user={user}   
          fetchTotalImage={fetchSalaryData}
          refreshGraphData={refreshGraphData}
          />
        </div>
      </div>

      <div className="total-item-box">
        <div className="monthly-data-box">
          <h4 className='card_top'>Images Ready To Process This Month</h4>
          <div className='number-box'>
            <h4>{salaryData.totalFinalImageCount}</h4>
          </div>
        </div>

        <div className="monthly-data-box">
          <h4 className='card_top'>Total Salary To Be Credit This Month</h4>
          <div className='number-box'>
            <h4><i class="fa-solid fa-indian-rupee-sign"></i> {salaryData.totalSalary}</h4>
          </div>
        </div>

        <div className="monthly-data-box">
          <h4 className='card_top'>Total Salary Credited Last Month</h4>
          <div className='number-box'>
            <h4><i class="fa-solid fa-indian-rupee-sign"></i> {previousMonthSalary.totalSalary}</h4>
          </div>
        </div>
      
        <div className="monthly-data-box">
          <h4 className='card_top'>Total Salary Pendings</h4>
          <div className='number-box'>
            <h4><i class="fa-solid fa-indian-rupee-sign"></i> {previousMonthSalary.previousMonthPendingSalary}</h4>
          </div>
        </div>

      </div>

      <div className="graphs">

        <div className="graph graph-1">
          <LabelerSalaryData />
        </div>

        <div className="graph graph-1">
          <FCFM_Data />
        </div>

        <div className="graph graph-2">
          <CFM_Data />
        </div>

        <div className="graph graph-3">
          <LabeledImage refreshGraphs={refreshGraphs}/>
        </div>

        <div className="graph graph-4 ">
          <SFML_Data/>
        </div>

        <div className="graph graph-5">
          <AFM_Data refreshGraphs={refreshGraphs}/>
        </div>


      </div>
    </>
  )
}

export default AdminDashboard