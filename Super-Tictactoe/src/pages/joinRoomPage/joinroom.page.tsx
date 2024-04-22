import "./joinroom.styles.css";
import Input from "../../components/input/input.component";
import Button from "../../components/button/button.component";
import { Link } from "react-router-dom";

const JoinRoom = () => {
    return (
        <div className="joinpage-container">
            <div className="logo-container">
                <img src="./mainLogo.svg" alt="Main Logo" height={150} />

                <h1 className="title">Join Room</h1>
            </div>

            <div className="text-desc">
                <p className="text">
                    Copy The Genrated URL and send it to your opponent via apporpirate platform
                    -Finally when
                    the Play Game Button is active, get redirected to the game.
                </p>
            </div>

            <div className="input-container">
                <Input  label="paste URL code" type="" name="" value="" onChange={() => console.log("clicked")}/>
            </div>           

            <div className="optional-cotnainer">
                <p>Want to create a room? <span className="create-link" ><Link to="/create-room">Create Here!</Link></span></p>
            </div>
            <div className="container-button">
                {
                    <Button label="Join Game" onClick={() => console.log("play button clicked")}/>
                }
            </div>
        </div>
    )
}

export default JoinRoom;
