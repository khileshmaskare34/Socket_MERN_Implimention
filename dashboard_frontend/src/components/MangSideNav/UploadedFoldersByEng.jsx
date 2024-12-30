import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const UploadedFoldersByEng = () => {

  const user = useSelector((store) => store.manager);

  const [isPopupForm, setisPopupForm] = useState(false);
  const [folders, setFolders] = useState([]);
  const [labelers, setLabelers] = useState([]);
  const [selectedFoldersId, setSelectedFoldersId] = useState('');
  const [selectedLabelersId, setSelectedLabelersId] = useState('');
  const [responseClass, setResponseClass] = useState(''); // State to hold the class name
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null); // Add state for error

  // Function to fetch assigned folders
  const fetchAssignFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/uploaded-folders-fetch-DB`);
      setFolders(response.data);
    } catch (error) {
      console.log("getting error at the time of fetching data", error);
    } finally{
      setLoading(false)
    }
  };

  // useEffect to call fetch functions on component mount
  useEffect(() => {
    fetchAssignFolders();
  }, []);

  const handleAssignedChange = (e) => {
    const { name, value } = e.target;
   if (name === 'labelerSelect') {
      setSelectedLabelersId(value);
    }
  }

  const hanldeAssgnedSubmit = async(e) => {
    e.preventDefault();
    const formData = {
      managerId: user._id,
      folderId: selectedFoldersId,
      labelerId: selectedLabelersId,
      status: 'NOT SUBMITTED'
    }

    console.log("formData_:", formData)
    const response = await axios.post(`${api_url}/assigned-folder-bymanager`, formData)

    if(response.status === 200){
      setMessage(response.data.message)
      setResponseClass('response success')
      fetchAssignFolders();

      // Reset states after successful submission
      setSelectedFoldersId('');
      setSelectedLabelersId('');
      
      setTimeout(() => {
        handleClosePopup();
      }, 2000);
    }
    

  }

  const handleAssignFolderToLabeler = (folderId) => {
    const updatedAccessControlData = folders.find(folder => folder._id === folderId);
    setSelectedFoldersId(folderId)
    setLabelers(updatedAccessControlData.accessControl.annotators)
    setisPopupForm(true);
  }

  const handleClosePopup = () => {
    setMessage('');
    setResponseClass('');
    setisPopupForm(false);

    setSelectedFoldersId('')
    setSelectedLabelersId('')
  }

  const handleDownload = async (folderName, folderId) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.get(`${api_url}/download/${folderName}`, {
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
      link.download = `${folderName}.zip`; // Set the file name for download
      document.body.appendChild(link);
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
  
      console.log("Download successful");
    } catch (err) {
      console.error('Download error:', err);
      setError('An error occurred while trying to download the file.');
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };
  

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
      <div className='main'>

        <div className="dash-top">
          <div className="eng-name">
            <h4>Uploaded Folders By Engineer</h4>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Folder Name</th>
              <th>Region</th>
              <th>Uploaded By</th>
              <th>Image Count</th>
              <th>Image Index</th>
              <th>Data Type</th>
              <th>Sub Data Type</th>
              <th>Uploaded Date</th>
              {/* Conditionally render the "Actions" column header */}
              {folders.some(folder => folder.accessControl.managers.some(manager => manager._id === user._id)) && (
                <th>Actions</th>
              )}
              <th>Assign Folder</th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index) => {
                const isAuthorizedManager = folder.accessControl.managers.some(manager => manager._id === user._id);
                return(
                <tr key={folder._id} >
                  <td>{folder.folderName}</td>
                  <td>{folder.region}</td>
                  <td>{folder.uploaded_by_name}</td>
                  <td>{folder.totalImageCount}</td>
                  <td>{folder.imageIndex}</td>
                  <td>{folder.dataType.dataTypeName}</td>
                  <td>{folder.subDataType.subDataTypeName}</td>
                  <td>{new Date(folder.createdAt).toLocaleString()}</td>
                  <td><button className='action-button' onClick={()=> handleAssignFolderToLabeler(folder._id)}>Assign</button></td>

                  <td>
                    {isAuthorizedManager && (
                      <button
                        className="action-button"
                        onClick={() => handleDownload(folder.folderName, folder._id)}
                      >
                        Download
                      </button>
                    )}
                  </td>
                </tr>
                )
              })
            ) : (
              <tr>
                <td>No Assigned Folders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Assign Folder</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={hanldeAssgnedSubmit}>
              {message && (<div className={responseClass}>{message}</div>)}

              <div className="form-group">
                <label htmlFor="labelerSelect">Labeler Name</label>
                <select id="labelerSelect" name="labelerSelect" value={selectedLabelersId} onChange={handleAssignedChange} required>
                  <option value="" disabled>Select Labeler</option>
                  {labelers.length > 0 ? (
                    labelers.map((labeler, index) => (
                      <option key={index} value={labeler._id}>
                        {labeler.Name}
                        {labeler.Role && labeler.Role.length > 0 ? `, ${labeler.Role.map(role => role.dataTypeName).join(', ')}` : ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No Labelers Available</option>
                  )}
                </select>
              </div>

              <button type="submit" className="action-button">Assigned</button>
            </form>

          </div>
        </div>

      )}
    </> 
  )
}

export default UploadedFoldersByEng