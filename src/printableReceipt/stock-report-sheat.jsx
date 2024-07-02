// PrintableComponent.js
import React from 'react';
import qrCode from "../assets/images/qrcode.png";

import "../styles/receipts.css"
import { PrintableHeader } from './header';

import { Stock } from '../pages/admin/components/stock-report';

export const PrintableStockReport = () => {

  return (
    <>
      {/* --header--*/}
      <PrintableHeader />

      {/* body*/}
      <Stock /> 
      <br /><br />
      <h3>SIGNATURE:.......................</h3>
      <br /><br />
      <center><img src={qrCode} alt='qrcode' width='100px' /></center>  
    </>
  );
};

