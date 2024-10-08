import React,{useState, useEffect, useRef} from "react"
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AssetList } from "./components/assetList";
import AssetHeader from "./components/headerComponent";
import { SelectedAsset } from "./components/selectedAsset";
import { onSnapshot, query, doc, where,getDocs, collection, deleteDoc } from "firebase/firestore";
import { db, ASSETS_COL, staffCol, auth } from "../../../App";
import { check_existance } from "../../../functions/check_existance";
import { update_field } from "../../../functions/update_field";
import Loader from "../../../loader/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { getStaffRegNo } from "../../../functions/get_staff_reg_no";
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import "../../../styles/loaders.css"
import moment from "moment";
import { get_doc_data } from "../../../functions/get_doc_data";

const ManageAsset =() => {
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState()
    const [successMsg, setSuccessMsg] =useState()
    const lineRef =useRef()
    const regNo = useSelector(state => state.regNo);
    const [assetName, setassetName] =useState("")
    const [quantity, setQuantity] = useState()
    const [bPricePerOne, setbPricePerOne] =useState()
    const[brandName, setBrandName] =useState('')

    const brandNames = ['itel', 'samsung', 'infinix', 'techno', 'guava', 'bontel', 'nokia', 'oppo']
  
    const [sPrice, setsPrice] =useState()
    const { t } = useTranslation()
    const [loader, setLoader] =useState(true)
    const navigate =useNavigate()
    const [isDeleting, setIsDeleting] =useState(false)

    const queryID = new URLSearchParams(useLocation().search);
    const ID = queryID.get('id');
    const [fullName, setFullName] =useState();

    useEffect(() => {
        // Reference to the specific document
        const assetRef = doc(db, ASSETS_COL, ID);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(assetRef, (asset) => {
          if (asset.exists()) {
            setassetName(asset.data()['name']);
            setBrandName(asset.data()['brand']);
            setQuantity(asset.data()['quantity']);
            setsPrice(asset.data()['sPrice'])
            setbPricePerOne(asset.data()['bPricePerOne']);
            setFullName(asset.data()['fullName'])
            setLoader(false)
           
          } else {
            console.log("Document does not exist!");
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
     
    const handleManageAssetChange = async (event) =>{
        event.preventDefault()
        setisError(false);
  
        if(assetName != null && quantity >= 1 && bPricePerOne >=1 && sPrice >=1 ) {
            setisLoading(true)

            if(fullName.toUpperCase().trim() !==assetName.toUpperCase().trim()+brandName.toUpperCase().trim()) {

                
            
                // check if asset name is present
                const assetCollection= collection(db, ASSETS_COL);
                const q = query(assetCollection, where("name", "==", assetName.toUpperCase()), where("brand", "==", brandName.toUpperCase()));
                 
                const assetNames = await getDocs(q);

                if(assetNames.empty) {
                     
                     try{

                        // check if asset name exits
                        const isAsset =check_existance(ASSETS_COL, ID)
                        
                        if(isAsset) {
        
                        onAuthStateChanged(auth, async user =>{
                            // gets user eg no using its account it
                            const regNo =await getStaffRegNo(user.uid)
                            const isStaff = await check_existance(staffCol, regNo.toUpperCase().trim())
                            if(isStaff) {
            
                               const assetData = {
                                    "name": assetName.toUpperCase(),
                                    "brand": brandName.toUpperCase(),
                                    "sPrice": sPrice,
                                    "totalBprice": bPricePerOne*quantity,
                                    "bPricePerOne": bPricePerOne,
                                    "lastDateUpdated": moment(new Date()).format('DD-MM-YYYY HH:MM:ss'),
                                    "lastStaffUpdated": regNo,
                                    "quantity": quantity,
                                    "fullName": assetName.toUpperCase().trim()+brandName.toUpperCase().trim()
                               } 
            
                               // add asset
                                await update_field(ASSETS_COL,ID ,assetData)
                                .then(() =>{
                                    setisError(true)
                                    setSuccessMsg ("updated successfully")
                                    lineRef.current.scrollIntoView({ behavior: "smooth" });
        
                                    setisLoading(false)
                                })
                            } else {
                                setisLoading(false)
                                setisError(true)
                                setErrorMsg ("faid to recorginize your staff, try to log out and back login")
                                lineRef.current.scrollIntoView({ behavior: "smooth" });
                            }
            
                            })
                            
                        }else{
                            
                            alert(assetName+ " : is not  present, go and register it ")
                            Location.window.reload()
        
                        }
        
                    }catch(error) {
                        setisLoading(false);
                        setisError(true)
                        setErrorMsg(t('unknown'))
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                } else {
                    setisLoading(false)

                    alert(assetName+'-'+brandName+': '+ t('assetIsPresent'));
                }

            }

          



        }

            if(assetName == null) {
                setisError(true)
                setErrorMsg("enter asset name")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(quantity < 1) {
                setisError(true)
                setErrorMsg("quantity must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(bPricePerOne < 1) {
                setisError(true)
                setErrorMsg("all buying price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(sPrice < 1) {
                setisError(true)
                setErrorMsg("selling price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
        


    async function deleteAsset( ) {
        try {
            setIsDeleting(true)
            await deleteDoc(doc(db, ASSETS_COL, ID));
            navigate('/admin')
          } catch (error) {
            console.error("Error deleting document: ", error);
          }
    
    }

    function hideErrorBox() {
        setisError(false)
    }
    const handlBrandNameChange =(event) =>{
        event.preventDefault()
        setBrandName(event.target.value)
    }

    if(loader){
        return(
            <Loader />
        )
    }

    return(
        <>
        
            <AssetHeader mcolor="blue" id={ID} />

            <section>
            <div className="links">
            <div className="form-box">
                <SelectedAsset selectedAssetID={ID}/>
                
            </div>
                
                <div className="form-box">
                    {
                        isDeleting?
                        <div className="loader" ></div>
                        :
                        <button className="auth-buttons" onClick={deleteAsset}>DELETE</button>
                    }
                    
                   
                    <p style={{color: "red"}}><strong>NOTE: </strong>deleting  this asset will delete it permanently from your asset list</p>
                </div>
            </div>
            <div className="contents-1">
                <div className="form-box">
                    <form onSubmit={handleManageAssetChange}>

                        <label for="assetName">{t('name').toLowerCase()}</label>
                        <input type="text" placeholder={t('namePlc')}  value={assetName.toUpperCase().trim()} onChange={(e)=>setassetName(e.target.value)} min={0} maxLength={20}required/>
                        <label for="assetName">{t('brand')}</label>
                        <input type="text" placeholder={t('brandPlc')} value={brandName.toUpperCase().trim()} onChange={(e)=>setBrandName(e.target.value)} min={0} maxLength={20}required/>
                        
                        <hr style={{marginTop: "10px"}}></hr>
                        {
                            brandNames.map(
                                brand =><button className="brandNamesBtn" onClick={handlBrandNameChange} value={brand}>{brand}</button>
                            )
                        }
                        
                        <hr></hr>

                        <label for="password">{t('totalQuantity').toLowerCase()} </label>
                        <InputNumber  style={{paddingBottom: "10px"}} value={quantity} onValueChange={(e)=>setQuantity(e.value)} min={0} placeholder={t('totalQuantityPlc')} required/>

                        <label for="bprice">{t('buyingPrice@1')}</label>
                        <InputNumber  style={{paddingBottom: "10px"}}  value={bPricePerOne} onValueChange={(e)=>setbPricePerOne(e.value)} min={0} placeholder={t('buyingPrice@1Plc')} required /><br />
                       
                        <label for="bprice">{t('sellingPrice@1')}</label>
                        <InputNumber  style={{paddingBottom: "10px"}} value={sPrice} onValueChange={(e) =>{setsPrice(e.value)}} min={0}  placeholder={t('sellingPrice@1Plc')} required />

                        {
                            isLoading?
                            <div className="loader" id="loader"></div>
                            :
                            <input type="submit"  className="submit-buttons" value="UPDATE" />
                        }

                        {
                        isError?
                            <div className="alert">
                                <span className="closebtn" onClick={hideErrorBox}>&times;</span> 
                                <strong></strong> <span id="errorMessage">{errorMsg}</span>
                                <strong><span style={{color: "green"}}>{successMsg}</span></strong>
                            </div>
                        :
                        <div></div>
                        }
                        <hr id="line" ref={lineRef} />
                    </form>
                </div>
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

export default ManageAsset