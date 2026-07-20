import React from 'react';
import logoColor from '../assets/logos/Love&Tails.svg';
import './Header.css';

const Header = () => {
  return (
    <header className="site-header">
      <img
        id="app-header-logo"
        className="site-header-logo"
        src={logoColor}
        alt="Love & Tails"
      />
    </header>
  );
};

export default Header;
