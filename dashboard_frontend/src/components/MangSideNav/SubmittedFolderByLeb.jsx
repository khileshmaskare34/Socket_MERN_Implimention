import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const SubmittedFolderByLeb = ({user}) => {
    const [folders, setFolders] = useState([])
    const [isPopupForm, setIsPopupForm] = useState(false)
    const [selectedFolder, setSelectedFolder] = useState('')
    const [correctedImageCount, setCorrectedImageCount] = useState('')
    const [loading, setLoading] = useState(true)

    const [formData, setFormData] = useState({
      folder: null,
      folderId:'',
      managerId: user._id,
      labeledFolderName: ''
    })

    const fetchFolders = async () => {
      try {
        const response = await axios.get(`${api_url}/submitted-folders-byAllLebeler`);
        const filterData = response.data.updatedFolder;
        setFolders(filterData);

      } catch (error) {
        console.log("error fetching folders", error)
      } finally {
        setLoading(false)
      }
    }
  
    useEffect(() => {
      fetchFolders();
    }, [])


    const handleSubmit = async(e) =>{
        e.preventDefault()

        const selectedFolderData = folders.find(folder => folder._id === selectedFolder);

        if(parseInt(correctedImageCount) > selectedFolderData.totalLabeledImageCount){
          alert(`Checked image count cannot exceed the total labeled image count of ${selectedFolderData.totalLabeledImageCount}.`);
          return;
        }

        const data = {
            folderId: selectedFolder,
            correctedImageCount,
            managerId
        }

        try {
            const response = await axios.post(`${api_url}/checked-folder`, data);
            alert('Folder checked successfully!');
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

    const handleDownload = async (labeledFolderName, folderId) =>{
     try {
      const response = await axios.get(`${api_url}/labeled-download/${labeledFolderName}`, {
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
      link.download = `${labeledFolderName}.zip`; // Set the file name for download
      document.body.appendChild(link);
      link.click();
  
      // Clean up and remove the link
      link.parentNode.removeChild(link);
  
      console.log("Download successful");
     } catch (error) {
      console.error("Download error:", error)
     }

    }

    const handleUploadFolder = (folderId, folderName)=>{
      console.log("folderId, folderName:_", folderId, folderName)
      setSelectedFolder(folderId);
      setFormData((prevState) => ({
        ...prevState,
        folderId, // Store the folderId in the state
        folderName: `checked_${folderName}`, // Set the folder name to the formatted name
      }));
      setIsPopupForm(true)
    }

    const handleUploadFolderChange = (e) => {
      const { name,  value, files } = e.target;
      if (files && files.length > 0) {
        const file = files[0];
        const fileName = file.name;
        const folderName = fileName.split('.')[0];
    
        console.log("Original File Name:", file.name);
    
        // Update the formData to include the file and the formatted file name
        setFormData((prevState) => ({
          ...prevState,
          folder: file, // Store the original file object for upload
          folderName,
          labeledFolderName: formData.folderName, // Assuming you're using the formatted name from the formData
        }));
      }  else {

        // Check if the input is for the totalCorrectLabeledImageCount field
        if (name === 'totalCorrectLabeledImageCount') {
          setCorrectedImageCount(value); // Update the correctedImageCount state
        }

        // Handle changes for other fields (like Total Correct Labeled Image Count)
        setFormData((prevState) => ({
          ...prevState,
          [name]: value, // Update the field based on its name attribute
        }));
      }
    };
    
  
    const handleUploadFolderSubmit = async (e) => {
      e.preventDefault();
    
      if (!formData.folder || !formData.labeledFolderName) {
        alert('Please select a file to upload.');
        return;
      }
    
      console.log("slect:", selectedFolder)

      const selectedFolderData = folders.find(folder => folder._id === selectedFolder);

      console.log("selectedFodler_:", selectedFolderData, folders)
      if(parseInt(correctedImageCount) > selectedFolderData.totalLabeledImageCount){
        alert(`Checked image count cannot exceed the total labeled image count of ${selectedFolderData.totalLabeledImageCount}.`);
        return;
      }

      const formDataToUpload = new FormData();
      formDataToUpload.append('file', formData.folder); 
      formDataToUpload.append('folderName', formData.labeledFolderName); // Formatted file name
      formDataToUpload.append('folderId', formData.folderId)
      formDataToUpload.append('managerId', formData.managerId)
      formDataToUpload.append('totalCorrectLabeledImageCount', correctedImageCount); // Add the image count
  
      try {
        const response = await axios.post(`${api_url}/upload-folder-by-manager`, formDataToUpload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        if (response.status === 200) {
          alert(response.data.message);
          handleClosePopup();
          fetchFolders(); // Refresh folder data after upload
         }
          else {
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
             <h4>Submitted Folders By Labeler</h4>
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
                <th>Image Index</th>
                <th>Data Type</th>
                <th>Sub Data Type</th>
                <th>Uploaded Date</th>
                <th>Submitted Date</th>
                <th>Actions</th>
                <th>Download Folder</th>
              </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index)=>{
                const isAuthorizedManager = folder.accessControl.managers.some(manager => manager === user._id)
              return(  
              <tr key={folder._id}>
                <td>{folder.folderName}</td>
                <td>{folder.region}</td>
                <td>{folder.assigned_by.Name}</td>
                <td>{folder.assigned_to.Name}</td>
                <td>{folder.totalImageCount}</td>
                <td>{folder.totalLabeledImageCount}</td>
                <td>{folder.imageIndex}</td>
                <td>{folder.dataType.dataTypeName}</td>
                <td>{folder.subDataType.subDataTypeName}</td>
                <td>{new Date(folder.createdAt).toLocaleString()}</td>
                <td>{new Date(folder.submittedDate).toLocaleString()}</td>
                <td><button class="action-button" onClick={() => handleUploadFolder(folder._id, folder.folderName)}>Upload</button></td> 
                <td>
                  {isAuthorizedManager && (
                    <button
                      className='action-button'
                      onClick={()=> handleDownload(folder.labeledFolderName, folder._id)}
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
              <h2>Check The Folder</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={handleUploadFolderSubmit}>

              <div className="form-group">
                <label htmlFor="folder">Folder (ZIP file):</label>
                <input type="file" id="folder" name="folder" accept=".zip" onChange={handleUploadFolderChange} required  />
              </div>

              <div className="form-group">
                <label htmlFor="folderName">Folder Name:</label>
                <input type="text" id="folderName" name="folderName" value={formData.folderName} onChange={handleUploadFolderChange} readOnly/>
              </div>

              <div className="form-group">
              <label htmlFor="totalCorrectLabeledImageCount">Total Correct Labeled Image Count</label>
              <input 
                type="number" 
                name="totalCorrectLabeledImageCount" // Add the name attribute
                placeholder='write here' 
                value={formData.totalCorrectLabeledImageCount || ''} 
                onChange={handleUploadFolderChange} 
                required
              />
            </div>

              <button type="submit" className="register-button">Checked</button>
            </form>

          </div>
        </div>
        )}
      </>
    )
}

export default SubmittedFolderByLeb