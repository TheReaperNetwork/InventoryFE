import "./user.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState, createContext } from "react";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Purchases from "./pages/Purchases";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Sign from "./pages/Sign";
import Withdrawals from "./pages/Withdrawals";

/* ========================= */
/* TOAST CONTEXT             */
/* ========================= */
export const ToastContext = createContext();

function App() {

  /* ========================= */
  /* THEME SYSTEM              */
  /* ========================= */
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === null ? true : JSON.parse(saved);
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  /* ========================= */
  /* LOGIN STATE               */
  /* ========================= */
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  /* ========================= */
  /* TOAST SYSTEM              */
  /* ========================= */
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>

      <BrowserRouter>

        <Routes>

          {/* LOGIN */}
          <Route
            path="/"
            element={
              <Login setIsLoggedIn={setIsLoggedIn} />
            }
          />

          {/* SIGNUP */}
          <Route path="/signup" element={<Sign />} />

          {/* DASHBOARD */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <Dashboard darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* INVENTORY */}
          <Route
            path="/inventory"
            element={
              isLoggedIn ? (
                <Inventory darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* PURCHASES */}
          <Route
            path="/purchases"
            element={
              isLoggedIn ? (
                <Purchases darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* WITHDRAWALS */}
          <Route
            path="/withdrawals"
            element={
              isLoggedIn ? (
                <Withdrawals darkMode={darkMode} />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* SETTINGS */}
          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <Settings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />

        </Routes>

        {/* ========================= */}
        {/* TOAST UI (GLOBAL)        */}
        {/* ========================= */}
        {toast && (
          <div className={`toast ${toast.type}`}>
            {toast.message}
          </div>
        )}

      </BrowserRouter>

    </ToastContext.Provider>
  );
}

export default App;