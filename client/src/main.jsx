import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {Toaster} from "react-hot-toast"
import App from "./App.jsx";
import "./styles/global.css"
import { AuthProvider } from "./contexts/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" reverseOrder={false}/>
    </AuthProvider>
  </StrictMode>,
);
