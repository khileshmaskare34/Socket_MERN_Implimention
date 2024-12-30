import axios from 'axios';
import React, { useEffect, useState } from 'react'
import Loader from './Loader';
var api_url = import.meta.env.VITE_API_URL;

const AddDataType = () => {

// for data type
  const [isDataTypeForm, setIsDataTypeForm] = useState(false);
  const [dataType, setDataType] = useState({ name: '' });

//   for sub Data type
  const [isSubDataTypeForm, setIsSubDataTypeForm] = useState(false);
  const [responseClass, setResponseClass] = useState('');
  const [message, setMessage] = useState(null);
  const [getDataType, setGetDataType] = useState([])
  const [selectedDataType, setSelectedDataType] = useState('');
  const [subDataTypeName, setSubDataTypeName] = useState('');
  const [costPerImage, setCostPerImage] = useState('');
  const [subData, setSubData] = useState('');
  const [loading, setLoading] = useState(true)


//   for data type
  const handleAddDataType = () => {
    setIsDataTypeForm(true);
  }

  const handleClosePopup = () => {
    setIsDataTypeForm(false);
    setDataType({ name: '' }); // Reset input field
    setMessage(null); // Reset message
    setResponseClass(''); // Reset response class
  }

  const submitDataType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_url}/add-data-types`, dataType);
      if (response.status === 200) {
        setMessage(response.data.message);
        setResponseClass('response success');
        fetchDataType()
        setTimeout(() => {
          handleClosePopup();
        }, 1000);
      }
    } catch (error) {
      setResponseClass('response error');
      setMessage(response.data.message);
      console.log("Error:", error);
    }
  }

//   for sub Data type
  const handleAddSubDataType = () => {
    setIsSubDataTypeForm(true);
  }

  const handleCloseSubDataPopup = () => {
    setIsSubDataTypeForm(false);
    setSubDataTypeName('')
    setCostPerImage('')
    setMessage(null);
    setResponseClass('');
  }

  const fetchDataType = async () => {
    try {
      const response = await axios.get(`${api_url}/data-types`)
      setGetDataType(response.data)
    } catch (error) {
      console.log("getting error at the time of fetching data", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSubDataType = async () => {
    try {
      const response = await axios.get(`${api_url}/data-subData-type`)
      console.log("+++",response)
      setSubData(response.data)
    } catch (error) {
      console.log("getting error at the time of fetching data", error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(()=>{
    fetchDataType();
    fetchSubDataType();
  },[])

  const handleDataTypeChange = (e) => {
    setSelectedDataType(e.target.value);
  };
  
  
  const submitSubDataType = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_url}/sub-data-types`, {
        dataType: selectedDataType,
        subDataTypeName,
        costPerImage,
      });
      // console.log('rzxs', response)
      if(response.status === 200) {
        setMessage(response.data.message)
        setResponseClass('response success')
        fetchSubDataType()
        setTimeout(() => {
          handleCloseSubDataPopup()  
        }, 1000);
      }
      // Handle success response
    } catch (error) {
      setResponseClass('response error');
      setMessage(response.data.message);
      console.log("Error while adding sub data type", error);
    }
  };

  if(loading){
    return (
     <div>
      <Loader/>
     </div>
    ) 
  }

  return (
    <>
      <div className="dash-top">
        <div className="eng-name">
        </div>

        <div className="folder-assign-btn">
          <button onClick={handleAddSubDataType}>AddSubDataType</button>
          <button onClick={handleAddDataType}>AddDataType</button>
        </div>
      </div>

      <div className="assigned-folders">
        <h1>Data Type & Sub Data Types</h1>
        <table>
            <thead>
                <tr>
                    <th>Data Type</th>
                    <th>Sub Data Type</th>
                    <th>Cost Per Unit</th>
                </tr>
            </thead>
            <tbody>
              {subData.length > 0 ? (
                subData.map((data, index)=>(
                  <tr key={data._id}>
                  <td>{data.dataType.dataTypeName}</td>
                  <td>{data.subDataTypeName}</td>
                  <td>{data.costPerImage}</td>
                </tr>
                ))
              ) : (
                <tr>
                  <td>
                    No Data & Sub Data Presnt
                  </td>
                </tr>
              )}
          
               
               
            </tbody>
        </table>
     </div>
      {/* Add Data types form */}
      {isDataTypeForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2> Add Data Types </h2>
              <button className="close-button" onClick={handleClosePopup}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Message display */}
            {message && (
              <div className={responseClass}>
                {message}
              </div>
            )}
            <form onSubmit={submitDataType}>
              <div className="form-group">
                <input 
                  type="text" 
                  id="dataTypes" 
                  name="datatype" 
                  placeholder="Data Types Name" 
                  value={dataType.name} 
                  onChange={(e) => setDataType({ ...dataType, name: e.target.value })} 
                  required 
                />
              </div>

              <button type="submit" className="action-button">Add</button>
            </form>

          </div>
        </div>
      )}

      {/* Add Sub Data types form */}
      {isSubDataTypeForm && (
    <div className="popup-overlay">
      <div className="popup">
        <div className="popup-header">
          <h2>Add Sub Data Types</h2>
          <button className="close-button" onClick={handleCloseSubDataPopup}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
            {/* Message display */}
            {message && (
              <div className={responseClass}>
                {message}
              </div>
            )}
        <form onSubmit={submitSubDataType}>
          <div className="form-group">
            <select onChange={handleDataTypeChange} value={selectedDataType} required>
              <option value="">Select Data Type</option>
              {getDataType.map((dataType) => (
                <option key={dataType._id} value={dataType._id}>
                  {dataType.dataTypeName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="subDataTypeName"
              placeholder="Sub Data Type Name"
              value={subDataTypeName}
              onChange={(e) => setSubDataTypeName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="costPerImage"
              placeholder="Cost Per Image"
              value={costPerImage}
              onChange={(e) => setCostPerImage(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="action-button">Add</button>
        </form>
      </div>
    </div>
  )}
    </>
  );
}

export default AddDataType;
