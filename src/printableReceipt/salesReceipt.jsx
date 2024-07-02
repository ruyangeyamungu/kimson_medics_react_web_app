// PrintableComponent.js
import React from 'react';
import logo from "../assets/images/logo.png";
import "../styles/receipts.css"
import qrCode from "../assets/images/qrcode.png";

const PrintableComponent = (props) => {

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
   
      {/* body*/}
      <div className='printable-page body'>
          <h3>CUSTOMER SALES REPORT</h3>
          <table>
            <caption>MEDICAL INFO</caption>
            <tr>
              <th>name: </th>
              <td>{props.name}</td>
            </tr>
            <tr>
              <th>id: </th>
              <td>{props.id}</td>
            </tr>
            <tr>
              <th>qauntity: </th>
              <td>{props.quantity}</td>
            </tr>
            <tr>
              <th>price per each: </th>
              <td>{props.pricePerEach}</td>
            </tr>
            <tr>
              <th>total price: </th>
              <td>{eval(props.pricePerEach*props.quantity)}</td>
            </tr>
            <tr>
              <th>date: </th>
              <td>{Date()}</td>
            </tr>
          </table>

          <table>
            <caption>PHARMACIST /DOCTOR INFO</caption>
            <tr>
              <th>name: </th>
              <td>{props.staffName}</td>
            </tr>
            <tr>
              <th>registered no: </th>
              <td>{props.staffID}</td>
            </tr>
          </table>
          <h3>DESCRIPTION:</h3>
          <br /><br /><br />
          <h5 style={{marginTop: '200px'}}>SIGNATURE:.....................................</h5>
      </div>

      <img className='qrcode' src={qrCode} alt='qrcode' width='80px'/>

      {/* footer */}

      <div className='footer' >
        <br />
        <p>welcome to kimson medics. All rights are reserved</p>
        
      </div>
      
    </div>
  );
};

export default PrintableComponent;
