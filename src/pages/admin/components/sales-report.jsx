import React, { useState, useEffect } from "react";
import { db, SALES_COL, SALES_STASTICS_COL } from "../../../App";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import Loader from "../../../loader/Loader";
import moment from "moment/moment";

export const Sales=() => {
    const [salesList, setSalesList] = useState([])
    const [topSalesList, setTopSalesList] = useState([])
    var totalQuantity=0;
    var totalCash=0;
    const[loader, setLoader] =useState(true)
    var sn=1
    var todayDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")

    useEffect(() => {
          
        const q = query(collection(db, SALES_COL), orderBy('date')); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const sales = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setSalesList(sales)
           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

    salesList.forEach(selles => {
        totalQuantity =totalQuantity +selles['selledQauntity']
        totalCash =totalCash + selles['totalPrice']
    });

    useEffect(() => {
          
        const q = query(collection(db, SALES_STASTICS_COL), orderBy('quantity', "desc")); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const assets = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setTopSalesList(assets)
        setLoader(false)
           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

    if(loader) {
        return(
            <Loader />
        )
    }

    return(
        <div className="sales-report">
            <center><h1>PHAMARCY SALES REPORT</h1></center>
            <center><h1 style={{color: "blue"}}>{todayDate}</h1></center>
            <br />
           <table border='1'>
                <caption>REPORT SUMMMARY</caption>
                <thead>
                    <tr>
                        <th>ROTATION</th>
                        <th>TOTAL QAUNTITY</th>
                        <th>TOTAL CASH</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{salesList.length.toLocaleString()}</td>
                        <td>{totalQuantity.toLocaleString()}</td>
                        <td>{totalCash.toLocaleString()} tsh</td>
                    </tr>
                </tbody>
           </table>

           <table>
            <caption>ALL SALES</caption>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>PREICE @ 1</th>
                    <th>TOTAL PRICE</th>
                    <th>STAFF SOLD</th>
                    <th>ID</th>
                  </tr>
                </thead>
                {
                  salesList.map(asset=>(
                    <tr>
                      <td>{asset['strDate']}</td>
                      <td>{asset['name']}</td>
                      <td>{asset['selledQauntity'].toLocaleString()}</td>
                      <td>{asset['sPrice'].toLocaleString()} tsh</td>
                      <td>{asset['totalPrice'].toLocaleString()} tsh</td>
                      <td>{asset['staffSelled']}</td>
                      <td>{asset['assetID']}</td>
                    </tr>
                  ))
                }
           </table> 

           <table className="top-sales-rack">
                <caption>TOP SELLES RACK</caption>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>NAME</th>
                        <th>QAUNTITY</th>
                        <th>PERCENTAGE</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        topSalesList.map(topSales=>(
                            <tr>
                                <td>{sn++}</td>
                                <td>{topSales['name']}</td>
                                <td>{topSales['quantity'].toLocaleString()}</td>
                                <td style={{color: 'green'}}>{([topSales['quantity']]*100/totalQuantity).toFixed(2)}%</td>
                                <td>{topSales.id}</td>
                                
                            </tr>
                        ))
                    }
                </tbody>
           </table>
        </div>
    )
}