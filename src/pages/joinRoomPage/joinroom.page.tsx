import "./joinroom.styles.css";
import Input from "../../components/input/input.component";
import Button from "../../components/button/button.component";
import ThemeButton from "../../components/themeButton/themeButton.component";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import ToastPopups from "../../components/toast/toast.component";
import { useUser } from "../../state/authContext";
import { joinRoom } from "../../supabase/gameApi";

const JoinRoom = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastStatus, setToastStatus] = useState("success");
  const user = useUser();
  const navigate = useNavigate();

  const showToast = (msg: string, status: string = "success") => {
    setToastMsg(msg);
    setToastStatus(status);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  // Extract room ID from a full URL or just use the input as ID
  const parseRoomId = (value: string) => {
    try {
      const url = new URL(value);
      const parts = url.pathname.split("/");
      return parts[parts.length - 1] || parts[parts.length - 2];
    } catch {
      return value.trim();
    }
  };

  const handleJoin = async () => {
    if (!user) {
      showToast("You must be logged in to join a room.", "error");
      return;
    }
    const roomId = parseRoomId(input);
    if (!roomId) {
      showToast("Please enter a valid room link or ID.", "error");
      return;
    }
    setLoading(true);
    try {
      await joinRoom(roomId, user.userId);
      showToast("Joined room successfully! Redirecting to game...", "success");
      // Give a moment for the room update to propagate
      setTimeout(() => navigate(`/game/${roomId}`), 1500);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to join room";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="joinpage-container">
      {/* Theme Button */}
      <div className="theme-button-container">
        <ThemeButton />
      </div>

      <div className="logo-container">
        <img src="./mainLogo.svg" alt="Main Logo" height={150} />

        <h1 className="title">Join Room</h1>
      </div>

      <div className="text-desc">
        <p className="text">
          Paste the generated URL or room ID from your opponent. When the Join
          Game button is active, you'll be redirected to the game.
        </p>
      </div>

      <div className="input-container">
        <Input
          label="Paste URL or Room ID"
          type="text"
          name="roomId"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <div className="optional-cotnainer">
        <p>
          Want to create a room?{" "}
          <span className="create-link">
            <Link to="/create-room">Create Here!</Link>
          </span>
        </p>
      </div>
      <div className="container-button">
        {
          <Button
            label={loading ? "Joining..." : "Join Game"}
            onClick={handleJoin}
            disabled={loading}
          />
        }
      </div>
      <ToastPopups status={toastStatus} toast={toast}>
        {toastMsg}
      </ToastPopups>
    </div>
  );
};

export default JoinRoom;
