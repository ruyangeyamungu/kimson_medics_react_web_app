import React, { useState, useEffect } from "react"
import { collection,onSnapshot, query, startAt,where,endAt,orderBy } from "firebase/firestore";
import { db, staffCol } from "../../../../App";

export const StaffList=() =>{
    const[staffList, setStaffList] =useState([])
    const[queryText, setQueryText] =useState("")

    useEffect(() => {
        
        if (queryText.trim() === "") {
            const assets = onSnapshot(query(collection(db, staffCol), orderBy('fname')), (snapshot) => {
                const dataArray = snapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
                setStaffList(dataArray);
              
            });
          return;
        }
    
        const q = query(collection(db, staffCol),
                  where("staffID", "==", queryText.toUpperCase()),
                  orderBy("fname"),
                   

                ); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const staffs = querySnapshot.docs.map((doc) => (
          {
          id: doc.id,
          ...doc.data()
        }));
        setStaffList(staffs)
           
      });
  
      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, [queryText]);

    

    return(
        <>
        <input type="search" style={{width: "100%", padding: "5px"}}
        
         onChange={(e)=>setQueryText(e.target.value)}
         placeholder="search here by reg no" />

        {
            staffList.map(staff=> (
            <div className="staff-box">
            <div className="image" >
                <img src={staff['staffImage']} width="100px" alt="profile" style={{borderRadius: "20px"}} />
            </div>
            <div className="data">
                <h4>{staff.id}</h4>
                <br />
                <p>{staff['fname']+ ' ' +staff['mname'][0].toUpperCase()+' ' +staff['mname'][0].toUpperCase()}</p>

            </div>
            </div>
            ))
        }

        </>


    )

}