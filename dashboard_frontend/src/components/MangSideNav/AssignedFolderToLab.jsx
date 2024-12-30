import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const AssignedFolderToLab = () => {
  const [folders, setFolders] = useState([]);
  const [assfols, setAssfols] = useState([]);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchAssignFolders = async () => {
      try {
        const response = await axios.get(`${api_url}/assigned-folder-bymanager`);
        setFolders(response.data.updatedFolder);
      } catch (error) {
        console.error("Error fetching folders:", error);
      }finally{
        setLoading(false)
      }
    };
    fetchAssignFolders();


  }, []);
 
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
            <h4>Assigned Folders To Labeler</h4>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Folder Name</th>
              <th>Region</th>
              <th>Assigned By</th>
              <th>Assigned To</th>
              <th>Image Index</th>
              <th>Data Type</th>
              <th>Sub Data Type</th>
              <th>Uploaded Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {folders.length > 0 ? (
              folders.map((assfol, index) => (
                <tr key={assfol._id}>
                  <td>{assfol.folderName}</td>
                  <td>{assfol.region}</td>
                  <td>{assfol.assigned_by.Name}</td>
                  <td>{assfol.assigned_to.Name}</td>
                  <td>{assfol.imageIndex}</td>
                  <td>{assfol.dataType.dataTypeName}</td>
                  <td>{assfol.subDataType.subDataTypeName}</td>
                  <td>{new Date(assfol.createdAt).toLocaleString()}</td>
                  <td><button className="action-button">{assfol.status}</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No Assigned Folders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </>
  );
}

export default AssignedFolderToLab;
