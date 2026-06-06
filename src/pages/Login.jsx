import "../user.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setIsLoggedIn }) {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const loginUser = async () => {

    try {

      const response = await fetch(
        "http://localhost:5284/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        setError(errorText);

        return;
      }

      const data = await response.json();

      localStorage.setItem("isLoggedIn", "true");

      localStorage.setItem("role", data.role);

      localStorage.setItem("username", username);

      setIsLoggedIn(true);

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      setError("Server Error");

    }

  };

  return (
    <div className="login-page">

      <div className="signup-top-btn">

        <Link to="/signup">
          Sign Up
        </Link>

      </div>

      <div className="login-box">

        <h1>
          MEU LABS LOGIN
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button onClick={loginUser}>
          Login
        </button>

        {error && (
          <p>{error}</p>
        )}

      </div>

    </div>
  );
}

export default Login;