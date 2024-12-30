import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ParticulerMangProfile from './ParticulerMangProfile';
import Loader from '../Loader'
var api_url = import.meta.env.VITE_API_URL;

const AllManagers = () => {
  const [isPopupForm, setIsPopupForm] = useState(false);
  const [responseClass, setResponseClass] = useState(''); // State to hold the class name
  const [message, setMessage] = useState('');
  const [dataTypes, setDataTypes] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [loading, setLoading] = useState(true)

  const handleProfileClick = (manager) => {
    setSelectedManager(manager);
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: []
  });

    const fetchDataType = async () => {
      try {
        const response = await axios.get(`${api_url}/data-types`);
        console.log("datatypes", response.data);
        setDataTypes(response.data);
      } catch (error) {
        console.log("getting error at the time of fetching data", error);
      }
    };

    const fetchAllManagers = async () => {
      try {
        const response = await axios.get(`${api_url}/get-managers`);
        console.log("manag", response);
        setManagers(response.data.managers);
      } catch (error) {
        console.log("getting error at the time of fetching data", error);
      } finally{
        setLoading(false)
      }
    };

  useEffect(()=>{
    fetchDataType();
    fetchAllManagers();
  }, [])

  const handleManagerOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData(prevState => {
        const selectedRoles = prevState.role.includes(value)
          ? prevState.role.filter(id => id !== value)
          : [...prevState.role, value];
        return {
          ...prevState,
          role: selectedRoles
        };
      });
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleAddManagerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_url}/manager-register`, formData);

      console.log("formData", formData)
      if (response.status === 201) {
        setMessage(response.data.message);
        setResponseClass('response success')
        setTimeout(()=>{
          handleClosePopup(); 
        }, 1000)
        fetchAllManagers();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleAddManagerClick = () => {
    setIsPopupForm(true);
  };

  const handleClosePopup = () => {
    setMessage('')
    setResponseClass('')
    setIsPopupForm(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: []
    })
  };

  const handleBackToList = () => {
    setSelectedManager(null);
  };

  const handleRemoveSelectedType = (typeId) => {
    setFormData(prevState => ({
      ...prevState,
      role: prevState.role.filter(id => id !== typeId)
    }));
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
      <div className="dash-top">
        <div className="eng-name">Managers</div>
        <div className="folder-assign-btn">
          <button onClick={handleAddManagerClick}>Add Manager</button>
        </div>
      </div>

      {selectedManager ? (
        <div className="profile-section">
          <div className="folder-assign-btn">
           <button className='action-button' onClick={handleBackToList}>Back to List</button>
           <button className='action-button'>{selectedManager.Name}</button>
          </div>
          <ParticulerMangProfile user={selectedManager}/>
        </div>
      ) : (
        <div className="members-list">
          {managers.length > 0 ? (
            managers.map((manager, index) => (
              <div className='members-card' key={index}>
                {/* <img src="" alt="" /> */}
                <div className="members-name">{manager.Name}</div>
                <div className="members-email">{manager.Email}</div>
                <div className="members-rols">
                  {manager.Role.map((role, index) => (
                    <span  key={index}>{role.dataTypeName},</span>
                  ))}
                </div>
                <button
                  className="action-button"
                  onClick={() => handleProfileClick(manager)}
                >
                  Profile
                </button>
              </div>
            ))
          ) : (
            <div className='members-card'>No managers present</div>
          )}
        </div>
      )}


      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="popup-header">
              <h2>Add Manager</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>


            <form onSubmit={handleAddManagerSubmit}>

              {/* ---------Showing the response here assgned success or not------- */}
              {message && (
                <div className={responseClass}>
                  {message}
                </div>
              )}


              <div className="form-group">
                <input type="text" id="managerName" name="name" placeholder='Manager Name' value={formData.name} onChange={handleManagerOnChange} required />
              </div>

              <div className="form-group">
                <input type="email" id="managerEmail" name="email" placeholder='Manager Email' value={formData.email} onChange={handleManagerOnChange} required />
              </div>

              <div className="form-group">
                <input type="password" id="managerPassword" name="password" placeholder='Enter Password' value={formData.password} onChange={handleManagerOnChange} required />
              </div>

              <div className="form-group">
                {/* <label htmlFor="role">Data Type:</label> */}
                <select id='folderSelect' name="role" value={formData.role} onChange={handleManagerOnChange} >
                  <option value="" >Select DataType</option>
                  {dataTypes
                    .filter(dt => !formData.role.includes(dt._id))
                    .map((dt) => (
                      <option key={dt._id} value={dt._id}>{dt.dataTypeName}</option>
                    ))}
                </select>
              </div>

              <div className='dataTypes'>
                <h4>Selected Data Types:</h4>
                {formData.role.length > 0 && (
                  <div className='dataType'>
                    {formData.role.map(typeId => {
                      const type = dataTypes.find(dt => dt._id === typeId);
                      return (
                        <div key={typeId}>
                          {type?.dataTypeName}
                          <button type="button" onClick={() => handleRemoveSelectedType(typeId)}>Remove</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <button type="submit" className="action-button">Add Manager</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AllManagers;
