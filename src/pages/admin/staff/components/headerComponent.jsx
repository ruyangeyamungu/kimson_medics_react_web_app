import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../../../App";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import logo from "../../../../assets/images/logo.png"


const StaffHeader=({color, mAccColor, mPcolor, rColor, regNo}) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
   const navigate =useNavigate()

    function logOut() {
        signOut(auth).then(() => {
            navigate('/')
        })
    }

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    function openDrawer() {
        setOpen(!open)
    }
    
    function toDashBoard() {
        navigate('/admin')
     }

    const toDetails= () =>{

        navigate('/staff-det?id='+ encodeURIComponent(regNo))
        
    }
    const toManagePersonalInfo= () =>{
        navigate('/manage-info?id='+ encodeURIComponent(regNo))
    }
    const toManageAccount= () =>{
        navigate('/manage-account?id='+ encodeURIComponent(regNo))
    }
    const toStaffReport= () =>{
        navigate('/staff-report0?id='+ encodeURIComponent(regNo))
    }

    
    return(
        <>
            <div className="top-header">
                
            </div>
            <div className="header" >
                <div className="app-desc">
                    <FontAwesomeIcon icon={faBars} className="drawer-button" style={{paddingTop: "20px"}} onClick={openDrawer} />
                    <div className="logo-and-title">
                        <img src={logo} alt="logo" width="30px" />
                        <h3>{t('appTitle')}</h3>
                    </div>
                </div>
                <div className="navLinks">
                    <a style={{fontWeight: "bolder"}} onClick={toDashBoard}>{t('dashBoard')}</a>
                    <a style={{color: color}} onClick={toDetails}>DETAILS</a>
                    <a style={{color: mPcolor}} onClick={toManagePersonalInfo}>MANAGE PERSONAL INFO</a>
                    <a style={{color: mAccColor}} onClick={toManageAccount} >MANAGE ACCOUNT</a>
                    <a style={{color: rColor}} onClick={toStaffReport} >GET REPORTS</a>
                </div>
                <div className="navButtons">
                    <button onClick={()=>changeLanguage('en')}>{t('englishBtn')}</button>
                    <button onClick={() =>changeLanguage('sw')}>{t('swahiliBtn')}</button>
                    <button style={{color: 'red'}} onClick={logOut}>{t('logout')}</button>
                </div>
            </div>

            <div className={`admin-drawer ${open ? 'open' : ''}`}>
                <center><FontAwesomeIcon icon={faClose} style={{fontSize: "20px", marginBottom: "10px", color: "black"}} onClick={openDrawer} /></center>
            <div className="form-box">
                <a style={{fontWeight: "bolder"}} onClick={toDashBoard}>{t('dashBoard')}</a>
                <br /><br />
                <a style={{color: color}} onClick={toDetails}>DETAILS</a>
                <br /><br />
                <a style={{color: mPcolor}} onClick={toManagePersonalInfo}>MANAGE PERSONAL INFO</a>
                <br /><br />
                <a style={{color: mAccColor}} onClick={toManageAccount} >MANAGE ACCOUNT</a>
                <br /><br />
                <a style={{color: rColor}} onClick={toStaffReport} >GET REPORTS</a>
               
            </div>
            <div className="form-box">
                <div className="navButtons">
                    <button onClick={()=>changeLanguage('en')}>{t('englishBtn')}</button>
                    <button onClick={() =>changeLanguage('sw')}>{t('swahiliBtn')}</button>
                    <button style={{color: 'red'}} onClick={logOut}>{t('logout')}</button>
                </div>
            </div>
        </div>

    </>

    )
}

export default StaffHeader