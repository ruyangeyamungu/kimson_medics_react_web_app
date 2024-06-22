import React, { useState, useEffect } from "react"
import { get_doc_data } from "../../../../functions/get_doc_data"
import { ASSETS_COL, db} from "../../../../App"
import { onSnapshot, doc } from "firebase/firestore"


export const SelectedAsset= ({selectedAssetID}) => {
   const [name, setName] =useState()
   const [id, setID] =useState()
   const [remainedQuantity, setRemainedQuantity] =useState(0)

   useEffect(() => {
    // Reference to the specific document
    const assetRef = doc(db, ASSETS_COL, selectedAssetID);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(assetRef, (asset) => {
      if (asset.exists()) {
        setName(asset.data()['name']);
        setRemainedQuantity(asset.data()['quantity']);
        setID(id);
      } else {
        console.log("Document does not exist!");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);


    return (
        <div className="selected-staff-box">
            <div className="data">
                <h3>{name}</h3>
                <br />
                <p>Remaind quantity: <strong>{remainedQuantity.toLocaleString()}</strong></p>
                <hr />
                <br />
                <h5 style={{color: "red"}}>{id}</h5>
            </div>
        </div>
    )
}