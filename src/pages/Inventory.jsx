import "../user.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Inventory({ darkMode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const [products, setProducts] = useState([]);

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [cost, setCost] = useState("");

  // MODAL STATE (clean UX)
  const [stockModal, setStockModal] = useState(null);
  const [stockAmount, setStockAmount] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5284/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ADD PRODUCT
  const addProduct = async () => {
    try {
      const res = await fetch(
        "http://localhost:5284/api/products?role=Admin",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemName,
            quantity: parseInt(quantity),
            cost: parseFloat(cost),
            itemCode: "ITEM001",
            variant: "Default",
            minimumStockLevel: 5,
          }),
        }
      );

      if (!res.ok) return alert("Failed to add product");

      setItemName("");
      setQuantity("");
      setCost("");
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5284/api/products/${id}?role=Admin`,
        { method: "DELETE" }
      );

      if (!res.ok) return alert("Failed to delete");

      fetchProducts();
    } catch (err) {
      console.log(err);
    }
  };

  // ADD STOCK
  const addStock = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5284/api/inventory/purchase?productId=${id}&quantity=${stockAmount}`,
        { method: "POST" }
      );

      if (!res.ok) return alert("Failed to add stock");

      setStockModal(null);
      setStockAmount("");
      fetchProducts();
    } catch (err) {
      console.log(err);
    }
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
            <Link to="/inventory" className="active">Inventory</Link>
            <Link to="/withdrawals">Withdrawals</Link>
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

        {/* HEADER */}
        <header className="topbar">
          <h1>INVENTORY</h1>
          <div className="profile">Admin</div>
        </header>

        {/* ADD PRODUCT */}
        <div className="panel soft-panel">
          <div className="panel-title">Add Product</div>

          <div className="form-group">
            <input
              placeholder="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />

            <button className="primary-btn" onClick={addProduct}>
              Add Product
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="panel soft-panel">
          <div className="panel-title">Product Inventory</div>

          <table className="clean-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="table-row">
                  <td>{p.id}</td>
                  <td>{p.itemName}</td>
                  <td>{p.quantity}</td>
                  <td>${p.cost}</td>

                  <td className="action-cell">

                    <button
                      className="addstock-btn"
                      onClick={() => setStockModal(p)}
                    >
                      Add Stock
                    </button>

                    <button
                      className="danger-btn"
                      onClick={() => deleteProduct(p.id)}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* STOCK MODAL (SMOOTH) */}
        {stockModal && (
          <div className="modal-overlay">
            <div className="modal-box">

              <h3>Add Stock</h3>

              <p>{stockModal.itemName}</p>

              <input
                type="number"
                placeholder="Enter amount"
                value={stockAmount}
                onChange={(e) => setStockAmount(e.target.value)}
              />

              <div className="modal-actions">
                <button
                  className="primary-btn"
                  onClick={() => addStock(stockModal.id)}
                >
                  Confirm
                </button>

                <button
                  className="ghost-btn"
                  onClick={() => {
                    setStockModal(null);
                    setStockAmount("");
                  }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Inventory;