import "../user.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function Purchases({ darkMode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [userId, setUserId] = useState("");

  const fetchPurchases = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/purchases`);
      const data = await res.json();
      setPurchases(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchPurchases();
    fetchProducts();
  }, []);

  const addPurchase = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/purchases`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: parseInt(selectedProduct),
          quantity: parseInt(quantity),
          userId: parseInt(userId),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        alert(errText);
        return;
      }

      setSelectedProduct("");
      setQuantity("");
      setUserId("");

      fetchPurchases();
    } catch (err) {
      console.log(err);
    }
  };

  const canSubmit =
    selectedProduct && quantity && userId;

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
            <Link to="/purchases" className="active">
              Purchases
            </Link>
            <Link to="/settings">Settings</Link>
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
          <h1>PURCHASES</h1>
          <div className="profile">Admin</div>
        </header>

        {/* FORM CARD */}
        <div className="panel soft-card">

          <div className="panel-title">
            Record Purchase
          </div>

          <div className="form-grid">

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.itemName}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="number"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />

            <button
              className="primary-btn"
              onClick={addPurchase}
              disabled={!canSubmit}
            >
              Add Purchase
            </button>

          </div>

        </div>

        {/* TABLE */}
        <div className="panel soft-card">

          <div className="panel-title">
            Purchase History
          </div>

          <table className="clean-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>User</th>
              </tr>
            </thead>

            <tbody>
              {purchases.map((p) => (
                <tr key={p.id} className="table-row">

                  <td>{p.id}</td>

                  <td>
                    <span className="pill">
                      {p.product?.itemName || "Unknown"}
                    </span>
                  </td>

                  <td>{p.quantity}</td>

                  <td>
                    <span className="pill user-pill">
                      {p.user?.username || "User"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </main>
    </div>
  );
}

export default Purchases;