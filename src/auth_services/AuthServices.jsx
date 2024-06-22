import React, {useState} from "react";
import "../styles/App.css"
import "../styles/Forms.css"
import "../styles/buttons.css"
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, signOut } from "firebase/auth";
import { auth, staffCol } from "../App";
import { update_field } from "../functions/update_field";
import { useSelector } from 'react-redux';
import  { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrosoft, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { get_doc_data } from "../functions/get_doc_data";


const AuthServices =() =>{
    const navigate =useNavigate()

    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState('...')
    const regNo = useSelector(state => state.regNo);
    const { t, i18n } = useTranslation();

    if(regNo === null || regNo === undefined || regNo === " "){
        navigate('/verfyID')
    }

    const signWithEmailAndPassowrd =() =>{
        navigate('/signIn')
    }

    const createAccount =() =>{
        navigate('/signUp')
    }
    const refresh =() =>{
        window.location.reload()
    }

    const phoneInputPage=() =>{
        navigate("/phoneInput")
    }

    const signInWithGoogle =() =>{
        setisLoading(true)

       const provider =new GoogleAuthProvider()
        signInWithPopup(auth, provider).then(async (userCredentials) =>{
            const user =userCredentials.user;
             await get_doc_data(staffCol, regNo)
             .then(async (staffCredentials)=>{
                 if(staffCredentials['accountID'] === user.uid || staffCredentials['accountID']===null  ) {

                    const updateData = {
                        accountID: user.uid
                    }
                    await update_field(staffCol, regNo, updateData)
                    navigate('/home')
                 } else {

                    signOut(auth).then(()=>{
                        navigate('/verfyID')
                    })
                 }
                
             })

        }).catch((error) =>{
            setisError(true)
            setErrorMsg(t('unknown'))

        })

    }


    return(
     <>
        <div className="section" style={{top: "7px",}}>
        <StaffIDAndNames />

        {
            isLoading?
            <div className="form-box">

            <h3 style={{color: 'red'}}>{errorMsg}</h3>

            {
                isError?
                <button className="submit-buttons" onClick={refresh}>{t('tryAgain')}</button>
                :
                <div className="loader" id="loader"></div>
            }
        </div>
        :
            <div className="form-box">
                <center><h2>{t('signInOptions')}</h2></center>
                <center><button className="auth-buttons" onClick={signWithEmailAndPassowrd}>{t('emailOrRegNoSignIn')}</button></center>

                <center><button className="auth-buttons" onClick={signInWithGoogle}>
                    <FontAwesomeIcon icon={faGoogle} style={{ marginRight: '8px', color: 'red' }} />
                    {t('googleSignIn')}
                </button></center>
                {/* <center><button className="auth-buttons">
                    <FontAwesomeIcon icon={faApple} style={{ marginRight: '8px',color: 'black' }} />
                    Sign in with AppleID
                </button></center>
                <center><button className="auth-buttons">
                    <FontAwesomeIcon icon={faMicrosoft} style={{ marginRight: '8px', color:'blue' }} />
                    Sign in with Microsoft
                </button></center>

                <center><button className="auth-buttons" onClick={phoneInputPage}>
                    <FontAwesomeIcon icon={faPhone} style={{ marginRight: '8px', color: 'grey' }} />
                    Sign in with Phone number
                </button></center> */}
                <hr />
                <button className="submit-buttons" onClick={createAccount}>{t('createAccount')}</button>
            </div>

        }
        </div>
    </>

    )
}

export default AuthServices
