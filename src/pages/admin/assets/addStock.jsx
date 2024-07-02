import React,{useState, useEffect, useRef} from "react"
import { InputNumber } from 'primereact/inputnumber';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { AssetList } from "./components/assetList";
import AssetHeader from "./components/headerComponent";
import { SelectedAsset } from "./components/selectedAsset";
import { onSnapshot, query, doc, updateDoc } from "firebase/firestore";
import { db, ASSETS_COL, staffCol, auth } from "../../../App";
import { check_existance } from "../../../functions/check_existance";
import { update_field } from "../../../functions/update_field";
import Loader from "../../../loader/Loader";
import { onAuthStateChanged } from "firebase/auth";
import { getStaffRegNo } from "../../../functions/get_staff_reg_no";
import { get_doc_data } from "../../../functions/get_doc_data";
import { useLocation } from 'react-router-dom';
import moment from "moment/moment";

const AddStock =() => {
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState()
    const [successMsg, setSuccessMsg] =useState()
    const lineRef =useRef()
    const regNo = useSelector(state => state.regNo);
    const [assetName, setassetName] =useState("")
    const [quantity, setQuantity] = useState()
    const [bPricePerOne, setbPricePerOne] =useState()
    
    const [sPrice, setsPrice] =useState()
    const { t } = useTranslation()
    const [loader, setLoader] =useState(true)

    const queryID = new URLSearchParams(useLocation().search);
    const ID = queryID.get('id');
    

    useEffect(() => {
        // Reference to the specific document
        const assetRef = doc(db, ASSETS_COL, ID);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(assetRef, (asset) => {
          if (asset.exists()) {
            setassetName(asset.data()['name']);
            setsPrice(asset.data()['sPrice'])
            setbPricePerOne(asset.data()['bPricePerOne'])
            setLoader(false)
           
          } else {
            console.log("Document does not exist!");
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
     
    const handleAddStock = async (event) =>{
        event.preventDefault()
        setisError(false);

        if(assetName != null && quantity >= 1 && bPricePerOne >=1 && sPrice >=1 ) {
            setisLoading(true)

            try{

                // check if asset name exits
                const isAsset =check_existance(ASSETS_COL, ID)
                
                if(isAsset) {
                    const assetData= await get_doc_data(ASSETS_COL, ID)
                    var  initialQt =assetData.quantity
                    const totalQt =initialQt+quantity

                    console.log(totalQt);

                onAuthStateChanged(auth, async user =>{
                    // gets user eg no using its account it
                    const regNo =await getStaffRegNo(user.uid)
                    const isStaff = await check_existance(staffCol, regNo.toUpperCase().trim())
                    if(isStaff) {
                       const assetData = {
                             "sPrice": sPrice,
                             "totalBprice": bPricePerOne*totalQt,
                             "bPricePerOne": bPricePerOne,
                             "quantity": totalQt,
                             "lastDateAddedQuantity": moment(new Date()).format('DD-MM-YYYY'),
                             "lastStaffAddedQuantity": regNo,
                             "lastAddedQuantity": quantity,
                              
                        } 
    
                       // add asset
                        await update_field(ASSETS_COL, ID ,assetData)
                        .then(() =>{
                            setisError(true)
                            setSuccessMsg ("STOCK ADD SUCCESSFULL")
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

    function hideErrorBox() {
        setisError(false)
    }

    if(loader){
        return(
            <Loader />
        )
    }

    return(
        <>
        
            <AssetHeader adColor="blue" id={ID} />

            <section>
            <div className="links">
            <div className="form-box">
                <SelectedAsset selectedAssetID={ID}/>
            </div>
            
            </div>
            <div className="contents-1">
                <div className="form-box">
                    <form onSubmit={handleAddStock}>

                        <label for="assetName">asset name</label>
                        <input type="text" placeholder="asset name.." value={assetName.toUpperCase().trim()} onChange={(e)=>setassetName(e.target.value)} min={0} readOnly/>

                        <label for="password">qauntity to add</label>
                        <InputNumber  style={{paddingBottom: "10px"}} value={quantity} onValueChange={(e)=>setQuantity(e.value)} min={0} required/>

                        <label for="bprice">buying price @1 Qt</label>
                        <InputNumber  style={{paddingBottom: "10px"}}  value={bPricePerOne} onValueChange={(e)=>setbPricePerOne(e.value)} min={0} required/><br />
                
                        <label for="bprice">selling price @1 </label>
                        <InputNumber  style={{paddingBottom: "10px"}} value={sPrice} onValueChange={(e) =>{setsPrice(e.value)}} min={0} required />

                        {
                            isLoading?
                            <div className="loader" id="loader"></div>
                            :
                            <input type="submit"  className="submit-buttons" value="ADD STOCK" />
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

            <div className="asset-list-box">
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

export default AddStock