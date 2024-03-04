import "./homepage.styles.css";
import MainLogo from "../../../public/mainLogo.svg"
import { FaRegUserCircle } from "react-icons/fa";
import {Link } from "react-router-dom";

import Button from "../../components/button/button.component";

const HomePage = () => {
    return (
        <div className="homepage-container">

            <div className="title-container">
                <img src={MainLogo} alt="Main Logo" height={100} />
                <h1 className="title">Super Tic Tac Toe</h1>
                <Link to="/login-signup" className="links"><Button label={`Login/Signup`}  onClick={()=>console.log("clicked")}/></Link>
            </div>

            <div className="description-container">

                <div className="text-description">
                    <p>
                    Welcome to Super Tic Tac Toe – the ultimate online two-player experience that puts a thrilling twist on the classic game we all know and love. Get ready to embark on an exciting journey of strategy, skill, and endless fun with a friend or player from around the world.

                    In Super Tic Tac Toe, you'll find everything you love about traditional Tic Tac Toe, but with an added layer of complexity and excitement. Challenge your opponent to outsmart each other on a larger board composed of nine smaller Tic Tac Toe grids. But be warned: every move you make affects the game state across the entire board, requiring strategic thinking and careful planning to emerge victorious.

                    Immerse yourself in the world of Super Tic Tac Toe and experience the thrill of strategic gameplay like never before.

                    </p>
                </div>

                <div className="video-container">
                    <iframe
                        className="video"
                        src="https://www.youtube.com/embed/_Na3a1ZrX7c"
                        title="Super Tic Tac Toe Video"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
            

            <div className="button-container">
                <Link  className="links" to="/create-room" ><Button label={"Create Room"} onClick={() => console.log("clicked")} /></Link>
                <Link className="links" to="/join-room" ><Button label={"Join Room"} onClick={() => console.log("clicked")} /></Link>
            </div>
        </div>
    )
}

export default HomePage;