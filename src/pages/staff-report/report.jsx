import React,{useState, useEffect} from "react"
import { ASSETS_COL, db,  SALES_COL, auth, SALES_STASTICS_COL } from "../../App";
import { onSnapshot, collection, query, where, orderBy, doc, deleteDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { NavBar } from "../../components/navBar";
import "../../styles/other.css"
import moment from "moment/moment";
import { check_existance } from "../../functions/check_existance";
import { update_field } from "../../functions/update_field";
import { get_doc_data } from "../../functions/get_doc_data";
import "../../styles/loaders.css";
import  Loader  from "../../loader/Loader";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const StaffSaleReport =() => {
    const [color, setColor] = useState('blue');

    const regNo = useSelector(state => state.regNo);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [queryText, setQueryText] = useState("");
    const [todayDate, setTodayDate] =useState(moment(new Date()).format('DD-MM-YYYY'))
    const [todayData, setTodayData] =useState([])
    const[loadingDaySell, setLoadingDaySell] =useState(true)
    const [assetTypeSoldPerDay, setAssetTypeSoldPerDay] =useState()
    const [totalItemsSoldPerDay, setTotalItemsSoldPerDay] =useState()
    const [cashSoldPerDay, setcashSoldPerDay] =useState()
    const navigate =useNavigate()
    const { t } = useTranslation();
    let x =0;
    let y =0;
    let sn =0;
    const [isLoading, setIsLoading] =useState(false)
    const [returnIndex, setReturnIndex] =useState()
    
    async function returnedAndCorrectAssetSales(assetID,salesID, soldQuantity) {
        setReturnIndex(salesID)

        setIsLoading(true)
        // check is asset still exists
        const doesAssetExist =  await check_existance(ASSETS_COL, assetID)
        if(doesAssetExist) {

            try {

                await   get_doc_data(ASSETS_COL, assetID)
                .then(async (data) => {
                  var qty = soldQuantity + data['quantity']
                  const Qty = {
                      quantity: qty
                  }
  
                  await update_field(ASSETS_COL, assetID, Qty)
                  .then(()=> {
                      get_doc_data(SALES_STASTICS_COL, assetID)
                      .then(async (statisticsData) =>{
                          var qtnInStatistics = statisticsData['quantity'] - soldQuantity
                          const remainedQty = {
                                  quantity: qtnInStatistics
                          }

                          await update_field(SALES_STASTICS_COL, assetID, remainedQty)
                          .then(async () => {
                            const saleRef = doc(db, SALES_COL, salesID);
                           await  deleteDoc(saleRef)
                            setIsLoading()
                          })
                      })
      
                  })

                })

            }catch (error) {
                setIsLoading(false)
                console.log("Error", error);
            }
            // get asset data and update quatinty filed


        } else {

            console.log("asset does not exits");
        }
        
    }




    const todayQuery= query(collection(db, SALES_COL),
    where("staffSelled", "==", regNo),
    where("strDate", "==", todayDate),
); 
   
   // shortsummary for satff day sale report
    onSnapshot(todayQuery, (snapshot) => {
        const todayDataArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
        setTodayData(todayDataArray);

        setLoadingDaySell(false)

        todayData.forEach((saleAsset)=>{

            x= x+saleAsset['selledQauntity']
            y= y+saleAsset['totalPrice']
        })
        setAssetTypeSoldPerDay(todayData.length)
        setTotalItemsSoldPerDay(x)
        setcashSoldPerDay(y)
    });

    useEffect(() => {

        //per day report
        // fetching data per staff with search mechanism
        if (queryText.trim() === "" ) {
            const q = query(collection(db, SALES_COL),
                    where("staffSelled", "==", regNo),
                    orderBy("date", "desc"),
            ); 
            const assets = onSnapshot(q, (snapshot) => {
                const dataArray = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setData(dataArray);
              setLoading(false);
            });
          return;
        }
          const q = query(collection(db, SALES_COL),
                where("staffSelled", "==", regNo),
                where("name", "==", queryText.toUpperCase()),
                orderBy("date", "desc")

        ); 
 
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const searchResults = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(searchResults);
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
      }, [queryText]);

      
    if (loading) {
        return <Loader />;
      }

    if (regNo == null) {
        
        onAuthStateChanged(auth, user =>{
            signOut(auth).then(()=>{
                navigate('/')
            })
        })
      }

    return (
        <>
         {/* HEADER */}
         <NavBar onSearch={setQueryText} Pcolor={color}/>

         {/* BODY */}
         <div className="section" >
            
            <div className="form-box">
                <u><h3>{t('stSummaryReport')}<span style={{color: "blue", fontWeight: "bolder"}}>{todayDate}</span></h3></u>
                {/* <p>ASSET TYPES: <span style={{color: "green", fontWeight: "bolder"}}>{assetTypeSoldPerDay}</span></p> */}
                <p>{t('totalQuantity')}: <span style={{color: "green", fontWeight: "bolder"}}>{totalItemsSoldPerDay.toLocaleString()}</span></p>
                <p>{t('cash')} <span style={{color: "green", fontWeight: "bolder"}}>{cashSoldPerDay.toLocaleString()} tsh</span></p>
            </div>   
         
            {/* display on smaller screen, devices*/}
            <div className="on-smaller-screens" >
            {
                data.map(asset =>(
                    
                    <div className="form-box" key={asset.id}>
                    <center>
                        <table className="report-table" style={{width: "100%"}}>
                            <caption  style={{color: "blue", fontWeight: "bold", fontSize: "4vw"}}>{asset.name.toUpperCase()}</caption>
                            <tr>
                                <th>{t('dateSold')}</th>
                                <td>{asset.strDate}</td>
                            </tr>
                            <tr>
                                <th>{t('quantitySold')}</th>
                                <td>{asset.selledQauntity.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>{t('price')}</th>
                                <td>{asset.sPrice.toLocaleString()}</td>
                            </tr>
                            <tr>
                                <th>{t('cash')} </th>
                                <td>{asset.totalPrice.toLocaleString()} tsh</td>
                            </tr>
                            <tr>
                                {
                                    isLoading?
                                    <td><center><div className="loader-dots"></div></center></td>
                                    :
                                    <td colSpan={2}><center><button onClick={()=>returnedAndCorrectAssetSales(asset['assetID'], asset['id'], asset['selledQauntity'] )}
                                    style={{color: "green", fontWeight: "bolder"}}>{t('return')}</button></center></td>
                                }

                            
        
                            </tr>
                        </table>
                    </center>    
                    </div>
                ))
            }
            </div>

            {/* display on larger, larg screen, devices*/}
            <div className="on-larger-screens">
                <center><table border={1}>
                    <thead>
                        <th>SN</th>
                        <th>{t('dateSold')}</th>
                        <th>{t('name')}</th>
                        <th>{t('quantitySold')}</th>
                        <th>{t('price')}</th>
                        <th>{t('cash')}</th>
                        <th style={{color: "green", fontWeight: "bolder"}}>.....</th>
                    </thead>
                    <tbody>
                    {
                        data.map(asset =>(
     
                            <tr>
                                <td>--</td>
                                <td>{asset.strDate}</td>
                                <td>{asset.name}</td>
                                <td>{asset.selledQauntity.toLocaleString()}</td>
                                <td>{asset.sPrice.toLocaleString()} tsh</td>
                                <td>{asset.totalPrice.toLocaleString()} tsh</td>
                                {
                                    isLoading?
                                    <td><center><div className="loader-dots"></div></center></td>
                                    :
                                    <td ><center><button onClick={()=>returnedAndCorrectAssetSales(asset['assetID'], asset['id'], asset['selledQauntity'] )}
                                    style={{color: "green", fontWeight: "bolder"}}>{t('return')}</button></center></td>

                                }

                                
                            </tr>
                        ))
                    }
                    </tbody>
                </table></center>
            </div>
         </div>
        </>

    )
}

export default StaffSaleReport




