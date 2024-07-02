import "./styles/App.css"
import { onAuthStateChanged, signOut } from "firebase/auth"
import React from "react"
import { auth, staffCol } from "./App";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/images/logo.png"
import { useSelector } from "react-redux";



const AppInit =  ()=>{
    const navigate =useNavigate()
    const regNo = useSelector(state => state.regNo);

    

    if(regNo === null) {
        signOut(auth)
    }


    function checkAuthStatus() {
        onAuthStateChanged(auth,user =>{
            if(user==null) {
                navigate('/verfyID')
            } else {
                navigate('/home')
            }
        } )
    }
    
    setTimeout(checkAuthStatus, 3000)


    return(
        <div className="logo-box"> 
             <img src={logo} alt="logo" style={{maxWidth: '50%'}} />

        </div>
       
    )
}

export default AppInit