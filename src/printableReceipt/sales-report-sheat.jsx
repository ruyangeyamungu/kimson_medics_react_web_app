// PrintableComponent.js
import React from 'react';
import qrCode from "../assets/images/qrcode.png";
import "../styles/receipts.css"
import { PrintableHeader } from './header';
import { Sales } from '../pages/admin/components/sales-report';

const PrintableSalesReport = () => {

  return (
    <div className='printable-page'>
      {/* --header--*/}
      <PrintableHeader />

      {/* body*/}
      <Sales />

     <br /><br />
      <img src={qrCode} alt='qrcode' width='100px'/>    
    </div>
  );
};

export default PrintableSalesReport;
