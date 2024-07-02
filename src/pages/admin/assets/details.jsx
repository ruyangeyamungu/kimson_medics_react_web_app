import React, { useEffect, useState } from "react"
import { get_doc_data } from "../../../functions/get_doc_data"
import { ASSETS_COL, staffCol } from "../../../App"
import { AssetList, StaffList } from "./components/assetList"
import { SelectedAsset } from "./components/selectedAsset"
import Loader from "../../../loader/Loader"
import AssetHeader from "./components/headerComponent"
import { use } from "i18next"
import moment from "moment"
import { useLocation } from 'react-router-dom';


const AssetDetails=() => {
    const[name, setName] =useState()
    const[quantity, setQuantity] =useState(0)
    const[sPrice, setSprice] =useState(0)
    const[bPricePerOne, sBPricePerOne] =useState()
    const[bPricePerAll, setbPricePerAll] =useState()
    const[registeredDate, setRegisteredDate] =useState()
    const [lastStaffUpdated, setLastStaffUpdated] =useState('')
    const [lastDateUpdated, setLastDateUpdated] = useState('')
    const[lastAddedQuantity, setLastAddedQuantity] =useState(0)
    const[lastStaffAddedQuantity, setLastStaffAddedQuantity] =useState('')
    const[lastDateAddedQuantity, setLastDateAddedQuantity] =useState('')
    const [registrar, setRegistrar] =useState()
    const [loading, setLoading] =useState(true)
    
    const queryID = new URLSearchParams(useLocation().search);
    const ID = queryID.get('id');


    useEffect(()=>{
        get_doc_data(ASSETS_COL, ID)
        .then((asset)=>{
            setName(asset['name'])
            setQuantity(asset['quantity'])
            setSprice(asset['sPrice'])
            setRegisteredDate(asset['dateRegistered'])
            setRegistrar(asset['staffRegistered'])
            setLastAddedQuantity(asset['lastAddedQuantity'])
            setLastDateAddedQuantity(asset['lastDateAddedQuantity'])
            setLastStaffAddedQuantity(asset['lastStaffAddedQuantity'])
            setLastStaffUpdated(asset['lastStaffUpdated'])
            setLastDateUpdated(asset['lastDateUpdated'])
            
            setLoading(false)
        })
    },[])

    if(loading) {
        return <Loader />
    }

    return(
        <>
        
            <AssetHeader color="blue" id={ID} />

            <section>
            <div className="links">
                <div className="form-box">
                    <SelectedAsset selectedAssetID={ID} />
                </div>
              
            </div>
            <div className="contents-1">
                <div className="form-box">
                    <h2> NAME</h2>
                    <p style={{color: "blue"}}>{name}</p>
                    <hr /><br />
                    <h2>qauntity</h2>
                    <p>{quantity.toLocaleString()}</p>
                    <br />
                    <h2>selling price</h2>
                    <p>{sPrice.toLocaleString()} tsh</p>
                    <br />
                    <h2>date registered</h2>
                    <p>{moment(registeredDate.toDate()).format("DD-MM-YYY HH:MM:ss")}</p>
                    <br />
                    <h2>staff registered</h2>
                    <p>{registrar}</p>
                    <br />
                    <h2>last added quantity</h2>
                    <p>{lastAddedQuantity===undefined?' ':lastAddedQuantity.toLocaleString()}</p>
                    <br />
                    <h2>last date added quantity</h2>
                    <p>{lastDateAddedQuantity}</p>
                    <br />
                    <h2>last staff added quantity</h2>
                    <p>{lastStaffAddedQuantity}</p>
                    <br />
                    <h2>last date added updated</h2>
                    <p>{lastDateUpdated}</p>
                    <br />
                    <h2>last staff updated</h2>
                    <p>{lastStaffUpdated}</p>
                    <br />
                    
                    <h2>id</h2>
                    <p style={{color: "red"}}>{ID}</p>
                    
                </div>
            </div>

            <div className="staff-list-box">
                <h3>STAFF LIST</h3>
                <AssetList  />
            </div>
        </section>
        </>
    )
}

export default AssetDetails