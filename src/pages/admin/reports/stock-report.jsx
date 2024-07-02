import React, {useRef} from "react";
import { AdminHeader } from "../components/header";
import {PrintableStockReport} from "../../../printableReceipt/stock-report-sheat";
import { useReactToPrint } from 'react-to-print';
import { Stock } from "../components/stock-report";


const StockReport=()=> {
  const stockReportSheat = useRef();

  const handlePrint = useReactToPrint({
    content: () => stockReportSheat.current,
  });

  return(
    <>
    <div ref={stockReportSheat} className="stock-report-sheat"> 
        <PrintableStockReport />
    </div>

    <AdminHeader />
    <section>
      <div>
        <Stock />
        <div className="form-box" style={{height: "200px"}}>
        <button className="submit-buttons" onClick={handlePrint}>PRINT</button>
      </div>
      </div>
      
    </section>
    </>
  )
}

export default StockReport