import React, { useState } from 'react'
import Header from '../components/Header';
import AssignedFoldersByMang from '../components/LabSidenav/AssignedFoldersByMang';
import SubmittedFolders from '../components/LabSidenav/SubmittedFolders';
import LabDashboard from '../components/LabSidenav/LabDashboard';
import { useSelector } from 'react-redux';
import Logout from '../components/Logout/Logout';
import LabProfile from '../components/LabSidenav/LabProfile';
import LabSheet from '../components/LabSidenav/LabSheet';

const Labeler = () => {
  const name = 'Labeler'
  const user = useSelector((store) => store.labeler)


  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');


  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Dashboard':
        return <LabDashboard user={user}/>

      case 'AssignedFolders':
        return <AssignedFoldersByMang />

      case 'SubmittedFolders':
        return <SubmittedFolders user={user}/>

      case 'Profile':
        return <LabProfile data={user} />

      case 'Sheet':
        return <LabSheet user={user}/>  
    }
  }
  return (
    <>
      <Header name={name} />
      <div className='dashboard'>
        <div className="side-nav">

          <div className="side-nav-links">
            <ul>
              <li onClick={() => setSelectedMenuItem('Dashboard')}>
                <div>
                  <i className="fas fa-home"></i>
                  Dashboard
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('AssignedFolders')}>
                <div>
                  <i className="fas fa-folder"></i>
                  Assigned Folders
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('SubmittedFolders')}>
                <div>
                  <i class="fa-solid fa-circle-check"></i>
                  Submitted Folders
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('Profile')}>
                <div>
                  <i className="fas fa-user"></i>
                  Profile
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('Sheet')}>
                <div>
                  <i className="fas fa-file"></i>
                  Sheet
                </div>
              </li>

            </ul>
          </div>
          <div className="sign-out">
           <Logout user={{type: 'labeler'}}/>
          </div>
        </div>
        <div className="main-dashboard">
          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default Labeler