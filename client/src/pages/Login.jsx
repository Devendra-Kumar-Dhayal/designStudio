// Login.css
import "./css/login.css";
// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Googleauth from "./GoogleAuth";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotpassword] = useState("");
  const HandleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, forgotpassword }),
      });

      if (response.ok) {
        // Handle successful login
        console.log("Login successful!");
        navigate("/dashboard");
      } else {
        // Handle login failure
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };



  return (
    <div className="flex items-center justify-center ">
      <div
        style={{
          border: "2px solid #f0efed",
          borderRadius: "10px",
          padding: "10px",
          width: "350px",
          margin: "20px auto",
        }}
      >
        <h2 className="font-semibold">Sign In</h2>
        <form>
          <label>
            Username:<span style={{ color: "red" }}>*</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:<span style={{ color: "red" }}>*</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <label style={{ marginBottom: "3px" }}>
            <span style={{ fontSize: "16px", color: "#1d85b4" }}>
              Create an ADS account
            </span>
          </label>
          <button
            
            onClick={HandleLogin}
            className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
          >
            Sign In
          </button>
          <Googleauth />
          <label style={{ marginTop: "-5px" }}>
            <span style={{ fontSize: "14px", color: "#1d85b4" }}>
              Forgot your password?
            </span>
          </label>
        </form>
      </div>
    </div>
  );
};




export default Login;
