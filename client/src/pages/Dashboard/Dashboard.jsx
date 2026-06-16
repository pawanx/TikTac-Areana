import { useAuth } from "../../contexts/AuthContext";
import "./Dashboard.css";

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h2>TicTac Arena</h2>

        <div className="nav-right">
          <span>{user?.username}</span>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h1>
          Welcome Back, {user?.username} 👋
        </h1>

        <p>
          Ready for your next battle?
        </p>

        <div className="action-cards">
          <div className="action-card">
            <h3>Create Room</h3>
            <p>
              Start a private game and invite
              a friend.
            </p>

            <button>Create</button>
          </div>

          <div className="action-card">
            <h3>Join Room</h3>
            <p>
              Enter a room code to join a game.
            </p>

            <button>Join</button>
          </div>

          <div className="action-card">
            <h3>Quick Match</h3>
            <p>
              Find an opponent instantly.
            </p>

            <button>Play</button>
          </div>
        </div>

        <section className="stats-section">
          <div className="stat-card">
            <h2>0</h2>
            <p>Wins</p>
          </div>

          <div className="stat-card">
            <h2>0</h2>
            <p>Losses</p>
          </div>

          <div className="stat-card">
            <h2>0</h2>
            <p>Draws</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;