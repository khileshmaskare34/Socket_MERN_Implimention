import axios from 'axios';
import React, { useEffect, useState } from 'react'
var api_url = import.meta.env.VITE_API_URL;

const Sheet = () => {
    const [isPopupForm, setisPopupForm] = useState(false)
    const [isLabelerBox, setIsLabelerBox] = useState(false)
    const [isLabelers, setIsLabelers] = useState([])
    const [selectedLabeler, setSelectedLabeler] = useState(null);
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: ''
    });

    const [sheetType, setSheetType] = useState('');

    const fetchLabelers = async()=>{
        const response = await axios.get(`${api_url}/get-labelers`)
        const labelers = response.data.labelers;
        setIsLabelers(labelers);
    }
    useEffect(()=>{
        fetchLabelers();
    }, [])

    // Handle change in input fields and update formData state
    const handleAssignChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value // Update the specific field (startDate or endDate)
        });
    };

    const handleSheetsDate = async(e)=>{
        e.preventDefault();
        const {startDate, endDate} = formData;

        try {
            let response;
            if(sheetType === 'annotator' && selectedLabeler){
                 response = await axios.get(`${api_url}/get-labeler-sheet`, {
                    responseType: 'blob',
                    params: {
                        labelerId: selectedLabeler,
                        startDate: startDate,  // Include startDate and endDate in query params
                        endDate: endDate
                    }
                });
            }else if (sheetType === 'combined') {
                // API for combined sheet
                response = await axios.get(`${api_url}/sheets`, {
                    responseType: 'blob',
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });
            } else if (sheetType === 'salary') {
                // API for salary sheet
                response = await axios.get(`${api_url}/salary-sheet`, {
                    responseType: 'blob',
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });
            } else if (sheetType === 'dailyEntries') {
                // API for daily entery sheet
                response = await axios.get(`${api_url}/dailyEntry-sheet`, {
                    responseType: 'blob',
                    params: {
                        startDate: startDate,
                        endDate: endDate
                    }
                });
            }

        // Create a link to trigger the download
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'folders.xlsx'; // Set the file name
        link.click(); // Trigger the download

        } catch (error) {
            console.error("err", error)
        }
    }

    const handleLabelerClick = async (labelerId) => {
        setSheetType('annotator')
        setSelectedLabeler(labelerId);
        setisPopupForm(true);
    }

    const handleOpenPopUp = (type)=>{
        setSheetType(type)
        setisPopupForm(true)
    }

    const handleClosePopup = ()=>{
        setisPopupForm(false)
        // Reset form data
        setFormData({
            startDate: '',
            endDate: ''
        });
    }

    const openLabelerBox = ()=>{
        setIsLabelerBox(true)
    }

    const closeLabelerBox = ()=>{
        setIsLabelerBox(false)
    }
    
  return (
    <>
        <div className='folder-assign-btn'>
            
            <button className='action-button' onClick={openLabelerBox}>
                Get Particular Annotator Data
            </button>

            <button className='action-button' onClick={()=> handleOpenPopUp('combined')}>
                Get Combined Data
            </button>

            <button className='action-button' onClick={()=> handleOpenPopUp('salary')}> 
                Get Salary Sheet
            </button>

            <button className='action-button' onClick={()=> handleOpenPopUp('dailyEntries')}> 
                Get Daily Entry Sheet
            </button>
            
            {/* <button className='action-button' onClick={openLabelerBox}>
                Get Particular Annotators Attendance
            </button> */}

            {/* <button className='action-button' onClick={()=> handleOpenPopUp('annotatorsAttendance')}>
                Get Annotators Attendance Sheet
            </button> */}


        </div>

        {isLabelerBox && (
        <div className='lab-box'>
            <h1>Get Annotator Data</h1>
            { isLabelers.length > 0 ? (
              isLabelers.map((labeler, index)=>(
                <div key={index} className='labelers' onClick={()=> handleLabelerClick(labeler._id)}>{labeler.Name}</div>
              ))
            ) : (
                <div>No Labelers</div>
            )}
        </div>
        )}



      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2> Get Sheet </h2>
              <button className="close-button" onClick={handleClosePopup}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>


            <form id="assignFolderForm" onSubmit={handleSheetsDate}>

              <div className="form-group">
                <label htmlFor="folder">Start Date</label>
                <input type="date" id="StartDate" name="startDate" value={formData.startDate} onChange={handleAssignChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="folderName">End Date</label>
                <input type="date" id="EndDate" name="endDate" value={formData.endDate} onChange={handleAssignChange} />
              </div>
            
        
              <button type="submit" className="action-button">submit</button>
            </form>
          </div>
        </div>

      )}
    </>
  )
}

export default Sheet