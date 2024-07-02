import React,{useState, useEffect, useRef} from "react"
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AssetList } from "./components/assetList";
import AssetHeader from "./components/headerComponent";
import { SelectedAsset } from "./components/selectedAsset";
import { onSnapshot, query, doc, updateDoc, collection, where, orderBy } from "firebase/firestore";
import { db, ASSETS_COL, staffCol, auth, SALES_COL } from "../../../App";
import { check_existance } from "../../../functions/check_existance";
import { update_field } from "../../../functions/update_field";
import Loader from "../../../loader/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { getStaffRegNo } from "../../../functions/get_staff_reg_no";
import { get_doc_data } from "../../../functions/get_doc_data";
import { useReactToPrint } from 'react-to-print';
import moment from "moment/moment";
import { useLocation } from 'react-router-dom';

const AssetReport =() => {
    const [isError, setisError] =useState(false)

    const [name, setName] =useState()
    const regNo = useSelector(state => state.regNo);
    const [availableQuantity, setAvailableQuantity] =useState(0)
    const [lastAddStockStaff, setlastAddStockStaff] =useState("")
    const [lastAddedQuantity, setlastAddedQuantity] = useState(0)
    const [lastAddedDate, setlastAddedDate] =useState()
    const [staffRegistered, setStaffRegistered] =useState()
    const [dateRegistered, setDateRegistered] =useState()
    const [lastStaffUpdated, setLastStaffUpdated] =useState()
    const [lastDateUpdated, setLastDateUpdated] =useState()
    const { t } = useTranslation()
    const [loader, setLoader] =useState(true)
    const [assetSalesDataList, setAssetSalesDataList] =useState([])
    const componentRef = useRef();
    var soldQuantity=0;
    var totalCash=0;

    const queryID = new URLSearchParams(useLocation().search);
    const ID = queryID.get('id');
  
    // sales
    useEffect(() => {
        // Reference to the specific document
        const assetRefQuery = query(collection(db, SALES_COL),
                            where("assetID", '==', ID),
                            orderBy('date', "desc")
                        );
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(assetRefQuery, (querySnapshot) => {
            const assetSalesData = querySnapshot.docs.map((doc) => (
              {
              id: doc.id,
              ...doc.data()
            }));
            setAssetSalesDataList(assetSalesData)
            setLoader(false)
          });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);

    assetSalesDataList.forEach(asset => {
        soldQuantity=soldQuantity +asset['selledQauntity']
        totalCash=totalCash +asset['totalPrice']
   });

    useEffect(() => {
        // Reference to the specific document
        const assetRef = doc(db, ASSETS_COL, ID);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(assetRef, (asset) => {
          if (asset.exists()) {
            setDateRegistered(asset.data()['dateRegistered'].toDate());
            setStaffRegistered(asset.data()['staffRegistered']);
            setLastStaffUpdated(asset.data()['lastStaffUpdated'])
            setLastDateUpdated(asset.data()['lastDateUpdated'])
            setlastAddedDate(asset.data()['lastDateAddedQuantity']);
            setlastAddStockStaff(asset.data()['lastStaffAddedQuantity']);
            setlastAddedQuantity(asset.data()['lastAddedQuantity']);
            setAvailableQuantity(asset.data()['quantity']);
            setName(asset.data()['name']);
        
          } else {
            console.log("Document does not exist!");
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
     


    function hideErrorBox() {
        setisError(false)
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });
    
    if(loader) {
        return(
            <Loader />
        )
    }

    return(
        <>
        
            <AssetHeader rColor="blue" id={ID}/>

            <section>
            <div className="links">
            <div className="form-box">
                <SelectedAsset selectedAssetID={ID}/>
            </div>
            
            </div>
            <div className="contents-1">
                <div ref={componentRef} >
                <h1 style={{color: 'blue'}}>{name}</h1>
                <h3>ID: {ID}</h3>
                <br />
                <h3>REPORT</h3>
                <table border='1'>
                    <caption className="caption-table">REGISTRATION AND STOCK ADDITION</caption>
                    <tr>
                        <th>Date registered</th>
                        <td>{moment(dateRegistered).format("DD-MM-YYYY, h:mm:ss a")}</td>
                    </tr>
                    <tr>
                        <th>Staff Registered</th>
                        <td><span style={{color: "green"}}>{staffRegistered}</span></td>
                    </tr>
                    <tr>
                        <th>last added quantity</th>
                        <td>{lastAddedQuantity===undefined?'':lastAddedQuantity.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>last date added quantity</th>
                        <td>{lastAddedDate}</td>
                    </tr>
                    <tr>
                        <th>last staff added quantity</th>
                        <td>{lastAddStockStaff}</td>
                    </tr>
                    <tr>
                        <th>last date updated</th>
                        <td>{lastDateUpdated}</td>
                    </tr>
                    <tr>
                        <th>last staff updated</th>
                        <td>{lastStaffUpdated}</td>
                    </tr>
                </table>
                <br /><br />
                <table border='1'>
                    <caption className="caption-table" >QAUNTITY AND SALES</caption>
                    <tr>
                        <th>available quantity: </th>
                        <td>{availableQuantity.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>sold quantity: </th>
                        <td>{soldQuantity.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>sales rotation: </th>
                        <td>{assetSalesDataList.length}</td>
                    </tr>
                    <tr>
                        <th>cash: </th>
                        <td>{totalCash.toLocaleString()} tsh</td>
                    </tr>
                </table>

                <br /><br />
                <table  className="report-table">
                    <caption className="caption-table">ALL SALES</caption>
                    <thead>
                        <tr>
                            <th>date</th>
                            <th>qauntity</th>
                            <th>price</th>
                            <th>total price</th>
                            <th>selor</th>
                            <th>sale id</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            assetSalesDataList.map(sales=>(
                                <tr>
                                    <td>{sales['strDate']}</td>
                                    <td>{sales['selledQauntity'].toLocaleString()}</td>
                                    <td>{sales['sPrice'].toLocaleString()} </td>
                                    <td>{sales['totalPrice'].toLocaleString()}</td>
                                    <td>{sales['staffSelled']}</td>
                                    <td>{sales.id}</td>
                                   
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>

                {/* <button className="submit-buttons" onClick={handlePrint}>PRINT</button> */}
            </div>
          

            <div className="staff-list-box">
                <h3>ASSET LIST</h3>
                <AssetList />
            </div>
        </section>
        <div className="footer">
            ikjiuunk
        </div>
        </>
    )
}

export default AssetReport