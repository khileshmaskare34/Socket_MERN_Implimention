import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ParticulerEngProfile from './ParticulerEngProfile';
import Loader from '../Loader';
var api_url = import.meta.env.VITE_API_URL;

const AllEngineers = () => {
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineer, setSelectedEngineer] = useState(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchAllEngineers = async () => {
      try {
        const response = await axios.get(`${api_url}/get-engineers`);
        console.log("eng", response);
        setEngineers(response.data.engineers);
      } catch (error) {
        console.log("getting error at the time of fetching data", error);
      } finally {
        setLoading(false)
      }
    };
    fetchAllEngineers();
  }, []);

  const handleProfileClick = (engineer) => {
    setSelectedEngineer(engineer);
  };

  const handleBackToList = () => {
    setSelectedEngineer(null);
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
        <div className="eng-name">Engineers</div>
      </div>
      {selectedEngineer ? (
        <div className="profile-section">
          <div className="folder-assign-btn">
           <button className='action-button' onClick={handleBackToList}>Back to List</button>
           <button className='action-button'>{selectedEngineer.Name}</button>
          </div>
          <ParticulerEngProfile user={selectedEngineer}/>
        </div>
      ) : (
      <div className="members-list">
        {engineers.length > 0 ? (
          engineers.map((engineer, index) => (
            <div key={engineer._id} className='members-card'>
              {/* <img src="" alt="" /> */}
              <div className="members-name">{engineer.Name}</div>
              <div className="members-email">{engineer.Email}</div>
              <button
                  className="action-button"
                  onClick={() => handleProfileClick(engineer)}
              >
                  Profile
              </button>
            </div>
          ))
        ) : (
          <div>No Engineers</div>
        )}
      </div>
      )}

    </>
  );
};

export default AllEngineers;
