import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import {NavBar} from "../../components/navBar";
import { db, ASSETS_COL, SALES_COL, SALES_STASTICS_COL, staffCol } from "../../App";
import { doc,setDoc, collection, addDoc, onSnapshot, where, query, orderBy, startAt, endAt } from "firebase/firestore";
import { update_field } from "../../functions/update_field";
import { get_doc_data } from "../../functions/get_doc_data";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import Loader from "../../loader/Loader";
import { check_existance } from "../../functions/check_existance";
import { useReactToPrint } from 'react-to-print';
import PrintableComponent from "../../printableReceipt/salesReceipt";
import "../../styles/App.css"
import "../../styles/Forms.css"
import {  useNavigate} from "react-router-dom";

export default function Home() {

    const [color, setColor] = useState('blue');
    const [makeSales, setMakeSales] =useState(false)
    const [onMakeSaleChance, setOnMakeSaleChance] =useState(true)
    const [index, setIndex]= useState()
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const[Salesquantity, setSalesQuantity] =useState();
    const[totalSoldPrice, setTotalSoldPrice] =useState();
    const regNo = useSelector(state => state.regNo);
    const staffNames = useSelector(state => state.names);
    const [isLoading, setisLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState()
    const [errorMsg, seterrorMsg] = useState()
    const [queryText, setQueryText] = useState("");
    const salesReceiptRef = useRef();
    const[printReceipt, setPrintReceipt] = useState(false)
    const [isAdmin, setIsAdmin] =useState(false)
    const navigate =useNavigate()
    const [salesStatus, setSalesStatus] = useState();

    // const[finalProfit, setfinalProfit]=useState(0)
 

    const handlePrint = useReactToPrint({
        content: () => salesReceiptRef.current,
      });

      useEffect(() => {
        // Reference to the specific document
        const assetRef = doc(db, staffCol, regNo);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(assetRef, (staff) => {
          if (staff.exists()) {
             if(staff.data()['accType']==='admin') {
                setIsAdmin(true)
             }else {
                setIsAdmin(false)
             }
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
  

    useEffect(() => {
        if (queryText.trim() === "") {
            const assets = onSnapshot(query(collection(db, ASSETS_COL), orderBy('name')), (snapshot) => {
                const dataArray = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setData(dataArray);
              setLoading(false);
            });
          return;
        }
    
        const q = query(collection(db, ASSETS_COL),
                    orderBy("name"),
                    startAt(queryText.toUpperCase()),
                    endAt(queryText.toUpperCase() + "\uf8ff"),
                
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
    
      // che=ange sales status
    // useEffect(()=>{
    //     if(totalSoldPrice > 20) {
    //         SetsalesStatus('profit')
    //     }else {
    //         SetsalesStatus('loss');
    //     }

    // },[totalSoldPrice]);

    // function changeSalesStatus(value, qauntity, buyingPrice) {

    //     setTotalSoldPrice(value)
       
    //     if(totalSoldPrice > (qauntity*buyingPrice)) {
    //         setSalesStatus('profit');
    //     }
    //     if(totalSoldPrice < (qauntity*buyingPrice)) {
    //         setSalesStatus('loss');
    //     }
    //     if(totalSoldPrice === (qauntity*buyingPrice)) {
    //         setSalesStatus('hamna faida na hasara');
    //     }
        
    // }


    const toAddStock =(assetID) => {
        navigate('/add-stock?id='+ encodeURIComponent(assetID))
    }


    if (loading) {
        return <Loader />;
      }

    function make_sales  (e, assetID) {
        e.preventDefault();
        var initialProfit=0;
        var loss=0;
        var finalProfit=0;

        if(navigator.onLine) {

            setOnMakeSaleChance(false)
            setSuccessMsg('')
            seterrorMsg('')
            setisLoading(true)
    
            get_doc_data(ASSETS_COL, assetID)
            .then(async (assetData) =>{
               var qauntity =assetData['quantity']
               var sPrice =assetData['sPrice']

    
               if(qauntity > 0 && regNo !== null && regNo !== undefined && regNo !== " " && Salesquantity > 0) {
                // makes sales (update asset in asset collection and and sales in sales collection)
                var initProfit0=(Salesquantity*sPrice)-(Salesquantity*assetData['bPricePerOne'])
                
                    if(sPrice*Salesquantity <(Salesquantity*assetData['bPricePerOne'])) {
                        loss=(Salesquantity*assetData['bPricePerOne'])-(Salesquantity*sPrice)
                        initProfit0=0;
                        finalProfit=0;
                    }
                    if(totalSoldPrice === null) {
                        finalProfit=initProfit0;       
                    }

                    if(totalSoldPrice > Salesquantity*assetData['bPricePerOne'] ) {        
                        finalProfit =(totalSoldPrice)-(Salesquantity*assetData['bPricePerOne'])
                    }
        
                    if(totalSoldPrice < Salesquantity*assetData['bPricePerOne'] ) {
                        loss =(Salesquantity*assetData['bPricePerOne'])-(totalSoldPrice)
                    }
        

                    var cash = sPrice*Salesquantity
                    var remainedQty = qauntity - Salesquantity
                    if(remainedQty >=0) {
    
                        const updated_data = {
                            quantity :remainedQty
                        }

                        const colRef = collection(db, SALES_COL)
                        const selledAsset = {
                            "assetID": assetID,
                             "name": assetData['name'],
                             "brand": assetData['brand'],
                             "selledQauntity": Salesquantity,
                             "totalPrice":  cash,
                              "sPrice": sPrice,
                              "staffSelled": regNo,
                              "date": new Date(),
                              "strDate": moment(new Date()).format('DD-MM-YYYY'),
                              "bPrice": assetData['bPricePerOne'],
                              "profit":initProfit0,
                              "finalProfit":finalProfit,
                              "loss": loss,
                              "finalTotalPriceSold": totalSoldPrice===null?cash:totalSoldPrice,
                              'fullName': assetData['name']+assetData['brand'],
                        }
                        await addDoc(colRef, selledAsset)
                        
                        await update_field(ASSETS_COL,assetID, updated_data)
                        .then(async () => {
    
                           await  update_statics(assetID, Salesquantity ,assetData['name'])
                            setisLoading(false)
                            setSuccessMsg(t('salesDone')+ Salesquantity.toLocaleString()+' '+t('price')+ ': '+cash.toLocaleString()+' tsh') 
                            setSalesQuantity()
                            setOnMakeSaleChance(true)
                            if(printReceipt) {
                                handlePrint()
                            }
                        })
    
                    }
    
                    if(Salesquantity >qauntity) {
                        setisLoading(false)
                        seterrorMsg(Salesquantity.toLocaleString() +' '+t('notAvailable')) 
                        setSalesQuantity()
                        setOnMakeSaleChance(true)
                       }
    
               }
    
               if(qauntity <= 0) {
               
                setisLoading(false)
                seterrorMsg(t('emptyItems'))
                setOnMakeSaleChance(true)
    
               }
               if(Salesquantity <= 0) {
               
                setisLoading(false)
                seterrorMsg(t('wrongSaleNumberInput'))
                setOnMakeSaleChance(true)
    
               }
    
               if(regNo === null || regNo === undefined || regNo === " ") {
                setisLoading(false)
                seterrorMsg(t('sessionExpire'))
                setOnMakeSaleChance(true)
           }
               
            })

        } else {
            seterrorMsg(t('noInternet'))
        }
    }
    async function update_statics(assetID, selledQauntity, assetName) {

        const isAssetOnStastics = await check_existance(SALES_STASTICS_COL, assetID)

        if(isAssetOnStastics) {

           await  get_doc_data(SALES_STASTICS_COL, assetID)
            .then((data) =>{
                var totalQtn =data['quantity']+selledQauntity
                const qauntityData= {
                    quantity: totalQtn,
                }

                update_field(SALES_STASTICS_COL, assetID, qauntityData)
                
            })

        } else {
            
            const staticsData = {
                'name': assetName,
                "quantity": selledQauntity,
            }
            await setDoc(doc(db, SALES_STASTICS_COL, assetID), staticsData)
        
        }

    }

   function toggleMakingSales(assetIndex) {
    setIndex(assetIndex)
    setMakeSales(true)
    seterrorMsg('')
    setSuccessMsg('')
    if(isLoading) {
       setisLoading(false)
    }

    }

   const handleTogglePrintReceipts = () => {
        setPrintReceipt(prevState => !prevState)
   }
   


    return(
        <>
            <NavBar onSearch={setQueryText} Hcolor={color} />

            {/* body */}

        <div className="section"  >
      {/* <button className="add-stock-button"  onClick={handlePrint}>{t('addStock')}</button> */}
        {
            
            data.map(asset => (
                <div className="asset-box" style={{backgroundColor: '#3d0345'}} key={asset.id}>

                {
                    makeSales && index === asset.id?
                    <div className="sales-form-box">
                    <div ref={salesReceiptRef} className="sales-receipt"> 
                        <PrintableComponent name={asset.name.toUpperCase()} id={asset.id} quantity={Salesquantity}
                        pricePerEach={asset.sPrice} staffID={regNo} staffName={staffNames} />
                    </div>
                    <form onSubmit={(event) => make_sales(event,  asset.id)}>
                        <h4>{asset.name}-{asset.brand}</h4>
                        <p>{t('totalQuantity').toLowerCase()}: <b>{asset.quantity.toLocaleString()}</b></p>
                        <p>{t('price').toLowerCase()}: <b>{asset.sPrice.toLocaleString()}</b> tsh</p>
                        <label style={{marginBottom: "2px"}}>{t('enterAmount')}</label>

                        <InputNumber  
                        style={{paddingBottom: "10px"}} 
                        value={Salesquantity}
                        onValueChange={(e) => setSalesQuantity(e.value)}
                        min={0} 
                        required/>  

                        <label style={{marginBottom: "1px"}}>total sold price</label>

                        <InputNumber  
                        style={{paddingBottom: "10px"}} 
                        value={totalSoldPrice}
                        onValueChange={(e) => setTotalSoldPrice(e.value)}
                        min={0}
                        />  

                        <hr />
                        {/* <p style={{fontSize: "20px"}}>{t('printRisit')} 
                            <input 
                            type="checkbox"
                            style={{padding: "30px"}}
                            checked= {printReceipt}
                            onChange={handleTogglePrintReceipts}
                            />
                            </p> */}
                        <h4>HALI:
                        {totalSoldPrice > Salesquantity*asset.bPricePerOne?'profit':'loss'}
                        </h4>
                         {
                            isLoading?
                            <div className="loader" />
                            :
                            <button className="submit-buttons">{t('done')}</button>
                         }
                         <strong><span style={{fontSize: "20px", fontWeight: "bold", color: "green" }}>{successMsg}</span></strong>
                         <strong><span style={{fontSize: "20px", fontWeight: "bold", color: "red" }}>{errorMsg}</span></strong>
                        
                    </form>
                    {
                        isLoading?<p></p>
                        :
                        <FontAwesomeIcon icon={faArrowLeft} onClick={toggleMakingSales}/>
                    }
                    </div>
                    :
                    <table>
                        <caption>{asset.name}-{asset.brand}</caption>
                        <thead>
                            <tr>
                                <th style={{color: '#adaaad'}}>{t('totalQuantity')}</th>
                                <th style={{color: '#adaaad'}}>{t('price')}</th>
                            </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{asset.quantity.toLocaleString()}</td>
                            <td>{asset.sPrice.toLocaleString()} tsh</td>
                        </tr>
                    </tbody>

                         {
                            onMakeSaleChance?
                            <tr>
                                <td><center><button className="make-sales-button" onClick={()=>toggleMakingSales(asset.id)}>{t('makeSales')}</button></center></td>
                                {
                                    isAdmin?
                                    <td><center><button className="add-stock-button"  onClick={()=>toAddStock(asset.id)}>{t('addStock')}</button></center></td>
                                    :
                                    <td style={{fontWeight: "bolder"}}>{t('appTitle')}</td>

                                }
                              
                            </tr>
                        :
                        <tr></tr>
                         }


                    </table> 
                }
                </div>
            ))

        }
        </div>

            

        </>

    )
}


//npm install prettier -D --save-exact