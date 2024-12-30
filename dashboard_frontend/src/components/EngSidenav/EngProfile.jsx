import React, { useState } from 'react';
import axios from 'axios';
var api_url = import.meta.env.VITE_API_URL;

const EngProfile = ({ data }) => {
  const [name, setName] = useState(data.Name || '');
  const [email, setEmail] = useState(data.Email || '');

  const handleSave = async () => {
    try {
      const updatedData = {
        id: data._id, // Include the user ID
        Name: name,
        Email: email
      };

      const response = await axios.post(`${api_url}/update-engineer-profile`, updatedData);
      console.log('Profile updated successfully:', response.data);
      // Optionally, handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error saving profile', error);
      // Optionally, handle error (e.g., show an error message)
    }
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

export default EngProfile;
