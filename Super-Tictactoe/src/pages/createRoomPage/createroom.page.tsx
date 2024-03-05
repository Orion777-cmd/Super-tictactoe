import {useState} from "react";
import "./createroom.styles.css";
import MainLogo from "../../../public/mainLogo.svg";

import Copy from "../../components/copy/copy.component";
import ToastPopups from "../../components/toast/toast.component";

const CreateRoom = () => {

    const [copiedValue, setCopiedValue] = useState<string| null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);

    const [toast, setToast] = useState<boolean>(false);

    const TostAnimation = () => {
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 3000);
    }

    return (
        <div className="createpage-container">
            <div className="logo-container">
                <img src={MainLogo} alt="Main Logo" height={150} />

                <h1 className="title">Create Room</h1>
            </div>

            <div className="text-desc">
                <p className="text">
                    Copy The Genrate URL to your opponentaccordion-Finally when you 
                    are read click Play Game Button to get redirected to the game.
                </p>
            </div>


            <div className="copy-container">
                <p className="room-link">{copiedValue}</p>
                <Copy text={copiedValue} isCopied={isCopied} setIsCopied={setIsCopied} />
            </div>

            <ToastPopups status="green" children="Room Id Copied" toast={toast}/>

            
        </div>
    )
}


export default CreateRoom;