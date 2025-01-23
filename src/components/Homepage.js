import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import homepageImage from "./homepage.png";

const defaultCredentials = {
  "sahaja.j.kothakota@kipi.ai": "password1",
  "shaurya.n.nigam@kipi.ai": "password2",
  "gokul.k.v@kipi.ai": "password3",
  "dharman.d.joshi@kipi.ai": "password4",
  "veeranjaneya.a.tiruveedhula@kipi.ai": "password5",
  "veerabhadra.m.swamy@kipi.ai": "password6",
  "venkata.n.tata@kipi.ai": "password7",
  "eshak.r.r@kipi.ai": "password8",
};

const Homepage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleFormLogin = async () => {
    if (defaultCredentials[username] && defaultCredentials[username] === password) {
      try {
        // Fetch user details from the backend
        const response = await fetch(`http://127.0.0.1:8000/users/${username}`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }
  
        const userDetails = await response.json();
  
        // Save user details to localStorage
        localStorage.setItem("user", JSON.stringify(userDetails));
        setIsLoggedIn(true);
  
        // Pass user details to parent component
        onLoginSuccess(userDetails);
  
        // Navigate to MainHomepage
        navigate("/mainhomepage"); // Ensure this route exists in your React Router
      } catch (error) {
        setError("Error fetching user details. Please try again.");
        console.error("Error:", error);
      }
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div
      style={{
        backgroundImage: `url(${homepageImage})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          padding: "20px",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          borderRadius: "8px",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-end",
          width: "400px",
          height: "200px",
        }}
      >
        {isLoggedIn ? (
          <div style={{ width: "100%" }}>
            <button
              style={{
                backgroundColor: "#f44336",
                border: "none",
                color: "white",
                padding: "10px 20px",
                textAlign: "center",
                display: "inline-block",
                fontSize: "16px",
                margin: "5px 0",
                cursor: "pointer",
                borderRadius: "4px",
                transition: "background-color 0.3s ease",
              }}
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div style={{ width: "100%" }}>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "normal", fontFamily: "-moz-initial" }}>
                Email:
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{
                    marginLeft: "28px",
                    padding: "2px",
                    borderRadius: "3px",
                    fontFamily: "sans-serif",
                    fontWeight: "normal",
                    border: "1px solid #ccc",
                    width: "275px",
                    height: "30px",
                  }}
                />
              </label>
            </div>
            <div style={{ marginBottom: "10px" }}>
              <label style={{ fontWeight: "normal", fontFamily: "-moz-initial" }}>
                Password:
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    marginLeft: "5px",
                    padding: "5px",
                    borderRadius: "3px",
                    fontFamily: "sans-serif",
                    fontWeight: "normal",
                    border: "1px solid #ccc",
                    width: "275px",
                    height: "30px",
                  }}
                />
              </label>
            </div>
            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  border: "none",
                  color: "white",
                  padding: "10px 20px",
                  fontSize: "16px",
                  margin: "5px 0",
                  cursor: "pointer",
                  borderRadius: "4px",
                  transition: "background-color 0.3s ease",
                }}
                onClick={handleFormLogin}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
