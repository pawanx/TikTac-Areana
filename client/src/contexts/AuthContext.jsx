import { useEffect } from "react";
import { useState } from "react";
import { useContext, createContext } from "react";
import api from "../services/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);

    setUser(userData);
  };

  const logout = () => {
    console.log("Logout clicked");
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  };

  const fetchLatestUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, fetchLatestUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
