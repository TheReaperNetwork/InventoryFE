import "../user.css";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/api";

function Dashboard({ darkMode }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);

  // LOAD PRODUCTS
  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  // LOAD PURCHASES
  const fetchPurchases = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/purchases`);
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchPurchases();
  }, []);

  // STATS
  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  const lowStock = products.filter(
    (product) => product.quantity <= product.minimumStockLevel
  );

  return (
    <div className={darkMode ? "dashboard dark" : "dashboard light"}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <h2>MEU LABS</h2>
          </div>

          <nav className="nav-links">
            <Link to="/dashboard" className="active">Dashboard</Link>
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

      {/* MAIN */}
      <main className="main-content">
        <header className="topbar">
          <h1>ADMIN DASHBOARD</h1>
          <div className="profile">Admin</div>
        </header>

        {/* CARDS */}
        <section className="cards">
          <div className="card yellow">
            <span>Total Products</span>
            <h2>{totalProducts}</h2>
          </div>

          <div className="card green">
            <span>Total Stock</span>
            <h2>{totalStock}</h2>
          </div>

          <div className="card red">
            <span>Low Stock Alerts</span>
            <h2>{lowStock.length}</h2>
          </div>

          <div className="card blue">
            <span>Total Purchases</span>
            <h2>{purchases.length}</h2>
          </div>
        </section>

        {/* CONTENT */}
        <section className="content-grid">
          <div className="left-content">
            <div className="panel">
              <div className="panel-title">⚠ Low Stock Alerts</div>

              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Stock</th>
                  </tr>
                </thead>

                <tbody>
                  {lowStock.map((product) => (
                    <tr key={product.id}>
                      <td>{product.itemName}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="panel">
              <div className="panel-title">Recent Products</div>

              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Quantity</th>
                  </tr>
                </thead>

                <tbody>
                  {products.slice(-5).reverse().map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.itemName}</td>
                      <td>{product.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="right-content">
            <div className="panel">
              <div className="panel-title">Quick Actions</div>
              <button className="action-btn blue-btn">
                Generate Report
              </button>
            </div>

            <div className="panel">
              <div className="panel-title">Recent Purchases</div>

              <ul className="logs">
                {purchases.slice(-5).reverse().map((purchase) => (
                  <li key={purchase.id}>
                    Purchased {purchase.quantity}x Product ID #{purchase.productId}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}



export default Dashboard;