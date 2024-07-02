import React, {useState} from "react";
import "../styles/App.css"
import "../styles/Forms.css"
import "../styles/buttons.css"
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPopup, signInWithPhoneNumber, signOut } from "firebase/auth";
import { auth, staffCol, db } from "../App";
import { update_field } from "../functions/update_field";
import { useSelector } from 'react-redux';
import  { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrosoft, faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { get_doc_data } from "../functions/get_doc_data";
import { collection, query, where, getDocs } from "firebase/firestore";


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

    const signInWithGoogle =async () =>{
        setisLoading(true)
   
        const provider =new GoogleAuthProvider()
        signInWithPopup(auth, provider)
        .then(async (userCredentials) => {
    
            const staffs =query(collection(db, staffCol), where("accountID", "==", userCredentials.user.uid))

            const querySnapshotp = await getDocs(staffs);

            if(querySnapshotp.empty) {

                const updateAccountID = {
                    accountID: userCredentials.user.uid
                }
                await update_field(staffCol, regNo, updateAccountID)
                .then(()=>{
                    navigate('/home')
                })

            }else {
                await get_doc_data(staffCol, regNo)
                .then(async (staffData)=>{
                    if(staffData['accountID']=== userCredentials.user.uid) {
                        navigate('/home')
                    }else {
                      await  signOut(auth)
                        .then(()=>{
                           // navigate('/')
                           setisError(true)
                           setErrorMsg(t('incorrect account'))
                        })
                    }
                })

            }

        })
        .catch((error) =>{
            setisError(true)
            setErrorMsg(t('unknown'))
            // signOut(auth).then(()=>{
            //     navigate('/verfyID')
            // })
            
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
