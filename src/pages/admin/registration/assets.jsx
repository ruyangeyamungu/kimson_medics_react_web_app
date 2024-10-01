import React, {useState, useRef} from "react";
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import { useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, staffCol, db, ASSETS_COL } from "../../../App";
import { getStaffRegNo } from "../../../functions/get_staff_reg_no";
import { check_existance } from "../../../functions/check_existance";
import { addDoc, collection, getDocs, where, query } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


export const AssetReg=()=> {
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState()
    const [successMsg, setSuccessMsg] =useState()
    const lineRef =useRef()
    const navigate =useNavigate()
    const regNo = useSelector(state => state.regNo);
    const [assetName, setassetName] =useState(" ")
    const [quantity, setQuantity] = useState()
    const [bPricePerOne, setbPriceOne] =useState()
    const [sPrice, setsPrice] =useState()
    const { t } = useTranslation();
    const[brandName, setBrandName] =useState('')

    const brandNames = ['itel', 'samsung', 'infinix', 'techno', 'guava', 'bontel', 'nokia', 'oppo']

    const handleAssetReg = async (event) =>{
        event.preventDefault()
        setisError(false);

        if(assetName != null && quantity >= 1 && bPricePerOne >=1 && sPrice >=1 ) {
            setisLoading(true)
            setErrorMsg('')
            setisError(false)
            setSuccessMsg('')

            try{

                // check if asset name exits
                const assetCollection= collection(db, ASSETS_COL);
                const q = query(assetCollection, where("name", "==", assetName.toUpperCase()), where("brand", "==", brandName.toUpperCase()));
                 
                const assetNames = await getDocs(q);

                if(assetNames.empty) {

                    onAuthStateChanged(auth, async user =>{
                        // gets user eg no using its account it
                        const regNo =await getStaffRegNo(user.uid)
                        const isStaff = await check_existance(staffCol, regNo.toUpperCase().trim())
                        if(isStaff) {

                        const assetData = {
                        
                                "name": assetName.toUpperCase(),
                                "sPrice": sPrice,
                                "bPricePerOne": bPricePerOne,
                                "dateRegistered": new Date(),
                                "staffRegistered": regNo,
                                "quantity": quantity,
                                "brand":brandName.toUpperCase(),
                                'fullName': assetName.toUpperCase().trim()+brandName.toUpperCase().trim()
                            
                            } 
        
                        // add asset
                            await addDoc(collection(db, 'ASSETS'), assetData)
                            .then(() =>{
                                setisError(true)
                                setSuccessMsg ("successfully registered")
                                lineRef.current.scrollIntoView({ behavior: "smooth" });
        
                                setassetName('')
                                setQuantity()
                                setbPriceOne()
                                setbPriceOne()
                                setsPrice()
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
                    
                    alert(assetName+'-'+brandName+': '+ t('assetIsPresent'));
                    Location.window.reload()

                }

            }catch(error) {
                setisLoading(false);
                setisError(true)
                setErrorMsg(t('unknown'))
                lineRef.current.scrollIntoView({ behavior: "smooth" });
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
                setErrorMsg("buying price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(sPrice < 1) {
                setisError(true)
                setErrorMsg("selling price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    
    const handlBrandNameChange =(event) =>{
        event.preventDefault()
        setBrandName(event.target.value)
    }

    if(regNo===null) {
        signOut(auth)
        .then(()=> {
            navigate('/')
        })
    }
    function hideErrorBox() {
        setisError(false)
    }
    return(
        <>  
            <div className="form-box">
                <hr id="line" />
                <br />
                <center><h2>{t('assetReg')}</h2></center>
                <hr />
                <form onSubmit={handleAssetReg}>

                    <label for="assetName">{t('name').toLowerCase()}</label>
                    <input type="text" placeholder={t('namePlc')} value={assetName.toUpperCase().trim()} onChange={(e)=>setassetName(e.target.value)} min={0} maxLength={20}required/>
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
                    <InputNumber  style={{paddingBottom: "10px"}}  value={bPricePerOne} onValueChange={(e)=>setbPriceOne(e.value)} min={0} placeholder={t('buyingPrice@1Plc')} required/><br />
                  
                    <label for="bprice">{t('sellingPrice@1')}</label>
                    <InputNumber  style={{paddingBottom: "10px"}} value={sPrice} onValueChange={(e) =>{setsPrice(e.value)}} min={0} placeholder={t('sellingPrice@1Plc')} required />

                    {
                        isLoading?
                        <div className="loader" id="loader"></div>
                        :
                        <input type="submit"  className="submit-buttons" value={t('register')} />
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
            
        </>

    )
}