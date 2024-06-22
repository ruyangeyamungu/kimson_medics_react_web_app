import React,{useEffect, useState} from "react";
import "../../../styles/admin.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faShop, faShoppingCart, faUser,faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { ASSETS_COL, SALES_COL, SALES_STASTICS_COL, auth, db, staffCol } from "../../../App";
import { query, collection, orderBy, onSnapshot, limit, where  } from "firebase/firestore";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import moment from "moment/moment";
import Loader from "../../../loader/Loader";
import { AdminHeader } from "../components/header";
import { useNavigate } from "react-router-dom";




const AdminHome = ()=>{
    const [loader, setLoader]=useState(true)
    const [topSales, setTopSales] = useState([])
    const [staffList, setStaffList] = useState([])
    const [assetList, setAssetList] = useState([])
    const [assetNumberList, setAssetNumberList] = useState([])
    const [docCounts, setDocCounts] = useState({
        staffs: 0,
        assetTypes: 0,
        salesRotation: 0,
      });

    var totalSalesQuantity=0;
    var assetsNumber =0;
    const regNo = useSelector(state => state.regNo);
    const staffNames = useSelector(state => state.names);
    const navigate =useNavigate()
    const { t, i18n } = useTranslation();
    const [todayDate, setTodayDate] =useState(moment(new Date()).format('DD-MM-YYYY'))
    const [todaySales, setTodaySales] =useState([])
    var todaySalesQuantity=0;
    var todaySalesCash=0;
    // today sales
    useEffect(() => {
          
        const q = query(collection(db, SALES_COL),
                  where("strDate", '==', todayDate)
      ); 


      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const todaySalesResults = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setTodaySales(todaySalesResults)
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

    todaySales.forEach(assetSale => {
        todaySalesQuantity=todaySalesQuantity+assetSale['selledQauntity']
        todaySalesCash=todaySalesCash+assetSale['totalPrice']
        
    });


    // top sales progress
    useEffect(() => {
          
          const q = query(collection(db, SALES_STASTICS_COL),
                    orderBy("quantity", "desc"),
        ); 
 
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const salesResults = querySnapshot.docs.map((doc) => (
            {
            id: doc.id,
            ...doc.data()
          }));
          setTopSales(salesResults)
             
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, []);

      topSales.forEach(element => {
        totalSalesQuantity=totalSalesQuantity+element['quantity']
      });

      // staffList
      useEffect(() => {
          
        const q = query(collection(db, staffCol), limit(4)); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const staffs = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setStaffList(staffs)
           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);
 
    // assests stock lists
    useEffect(() => {
          
        const q = query(collection(db, ASSETS_COL), limit(4)); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const assets = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setAssetList(assets)
           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

        // statistical numbers
        useEffect(() => {
            const collectionRefs = [
              { name: 'staffs', ref: collection(db, staffCol) },
              { name: 'assetTypes', ref: collection(db, ASSETS_COL) },
              { name: 'salesRotation', ref: collection(db, SALES_COL) },
            ];
        
            const unsubscribes = collectionRefs.map(({ name, ref }) => 
              onSnapshot(ref, (snapshot) => {
                setDocCounts((prevCounts) => ({
                  ...prevCounts,
                  [name]: snapshot.size,
                }));
              })
            );
        
            // Cleanup the listeners on component unmount
            return () => unsubscribes.forEach(unsubscribe => unsubscribe());
          }, []);

        // assests stock number remained
        useEffect(() => {
          
            const q = query(collection(db, ASSETS_COL)); 
    
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const assets = querySnapshot.docs.map((doc) => (
              {
              ...doc.data()
            }));
            setAssetNumberList(assets)
            setLoader(false)
          });
      
          // Clean up the subscription on unmount
          return () => unsubscribe();
        }, []);

        assetNumberList.forEach(asst => {
            assetsNumber=assetsNumber+asst['quantity']    
        });

        const toStaffRegister =() => {
            navigate('/register-staff')
        }
        const toAssetRegister =() => {
            navigate('/register-asset')
        }

        const toAssetData =(id) => {
            navigate('/asset-det?id='+ encodeURIComponent(id))
        }

        const toStaffData =(regNo) => {
            navigate('/staff-det?id='+ encodeURIComponent(regNo))
        }


    if(loader) {
        return(
            <Loader />
        )
    }

    return(
        <>
         <AdminHeader />
        
        <section>
            <div className="links">

                <div className="reports">
                    <table width="100%">
                        <caption>{t('stSummaryReport')}<span style={{color: 'blue'}}><b>{todayDate}</b></span></caption>
                        <tr>
                        
                            <th>{t('quantity').toLowerCase()}</th>
                            <th>{t('cash').toLowerCase()}</th>
                        </tr>
                        <tr>
                            <td>{todaySalesQuantity.toLocaleString()}</td>
                            <td>{todaySalesCash.toLocaleString()} tsh</td>
                        </tr>
                    </table>
                </div>
                
                <table>
                    <tr>
                        <th>{t('description')}</th>
                        <th>{t('totalQuantity')}</th>
                    </tr>
                    <tr>
                        <td><b>{t('staffs')}</b></td>
                        <td>{docCounts.staffs.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><b>{t('asset')}</b></td>
                        <td>{assetsNumber.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><b>{t('assetTypes').toLowerCase()}</b></td>
                        <td>{docCounts.assetTypes.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><b>{t('assetSold')}</b></td>
                        <td>{totalSalesQuantity.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><b>{t('salesRotation')}</b></td>
                        <td>{docCounts.salesRotation.toLocaleString()}</td>
                    </tr>
                </table>
                 {/* reports view */}
                <div className="reports">
                    <h3><u>{t('viewAndPrint')}</u></h3>
                    <br />
                    <h3>{t('salesReport')}</h3>
                    <br />
                    <h3>{t('stockReport')}</h3>
                </div>
                <div className="adminCredentials" >
                    <h3>{staffNames}</h3>
                    <h4 style={{color: 'blue'}}>{regNo}</h4>
                </div>
            </div>
            <div className="contents-1">
                <div className="sector">
                    <h3 className="registration-title">{t('registration')}</h3>
                    <div className="registration">
                        <div className="staff" onClick={toStaffRegister}>
                            <FontAwesomeIcon icon={faUser} style={{fontSize: '70px', color: 'blue' }} />
                            <br /><br />
                            <h3>{t('staff').toUpperCase()}</h3>
                        </div>
                        <div className="asset" onClick={toAssetRegister}>
                            <FontAwesomeIcon icon={faShoppingCart} style={{fontSize: '70px', color: 'blue' }} />
                            <br /><br />
                            <h3>{t('asset').toUpperCase()}</h3>
                        </div>
                    </div>

                </div>

                <div className="sector">
                    <h3 className="registration-title">{t('staffMembers')}<span style={{color: 'blue',  cursor: 'pointer'}}>{t('viewAll')}</span></h3>
                        <div className="staff-lists">
                            {
                                staffList.map(staff=>(
                                    <div className="staff" onClick={()=>toStaffData(staff.id)}>
                                        <img src={staff['staffImage']} alt="Avatar" style={{width:"120px"}} />
                                        <br /><br />
                                        <h3>{staff.id}</h3>
                                        <p>{staff['fname']}</p>
                                    </div>
                                ))
                            }

                        </div>

                </div>
                <div className="sector">
                    <h3 className="asset-title">{t('assetInStock')}<span style={{color: 'blue', cursor: 'pointer'}}>{t('viewAll')}</span></h3>
                    <div className="asset-list">
                        {
                            assetList.map(ass => (

                                <div className="asset" onClick={()=>toAssetData(ass.id)}>
                                    <FontAwesomeIcon icon={faHourglassStart} style={{fontSize: '70px', color: 'blue' }} />
                                    <br /><br />
                                    <h3>{ass['name']}</h3>
                                </div>
                            
                            ))
                        }

                    </div>

                </div>
            </div>
            <div className="content-2">
                <div className="sector-top-sales">
                    <br />
                    <h3>{t('topSales')}</h3>
                    {
                        topSales.map(asset => (
                            <div className="asset-sales">
                            <table>
                                <caption>{asset['name']}</caption>
                                <tr>
                                    <td style={{color: 'blue'}}>{[asset['quantity']]}</td>
                                    <td style={{color: 'green'}}>{Math.round([asset['quantity']]*100/totalSalesQuantity)}%</td>
                                </tr>
                            </table>
                        </div>
                        ))
                    }

                </div>

            </div>
        </section>
        <div className="footer">
            ikjiuunk
        </div>
        </>
    )
}

export default AdminHome