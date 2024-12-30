import React, { useState } from 'react'
import { useSelector } from 'react-redux';

import logo from '../assets/images/swaayatt_logo.png';

import Header from '../components/Header'
import EngDashboard from '../components/EngSidenav/EngDashboard';
import EngUploadedFolders from '../components/EngSidenav/EngUploadedFolders';
import EngProfile from '../components/EngSidenav/EngProfile';
import EngCheckedFolders from '../components/EngSidenav/EngCheckedFolders';
import EngFinalcheckedFolders from '../components/EngSidenav/EngFinalcheckedFolders';
import EngLabSalary from '../components/EngSidenav/EngLabSalary';
import Logout from '../components/Logout/Logout';
import AddDataType from '../components/AddDataType';
import Sheet from '../components/AdminSidenav/Sheet';
import AllManagers from '../components/AdminSidenav/AllManagers';
import AllLabelers from '../components/AdminSidenav/AllLabelers';
import SalaryToBeCredited from '../components/AdminSidenav/SalaryToBeCredited';
import SalaryPendings from '../components/AdminSidenav/SalaryPendings';
import SalaryCredited from '../components/AdminSidenav/SalaryCredited';
import AnnotatorsAttendance from '../components/AdminSidenav/AnnotatorsAttendance';



const Engineer = () => {
  const name = 'Engineer'

  const user = useSelector((store) => store.engineer);

  const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
  const [isFolderDropdownVisible, setIsFolderDropdownvisible] = useState(false)
  const [isMembersDropdownVisible, setIsMembersDropdownVisible] = useState(false);
  const [isSalaryDropdownVisible, setIsSalaryDropdownVisible] = useState(false)


  const handleFolderClick = () => {
    setSelectedMenuItem('Dashboard');
    setIsFolderDropdownvisible(!isFolderDropdownVisible)
  }

  const handleMembersClick = () => {
    setSelectedMenuItem('Dashboard');
    setIsMembersDropdownVisible(!isMembersDropdownVisible);
  };

  const handleSalaryClick = () => {
    setSelectedMenuItem('Dashboard');
    setIsSalaryDropdownVisible(!isSalaryDropdownVisible)
  }

  const renderContent = () => {
    switch (selectedMenuItem) {
      case 'Dashboard':
        return <EngDashboard />;

      case 'UploadedFolders':
        return <EngUploadedFolders />;

      case 'CheckedFolders':
        return <EngCheckedFolders user={user}/>;

      case 'FinalCheckedFolders':
        return <EngFinalcheckedFolders />;

      case 'Managers':
        return <AllManagers />;

      case 'Labelers':
        return <AllLabelers />

      case 'ToBeCredited':
        return <SalaryToBeCredited/>    

      case 'Pendings':
        return <SalaryPendings/>   

      case 'Credited':
        return <SalaryCredited/>   

      case 'DataType':
        return <AddDataType/>  

      case 'Profile':
        return <EngProfile data={user}/>

      case 'Sheet':
        return <Sheet/> 
        
      case 'AnnotatorsAttendance':
        return <AnnotatorsAttendance/>  
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
                  <li onClick={() => setSelectedMenuItem('UploadedFolders')} className={`${selectedMenuItem === 'UploadedFolders' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-folder"></i>
                      Uploaded Folders
                    </div>
                  </li>
                  <li onClick={() => setSelectedMenuItem('CheckedFolders')} className={`${selectedMenuItem === 'CheckedFolders' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-check"></i>
                      Checked Folders
                    </div>
                  </li>
                  <li onClick={() => setSelectedMenuItem('FinalCheckedFolders')} className={`${selectedMenuItem === 'FinalCheckedFolders' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-check-double"></i>
                      Final Checked Folders
                    </div>
                  </li>
                </ul>
              )}

              {/* Members dropdown */}
              <li onClick={handleMembersClick} className={selectedMenuItem === 'Members' ? 'active' : ''}>
                <div>
                  <i className='fas fa-users'></i>
                  Members
                </div>
                <i class="fa-solid fa-angle-down"></i>
              </li>
              {isMembersDropdownVisible && (
                <ul className='dropdown'>
                  <li onClick={() => setSelectedMenuItem('Managers')} className={`${selectedMenuItem === 'Managers' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-user-tie"></i>
                      Managers
                    </div>
                  </li>
                  <li onClick={() => setSelectedMenuItem('Labelers')} className={`${selectedMenuItem === 'Labelers' ? 'active' : ''} nested`}>
                    <div>
                      <i className="fas fa-users"></i>
                      Annotators
                    </div>
                  </li>
                </ul>
              )}

              {/* Salary dropdown */}
              <li onClick={handleSalaryClick} className={selectedMenuItem === 'Salary' ? 'active' : ''}>
                <div>
                  <i className="fas fa-dollar-sign"></i>
                  Salary
                </div>
                <i class="fa-solid fa-angle-down"></i>
              </li>
              {isSalaryDropdownVisible && (
                <ul className="dropdown">
                  <li onClick={() => setSelectedMenuItem('ToBeCredited')} className={`${selectedMenuItem === 'ToBeCredited' ? 'active' : ''} nested`}>
                    <div>
                     <i class="fa-solid fa-circle-dollar-to-slot"></i>
                      To Be Credited
                    </div>
                  </li>
                  <li onClick={() => setSelectedMenuItem('Pendings')} className={`${selectedMenuItem === 'Pendings' ? 'active' : ''} nested`}>
                    <div>
                     <i class="fa-solid fa-hourglass-half"></i>
                      Pendings
                    </div>
                  </li>
                  <li onClick={() => setSelectedMenuItem('Credited')} className={`${selectedMenuItem === 'Credited' ? 'active' : ''} nested`}>
                    <div>
                    <i class="fa-solid fa-circle-check"></i>
                      Credited
                    </div>
                  </li>
                </ul>
              )}

              <li onClick={() => setSelectedMenuItem('DataType')} className={selectedMenuItem === 'DataType' ? 'active' : ''}>
                <div>
                  <i className="fas fa-database"></i>
                  Add Data Type
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
              <li onClick={() => setSelectedMenuItem('AnnotatorsAttendance')} className={selectedMenuItem === 'AnnotatorsAttendance' ? 'active' : ''}>
                <div>
                  <i className="fas fa-file"></i>
                  Annotators Attendance
                </div>
              </li>
            </ul>
          </div>
          <div className="sign-out">
            <Logout user={{type: 'engineer'}}/>
          </div>
        </div>

        <div className="main-dashboard">
          {renderContent()}
        </div>
      </div>
    </>
  );
}


export default Engineer