import "./copy.styles.css";
import {useState} from "react";
import { FaRegCopy } from "react-icons/fa";

type CopyPropsTypes = {
    text : string | null
    isCopied: boolean
    setIsCopied: (n: boolean) => void
}
const Copy: React.FC<CopyPropsTypes> = ({text , setIsCopied, isCopied}) => {

    const handlecopy = () => {
        if (text){
            navigator.clipboard.writeText(text);
            setIsCopied(true);
        }
        
    }

    setTimeout(()  => {
        setIsCopied(false);
    }, 2000);
    return (
        <div className="copy-container">
            <button onClick={handlecopy}>
                <FaRegCopy size={20}/>
                {'copy'}
            </button>
        </div>
    )
}


export default Copy;