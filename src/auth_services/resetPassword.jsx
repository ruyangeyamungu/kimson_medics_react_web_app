import "../styles/Forms.css"
import "../styles/App.css"
import React, { useState, useRef, useEffect } from "react";
import { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { useTranslation } from 'react-i18next';
import { get_doc_data } from "../functions/get_doc_data";
import { useSelector } from 'react-redux';
import Loader from "../loader/Loader";
import { staffCol, auth } from "../App";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ResetPassword =() =>{
    const[loader, setLoader] =useState(true);
    const[loading, setLoading] =useState(false)
    const[isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState()
    const [emailSentMsg, setEmailSentMsg] =useState()
    const regNo = useSelector(state => state.regNo);
    const { t, i18n } = useTranslation();
    const [email, setEmail] =useState()
    const navigate =useNavigate()
    const lineRef =useRef()
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(async () => {
        const staffData = await get_doc_data(staffCol, regNo)
        setEmail(staffData['email'])
        
        setLoader(false)
        
      }, []);

    if(regNo === null || regNo === undefined || regNo === " "){
        navigate('/verfyID')
    }

    // get user email


    if (loader) {
        return <Loader />;
      }
    
    
    async function passwordReset() {
        setLoading(true)

        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSentMsg(t('emailSentMsg'))
            setTimeout(() => {
                setLoading(false)
            }, 30000);
            
            
          } catch (error) {
            setLoading(false)
            setisError(true)
            setErrorMsg(t('unknown'));
            lineRef.current.scrollIntoView({ behavior: "smooth" });
          }
   
    }

    function hideErrorBox() {
        setisError(false)
    }

    return(
        <>

            <div className="section">
            
            <StaffIDAndNames />
           
            <div className="form-box">
                <hr id="line" ref={lineRef} />
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
                <h3>{t('email')} <span style={{color: 'blue'}}><i>{email}</i></span></h3>
                <br/>
                <p><strong style={{color: "green"}}>{emailSentMsg}</strong></p>

                <br/>
                {
                    loading?
                    <div className="loader"></div>
                    :
                    <button className="submit-buttons" onClick={passwordReset}>{t('resetPassword')}</button>
                }
                
            </div>
        </div>
        </>
    )
}

export default ResetPassword