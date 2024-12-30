import React, { useEffect, useState } from 'react';
import './toogle_style.css';

const ToggleSwitch = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  useEffect(() => {
    if (isToggled) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  }, [isToggled]);

  return (
    <div className={`toggle-switch ${isToggled ? 'toggled' : ''}`} onClick={toggleSwitch}>
      <div className="toggle-switch-handle">
        {isToggled ? <i className="fas fa-moon"></i> : <i className="fas fa-sun"></i>}
      </div>
    </div>
  );
};

export default ToggleSwitch;
