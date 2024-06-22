import React, { useEffect, useState } from "react"
import StaffHeader from "./components/headerComponent"
import { get_doc_data } from "../../../functions/get_doc_data"
import { staffCol } from "../../../App"
import { StaffList } from "./components/staffList"
import { SelectedStaff } from "./components/selectedStaff"
import Loader from "../../../loader/Loader"
import { useLocation } from 'react-router-dom';

const Details=() => {
    const[fname, setfname] =useState()
    const[lname, setlname] =useState()
    const[mname, setmname] =useState()
    const[date, setDate] =useState()
    const[admin, setAdmin] =useState()
    const[regNo, setRegNo] =useState()
    const[pictureUrl, setPictureUrl] =useState()
    const [certificateUrl, setCertificateUrl] =useState()
    const [accType, setAccType] =useState()
    const [loading, setLoading] =useState(true)
    const queryID = new URLSearchParams(useLocation().search);
    const REGNO = queryID.get('id');

    useEffect(()=>{
        get_doc_data(staffCol,REGNO)
        .then((staff)=>{
            setfname(staff['fname'])
            setmname(staff['mname'])
            setlname(staff['lname'])
            setDate(staff['dateRegistered'])
            setAdmin(staff['adminRegNo'])
            setPictureUrl(staff['staffImage'])
            setCertificateUrl(staff['certificate'])
            if(staff['isAdmin']===true) {
                setAccType('ADMIN')
            }else{
                setAccType('NOT ADMIN')
            }
            setLoading(false)
        })
    },[])

    if(loading) {
        return <Loader />
    }

    return(
        <>
        
            <StaffHeader color="blue" regNo={REGNO}/>

            <section>
            <div className="links">
                <SelectedStaff selectedID={REGNO}/>
            </div>
            <div className="contents-1">
                <div className="form-box">
                    <h4>REGISTRATION NUMBER</h4>
                    <p style={{color: "blue"}}><strong>{REGNO}</strong></p>
                    <hr /><br />
                    <h4>FIRST NAME</h4>
                    <p>{fname}</p>
                    <br />
                    <h4>MIDDLE NAME</h4>
                    <p>{mname}</p>
                    <br />
                    <h4>LAST NAME</h4>
                    <p>{lname}</p>
                </div>
                <div className="form-box">
                   
                    <h4>DATE REGISTERED</h4>
                    <p>{date}</p>
                    <br />
                    <h4>REGISTERED BY no: </h4>
                    <p>{admin}</p>
                    <h4>REGISTERED BY name: </h4>
                    <b><p>----------------</p></b>
                </div>
                <div className="form-box">
                   
                   <h4>CERTIFICATE</h4>
                   <div>
                    <img src={certificateUrl} alt="certificate" style={{ maxWidth: '300px', marginTop: '10px' }} />
                    </div>
                   <h4>PICTURE: </h4>
                   <div>
                    <img src={pictureUrl} alt="picture" style={{ maxWidth: '300px', marginTop: '10px' }} />
                    </div>
                   

               </div>
               <div className="form-box">
                   
                   <h4>{accType}</h4>

               </div>
            </div>


            <div className="staff-list-box">
                <h3>STAFF LIST</h3>
                <StaffList />
            </div>
        </section>
        <div className="footer">
            ikjiuunk
        </div>
        </>
    )
}

export default Details