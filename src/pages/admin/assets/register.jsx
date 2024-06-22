import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { staffCol, storage, db, auth, ASSETS_COL } from "../../../App";
import { v4 as uuidv4 } from 'uuid';
import { check_existance } from "../../../functions/check_existance";
import { doc, setDoc, query, orderBy, onSnapshot, collection } from "firebase/firestore";
import  { useSelector  } from "react-redux";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../../styles/loaders.css"
import {AssetReg} from "../registration/assets";
import { AdminHeader } from "../components/header";
import { AssetList } from "./components/assetList";
import Loader from "../../../loader/Loader";


const AssetRegister =()=>{
    
    const [loader, setLoader]=useState(false)
    

//     if(navigator.onLine) {
//         setLoader(true)
//     }


//    if(Loader) {
//     return(
//         <Loader />
//     )
//    }

    return (
        <>
            <AdminHeader />
            <section>
    
            <div className="contents-1">
                <h3 className="registration-title">ASSET REGISTRATION</h3>
                <AssetReg />
            </div>

            <div className="items-list-container">
                <h2>ASSET LIST</h2>
                <AssetList />
            </div>

        </section>
      
        </>
    )
    
}

export default AssetRegister


