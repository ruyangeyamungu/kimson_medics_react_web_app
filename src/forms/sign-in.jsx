import React,{useRef, useState} from "react";
import "../styles/App.css";
import "../styles/Forms.css";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, staffCol } from "../App";
import { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { useTranslation } from 'react-i18next';
import { get_doc_data } from "../functions/get_doc_data";
import { useSelector } from "react-redux";

const SignIn =() =>{
    const[uname, setuname] =useState();
    const[pCode, setpCode] =useState();
    const navigate = useNavigate()
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState(false)
    const lineRef =useRef()
    const { t, i18n } = useTranslation();
    const regNo = useSelector(state => state.regNo);

    if(regNo === null || regNo === undefined || regNo === "") {
        navigate('/verfyID')
    }

    // const staff =  get_doc_data(staffCol, regNo)
    // setuname(staff['email'])

    const handleSigningWithEmailAndPassword =async (event) =>{
        event.preventDefault();
        
        setisLoading(true)
        const staff = await get_doc_data(staffCol, regNo)

        if(staff['accountID'] === null) {
                setisLoading(false)
                setisError(true)
                setErrorMsg(t('staffAccStatus'))
        } else {

            signInWithEmailAndPassword(auth, uname, pCode)
            .then(async ()=>{
                
                onAuthStateChanged(auth, user =>{
                    
                      if (staff['accountID'] === user.uid) {
                            navigate('/home')
                      } else {
                        
                        signOut(auth).then(()=>{
                            navigate('/verfyID')
                        })
    
                      }         
                })
              
            }).catch((error)=>{
                var errorCode =error.code;
                setisLoading(false)
                setisError(true)
                // Customize error messages based on error code
                switch (errorCode) {
                    case 'auth/wrong-password':
                        setErrorMsg(t('invalidCredentials'));
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                        break;
                    case 'auth/invalid-credential':
                        setErrorMsg(t('invalidCredentials'));
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                    break;
                    case 'auth/invalid-email':
                        setErrorMsg(t('invalidEmail'));
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                    break;
                    case 'auth/network-request-failed':
                        setErrorMsg(t('noInternet'));
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                        break;
                    default:
                        setErrorMsg(t('unknown'));
                        lineRef.current.scrollIntoView({ behavior: "smooth" });
                }
                // Display error message to the
    
            });

        }



    }

    function hideErrorBox() {
        setisError(false)
    }

    const createAccount =() =>{
        navigate('/signUp')
    }
    
    function toForgotCredentials() {
        navigate('/reset-password')
    }

    return(
        <>
            <div className="section" style={{top: "10px"}}>
                <StaffIDAndNames />

                <div className="form-box">
                    <hr id="line" ref={lineRef}/>
                    <br />
                    {
                        isError?
                            <div className="alert">
                            <span className="closebtn" onClick={hideErrorBox}>&times;</span> 
                            <strong>{t('error')}</strong> <span id="errorMessage">{errorMsg}</span>
                        </div>
                        :
                        <div></div>
                    }

                    <center><h2>{t('signIn')}</h2></center>
                    <form onSubmit={handleSigningWithEmailAndPassword}>
                        <label for="emailOrRegNo">{t('email')}</label>
                        <input type="text" value={uname} onChange={(e)=>setuname(e.target.value)} placeholder={t('emailOrRegNoPlc')} required/>
                        <label for="password">{t('password')}</label>
                        <input type="password" value={pCode} onChange={(e) =>setpCode(e.target.value)} placeholder={t('passwordPlc')} required/>
                        {
                            isLoading?
                            <div className="loader" id="loader"></div>
                            :
                            <input type="submit"  className="submit-buttons" value={t('signIn')} />
                        }
                        
                    </form>
                    <p>{t('forgotPassAndEmailQnt')}<span><button    className="form-inText-buttons" onClick={toForgotCredentials}>{t('tapHere')}</button></span></p>
                    <p>{t('isAccQn')} <span><button    className="form-inText-buttons" onClick={createAccount}>{t('createAccount')}</button></span></p>
                </div>
            </div>
        
        </>
    )
}

export default SignIn