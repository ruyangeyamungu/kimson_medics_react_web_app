import React from "react";
import { useNavigate } from "react-router-dom";

const StaffHeader=({color, mAccColor, mPcolor, regNo}) => {
    
   const navigate =useNavigate()

    const toDetails= () =>{

        navigate('/staff-det?id='+ encodeURIComponent(regNo))
        
    }
    const toManagePersonalInfo= () =>{
        navigate('/manage-info?id='+ encodeURIComponent(regNo))
    }
    const toManageAccount= () =>{
        navigate('/manage-account?id='+ encodeURIComponent(regNo))
    }
    return(

        <div className="header" >
            <a style={{color: color}} onClick={toDetails}>DETAILS</a>
            <a style={{color: mPcolor}} onClick={toManagePersonalInfo}>MANAGE PERSONAL INFO</a>
            <a style={{color: mAccColor}} onClick={toManageAccount} >MANAGE ACCOUNT</a>
            <a>GET REPORTS</a>
        </div>

    )
}

export default StaffHeader