import React, {useRef, useState} from "react";
import "../styles/App.css";
import "../styles/Forms.css";
import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, staffCol } from "../App";
import { update_field } from "../functions/update_field";
import  { StaffIDAndNames }  from "../components/StaffRegNoAndNames";
import { useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { get_doc_data } from "../functions/get_doc_data";

const SignUp =() =>{
    const[email, setEmail] =useState()
    const[passOne, setPassOne] =useState()
    const[passTwo, setPassTwo] =useState()
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState(false)
    const navigate =useNavigate()
    const lineRef =useRef()
    const regNo = useSelector(state => state.regNo);
    const { t, i18n } = useTranslation();


    const handleSignUpWithEmailAndPassword =  async (event) => {
        event.preventDefault();

        if(passOne == passTwo) {
            setisLoading(true)
            // sign up
            
            // check if user has an account
           const staffData = await get_doc_data(staffCol, regNo)
           if(staffData['accountID'] == null) {

               creatAccount()

           }else {
            setisLoading(false)
            setisError(true)
            setErrorMsg(t('staffHasAcc'))
            lineRef.current.scrollIntoView({ behavior: "smooth" });
           }

        }else {
            setisError(true)
            lineRef.current.scrollIntoView({ behavior: "smooth" });
            setErrorMsg(t('incorrectPasswordMatch'))
          

        }
        
    }
    
    function creatAccount() {
        createUserWithEmailAndPassword(auth, email, passOne)
        .then(async (userCredentials)=>{
            // updating staff accountID field
            const user =userCredentials.user;
            const data = {
                accountID: user.uid
            }
            await update_field(staffCol, regNo, data)

            // signing in user
                await signInWithEmailAndPassword(auth, email, passOne)
                .then(async ()=>{
                    navigate('/home')
                })
                .catch((error)=>{
                    navigate("/signIn")
                })
    
        }).catch((error)=> {
            setisLoading(false)
            setisError(true)
            var errorCode =error.code;
            switch (errorCode) {
                case 'auth/weak-password':
                    setErrorMsg(t('weekPassword'));
                    lineRef.current.scrollIntoView({ behavior: "smooth" });
                break;
                case 'auth/invalid-email':
                    setErrorMsg(t('invalidEmail'));
                    lineRef.current.scrollIntoView({ behavior: "smooth" });               
                    break;
                case 'auth/email-already-in-use':
                    setErrorMsg(t('emailInUse'));
                    lineRef.current.scrollIntoView({ behavior: "smooth" });
                    break
                case 'auth/network-request-failed':
                    setErrorMsg(t('noInternet'));
                    lineRef.current.scrollIntoView({ behavior: "smooth" });
                    break;
                default:
                    setErrorMsg(t('unknown'));
                    lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
        
        })
        
    }


    function hideErrorBox() {
        setisError(false)
    }

    const signIn =() =>{
        navigate('/signIn')
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
                            <strong>Error!</strong> <span id="errorMessage">{errorMsg}</span>
                        </div>
                        :
                        <div></div>
                    }

                    <center><h2>{t('createAccount')}</h2></center>
                    <p><strong style={{color: 'green'}}>{t('validEmailMsg')}</strong></p>
                    <form onSubmit={handleSignUpWithEmailAndPassword}>
                        <label for="email">{t('email')}</label>
                        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder={t('emailPlc')} required/>
                        <label for="password">{t('password')}</label>
                        <input type="password" value={passOne} onChange={(e)=>setPassOne(e.target.value)} placeholder={t('accPasswordPlc')} required/>
                        <label for="Cpassword">{t('confirmPassword')}</label>
                        <input type="password" value={passTwo} onChange={(e)=>setPassTwo(e.target.value)} placeholder={t('confirmPasswordPlc')} required/>
                        {
                            isLoading?
                            <div className="loader" id="loader"></div>
                            :
                            <input type="submit"  className="submit-buttons" value={t('continueBtn')} />
                        }
                    </form>
                    <p>{t('accQn')} <span><button    className="form-inText-buttons" onClick={signIn}>{t('signIn')}</button></span></p>
                </div>

            </div>

        </>
    )
}

export default SignUp