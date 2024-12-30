import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from '../Loader';

import { io } from 'socket.io-client';
const socket = io('http://localhost:8000'); 

var api_url = import.meta.env.VITE_API_URL;

const EngUploadedFolders = () => {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const fetchAssignFolders = async()=>{
      try {
        const response = await axios.get(`${api_url}/uploaded-folders-fetch-DB`)
        console.log("jjx", response)
        setFolders(response.data)
      } catch (error) {
        console.log("getting error at the time of fetching data", error)
      }finally{
        setLoading(false)
      }
    }
    fetchAssignFolders();

    // Listen for real-time updates
    socket.on('newFolder', (newFolder) => {
      console.log('New folder added:', newFolder);
      setFolders((prevFolders) => [newFolder, ...prevFolders]); // Prepend new folder to the list
    });

    // Cleanup listener on component unmount
    return () => {
      socket.off('newFolder');
    };


  },[])

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
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
              {folders.length > 0 ?(
                folders.map((folder, index)=>(
                 <tr key={folder._id} >
                    <td>{folder.folderName}</td>
                    <td>{folder.region}</td>
                    <td>{folder.uploaded_by_name}</td>
                    <td>{folder.totalImageCount}</td>
                    <td>{folder.imageIndex}</td>
                    <td>{folder.dataType.dataTypeName}</td>
                    <td>{folder.subDataType.subDataTypeName}</td>
                    <td>{new Date(folder.createdAt).toLocaleString()}</td>
                    <td><button className="action-button">{folder.status}</button></td> 
                 </tr>
                ))
              ):(
                <tr>
                  <td>No Uploaded Folders Found</td>
                </tr>
              )}
            </tbody>
        </table>
     </div>
    </>
  )
}

export default EngUploadedFolders