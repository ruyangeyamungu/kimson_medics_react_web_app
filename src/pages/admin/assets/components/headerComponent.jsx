import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from 'react-i18next';
import { signOut } from "firebase/auth";
import logo from "../../../../assets/images/logo.png"
import { auth } from "../../../../App";


const AssetHeader=({color, adColor,rColor, mcolor, id}) => {
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

    const toDetails= () =>{
        navigate('/asset-det?id='+ encodeURIComponent(id))
    }
    const toManage= () =>{
        navigate('/asset-manage?id='+ encodeURIComponent(id))
    }
    const toAddStock= () =>{
        navigate('/add-stock?id='+ encodeURIComponent(id))
    }
    const toReport= () =>{
        navigate('/asset-report?id='+ encodeURIComponent(id))
    }
    function toDashBoard() {
        navigate('/admin')
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
                    <a style={{color: mcolor}} onClick={toManage}>MANAGE</a>
                    <a style={{color: adColor}} onClick={toAddStock} >ADD STOCK</a>
                    <a style={{color: rColor}} onClick={toReport}>GET REPORT</a>
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
                <a style={{color: mcolor}} onClick={toManage}>MANAGE</a>
                <br /><br />
                <a style={{color: adColor}} onClick={toAddStock} >ADD STOCK</a>
                <br /><br />
                <a style={{color: rColor}} onClick={toReport}>GET REPORT</a>
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

export default AssetHeader