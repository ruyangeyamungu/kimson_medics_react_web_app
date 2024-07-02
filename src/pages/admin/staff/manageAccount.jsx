import React, {useEffect, useState} from "react"
import { query,  onSnapshot, doc, deleteDoc } from "firebase/firestore"
import { staffCol, db } from "../../../App";
import { StaffList } from "./components/staffList";
import StaffHeader from "./components/headerComponent";
import { SelectedStaff } from "./components/selectedStaff";
import Loader from "../../../loader/Loader";
import "../../../styles/buttons.css"
import { useLocation } from 'react-router-dom';
import { update_field } from "../../../functions/update_field";
import { useNavigate } from "react-router-dom";

const ManageAccount =() => {
    const [accountID, setAccountID] =useState()
    const [loading, setLoading] =useState(true)
    const[admin, setAdmin] =useState()
    const queryID = new URLSearchParams(useLocation().search);
    const REGNO = queryID.get('id');
    const [updating, setUpdating] = useState(false)
    const[updateSuccesMsg, setUpdateSuccesMsg] = useState('')
    const [isReseting, setIsReseting] = useState(false)
    const[resetSuccesMsg, setResetSuccesMsg] = useState('')
    const [isDeletingStaff, setIsDeletingStaff] =useState(false)
    const [deleteStaffErrorMsg, setDeleteStaffErrorMsg] =useState(false)
    const navigate =useNavigate()


    useEffect(() => {
        // Reference to the specific document
        const staffRef = doc(db, staffCol, REGNO);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(staffRef, (staff) => {
          if (staff.exists()) {
            if(staff.data()['admin']==='admin') {
                setAdmin('admin')
    
            }else {
                setAdmin('notAdmin')
            }
            if(staff.data()['accountID']!==null) {

                setAccountID(staff.data()['accountID'])
    
            }else {
                setAccountID('NO ACCOUNT')
            }

            setLoading(false)

           
          } else {

            
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);

    const updateAccontType = async (event) => {
        event.preventDefault();
        setUpdateSuccesMsg('')
        setUpdating(true)
        const accType = {
            accType: admin
        }
       await  update_field(staffCol, REGNO, accType)
            .then(()=>{
                setUpdating(false)
                setUpdateSuccesMsg('account successfully updated')
            })
    }

    const resetAccount = async () => {
        setResetSuccesMsg('')
        setIsReseting(true)
        const accType = {
            accountID: null
        }
       await  update_field(staffCol, REGNO, accType)
            .then(()=>{
                setIsReseting(false)
                setResetSuccesMsg('account successfully reseted')
            })
    }

    async function deleteStaff() {
        try {
            setIsDeletingStaff(true)
            await deleteDoc(doc(db, staffCol, REGNO));
            navigate('/admin')
          } catch (error) {
            setIsDeletingStaff(false)
            deleteStaffErrorMsg('something went wrong, faild to delete staff, try again')
          }
    
    }

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
                <form onSubmit={updateAccontType}>
                    <div className="form-box accounts">
                        <label>ADMIN</label>
                        <input type="radio" name="admin" value='admin' onChange={(e)=>setAdmin(e.target.value)} checked={admin==='admin'}  />
                        <label>NOT ADMIN</label>
                        <input type="radio" name="notAdmin" value='notAdmin' onChange={(e)=>setAdmin(e.target.value)} checked={admin==='notAdmin'} />
                        {
                            updating?
                            <div className="loader"></div>
                            :
                            <input type="submit" className="submit-buttons" value="CHANGE"  />
                        }
                        <p style={{color: 'green'}}><b>{updateSuccesMsg}</b></p>
                       
                    </div>
                </form>
            
                    <div className="form-box accounts">
                        <h3>ACCOUNT ID</h3>
                        <br />
                        <strong><p style={{color: 'red'}}>{accountID}</p></strong>
                        {
                            isReseting?
                            <div className="loader" ></div>
                            :
                            <center><button className="auth-buttons" onClick={resetAccount}>RESET</button></center>
                        }
                        <p style={{color: 'green'}}><b>{resetSuccesMsg}</b></p>
                        
                    </div>

                    <div className="form-box accounts">
                        <h3>DELETE STAFF</h3>
                        {
                            isDeletingStaff?
                            <div className="loader" ></div>
                            :
                            <center><button className="auth-buttons" onClick={deleteStaff}>DELETE</button></center>
                        }
                        <p style={{color: 'red'}}><b>{deleteStaffErrorMsg}</b></p>
                        
                    </div>
                        
                    

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