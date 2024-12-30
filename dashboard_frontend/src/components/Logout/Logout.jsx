import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (user) {
      // Clear user-related data based on the user type
      localStorage.removeItem('authToken'); // Remove the auth token

      // Remove data specific to the user type
      if (user.type === 'engineer') {
        localStorage.removeItem('engineer');
      } else if (user.type === 'manager') {
        localStorage.removeItem('manager');
      } else if (user.type === 'labeler') {
        localStorage.removeItem('annotator');
      } else if (user.type === 'administration') {
        localStorage.removeItem('administration')
      }

      // Redirect to the respective login page or home page
      navigate(`/${user.type}-login`);
    } else {
      console.log('No user to log out');
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default Logout;
