import React, {useState, useRef} from "react";
import { InputNumber } from 'primereact/inputnumber';
import { useTranslation } from 'react-i18next';
import {NavBar} from "../../../components/navBar";
import { useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, staffCol, db, ASSETS_COL } from "../../../App";
import { getStaffRegNo } from "../../../functions/get_staff_reg_no";
import { check_existance } from "../../../functions/check_existance";
import { addDoc, collection, getDocs, where, query } from "firebase/firestore";


export const AssetReg=()=> {
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState()
    const [successMsg, setSuccessMsg] =useState()
    const lineRef =useRef()
    const regNo = useSelector(state => state.regNo);
    const [assetName, setassetName] =useState(" ")
    const [quantity, setQuantity] = useState()
    const [bPriceOne, setbPriceOne] =useState(1)
    const [bPriceAll, setbPriceAll] =useState()
    const [sPrice, setsPrice] =useState()
    const { t } = useTranslation();

    const handleAssetReg = async (event) =>{
        event.preventDefault()
        setisError(false);

        if(assetName != null && quantity >= 1 && bPriceAll >=1 && sPrice >=1 ) {
            setisLoading(true)

            try{

                // check if asset name exits
                const assetCollection= collection(db, ASSETS_COL);
                const q = query(assetCollection, where("name", "==", assetName.toUpperCase()));
                 
                const assetNames = await getDocs(q);

                console.log(assetNames);

                if(assetNames.empty) {

                onAuthStateChanged(auth, async user =>{
                    // gets user eg no using its account it
                    const regNo =await getStaffRegNo(user.uid)
                    const isStaff = await check_existance(staffCol, regNo.toUpperCase().trim())
                    if(isStaff) {
    
                       const assetData = {
                            "name": assetName.toUpperCase(),
                             "sPrice": sPrice,
                             "totalBprice": bPriceAll,
                             "PerOneBprice": bPriceOne,
                             "dateRegistered": new Date(),
                             "staffRegistered": regNo,
                             "quantity": quantity
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
                            setbPriceAll()
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
                    
                    alert(assetName+ " : is aready present, go and add stock or update it ")
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
            if(bPriceAll < 1) {
                setisError(true)
                setErrorMsg("all buying price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(sPrice < 1) {
                setisError(true)
                setErrorMsg("selling price must be greater than 0")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            if(bPriceOne < 1 && bPriceOne !== null) {
                setisError(true)
                setErrorMsg("buying price  per one must be greater than 0 or empty")
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }

    }


    function hideErrorBox() {
        setisError(false)
    }
    return(
        <>  
            <div className="form-box">
                <hr id="line" />
                <br />
                <center><h2>ASSET REGISTATION</h2></center>
                <hr />
                <form onSubmit={handleAssetReg}>

                    <label for="assetName">asset name</label>
                    <input type="text" placeholder="asset name.." value={assetName.toUpperCase().trim()} onChange={(e)=>setassetName(e.target.value)} min={0} maxLength={20}required/>

                    <label for="password">{t('totalQuantity')} </label>
                    <InputNumber  style={{paddingBottom: "10px"}} value={quantity} onValueChange={(e)=>setQuantity(e.value)} min={0} required/>

                    <label for="bprice">buying price @1 Qt</label>
                    <InputNumber  style={{paddingBottom: "10px"}}  value={bPriceOne} onValueChange={(e)=>setbPriceOne(e.value)} min={0} /><br />
                    <span style={{color: "green"}}>you can leave this part, a set buying price for @all Qts</span>

                    <label for="bprice">buying price @all Qts</label>
                    <InputNumber  style={{paddingBottom: "10px"}} value={bPriceAll} max={bPriceOne*quantity} onValueChange={(e)=>setbPriceAll(e.value)}  min={0} required />

                    <label for="bprice">selling price @1 </label>
                    <InputNumber  style={{paddingBottom: "10px"}} value={sPrice} onValueChange={(e) =>{setsPrice(e.value)}} min={0} required />

                    {
                        isLoading?
                        <div className="loader" id="loader"></div>
                        :
                        <input type="submit"  className="submit-buttons" value="SIGN UP" />
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