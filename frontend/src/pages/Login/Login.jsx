import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect logged-in users to dashboard
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    toast.dismiss();
    setIsLoading(true); // Set loading to true when login is attempted

    try {
      const response = await fetch("https://video-g4h9.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "User not found, please sign up!") {
          toast.error("User not found. Please check your email.");
        } else if (data.message === "Invalid email or password.") {
          toast.error("Incorrect password. Please try again.");
        } else {
          toast.error(data.detail || "Login failed. Please try again.");
        }
        setIsLoading(false); // Set loading to false when there's an error
        return;
      }

      localStorage.setItem("token", data.token); // Store token
      toast.success("Login successful!");

      setTimeout(() => navigate("/dashboard"), 2000); // Redirect after 2 sec
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false); // Set loading to false when there's an error
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <button className="button-on" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="loading-spinner">
                <span className="spinner"></span> Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>
        <p className="register-text">
          Don't have an account? <Link to="/">Sign Up</Link>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;