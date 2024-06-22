import "../styles/App.css"
import React from "react"
import logo from "../assets/images/logo.png"


const Loader =  ()=>{

    return(
        <div className="logo-box"> 
             <img src={logo} alt="logo" style={{maxWidth: '50%'}} />
             <br /><br />
             <center><div class="loader-page"></div></center>
        </div>
    )
}

export default Loader


