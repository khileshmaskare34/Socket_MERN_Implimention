import React, { useState } from 'react';
var api_url = import.meta.env.VITE_API_URL;

const MangProfile = ({ data, onSave }) => {
  const [name, setName] = useState(data.Name || '');
  const [email, setEmail] = useState(data.Email || '');

  const handleSave = async() => {
    const updatedData = {
      id: data._id, // Include the user ID
      Name: name,
      Email: email
    };

    const response = await axios.post(`${api_url}/update-manager-profile`, updatedData) 
    console.log(response)
  };

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
          {/* <button className="action-button" onClick={handleSave}>Save</button> */}
        </div>
      </div>
    </div>
  );
};

export default MangProfile;
