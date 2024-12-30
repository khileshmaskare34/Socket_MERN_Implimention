import React, { useEffect, useState } from 'react'
import JSZip from 'jszip';
import axios from 'axios';
import '../popup_style.css'
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const UploadFolders = ({ fetchTotalImage, refreshGraphData, user, role }) => {

    const [isPopupForm, setisPopupForm] = useState(false);
    const [isAccessPopupForm, setIsAccessPopupForm] = useState(false)
    const [dataTypes, setDataTypes] = useState([]);
    const [subDataTypes, setSubDataTypes] = useState([]);
    const [loading, setLoading] = useState(false); 

    const [annotators, setAnnotators] = useState([]);
    const [managers, setManagers] = useState([]);
    const [engineers, setEngineers] = useState([]);

    // form input
    const [formData, setFormData] = useState({
        folder: null,
        folderName: '',
        imageCount: '',
        dataType: '',
        subDataType: '',
        imageIndex: '',
        uploadedBy: user._id,
        nameofUploader: role,
        status: 'PENDING',

        accessControl: { 
        annotators: [],
        managers: [],
        engineers: []
        },
    })

    const fetchDataType = async () => {
        try {
          const response = await axios.get(`${api_url}/data-types`)
          setDataTypes(response.data);
        } catch (error) {
          console.log("error", error)
        }
      }

    const fetchAnnotators = async () => {
        try {
        const response = await axios.get(`${api_url}/get-labelers`)
        setAnnotators(response.data.labelers)
        } catch (error) {
        console.log("error", error)
        }
    }

    const fetchManagers = async () => {
        try {
        const response = await axios.get(`${api_url}/get-managers`)
        setManagers(response.data.managers)
        } catch (error) {
        console.log("error", error)
        }
    }

    const fetchEngineers = async () => {
        try {
        const response = await axios.get(`${api_url}/get-engineers`)
        console.log("engineersX :", response)
        setEngineers(response.data.engineers)
        } catch (error) {
        console.log("error", error)
        }
    }  
    
      useEffect(() => {
        fetchDataType();
        fetchAnnotators();
        fetchManagers();
        fetchEngineers();
      }, [])

  const handleCheckBoxChange = (type, id) => {
    const updatedAccessControl = { ...formData.accessControl }; // Create a copy of accessControl

    if (type === 'annotators') {
        // Update the labelers array
        updatedAccessControl.annotators = updatedAccessControl.annotators.includes(id)
            ? updatedAccessControl.annotators.filter((annotatorId) => annotatorId !== id)
            : [...updatedAccessControl.annotators, id];
    } else if (type === 'managers') {
        // Update the managers array
        updatedAccessControl.managers = updatedAccessControl.managers.includes(id)
            ? updatedAccessControl.managers.filter((managerId) => managerId !== id)
            : [...updatedAccessControl.managers, id];
    } else if (type === 'engineers') {
        // Update the engineers array
        updatedAccessControl.engineers = updatedAccessControl.engineers.includes(id)
            ? updatedAccessControl.engineers.filter((engineerId) => engineerId !== id)
            : [...updatedAccessControl.engineers, id];
    }

    // Set the new accessControl in formData
    setFormData((prev) => ({ ...prev, accessControl: updatedAccessControl }));
  };

  // select all
  const handleSelectAll = (type, isSelected) => {
    const updatedAccessControl = { ...formData.accessControl };
  
    if (type === 'annotators') {
      updatedAccessControl.annotators = isSelected ? annotators.map(annotator => annotator._id) : [];
      console.log("UpdatedAccessControl_:", updatedAccessControl)
    } else if (type === 'managers') {
      updatedAccessControl.managers = isSelected ? managers.map(manager => manager._id) : [];
    } else if (type === 'engineers') {
      updatedAccessControl.engineers = isSelected ? engineers.map(engineer => engineer._id) : [];
    }
  
    setFormData((prev) => ({ ...prev, accessControl: updatedAccessControl }));
  };
  

  const handleAssignChange = async (e) => {
    const { name, value, type, files, region } = e.target;
    if (type === 'file') {
      const file = files[0];
      if (file && file.name.endsWith('.zip')) {
        // Update the form data with the file object
        setFormData(prevState => ({
          ...prevState,
          [name]: file
        }));

        // Extract values from file name
        const fileName = file.name;
        const parts = fileName.split('-');
        const folderName = fileName.split('.')[0];
        const imageIndex = parts[5];

        // Update the form fields
        setFormData(prevState => ({
          ...prevState,
          folderName,
          imageIndex
        }));

        // Use FileReader to read the contents of the ZIP file
        const reader = new FileReader();
        reader.onload = async function (event) {
          try {
            const arrayBuffer = event.target.result;
            const zip = await JSZip.loadAsync(arrayBuffer);
            let totalImageCount = 0;

            // Iterate over files and count images
            zip.forEach((relativePath, zipEntry) => {
              if (!zipEntry.dir && /\.(jpg|jpeg|png|gif)$/i.test(zipEntry.name)) {
                totalImageCount += 1;
              }
            });

            setFormData(prevState => ({
              ...prevState,
              imageCount: totalImageCount
            }));
          } catch (error) {
            console.error('Error reading ZIP file:', error);
          }
        };
        reader.readAsArrayBuffer(file);

      } else {
        console.error('Please select a valid ZIP file.');
      }
    } else if (name === 'dataType') {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        subDataType: '' // Reset subDataType when dataType changes
      }));

      try {
        const response = await axios.get(`${api_url}/sub-data-types/${value}`);
        setSubDataTypes(response.data);
      } catch (error) {
        console.error('Error fetching sub data types:', error);
      }
    }else if (name === 'subDataType') {
      const selectedSubDataType = subDataTypes.find(sdt => sdt._id === value);

      setFormData(prevState => ({
        ...prevState,
        [name]: value,
        folderName: `${prevState.folderName}-${selectedSubDataType.subDataTypeName}` // Concatenate folderName with subDataTypeName
      }));
     } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }

  };

    const handleAssignFolder = async (e) => {
        e.preventDefault();
    
        console.log("formal form data_:", formData)
        const { folder, folderName, region, uploadedBy, nameofUploader, imageCount, dataType, subDataType, imageIndex, status } = formData;
    
        console.log("final folder name",folder,  folderName)
        console.log("role_for_England_:", nameofUploader)
        const data = new FormData();
        data.append('folder', folder);
        data.append('folderName', folderName);
        data.append('region', region);
        data.append('uploadedBy', uploadedBy);
        data.append('nameofUploader', nameofUploader);
        data.append('imageCount', imageCount);
        data.append('dataType', dataType);
        data.append('subDataType', subDataType);
        data.append('imageIndex', imageIndex);
        data.append('status', status);
        data.append('accessControl', JSON.stringify(formData.accessControl));
    
        setLoading(true);
    
        try {
          console.log("uploaded Data: ", formData)
          const response = await axios.post(`${api_url}/assign-folder`, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
            console.log('Uploaded:', response.data);
    
          if (response.status === 200) {
            setLoading(false);
            alert(response.data.message)
            fetchTotalImage()
            refreshGraphData()
            handleCloseAccessPopup()
            handleClosePopup(); 
          }
        
        } catch (error) {
          if (error.response && error.response.status === 400) {
            setLoading(false);
            console.log('Folder already exists:', error.response.data.message);
            alert(error.response.data.message)

          } else {
            // Handle any other errors
            setLoading(false);
            console.error('Error uploading folder:', error);
            alert('Error uploading folder');
          }
        }
      };

    const handleAssignFolderClick = () => {
        setisPopupForm(true)
      }
    
      const handleClosePopup = () => {
         // Reset form data
      setFormData({
        folder: null,
        folderName: '',
        imageCount: '',
        dataType: '',
        subDataType: '',
        imageIndex: '',
        uploadedBy: user._id,
        nameofUploader: role,
        status: 'PENDING',
        accessControl: {
          annotators: [],
          managers: [],
          engineers: []
      },
      });
      setSubDataTypes([]);
      setisPopupForm(false);
      }
    
      const handleOpenAccessControl = ()=>{
        setIsAccessPopupForm(true)
      }
    
      const handleCloseAccessPopup = ()=>{
        setIsAccessPopupForm(false)
      }

  if (loading) {
  return (
    <div>
      <Loader /> 
    </div>
  );
  }  

  return (
    <>
     <button onClick={handleAssignFolderClick}>Upload Folder</button>

      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && ( 
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Upload Folder</h2>
              <button className="close-button" onClick={handleClosePopup}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>


            <form id="assignFolderForm" onSubmit={handleAssignFolder}>

              <div className="form-group">
                <label htmlFor="folder">Folder (ZIP file):</label>
                <input type="file" id="folder" name="folder" accept=".zip" onChange={handleAssignChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="folderName">Folder Name:</label>
                <input type="text" id="folderName" name="folderName" value={formData.folderName} onChange={handleAssignChange} readOnly/>
              </div>
              <div className="form-group">
                <label htmlFor="totalImageCount">Total Image Count:</label>
                <input type="number" id="totalImageCount" name="imageCount" value={formData.imageCount} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="imageIndex">Image Index:</label>
                <input type="text" id="imageIndex" name="imageIndex" value={formData.imageIndex} readOnly />
              </div>
              <div className="form-group">
                <label htmlFor="region">Region</label>
                <input type="text" id="region" name="region" placeholder='region' value={formData.region} onChange={handleAssignChange} required/>
              </div>

              <div className="form-group">
                <label htmlFor="dataType">Data Type:</label>
                <select id="dataType" name="dataType" value={formData.dataType} onChange={handleAssignChange} required>
                  {/* taking _id after selecting the dataType, and showing subDataTypes on the basis of dataType */}
                  <option value="" disabled>Select DataType</option>
                  {dataTypes.map((dt) => (
                    <option key={dt._id} value={dt._id}>{dt.dataTypeName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subDataType">Sub Data Type:</label>
                <select id="subDataType" name="subDataType" value={formData.subDataType} onChange={handleAssignChange} required>
                  <option value="" disabled>Select Sub DataType</option>
                  {subDataTypes.map((sdt) => (
                    <option key={sdt._id} value={sdt._id}> {sdt.subDataTypeName} </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <input type="hidden" id="assignedBy" name="assignedBy" value={formData.assignedBy} />
              </div>

               <div className='form-group'>
                <div className='action-button' onClick={handleOpenAccessControl}> Access Control </div>
               </div>

              {/* <button type="submit" className="action-button">Upload</button> */}
            </form>
          </div>
        </div>
      )}

      {/* Access Control */}
      {isAccessPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Access Control</h2>
              <button className="close-button" onClick={handleCloseAccessPopup}>
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>


            <form onSubmit={handleAssignFolder}>
             <div className='access-control'>

              {/*------------------------------------------ access control select for Annotators -------------------------------*/}
                <div className="access-emp">
                  <div>Annotators</div>

                  {/* Select All Checkbox */}
                  <div className='checkbox'>
                  <input
                    type="checkbox"
                    checked={formData.accessControl.annotators.length === annotators.length}
                    onChange={(e) => handleSelectAll('annotators', e.target.checked)}
                  />
                    <div>Select All</div>
                  </div>

                  {/* Individual Annotator Checkboxes*/}
                  <div>
                    {annotators.length > 0 ? (
                      annotators.map((annotator, index) => (
                        <div className='checkbox'>
                          <input type="checkbox"
                          checked={formData.accessControl.annotators.includes(annotator._id)}
                          onChange={()=> handleCheckBoxChange('annotators', annotator._id)} 
                          />
                          <div>{annotator.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Annotators Presnt</div>
                    )}
                  </div>
                </div>

              {/*------------------------------------------------- access control select for Managers --------------------------------*/}
                <div className="access-emp">
                  <div>Managers</div>

                  {/* Select All Checkbox */}
                  <div className='checkbox'>
                    <input
                      type="checkbox"
                      checked={formData.accessControl.managers.length === managers.length}
                      onChange={(e) => handleSelectAll('managers', e.target.checked)}
                    />
                    <div>Select All</div>
                  </div>

                  {/* Individual Manager Checkboxes */}
                  <div>
                    {managers.length > 0 ? (
                      managers.map((manager, index) => (
                        <div className='checkbox'>
                          <input type="checkbox" 
                          checked={formData.accessControl.managers.includes(manager._id)}
                          onChange={()=> handleCheckBoxChange('managers', manager._id)} 
                          />
                          <div>{manager.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Managers Presnt</div>
                    )}
                  </div>
                </div>

              {/* ---------------------------------------access control select for Engineers ---------------------------------------*/}
                <div className="access-emp">
                  <div>Engineers</div>

                  {/* Select All Checkbox */}
                  <div className='checkbox'>
                    <input
                      type="checkbox"
                      checked={formData.accessControl.engineers.length === engineers.length}
                      onChange={(e) => handleSelectAll('engineers', e.target.checked)}
                    />
                    <div>Select All</div>
                  </div>

                  {/* Individual Engineer Checkboxes */}
                  <div>
                    {engineers.length > 0 ? (
                      engineers.map((engineer, index) => (
                        <div className='checkbox'>
                          <input type="checkbox" 
                          checked={formData.accessControl.engineers.includes(engineer._id)}
                          onChange={()=> handleCheckBoxChange('engineers', engineer._id)}
                          />
                          <div>{engineer.Name}</div>
                        </div>
                      ))
                    ) : (
                      <div>No Engineers Presnt</div>
                    )}
                  </div>

                </div>

             </div>
              <button type="submit" className="action-button">Upload</button>
            </form>
          </div>
        </div>
      )}

    </>
  )
}

export default UploadFolders