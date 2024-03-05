import React, {useEffect, useState} from "react";
import "./toast.styles.css";


type ToastPopupPropType = {
    children: string
    status : string 
    toast: boolean

}
const ToastPopups:React.FC<ToastPopupPropType> = ({children, status, toast}) => {
    
    return (
        <>
            <div className={`toast-container ${status} ${toast ? 'show' : ''}`}>
                <div className="content-container">
                    
                    {children}
                    <div className={`progress ${toast? 'animate': ''}`}>

                    </div>
                </div>
            </div>
            
        </>
        
    )
}

export default ToastPopups;