import {useState} from "react";
import "./createroom.styles.css";
import {Link } from "react-router-dom";
import Copy from "../../components/copy/copy.component";
import ToastPopups from "../../components/toast/toast.component";
import Button from "../../components/button/button.component";

const CreateRoom = () => {

    const [copiedValue, setCopiedValue] = useState<string| null>("https://superticatoe/join-game/475948");
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
                <img src="./mainLogo.svg" alt="Main Logo" height={150} />

                <h1 className="title">Create Room</h1>
            </div>

            <div className="text-desc">
                <p className="text">
                    Copy The Genrated URL and send it to your opponent via apporpirate platform
                    -Finally when
                    the Play Game Button is active, get redirected to the game.
                </p>
            </div>


            <div className="container-copy">
                <p className="room-link">{copiedValue}</p>
                <Copy text={copiedValue} isCopied={isCopied} setIsCopied={setIsCopied} />
            </div>

            <div className="optional-cotnainer">
                <p>is there a create room? <span className="join-link" ><Link to="/join-room">Join Here!</Link></span></p>
            </div> 
            <div className="container-button">
                {
                    copiedValue && <Button label="Create Room" onClick={() => console.log("play button clicked")}/>
                }
            </div>
            
            <ToastPopups status="green" children="Room Id Copied" toast={toast}/>

            
        </div>
    )
}


export default CreateRoom;