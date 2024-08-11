import React from 'react';
import '../styles/Slider.css';
import { useNavigate } from 'react-router-dom';

const Slider = () => {

  const navigate = useNavigate();

  const navigateToCategory = (category) => {
    navigate(`/products/${category}`);
  };

  return (
    <div>
      <div className="mobileSection" onClick={() => navigateToCategory('mobile')}>
        <div className="image">
          <img src="images/mobile.png" alt="mobile" />
        </div>
      </div>
    </div>
  );
};

export default Slider;
