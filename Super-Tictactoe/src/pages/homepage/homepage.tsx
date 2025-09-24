import "./homepage.styles.css";
import MainLogo from "../../../public/mainLogo.svg";
import {
  FaRegUserCircle,
  FaGamepad,
  FaTrophy,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaUserEdit,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../state/authContext";
import Button from "../../components/button/button.component";
import ThemeButton from "../../components/themeButton/themeButton.component";

const HomePage = () => {
  const { user, logout } = useAuth();
  const [showProfile, setShowProfile] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || "");

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const handleUsernameUpdate = () => {
    // TODO: Implement username update functionality
    console.log("Update username to:", newUsername);
    setShowProfile(false);
  };

  return (
    <div className="homepage-container">
      {/* Header with Profile and Theme */}
      <header className="homepage-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={MainLogo} alt="Main Logo" height={60} />
            <h1 className="logo-title">Super Tic Tac Toe</h1>
          </div>
          <div className="header-actions">
            {user ? (
              <div className="profile-section">
                <button
                  className="profile-btn"
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <FaRegUserCircle size={24} />
                  <span>{user.username}</span>
                </button>
                {showProfile && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <FaUserEdit />
                      <span>Profile Settings</span>
                    </div>
                    <div className="profile-content">
                      <div className="username-section">
                        <label>Username:</label>
                        <input
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="Enter new username"
                        />
                        <button onClick={handleUsernameUpdate}>Update</button>
                      </div>
                      <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login-signup" className="login-link">
                <Button
                  label="Login/Signup"
                  onClick={() => console.log("clicked")}
                />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Super Tic Tac Toe</h1>
          <p className="hero-subtitle">
            The ultimate online two-player experience that puts a thrilling
            twist on the classic game
          </p>
          <div className="hero-actions">
            <Link to="/create-room" className="action-link">
              <Button
                label="Create Room"
                onClick={() => console.log("clicked")}
              />
            </Link>
            <Link to="/join-room" className="action-link">
              <Button
                label="Join Room"
                onClick={() => console.log("clicked")}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Game Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FaGamepad className="feature-icon" />
            <h3>Strategic Gameplay</h3>
            <p>
              Master the art of strategic thinking with our 9-grid system that
              requires careful planning and foresight.
            </p>
          </div>
          <div className="feature-card">
            <FaUsers className="feature-icon" />
            <h3>Online Multiplayer</h3>
            <p>
              Play with friends or challenge players from around the world in
              real-time matches.
            </p>
          </div>
          <div className="feature-card">
            <FaTrophy className="feature-icon" />
            <h3>Competitive Play</h3>
            <p>
              Track your wins, improve your skills, and climb the leaderboards
              in competitive matches.
            </p>
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="how-to-play-section">
        <h2 className="section-title">How to Play</h2>
        <div className="how-to-content">
          <div className="how-to-text">
            <h3>Master the Super Grid</h3>
            <p>
              Super Tic Tac Toe takes the classic game to the next level with a
              3x3 grid of smaller Tic Tac Toe boards. Your move determines which
              board your opponent must play on next, creating a strategic layer
              of complexity.
            </p>
            <ul className="game-rules">
              <li>Win a small board to claim it for your symbol</li>
              <li>Win three small boards in a row to win the game</li>
              <li>Your move determines your opponent's next board</li>
              <li>Think ahead and plan your strategy carefully</li>
            </ul>
          </div>
          <div className="video-container">
            <iframe
              className="game-video"
              src="https://www.youtube.com/embed/_Na3a1ZrX7c"
              title="Super Tic Tac Toe Video"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className="game-modes-section">
        <h2 className="section-title">Game Modes</h2>
        <div className="modes-grid">
          <div className="mode-card">
            <h3>Quick Match</h3>
            <p>Jump into a fast-paced game with random opponents</p>
            <Link to="/join-room" className="mode-link">
              <Button label="Play Now" onClick={() => console.log("clicked")} />
            </Link>
          </div>
          <div className="mode-card">
            <h3>Private Room</h3>
            <p>Create a private room to play with friends</p>
            <Link to="/create-room" className="mode-link">
              <Button
                label="Create Room"
                onClick={() => console.log("clicked")}
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <p>&copy; 2024 Super Tic Tac Toe. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Theme Button */}
      <div className="theme-button-container">
        <ThemeButton />
      </div>
    </div>
  );
};

export default HomePage;
