"use client";
import React, { useState } from "react";
import Sidebar from "../sidebar/sidebar";
import MinimizedSidebar from "../minimizedSidebar/minimizedSidebar";
import "./resetPassword.css";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

require("dotenv").config();
const server_url = process.env.SERVER_URL;

const ResetPassword = () => {
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === "old") {
      setShowOldPassword(!showOldPassword);
    } else if (field === "new") {
      setShowNewPassword(!showNewPassword);
    } else if (field === "confirm") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = localStorage.getItem("username");
    const accessToken = localStorage.getItem("token");

    console.log(username, "username", oldPassword, newPassword);
    // Assuming you have a function to send API requests like axios
    const response = await fetch(`${server_url}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        username,
        oldPassword,
        newPassword,
        confirmPassword,
      }),
    });
    const data = await response.json();

    if (response.ok) {
      toast.success("Password changed successfully", {
        position: "bottom-right", // or use 'toast.POSITION.BOTTOM_LEFT'
      });
    } else {
      toast.error(data.message, {
        position: "bottom-right", // or use 'toast.POSITION.BOTTOM_LEFT'
      });
    }
    console.log(data.message); // Display response message
  };

  return (
    <>
      <div
        style={{
          backgroundImage: "url(/img/clientBg.png)",
          backgroundPosition: "center",
          display: "flex",
        }}
      >
        <ToastContainer />
        <div
          onMouseEnter={() => setIsSidebarOpen(true)}
          onMouseLeave={() => setIsSidebarOpen(false)}
          style={{
            backgroundColor: "transparent",
            height: "100vh",
            width: "70px",
            zIndex: "1",
          }}
        >
          {isSidebarOpen ? <Sidebar /> : <MinimizedSidebar />}
        </div>
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div className="input-field">
                <input
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old Password"
                  required
                  value={oldPassword}
                  onChange={(e) => setoldPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("old")}
                >
                  {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
              <div className="input-field">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  required
                  value={newPassword}
                  onChange={(e) => setnewPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("new")}
                >
                  {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </span>
              </div>
              <div className="input-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setconfirmPassword(e.target.value)}
                />
                <span
                  className="toggle-password"
                  onClick={() => togglePasswordVisibility("confirm")}
                >
                  {showConfirmPassword ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </span>
              </div>
              <div className="btn-submit">
                <button type="submit">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
