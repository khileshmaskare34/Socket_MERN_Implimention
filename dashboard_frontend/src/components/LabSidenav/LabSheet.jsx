import axios from 'axios';
import React, { useEffect, useState } from 'react'
var api_url = import.meta.env.VITE_API_URL;

const LabSheet = ({user}) => {
    const [isPopupForm, setisPopupForm] = useState(false)
    const [formData, setFormData] = useState({
        startDate: '',
        endDate: ''
    });


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
        const labelerId = user._id;

        try {
                const response = await axios.get(`${api_url}/get-labeler-sheet`, {
                    responseType: 'blob',
                    params: {
                        labelerId: labelerId,
                        startDate: startDate,  // Include startDate and endDate in query params
                        endDate: endDate
                    }
                });

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
    


    const hanldeOpenPopUp = ()=>{
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

    
    
  return (
    <>
        <div className='folder-assign-btn'>
            <button className='action-button' onClick={hanldeOpenPopUp}>
                Get Sheet
            </button>
        </div>

      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Get Sheet</h2>
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

export default LabSheet