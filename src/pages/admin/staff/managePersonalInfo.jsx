import React, {useEffect, useState} from "react"
import {  onSnapshot, doc } from "firebase/firestore"
import { staffCol, db, storage } from "../../../App";
import { StaffList } from "./components/staffList";
import StaffHeader from "./components/headerComponent";
import { SelectedStaff } from "./components/selectedStaff";
import Loader from "../../../loader/Loader";
import { useLocation } from 'react-router-dom';
import { getStorage, ref, deleteObject,  uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { update_field } from "../../../functions/update_field";
import moment from "moment/moment";

const ManagePersonalInfo =() => {

    const [fname, setfname] =useState()
    const [mname, setmname] =useState('')
    const [lname, setlname] =useState()
    const [certificateUrl, setCertificateUrl] = useState()
    const [staffImageUrl, setStaffImageUrl] = useState()
    const [loading, setLoading] =useState(true)
    const queryID = new URLSearchParams(useLocation().search);
    const REGNO = queryID.get('id');
    const [certificateFile, setCertificateFile] = useState()
    const [certificateAttachmentError, setCertificateAttachmentError] =useState("")
    const [preview, setPreview] = useState(null);
    const [isUploading, setIsUploading] =useState(false)
    const [progress, setProgress] = useState(0);
    const [certificateUploadError, setCertificateUploadError] =useState('')
    const [staffImageFile, setStaffImageFile] = useState()
    const [staffImageAttachmentError, setStaffImageAttachmentError] =useState("")
    const [previewStaffImage, setPreviewStaffImage] = useState(null);
    const [isUploadingStaffImage, setIsUploadingStaffImage] =useState(false)
    const [staffImageProgress, setStaffImageProgress] = useState(0);
    const [staffImageUploadError, setStaffImageUploadError] =useState('')

    const[isloadingToRegister, setIsloadingToRegister] = useState(false)
    const [succesMessage, setSuccessMessage] =useState('')
    const [errorMessage, setErrorMessage] =useState('')
    
    const [newStaffImage, setNewStaffImage] =useState();

    useEffect(() => {
        // Reference to the specific document
        const staffRef = doc(db, staffCol, REGNO);
    
        // Listen for real-time updates
        const unsubscribe = onSnapshot(staffRef, (staff) => {
          if (staff.exists()) {
            setfname(staff.data()['fname']);
            setmname(staff.data()['mname']);
            setlname(staff.data()['lname']);
            setCertificateUrl(staff.data()['certificate'])
            setStaffImageUrl(staff.data()['staffImage'])

            setLoading(false)
           
          } else {
            console.log("Document does not exist!");
          }
        });
        
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);

    const handleUpdateStaffData =async (e) => {
        e.preventDefault()
        console.log("staff: ", staffImageUrl);
        console.log("certififcate: ", certificateUrl);
        if(staffImageUrl !== null && certificateUrl !== null) {

            setErrorMessage('')
            setSuccessMessage('')
            setIsloadingToRegister(true)
    
            const staffData = {
              fname: fname,
              mname: mname,
              lname: lname,
              certificate: certificateUrl,
              staffImage: staffImageUrl,
              lastAdminUpdateStaffData: REGNO,
              lastDateUpdateData: moment(new Date()).format("DD-MM-YYYY HH:MM:ss")
            }
    
            if(navigator.onLine) {
            await   update_field(staffCol, REGNO, staffData)
            setIsloadingToRegister(false)
            setSuccessMessage("successfull updated")
            }

        } else {
          setIsloadingToRegister(false)
          setErrorMessage('pleach upload certificate and staff image first')
         
        }



    }
    const handleChangeCertififcate = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          const fileType = selectedFile.type;
          if (fileType === "image/jpeg" || fileType === "image/jpg") {
            setCertificateFile(selectedFile);
            setCertificateAttachmentError("");
            const reader = new FileReader();
            reader.onloadend = () => {
            setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);

          } else {
            setCertificateFile(null);
            setCertificateAttachmentError("Please select a JPEG 0r JPG certificate image file.");
    
          }
        }
      };

    const handleUploadCertificate = (event) => {
        event.preventDefault();
        
        if (!certificateFile) return;

        setIsUploading(true)

        const uniqueName = `${certificateFile.name.split('.')[0]}_${uuidv4()}.${certificateFile.name.split('.').pop()}`;
        const storageRef = ref(storage, `images/${uniqueName}`);
        const uploadTask = uploadBytesResumable(storageRef, certificateFile);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
            setProgress(progress);
            
          },
          (error) => {
            setCertificateUploadError('upload faield try again')
            setIsUploading(false)
           
          },
          () => {
            deleteAttachment(certificateUrl)
            setCertificateUrl(null)
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setCertificateUrl(downloadURL)

            });
          }
        );
      };
    
    const handleChangeStaffImage = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          const fileType = selectedFile.type;
          if (fileType === "image/jpeg" || fileType === "image/jpg") {
            setStaffImageFile(selectedFile);
            setStaffImageAttachmentError("");
            const reader = new FileReader();
            reader.onloadend = () => {
            setPreviewStaffImage(reader.result);
            };
            reader.readAsDataURL(selectedFile);

          } else {
            setStaffImageFile(null);
            setStaffImageAttachmentError("Please select a JPEG 0r JPG certificate image file.");
    
          }
        }
      };
    
    const handleUploadStaffImage = (event) => {
        event.preventDefault();
        
        if (!staffImageFile) return;

        setIsUploadingStaffImage(true)

        const uniqueName = `${staffImageFile.name.split('.')[0]}_${uuidv4()}.${staffImageFile.name.split('.').pop()}`;
        const storageRef = ref(storage, `staffImage/${uniqueName}`);
        const uploadTask = uploadBytesResumable(storageRef, staffImageFile);
    
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          
            setStaffImageProgress(progress);
            
          },
          (error) => {
            setStaffImageUploadError('upload faield try again')
            setIsUploadingStaffImage(false)
           
          },
          () => {
            deleteAttachment(staffImageUrl)
            setStaffImageUrl(null)
            getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
              setStaffImageUrl(downloadURL)
            });
            
          }
        );
      }

    const deleteAttachment = async (Url) => {
        try {
          // Create a reference to the file to delete
          const storageRef = ref(storage, Url);
      
          // Delete the file
          await deleteObject(storageRef);

          console.log("objected deleted");
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      };

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
              <center>  <SelectedStaff selectedID={REGNO}/></center>
            </div>
            <div className="contents-1">
                
                <div className="form-box">
                <h3>UPDATE STAFF DETAILS</h3>
                    <form onSubmit={handleUpdateStaffData}>
                    <div className="form-box personal-info">
                        <label for='fname' >first name</label>
                            <input type="text" name="fname" 
                            value={fname}
                            onChange={(e)=>setfname(e.target.value)}
                            maxLength={20} required />
                        <label for='mname' >middle name</label>
                            <input type="text" name="mname" 
                            value={mname} 
                            onChange={(e)=>setmname(e.target.value)} 
                            maxLength={20}  />
                        <label for='lname' >last name</label>
                            <input type="text" name="lname" 
                            value={lname} 
                            onChange={(e)=>setlname(e.target.value)}
                            maxLength={20} required />
                    </div>
    
                    <div className="form-box attachment">
                        <label for='certificate' >certificate</label>
                            <input type="file" onChange={handleChangeCertififcate} name="certificate"  />
                            <br />
                            {/* certificate image*/}
                            {
                                preview==null?
                                <img src={certificateUrl} alt="certificate Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
                                :
                                <span></span>

                            }
                            
                            { 
                            preview && (
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
                            <br />
                            <hr />
                        
                        <label for='staffImage' >staff image</label>
                            <input type="file" onChange={handleChangeStaffImage} name="staffImage"  />
                            <br />
                            {
                                previewStaffImage==null?
                                /* staff image*/
                                <img src={staffImageUrl} alt="Image Preview" style={{ maxWidth: '300px', marginTop: '10px' }} />
                                :
                                previewStaffImage && (
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
                                )
                                
                            }
                            <p style={{color: "red", fontWeight: "bold"}}>{staffImageAttachmentError}</p>
                    
                    </div>
                    <div className="form-box ">
                        {
                        isloadingToRegister?
                        <div>
                            <div className="loader" ></div>
                            
                        </div>
                        
                        :
                        <input type="submit" className="submit-buttons"  value="UPDATE" />
                        }
                        <h4 style={{color: 'green'}}><strong>{succesMessage}</strong></h4>
    
                        <p style={{color: 'red'}}><b>{errorMessage}</b></p>
                    
                    </div>
                    </form>
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