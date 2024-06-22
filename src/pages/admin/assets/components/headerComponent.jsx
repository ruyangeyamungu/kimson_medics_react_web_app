import React from "react";
import { useNavigate } from "react-router-dom";
import { NavBar } from "../../../../components/navBar";
import Position from "rsuite/esm/internals/Overlay/Position";

const AssetHeader=({color, adColor,rColor, mcolor, id}) => {
   const navigate =useNavigate()

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
    return(
        <>
           <div className="top-header">
                
           </div>
            <div className="header" >
                <a style={{color: color}} onClick={toDetails}>DETAILS</a>
                <a style={{color: mcolor}} onClick={toManage}>MANAGE</a>
                <a style={{color: adColor}} onClick={toAddStock} >ADD STOCK</a>
                <a style={{color: rColor}} onClick={toReport}>GET REPORT</a>
        </div>

        </>


    )
}

export default AssetHeader