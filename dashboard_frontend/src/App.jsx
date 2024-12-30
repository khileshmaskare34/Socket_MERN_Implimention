import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store'
import Home from './pages/Home';
import './style.css'
import Engineer from './pages/Engineer';
import Manager from './pages/Manager';
import Labeler from './pages/Labeler';
import EngineerLogin from './pages/EngineerLogin';
import ManagerLogin from './pages/ManagerLogin';
import LabelerLogin from './pages/LabelerLogin';
import Administration from './pages/Administration';
import AdministrationLogin from './pages/AdministrationLogin';
import AdministrationAndEngineerRegsiter from './pages/AdministrationAndEngineerRegister';
import PageNotFound from './components/PageNotFound';

import { io } from 'socket.io-client';


const App = () => {

  const [response, setResponse] = useState('');


      // Connect to the server
      useEffect(() => {
        const socket = io('http://localhost:8000'); // Replace with your server URL
    
        // Listen for server responses
        socket.on('response', (data) => {
          setResponse(data);
        });
    
        // Cleanup on unmount
        return () => {
          socket.disconnect();
        };
      }, []);
    
    
      
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Home page route */}
          <Route path='/' element={<Home />} />

          {/* Engineers routes */}
          <Route path='/engineer-login' element={<EngineerLogin />} />
          <Route path='/engineer/:id' element={<Engineer />} />

          {/* Managers routes */}
          <Route path='/manager-login' element={<ManagerLogin />} />
          <Route path='/manager/:id' element={<Manager />} />

          {/* Labelers routes */}
          <Route path='/labeler-login' element={<LabelerLogin />} />
          <Route path='/labeler/:id' element={<Labeler />} />

          {/* Administration routes */}
          <Route path='/administration-login' element={<AdministrationLogin />} />
          <Route path='/administration/:id' element={<Administration />} />

          {/* Admin registration (we can add both Engineer and Administration with the help of this route, need to manualy type this url) */}
          <Route path='/admin' element={<AdministrationAndEngineerRegsiter />} />

          {/* Catch-all route for 404 - Page Not Found */}
          <Route path='*' element={<PageNotFound/>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App