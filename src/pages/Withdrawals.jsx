import "../user.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function Withdrawals({ darkMode }) {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purpose, setPurpose] = useState("");
  const [personId, setPersonId] = useState("");
  const [personOptions, setPersonOptions] = useState([]);

  const purposeOptions = [
    { value: "KX Pack", label: "KX Pack" },
    { value: "AN Pack", label: "AN Pack" },
    { value: "PD Pack", label: "PD Pack" },
    { value: "CX Pack", label: "CX Pack" },
    { value: "Instructor R&D usage", label: "Instructor R&D usage" },
    { value: "Faulty/broken", label: "Faulty/broken" },
  ];

  const visiblePurposeOptions = purposeOptions;

  // ✅ POPUP STATE
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success", // success | error
  });

  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });

    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 2500);
  };

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
      showPopup("Failed to load products", "error");
    }
  };

  const fetchPeople = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/people`);

      if (!res.ok) {
        throw new Error("People API unavailable");
      }

      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data
            .filter((item) => item && (item.label || item.name || item.value || item.Name || item.id !== undefined || item.Id !== undefined))
            .map((item) => ({
              id: item.id ?? item.Id ?? item.value ?? "",
              label: item.label ?? item.name ?? item.value ?? item.Name ?? "",
            }))
        : [];

      setPersonOptions(normalized);
      setPersonId("");
    } catch (err) {
      console.log(err);
      setPersonOptions([]);
      setPersonId("");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPeople();
  }, []);

  const withdrawStock = async () => {
    const product = products.find(
      (p) => p.id === parseInt(selectedProduct)
    );

    if (!product) return;

    const selectedPerson = personOptions.find((option) => option.id.toString() === personId);
    const selectedPersonLabel = selectedPerson?.label || (personId ? personId : "");

    if (!purpose || !selectedPerson) {
      showPopup("Please select both purpose and person", "error");
      return;
    }

    if (parseInt(quantity) > product.quantity) {
      showPopup("Error: too many items requested", "error");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/inventory/withdraw?productId=${selectedProduct}&quantity=${quantity}&role=${role || ""}&userId=${userId || ""}&purpose=${encodeURIComponent(purpose)}&person=${encodeURIComponent(selectedPersonLabel)}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const errorText = await res.text();
        showPopup(errorText, "error");
        return;
      }

      showPopup("Withdrawal successful", "success");

      setSelectedProduct("");
      setQuantity("");
      setPurpose("");
      setPersonId("");

      fetchProducts();
    } catch (err) {
      console.log(err);
      showPopup("Server error", "error");
    }
  };

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>

      {/* ✅ POPUP */}
      {popup.show && (
        <div className={`popup ${popup.type}`}>
          {popup.message}
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <h2>MEU LABS</h2>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/inventory">Inventory</Link>
            <Link to="/withdrawals" className="active">
              Withdrawals
            </Link>
            <Link to="/purchases">Purchases</Link>
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
          <h1>WITHDRAWALS</h1>
          <div className="profile">{role}</div>
        </header>

        {/* PANEL */}
        <div className="panel soft-card">

          <div className="panel-title">Withdraw Stock</div>

          <div className="withdraw-grid">

            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">Select Product</option>

              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.itemName} ({p.quantity} left)
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="">Select Purpose</option>
              {visiblePurposeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={personId}
              onChange={(e) => setPersonId(e.target.value)}
            >
              <option value="">Select Person</option>
              {personOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              className="primary-btn"
              onClick={withdrawStock}
              disabled={!selectedProduct || !quantity || !purpose || !personId}
            >
              Withdraw Stock
            </button>

          </div>
        </div>

        <div className="history-actions">
          <Link to="/withdrawal-history" className="secondary-btn">
            View Withdrawal History
          </Link>
        </div>

        {/* TABLE */}
        <div className="panel soft-card">

          <div className="panel-title">Current Stock</div>

          <table className="clean-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="table-row">

                  <td>{p.id}</td>
                  <td>{p.itemName}</td>
                  <td>{p.quantity}</td>

                  <td>
                    <span
                      className={
                        p.quantity <= p.minimumStockLevel
                          ? "status low"
                          : "status good"
                      }
                    >
                      {p.quantity <= p.minimumStockLevel
                        ? "Low Stock"
                        : "In Stock"}
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

export default Withdrawals;