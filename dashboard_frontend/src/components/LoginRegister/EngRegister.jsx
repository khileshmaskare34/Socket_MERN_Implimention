import React, { useState } from 'react'
import axios from 'axios'
var api_url = import.meta.env.VITE_API_URL;

const EngRegister = () => {

  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '' });

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    // Handle register submit logic here
    const response = await axios.post(`${api_url}/engineer-register`, registerData)
    console.log('Register data:', registerData, response);
  };

  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <h1>Register</h1>
          <div className="login-input">
            <form onSubmit={handleRegisterSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
              <button className="action-button" type="submit">Submit</button>
            </form>
          </div>
        </div>
      </div>    
    </>
  )
}

export default EngRegister