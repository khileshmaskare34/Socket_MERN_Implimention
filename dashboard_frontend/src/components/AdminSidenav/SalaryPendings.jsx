import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
import axios from 'axios'
var api_url = import.meta.env.VITE_API_URL;

const SalaryPendings = () => {

  const [isPopupForm, setIsPopupForm] = useState(false)
  const [folders, setFolders] = useState([])
  const [salary, setSalary] = useState('')
  const [selectedFolder, setSelectedFolder] = useState('')
  const [creditedFolder, setCreditedFolder] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/labeler-salary-pendings`);
      const previousMonthPending = response.data.previousMonthPending;
      setFolders(previousMonthPending);
      console.log("resp", previousMonthPending)
    } catch (error) {
      console.log("error fetching folders", error)
    }finally{
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchFolders();
  }, [])

  const handleCalculateData = (folderId) => {
    setSelectedFolder(folderId)
    setIsPopupForm(true);
  }

  const handleClosePopup = ()=> {
    setIsPopupForm(false)
  }

  const submitAsCredited = async(e)=>{
    e.preventDefault()

    const data = {
        folderId: selectedFolder,
        salary
    }

    try {
        const response = await axios.post(`${api_url}/mark-as-credited`, data);
        alert('Salary Credited successfully!');
        fetchFolders(); // Refresh the folder list
        handleClosePopup(); // Close the popup
    } catch (error) {
        console.error('Error salary credited:', error);
        alert('Failed to salary credite. Please try again.');
    }
  }
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
      <div className="assigned-folders">
        <h1>Pendings</h1>
        <table className="assignFolderTable">
          <thead>
              <tr>
                <th>Folder Name</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
                <th>Image Count</th>
                <th>Labeled Image</th>
                <th>Checked Image</th>
                <th>Final Checked Image</th>
                <th>Submission Based Salary</th>
                <th>Checked Based Salary</th>
                <th>Final Checked Based Salary</th>
                <th>Sub Data Type</th>
                <th>Uploaded Date</th>
                <th>Assigned Date</th>
                <th>Submited Date</th>
                <th>Checked Date</th>
                <th>Final Checked Date</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index)=>(
              <tr>
                <td>{folder.folderName}</td>
                <td>{folder.assigned_by.Name}</td>
                <td>{folder.assigned_to.Name}</td>
                <td>{folder.totalImageCount}</td>
                <td>{folder.totalLabeledImageCount}</td>
                <td>{folder.totalCorrectLabeledImageCountNF}</td>
                <td>{folder.totalCorrectLabeledImageCountF}</td>
                <td> 
                 <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.submissionBasedSalary}
                </td>
                <td> 
                 <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.checkedBasedSalary}
                </td>
                <td>
                    <i class="fa-solid fa-indian-rupee-sign"></i>  {folder.salary}
                </td>
                <td>{folder.subDataType.subDataTypeName}</td>
                <td>{new Date(folder.createdAt).toLocaleString()}</td>
                <td>{new Date(folder.assignedDate).toLocaleString()}</td>
                <td>{new Date(folder.submittedDate).toLocaleString()}</td>
                <td>{new Date(folder.checkedDate).toLocaleString()}</td>
                <td>{new Date(folder.finalCheckedDate).toLocaleString()}</td>
                <td><button class="action-button" onClick={() => handleCalculateData(folder._id)}>Mark As Credited</button></td> 
              </tr>
              ))
            ) : (
              <tr>
                <td>No folders Available</td>
              </tr>
            )}
          </tbody>
      </table>
      </div>


        {/* popup for correcting the image by manager, those image submitted by lebeler*/}
        {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Mark As Credited</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={submitAsCredited}>
              
              <div className="form-group">
                <label htmlFor="folderSelect">Total Updated Salary</label>
                <input type="number" placeholder='write here' value={salary} onChange={(e)=> setSalary(e.target.value)}/>
              </div>

              <button type="submit" className="register-button">Mark As Credited</button>
            </form>

          </div>
        </div>
        )}
    </>
  )
}

export default SalaryPendings

