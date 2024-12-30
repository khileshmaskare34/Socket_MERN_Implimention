import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const EngFinalcheckedFolders = () => {
  const [folders, setFolders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFolders = async () => {
    try {
      const response = await axios.get(`${api_url}/final-checked-folders-byengineer`);
      const finalCheckedData = response.data.finalCheckedFolders;
      setFolders(finalCheckedData);
      console.log("resp", finalCheckedData)
    } catch (error) {
      console.log("error fetching folders", error)
    }finally{
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
      <Loader/>
     </div>
    ) 
  }

  return (
    <>
    <div className='main'>
      <div className="dash-top">
        <div className="eng-name">
          <h4>Final Checked Folders</h4>
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
                <th>Correct Labeled Image CountF</th>
                <th>Image Index</th>
                <th>Data Type</th>
                <th>Sub Data Type</th>
                <th>Uploaded Date</th>
                <th>FinalCheckedDate</th>
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
                <td>{folder.totalCorrectLabeledImageCountNF}</td>
                <td>{folder.totalCorrectLabeledImageCountF}</td>
                <td>{folder.imageIndex}</td>
                <td>{folder.dataType.dataTypeName}</td>
                <td>{folder.subDataType.subDataTypeName}</td>
                <td>{new Date(folder.createdAt).toLocaleString()}</td>
                <td>{new Date(folder.finalCheckedDate).toLocaleString()}</td>
                <td><button class="action-button" onClick={() => handleCalculateData(folder._id)}>Final Checked</button></td> 
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

export default EngFinalcheckedFolders