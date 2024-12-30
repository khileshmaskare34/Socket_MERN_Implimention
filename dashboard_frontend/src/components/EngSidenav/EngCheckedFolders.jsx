import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loader from '../Loader'
var api_url = import.meta.env.VITE_API_URL;

const EngCheckedFolders = ({user}) => {
  const [folders, setFolders] = useState([])
  const [isPopupForm, setIsPopupForm] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState('')
  const [finalCorrectedImageCount, setFinalCorrectedImageCount] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/checked-folders-bymanager-for-eng`);
      const checkedData = response.data.checkedFolders;
      setFolders(checkedData);
      console.log("resp", checkedData)
    } catch (error) {
      console.log("error fetching folders", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFolders();
  }, [])

  const handleSubmit = async(e) =>{
    e.preventDefault()

    const selectedFolderData = folders.find(folder => folder._id === selectedFolder);

    if(parseInt(finalCorrectedImageCount) > selectedFolderData.totalCorrectLabeledImageCountNF){
      alert(`Final Checked image count cannot exceed the total checked image count of ${selectedFolderData.totalCorrectLabeledImageCountNF}.`);
      return;
    }

    const data = {
      folderId: selectedFolder,
      finalCorrectedImageCount,
    }

    try {
        const response = await axios.post(`${api_url}/Final-checked-folder`, data);
        alert('Folder Final checked successfully!');
        fetchFolders(); // Refresh the folder list
        handleClosePopup(); // Close the popup
    } catch (error) {
        console.error('Error checking folder:', error);
        alert('Failed to check folder. Please try again.');
    }
 }

  const handleCalculateData = (folderId) => {
    setSelectedFolder(folderId);
    setIsPopupForm(true);
  }

  const handleClosePopup = ()=> {
    setIsPopupForm(false)
  }

  const handleDownload = async (checkedFolderName, folderId) =>{
    try {
     const response = await axios.get(`${api_url}/checked-download/${checkedFolderName}`, {
       responseType: 'blob', // Important: This tells Axios to expect binary data
       validateStatus: (status) => status < 500,
     });

     if (response.status === 404) {
       alert('Folder not found. Please check the folder name and try again.');
       return;
     }
 
     // Create a new Blob object using the response data
     const blob = new Blob([response.data], { type: 'application/zip' });
 
     // Create a link element, set the download attribute, and trigger a click to start the download
     const link = document.createElement('a');
     link.href = window.URL.createObjectURL(blob);
     link.download = `${checkedFolderName}.zip`; // Set the file name for download
     document.body.appendChild(link);
     link.click();
 
     // Clean up and remove the link
     link.parentNode.removeChild(link);
 
     console.log("Download successful");
    } catch (error) {
     console.error("Download error:", error)
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
    <div className='main'>
      <div className="dash-top">
        <div className="eng-name">
          <h4>Checked Folders By Manager</h4>
        </div>
      </div>
      <table className="assignFolderTable">
          <thead>
              <tr>
                <th>Folder Name</th>
                <th>Region</th>
                <th>Assigned By</th>
                <th>Assigned To</th>
                <th>Image Count</th>
                <th>Labeled Image</th>
                <th>Correct Labeled Image CountNF</th>
                <th>Image Index</th>
                <th>Data Type</th>
                <th>Sub Data Type</th>
                <th>Uploaded Date</th>
                <th>Actions</th>
                <th>Download</th>
              </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index)=>{
                const isAuthorizedManager = folder.accessControl.engineers.some(engineer => engineer === user._id)

               return( 
              <tr>
                <td>{folder.folderName}</td>
                <td>{folder.region}</td>
                <td>{folder.assigned_by.Name}</td>
                <td>{folder.assigned_to.Name}</td>
                <td>{folder.totalImageCount}</td>
                <td>{folder.totalLabeledImageCount}</td>
                <td>{folder.totalCorrectLabeledImageCountNF}</td>
                <td>{folder.imageIndex}</td>
                <td>{folder.dataType.dataTypeName}</td>
                <td>{folder.subDataType.subDataTypeName}</td>
                <td>{new Date(folder.createdAt).toLocaleString()}</td>
                <td><button class="action-button" onClick={() => handleCalculateData(folder._id)}>Mark As Final Checked</button></td> 
                <td>
                {isAuthorizedManager && (
                    <button
                      className='action-button'
                      onClick={()=> handleDownload(folder.checkedFolderName, folder._id)}
                      disabled={loading}
                    >
                      {loading ? 'Downloading...' : 'Download'}
                    </button>
                  )}
                </td>
              </tr>
               )
              })
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
              <h2>Final Check The Folder</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                <label htmlFor="folderSelect">Total Final Correct Labeled Image Count</label>
                <input type="number" placeholder='write here' value={finalCorrectedImageCount} onChange={(e)=> setFinalCorrectedImageCount(e.target.value)} required/>
              </div>

              <button type="submit" className="register-button">Final Checked</button>
            </form>

          </div>
        </div>
        )}
  </>
  )
}

export default EngCheckedFolders