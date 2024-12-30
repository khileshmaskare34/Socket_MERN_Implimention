import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ParticulerLabProfile from './ParticulerLabProfile';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const AllLabelers = () => {
  const [isPopupForm, setisPopupForm] = useState(false);
  const [message, setMessage] = useState('');
  const [dataTypes, setDataTypes] = useState([]);
  const [labelers, setLabelers] = useState([]);
  const [selectedLabeler, setSelectedLabeler] = useState(null);
  const [loading, setLoading] = useState(true)
  const [responseClass, setResponseClass] = useState('');

  const handleProfileClick = (labeler) => {
    setSelectedLabeler(labeler)
  }
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: []
  })

  const fetchDataType = async () => {
    try {
      const response = await axios.get(`${api_url}/data-types`)
      setDataTypes(response.data)
    } catch (error) {
      console.log("getting error at the time of fetching data", error)
    }
  }

  const fetchAllLabelers = async () => {
    try {
      const response = await axios.get(`${api_url}/get-labelers`)
      // console.log("labelers", response)
      setLabelers(response.data.labelers)
    } catch (error) {
      console.log("getting error at the time of fetching data", error)
    }finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDataType();
    fetchAllLabelers();
  }, [])

  const handleLabelerOnChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData(prevState => {
        const selectedRoles = prevState.role.includes(value)
          ? prevState.role.filter(id !== value)
          : [...prevState.role, value];
        return {
          ...prevState,
          role: selectedRoles
        }
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }))
    }
  }

  // Handle submit for submiting the form to the server
  const handleAddLabelerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api_url}/labeler-register`, formData);
      console.log("formData", response.data)
      if (response.status === 201) {
        setMessage(response.data.message);
        setResponseClass('response success')
        setTimeout(()=>{
          handleClosePopup();
        }, 1000)
        fetchAllLabelers()
      }
    } catch (error) {
      console.log("error", error)
    }
  }

  const handleAddLabelerClick = () => {
    setisPopupForm(true)
  }

  const handleClosePopup = () => {
    setMessage('');
    setResponseClass('')
    setisPopupForm(false);

    setFormData({
      name: '',
      email: '',
      password: '',
      role: []
    })
  }

  const handleBackToList = () => {
    setSelectedLabeler(null);
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
      <Loader/>
     </div>
    ) 
  }

  return (
    <>
      <div className="dash-top">
        <div className="eng-name">Labelers</div>
        <div className="folder-assign-btn">
          <button onClick={handleAddLabelerClick}>Add Annotators</button>
        </div>
      </div>

      {selectedLabeler ? (
        <div className="profile-section">
          <div  className="folder-assign-btn">
           <button className='action-button' onClick={handleBackToList}>Back to List</button>
           <button className='action-button'> {selectedLabeler.Name}</button>
          </div>
         <ParticulerLabProfile data={selectedLabeler}/>
        </div>
      ) : (
      <div className="members-list">
      {labelers.length > 0 ?(
          labelers.map((labeler, index)=>(
           <div className='members-card'>
            {/* <img src="" alt="" /> */}
            <div className="members-name">{labeler.Name}</div>
            <div className="members-email">{labeler.Email}</div>
            <div className="members-rols">
              {labeler.Role.map((role, index)=>(
              <span>{role.dataTypeName},</span>
              ))}
            </div>
            <button className="action-button" onClick={() => handleProfileClick(labeler)}>
              Profile
            </button>
           </div>
          ))
        ) : (
          <div className='members-card'>NO labelers present</div>
        )}
      </div>
      )}

      {/* Folder Assigning Form, its will open afte clicking on assign folder button */}
      {isPopupForm && (
        <div className="popup-overlay">
          <div className="popup">

            <div className="popup-header">
              <h2>Add Labelers</h2>
              <button className="close-button" onClick={handleClosePopup}>X</button>
            </div>

            <form onSubmit={handleAddLabelerSubmit}>

              {/* ---------Showing the response here assgned success or not------- */}
              {message && (
                <div className={responseClass}>
                  {message}
                </div>
              )}

              <div className="form-group">
                <input type="text" id="labelerName" name="name" placeholder='Labeler Name' value={formData.name} onChange={handleLabelerOnChange} required />
              </div>

              <div className="form-group">
                <input type="email" id="labelerEmail" name="email" placeholder='Labeler Email' value={formData.email} onChange={handleLabelerOnChange} required />
              </div>

              <div className="form-group">
                <input type="text" id="labelerPassword" name="password" placeholder='Enter Password' value={formData.password} onChange={handleLabelerOnChange} required />
              </div>

              <div className="form-group">
                {/* <label htmlFor="role">Data Type:</label> */}
                <select id="role" name="role" value={formData.role} onChange={handleLabelerOnChange}>
                  <option value="">Select DataType </option>
                  {dataTypes
                    .filter(dt => !formData.role.includes(dt._id))
                    .map((dt) => (
                      <option key={dt._id} value={dt._id}>{dt.dataTypeName}</option>
                    ))
                  }
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

              <button type="submit" className="action-button">Add Labeler</button>
            </form>

          </div>
        </div>

      )}
    </>
  )
}

export default AllLabelers