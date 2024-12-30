import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
import axios from 'axios';
var api_url = import.meta.env.VITE_API_URL;

const AnnotatorsAttendance = () => {
  const [clockedInAnnotators, setClockedInAnnotators] = useState('')
  const [absentAnnotators, setAbsentAnnotators] = useState('')

  const [loading, setLoading] = useState(true)

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/get-annotators-attendance`);
      const clockedInAnnotators = response.data.clockedInAnnotators;
      const absentAnnotators = response.data.absentAnnotators;

      setClockedInAnnotators(clockedInAnnotators);
      setAbsentAnnotators(absentAnnotators);

      console.log("clockedInAnnotators", clockedInAnnotators)
      console.log("absentAnnotators", absentAnnotators)

    } catch (error) {
      console.log("error fetching folders", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFolders();
  }, [])

 // Get the current date
 const today = new Date();
 // Format the date as 'YYYY-MM-DD'
//  const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
 const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;



  // check if data arrived or not, if not arrived show loader
  if(loading){
    return (
     <div>
      <Loader/>
     </div>
    ) 
  }

  return (
    <>
        <div className='main'>
      <div className="dash-top">
        <div className="eng-name">
          <h4>Annotators Attendance</h4>
        </div>
      </div>
        <table className="assignFolderTable">
          <thead>
            <tr>
              <th>Annotator</th>
              <th>Date</th>
              <th>ClockIn-Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
           {clockedInAnnotators.length > 0 ? (
            clockedInAnnotators.map((attendance, index)=>(
             <tr>
              <td>{attendance.userId.Name}</td>
              <td>{new Date(attendance.date).toLocaleDateString()}</td>
              <td>{new Date(attendance.clockInTime).toLocaleString()}</td>
              <td>
                <button className='action-button'>
                  {attendance.status}
                </button>
              </td>
             </tr>
            ))
           ) : (
            <td></td>                                                                                       
           )}
          </tbody>

          <tbody>
           {absentAnnotators.length > 0 ? (
            absentAnnotators.map((attendance, index)=>(
             <tr>
              <td>{attendance.Name}</td>
              <td>{formattedDate}</td>
              <td>null</td>
              <td>
                <button className='action-button'>
                  {attendance.status}
                </button>
              </td>
             </tr>
            ))
           ) : (
            <td>No</td>                                                                                       
           )}
          </tbody>
        </table>
    </div>
    </>
  )
}

export default AnnotatorsAttendance