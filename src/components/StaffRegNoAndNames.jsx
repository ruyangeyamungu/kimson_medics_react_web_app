import React from "react"
import { useSelector } from "react-redux"



export const StaffIDAndNames= ()=>{
    const regNo = useSelector(state => state.regNo);
    const staffNames = useSelector(state => state.names);
    return(
        <div className="form-box">
        <h3>{staffNames}</h3>
        <h4 style={{color: 'blue'}}>{regNo}</h4>
    </div>
    )

}