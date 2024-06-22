import React, {useState, useEffect, useRef} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import {NavBar} from "../../components/navBar";
import { db, ASSETS_COL, SALES_COL, SALES_STASTICS_COL } from "../../App";
import { doc,setDoc, collection, addDoc, onSnapshot, where, query, orderBy, startAt, endAt } from "firebase/firestore";
import { update_field } from "../../functions/update_field";
import { get_doc_data } from "../../functions/get_doc_data";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import Loader from "../../loader/Loader";
import { check_existance } from "../../functions/check_existance";
import { useReactToPrint } from 'react-to-print';
import PrintableComponent from "../../printableReceipt/salesReceipt";

export default function Home() {

    const [color, setColor] = useState('blue');
    const [makeSales, setMakeSales] =useState(false)
    const [onMakeSaleChance, setOnMakeSaleChance] =useState(true)
    const [index, setIndex]= useState()
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const[Salesquantity, setSalesQuantity] =useState()
    const regNo = useSelector(state => state.regNo);
    const [isLoading, setisLoading] = useState(false)
    const [successMsg, setSuccessMsg] = useState()
    const [errorMsg, seterrorMsg] = useState()
    const [queryText, setQueryText] = useState("");
    const componentRef = useRef();
    const[printReceipt, setPrintReceipt] = useState(false)

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
      });
  

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
                    endAt(queryText.toUpperCase() + "\uf8ff")
                    // where("name", "==", queryText)
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

    function make_sales  (e, assetID) {
        e.preventDefault();
        
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
                             "selledQauntity": Salesquantity,
                             "totalPrice":  cash,
                              "sPrice": sPrice,
                              "staffSelled": regNo,
                              "date": new Date(),
                              "strDate": moment(new Date()).format('DD-MM-YYYY')
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

        <div className="section">
        {/* <div ref={componentRef}>
            <PrintableComponent />
        </div> */}
      {/* <button className="add-stock-button"  onClick={handlePrint}>{t('addStock')}</button> */}
        {
            
            data.map(asset => (
                <div className="asset-box" style={{backgroundColor: 'blue'}} key={asset.id}>

                {
                    makeSales && index === asset.id?
                    <div className="sales-form-box">
                    <form onSubmit={(event) => make_sales(event,  asset.id)}>
                        <h4>{asset.name}</h4>
                        <p>{t('totalQuantity').toLowerCase()}: <b>{asset.quantity.toLocaleString()}</b></p>
                        <p>{t('price').toLowerCase()}: <b>{asset.sPrice.toLocaleString()}</b> tsh</p>
                        <label style={{marginBottom: "2px"}}>{t('enterAmount')}</label>

                        <InputNumber  
                        style={{paddingBottom: "10px"}} 
                        value={Salesquantity}
                        onValueChange={(e) => setSalesQuantity(e.value)}
                        min={0} 
                        required/>  

                        <hr />
                        <p style={{fontSize: "20px"}}>{t('printRisit')} 
                            <input 
                            type="checkbox"
                            style={{padding: "30px"}}
                            checked= {printReceipt}
                            onChange={handleTogglePrintReceipts}
                            />
                            </p>
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
                        <caption>{asset.name}</caption>
                        <thead>
                            <tr>
                                <th>{t('totalQuantity')}</th>
                                <th>{t('price')}</th>
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
                                <td><center><button className="add-stock-button"  onClick={handlePrint}>{t('addStock')}</button></center></td>
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