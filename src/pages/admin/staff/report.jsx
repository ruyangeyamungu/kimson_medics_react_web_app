import React, { useState, useEffect } from "react";
import StaffHeader from "./components/headerComponent";
import Loader from "../../../loader/Loader"
import { SelectedStaff } from "./components/selectedStaff";
import { StaffList } from "./components/staffList";
import { query, collection, onSnapshot, where, orderBy } from "firebase/firestore";
import moment from "moment";
import { db, SALES_COL } from "../../../App";
import { useLocation } from "react-router-dom";

const StaffReport =() => {
    const [loader, setLoader] =useState(true)
    const[allSales, setAllSales] =useState([])
    const[todaysSales, setTodaysSales] =useState([])
    const queryID = new URLSearchParams(useLocation().search);
    const REGNO = queryID.get('id');
  //  const todayDate =useState(moment(new Date()).format("DD-MM-YYYY"))
    const [todayDate, setTodayDate] =useState(moment(new Date()).format('DD-MM-YYYY'))
    var todayCash =0;
    var todayQuantity=0;
    var allCash =0;
    var allQuantity=0;

    useEffect(() => {

        const q = query(collection(db, SALES_COL),
                where("staffSelled", "==", REGNO),
                where("strDate", "==", todayDate)
            ); 
 
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const searchResults = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setTodaysSales(searchResults);
          setLoader(false)
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, []);

      todaysSales.forEach(assetSold => {
        todayQuantity=todayQuantity+assetSold['selledQauntity']
        todayCash=todayCash+assetSold['totalPrice']
      });
    
    useEffect(() => {

        const q = query(collection(db, SALES_COL),
                where("staffSelled", "==", REGNO),
                orderBy('date', "desc")
            ); 
 
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const searchResults = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setAllSales(searchResults);
          setLoader(false)
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, []);

      allSales.forEach(assetSold => {
        allQuantity=allQuantity+assetSold['selledQauntity']
        allCash=allCash+assetSold['totalPrice']
      });
    
    if(loader) {
        return <Loader />
    }

    return(
        <>
            <StaffHeader rColor="blue" regNo={REGNO}/>

            <section>
            <div className="links">
                <SelectedStaff selectedID={REGNO}/>
            </div>
            <div className="contents-1">
                <div className="staff-box-data  today">
                    <table border='1'>
                        <caption>TODAY SALES SUMMARY</caption>
                        <thead>
                            <tr>
                                <th>ROTATION</th>
                                <th>QAUNTITY</th>
                                <th>CASH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{(todaysSales.length.toLocaleString()).toLocaleString()}</td>
                                <td>{todayQuantity.toLocaleString()}</td>
                                <td>{todayCash.toLocaleString()} tsh</td>
                            </tr>
                        </tbody>
                    </table>
                    <table border='1'>
                        <caption>TODAY'S SALES</caption>
                        <thead>
                            <tr>
                                <th>NAME</th>
                                <th>QAUNTITY</th>
                                <th>PRICE</th>
                                <th>TOTAL PRICE</th>
                                <th>ASSET ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                todaysSales.map(assetSale=>(
                                    <tr>
                                        <td>{assetSale['name']}</td>
                                        <td>{assetSale['selledQauntity']===undefined?'':assetSale['selledQauntity'].toLocaleString()}</td>
                                        <td>{assetSale['sPrice']===undefined?'':assetSale['sPrice'].toLocaleString()} tsh</td>
                                        <td>{assetSale['totalPrice']===undefined?'':assetSale['totalPrice'].toLocaleString()} tsh</td>
                                        <td>{assetSale['assetID']}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>

                </div>
                <br />
                <div className="staff-box-data  today">
                    <table border='1'>
                        <caption>ALL SALES SUMMARY</caption>
                        <thead>
                            <tr>
                                <th>ROTATION</th>
                                <th>QAUNTITY</th>
                                <th>CASH</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{(allSales.length.toLocaleString()).toLocaleString()}</td>
                                <td>{allQuantity.toLocaleString()}</td>
                                <td>{allCash.toLocaleString()} tsh</td>
                            </tr>
                        </tbody>
                    </table>
                    <table border='1'>
                        <caption>ALL SALES</caption>
                        <thead>
                            <tr>
                                <th>DATE</th>
                                <th>NAME</th>
                                <th>QAUNTITY</th>
                                <th>PRICE</th>
                                <th>TOTAL PRICE</th>
                                <th>ASSET ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                allSales.map(assetSale=>(
                                    <tr>
                                        <td>{assetSale['strDate']}</td>
                                        <td>{assetSale['name']}</td>
                                        <td>{assetSale['selledQauntity']===undefined?'':assetSale['selledQauntity'].toLocaleString()}</td>
                                        <td>{assetSale['sPrice']===undefined?'':assetSale['sPrice'].toLocaleString()} tsh</td>
                                        <td>{assetSale['totalPrice']===undefined?'':assetSale['totalPrice'].toLocaleString()} tsh</td>
                                        <td>{assetSale['assetID']}</td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>

                </div>


                {/* <table>
                    <caption>ON ASSET ACTIONS</caption>
                    <thead>
                        <tr>
                            <th>NAME</th>
                            <th>REGISTERED</th>
                            <th>LAST ADDED QAUNTITY</th>
                            <th>LAST UPDATED</th> 
                        </tr>
                    </thead>
                    <tbody>
                        <tr>

                        </tr>
                    </tbody>
                </table> */}
                
            </div>

            <div className="staff-list-box">
                <h3>STAFF LIST</h3>
                <StaffList />
            </div>
        </section>
        </>
    )
}

export default StaffReport