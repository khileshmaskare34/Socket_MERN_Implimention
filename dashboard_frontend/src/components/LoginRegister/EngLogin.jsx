import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setEngineer } from '../../redux/action/userAction';
import './sigin_style.css';
var api_url = import.meta.env.VITE_API_URL;

const EngLogin = () => {
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
      console.log("loginEngineer", loginData)
      const response = await axios.post(`${api_url}/engineer-login`, loginData);
      const token = response.data.token;

      console.log("token", token)
      if (response.status === 200) {
        localStorage.setItem('authToken', token); // Save user to local storage

        const userResponse = await axios.get(`${api_url}/get-engineer`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const loggedInEngineer = userResponse.data;
        localStorage.setItem('engineer', JSON.stringify(loggedInEngineer));

        dispatch(setEngineer(loggedInEngineer, "engineer"));
        navigate(`/engineer/${loggedInEngineer._id}`);

        setTimeout(() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('Engineer');
          navigate('/engineer-login'); // Navigate back to login
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
            <h3>Engineer</h3>
          </div>
          <img src="/public/image/swaayatt_logo.png" className="image_ad" alt="Admin" />
        </div>
      </div>
    </div>
  );
};

export default EngLogin;
