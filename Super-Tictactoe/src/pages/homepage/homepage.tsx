import "./homepage.styles.css";
import MainLogo from "../../../public/mainLogo.svg"
import { FaRegUserCircle } from "react-icons/fa";
import {Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="container">

            <div className="title-container">
                <img src={MainLogo} alt="Main Logo" height={150} />
                <h1 className="title">Super Tic Tac Toe</h1>
                <Link to="/login-signup" className="login-signup-btn"><FaRegUserCircle size={30} /> Login/Signup</Link>
            </div>

            <div className="video-container">
                <video className="video" autoPlay loop muted>
                    <source src="https://www.youtube.com/watch?v=_Na3a1ZrX7c&ab_channel=ActuallyFunYouthGames" type="video/mp4" />
                </video>
            </div>

            <div className="button-container">
                <Link to="/create-room" className="btn">Create Room</Link>
                <Link to="/join-room" className="btn">Join Room</Link>
            </div>
        </div>
    )
}

export default HomePage;