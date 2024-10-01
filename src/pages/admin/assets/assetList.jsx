import React, { useState, useEffect } from "react";
import { query, collection, onSnapshot, orderBy } from "firebase/firestore";
import { db, ASSETS_COL } from "../../../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHourglassStart, faShop, faShoppingCart, faUser,faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { AdminHeader } from "../components/header";


const  AllAssetListView = () =>{
    const [assetList, setAssetList] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
          
        const q = query(collection(db, ASSETS_COL), orderBy('name')); 

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
    
    const toAssetData =(id) => {
        navigate('/asset-det?id='+ encodeURIComponent(id))
    }

    return (
        <>
            <AdminHeader />

            <div className="all-asset-list-view">
                
                {
                    assetList.map(asset => (
        
                        <div className="asset" onClick={()=>toAssetData(asset.id)}>
                            <FontAwesomeIcon icon={faHourglassStart} style={{fontSize: '70px', color: 'blue' }} />
                            <br /><br />
                            <h3>{asset['name']}-{asset['brand']}</h3>
                            <hr />
                            <h5 style={{color:"green"}}>{asset['quantity'].toLocaleString()}</h5>
                        </div>
                    
                    ))
                }
        
            </div>
        </>

    )
}

export default AllAssetListView