import "../user.css";
import { Link, useNavigate } from "react-router-dom";

function Settings({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // THEME TOGGLE (GLOBAL + PERSISTENT)
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    // persist across all pages + refresh
    localStorage.setItem("darkMode", JSON.stringify(newMode));
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <h2>MEU LABS</h2>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/inventory">Inventory</Link>
            <Link to="/withdrawals">Withdrawals</Link>
            <Link to="/purchases">Purchases</Link>
            <Link to="/settings" className="active">
              Settings
            </Link>
          </nav>
        </div>

        <div className="logout" onClick={logout}>
          Logout
        </div>
      </aside>

      {/* MAIN */}
      <main className="main-content">

        {/* TOPBAR */}
        <header className="topbar">
          <h1>SETTINGS</h1>
          <div className="profile">Admin</div>
        </header>

        {/* SETTINGS CARD */}
        <div className="panel soft-card">

          <div className="panel-title">
            Appearance
          </div>

          <div className="settings-row">

            <div>
              <h3 className="settings-label">
                Dark Mode
              </h3>
              <p className="settings-sub">
                Toggle between light and dark theme across all pages
              </p>
            </div>

            {/* TOGGLE SWITCH */}
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Settings;