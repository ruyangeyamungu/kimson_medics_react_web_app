import React, {useEffect, useState} from "react"
import { query, collection, onSnapshot, where } from "firebase/firestore"
import { staffCol, db } from "../../../App";
import { StaffList } from "./components/staffList";
import StaffHeader from "./components/headerComponent";
import { SelectedStaff } from "./components/selectedStaff";
import Loader from "../../../loader/Loader";
import { useLocation } from 'react-router-dom';

const ManagePersonalInfo =() => {
    const [staffCredentials, setStaffCredentials] =useState([])
    const [fname, setfname] =useState()
    const [mname, setmname] =useState('')
    const [lname, setlname] =useState()
    const [loading, setLoading] =useState(true)
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
        
            <StaffHeader mPcolor="blue" regNo={REGNO}/>

            <section>
            <div className="links">
                <SelectedStaff selectedID={REGNO}/>
            </div>
            <div className="contents-1">
                <div className="form-box">
                    {
                        staffCredentials.map(staff=>(
                            <form >
                            <div className="form-box personal-info">
                                <label for='fname' >first name</label>
                                <input type="text" name="fname" value={staff['fname']}
                                 onChange={(e)=>setfname(e.target.value)}
                                  maxLength={20} required />
                                <label for='mname' >middle name</label>
                                <input type="text" name="mname" value={staff['mname']} onChange={(e)=>setmname(e.target.value)} maxLength={20}  />
                                <label for='lname' >last name</label>
                                <input type="text" name="lname" value={staff['lname']} onChange={(e)=>setlname(e.target.value)} maxLength={20} required />
                            </div>
            
                            {/* <div className="form-box attachment">
                                <label for='certificate' >certificate</label>
                                <input type="file" onChange={handleChangeCertififcate} name="certificate" required />
                                {preview && (
                                <div>
                                <div>
                                <img src={preview} alt="Image Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
                                </div>
                                    {
                                        (isUploading)?
                                        <center><div class="uploading-loader"></div></center>
                                        :
                                        <button onClick={(e)=>handleUploadCertificate(e)}>Upload</button>
                                    }
                                    
            
                                    <p>{progress}</p>
                              
                                <p style={{color: "red", fontWeight: "bold"}}>{certificateUploadError}</p>
                                </div>
                                )}
                                <p style={{color: "red", fontWeight: "bold"}}>{certificateAttachmentError}</p>
                                
            
                                <label for='staffImage' >staff image</label>
                                 <input type="file" onChange={handleChangeStaffImage} name="staffImage" required />
                                {previewStaffImage && (
                                <div>
                                <div>
                                <img src={previewStaffImage} alt="Image Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
                                </div>
                                    {
                                        (isUploadingStaffImage)?
                                        <center><div class="uploading-loader"></div></center>
                                        :
                                        <button onClick={(e)=>handleUploadStaffImage(e)}>Upload</button>
                                    }
                                    
            
                                    <p>{staffImageProgress}</p>
                              
                                <p style={{color: "red", fontWeight: "bold"}}>{staffImageUploadError}</p>
                                </div>
                                )}
                                <p style={{color: "red", fontWeight: "bold"}}>{staffImageAttachmentError}</p>
                               
                            </div> */}
                            {/* <div className="form-box ">
                              {
                                isloadingToRegister?
                                <div>
                                  <div className="loader" ></div>
                                  
                                </div>
                                
                                :
                                <input type="submit" className="submit-buttons"  value="SAVE" />
                              }
                              <h4 style={{color: 'green'}}><strong>{succesMessage}</strong></h4>
            
                              <p style={{color: 'red'}}><b>{errorMessage}</b></p>
                            
                            </div> */}
                            </form>
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

export default ManagePersonalInfo