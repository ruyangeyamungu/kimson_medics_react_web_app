import React, {useEffect, useState} from "react"
import { query, collection, onSnapshot, where } from "firebase/firestore"
import { staffCol, db } from "../../../App";
import { StaffList } from "./components/staffList";
import StaffHeader from "./components/headerComponent";
import { SelectedStaff } from "./components/selectedStaff";
import Loader from "../../../loader/Loader";
import "../../../styles/buttons.css"
import { useLocation } from 'react-router-dom';

const ManageAccount =() => {
    const [staffCredentials, setStaffCredentials] =useState([])
    const [accountID, setAccountID] =useState()
    const [loading, setLoading] =useState(true)
    const[admin, setAdmin] =useState()
    const queryID = new URLSearchParams(useLocation().search);
    const REGNO = queryID.get('id');


    useEffect(() => {
        
        const q = query(collection(db, staffCol),where("staffID", "==", REGNO)); 

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const staffs = querySnapshot.docs.map((doc) => (
            {
                id: doc.id,
                ...doc.data()
            }
        ));
       setStaffCredentials(staffs)
       setLoading(false)           
      });

        staffCredentials.forEach(staff => {
            setAdmin(staff['isAdmin'])
        });


      // Clean up the subscription on unmount
      return () => unsubscribe();
    }, []);

    if(loading) {
        return(
            <Loader />
        )
    }
   
    return(
        <>
        
            <StaffHeader mAccColor="blue" regNo={REGNO} />

            <section>
            <div className="links">
                <SelectedStaff selectedID={REGNO} />
            </div>
            <div className="contents-1">
                <div className="form-box">
                <form>
                    <div className="form-box accounts">
                        <label>ADMIN</label>
                        <input type="radio" name="admin" value='true' checked={admin===true}  />
                        <label>NOT ADMIN</label>
                        <input type="radio" name="admin" value='false'  />
                        <input type="submit" className="submit-buttons" value="CHANGE" checked={admin===false} />
                    </div>
                </form>
                {
                        staffCredentials.map(staff=>(
                            <div className="form-box accounts">
                                <h3>ACCOUNT ID</h3>
                                <br />
                                <strong><p style={{color: 'red'}}>{staff['accountID']}</p></strong>
                                <center><button className="auth-buttons">RESET</button></center>
                            </div>
                        ))
                    }

                </div>
            </div>

            <div className="staff-list-box">
                <h3>STAFF LIST</h3>
                <StaffList />
            </div>
        </section>
        <div className="footer">
            ikjiuunk
        </div>
        </>
    )
}

export default ManageAccount