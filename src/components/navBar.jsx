import React, {useState} from "react";
import { signOut } from "firebase/auth";
import { auth } from "../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars, faClose, faDoorOpen, faFlag,  faSearch } from "@fortawesome/free-solid-svg-icons";
import { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { useTranslation } from 'react-i18next';
import logo  from "../assets/images/logo.png";


        
export function NavBar({onSearch, Hcolor, Pcolor, Scolor, sTcolor}) {

    const [open, setOpen] = useState(false);
    const [Popen, setPopen] = useState(false);
    const [isSearch, setIsSearch] =useState(false);
    const [isLogingOut, setLogingOut] =useState(false)
    const { t, i18n } = useTranslation();
    const navigate =useNavigate()

    const handleSearch =(e) => {
       onSearch(e.target.value)
    }

    function logOut() {
        setLogingOut(true)
        signOut(auth).then(()=>{
            navigate('/')
        })
    }

    function openDrawer() {
         setOpen(!open)
    }

    function togglePrivateInfoMenu() {
        setPopen(!Popen)
   }

   function toggleSearch() {
    setIsSearch(!isSearch)
    onSearch("")
    
   }

   const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  function toAssetReg() {
    navigate("/assetReg")
    
  }
  function toHomeReg() {
    navigate("/home")
  }
  function toStaffReport() {
    navigate("/staff-report")
  }
  function toStock() {
    navigate("/stock")
  }


  function toAdmin() {
    navigate("/admin")
  }

    return(
        <>

          <div className="navBar">
            {/* for mobile phones and small tablets*/}
            <div className="app-side-menu-icon">
                <FontAwesomeIcon icon={faBars} onClick={openDrawer} />
            </div>
            {/*-------------*/}

            {/* for larger screens */}
            <div className="app-logo">
                <img src={logo} alt="logo" style={{maxWidth: "100%"}} />
            </div>
            <div className="app-title">
                <h5>{t('appTitle')}</h5>
            </div>
            <div className="nav-links">
                <a onClick={toHomeReg} style={{color: Hcolor}}>{t('home')}</a>
                <a onClick={toStaffReport} style={{color: Pcolor}}>{t('privateInfo')}</a>
                <a onClick={toStock} style={{color: Scolor}}>{t('stock')}</a>
                <a style={{color: sTcolor}}>{t('settings')}</a>
                <a onClick={toAdmin} >{t('adminSection')}</a>
            </div>
            <div className="staff-details">
                <h5>RUYANGE YAMUNGU MUSTAFA</h5>
                <p>KMS3460</p>
                
            </div>
 
            <div className="lang-box">
                {
                    isSearch?
                    <input type="search"
                     onChange={handleSearch}
                     placeholder={t('searchPlc')} 
                     style={{width: '100%', padding: "5px"}}/>
                    :
                    <div>
                        <button className="enBtn" onClick={()=>changeLanguage('en')}>{t('englishBtn')}</button>
                        <button className="swBtn" onClick={() =>changeLanguage('sw')}>{t('swahiliBtn')}</button>
                    
                    </div>

                }

            </div>
            <div className="icon-box">
                {
                    isSearch?
                    <FontAwesomeIcon icon={faFlag} className="searchIcon" onClick={toggleSearch} />
                    :
                    <FontAwesomeIcon icon={faSearch} className="searchIcon" onClick={toggleSearch} />

                }

                {
                    isLogingOut?
                    <div className="loader"></div>
                    :
                    <FontAwesomeIcon icon={faDoorOpen}  color="red" onClick={logOut}/>
                }

            </div>
          </div>

          {/* drawer with link*/}
          <div className={`drawer ${open ? 'open' : ''}`} >
            <button onClick={openDrawer}>
                <FontAwesomeIcon icon={faClose} />
            </button>
            <hr />
            <StaffIDAndNames />

            <div className="form-box  normal-staff">
                <ul>
                    <b><li onClick={toHomeReg} style={{color: Hcolor}}>{t('home')}</li></b>
                    <hr style={{marginBottom: "10px"}}/>
                    <b><li onClick={toStaffReport} style={{color: Pcolor}}>{t('privateInfo')}</li></b>
                    <hr style={{marginBottom: "10px"}}/>
                      {/* <ul className={`sub-menus ${Popen ? 'p-open' : ''}`}>
                        <li onClick={toStaffReport}>{t('all')}</li>
                        <li>{t('asset')}</li>
                        <li>{t('date')}</li>
                      </ul> */}

                    <b><li onClick={toStock} style={{color: Scolor}}>{t('stock')}</li></b>
                    <hr style={{marginBottom: "10px"}}/>
                    <b><li>{t('settings')}</li></b>
                </ul>
            </div>
            <div className="form-box  admin-staff">
                <h2>{t('adminSection')}</h2>
                <hr />
                <ul>
                    <li>{t('registration')}</li>
                        <ul>
                            <li >{t('staff').toLowerCase()}</li>
                            <li onClick={toAssetReg} >{t('asset')}</li>    
                        </ul>
                    <li>{t('stock')}</li>
                    <li>{t('staff').toUpperCase()}</li>
                    <li>{t('pharmacyReport')}</li>
                </ul>
            </div>
            </div>
        </>

    )
}