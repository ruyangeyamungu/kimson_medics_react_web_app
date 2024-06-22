import "./styles/App.css"
import { onAuthStateChanged } from "firebase/auth"
import React from "react"
import { auth, staffCol } from "./App";
import { useNavigate } from "react-router-dom";
import logo from "../src/assets/images/logo.png"


const AppInit =  ()=>{
    const navigate =useNavigate()

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