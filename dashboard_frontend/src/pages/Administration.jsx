import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import AdminDashboard from '../components/AdminSidenav/AdminDashboard';
import AdminProfile from '../components/AdminSidenav/AdminProfile';
import { useSelector } from 'react-redux';
import AdminSalary from '../components/AdminSidenav/AdminSalary';
import Sheet from '../components/AdminSidenav/Sheet';
import Logout from '../components/Logout/Logout';
import AllEngineers from '../components/AdminSidenav/AllEngineers';
import AllManagers from '../components/AdminSidenav/AllManagers';
import AllLabelers from '../components/AdminSidenav/AllLabelers';
import SalaryToBeCredited from '../components/AdminSidenav/SalaryToBeCredited';
import SalaryPendings from '../components/AdminSidenav/SalaryPendings';
import SalaryCredited from '../components/AdminSidenav/SalaryCredited';
import AnnotatorsAttendance from '../components/AdminSidenav/AnnotatorsAttendance';
import PendingFolders from '../components/AdminSidenav/PendingFolders';
import AcceptFolders from '../components/AdminSidenav/AcceptFolders';
import axios from 'axios';

import { io } from 'socket.io-client';

var api_url = import.meta.env.VITE_API_URL;

const Administration = () => {
    const name = 'Administration'

    const user = useSelector((store) => store.administration)


    const [selectedMenuItem, setSelectedMenuItem] = useState('Dashboard');
    const [isMembersDropdownVisible, setIsMembersDropdownVisible] = useState(false)
    const [isSalaryDropdownVisible, setIsSalaryDropdownVisible] = useState(false)
    const [isFoldersDropdownVisible, setIsFoldersDropdownVisible] = useState(false)

    const [pendingFoldersCount, setPendingFoldersCount] = useState(0); // State to track pending folders count


    const handleMembersClick = () => {
        setSelectedMenuItem('Dashboard');
        setIsMembersDropdownVisible(!isMembersDropdownVisible)
    }

    const handleSalaryClick = () => {
        setSelectedMenuItem('Dashboard');
        setIsSalaryDropdownVisible(!isSalaryDropdownVisible)
    }

    const handleFoldersClick = () => {
        setSelectedMenuItem('Dashboard');
        setIsFoldersDropdownVisible(!isFoldersDropdownVisible)
    }

    useEffect(() => {
        const fetchAssignFolders = async () => {
          try {
            const response = await axios.get(`${api_url}/pending-folders-fetch-DB`);
            setPendingFoldersCount(response.data.length); 
            console.log("pendingFolders_:", response.data.length);
          } catch (error) {
            console.log("getting error at the time of fetching data", error);
          }
        };
      
        // const intervalId = setInterval(() => {
          fetchAssignFolders();
        // }, 2000); 
        // return () => clearInterval(intervalId);


        // const socket = io(api_url); 

        // socket.on('pendingFoldersUpdate', (pendingFolders) => {
        //   setPendingFoldersCount(pendingFolders.length);
        //   console.log("Updated pending folders count:", pendingFolders.length);
        // });
    
        // return () => {
        //   socket.disconnect();
        // };

      }, []);
      


    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'Dashboard':
                return <AdminDashboard />

            case 'Pending':
                return <PendingFolders />

            case 'Engineers':
                return <AllEngineers/>

            case 'Managers':
                return <AllManagers/>;

            case 'Labelers':
                return <AllLabelers/>

            case 'Salary':
                return <AdminSalary/>

            case 'ToBeCredited':
                return <SalaryToBeCredited/>    

            case 'Pendings':
                return <SalaryPendings/>   
            
            case 'Accept':
                return <AcceptFolders/>    

            case 'Credited':
                return <SalaryCredited/>   

            case 'Profile':
                return <AdminProfile data={user}/>
             
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
                            <li onClick={handleFoldersClick} className={selectedMenuItem === 'Folders' ? 'active' : ''}>
                                <div>
                                    <i className='fas fa-users'></i>
                                    Folders
                                </div>

                                {pendingFoldersCount > 0 && (
                                    <div className='pending-folders-number'>{pendingFoldersCount}</div>
                                )}                               
                                <i class="fa-solid fa-angle-down"></i>
                            </li>
                            {isFoldersDropdownVisible && (
                                <ul className="dropdown">

                                    <li onClick={() => setSelectedMenuItem('Pending')} className={`${selectedMenuItem === 'Pending' ? 'active' : ''} nested`}>
                                        <div>
                                            <i className="fas fa-user-tie"></i>
                                            Pending Folders
                                        </div>
                                        {pendingFoldersCount > 0 && (
                                            <div className='pending-folders-number'>{pendingFoldersCount}</div>
                                        )} 
                                    </li>

                                    <li onClick={() => setSelectedMenuItem('Accept')} className={`${selectedMenuItem === 'Accept' ? 'active' : ''} nested`}>
                                        <div>
                                            <i className="fas fa-user-tie"></i>
                                            Accept Folders
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
                                <ul className="dropdown">
                                    <li onClick={() => setSelectedMenuItem('Engineers')} className={`${selectedMenuItem === 'Engineers' ? 'active' : ''} nested`}>
                                        <div>
                                            <i className="fas fa-user-tie"></i>
                                            Engineers
                                        </div>
                                    </li>

                                    <li onClick={() => setSelectedMenuItem('Managers')} className={`${selectedMenuItem === 'Managers' ? 'active' : ''} nested`}>
                                        <div>
                                            <i className="fas fa-user-tie"></i>
                                            Managers
                                        </div>
                                    </li>

                                    <li onClick={() => setSelectedMenuItem('Labelers')} className={`${selectedMenuItem === 'Labelers' ? 'active' : ''} nested`}>
                                        <div>
                                            <i className="fas fa-users"></i>
                                            Labelers
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


                            <li onClick={() => setSelectedMenuItem('AnnotatorsAttendance')} className={selectedMenuItem === 'AnnotatorsAttendance' ? 'active' : ''}>
                                <div>
                                    <i className="fas fa-file"></i>
                                    Annotators Attendance
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
                        <Logout user={{ type: 'administration' }} />
                    </div>
                </div>

                <div className="main-dashboard">
                    {renderContent()}
                </div>
            </div>
        </>
    )
}

export default Administration