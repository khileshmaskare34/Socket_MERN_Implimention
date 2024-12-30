import React from 'react';
import { Link } from 'react-router-dom';
import Engineer from './Engineer';
import './Home_style.css'; 

const Home = () => {
  return (
    <div className='landing'>
      <div className="main-content">
        <div className="main-text">
          <h1>Welcome to the Data Labeling Management System</h1>
          <p>Access Your Dashboard</p>
        </div>
      </div>
      <div className="right">

      <div className="box">
          <div className="image">
            <img src="src/assets/images/administration_Image.png" alt="Data Labeler" />
          </div>
          <div className="inner-box">
            <h3>Administration</h3>
            <p>Login as a Administration</p>
            <Link to="/administration-login" className="linkStyle">
              <button>
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="box">
          <div className="image">
            <img src="src/assets/images/EMERGING-CAREERS-Explore-Data-Engineer-1.png" alt="Data Engineer" />
          </div>
          <div className="inner-box">
            <h3>Data Engineer</h3>
            <p>Login as a engineer</p>
            <Link to="/engineer-login" className="linkStyle">
              <button>
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="box">
          <div className="image">
            <img src="src/assets/images/img5.png" alt="Data Manager" />
          </div>
          <div className="inner-box">
            <h3>Data Manager</h3>
            <p>Login as a manager</p>
            <Link to="/manager-login" className="linkStyle">
              <button>
                Login
              </button>
            </Link>
          </div>
        </div>

        <div className="box">
          <div className="image">
            <img src="src/assets/images/[removal.ai]_e2b46013-b415-49d6-bd4b-dec57ade4bde_images.png" alt="Data Labeler" />
          </div>
          <div className="inner-box">
            <h3>Data Annotator</h3>
            <p>Login as a annotator</p>
            <Link to="/labeler-login" className="linkStyle">
              <button>
                Login
              </button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
