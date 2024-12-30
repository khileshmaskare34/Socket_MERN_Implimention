import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';

var api_url = import.meta.env.VITE_API_URL;

const AcceptFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAccessPopupForm, setIsAccessPopupForm] = useState(false);
  const [accessData, setAccessData] = useState({}); // Access control data

  const [selectedFolderId, setSelectedFolderId] = useState(null)
  const [annotators, setAnnotators] = useState([]);
  const [managers, setManagers] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const fetchAssignFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/folders-fetch-DB`);
      setFolders(response.data);
    } catch (error) {
      console.log("getting error at the time of fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnnotators = async () => {
    try {
      const response = await axios.get(`${api_url}/get-labelers`);
      setAnnotators(response.data.labelers);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchManagers = async () => {
    try {
      const response = await axios.get(`${api_url}/get-managers`);
      setManagers(response.data.managers);
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchEngineers = async () => {
    try {
      const response = await axios.get(`${api_url}/get-engineers`);
      setEngineers(response.data.engineers);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchAssignFolders();
    fetchAnnotators();
    fetchManagers();
    fetchEngineers();
  }, []);

  const handleOpenAccessControl = (folderId) => {
    setIsAccessPopupForm(true);
    setSelectedFolderId(folderId)

    const matchingFolders = folders.find(folder => folder._id === folderId);
    if (matchingFolders) {

      // Set access data from the matching folder
      setAccessData(matchingFolders.accessControl || { annotators: [], managers: [], engineers: [] });
    }
  };

  const handleCheckBoxChange = (type, userId) => {
    // Create a copy of the current accessData state
    const updatedAccessData = { ...accessData };
  
    // Check if the user is already in the list (checked) or not (unchecked)
    const isUserInList = updatedAccessData[type].some(user => user._id === userId);
  
    if (isUserInList) {
      // If the user is already in the list, remove them (uncheck)
      updatedAccessData[type] = updatedAccessData[type].filter(user => user._id !== userId);
    } else {
      // If the user is not in the list, add them (check)
      const userToAdd = (type === 'annotators' ? annotators : type === 'managers' ? managers : engineers)
        .find(user => user._id === userId);
      if (userToAdd) {
        updatedAccessData[type].push(userToAdd);
      }
    }
    setAccessData(updatedAccessData);
  };
  

  const handleUpdateFoldersAccess = async (e)=>{
    e.preventDefault();
    
    const payload = {
        folderId : selectedFolderId,
        accessData: accessData
    };

    try {
        const response = await axios.post(`${api_url}/update-access-control`, payload)
        // console.log("Updated_Access_Control_Data :", response)

        if(response.status === 200){
            alert(response.data.message)
            await fetchAssignFolders()
            handleCloseAccessPopup();
        }
    } catch (error) {
        console.log("error :", error)
    }
  }

  const handleCloseAccessPopup = () => {
    setIsAccessPopupForm(false);
    setAccessData({}); // Clear access data when closing
  };

  const handleSubmitDownload = async (labeledFolderName, folderId) =>{
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

  const handleCheckedDownload = async (checkedFolderName, folderId) =>{
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
  // Check if data arrived or not, if not arrived show loader
  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  return (
    <>
      <div className="assigned-folders">
        <h1>Uploaded Folders</h1>
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
              <th>Access Control</th>
              <th>Status</th>
              <th>Submitted Folder</th>
              <th>Checked Folder</th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((folder, index) => {
                const isManagerPresent = folder.accessControl.managers.length > 0;
                return(
                <tr key={folder._id}>
                  <td>{folder.folderName}</td>
                  <td>{folder.region}</td>
                  <td>{folder.uploaded_by_name}</td>
                  <td>{folder.totalImageCount}</td>
                  <td>{folder.imageIndex}</td>
                  <td>{folder.dataType.dataTypeName}</td>
                  <td>{folder.subDataType.subDataTypeName}</td>
                  <td>{new Date(folder.createdAt).toLocaleString()}</td>
                  <td><button className='action-button' onClick={() => handleOpenAccessControl(folder._id)}>Access Control</button></td>
                  <td><button className="action-button">{folder.status}</button></td>

                  {/* Conditional rendering based on status */}
                  {folder.status === 'SUBMITTED' && (
                    <td><button className='action-button' onClick={()=> handleSubmitDownload(folder.labeledFolderName, folder._id)}> Download</button></td>
                  )}
                  {(folder.status === 'CHECKED' || folder.status === 'FINAL CHECKED' || folder.status === 'CREDITED') && (
                    <>
                      <td><button className='action-button' onClick={()=> handleSubmitDownload(folder.labeledFolderName, folder._id)}> Download</button></td>
                      {isManagerPresent && (
                       <td><button className='action-button' onClick={()=> handleCheckedDownload(folder.checkedFolderName, folder._id)}> Download</button></td>
                      )}
                    </>
                  )}
                
                  {folder.status === 'PENDING' || folder.status === 'UPLOADED' ? (
                    <td colSpan="3"></td> // Empty cells if status is pending or uploaded
                  ) : null}

                </tr>
                )
             })
            ) : (
              <tr>
                <td colSpan="10">No Uploaded Folders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Access Control */}
      {isAccessPopupForm && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>Access Control</h2>
              <button className="close-button" onClick={handleCloseAccessPopup}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleUpdateFoldersAccess}>
              <div className='access-control'>

                {/* Access control select for Annotators */}
                <div className="access-emp">
                  <div>Annotators</div>
                  <div>
                    {annotators.length > 0 ? (
                      annotators.map((annotator) => (
                        <div className='checkbox' key={annotator._id}>
                          <input
                            type="checkbox"
                            checked={accessData.annotators && accessData.annotators.some(annotatorData => annotatorData._id === annotator._id)}
                            onChange={() => handleCheckBoxChange('annotators', annotator._id)}
                          />
                          <div>{annotator.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Annotators Present</div>
                    )}
                  </div>
                </div>

                {/* Access control select for Managers */}
                <div className="access-emp">
                  <div>Managers</div>
                  <div>
                    {managers.length > 0 ? (
                      managers.map((manager) => (
                        <div className='checkbox' key={manager._id}>
                          <input
                            type="checkbox"
                            checked={accessData.managers && accessData.managers.some(managerData => managerData._id === manager._id)} // Check based on access data
                            onChange={() => handleCheckBoxChange('managers', manager._id)}
                          />
                          <div>{manager.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Managers Present</div>
                    )}
                  </div>
                </div>

                {/* Access control select for Engineers */}
                <div className="access-emp">
                  <div>Engineers</div>
                  <div>
                    {engineers.length > 0 ? (
                      engineers.map((engineer) => (
                        <div className='checkbox' key={engineer._id}>
                          <input
                            type="checkbox"
                            checked={accessData.engineers && accessData.engineers.some(engineerData => engineerData._id === engineer._id)} // Check based on access data
                            onChange={() => handleCheckBoxChange('engineers', engineer._id)}
                          />
                          <div>{engineer.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Engineers Present</div>
                    )}
                  </div>
                </div>

              </div>
              <button type="submit" className="action-button">Edit Access Control</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AcceptFolders;