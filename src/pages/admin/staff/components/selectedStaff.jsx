import React, { useState, useEffect } from "react"
import { get_doc_data } from "../../../../functions/get_doc_data"
import { staffCol} from "../../../../App"





export const SelectedStaff= ({selectedID}) => {
   const [name, setName] =useState('')
   const [pictureUrl, setPictureUrl] =useState()

    useEffect(()=>{
        get_doc_data(staffCol,selectedID)
        .then((staff)=>{
            setName(staff['fname']+ ' '+staff['mname']+ ' '+staff['lname'])
            setPictureUrl(staff['staffImage'])

        })
    },[])

    return (
        <div className="selected-staff-box">
        <div className="image" >
            <img src={pictureUrl}  alt="profile" style={{ maxWidth: '300px', marginTop: '10px' }} />
        </div>
        <div className="data">
            <h3 style={{color:"blue"}}>{selectedID}</h3>
            <br />
            <p><strong>{name.toUpperCase()}</strong></p>

        </div>
        </div>
    )
}