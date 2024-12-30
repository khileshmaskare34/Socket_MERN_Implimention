import axios from 'axios';
import React, { useEffect, useState } from 'react';
var api_url = import.meta.env.VITE_API_URL;

const LabProfile = ({ data }) => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchProfile = async () => {
    const labId = data._id;
    try {
      const response = await axios.get(`${api_url}/lab-profile`, {
        params: { id: labId } // Send the ID as a query parameter
      });

      const labData = response.data;
      setProfile(labData);
      setName(labData.Name || '');
      setEmail(labData.Email || '');
      setSelectedDataTypes(labData.Role || []);
    } catch (error) {
      console.error('Error fetching profile', error);
    }
  };

  const fetchAvailableDataTypes = async () => {
    try {
      const response = await axios.get(`${api_url}/data-types`);
      setAvailableDataTypes(response.data);
    } catch (error) {
      console.error('Error fetching data types', error);
    }
  };

  useEffect(() => {
    if (data?._id) {
      fetchProfile();
    }
    fetchAvailableDataTypes();
  }, [data]);



  return (
    <div className="profilex">
      <div className="profile-card">
        <div className="details-card">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* <div>
            <h3>Available Data Types:</h3>
            <select onChange={(e) => handleAddDataType(e.target.value)}>
              <option value="">Select Data Type</option>
              {availableDataTypes.map((dataType) => (
                <option key={dataType._id} value={dataType._id}>
                  {dataType.dataTypeName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <h3>Selected Data Types:</h3>
            <ul>
              {selectedDataTypes.map((dataType) => (
                <li key={dataType._id}>
                  {dataType.dataTypeName}
                  <button onClick={() => handleDeleteDataType(dataType._id)}>Delete</button>
                </li>
              ))}
            </ul>
          </div> */}

          {/* <button className="action-button" onClick={handleSave}>Save</button> */}
        </div>
      </div>
    </div>
  );
};

export default LabProfile;
