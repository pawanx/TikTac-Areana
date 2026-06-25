import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { socket } from "../../socket/socket";
import toast from "react-hot-toast";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreateRoom = () => {
    socket.emit("create-room", {
      userId: user.id,
      username: user.username,
    });

   
  };

  const handleJoin = () => {
    if (!joinCode.trim()) {
      toast.error("Please enter room code");
      return;
    }
    socket.emit("join-room", {
      roomCode: joinCode,
      userId: user.id,
      username: user.username,
    });

    toast.loading("Joining room...", {
      id: "join-room",
    });
  };

  const handleLogout = () => {
    logout();

    toast.success("Logged out successfully");

    navigate("/auth");
  };

  const copyRoomCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    toast.success("Room Code copied.");
  };

  useEffect(() => {
    if (socket.connected) {
      console.log("Already Connected:", socket.id);
    }

    socket.on("connect", () => {
      console.log("Connected:", socket.id);
    });

    socket.on("room-created", ({ roomCode }) => {
      setRoomCode(roomCode);
      toast.success("Room created");
    });

    socket.on("room-joined", ({ room }) => {
      console.log("Joined:", room.roomCode);

      toast.dismiss("join-room");

      toast.success("Match Found!");

      console.log(room.players);

      navigate(`/room/${room.roomCode}`, { state: room });
    });

    socket.on("room-error", ({ message }) => {
      toast.dismiss("join-room");

      toast.error(message);
    });

    return () => {
      socket.off("connect");
      socket.off("room-created");
      socket.off("room-joined");

      socket.off("room-error");
    };
  }, []);
  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>TicTac Arena</h2>

        <div className="nav-right">
          <span>{user?.username}</span>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>Welcome Back, {user?.username} 👋</h1>

        <p>Ready for your next battle?</p>

        <div className="action-cards">
          <div className="action-card">
            <h3>Create Room</h3>
            <p>Start a private game and invite a friend.</p>

            <button onClick={handleCreateRoom}>{roomCode ? "Room Created" : "Create"}</button>
          </div>

          <div className="action-card">
            <h3>Join Room</h3>
            <p>Enter a room code to join a game.</p>

            <div className="join-input-container">
              <input
                className="join-input"
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Enter Room Code"
                maxLength={6}
              />

              <button className="join-btn" onClick={handleJoin}>
                Join
              </button>
            </div>
          </div>

          <div className="action-card">
            <h3>Quick Match</h3>
            <p>Find an opponent instantly.</p>

            <button>Play</button>
          </div>
        </div>

        {roomCode && (
          <div className="room-box">
            <h3>🎮 Room Created</h3>

            <div className="room-code-container">
              <span>{roomCode}</span>

              <button className="copy-btn" onClick={copyRoomCode}>
                📋 Copy
              </button>
            </div>

            <p>Share this code with your friend.</p>
          </div>
        )}

        <section className="stats-section">
          <div className="stat-card">
            <h2>{user?.wins || 0}</h2>
            <p>Wins</p>
          </div>

          <div className="stat-card">
            <h2>{user?.losses || 0}</h2>
            <p>Losses</p>
          </div>

          <div className="stat-card">
            <h2>{user?.draws || 0}</h2>
            <p>Draws</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
