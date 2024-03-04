import "./createroom.styles.css";
import MainLogo from "../../../public/mainLogo.svg"
import Input from "../../components/input/input.component"

const CreateRoom = () => {
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
                <p className="room-link">{"https://tic-tac-toe/join/id"}</p>
                
            </div>

            
        </div>
    )
}


export default CreateRoom;