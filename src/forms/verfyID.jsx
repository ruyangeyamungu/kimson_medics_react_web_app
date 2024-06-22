import React,{useState, useRef} from "react";
import "../styles/App.css";
import "../styles/Forms.css";
import { useNavigate } from "react-router-dom";
import { check_existance } from "../functions/check_existance";
import { staffCol } from "../App";
import { useDispatch } from "react-redux";
import { setNames, setRegNo } from "../context/action";
import { get_doc_data } from "../functions/get_doc_data";
import { useTranslation } from 'react-i18next';



const VerfiyID =() =>{
    const[regNo, setregNo] =useState('');
    const navigate = useNavigate()
    const [isLoading, setisLoading] =useState(false)
    const [isError, setisError] =useState(false)
    const [errorMsg, setErrorMsg] =useState(false)
    const lineRef =useRef()
    const dispatch = useDispatch();
    const [staffNames, setStaffNames] =useState(null)
    const { t, i18n } = useTranslation();
    
    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };

    const handleStaffVerification  = async (event) =>{
        event.preventDefault();
        setisLoading(true)
        try {
            const isStaff = await check_existance(staffCol, regNo.toUpperCase().trim())
            if(isStaff) {
            dispatch(setRegNo(regNo.toUpperCase().trim()));

            //get staff names from staff collection
              const staff = await get_doc_data(staffCol, regNo.toUpperCase().trim())

            dispatch(setNames(staff['fname'].toUpperCase()+' '+staff['mname'].toUpperCase()+ ' '+staff['lname'].toUpperCase()))

              navigate('/authServices')
            }else{
                setisLoading(false)
                setisError(true)
                setErrorMsg(t('staffNotExists'))
                lineRef.current.scrollIntoView({ behavior: "smooth" });
            }
            
        } catch (error) {
            setisLoading(false)
            setisError(true)
            const errMsg = t('unknown')
            setErrorMsg(errMsg)
            lineRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }

    function hideErrorBox() {
        setisError(false)
    }

    return(
        <>
        <div className="section">
           <div className="form-box">
                <h3 style={{color: 'purple'}}>{t('lang')}</h3>

                <button className="lang-buttons" onClick={() =>changeLanguage('en')}>{t('englishBtn')}</button>
                <button className="lang-buttons" onClick={() =>changeLanguage('sw')}>{t('swahiliBtn')}</button>
           </div>
           
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

                <center><h2 style={{color: 'blue'}}>{t('appTitle')}</h2></center>
                <form onSubmit={handleStaffVerification}>
                    <label for="regNo">{t('lableForRegNo')}</label>
                    <input type="text" value={regNo.toUpperCase()} onChange={(e)=>setregNo(e.target.value)} style={{textTransform: 'capitalize'}} placeholder={t('InputRegNoPlaceHolder')} required/>
                    {
                        isLoading?
                        <div className="loader" id="loader"></div>
                        :
                        <input type="submit"  className="submit-buttons" value={t('continueBtn')} />
                    }

                </form>
            </div>
        </div>
        </>
    )
}

export default VerfiyID