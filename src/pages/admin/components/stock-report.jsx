import React, { useState, useEffect } from "react";
import { ASSETS_COL, db, SALES_COL, SALES_STASTICS_COL } from "../../../App";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import Loader from "../../../loader/Loader";
import moment from "moment/moment";

export const Stock=() => {
    const [stockList, setStockList] = useState([])
    const [stockListQuantities, setStockListQuantities] = useState([])
    const [topSalesList, setTopSalesList] = useState([])
    var totalQuantity=0;
    var totalCash=0;
    const[loader, setLoader] =useState(true)
    var sn=1
    var todayDate = moment(new Date()).format("DD-MM-YYYY hh:mm:ss")

    useEffect(() => {
          
        const q = query(collection(db, ASSETS_COL), orderBy('name')); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const assets = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setStockList(assets)

           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

    stockList.forEach(asset0 => {
        totalQuantity =totalQuantity +asset0['quantity']
        totalCash =totalCash + (asset0['bPricePerOne']*asset0['quantity'])
    });

    useEffect(() => {
          
      const q = query(collection(db, ASSETS_COL), orderBy('quantity', "desc")); 

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const assetRemains = querySnapshot.docs.map((doc) => (
        {
        id: doc.id,
        ...doc.data()
      }));
      setStockListQuantities(assetRemains)
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
            <center><h1>PHAMARCY STOCK REPORT</h1></center>
            <center><h1 style={{color: "blue"}}>{todayDate}</h1></center>
            <br />
           <table border='1'>
                <caption>REPORT STOCK SUMMMARY</caption>
                <thead>
                    <tr>
                        <th>TYPES</th>
                        <th>TOTAL QAUNTITY</th>
                        <th>TOTAL CASH</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{stockList.length.toLocaleString()}</td>
                        <td>{totalQuantity.toLocaleString()}</td>
                        <td>{totalCash.toLocaleString()} tsh</td>
                    </tr>
                </tbody>
           </table>

           <table>
            <caption>ALL STOCK ASSETS</caption>
                <thead>
                  <tr>
                    <th>NAME</th>
                    <th>QUANTITY</th>
                    <th>SELLING PRICE</th>
                    <th>BUYING PRICE</th>
                    <th>TOTAL BUYING PRICE</th>
                    <th>DATE REGISTERED</th>
                    <th>STAFF REGISTERED</th>
                    <th>LAST ADDED QAUNTITY </th>
                    <th>LAST DATE ADDED QAUNTITY</th>
                    <th>LAST STAFF ADDED QAUNTITY</th>
                    <th>LAST DATE UPDATED</th>
                    <th>LAST STAFF UPDATED </th>
                    <th>ID</th>
                  </tr>
                </thead>
                {
                  stockList.map(asset=>(
                    <tr>
                      <td>{asset['name']}</td>
                      <td>{asset['quantity']}</td>
                      <td>{asset['sPrice'].toLocaleString()}</td>
                      <td>{asset['bPricePerOne'].toLocaleString()} tsh</td>
                      <td>{(asset['bPricePerOne']*asset['quantity']).toLocaleString()} tsh</td> 
                      <td>{asset['dateRegistered']===undefined?" ":moment(asset['dateRegistered'].toDate()).format("DD-MM-YYYY HH:MM:ss")}</td>
                      <td>{asset['staffRegistered']}</td>
                      <td>{asset['lastAddedQuantity']===undefined? " ":asset['lastAddedQuantity'].toLocaleString()}</td>
                      <td>{asset['lastDateAddedQuantity']}</td>
                      <td>{asset['lastStaffAddedQuantity']}</td>
                      <td>{asset['lastDateUpdated']}</td>
                      <td>{asset['lastStaffUpdated']}</td>
                      <td>{asset.id}</td>
                    </tr>
                  ))
                }
           </table> 

           <table className="top-sales-rack">
                <caption>REMAING QAUNTITIES PROGRESS</caption>
                <thead>
                    <tr>
                        <th>SN</th>
                        <th>NAME</th>
                        <th>QAUNTITY</th>
                        <th>ID</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stockListQuantities.map(asset=>(
                            <tr>
                                <td>{sn++}</td>
                                <td>{asset['name']}</td>
                                <td>{asset['quantity'].toLocaleString()}</td>
                                <td>{asset.id}</td>
                                
                            </tr>
                        ))
                    }
                </tbody>
           </table>
        </div>
    )
}