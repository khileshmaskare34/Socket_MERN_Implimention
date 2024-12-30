import React from 'react';
import './header.css';
import logo from '../assets/images/swaayatt_logo.png'; 
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';
import ToggleSwitch from './ToggleSwitch';

const Header = ({name}) => {
  return (
    <header className='header'>
      <div className="header-left">
        <div className="header-logo">
          <img src={logo} alt="Logo" />
        </div>
        <div className="data-labeler-dashboard">
          <h4>{name} Dashboard</h4>
        </div>
      </div>
      <div className="header-right">
        {/* <div className="search-bar">
          <input type="search" placeholder='Search anything...' />
        </div> */}
        <div className="header-actions">
          <ToggleSwitch /> 
          {/* <div className="notifications">
            <FontAwesomeIcon icon={faBell} className="icon notification-icon" />
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
