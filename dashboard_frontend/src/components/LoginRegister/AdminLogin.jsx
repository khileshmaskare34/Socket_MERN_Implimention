import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './sigin_style.css';
import { setAdministration } from '../../redux/action/userAction';

var api_url = import.meta.env.VITE_API_URL;

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [responseClass, setResponseClass] = useState(''); // State to hold the class name
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    console.log("loginChange", e.target)
    setLoginData({ ...loginData, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      
      // administration login api
      const response = await axios.post(`${api_url}/administration-login`, loginData);

      const token = response.data.token;
      console.log("loginData",token)

      if (response.status === 200) {
        localStorage.setItem('authToken', token);

        const userResponse = await axios.get(`${api_url}/get-administration`, {
          headers: {Authorization: `Bearer ${token}`}
        })
        const loggedInAdministration = userResponse.data;
        localStorage.setItem('administration', JSON.stringify(loggedInAdministration))

        dispatch(setAdministration(loggedInAdministration, 'administration'));
        navigate(`/administration/${loggedInAdministration._id}`);

        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('administration');
          navigate('/administration-login'); // Navigate back to login
        }, 600000); // 10 minute = 600000ms
        
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'An error occurred');
      setResponseClass('response error'); 
    }
  };

  return (
    <div className="container">
      <div className="forms-container">
        <div className="signin-signup">
          <form onSubmit={handleLoginSubmit} className="sign-in-form">
            <h4 className="title">Login</h4>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <input type="submit" value="Login" className="btn solid" />
            {message && (
                <div className={responseClass}>
                  {message}
                </div>
            )}
          </form>
        </div>
      </div>
      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Administration</h3>
          </div>
          <img src="/public/image/swaayatt_logo.png" className="image_ad" alt="Admin" />
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
