import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Auth.css";
import api from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

const Auth = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        login(res.data.user, res.data.token);

        toast.success("Login Successful...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        await api.post("/auth/register", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        toast.success(
          "Registration Successful. Please Login with your credentials",
        );

        setTimeout(() => {
          setIsLogin(true);

          setFormData({
            username: "",
            email: "",
            password: "",
          });
        }, 1000);
      }
    } catch (error) {
      setFormData((prev) => ({
        ...prev,
        password: "",
      }));
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-container">
      <div className="top-logo">
        <span className="logo-icon">✖️⭕</span>
        <h2>TicTac Arena</h2>
      </div>
      <div className="auth-left">
        

        <p className="hero-description">
          Challenge friends, climb the leaderboard, and become the ultimate
          TicTac Arena champion.
        </p>

        <div className="feature-list">
          <div className="feature-item"> 🎮 Real-Time Matches</div>
          <div className="feature-item"> 🏆 Global Leaderboard</div>
          <div className="feature-item"> 📊 Match History</div>
        </div>

        <div className="board-preview">
          <div>X</div>
          <div>O</div>
          <div>X</div>

          <div>O</div>
          <div>X</div>
          <div>O</div>

          <div></div>
          <div>X</div>
          <div></div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-card">
          <div className="tab-switch">
            <button
              className={isLogin ? "active-tab" : ""}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={!isLogin ? "active-tab" : ""}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
          <p className="auth-subtitle">
            {isLogin ? "Login to continue playing" : "Join the arena today"}
          </p>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="username"
                id="username"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
              />
            )}

            <input
              type="email"
              name="email"
              id="email"
              placeholder="email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name="password"
              id="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading
                ? isLogin
                  ? "Logging in..."
                  : "Registering..."
                : isLogin
                  ? "Login"
                  : "Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
