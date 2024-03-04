import React, {useEffect, useState} from "react";
import "./toast.styles.scss";


type ToastPopupPropType = {
    children: string
    status : string 
}
const ToastPopups:React.FC<ToastPopupPropType> = ({children, status}) => {
    const [toast, setToast] = useState(false);

    const TostAnimation = () => {
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }
    return (
        <>
            <div className={`toast-container ${status} ${toast ? 'show' : ''}`}>
                <div className="content-container">
                    
                    {children}
                    <div className={`progress ${toast? 'animate': ''}`}>

                    </div>
                </div>
            </div>
            <button className="button" onClick={TostAnimation}>Toast</button>
        </>
        
    )
}

export default ToastPopups;