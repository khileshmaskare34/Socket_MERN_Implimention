import React, { useState } from 'react'
import Header from '../components/Header'

// From manager side nav
import UploadedFoldersByEng from '../components/MangSideNav/UploadedFoldersByEng';
import MangDashboard from '../components/MangSideNav/MangDashboard';
import AssignedFolderToLab from '../components/MangSideNav/AssignedFolderToLab';
import SubmittedFolderByLeb from '../components/MangSideNav/SubmittedFolderByLeb';
import CheckedFolders from '../components/MangSideNav/CheckedFolders';

import EngProfile from '../components/EngSidenav/EngProfile';
import { useSelector } from 'react-redux';
import Logout from '../components/Logout/Logout';
import MangProfile from '../components/MangSideNav/MangProfile';
import Sheet from '../components/AdminSidenav/Sheet';
import AllLabelers from '../components/AdminSidenav/AllLabelers';

const Manager = () => {
  const name = 'Manager'

  const user = useSelector((store)=> store.manager)
  console.log("newUser_", user)
  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
  const [isFolderDropdownVisible, setIsFolderDropdownvisible] = useState(false)


  const handleFolderClick = () => {
    setSelectedMenuItem('Dashboard')
    setIsFolderDropdownvisible(!isFolderDropdownVisible)
  }

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Dashboard':
        return <MangDashboard user={user}/>

      case 'UploadedFolders':
        return <UploadedFoldersByEng />

      case 'AssignedFoldersToLab':
        return <AssignedFolderToLab />

      case 'SubmittedFoldersByLeb':
        return <SubmittedFolderByLeb user={user}/>  

      case 'CheckedFolders':
        return <CheckedFolders />

      // Eng labeler or Man labeler both are same, thats why we used 
      case 'Labelers':
        return <AllLabelers />

      case 'Profile':
        return <MangProfile data={user}/>

      case 'Sheet':
        return <Sheet/>  
    }
  }

  return (
    <>
      <Header name={name} />
      <div className='dashboard'>
        <div className="side-nav">
          <div className="side-nav-links">
            <ul>
              <li onClick={() => setSelectedMenuItem('Dashboard')} className={selectedMenuItem === 'Dashboard' ? 'active' : ''}>
                <div>
                  <i className="fas fa-home"></i>
                  Dashboard
                </div>
              </li>

              {/* Folders dropdown */}
              <li onClick={handleFolderClick} className={selectedMenuItem === 'Folders' ? 'active' : ''}>
                <div>
                  <i className="fas fa-folder"></i>
                  Folders
                </div>
                <i class="fa-solid fa-angle-down"></i>
              </li>
              {isFolderDropdownVisible && (
                <ul className="dropdown">
                  <li onClick={() => setSelectedMenuItem('UploadedFolders')} className={`${selectedMenuItem === 'AssignedFolders' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-folder"></i>
                       Folders Uploaded By Engineers
                    </div>
                  </li>

                  <li onClick={() => setSelectedMenuItem('AssignedFoldersToLab')} className={`${selectedMenuItem === 'AssignedFoldersToLab' ? 'active' : ''} nested`}>
                    <div>
                      Assigned Folders To Annotators
                    </div>
                  </li>

                  <li onClick={() => setSelectedMenuItem('SubmittedFoldersByLeb')} className={`${selectedMenuItem === 'SubmittedFoldersByLeb' ? 'active' : ''} nested`}>
                    <div>
                    Submitted Folders By Annotators
                    </div>
                  </li>

                  <li onClick={() => setSelectedMenuItem('CheckedFolders')} className={`${selectedMenuItem === 'CheckedFolders' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-check"></i>
                      Checked Folders
                    </div>
                  </li>

                </ul>
              )}

              <li onClick={() => setSelectedMenuItem('Labelers')} className={selectedMenuItem === 'Labelers' ? 'active' : ''}>
                <div>
                  <i className="fas fa-users"></i>
                  Labelers
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('Profile')} className={selectedMenuItem === 'Profile' ? 'active' : ''}>
                <div>
                  <i className="fas fa-user"></i>
                  Profile
                </div>
              </li>
              <li onClick={() => setSelectedMenuItem('Sheet')} className={selectedMenuItem === 'Sheet' ? 'active' : ''}>
                <div>
                  <i className="fas fa-file"></i>
                  Sheet
                </div>
              </li>

            </ul>
          </div>
          <div className="sign-out">
            <Logout user={{type: 'manager'}}/>
          </div>
        </div>
        <div className="main-dashboard">
          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default Manager