import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const AssignedFoldersByMang = () => {

  const user = useSelector((store) => store.labeler);
  const [isPopupForm, setisPopupForm] = useState(false)
  const [isUploadFolder, setIsUploadFolder] = useState(false)

  const [folders, setFolders] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [labeledImageCount, setLabeledImageCount] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null); // Add state for error
  const [dailyEnteryData, setDailyEnteryData] = useState([])

  const [formData, setFormData] = useState({
    folder: null,
    folderId:'',
    annotatorId: user._id,
    labeledFolderName: ''
  })

  const handleDailyEntries = () => {
    setisPopupForm(true)
  }

  const handleClosePopup = () => {
    folderId: ''
    annotator: ''
    totalLabeledImageCount: ''
    setisPopupForm(false)
  }

  // fetching the manager assigned folder from API 
  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/assigned-folder-bymanager`);

      const filteredData = response.data.updatedFolder.filter(folder => folder.assigned_to._id === user._id);
      setFolders(filteredData);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoading(false)
    }
  }

  const fetchDailyEntryData = async () => {
    try {
      const response = await axios.get(`${api_url}/get-daily-entries-data`, {
        params:{
          userId: user._id
        }
      })
      setDailyEnteryData(response.data)
      // console.log("daily entry data:", response)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchFolders();
    fetchDailyEntryData();
  }, [])


  
  // submitted the daily entries data from this API
  const handleSubmit = async(e)=>{
    e.preventDefault();
    

    const isFolderPresnt = dailyEnteryData.some(entry => entry.Folder._id === selectedFolder)
    
    const selectedFolderData = folders.find(folder => folder._id === selectedFolder);

    if (!selectedFolderData) {
      alert("Invalid folder selection.");
      return;
    }

    if(!isFolderPresnt){
      
      if (parseInt(labeledImageCount) > selectedFolderData.totalImageCount) {
        alert(`Labeled image count cannot exceed the total image count of ${selectedFolderData.totalImageCount}.`);
        return;
      }
    }else{
      const labeledImages = dailyEnteryData.filter(entry => entry.Folder._id === selectedFolder);
      const totalLabeledImageCount = labeledImages.reduce((sum, entry) => sum + entry.totalLabeledImageCount, 0);
    
      const updateLabeledImage = selectedFolderData.totalImageCount - totalLabeledImageCount;

      console.log('updatedLabeled_:', updateLabeledImage)
      if(updateLabeledImage <= 0){
        alert('You have labeled all the images from this folder.');
        return;
      }
      else if(parseInt(labeledImageCount) > updateLabeledImage){
        alert(`Labeled image count cannot exceed the total updated image count of ${updateLabeledImage}.`)
        return;
      }
    }

    const data = {
      folderId: selectedFolder,
      annotator: user._id,
      totalLabeledImageCount: labeledImageCount
    }
    try {
      const response = await axios.post(`${api_url}/daily-entries`, data);
      const result = response.data;
      // console.log("result", result)
      alert("Data submitted successfuly!");
      handleClosePopup();
      fetchFolders();
      fetchDailyEntryData()
    } catch (error) {
      console.log("err", error)
    }
  }

  const handleDownload = async (folderName) => {
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

  const handleAssignFolderClick = (folderId, folderName) => {
    setFormData((prevState) => ({
      ...prevState,
      folderId, // Store the folderId in the state
      folderName: `labeled_${folderName}`, // Set the folder name to the formatted name
    }));
    setIsUploadFolder(true);
  };
  

  const handleCloseUploadFolder = ()=>{
    setIsUploadFolder(false)
  }

  const handleAssignFolderChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      const fileName = file.name;
      const parts = fileName.split('-');
      const folderName = fileName.split('.')[0];

      const formattedFileName = formData.folderName; 
      setFormData((prevState) => ({
        ...prevState,
        folder: file, // Store the original file object for upload
        folderName,
        labeledFolderName: formattedFileName, // Set the formatted name to be used during the upload
      }));
    }
  };
  

  const handleAssignFolder = async (e) => {
    e.preventDefault();
  
    if (!formData.folder || !formData.labeledFolderName) {
      alert('Please select a file to upload.');
      return;
    }
  
    const formDataToUpload = new FormData();
    formDataToUpload.append('file', formData.folder); 
    formDataToUpload.append('folderName', formData.labeledFolderName); // Formatted file name
    formDataToUpload.append('folderId', formData.folderId)
    formDataToUpload.append('annotatorId', formData.annotatorId)

    try {
      const response = await axios.post(`${api_url}/upload-folder-by-labeler`, formDataToUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        alert(response.data.message);
        handleCloseUploadFolder();
        fetchFolders(); // Refresh folder data after upload
      } else {
        alert('Failed to upload the folder. Please try again.');
      }
    } catch (error) {
      if(error.message){
        if(error.response.status === 404){
          alert('Folder not found. Please check the folder ID and try again.');
        }else{
          alert(`Error: ${error.response.data.error || 'Failed to upload the folder. Please try again.'}`);
        }
      }else {
        // Other errors (e.g., network errors)
        console.error('Error uploading folder:', error);
        alert('An error occurred during the upload. Please try again.');
      }
    }
  };
  
  
  
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
            <h4>Assigned Folders By Manager</h4>
          </div>
          <div className="folder-assign-btn">
            <button onClick={handleDailyEntries}>Enter Daily Data</button>
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
              <th>Image Index</th>
              <th>Data Type</th>
              <th>Sub Data Type</th>
              <th>Assigned Date</th>
              <th>Actions</th>
              <th>Download Folder</th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index) => (
                <tr>
                  <td>{folder.folderName}</td>
                  <td>{folder.region}</td>
                  <td>{folder.assigned_by.Name}</td>
                  <td>{folder.assigned_to.Name}</td>
                  <td>{folder.totalImageCount}</td>
                  <td>{folder.imageIndex}</td>
                  <td>{folder.dataType.dataTypeName}</td>
                  <td>{folder.subDataType.subDataTypeName}</td>
                  <td>{new Date(folder.assignedDate).toLocaleString()}</td>
                  <td><button class="action-button" onClick={() => handleAssignFolderClick(folder._id, folder.folderName)}>Submit</button></td>
                  <td>
                    <button
                      className="action-button"
                      onClick={() => handleDownload(folder.folderName)}
                      disabled={loading}
                    >
                      {loading ? 'Downloading...' : 'Download'}
                    </button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No folders Available</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="daily-entries">
          <h4>Daily Entries Folders</h4>
        </div>
        <table className="assignFolderTable">
          <thead>
            <tr>
              <th>Folder Name</th>
              <th>Annotator Name</th>
              <th>Total Labeled Image</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {dailyEnteryData.length > 0 ? (
              dailyEnteryData.map((folder, index) => (
                <tr>
                  <td>{folder.Folder.folderName}</td>
                  <td>{folder.annotator.Name}</td>
                  <td>{folder.totalLabeledImageCount}</td>

                  <td>{new Date(folder.createdAt).toLocaleString()}</td>
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

      {isUploadFolder && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Upload Folder</h2>
              <button className="close-button" onClick={handleCloseUploadFolder}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>


            <form  id="assignFolderForm" onSubmit={handleAssignFolder} enctype="multipart/form-data">

              <div className="form-group">
                <label htmlFor="folder">Folder (ZIP file):</label>
                <input type="file" id="folder" name="folder" accept=".zip" onChange={handleAssignFolderChange} required  />
              </div>
              <div className="form-group">
                <label htmlFor="folderName">Folder Name:</label>
                <input type="text" id="folderName" name="folderName" value={formData.folderName} onChange={handleAssignFolderChange} readOnly/>
              </div>

              <button type="submit" className="action-button">Upload</button>
            </form>
          </div>
        </div>
      )}

      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Select Folder</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={handleSubmit} >
              <div className="form-group">
                <label htmlFor="folderSelect">Choose Folder</label>
                <select id="folderSelect" name="folderSelect" value={selectedFolder} onChange={(e) => setSelectedFolder(e.target.value)} required>
                  <option value="" disabled>Select Folder</option>
                  {folders.length > 0 ? (
                    folders.map((folder, index)=>(
                      <option key={folder._id} value={folder._id}>{folder.folderName}</option>
                    ))
                  ) : (
                    <option value="" disabled> No Folders Available</option>
                  )}
                </select>
              </div>

              <div className='form-group'>
                <label htmlFor="imageCount">Labeled Image</label>  
                <input type="number" value={labeledImageCount} onChange={(e) => setLabeledImageCount(e.target.value)} placeholder='write labeled image....' required/>
              </div>

              <button type="submit" className="register-button">Assigned</button>
            </form>

          </div>
        </div>

      )}

    </>
  )
}

export default AssignedFoldersByMang