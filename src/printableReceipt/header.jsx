// PrintableComponent.js
import React from 'react';
import logo from "../assets/images/logo.png";
import "../styles/receipts.css"

export const PrintableHeader = () => {

  return (
    <div className='printable-page'>
      {/* --header--*/}
      <div className='printable-page header'>
        <div className='logo'>
          <img src={logo} alt='logo' width='100px' />
        </div>
        <div className='address'>
          <address>
            <h1>KIMSON MEDICS PHARMACY</h1>
            <h3>P.O BOX 3018 BUGURUNI, DAR ES SALAA TANZANIA</h3>
            <p>mobile: 0757-001-100 /0783 827 293</p>
          </address>

        </div>
        <div className='logo'>
          <img src={logo} alt='logo' width='100px' />
        </div>
      </div>
    </div>
  );
};

