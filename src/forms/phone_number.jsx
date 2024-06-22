import React, {useRef, useState} from "react";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input/mobile'
import "../styles/App.css"
import "../styles/Forms.css"
import { auth, staffCol } from "../App";
import { useNavigate } from "react-router-dom";
import { signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import { update_field} from "../functions/update_field";
import { useSelector } from 'react-redux';

export default function PhoneNumber(params) {
    const [phoneNo, setphoneNo] = useState()
    const [user, setUser] =useState(null)
    const [otpCode, setOtp] = useState(new Array(6).fill(""));
    const navigate =useNavigate()
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState('...')
    const errorRef =useRef()
    const [otpSent, setOtpSent] =useState(false)
    const [isLoadingInOtp, setisloadingInOtp] =useState(false)
    const [isErrorInOtp, setisErrorInOtp] =useState(false)
    const [errorMsgInOtp, setErrorMsgInOtp] =useState('...')
    const regNo = useSelector(state => state.regNo);
    const staffNames = useSelector(state => state.names);
   
    // otp input have only single digiti and shifts to next input automatically
    function handleChange(element, index) {
        if(isNaN(element.target.value)) return false
        setOtp([...otpCode.map((data, indx)=>indx == index?element.target.value:data)])
    
        if(element.target.value && element.target.nextSibling){
            element.target.nextSibling.focus()
          }
      }
    
    //otp send mechanism
    const sendOtpCode =async (event)=>{
      event.preventDefault();
    
        try {
            setisLoading('true')
            const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {})
            signInWithPhoneNumber(auth, phoneNo, recaptcha)
            .then((confirmationResults) =>{
               setUser(confirmationResults);
               setOtpSent(true)
                
            }).catch((error)=>{

                setisLoading(false)
                setisError(true)
                var errorCode =error.code

                switch (errorCode) {
                    case "auth/invalid-phone-number":
                    setErrorMsg('invalid phone number, refresh page and try again')
                //    errorRef.current.scrollIntoView({ behavior: "smooth" });
                        break;
                    default:
                        setErrorMsg('verfication code not sent ,refresh try again')
                  //      errorRef.current.scrollIntoView({ behavior: "smooth" });
                        break;
                }
            })

        } catch (error) {
            setisLoading(false)
            setisError(true)
            setErrorMsg('something went wrong,try again')
        }

    }

    // verify otp and sign in
    async function verfyOtp() {
        const[code1, code2,code3, code4, code5, code6 ] = otpCode
        const otp =code1+code2+code3+code4+code5+code6;
        try {
            await user.confirm(otp)
            .then(async (userCredentials)=>{
                const user =userCredentials.user;
                const data = {
                    accountID: user.uid
                }
                await update_field(staffCol, regNo, data)
                navigate('/home')
            })
            .catch((error)=>{
                setisloadingInOtp(false)
                setisErrorInOtp(true)
                var errorCode =error.code
                console.log(errorCode);
                switch (errorCode) {
                    case "auth/invalid-verification-code":
                        setErrorMsgInOtp('incorrect code number')
                        break;
                    default:
                        setErrorMsgInOtp('something went wrong, try again')
                        break;
                }
            })

        } catch (error) {
            setisloadingInOtp(false)
            setisErrorInOtp(true)
            setErrorMsgInOtp('something went wrong,try again')
        }

    }


    return(
        <>
            <div className="form-box">
                <h3>{staffNames}</h3>
                <h4 style={{color: 'blue'}}>{regNo.toUpperCase()}</h4>
            </div>

            {
                isError||isErrorInOtp?<center><button onClick={()=>window.location.reload()}>REFRESH PAGE</button></center>
                :<p></p>
            }

            

            {
                otpSent?

                //otp input error
                <><div className="form-box">
                        <h4 style={{ color: 'green' }}>A six digit verification has be sent to {phoneNo}, enter the code sent</h4>
                    </div><div>
                            <div className="otp-area">
                                {otpCode.map((data, index) => {
                                    return <input type="text"
                                        maxLength={1}
                                        value={data}
                                        onChange={(e) => handleChange(e, index)} />;
                                })}
                            </div>
                            {
                                isLoadingInOtp?
                                <div className="loader" id="loader"></div>
                                :
                                <center><button className="submit-buttons" onClick={verfyOtp}>SUBMIT OTP</button></center>
                            }
                            {
                                isErrorInOtp?
                               <center><h4 style={{color: 'red'}} >{errorMsgInOtp}</h4></center>
                                :
                                <span></span>
                            }
                            
                        </div></>
            :

            //phone input area
            <div className="form-box">
            <form onSubmit={sendOtpCode}>
                <PhoneInput
                    placeholder="Enter phone number"
                    value={phoneNo}
                    onChange={setphoneNo}
                    defaultCountry='TZ' 
                    required
                />
                {
                    isLoading?
                    <div className="loader" id="loader"></div>
                    :
                    <center><button className="submit-buttons">SEND OTP</button></center>
                }
                <span ref={errorRef}></span>
                {
                    isError?
                    <h4 style={{color: 'red'}} >{errorMsg}</h4>
                    :
                    <span></span>
                }
                <center><div id="recaptcha"></div></center>
            </form>
        </div>
                
            }

            {/* phone input are

                    {/* otp area*/}

        </>
    )
    
}