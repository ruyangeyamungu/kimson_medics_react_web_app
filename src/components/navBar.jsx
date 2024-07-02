import React, {useState, useEffect} from "react";
import { signOut } from "firebase/auth";
import { auth, staffCol, db } from "../App";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faBars, faClose, faDoorOpen, faFlag,  faSearch } from "@fortawesome/free-solid-svg-icons";
import { StaffIDAndNames } from "../components/StaffRegNoAndNames";
import { useTranslation } from 'react-i18next';
import logo  from "../assets/images/logo.png";
import { useSelector } from "react-redux";
import { doc, query, onSnapshot } from "firebase/firestore";


        
export function NavBar({onSearch, Hcolor, Pcolor, Scolor, sTcolor, aColor}) {

    const [open, setOpen] = useState(false);
    const [Popen, setPopen] = useState(false);
    const [isSearch, setIsSearch] =useState(false);
    const [isLogingOut, setLogingOut] =useState(false)
    const { t, i18n } = useTranslation();
    const navigate =useNavigate()
    const regNo = useSelector(state => state.regNo);
    const staffNames = useSelector(state => state.names);
    const [isAdmin, setIsAdmin] =useState(false)

    useEffect(() => {
        // Reference to the specific document
        const staffRef = doc(db, staffCol, regNo);

        // Listen for real-time updates
        const unsubscribe = onSnapshot(staffRef, (staff) => {
          if (staff.data()['accType'] === 'admin') {
            setIsAdmin(true)
        
          } else {
             setIsAdmin(false)
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
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

    function toStockRegister() {
        navigate('/register')
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
                <img src={logo} alt="logo" style={{maxWidth: "80%"}} />
            </div>
            <div className="app-title">
                <h5 style={{color: "blue"}}>{t('appTitle')}</h5>
            </div>
            <div className="nav-links">
                <a onClick={toHomeReg} style={{color: Hcolor}}>{t('home')}</a>
                <a onClick={toStaffReport} style={{color: Pcolor}}>{t('privateInfo')}</a>
                <a onClick={toStock} style={{color: Scolor}}>{t('stock')}</a>
                {/* <a style={{color: sTcolor}}>{t('settings')}</a> */}
                <a style={{color: aColor}}  onClick={toStockRegister}>{t('asset').toUpperCase()}</a>

                {
                    isAdmin?
                    <a onClick={toAdmin} >{t('adminSection')}</a>
                    :
                    <p></p>
                }
                
            </div>
            {/* <StaffIDAndNames /> */}
            <div className="staff-details">
               
                <h5>{staffNames}</h5>
                <h4 style={{color: "blue"}}>{regNo}</h4> 
                
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
                    <b><li onClick={toStock} style={{color: Scolor}}>{t('stock')}</li></b>
                    <hr style={{marginBottom: "10px"}}/>
                    {/* <b><li>{t('settings')}</li></b> */}
                    <b><li onClick={toStockRegister} style={{color: aColor}}>{t('asset').toUpperCase()}</li></b>
                </ul>
            </div>
             {
                isAdmin?
                <div className="form-box  admin-staff">
                    <strong><a onClick={toAdmin} >{t('adminSection')}</a></strong>
                </div>
                :
                <p></p>
             }

            </div>
        </>

    )
}