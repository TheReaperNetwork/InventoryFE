import "../user.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function WithdrawalHistory({ darkMode }) {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/withdrawals`);
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>
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
            <Link to="/settings">Settings</Link>
          </nav>
        </div>

        <div className="logout" onClick={logout}>
          Logout
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h1>WITHDRAWAL HISTORY</h1>
          <div className="profile">{role}</div>
        </header>

        <div className="panel soft-card">
          <div className="history-actions">
            <Link to="/withdrawals" className="secondary-btn">
              Back to Withdrawals
            </Link>
          </div>

          <div className="panel-title">Recent withdrawals</div>

          {loading ? (
            <p className="history-empty">Loading history...</p>
          ) : history.length === 0 ? (
            <p className="history-empty">No withdrawal history yet.</p>
          ) : (
            <table className="clean-table history-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product</th>
                  <th>By</th>
                  <th>Type</th>
                  <th>For</th>
                  <th>Purpose</th>
                  <th>Qty</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} className="table-row">
                    <td>{item.id}</td>
                    <td>{item.product?.itemName || "Unknown"}</td>
                    <td>{item.user?.username || "Unknown"}</td>
                    <td>{item.personType || "Student"}</td>
                    <td>{item.person || "—"}</td>
                    <td>{item.purpose || "—"}</td>
                    <td>{item.quantity}</td>
                    <td>
                      {item.withdrawDate
                        ? new Date(item.withdrawDate).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}

export default WithdrawalHistory;
