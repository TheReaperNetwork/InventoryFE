import "../user.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Sign() {

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [role, setRole] = useState("User");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const signupUser = async () => {

    try {

      const response = await fetch(
        "http://localhost:5284/api/users/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            username,
            password,
            role,
          }),
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        setMessage(errorText);

        return;
      }

      setMessage("Account created successfully");

      setTimeout(() => {

        navigate("/");

      }, 1500);

    } catch (error) {

      console.log(error);

      setMessage("Server Error");

    }

  };

  return (
    <div className="login-page">

      <div className="signup-top-btn">

        <Link to="/">
          Login
        </Link>

      </div>

      <div className="login-box">

        <h1>
          CREATE ACCOUNT
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

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
        >

          <option value="User">
            User
          </option>

          <option value="Staff">
            Staff
          </option>

        </select>

        <button onClick={signupUser}>
          Create Account
        </button>

        {message && (
          <p>{message}</p>
        )}

      </div>

    </div>
  );
}

export default Sign;