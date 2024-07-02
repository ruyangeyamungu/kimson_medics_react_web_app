import React, {useRef, useState} from "react";
import { AdminHeader } from "../components/header";
import { Sales } from "../components/sales-report";
import PrintableSalesReport from "../../../printableReceipt/sales-report-sheat";
import { useReactToPrint } from 'react-to-print';
import { writeBatch, collection, getDocs, doc } from "firebase/firestore";
import { SALES_COL, SALES_STASTICS_COL, db } from "../../../App";


const SalesReport=()=> {
  const salesReportSheat = useRef();
  const[deletion, setDeletation] =useState(false)
  const[isDeleting, setIsDeleting]=useState(false)

  const handlePrint = useReactToPrint({
    content: () => salesReportSheat.current,
  });

  const deleteCollection = async (collectionPath) => {
    const collectionRef = collection(db, collectionPath);
    const querySnapshot = await getDocs(collectionRef);
  
    const batch = writeBatch(db);
  
    querySnapshot.forEach((document) => {
      batch.delete(doc(db, collectionPath, document.id));
    });
  
    await batch.commit();
  };


  const handleClearData = async ()=> {
    setIsDeleting(true)

    try {
      
      await deleteCollection(SALES_COL);
      await deleteCollection(SALES_STASTICS_COL)
      setIsDeleting(false)
      setDeletation(false)

    } catch (error) {
      console.error("Error deleting collection: ", error);
    }
  }

  return(
    <>
    <div ref={salesReportSheat} className="sales-report-sheat"> 
        <PrintableSalesReport />
    </div>

    <AdminHeader />
    <section >
      <h1>TODAY'S:</h1>
      <div >
        <Sales />
        <div className="form-box" style={{height: "240px"}}>
          {
            deletion?
            <div className="auth-box">
                <h3 style={{color: "red"}}>NOTE: clearing sales report will delete on these sales report</h3>
                {
                    isDeleting?
                    <div className="loader" ></div>
                    :
                    <>
                      <button className="submit-buttons" style={{color: "red"}} onClick={handleClearData}>DELETE</button>
                      <button className="submit-buttons" style={{color: "red"}} onClick={()=>setDeletation(false)}>CANCEL</button>
                    </>
                }

            </div>
            :
            <div>
                <button className="submit-buttons" onClick={handlePrint}>PRINT</button>
                <button className="submit-buttons" style={{color: "red"}} onClick={()=>setDeletation(true)}>CLEAR</button>
          </div>
          }




        
      </div>
      </div>
    </section>
    </>
  )
}

export default SalesReport