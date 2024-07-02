import React, { useEffect, useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { staffCol, storage, db, auth } from "../../../App";
import { v4 as uuidv4 } from 'uuid';
import { check_existance } from "../../../functions/check_existance";
import { doc, setDoc, query, orderBy, onSnapshot, collection } from "firebase/firestore";
import  { useSelector  } from "react-redux";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../../../styles/loaders.css"
import { Button } from "rsuite";
import { AdminHeader } from "../components/header";
import { StaffList } from "./components/staffList";
import Loader from "../../../loader/Loader";


const Staff =()=>{

    const [staffList, setStaffList] =useState([])
    const [certificateFile, setCertificateFile] = useState()
    const [certificateDownloadingUrl, setCertificateDownloadingUrl] =useState(null)
    const [progress, setProgress] = useState(0);
    const [preview, setPreview] = useState(null);
    const [certificateAttachmentError, setCertificateAttachmentError] =useState("")
    const [isUploading, setIsUploading] =useState(false)
    const [certificateUploadError, setCertificateUploadError] =useState('')
    const [staffImageFile, setStaffImageFile] = useState()
    const [staffImageDownloadingUrl, setStaffImageDownloadingUrl] =useState(null)
    const [staffImageAttachmentError, setStaffImageAttachmentError] =useState("")
    const [previewStaffImage, setPreviewStaffImage] = useState(null);
    const [isUploadingStaffImage, setIsUploadingStaffImage] =useState(false)
    const [staffImageProgress, setStaffImageProgress] = useState(0);
    const [staffImageUploadError, setStaffImageUploadError] =useState('')
    const adminRegNo = useSelector(state => state.regNo);
    const navigate =useNavigate()
    const[isloadingToRegister, setIsloadingToRegister] = useState(false)
    const [succesMessage, setSuccessMessage] =useState('')
    const [errorMessage, setErrorMessage] =useState('')
    const [loader, setLoader] =useState(true)
    const staffNames = useSelector(state => state.names);

    const [fname, setfname] =useState('')
    const [mname, setmname] =useState('')
    const [lname, setlname] =useState('')
    const [accountType, setAccountType] = useState('notAdmin');
    

    useEffect(() => {
          
      const q = query(collection(db, staffCol)); 

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const staffs = querySnapshot.docs.map((doc) => (
        {
        id: doc.id,
        ...doc.data()
      }));
      setStaffList(staffs)
      setLoader(false)
         
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

    async function registerStaff(event) {
        event.preventDefault();

        setErrorMessage('')
        setSuccessMessage('')
        
        if(navigator.onLine) {

              setIsloadingToRegister(true)
              // register user
              // create reg no.
              const regNo =  "KMS"+Math.floor(Math.random() * 9000);
              const isregNoExists = await check_existance(staffCol, regNo) 
            //  if(isregNoExists) return
                  if(validateTextInput(fname)===true && validateTextInput(mname) ===true &&
                   validateTextInput(lname)===true  && adminRegNo !== null && adminRegNo !== undefined && adminRegNo !== '',
                    certificateDownloadingUrl !==null && staffImageDownloadingUrl !==null) {
                        const staffData = {
                          'fname': fname,
                          'mname': mname,
                          'lname': lname,
                          'staffImage': staffImageDownloadingUrl,
                          'certificate': certificateDownloadingUrl,
                          'dateRegistered': Date(),
                          'email': null,
                          'accType': accountType,
                          'adminRegNo': regNo,
                          'adminName': staffNames,
                          'accountID':null,
                          "staffID": regNo
                        }
                        try {
                          await setDoc(doc(db, 'STAFF', regNo), staffData)
                          setSuccessMessage('registered successfully. Reg No:  '+regNo)
                          setfname('')
                          setmname('')
                          setlname('')
                          setCertificateFile()
                          setStaffImageFile()
                          setCertificateDownloadingUrl(null)
                          setStaffImageDownloadingUrl(null)
                          setPreviewStaffImage(null)
                          setPreview(null)
                          setIsloadingToRegister(false)

                        }catch(error) {
                          setErrorMessage('something went wrong try, again or refresh page');
                          setIsloadingToRegister(false)
                        }
                        
                   }else {
                      setErrorMessage('something went wrong try again');
                      setIsloadingToRegister(false)
                   }

        }else {
            setErrorMessage('no internet');
        }


        // if(validateTextInput(fname.trim())===false) {
        //     setErrorMessage('incorrect first name, name should only have a-z,A-Z letters');
        //     setIsloadingToRegister(false)
            
        // }
        // if(validateTextInput(mname.trim())===false) {
        //   setErrorMessage('incorrect middle name, name should only have a-z,A-Z letters');
        // }
        // if(validateTextInput(lname.trim())=== false) {
        //   setErrorMessage('incorrect last name, name should only have a-z,A-Z letters');
        // }

        if(certificateDownloadingUrl===null) {
        setErrorMessage('attach and upload certififcate first');
        
        }

        if(staffImageDownloadingUrl===null) {
        setErrorMessage('attach and upload staff image first');
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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setCertificateDownloadingUrl(downloadURL);

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
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setStaffImageDownloadingUrl(downloadURL);

            });
          }
        );
      };

      function validateTextInput(inputText) {
        var pattern = /^[A-Za-z]*$/;
        return pattern.test(inputText);
    }

    if(adminRegNo ===null || adminRegNo === undefined || adminRegNo=== '') {
      setTimeout(() => {
        signOut(auth).then(()=>navigate('/'))
      }, 3000);

    }

    if(loader) {
        return(
          <Loader />
        )
    }

    return (
        <>
        <AdminHeader />
          
            <section>
            <div className="contents-1">
                <h3 className="registration-title">STAFF REGISTRATION</h3>
                <form onSubmit={registerStaff}>
                <div className="form-box personal-info">
                    <label for='fname' >first name</label>
                    <input type="text" name="fname" value={fname} onChange={(e)=>setfname(e.target.value)} maxLength={20} required />
                    <label for='mname' >middle name</label>
                    <input type="text" name="mname" value={mname} onChange={(e)=>setmname(e.target.value)} maxLength={20}  />
                    <label for='lname' >last name</label>
                    <input type="text" name="lname" value={lname} onChange={(e)=>setlname(e.target.value)} maxLength={20} required />
                </div>

                <div className="form-box attachment">
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
                   
                </div>
                <div className="form-box accounts">
                    <label> NOT ADMIN</label>
                    <input type="radio" name="admin" value='notAdmin'  onChange={(e)=>setAccountType(e.target.value)} defaultChecked/>
                    <label>ADMIN</label>
                    <input type="radio" name="admin" value= 'admin'  onChange={(e)=>setAccountType(e.target.value)} />
                </div>
                <div className="form-box ">
                  {
                    isloadingToRegister?
                    <div>
                      <div className="loader" ></div>
                      
                    </div>
                    
                    :
                    <input type="submit" className="submit-buttons"  value="REGISTER" />
                  }
                  <h4 style={{color: 'green'}}><strong>{succesMessage}</strong></h4>

                  <p style={{color: 'red'}}><b>{errorMessage}</b></p>
                
                </div>
                </form>
            </div>

            <div className="items-list-container">
              <StaffList />
            </div>

        </section>
      
        </>
    )
    
}

export default Staff
