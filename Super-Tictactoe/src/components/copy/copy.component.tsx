import "./copy.styles.css";
import {useState} from "react";
import { FaRegCopy } from "react-icons/fa";

type CopyPropsTypes = {
    text : string
}
const Copy: React.FC<CopyPropsTypes> = ({text}) => {

    const [isCopied, setIsCopied] = useState<boolean>(false);

    const handlecopy = () => {
        navigator.clipboard.writeText(text);
        setIsCopied(true);
    }

    setTimeout(()  => {
        setIsCopied(false);
    }, 2000);
    return (
        <div className="button-container">
            <button onClick={handlecopy}>
                <FaRegCopy size={20}/>
                {isCopied? 'copied!': 'copy'}
            </button>
        </div>
    )
}


export default Copy;