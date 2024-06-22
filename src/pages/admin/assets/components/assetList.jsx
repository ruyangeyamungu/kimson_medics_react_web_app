import React, { useState, useEffect } from "react"
import { collection,onSnapshot, query, startAt,where,endAt,orderBy } from "firebase/firestore";
import { ASSETS_COL, db, staffCol } from "../../../../App";
import { useNavigate } from "react-router-dom";

export const AssetList=() =>{
    const[assetList, setAssetList] =useState([])
    const[queryText, setQueryText] =useState("")
    const navigate =useNavigate()

    useEffect(() => {
        
        if (queryText.trim() === "") {
            const assets = onSnapshot(query(collection(db, ASSETS_COL), orderBy('name')), (snapshot) => {
                const dataArray = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setAssetList(dataArray);
              
            });
          return;
        }
    
        const q = query(collection(db, ASSETS_COL),
                    orderBy("name"),
                    startAt(queryText.toUpperCase()),
                    endAt(queryText.toUpperCase() + "\uf8ff")
                ); 

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
    }, [queryText]);

    function toAssetData(id)  {
       navigate('/asset-det?id='+ encodeURIComponent(id))
       window.location.reload()
    }

    return(
        <>
        <input type="search" style={{width: "100%", padding: "5px"}}
         onChange={(e)=>setQueryText(e.target.value)}
         placeholder="search here...." />
        {
            assetList.map(asset=> (
            <div className="staff-box" >
            <div className="data" onClick={()=>toAssetData(asset.id)} >
                <h4>{asset['name']}</h4>
                <br />
                <p>{asset['quantity'].toLocaleString()}</p>
                <br />
                <p>id: <span style={{color: "red"}}>{asset.id}</span></p>

            </div>
            </div>
            ))
    }

        </>


    )

}