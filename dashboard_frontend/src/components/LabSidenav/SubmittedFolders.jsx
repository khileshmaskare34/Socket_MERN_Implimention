import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useActionData } from 'react-router-dom'
import Loader from '../Loader'
var api_url = import.meta.env.VITE_API_URL;

const SubmittedFolders = ({ user }) => {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/submitted-folders-bylebeler`,{
        params: {
          userId: user._id,
        },
      });
      const filterData = response.data.updatedFolder;
      setFolders(filterData);
      console.log("resp", filterData)
    } catch (error) {
      console.log("error fetching folders", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFolders();
  }, [])

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
           <h4>Submitted Folders By Labeler Name</h4>
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
              <th>Submitted Date</th>
              <th>Assigned Date</th>
              <th>Actions</th>
            </tr>
        </thead>
        <tbody>
          {folders.length > 0 ? (
            folders.map((folder, index)=>(
            <tr>
              <td>{folder.folderName}</td>
              <td>{folder.region}</td>
              <td>{folder.assigned_by.Name}</td>
              <td>{folder.assigned_to.Name}</td>
              <td>{folder.totalImageCount}</td>
              <td>{folder.totalLabeledImageCount}</td>
              <td>{folder.imageIndex}</td>
              <td>{folder.dataType.dataTypeName}</td>
              <td>{folder.subDataType.subDataTypeName}</td>
              <td>{new Date(folder.submittedDate).toLocaleString()}</td>
              <td>{new Date(folder.assignedDate).toLocaleString()}</td>
              <td><button class="action-button" onclick="markAsChecked(this)">{folder.status}</button></td> 
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
    </>
  )
}

export default SubmittedFolders