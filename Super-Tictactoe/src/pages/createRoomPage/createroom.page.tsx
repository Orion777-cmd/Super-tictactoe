import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./createroom.styles.css";
import { Link } from "react-router-dom";
import Copy from "../../components/copy/copy.component";
import ToastPopups from "../../components/toast/toast.component";
import Button from "../../components/button/button.component";
import ThemeButton from "../../components/themeButton/themeButton.component";
import { useUser } from "../../state/authContext";
import { createRoom, subscribeToRoom, getRoom } from "../../supabase/gameApi";

const CreateRoom = () => {
  const user = useUser();
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toast, setToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [guestJoined, setGuestJoined] = useState(false);
  const subscriptionRef = useRef<any>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleCreateRoom = async () => {
    if (!user) {
      showToast("You must be logged in to create a room.");
      return;
    }
    setLoading(true);
    try {
      const { room, game } = await createRoom(user.userId);
      setRoomId(room.id);
      const joinUrl = `${window.location.origin}/join-room/${room.id}`;
      setCopiedValue(joinUrl);
      showToast("Room and game created! Share the link.");
    } catch (err: any) {
      showToast(err?.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayGame = () => {
    if (roomId) {
      navigate(`/game/${roomId}`);
    }
  };

  const handleCheckRoom = async () => {
    try {
      const room = await getRoom(roomId);
      console.log("[DEBUG] Manual room check:", room);
      if (room.guest_id) {
        setGuestJoined(true);
        showToast("Guest found! Redirecting to game...");
        setTimeout(() => {
          navigate(`/game/${roomId}`);
        }, 1000);
      } else {
        showToast("No guest yet...");
      }
    } catch (error) {
      console.error("Error checking room:", error);
    }
  };

  // Subscribe to room changes when room is created
  useEffect(() => {
    if (!roomId) return;

    // Check initial room state
    const checkRoomState = async () => {
      try {
        const room = await getRoom(roomId);
        console.log("[DEBUG] Initial room state:", room);
        console.log("[DEBUG] Room has guest_id:", !!room.guest_id);
        if (room.guest_id) {
          console.log("[DEBUG] Guest already joined, setting state...");
          setGuestJoined(true);
          showToast("Guest joined! You can now start the game.");
        } else {
          console.log("[DEBUG] No guest yet, waiting...");
        }
      } catch (error) {
        console.error("Error checking room state:", error);
      }
    };

    checkRoomState();

    // Subscribe to room updates
    const sub = subscribeToRoom(roomId, (room) => {
      console.log("[DEBUG] Room subscription fired:", room);
      console.log("[DEBUG] Guest joined state:", guestJoined);
      console.log("[DEBUG] Room has guest_id:", !!room.guest_id);
      if (room.guest_id && !guestJoined) {
        console.log("[DEBUG] Guest joined! Setting state and redirecting...");
        setGuestJoined(true);
        showToast("Guest joined! Redirecting to game...");
        // Automatically navigate to the game when guest joins
        setTimeout(() => {
          console.log("[DEBUG] Navigating to game:", `/game/${roomId}`);
          navigate(`/game/${roomId}`);
        }, 1500);
      }
    });

    subscriptionRef.current = sub;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [roomId]); // Removed guestJoined from dependencies to prevent re-subscription

  return (
    <div className="createpage-container">
      {/* Theme Button */}
      <div className="theme-button-container">
        <ThemeButton />
      </div>

      <div className="logo-container">
        <img src="./mainLogo.svg" alt="Main Logo" height={150} />

        <h1 className="title">Create Room</h1>
      </div>

      <div className="text-desc">
        <p className="text">
          Copy The Generated URL and send it to your opponent via appropriate
          platform. When a guest joins, you can start the game.
        </p>
        {roomId && (
          <div className="room-status">
            <p className="status-text">
              {guestJoined
                ? "✅ Guest has joined! You can now start the game."
                : "⏳ Waiting for a guest to join..."}
            </p>
          </div>
        )}
      </div>

      <div className="container-copy">
        <p className="room-link">{copiedValue}</p>
        <Copy
          text={copiedValue || ""}
          isCopied={isCopied}
          setIsCopied={setIsCopied}
        />
      </div>

      <div className="optional-cotnainer">
        <p>
          Is there a room?{" "}
          <span className="join-link">
            <Link to="/join-room">Join Here!</Link>
          </span>
        </p>
      </div>
      <div className="container-button">
        {!roomId ? (
          <Button
            label={loading ? "Creating..." : "Create Room"}
            onClick={handleCreateRoom}
            disabled={loading}
          />
        ) : guestJoined ? (
          <Button label="Play Game" onClick={handlePlayGame} disabled={false} />
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Button
              label="Waiting for guest..."
              onClick={() => {}}
              disabled={true}
            />
            <Button
              label="Check Room Status (Debug)"
              onClick={handleCheckRoom}
              disabled={false}
            />
          </div>
        )}
      </div>

      <ToastPopups status="success" toast={toast}>
        {toastMsg}
      </ToastPopups>
    </div>
  );
};

export default CreateRoom;
